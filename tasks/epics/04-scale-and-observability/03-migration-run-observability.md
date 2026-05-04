---
epic: 04-scale-and-observability
task_slug: 03-migration-run-observability
title: Migration Run Observability and Reporting
status: todo
priority: p2
owner: platform-engineering
estimate: 1-2 days
dependencies:
  - 01-build-import-pipeline
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Migration Run Observability and Reporting

## Goal

Add run-level observability for migration operations so failures are diagnosable and progress is traceable.

## Implementation Checklist

- [ ] Emit structured stage logs with run ID.
- [ ] Track per-stage timings, throughput, failure counts.
- [ ] Write machine-readable run artifact (`migration-run-report.json`).
- [ ] Add markdown summary artifact for human review.
- [ ] Define alert conditions for critical failures.

## Verification

- [ ] Run import and confirm artifacts are generated.
- [ ] Verify failures appear with actionable context.
- [ ] Confirm report includes stage durations and totals.

## Done Criteria

- Migration runs are observable and auditable.
- Status docs updated and committed with task slug.
