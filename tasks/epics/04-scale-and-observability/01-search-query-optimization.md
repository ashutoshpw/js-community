---
epic: 04-scale-and-observability
task_slug: 01-search-query-optimization
title: Optimize Search Query Path
status: todo
priority: p1
owner: platform-engineering
estimate: 2-3 days
dependencies: []
last_updated: 2026-05-04
verification_evidence: []
---

# Task: Optimize Search Query Path

## Goal

Improve search performance and correctness for migrated-scale data by removing N+1 queries and expensive in-memory merges.

## Implementation Checklist

- [ ] Replace per-topic first-post lookup with joined/subquery approach.
- [ ] Push ordering/pagination into SQL for combined result set.
- [ ] Add or validate indexes for search-critical columns.
- [ ] Add search benchmarks for baseline vs optimized path.
- [ ] Ensure response contract remains backward compatible.

## Verification

- [ ] `cd js-community && bun run test`
- [ ] Benchmark representative search dataset and capture latency delta.
- [ ] Confirm pagination and `hasMore` behavior remain correct.

## Done Criteria

- N+1 removed and measured performance improvement documented.
- Status docs updated and committed with task slug.
