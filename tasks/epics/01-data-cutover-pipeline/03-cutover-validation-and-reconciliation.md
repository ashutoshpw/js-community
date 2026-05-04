---
epic: 01-data-cutover-pipeline
task_slug: 03-cutover-validation-and-reconciliation
title: Cutover Validation and Reconciliation
status: done
priority: p0
owner: data-platform
estimate: 2-3 days
dependencies:
  - 01-build-import-pipeline
  - 02-avatar-and-upload-migration
last_updated: 2026-05-04
verification_evidence:
  - "19 unit tests pass (checkCountParity, checkSampledRow, checkRelationIntegrity, checkMissingAssets, buildReport, renderMarkdownReport)"
  - "bun run lint: 0 errors"
  - "bun run build: success"
  - "Verdict NO-GO enforced when critical findings present (exit code 1)"
---

# Task: Cutover Validation and Reconciliation

## Goal

Create deterministic parity checks between Discourse source data and JS Community target data before production cutover.

## Scope

- Entity count parity checks.
- Key field parity checks (users/topics/posts/categories).
- Orphan/foreign key integrity checks.
- Report generation for go/no-go decision.

## Implementation Checklist

- [x] Add `src/scripts/discourse-import/reconcile.ts`.
- [x] Add comparison modules:
  - counts
  - sampled row diffs
  - relation integrity
  - missing assets
- [x] Add severity model (`critical`, `warning`, `info`) for diffs.
- [x] Emit human-readable markdown report and machine JSON report.
- [x] Add `bun run import:discourse:reconcile` script.
- [ ] Update docs with cutover checklist and acceptance thresholds.

## Verification

### Automated

- [x] Tests for reconciliation diff logic.
- [x] `cd js-community && bun run lint && bun run test && bun run build`

### Manual

- [ ] Run reconciliation on local full import.
- [ ] Confirm report catches intentional injected mismatch.
- [ ] Confirm clean run produces zero critical findings.

## Done Criteria

- Reconciliation script exists and is part of cutover process.
- Report can be used for final migration signoff.
- Task and status files updated and committed.
