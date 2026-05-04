---
epic: 03-core-forum-correctness
task_slug: 01-tag-persistence-on-topic-create
title: Persist Tags on Topic Creation
status: todo
priority: p1
owner: application-team
estimate: 1 day
dependencies: []
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Persist Tags on Topic Creation

## Goal

Complete topic creation flow by persisting submitted tags and linking them to topics.

## Implementation Checklist

- [ ] Update `POST /api/forum/topics` to consume submitted `tags`.
- [ ] Normalize and validate tag values (length, charset, dedupe).
- [ ] Upsert missing tags.
- [ ] Insert records in `topic_tags` relationship table.
- [ ] Return created topic with tag payload.
- [ ] Add tests for:
  - new tags
  - existing tags
  - duplicates and invalid tag input

## Verification

- [ ] `cd js-community && bun run test`
- [ ] Create topic with tags from UI and confirm they render on topic list/detail.
- [ ] Ensure malformed tags are rejected with clear error.

## Done Criteria

- Tags are end-to-end persisted and exposed.
- Status docs updated and committed with task slug.
