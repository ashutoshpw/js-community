---
epic: 03-core-forum-correctness
task_slug: 02-message-counter-and-unread-fixes
title: Fix Message Counters and Unread Logic
status: todo
priority: p0
owner: application-team
estimate: 1-2 days
dependencies: []
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Fix Message Counters and Unread Logic

## Goal

Correct message thread counters and unread calculations to avoid user-visible inaccuracies.

## Implementation Checklist

- [ ] Fix message count increments when posting in existing conversations.
- [ ] Replace current unread logic with message-level comparison against `lastReadAt`.
- [ ] Ensure read state updates happen when conversation is opened/read.
- [ ] Add query/index optimization for unread count lookups.
- [ ] Add tests covering:
  - new message increments
  - unread count before/after read
  - 1:1 and group threads

## Verification

- [ ] `cd js-community && bun run test`
- [ ] Manual run: send multiple messages across two accounts and validate counts.
- [ ] Reload and verify persistence of unread/read transitions.

## Done Criteria

- Counters and unread values are accurate in API + UI.
- Status docs updated and committed with task slug.
