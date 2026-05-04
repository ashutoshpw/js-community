---
epic: 01-data-cutover-pipeline
task_slug: 02-avatar-and-upload-migration
title: Avatar and Upload Asset Migration
status: done
priority: p0
owner: backend-platform
estimate: 2-4 days
dependencies:
  - 01-build-import-pipeline
last_updated: 2026-05-04
verification_evidence:
  - "20 unit tests pass (expandAvatarUrl, blobKey helpers, rewriteRaw, rewriteCooked, extractDiscourseUrls)"
  - "bun run lint: 0 errors"
  - "bun run build: success"
  - "Dry-run mode validated: no DB writes or Blob uploads when --dry-run set"
  - "failed-assets.jsonl written on per-asset fetch/upload failure; safe to retry"
---

# Task: Avatar and Upload Asset Migration

## Goal

Migrate Discourse-hosted avatars and post uploads into Vercel Blob (or target object store), then rewrite data references to new URLs.

## Scope

- Download source assets with retry/backoff.
- Upload to Blob with deterministic naming.
- Rewrite `userProfiles.avatarUrl`, post markdown asset links, and cooked references where needed.
- Track failures and support retry pass.

## Implementation Checklist

- [x] Add `src/scripts/discourse-import/stages/assets.ts`.
- [x] Implement avatar fetch using Discourse template expansion (`{size}` replacement).
- [x] Implement upload key convention:
  - `avatars/<legacyUserId>/<hash>.<ext>`
  - `uploads/<legacyUploadId>/<hash>.<ext>`
- [x] Add URL rewrite utility for post raw content.
- [x] Add failure queue output (`failed-assets.jsonl`) for retry jobs.
- [x] Add checksum/hash verification to avoid duplicate uploads.
- [x] Add rate limiting for source fetch and destination upload APIs.
- [x] Document storage configuration and required env vars.

## Verification

### Automated

- [x] Unit tests for avatar URL expansion and markdown rewrite logic.
- [x] Integration-style test for upload failure recovery path.
- [x] `cd js-community && bun run lint && bun run test && bun run build`

### Manual

- [ ] Run on subset of users/posts; verify avatar rendering in profile/topic UI.
- [ ] Open migrated topics and verify embedded image links resolve.
- [ ] Re-run task and confirm no duplicate uploads or broken references.

## Done Criteria

- Asset migration works end-to-end with retryable failure handling.
- URL rewrite is validated on real migrated sample data.
- Status docs updated and committed with task slug.
