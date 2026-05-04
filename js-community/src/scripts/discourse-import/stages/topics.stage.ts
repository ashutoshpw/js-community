/**
 * Discourse Import — Topics stage
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import type { ImportConfig } from "../config";
import type { DiscourseTopic } from "../mappers/topic.mapper";
import { mapTopic } from "../mappers/topic.mapper";
import type { ImportState, StageProgress } from "../state";
import { chunk, emptyProgress, makeLogger, printSummary } from "./base";

export async function runTopicsStage(
  config: ImportConfig,
  state: ImportState,
): Promise<StageProgress> {
  const log = makeLogger("topics");
  const progress = emptyProgress();

  const rawPath = join(config.inputDir, "topics.json");
  let rows: DiscourseTopic[];
  try {
    rows = JSON.parse(readFileSync(rawPath, "utf-8"));
  } catch (err) {
    log.error("Failed to read topics.json", { err: String(err) });
    return progress;
  }

  const startOffset = config.resume ? state.getOffset("topics") : 0;
  const pending = rows.slice(startOffset);
  log.info("Starting topics stage", {
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
        if (newUserId === undefined) {
          log.warn("No user mapping found — skipping topic", {
            discourseId: raw.id,
            discourseUserId: raw.user_id,
          });
          progress.skipped++;
          continue;
        }

        const newCategoryId = raw.category_id
          ? (state.getMapping("categories", raw.category_id) ?? null)
          : null;

        const mapped = mapTopic(raw, newUserId, newCategoryId, String(raw.id));

        if (config.dryRun) {
          log.info("dry-run: would upsert topic", { title: raw.title });
          progress.succeeded++;
          state.setMapping("topics", raw.id, raw.id);
          continue;
        }

        const [inserted] = await db
          .insert(schema.topics)
          .values(mapped)
          .onConflictDoUpdate({
            target: schema.topics.slug,
            set: {
              title: mapped.title,
              views: mapped.views,
              postsCount: mapped.postsCount,
              updatedAt: mapped.updatedAt,
            },
          })
          .returning({ id: schema.topics.id });

        state.setMapping("topics", raw.id, inserted.id);
        progress.succeeded++;
      } catch (err) {
        progress.failed++;
        log.error("Failed to import topic", {
          discourseId: raw.id,
          title: raw.title,
          err: String(err),
        });
      }
    }
    state.saveOffset("topics", startOffset + progress.processed);
  }

  printSummary("topics", progress);
  state.markStageComplete("topics", progress);
  return progress;
}
