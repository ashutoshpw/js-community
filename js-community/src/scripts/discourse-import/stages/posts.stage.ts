/**
 * Discourse Import — Posts stage
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import type { ImportConfig } from "../config";
import type { DiscoursePost } from "../mappers/post.mapper";
import { mapPost } from "../mappers/post.mapper";
import type { ImportState, StageProgress } from "../state";
import { chunk, emptyProgress, makeLogger, printSummary } from "./base";

export async function runPostsStage(
  config: ImportConfig,
  state: ImportState,
): Promise<StageProgress> {
  const log = makeLogger("posts");
  const progress = emptyProgress();

  const rawPath = join(config.inputDir, "posts.json");
  let rows: DiscoursePost[];
  try {
    rows = JSON.parse(readFileSync(rawPath, "utf-8"));
  } catch (err) {
    log.error("Failed to read posts.json", { err: String(err) });
    return progress;
  }

  const startOffset = config.resume ? state.getOffset("posts") : 0;
  const pending = rows.slice(startOffset);
  log.info("Starting posts stage", {
    total: rows.length,
    startOffset,
    pending: pending.length,
    dryRun: config.dryRun,
  });

  for (const batch of chunk(pending, config.batchSize)) {
    for (const raw of batch) {
      progress.processed++;
      try {
        const newUserId = state.getMapping("users", raw.user_id);
        const newTopicId = state.getMapping("topics", raw.topic_id);

        if (newUserId === undefined || newTopicId === undefined) {
          log.warn("Missing user or topic mapping — skipping post", {
            discourseId: raw.id,
            discourseUserId: raw.user_id,
            discourseTopicId: raw.topic_id,
          });
          progress.skipped++;
          continue;
        }

        if (config.dryRun) {
          log.info("dry-run: would insert post", {
            topicId: raw.topic_id,
            postNumber: raw.post_number,
          });
          state.setMapping("posts", raw.id, raw.id);
          progress.succeeded++;
          continue;
        }

        // Check if already imported (idempotency)
        const [existing] = await db
          .select({ id: schema.posts.id })
          .from(schema.posts)
          .where(
            and(
              eq(schema.posts.topicId, newTopicId),
              eq(schema.posts.postNumber, raw.post_number),
            ),
          )
          .limit(1);

        if (existing) {
          state.setMapping("posts", raw.id, existing.id);
          progress.skipped++;
          continue;
        }

        const mapped = mapPost(raw, newUserId, newTopicId);
        const [inserted] = await db
          .insert(schema.posts)
          .values(mapped)
          .returning({ id: schema.posts.id });

        state.setMapping("posts", raw.id, inserted.id);
        progress.succeeded++;
      } catch (err) {
        progress.failed++;
        log.error("Failed to import post", {
          discourseId: raw.id,
          err: String(err),
        });
      }
    }
    state.saveOffset("posts", startOffset + progress.processed);
  }

  printSummary("posts", progress);
  state.markStageComplete("posts", progress);
  return progress;
}
