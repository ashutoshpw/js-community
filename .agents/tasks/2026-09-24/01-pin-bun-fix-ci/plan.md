# Pin Bun and Restore CI

**Date:** 2026-09-24
**Task:** 01-pin-bun-fix-ci

## Objective
Make the `main` CI workflow pass, use Bun 1.4.2 consistently in CI and project-local runtime configuration, update the Discourse submodule from its configured upstream, and leave `origin/main` with green checks.

## Context
The latest remote `main` Test Suite run failed in Biome before tests and build ran. The current local `main` is one unpushed commit ahead and its lint command passes, but the workflow and project runtime still need a deterministic Bun 1.4.2 pin. The user also requested updating the Discourse submodule and fixing CI on `origin/main`.

## Approach
Audit all Bun and CI references, centralize the Bun version in project-local configuration, update every Bun workflow to consume that exact version, verify the same lint, test, coverage, and build commands used by CI, then update the submodule from its configured upstream. After reviewing the complete diff, commit and push the current `main` branch and monitor GitHub Actions, fixing reproducible failures before completion.

## Steps
- [x] Audit workflows, package metadata, lockfiles, and Bun documentation.
- [x] Pin Bun 1.4.2 in project-local metadata and every CI workflow.
- [x] Run lint, tests, coverage, and build with Bun 1.4.2.
- [x] Inspect and update the Discourse submodule from its configured upstream.
- [x] Review the complete diff for unrelated changes.
- [x] Commit and push `main`, then monitor and repair CI failures.

## Acceptance criteria
- [x] Every Bun CI setup resolves Bun 1.4.2 from the project version file.
- [x] Project-local configuration declares Bun 1.4.2.
- [x] `bun run lint`, `bun run test`, `bun run test:coverage`, and `bun run build` pass.
- [x] The Discourse submodule matches its configured upstream branch.
- [x] `origin/main` contains the verified changes.
- [x] GitHub Actions checks on `origin/main` complete successfully.
- [x] Vercel's automatic commit status succeeds with the Bun commands.
- [x] No unrelated working-tree changes are introduced.
