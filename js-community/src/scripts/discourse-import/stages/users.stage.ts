/**
 * Discourse Import — Users stage
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import type { ImportConfig } from "../config";
import type { DiscourseUser } from "../mappers/user.mapper";
import { mapUser } from "../mappers/user.mapper";
import type { ImportState, StageProgress } from "../state";
import { chunk, emptyProgress, makeLogger, printSummary } from "./base";

export async function runUsersStage(
  config: ImportConfig,
  state: ImportState,
): Promise<StageProgress> {
  const log = makeLogger("users");
  const progress = emptyProgress();

  const rawPath = join(config.inputDir, "users.json");
  let rows: DiscourseUser[];
  try {
    rows = JSON.parse(readFileSync(rawPath, "utf-8"));
  } catch (err) {
    log.error("Failed to read users.json", { err: String(err) });
    return progress;
  }

  const startOffset = config.resume ? state.getOffset("users") : 0;
  const pending = rows.slice(startOffset);
  log.info("Starting users stage", {
    total: rows.length,
    startOffset,
    pending: pending.length,
    dryRun: config.dryRun,
  });

  for (const batch of chunk(pending, config.batchSize)) {
    for (const raw of batch) {
      progress.processed++;
      try {
        const { user, profile } = mapUser(raw);

        if (config.dryRun) {
          log.info("dry-run: would upsert user", { username: user.username });
          progress.succeeded++;
          state.setMapping("users", raw.id, raw.id); // placeholder
          continue;
        }

        // Upsert user
        const [inserted] = await db
          .insert(schema.users)
          .values(user)
          .onConflictDoUpdate({
            target: schema.users.email,
            set: {
              username: user.username,
              name: user.name,
              admin: user.admin,
              moderator: user.moderator,
              trustLevel: user.trustLevel,
              active: user.active,
              updatedAt: user.updatedAt,
            },
          })
          .returning({ id: schema.users.id });

        state.setMapping("users", raw.id, inserted.id);

        // Upsert profile
        const existingProfile = await db
          .select({ id: schema.userProfiles.id })
          .from(schema.userProfiles)
          .where(eq(schema.userProfiles.userId, inserted.id))
          .limit(1);

        if (existingProfile.length === 0) {
          await db
            .insert(schema.userProfiles)
            .values({ ...profile, userId: inserted.id });
        }

        progress.succeeded++;
      } catch (err) {
        progress.failed++;
        log.error("Failed to import user", {
          discourseId: raw.id,
          username: raw.username,
          err: String(err),
        });
      }
    }
    state.saveOffset("users", startOffset + progress.processed);
  }

  printSummary("users", progress);
  state.markStageComplete("users", progress);
  return progress;
}
