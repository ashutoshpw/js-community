/**
 * Discourse Import — Reconciliation CLI
 *
 * Reads the Discourse JSON export and compares entity counts + integrity
 * against the live JS Community database, then emits a markdown and JSON report.
 *
 * Usage:
 *   bun run import:discourse:reconcile -- --input-dir=./exports [--state-dir=.import-state] [--out-dir=./reconcile-reports]
 *
 * Required env vars:
 *   DATABASE_URL
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { count, isNull } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/lib/database";
import { ImportState } from "../state";
import type { ReconciliationFinding } from "./checks";
import {
  buildReport,
  checkCountParity,
  checkMissingAssets,
  checkRelationIntegrity,
  checkSampledRow,
  renderMarkdownReport,
} from "./checks";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function parseArgs(argv = process.argv.slice(2)) {
  const get = (flag: string) => {
    const entry = argv.find((a) => a.startsWith(`--${flag}=`));
    return entry?.split("=").slice(1).join("=");
  };
  const inputDir = get("input-dir");
  if (!inputDir) throw new Error("--input-dir=<path> is required");
  return {
    inputDir,
    stateDir: get("state-dir") ?? ".import-state",
    outDir: get("out-dir") ?? "./reconcile-reports",
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let cfg: ReturnType<typeof parseArgs>;
  try {
    cfg = parseArgs();
  } catch (err) {
    process.stderr.write(`Error: ${String(err)}\n`);
    process.exit(1);
  }

  const state = new ImportState(cfg.stateDir);
  const findings: ReconciliationFinding[] = [];

  // -------------------------------------------------------------------------
  // 1. Count parity
  // -------------------------------------------------------------------------
  type AnyTable = Parameters<typeof db.select>[0] extends undefined
    ? unknown
    : unknown;

  const entityFiles: Array<{
    name: string;
    file: string;
    // biome-ignore lint/suspicious/noExplicitAny: heterogeneous table types
    dbTable: any;
  }> = [
    { name: "users", file: "users.json", dbTable: schema.users },
    { name: "categories", file: "categories.json", dbTable: schema.categories },
    { name: "topics", file: "topics.json", dbTable: schema.topics },
    { name: "posts", file: "posts.json", dbTable: schema.posts },
    { name: "tags", file: "tags.json", dbTable: schema.tags },
  ];

  for (const entity of entityFiles) {
    const rows = readJson<unknown[]>(join(cfg.inputDir, entity.file));
    const sourceCount = rows?.length ?? 0;
    const [r] = await db.select({ c: count() }).from(entity.dbTable);
    const result = checkCountParity(entity.name, sourceCount, r.c);
    findings.push(result.finding);
  }

  // -------------------------------------------------------------------------
  // 2. Sampled row diff — spot-check first 5 users
  // -------------------------------------------------------------------------
  interface SourceUser {
    id: number;
    username: string;
    email: string;
  }
  const sourceUsers =
    readJson<SourceUser[]>(join(cfg.inputDir, "users.json")) ?? [];
  const allTargetUsers = await db
    .select({
      id: schema.users.id,
      username: schema.users.username,
      email: schema.users.email,
    })
    .from(schema.users);
  const targetUserMap = new Map(allTargetUsers.map((u) => [u.id, u]));

  for (const src of sourceUsers.slice(0, 5)) {
    const newId = state.getMapping("users", src.id);
    if (newId === undefined) {
      findings.push({
        severity: "critical",
        category: "sampled-row-diff",
        message: `User discourse_id=${src.id} (${src.username}) has no ID mapping — was it imported?`,
        details: { discourseId: src.id, username: src.username },
      });
      continue;
    }

    const targetRow = targetUserMap.get(newId) ?? null;
    const result = checkSampledRow(
      "user",
      src.id,
      { username: src.username, email: src.email },
      targetRow
        ? { username: targetRow.username, email: targetRow.email }
        : null,
      ["username", "email"],
    );
    findings.push(result.finding);
  }

  // -------------------------------------------------------------------------
  // 3. Relation integrity
  // -------------------------------------------------------------------------

  // Posts without a valid topic
  const allTopicIds = new Set(
    (await db.select({ id: schema.topics.id }).from(schema.topics)).map(
      (r) => r.id,
    ),
  );
  const allPosts = await db
    .select({ id: schema.posts.id, topicId: schema.posts.topicId })
    .from(schema.posts);
  const orphanPostIds = allPosts
    .filter((p) => !allTopicIds.has(p.topicId))
    .map((p) => p.id);
  findings.push(
    checkRelationIntegrity("posts.topicId → topics.id", orphanPostIds).finding,
  );

  // Topics with zero posts
  const allPostTopicIds = new Set(allPosts.map((p) => p.topicId));
  const allTopics = await db
    .select({ id: schema.topics.id })
    .from(schema.topics);
  const emptyTopicIds = allTopics
    .filter((t) => !allPostTopicIds.has(t.id))
    .map((t) => t.id);
  findings.push(
    checkRelationIntegrity("topics with zero posts", emptyTopicIds).finding,
  );

  // -------------------------------------------------------------------------
  // 4. Missing assets (avatar coverage)
  // -------------------------------------------------------------------------
  const [nullAvatarResult] = await db
    .select({ c: count() })
    .from(schema.userProfiles)
    .where(isNull(schema.userProfiles.avatarUrl));
  const [totalProfileResult] = await db
    .select({ c: count() })
    .from(schema.userProfiles);

  findings.push(
    checkMissingAssets(
      totalProfileResult.c,
      totalProfileResult.c - nullAvatarResult.c,
      nullAvatarResult.c,
    ).finding,
  );

  // -------------------------------------------------------------------------
  // 5. Build and emit report
  // -------------------------------------------------------------------------
  const report = buildReport(findings);
  const markdown = renderMarkdownReport(report);

  mkdirSync(cfg.outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const mdPath = join(cfg.outDir, `reconciliation-${ts}.md`);
  const jsonPath = join(cfg.outDir, `reconciliation-${ts}.json`);

  writeFileSync(mdPath, markdown);
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  process.stdout.write(`Report written:\n  ${mdPath}\n  ${jsonPath}\n`);
  process.stdout.write(
    `\nVerdict: ${report.summary.verdict}  (critical=${report.summary.critical} warning=${report.summary.warning} info=${report.summary.info})\n`,
  );

  if (report.summary.verdict === "NO-GO") process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${String(err)}\n`);
  process.exit(1);
});
