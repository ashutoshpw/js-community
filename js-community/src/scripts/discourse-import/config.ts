/**
 * Discourse Import Pipeline — Configuration
 *
 * Reads CLI flags and environment variables to build a typed config object
 * used by all pipeline stages.
 */

export interface ImportConfig {
  /** Path to directory containing Discourse JSON export files */
  inputDir: string;
  /** Which stages to run; "all" runs the full sequence */
  stage: StageName | "all";
  /** If true, no DB writes are performed */
  dryRun: boolean;
  /** Resume from last saved checkpoint */
  resume: boolean;
  /** Number of rows to insert per DB transaction */
  batchSize: number;
  /** Directory to write checkpoint + ID-map files */
  stateDir: string;
}

export type StageName =
  | "users"
  | "categories"
  | "topics"
  | "posts"
  | "tags"
  | "post_actions";

export const STAGE_ORDER: StageName[] = [
  "users",
  "categories",
  "topics",
  "posts",
  "tags",
  "post_actions",
];

/** Parse process.argv into ImportConfig */
export function parseConfig(
  argv: string[] = process.argv.slice(2),
): ImportConfig {
  const get = (flag: string): string | undefined => {
    const entry = argv.find((a) => a.startsWith(`--${flag}=`));
    return entry?.split("=").slice(1).join("=");
  };
  const has = (flag: string): boolean => argv.includes(`--${flag}`);

  const inputDir = get("input-dir");
  if (!inputDir) {
    throw new Error("--input-dir=<path> is required");
  }

  const rawStage = get("stage") ?? "all";
  if (rawStage !== "all" && !(STAGE_ORDER as string[]).includes(rawStage)) {
    throw new Error(
      `--stage must be one of: all, ${STAGE_ORDER.join(", ")}. Got: ${rawStage}`,
    );
  }

  return {
    inputDir,
    stage: rawStage as StageName | "all",
    dryRun: has("dry-run"),
    resume: has("resume"),
    batchSize: Number(get("batch-size") ?? 500),
    stateDir: get("state-dir") ?? ".import-state",
  };
}
