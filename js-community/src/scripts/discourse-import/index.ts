/**
 * Discourse Import Pipeline — CLI Entrypoint
 *
 * Usage:
 *   bun run import:discourse -- --input-dir=./exports [--stage=all] [--dry-run] [--resume] [--batch-size=500]
 *   bun run import:discourse -- --input-dir=./exports --assets   # run avatar/upload migration
 *
 * Stages run in order: users → categories → topics → posts → tags → post_actions
 * Asset migration (--assets) runs after data stages and requires BLOB_READ_WRITE_TOKEN + DISCOURSE_BASE_URL.
 */

import type { StageName } from "./config";
import { parseConfig, STAGE_ORDER } from "./config";
import { runAssetsStage } from "./stages/assets.stage";
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
  const argv = process.argv.slice(2);
  const runAssets = argv.includes("--assets");

  let config: ReturnType<typeof parseConfig>;
  try {
    config = parseConfig(argv.filter((a) => a !== "--assets"));
  } catch (err) {
    process.stderr.write(`Error: ${String(err)}\n`);
    process.stderr.write(
      "Usage: bun run import:discourse -- --input-dir=<path> [--stage=<name|all>] [--dry-run] [--resume] [--batch-size=500] [--assets]\n",
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
      assets: runAssets,
      dryRun: config.dryRun,
      resume: config.resume,
      batchSize: config.batchSize,
    }) + "\n",
  );

  const allProgress: Partial<Record<string, StageProgress>> = {};

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

  // Asset migration runs after data stages (needs IDs in DB)
  if (runAssets) {
    allProgress.assets = await runAssetsStage(config, state);
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
