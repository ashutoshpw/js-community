---
epic: 02-routing-seo-compat
task_slug: 01-legacy-topic-redirects
title: Legacy Discourse Topic Redirects
status: todo
priority: p0
owner: web-platform
estimate: 0.5-1 day
dependencies: []
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Legacy Discourse Topic Redirects

## Goal

Preserve inbound links from Discourse by redirecting old topic paths to new JS Community topic paths.

## Implementation Checklist

- [ ] Add `redirects()` in `js-community/next.config.ts`.
- [ ] Add rule:
  - `/t/:slug/:id` -> `/forum/t/:id/:slug` (permanent)
- [ ] Add compatibility rule for optional post suffix patterns if needed.
- [ ] Add route tests for redirect behavior.
- [ ] Document behavior in migration docs.

## Verification

- [ ] `cd js-community && bun run build`
- [ ] `curl -I http://localhost:3000/t/example/123` returns `301/308` to `/forum/t/123/example`
- [ ] Confirm canonical on destination topic uses new URL format.

## Done Criteria

- Redirects are active, tested, and documented.
- Status files updated and committed with task slug.
