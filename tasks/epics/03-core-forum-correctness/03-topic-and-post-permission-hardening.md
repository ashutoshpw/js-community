---
epic: 03-core-forum-correctness
task_slug: 03-topic-and-post-permission-hardening
title: Topic and Post Permission Hardening
status: todo
priority: p1
owner: security-platform
estimate: 1-2 days
dependencies: []
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Topic and Post Permission Hardening

## Goal

Harden topic/post mutation routes to enforce expected ownership, role, and trust-level constraints consistently.

## Implementation Checklist

- [ ] Audit topic/post PATCH/DELETE routes for permission consistency.
- [ ] Centralize permission checks in shared helper(s).
- [ ] Enforce role-based constraints for admin/moderation actions.
- [ ] Add explicit test matrix for:
  - owner
  - non-owner
  - moderator
  - admin
  - anonymous
- [ ] Add audit log events for destructive moderation actions (if supported).

## Verification

- [ ] `cd js-community && bun run test`
- [ ] Attempt forbidden operations with non-privileged user; verify 403.
- [ ] Validate allowed operations for owner/admin/moderator.

## Done Criteria

- Mutation routes enforce policy without inconsistencies.
- Status docs updated and committed with task slug.
