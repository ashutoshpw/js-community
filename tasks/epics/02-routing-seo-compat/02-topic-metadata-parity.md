---
epic: 02-routing-seo-compat
task_slug: 02-topic-metadata-parity
title: Topic Metadata Parity Between API and Page
status: todo
priority: p1
owner: web-platform
estimate: 1-2 days
dependencies:
  - 01-legacy-topic-redirects
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Topic Metadata Parity Between API and Page

## Goal

Align topic API payload with topic page metadata expectations (`firstPostExcerpt`, `tags`, and related fields).

## Implementation Checklist

- [ ] Extend `GET /api/forum/topics/[id]` response with:
  - `firstPostExcerpt`
  - topic tags array (if available in schema)
- [ ] Ensure metadata generation in topic page does not rely on missing fields.
- [ ] Add fallback logic for missing tag data.
- [ ] Add tests for topic API and metadata generation path.
- [ ] Ensure no extra heavy queries on page render.

## Verification

- [ ] `cd js-community && bun run test`
- [ ] Open topic page and verify `<title>` and description are populated from real data.
- [ ] Validate generated metadata for topics with and without tags.

## Done Criteria

- Metadata fields are consistent and verified.
- Task and status docs updated and committed.
