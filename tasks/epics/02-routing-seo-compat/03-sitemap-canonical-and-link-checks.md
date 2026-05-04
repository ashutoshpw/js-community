---
epic: 02-routing-seo-compat
task_slug: 03-sitemap-canonical-and-link-checks
title: Sitemap Canonical and Link Integrity Checks
status: todo
priority: p1
owner: seo-platform
estimate: 1 day
dependencies:
  - 01-legacy-topic-redirects
  - 02-topic-metadata-parity
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Sitemap Canonical and Link Integrity Checks

## Goal

Ensure migration does not degrade discoverability: sitemap entries, canonical tags, and old-to-new redirects must align.

## Implementation Checklist

- [ ] Audit `src/app/sitemap.ts` coverage for forum pages.
- [ ] Validate topic canonical path format consistency.
- [ ] Add link integrity script for sampled legacy links.
- [ ] Add check to flag redirect chains (>1 hop).
- [ ] Document SEO validation runbook.

## Verification

- [ ] Build and inspect sitemap output.
- [ ] Run sampled legacy URL check and confirm successful redirects.
- [ ] Verify no redirect loops/chains in sampled set.

## Done Criteria

- Link integrity and sitemap compatibility are validated.
- Status docs updated and committed with task slug.
