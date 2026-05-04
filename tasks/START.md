---
title: Migration Execution Start Guide
owner: core-platform
status: active
last_updated: 2026-05-04
program: discourse-to-js-migration
source_of_truth:
  - tasks/STATUS.md
  - tasks/epics/*/STATUS.md
execution_model: task-driven
commit_policy:
  required: true
  message_must_include_slug: true
  precommit_hooks_mandatory: true
---

# START: Discourse to JS Migration Execution

This document defines how to execute, verify, and track all migration work items.

## 1) Working Contract

1. Always start from [tasks/STATUS.md](/Users/ashutosh/Dev/ashutoshpw/js-community/tasks/STATUS.md).
2. Pick the next unchecked epic, then the next unchecked task in that epic.
3. Implement only one task at a time unless explicitly parallelized and safe.
4. Run required validation steps listed in that task file.
5. Update the task file and epic/global STATUS files immediately after verification passes.
6. Commit immediately after task completion.
7. Never bypass or ignore pre-commit hooks.

## 2) Task Lifecycle

For each `tasks/epics/XX-<epic-slug>/XX-<task-slug>.md`:

1. Move frontmatter `status` from `todo` -> `in_progress`.
2. Complete implementation subtasks in order.
3. Execute verification checklist and capture evidence.
4. Update frontmatter to `done`.
5. Mark the task checkbox in `epics/XX-<epic-slug>/STATUS.md`.
6. If all tasks in an epic are complete, mark epic complete in `tasks/STATUS.md`.
7. Commit with a slug-specific message.

## 3) Commit Rules

Commit after each completed task.

Commit message format:

- Task commit:
  - `feat(<task-slug>): <short description>`
  - Example: `feat(01-data-cutover-pipeline/01-build-import-pipeline): add resumable discourse import CLI`
- Epic-level docs/status commit:
  - `docs(<epic-slug>): update status after task completion`
  - Example: `docs(02-routing-seo-compat): mark legacy topic redirects complete`

All commits must:
- Include the epic slug or task slug.
- Pass pre-commit hooks.
- Include updated task and status docs where applicable.

## 4) Verification Discipline

Every task has a `Verification` section. Do not mark complete unless:

- Required tests/linters/build succeed.
- Manual checks in the task file pass.
- Any migration/data scripts are dry-run validated where specified.

Capture outcomes in the task document under `verification_evidence`.

## 5) Sequence Recommendation

Execute epics in this order unless blocked:

1. `01-data-cutover-pipeline`
2. `02-routing-seo-compat`
3. `03-core-forum-correctness`
4. `04-scale-and-observability`

## 6) Status File Responsibilities

- `tasks/STATUS.md`: high-level epic checklist and progress.
- `tasks/epics/*/STATUS.md`: task-level checklist per epic.
- Individual task file: detailed implementation and verification record.

If any of the three is stale, the task is not considered complete.
