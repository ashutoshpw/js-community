/**
 * Discourse Import — Asset migration stage (avatars + uploads)
 *
 * For each user and post:
 *  1. Download the source asset from the Discourse instance.
 *  2. Compute a SHA-256 hash for deduplication.
 *  3. Upload to Vercel Blob under a deterministic key.
 *  4. Rewrite references in userProfiles.avatarUrl and posts.raw/cooked.
 *  5. Write any failures to <stateDir>/failed-assets.jsonl for later retry.
 *
 * Rate limiting: configurable concurrency with a simple semaphore (default 5
 * concurrent fetches) and per-request retry with exponential backoff.
 *
 * Required env vars:
 *   BLOB_READ_WRITE_TOKEN  — Vercel Blob token
 *   DISCOURSE_BASE_URL     — e.g. https://community.example.com (no trailing slash)
 */

import { createHash } from "node:crypto";
import {
  appendFileSync,
  createWriteStream,
  existsSync,
  readFileSync,
} from "node:fs";
import { extname, join } from "node:path";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import {
  avatarBlobKey,
  expandAvatarUrl,
  extractDiscourseUrls,
  rewriteCooked,
  rewriteRaw,
  type UrlMap,
  uploadBlobKey,
} from "../assets/url-rewrite";
import type { ImportConfig } from "../config";
import type { ImportState, StageProgress } from "../state";
import { emptyProgress, makeLogger, printSummary } from "./base";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DiscourseUserExport {
  id: number;
  username: string;
  avatar_template?: string | null;
}

interface DiscourseUploadExport {
  id: number;
  url: string;
  original_filename?: string;
}

interface FailedAsset {
  type: "avatar" | "upload";
  discourseId: number;
  url: string;
  reason: string;
  ts: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DISCOURSE_BASE = (process.env.DISCOURSE_BASE_URL ?? "").replace(
  /\/$/,
  "",
);
const CONCURRENCY = 5;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

/** Simple async semaphore for concurrency limiting */
class Semaphore {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(private limit: number) {}

  async acquire(): Promise<void> {
    if (this.running < this.limit) {
      this.running++;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
    this.running++;
  }

  release(): void {
    this.running--;
    const next = this.queue.shift();
    if (next) next();
  }
}

async function fetchWithRetry(url: string): Promise<Buffer> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_BASE_MS * 2 ** attempt));
      }
    }
  }
  throw lastErr;
}

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

function appendFailure(failurePath: string, entry: FailedAsset): void {
  appendFileSync(failurePath, JSON.stringify(entry) + "\n");
}

// ---------------------------------------------------------------------------
// Stage
// ---------------------------------------------------------------------------

export async function runAssetsStage(
  config: ImportConfig,
  state: ImportState,
): Promise<StageProgress> {
  const log = makeLogger("assets");
  const progress = emptyProgress();
  const failurePath = join(config.stateDir, "failed-assets.jsonl");
  const sem = new Semaphore(CONCURRENCY);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    log.warn(
      "BLOB_READ_WRITE_TOKEN not set — asset uploads will be skipped. Set the env var to enable.",
    );
  }

  if (!DISCOURSE_BASE) {
    log.warn(
      "DISCOURSE_BASE_URL not set — cannot build absolute fetch URLs. Skipping assets stage.",
    );
    return progress;
  }

  // -----------------------------------------------------------------------
  // 1. Avatars
  // -----------------------------------------------------------------------
  const usersPath = join(config.inputDir, "users.json");
  if (existsSync(usersPath)) {
    const userRows: DiscourseUserExport[] = JSON.parse(
      readFileSync(usersPath, "utf-8"),
    );
    log.info("Processing avatars", { total: userRows.length });

    const avatarTasks = userRows
      .filter((u) => u.avatar_template)
      .map((u) => async () => {
        await sem.acquire();
        try {
          progress.processed++;
          const newUserId = state.getMapping("users", u.id);
          if (newUserId === undefined) {
            progress.skipped++;
            return;
          }

          const fullUrl =
            DISCOURSE_BASE + expandAvatarUrl(u.avatar_template!, 240);

          if (config.dryRun) {
            log.info("dry-run: would fetch+upload avatar", {
              username: u.username,
              url: fullUrl,
            });
            progress.succeeded++;
            return;
          }

          const buf = await fetchWithRetry(fullUrl);
          const hash = sha256(buf);
          const ext = extname(fullUrl.split("?")[0]) || ".jpg";
          const blobKey = avatarBlobKey(u.id, hash, ext);

          const { url: blobUrl } = await put(blobKey, buf, {
            access: "public",
            addRandomSuffix: false,
          });

          // Update userProfiles.avatarUrl
          await db
            .update(schema.userProfiles)
            .set({ avatarUrl: blobUrl, updatedAt: new Date() })
            .where(eq(schema.userProfiles.userId, newUserId));

          progress.succeeded++;
        } catch (err) {
          progress.failed++;
          appendFailure(failurePath, {
            type: "avatar",
            discourseId: u.id,
            url: DISCOURSE_BASE + expandAvatarUrl(u.avatar_template ?? "", 240),
            reason: String(err),
            ts: new Date().toISOString(),
          });
          log.error("Avatar migration failed", {
            discourseUserId: u.id,
            err: String(err),
          });
        } finally {
          sem.release();
        }
      });

    await Promise.all(avatarTasks.map((t) => t()));
  }

  // -----------------------------------------------------------------------
  // 2. Uploads (inline post images/files)
  // -----------------------------------------------------------------------
  const uploadsPath = join(config.inputDir, "uploads.json");
  if (existsSync(uploadsPath)) {
    const uploadRows: DiscourseUploadExport[] = JSON.parse(
      readFileSync(uploadsPath, "utf-8"),
    );
    log.info("Processing uploads", { total: uploadRows.length });

    // Build url→blobUrl map; we'll use it for post rewriting
    const uploadUrlMap: UrlMap = new Map();

    const uploadTasks = uploadRows.map((u) => async () => {
      await sem.acquire();
      try {
        progress.processed++;
        const fullUrl = u.url.startsWith("http")
          ? u.url
          : DISCOURSE_BASE + u.url;

        if (config.dryRun) {
          log.info("dry-run: would upload asset", { url: fullUrl });
          progress.succeeded++;
          return;
        }

        const buf = await fetchWithRetry(fullUrl);
        const hash = sha256(buf);
        const ext =
          extname((u.original_filename ?? u.url).split("?")[0]) || ".bin";
        const blobKey = uploadBlobKey(u.id, hash, ext);

        const { url: blobUrl } = await put(blobKey, buf, {
          access: "public",
          addRandomSuffix: false,
        });

        uploadUrlMap.set(u.url, blobUrl);
        progress.succeeded++;
      } catch (err) {
        progress.failed++;
        appendFailure(failurePath, {
          type: "upload",
          discourseId: u.id,
          url: u.url,
          reason: String(err),
          ts: new Date().toISOString(),
        });
        log.error("Upload migration failed", {
          discourseUploadId: u.id,
          err: String(err),
        });
      } finally {
        sem.release();
      }
    });

    await Promise.all(uploadTasks.map((t) => t()));

    // -----------------------------------------------------------------------
    // 3. Rewrite post raw/cooked content
    // -----------------------------------------------------------------------
    if (!config.dryRun && uploadUrlMap.size > 0) {
      log.info("Rewriting post content", { urlMapSize: uploadUrlMap.size });

      // Fetch all posts that contain any upload URL
      const allPosts = await db
        .select({
          id: schema.posts.id,
          raw: schema.posts.raw,
          cooked: schema.posts.cooked,
        })
        .from(schema.posts);

      let rewritten = 0;
      for (const post of allPosts) {
        const urls = extractDiscourseUrls(post.raw);
        const hasMatch = urls.some((u) => uploadUrlMap.has(u));
        if (!hasMatch) continue;

        const newRaw = rewriteRaw(post.raw, uploadUrlMap);
        const newCooked = rewriteCooked(post.cooked, uploadUrlMap);
        await db
          .update(schema.posts)
          .set({ raw: newRaw, cooked: newCooked, updatedAt: new Date() })
          .where(eq(schema.posts.id, post.id));
        rewritten++;
      }
      log.info("Post content rewrite complete", { rewritten });
    }
  }

  printSummary("assets", progress);
  return progress;
}
