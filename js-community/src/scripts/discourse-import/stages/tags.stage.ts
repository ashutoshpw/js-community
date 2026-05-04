/**
 * Discourse Import — Tags stage
 *
 * Imports tags, then topic_tag associations.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import type { ImportConfig } from "../config";
import type { DiscourseTag, DiscourseTopicTag } from "../mappers/tag.mapper";
import { mapTag, mapTopicTag } from "../mappers/tag.mapper";
import type { ImportState, StageProgress } from "../state";
import { chunk, emptyProgress, makeLogger, printSummary } from "./base";

export async function runTagsStage(
  config: ImportConfig,
  state: ImportState,
): Promise<StageProgress> {
  const log = makeLogger("tags");
  const progress = emptyProgress();

  // --- 1. Tags ---
  const tagsPath = join(config.inputDir, "tags.json");
  if (!existsSync(tagsPath)) {
    log.warn("tags.json not found — skipping tags stage");
    state.markStageComplete("tags", progress);
    return progress;
  }

  const tagRows: DiscourseTag[] = JSON.parse(readFileSync(tagsPath, "utf-8"));
  log.info("Importing tags", { total: tagRows.length, dryRun: config.dryRun });

  for (const raw of tagRows) {
    progress.processed++;
    try {
      if (config.dryRun) {
        log.info("dry-run: would upsert tag", { name: raw.name });
        state.setMapping("tags", raw.id, raw.id);
        progress.succeeded++;
        continue;
      }

      const [inserted] = await db
        .insert(schema.tags)
        .values(mapTag(raw))
        .onConflictDoUpdate({
          target: schema.tags.name,
          set: { topicCount: raw.topic_count ?? 0, updatedAt: new Date() },
        })
        .returning({ id: schema.tags.id });

      state.setMapping("tags", raw.id, inserted.id);
      progress.succeeded++;
    } catch (err) {
      progress.failed++;
      log.error("Failed to import tag", {
        discourseId: raw.id,
        name: raw.name,
        err: String(err),
      });
    }
  }

  // --- 2. Topic-tag associations ---
  const topicTagsPath = join(config.inputDir, "topic_tags.json");
  if (existsSync(topicTagsPath)) {
    const topicTagRows: DiscourseTopicTag[] = JSON.parse(
      readFileSync(topicTagsPath, "utf-8"),
    );
    log.info("Importing topic_tags", { total: topicTagRows.length });

    for (const batch of chunk(topicTagRows, config.batchSize)) {
      for (const raw of batch) {
        try {
          const newTopicId = state.getMapping("topics", raw.topic_id);
          const newTagId = state.getMapping("tags", raw.tag_id);
          if (newTopicId === undefined || newTagId === undefined) continue;

          if (config.dryRun) continue;

          const [existing] = await db
            .select({ id: schema.topicTags.id })
            .from(schema.topicTags)
            .where(
              and(
                eq(schema.topicTags.topicId, newTopicId),
                eq(schema.topicTags.tagId, newTagId),
              ),
            )
            .limit(1);

          if (!existing) {
            await db
              .insert(schema.topicTags)
              .values(mapTopicTag(newTopicId, newTagId));
          }
        } catch (err) {
          log.error("Failed to import topic_tag", {
            raw: JSON.stringify(raw),
            err: String(err),
          });
        }
      }
    }
  }

  printSummary("tags", progress);
  state.markStageComplete("tags", progress);
  return progress;
}
