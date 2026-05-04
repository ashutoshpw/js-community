/**
 * Discourse Import — Categories stage
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import type { ImportConfig } from "../config";
import type { DiscourseCategory } from "../mappers/category.mapper";
import { mapCategory } from "../mappers/category.mapper";
import type { ImportState, StageProgress } from "../state";
import { emptyProgress, makeLogger, printSummary } from "./base";

export async function runCategoriesStage(
  config: ImportConfig,
  state: ImportState,
): Promise<StageProgress> {
  const log = makeLogger("categories");
  const progress = emptyProgress();

  const rawPath = join(config.inputDir, "categories.json");
  let rows: DiscourseCategory[];
  try {
    rows = JSON.parse(readFileSync(rawPath, "utf-8"));
  } catch (err) {
    log.error("Failed to read categories.json", { err: String(err) });
    return progress;
  }

  // Sort: parents before children
  const sorted = [...rows].sort((a, b) => {
    if (!a.parent_category_id && b.parent_category_id) return -1;
    if (a.parent_category_id && !b.parent_category_id) return 1;
    return 0;
  });

  log.info("Starting categories stage", {
    total: sorted.length,
    dryRun: config.dryRun,
  });

  for (const raw of sorted) {
    progress.processed++;

    if (config.resume && state.getMapping("categories", raw.id) !== undefined) {
      progress.skipped++;
      continue;
    }

    try {
      const parentNewId = raw.parent_category_id
        ? (state.getMapping("categories", raw.parent_category_id) ?? null)
        : null;

      const mapped = mapCategory(raw, parentNewId);

      if (config.dryRun) {
        log.info("dry-run: would upsert category", { name: raw.name });
        progress.succeeded++;
        state.setMapping("categories", raw.id, raw.id);
        continue;
      }

      const [inserted] = await db
        .insert(schema.categories)
        .values(mapped)
        .onConflictDoUpdate({
          target: schema.categories.slug,
          set: {
            name: mapped.name,
            description: mapped.description,
            position: mapped.position,
            updatedAt: mapped.updatedAt,
          },
        })
        .returning({ id: schema.categories.id });

      state.setMapping("categories", raw.id, inserted.id);
      progress.succeeded++;
    } catch (err) {
      progress.failed++;
      log.error("Failed to import category", {
        discourseId: raw.id,
        name: raw.name,
        err: String(err),
      });
    }
  }

  printSummary("categories", progress);
  state.markStageComplete("categories", progress);
  return progress;
}
