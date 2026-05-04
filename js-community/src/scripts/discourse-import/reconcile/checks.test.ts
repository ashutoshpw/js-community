/**
 * Tests for reconciliation check logic
 */

import { describe, expect, it } from "vitest";
import {
  buildReport,
  checkCountParity,
  checkMissingAssets,
  checkRelationIntegrity,
  checkSampledRow,
  renderMarkdownReport,
} from "./checks";

// ---------------------------------------------------------------------------
// checkCountParity
// ---------------------------------------------------------------------------

describe("checkCountParity", () => {
  it("returns info when counts match", () => {
    const result = checkCountParity("users", 100, 100);
    expect(result.finding.severity).toBe("info");
    expect(result.delta).toBe(0);
  });

  it("returns warning for small delta (<5%)", () => {
    const result = checkCountParity("users", 100, 97);
    expect(result.finding.severity).toBe("warning");
  });

  it("returns critical for large delta (>=5%)", () => {
    const result = checkCountParity("users", 100, 90);
    expect(result.finding.severity).toBe("critical");
  });

  it("returns critical when target is 0 but source is non-zero", () => {
    const result = checkCountParity("topics", 500, 0);
    expect(result.finding.severity).toBe("critical");
  });

  it("returns info when both are 0", () => {
    const result = checkCountParity("tags", 0, 0);
    expect(result.finding.severity).toBe("info");
  });

  it("calculates delta correctly", () => {
    const result = checkCountParity("posts", 200, 195);
    expect(result.delta).toBe(-5);
    expect(result.deltaPercent).toBeCloseTo(2.5);
  });
});

// ---------------------------------------------------------------------------
// checkSampledRow
// ---------------------------------------------------------------------------

describe("checkSampledRow", () => {
  it("returns info when all fields match", () => {
    const result = checkSampledRow(
      "user",
      1,
      { username: "alice", email: "alice@example.com" },
      { username: "alice", email: "alice@example.com" },
      ["username", "email"],
    );
    expect(result.finding.severity).toBe("info");
    expect(result.fields.every((f) => f.match)).toBe(true);
  });

  it("returns warning when a field differs", () => {
    const result = checkSampledRow(
      "user",
      1,
      { username: "alice", email: "alice@example.com" },
      { username: "alice2", email: "alice@example.com" },
      ["username", "email"],
    );
    expect(result.finding.severity).toBe("warning");
    const usernameDiff = result.fields.find((f) => f.field === "username");
    expect(usernameDiff?.match).toBe(false);
  });

  it("returns critical when target row is null (not imported)", () => {
    const result = checkSampledRow("user", 99, { username: "bob" }, null, [
      "username",
    ]);
    expect(result.finding.severity).toBe("critical");
    expect(result.finding.message).toContain("not found in target");
  });
});

// ---------------------------------------------------------------------------
// checkRelationIntegrity
// ---------------------------------------------------------------------------

describe("checkRelationIntegrity", () => {
  it("returns info for zero orphans", () => {
    const result = checkRelationIntegrity("posts → topics", []);
    expect(result.finding.severity).toBe("info");
    expect(result.orphanCount).toBe(0);
  });

  it("returns warning for a small number of orphans", () => {
    const result = checkRelationIntegrity("posts → topics", [1, 2, 3]);
    expect(result.finding.severity).toBe("warning");
  });

  it("returns critical for more than 10 orphans", () => {
    const ids = Array.from({ length: 11 }, (_, i) => i + 1);
    const result = checkRelationIntegrity("posts → topics", ids);
    expect(result.finding.severity).toBe("critical");
  });
});

// ---------------------------------------------------------------------------
// checkMissingAssets
// ---------------------------------------------------------------------------

describe("checkMissingAssets", () => {
  it("returns info when all assets migrated", () => {
    const result = checkMissingAssets(100, 100, 0);
    expect(result.finding.severity).toBe("info");
  });

  it("returns warning for small missing percentage", () => {
    const result = checkMissingAssets(100, 97, 3);
    expect(result.finding.severity).toBe("warning");
  });

  it("returns critical for large missing percentage", () => {
    const result = checkMissingAssets(100, 80, 20);
    expect(result.finding.severity).toBe("critical");
  });
});

// ---------------------------------------------------------------------------
// buildReport + renderMarkdownReport
// ---------------------------------------------------------------------------

describe("buildReport", () => {
  it("produces GO verdict with no criticals", () => {
    const report = buildReport([
      { severity: "info", category: "count-parity", message: "ok" },
      { severity: "warning", category: "count-parity", message: "small diff" },
    ]);
    expect(report.summary.verdict).toBe("GO");
    expect(report.summary.critical).toBe(0);
    expect(report.summary.warning).toBe(1);
  });

  it("produces NO-GO verdict when criticals exist", () => {
    const report = buildReport([
      {
        severity: "critical",
        category: "count-parity",
        message: "users missing",
      },
    ]);
    expect(report.summary.verdict).toBe("NO-GO");
    expect(report.summary.critical).toBe(1);
  });
});

describe("renderMarkdownReport", () => {
  it("includes verdict in output", () => {
    const report = buildReport([
      { severity: "info", category: "test", message: "all good" },
    ]);
    const md = renderMarkdownReport(report);
    expect(md).toContain("GO");
    expect(md).toContain("# Discourse Migration Reconciliation Report");
  });

  it("includes finding messages", () => {
    const report = buildReport([
      {
        severity: "critical",
        category: "count-parity",
        message: "users: missing",
      },
    ]);
    const md = renderMarkdownReport(report);
    expect(md).toContain("users: missing");
    expect(md).toContain("NO-GO");
  });
});
