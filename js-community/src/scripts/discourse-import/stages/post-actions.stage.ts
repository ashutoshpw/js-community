/**
 * Discourse Import — Post actions stage (likes, flags, bookmarks)
 *
 * This stage is optional — it only runs when post_actions.json is present.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import type { ImportConfig } from "../config";
import type { ImportState, StageProgress } from "../state";
import { chunk, emptyProgress, makeLogger, printSummary } from "./base";

interface DiscoursePostAction {
  id: number;
  post_id: number;
  user_id: number;
  post_action_type_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export async function runPostActionsStage(
  config: ImportConfig,
  state: ImportState,
): Promise<StageProgress> {
  const log = makeLogger("post_actions");
  const progress = emptyProgress();

  const rawPath = join(config.inputDir, "post_actions.json");
  if (!existsSync(rawPath)) {
    log.warn("post_actions.json not found — skipping post_actions stage");
    state.markStageComplete("post_actions", progress);
    return progress;
  }

  let rows: DiscoursePostAction[];
  try {
    rows = JSON.parse(readFileSync(rawPath, "utf-8"));
  } catch (err) {
    log.error("Failed to read post_actions.json", { err: String(err) });
    return progress;
  }

  const startOffset = config.resume ? state.getOffset("post_actions") : 0;
  const pending = rows.slice(startOffset);
  log.info("Starting post_actions stage", {
    total: rows.length,
    startOffset,
    pending: pending.length,
    dryRun: config.dryRun,
  });

  for (const batch of chunk(pending, config.batchSize)) {
    for (const raw of batch) {
      progress.processed++;
      try {
        const newPostId = state.getMapping("posts", raw.post_id);
        const newUserId = state.getMapping("users", raw.user_id);

        if (newPostId === undefined || newUserId === undefined) {
          progress.skipped++;
          continue;
        }

        if (config.dryRun) {
          progress.succeeded++;
          continue;
        }

        const now = new Date();
        await db
          .insert(schema.postActions)
          .values({
            postId: newPostId,
            userId: newUserId,
            postActionTypeId: raw.post_action_type_id,
            deletedAt: raw.deleted_at ? new Date(raw.deleted_at) : null,
            staffTookAction: false,
            createdAt: raw.created_at ? new Date(raw.created_at) : now,
            updatedAt: raw.updated_at ? new Date(raw.updated_at) : now,
          })
          .onConflictDoNothing();

        progress.succeeded++;
      } catch (err) {
        progress.failed++;
        log.error("Failed to import post_action", {
          discourseId: raw.id,
          err: String(err),
        });
      }
    }
    state.saveOffset("post_actions", startOffset + progress.processed);
  }

  printSummary("post_actions", progress);
  state.markStageComplete("post_actions", progress);
  return progress;
}
