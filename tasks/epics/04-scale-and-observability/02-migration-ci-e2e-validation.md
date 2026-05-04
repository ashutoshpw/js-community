---
epic: 04-scale-and-observability
task_slug: 02-migration-ci-e2e-validation
title: Migration CI End-to-End Validation
status: todo
priority: p1
owner: platform-engineering
estimate: 1-2 days
dependencies: []
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Migration CI End-to-End Validation

## Goal

Strengthen CI so migration SQL is actually applied and verified on ephemeral Postgres instead of only static checks.

## Implementation Checklist

- [ ] Enable currently commented migration test job in `.github/workflows/migrations.yml`.
- [ ] Provision ephemeral Postgres service and run `db:migrate`.
- [ ] Add post-migration sanity checks (required tables/columns/indexes).
- [ ] Fail PR on migration apply errors.
- [ ] Keep runtime within acceptable CI duration budget.

## Verification

- [ ] Trigger workflow on test PR branch.
- [ ] Validate success path on clean migration set.
- [ ] Validate failure path by injecting known-bad migration in test branch.

## Done Criteria

- CI blocks invalid migration chains before merge.
- Status docs updated and committed with task slug.
