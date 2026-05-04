/**
 * Discourse Import — Reconciliation checks
 *
 * Pure functions that compare source (Discourse JSON export) entity counts and
 * key fields against target (JS Community DB) state.
 *
 * Each check returns a ReconciliationFinding with:
 *   - severity: "critical" | "warning" | "info"
 *   - category: the check group
 *   - message: human-readable description
 *   - details: optional structured data
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Severity = "critical" | "warning" | "info";

export interface ReconciliationFinding {
  severity: Severity;
  category: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface CountPairResult {
  entity: string;
  sourceCount: number;
  targetCount: number;
  delta: number;
  deltaPercent: number;
  finding: ReconciliationFinding;
}

// Threshold: >5% delta is critical, 1–5% is warning
const CRITICAL_DELTA_PERCENT = 5;
const WARNING_DELTA_PERCENT = 1;

// ---------------------------------------------------------------------------
// Count parity check
// ---------------------------------------------------------------------------

export function checkCountParity(
  entity: string,
  sourceCount: number,
  targetCount: number,
): CountPairResult {
  const delta = targetCount - sourceCount;
  const deltaPercent =
    sourceCount > 0 ? Math.abs(delta / sourceCount) * 100 : 0;

  let severity: Severity;
  if (
    deltaPercent >= CRITICAL_DELTA_PERCENT ||
    (sourceCount > 0 && targetCount === 0)
  ) {
    severity = "critical";
  } else if (deltaPercent >= WARNING_DELTA_PERCENT) {
    severity = "warning";
  } else {
    severity = "info";
  }

  const finding: ReconciliationFinding = {
    severity,
    category: "count-parity",
    message:
      delta === 0
        ? `${entity}: counts match (${sourceCount})`
        : `${entity}: source=${sourceCount} target=${targetCount} delta=${delta} (${deltaPercent.toFixed(1)}%)`,
    details: { entity, sourceCount, targetCount, delta, deltaPercent },
  };

  return { entity, sourceCount, targetCount, delta, deltaPercent, finding };
}

// ---------------------------------------------------------------------------
// Sampled row diff
// ---------------------------------------------------------------------------

export interface SampledField {
  field: string;
  sourceValue: unknown;
  targetValue: unknown;
  match: boolean;
}

export interface SampledRowResult {
  entityType: string;
  discourseId: number;
  fields: SampledField[];
  finding: ReconciliationFinding;
}

export function checkSampledRow(
  entityType: string,
  discourseId: number,
  sourceRow: Record<string, unknown>,
  targetRow: Record<string, unknown> | null,
  fieldsToCheck: string[],
): SampledRowResult {
  if (targetRow === null) {
    return {
      entityType,
      discourseId,
      fields: [],
      finding: {
        severity: "critical",
        category: "sampled-row-diff",
        message: `${entityType} discourse_id=${discourseId} not found in target`,
        details: { discourseId },
      },
    };
  }

  const fields: SampledField[] = fieldsToCheck.map((field) => ({
    field,
    sourceValue: sourceRow[field],
    targetValue: targetRow[field],
    match: String(sourceRow[field]) === String(targetRow[field]),
  }));

  const mismatches = fields.filter((f) => !f.match);
  const severity: Severity = mismatches.length > 0 ? "warning" : "info";

  return {
    entityType,
    discourseId,
    fields,
    finding: {
      severity,
      category: "sampled-row-diff",
      message:
        mismatches.length === 0
          ? `${entityType} discourse_id=${discourseId}: all sampled fields match`
          : `${entityType} discourse_id=${discourseId}: ${mismatches.length} field(s) differ`,
      details: {
        discourseId,
        mismatches: mismatches.map((f) => ({
          field: f.field,
          source: f.sourceValue,
          target: f.targetValue,
        })),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Relation integrity check
// ---------------------------------------------------------------------------

export interface RelationIntegrityResult {
  relation: string;
  orphanCount: number;
  finding: ReconciliationFinding;
}

export function checkRelationIntegrity(
  relation: string,
  orphanIds: number[],
): RelationIntegrityResult {
  const orphanCount = orphanIds.length;
  const severity: Severity =
    orphanCount > 0 ? (orphanCount > 10 ? "critical" : "warning") : "info";

  return {
    relation,
    orphanCount,
    finding: {
      severity,
      category: "relation-integrity",
      message:
        orphanCount === 0
          ? `${relation}: no orphans found`
          : `${relation}: ${orphanCount} orphaned record(s) detected`,
      details: { relation, orphanCount, sample: orphanIds.slice(0, 10) },
    },
  };
}

// ---------------------------------------------------------------------------
// Missing assets check
// ---------------------------------------------------------------------------

export interface MissingAssetResult {
  totalAssets: number;
  migratedAssets: number;
  failedAssets: number;
  finding: ReconciliationFinding;
}

export function checkMissingAssets(
  totalAssets: number,
  migratedAssets: number,
  failedAssets: number,
): MissingAssetResult {
  const missingPercent =
    totalAssets > 0 ? ((totalAssets - migratedAssets) / totalAssets) * 100 : 0;

  const severity: Severity =
    missingPercent >= CRITICAL_DELTA_PERCENT
      ? "critical"
      : missingPercent >= WARNING_DELTA_PERCENT
        ? "warning"
        : "info";

  return {
    totalAssets,
    migratedAssets,
    failedAssets,
    finding: {
      severity,
      category: "missing-assets",
      message: `Assets: ${migratedAssets}/${totalAssets} migrated, ${failedAssets} failed (${missingPercent.toFixed(1)}% missing)`,
      details: { totalAssets, migratedAssets, failedAssets, missingPercent },
    },
  };
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

export interface ReconciliationReport {
  generatedAt: string;
  summary: {
    critical: number;
    warning: number;
    info: number;
    verdict: "GO" | "NO-GO";
  };
  findings: ReconciliationFinding[];
}

export function buildReport(
  findings: ReconciliationFinding[],
): ReconciliationReport {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const warning = findings.filter((f) => f.severity === "warning").length;
  const info = findings.filter((f) => f.severity === "info").length;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      critical,
      warning,
      info,
      verdict: critical === 0 ? "GO" : "NO-GO",
    },
    findings,
  };
}

export function renderMarkdownReport(report: ReconciliationReport): string {
  const { summary, findings, generatedAt } = report;
  const verdictIcon = summary.verdict === "GO" ? "✅" : "❌";
  const lines: string[] = [
    "# Discourse Migration Reconciliation Report",
    "",
    `Generated: ${generatedAt}`,
    "",
    `## Verdict: ${verdictIcon} ${summary.verdict}`,
    "",
    "| Severity | Count |",
    "|----------|-------|",
    `| 🔴 Critical | ${summary.critical} |`,
    `| 🟡 Warning  | ${summary.warning} |`,
    `| 🟢 Info     | ${summary.info} |`,
    "",
    "## Findings",
    "",
  ];

  const icon: Record<Severity, string> = {
    critical: "🔴",
    warning: "🟡",
    info: "🟢",
  };

  for (const f of findings) {
    lines.push(`- ${icon[f.severity]} **[${f.category}]** ${f.message}`);
  }

  return lines.join("\n");
}
