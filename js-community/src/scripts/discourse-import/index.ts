/**
 * Discourse Import Pipeline — CLI Entrypoint
 *
 * Usage:
 *   bun run import:discourse -- --input-dir=./exports [--stage=all] [--dry-run] [--resume] [--batch-size=500]
 *
 * Stages run in order: users → categories → topics → posts → tags → post_actions
 */

import type { StageName } from "./config";
import { parseConfig, STAGE_ORDER } from "./config";
import { runCategoriesStage } from "./stages/categories.stage";
import { runPostActionsStage } from "./stages/post-actions.stage";
import { runPostsStage } from "./stages/posts.stage";
import { runTagsStage } from "./stages/tags.stage";
import { runTopicsStage } from "./stages/topics.stage";
import { runUsersStage } from "./stages/users.stage";
import type { StageProgress } from "./state";
import { ImportState } from "./state";

const RUNNERS: Record<
  StageName,
  (c: ReturnType<typeof parseConfig>, s: ImportState) => Promise<StageProgress>
> = {
  users: runUsersStage,
  categories: runCategoriesStage,
  topics: runTopicsStage,
  posts: runPostsStage,
  tags: runTagsStage,
  post_actions: runPostActionsStage,
};

async function main() {
  let config: ReturnType<typeof parseConfig>;
  try {
    config = parseConfig();
  } catch (err) {
    process.stderr.write(`Error: ${String(err)}\n`);
    process.stderr.write(
      "Usage: bun run import:discourse -- --input-dir=<path> [--stage=<name|all>] [--dry-run] [--resume] [--batch-size=500]\n",
    );
    process.exit(1);
  }

  const state = new ImportState(config.stateDir);

  const stagesToRun: StageName[] =
    config.stage === "all" ? STAGE_ORDER : [config.stage];

  process.stdout.write(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "info",
      msg: "Discourse import started",
      inputDir: config.inputDir,
      stages: stagesToRun,
      dryRun: config.dryRun,
      resume: config.resume,
      batchSize: config.batchSize,
    }) + "\n",
  );

  const allProgress: Partial<Record<StageName, StageProgress>> = {};

  for (const stage of stagesToRun) {
    if (config.resume && state.isStageComplete(stage)) {
      process.stdout.write(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "info",
          msg: "Skipping already-completed stage",
          stage,
        }) + "\n",
      );
      continue;
    }

    const runner = RUNNERS[stage];
    const progress = await runner(config, state);
    allProgress[stage] = progress;
  }

  // Final summary
  process.stdout.write(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "complete",
      msg: "Import finished",
      summary: allProgress,
    }) + "\n",
  );
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${String(err)}\n`);
  process.exit(1);
});
