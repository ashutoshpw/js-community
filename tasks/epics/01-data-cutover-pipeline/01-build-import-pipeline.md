---
epic: 01-data-cutover-pipeline
task_slug: 01-build-import-pipeline
title: Build Resumable Discourse Import Pipeline
status: todo
priority: p0
owner: backend-platform
estimate: 3-5 days
dependencies: []
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Build Resumable Discourse Import Pipeline

## Goal

Implement production-ready import tooling in `js-community` to move Discourse data into JS Community with resumability, deterministic ID mapping, and safe re-runs.

## Scope

- Create Bun/TypeScript CLI pipeline under `js-community/src/scripts/`.
- Add import stages for users, categories, topics, posts, tags, relationships.
- Persist ID maps and progress state.
- Support dry-run mode and partial re-run.

## Implementation Checklist

- [ ] Add `src/scripts/discourse-import/` module structure:
  - `index.ts` (entrypoint)
  - `config.ts` (env + input paths)
  - `state.ts` (checkpoint persistence)
  - `mappers/*.ts` (entity transforms)
  - `stages/*.ts` (stage execution)
- [ ] Add CLI flags:
  - `--input-dir`
  - `--stage=<name|all>`
  - `--dry-run`
  - `--resume`
  - `--batch-size`
- [ ] Implement import order:
  1) users
  2) categories
  3) topics
  4) posts
  5) tags + topic_tags
  6) notifications/post_actions (if enabled)
- [ ] Create durable ID mapping tables/files for old->new IDs.
- [ ] Add conflict handling for unique keys (username/email/slug).
- [ ] Add metrics summary output per stage (processed/succeeded/failed/skipped).
- [ ] Add scripts in `js-community/package.json`:
  - `import:discourse`
  - `import:discourse:dry-run`
- [ ] Update migration docs with exact commands and rollback strategy.

## Implementation Notes

- Use Bun-first execution (`bun run ...`) for all new tooling.
- Keep all writes idempotent where possible.
- Keep stage transactions scoped per batch to avoid huge rollbacks.
- Use structured logs (JSON lines) for later reconciliation automation.

## Verification

### Automated

- [ ] `cd js-community && bun run lint`
- [ ] `cd js-community && bun run test`
- [ ] `cd js-community && bun run build`
- [ ] Add and run tests for:
  - mapping correctness
  - idempotent reruns
  - resume behavior after failure

### Manual

- [ ] Run dry-run on sample dataset and verify no DB writes.
- [ ] Run real import on local DB snapshot.
- [ ] Interrupt midway; rerun with `--resume`; confirm continued execution from checkpoint.
- [ ] Verify imported counts match source counts for each entity.

## Done Criteria

- Pipeline can reliably import Discourse exports with resume and re-run support.
- Verification passes and evidence is added.
- Task + epic/global status docs updated.
- Commit created with task slug in commit message.
