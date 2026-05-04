---
title: Migration Program Status
program: discourse-to-js-migration
status: in_progress
last_updated: 2026-05-04
owner: core-platform
---

# Migration Program Status

## Epic Checklist

- [x] `01-data-cutover-pipeline` - Build production-grade Discourse import/cutover tooling
- [ ] `02-routing-seo-compat` - Preserve legacy URLs and metadata behavior
- [ ] `03-core-forum-correctness` - Close correctness gaps in topics/messages/tags
- [ ] `04-scale-and-observability` - Remove scale bottlenecks and add migration observability

## Progress Notes

- Program initialized.
- Detailed tasks scaffolded under `tasks/epics/`.
- Execution entrypoint: `tasks/START.md`.
- `01-data-cutover-pipeline` complete: import pipeline, asset migration, reconciliation all done.
