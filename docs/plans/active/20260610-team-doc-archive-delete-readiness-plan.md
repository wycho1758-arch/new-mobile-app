# team-doc Archive Delete-Readiness Plan

Date: 2026-06-10
Status: implementation in progress with Reviewer(high) checkpoint gates
Owner: Codex runtime/docs operations

## Goal

Make `team-doc/00-source/` and `team-doc/10-structured/` delete-ready from a
Source of Truth perspective without weakening validation.

The intended end state is:

- Current team/runtime validation does not depend on either legacy directory.
- Archive/reference validation reads root-owned archive files and policy files,
  not the legacy directory tree as the validation source.
- Historical Confluence/source metadata and the archived file contents needed
  for audit are preserved in root-owned archive files before the legacy
  directories are removed.
- Deletion safety is proven with a non-destructive temp-workspace check before
  any physical deletion is considered done.

## SoT Inputs Used

| SoT | Decision Grounded |
| --- | --- |
| `AGENTS.md` | Root runtime gates, no direct push to main, TDD, required runtime/local harness validation. |
| `REPO_OPERATIONS.md` | Root file is the canonical repo-wide operating policy; validators enforce policy but are not policy owners. |
| `team-doc/mobile-app-dev-team/00-sot-and-principles.md` | Current managed team docs are `team-doc/mobile-app-dev-team/`; `00-source` is historical source evidence and `10-structured` is lower-priority reference material. |
| `scripts/validate-repo-operations.mjs` | Current validator still asserts archive validation terms and package script composition. |
| `scripts/validate-team-doc.mjs` | Current managed-doc validator already avoids active validation traversal of `00-source` and `10-structured`. |
| `scripts/validate-team-doc-archive.mjs` | Archive validator currently still walks `00-source`, `10-structured`, and `_meta`; this is the coupling to remove. |
| `package.json` | Runtime gate composition must keep archive validation explicit, not hidden inside `test:runtime`. |

## Current Finding

`team-doc/00-source/` and `team-doc/10-structured/` are not acceptable current
SoT owners for repo operations. They are historical/export/reference material.
However, they are not delete-ready yet because
`scripts/validate-team-doc-archive.mjs` still treats the directories themselves
as the archive validation input.

The fix is not to remove validation. The fix is to move the archive validation
source to root-owned files, then validate those root files with the same or
stronger invariants than the current directory-based validator.

Reviewer(xhigh) rejected the first draft because a manifest-only capture would
not preserve the actual archive content and would weaken existing validation.
This revision addresses that by adding a root-owned content bundle and by
requiring validator parity with the current archive checks.

## Proposed Root SoT Additions

1. Add `TEAM_DOC_ARCHIVE_MANIFEST.json` at repository root.
   - Machine-readable root manifest for the historical corpus.
   - Contains captured metadata for `team-doc/00-source/`,
     `team-doc/10-structured/`, and `team-doc/_meta/`.
   - Minimum fields:
     - `schemaVersion`
     - `createdAt`
     - `sourceRoots`
     - per-file `path`, `sha256`, `bytes`
     - source frontmatter summary for source files: `pageId`, `sourceTitle`,
       `sourceVersion`, `sourceUrl`, `fetchedAt`
     - structured frontmatter summary for structured files: `docType`,
       `sourcePageId`, `sourceTitle`, `sourceVersion`, `sourceHeading`
     - aggregate counts by root and document type
     - `archiveSourcePathStrategy` with original path, archived bundle path,
       and restore instructions
     - deletion-readiness status and evidence paths
2. Add `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` at repository root.
   - Root-owned line-delimited JSON content bundle for the historical corpus.
   - Each line stores one text file from the archived corpus with:
     - `path`
     - `sha256`
     - `bytes`
     - `encoding`
     - `content`
   - The corpus is currently small enough for a root text bundle:
     - `team-doc/00-source/`: about 788 KB
     - `team-doc/10-structured/`: about 184 KB
     - `team-doc/_meta/`: about 88 KB
   - This file is the durable content archive/sourcePath strategy. The manifest
     points to it; validators read it; deletion of the legacy directories does
     not remove the historical source/export evidence.
3. Extend `REPO_OPERATIONS.md`.
   - Define `TEAM_DOC_ARCHIVE_MANIFEST.json` as the root-owned archive metadata
     SoT after capture.
   - Define `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` as the root-owned archived content
     SoT after capture.
   - Define deletion-safe criteria for `team-doc/00-source/` and
     `team-doc/10-structured/`.
   - State that validators must not use the legacy directories as current
     validation input after the manifest is captured.

## Implementation Plan

### Checkpoint 1: Pre-implementation guardrails

- Confirm dirty worktree and isolate this change set from unrelated existing
  edits.
- For already-dirty files that overlap the planned affected paths, record a
  per-file baseline hash, diff stat, and full baseline patch before editing
  those files. This is required because implementation will touch files that
  already contain prior worktree changes.
- Record baseline status with:
  - `git status --short`
  - `shasum -a 256 <overlapping planned paths>`
  - `git diff --numstat -- <overlapping planned paths>`
  - full baseline patch under `.evidence/reviews/`
  - `pnpm run validate:repo-operations`
  - `pnpm run validate:team-doc`
  - `pnpm run validate:team-doc-archive`
- Reviewer gate: Reviewer(high) checks this plan before implementation starts.

### Checkpoint 2: Tests/validator expectations first

- Update the narrowest validator assertions before behavior changes.
- `scripts/validate-repo-operations.mjs` should require:
  - root `TEAM_DOC_ARCHIVE_MANIFEST.json`
  - root `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`
  - `REPO_OPERATIONS.md` terms for root archive manifest ownership
  - `REPO_OPERATIONS.md` terms for root content bundle ownership and restore
    strategy
  - `scripts/validate-team-doc-archive.mjs` terms proving it reads the root
    manifest instead of using `listFiles('00-source'...)` or
    `listFiles('10-structured'...)`
- `scripts/validate-team-doc.mjs` should continue forbidding active traversal of
  `00-source` and `10-structured`, and should update managed-doc assertions so
  historical legacy paths are valid only when routed through
  `TEAM_DOC_ARCHIVE_MANIFEST.json` or `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.
- Expected first result: the new assertions fail until the manifest and archive
  validator refactor are implemented.

### Checkpoint 3: Capture root archive manifest

- Add a bounded generator, `scripts/create-team-doc-archive-manifest.mjs`, or
  equivalent one-time script, to read current legacy directories and write both:
  - `TEAM_DOC_ARCHIVE_MANIFEST.json`
  - `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`
- The generator is allowed to read `team-doc/00-source/`, `team-doc/10-structured/`,
  and `team-doc/_meta/` only for capture.
- The root manifest and root bundle become the durable validation inputs after
  capture.
- The generator must verify that each bundle entry hash matches the source file
  at capture time and that every manifest entry has a corresponding bundle entry.
- Commit/review evidence must include aggregate counts and any metadata quality
  caveats, such as unknown source versions.

### Checkpoint 4: Refactor archive validation to root files

- Rewrite `scripts/validate-team-doc-archive.mjs` so its validation input is
  `TEAM_DOC_ARCHIVE_MANIFEST.json`, `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`, and root
  policy requirements.
- It must validate:
  - manifest JSON schema shape
  - bundle JSONL schema shape
  - every manifest file entry has a matching bundle entry
  - bundle content sha256 and byte counts match manifest values
  - aggregate counts are nonzero and internally consistent
  - the archived `_meta/confluence-page-map.json` and `_meta/split-map.json`
    parse from the bundle and retain the current page/split-map consistency
    checks
  - source files from the bundle retain required frontmatter keys:
    `pageId`, `sourceTitle`, `sourceVersion`, `sourceUrl`, `fetchedAt`
  - structured files from the bundle retain required frontmatter keys:
    `docType`, `sourcePageId`, `sourceTitle`, `sourceVersion`, `sourceHeading`
  - structured `docType` values stay inside the existing allowed set
  - archived content receives the same probable-secret scan as today
  - archived structured content receives the same obsolete-content checks as
    today, including Sentry/default-template wording, obsolete testID sets, and
    obsolete generated skill slugs
  - current crosswalk coverage is checked against the manifest/bundle list of
    legacy structured files, not against a live `team-doc/10-structured/` tree
  - deletion-readiness status points to evidence paths
- It must not require the physical presence of:
  - `team-doc/00-source/`
  - `team-doc/10-structured/`

### Checkpoint 5: Update current documentation references

- Update `REPO_OPERATIONS.md` to make root ownership explicit.
- Update `team-doc/mobile-app-dev-team/00-sot-and-principles.md` so the priority
  list no longer presents `team-doc/10-structured/` or `team-doc/00-source/`
  as live fallback SoT. Instead, point historical audit to
  `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.
- Update `team-doc/mobile-app-dev-team/99-source-map.md` so historical rows
  point through the root manifest rather than requiring direct legacy directory
  presence.
- Update `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/*`
  only where current validator assertions imply live dependency on
  `team-doc/00-source/` or `team-doc/10-structured/`. Historical path
  identifiers may remain, but the document must state that the source is the
  root archive files.
- Update `scripts/validate-team-doc.mjs` term requirements around
  `ref-organization` docs so they assert root archive routing rather than live
  legacy directory dependency.
- Update `team-doc/mobile-app-dev-team/README.md` only if it still describes the
  legacy directories as active managed documentation.

### Checkpoint 6: Delete-safety verification without deleting in-place

- Use a non-destructive temp workspace check with a full working-tree copy:
  - create a temporary directory under `/tmp`
  - copy the current working tree with the full implementation diff, including
    untracked root archive files and scripts
  - exclude only `.git`, `node_modules`, and generated dependency/cache folders
  - remove `team-doc/00-source/` and `team-doc/10-structured/` only inside the
    temporary workspace
  - assert with `test ! -e team-doc/00-source` and
    `test ! -e team-doc/10-structured`
  - run the applicable validators there
- Required temp-workspace checks:
  - `pnpm run validate:repo-operations`
  - `pnpm run validate:team-doc`
  - `pnpm run validate:team-doc-archive`
  - `pnpm run test:runtime`
- This proves delete readiness without changing the working copy destructively.
- Evidence must record:
  - temp path
  - copy command
  - delete commands scoped to temp path
  - absence assertions
  - each validator command and exit code

### Checkpoint 7: Final implementation verification

- Run in the real workspace:
  - `pnpm run validate:repo-operations`
  - `pnpm run validate:team-doc`
  - `pnpm run validate:team-doc-archive`
  - `pnpm run test:runtime`
  - `pnpm run test:local-harness`
- Record command outputs and exit status in:
  - `.evidence/reviews/team-doc-delete-readiness-evidence-20260610.md`
- Reviewer gate: Reviewer(high) reviews final diff, evidence, and temp-workspace
  delete-safety result before completion is reported as done.

## Physical Deletion Gate

This plan makes the directories delete-ready. Physical deletion of
`team-doc/00-source/` and `team-doc/10-structured/` should happen only after:

1. `TEAM_DOC_ARCHIVE_MANIFEST.json` exists and validates.
2. `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` exists, validates, and preserves content.
3. Archive validation no longer depends on those directories.
4. Temp-workspace deletion check passes.
5. Reviewer(high) returns GO for the completed implementation.
6. The user explicitly confirms physical deletion, unless the implementation
   request explicitly includes deletion in that same approved execution scope.

## Expected Affected Paths

- `REPO_OPERATIONS.md`
- `TEAM_DOC_ARCHIVE_MANIFEST.json`
- `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`
- `package.json`
- `scripts/create-team-doc-archive-manifest.mjs`
- `scripts/validate-repo-operations.mjs`
- `scripts/validate-team-doc.mjs`
- `scripts/validate-team-doc-archive.mjs`
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- `team-doc/mobile-app-dev-team/README.md`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/source-priority.md`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/historical-vs-active.md`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/validator-requirements.md`
- `.evidence/reviews/team-doc-delete-readiness-evidence-20260610.md`
- `.evidence/reviews/team-doc-delete-readiness-final-review-high-20260610.md`

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Historical metadata or content is lost when directories are deleted. | Capture per-file metadata in root `TEAM_DOC_ARCHIVE_MANIFEST.json` and full text content in root `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` before deletion. |
| Validation weakens by dropping archive checks. | Keep `validate:team-doc-archive`, but change its input to the root manifest and bundle while preserving current invariant coverage. |
| Current docs still imply legacy dirs are live SoT. | Update current managed docs to route historical references through the root manifest. |
| Dirty worktree mixes unrelated prior changes. | Report baseline `git status --short`; only edit listed paths; do not revert unrelated user changes. |
| Temp verification misses untracked implementation artifacts. | Use a full working-tree copy that includes untracked root archive files and scripts; record copy/delete/absence commands. |
| Delete-readiness is claimed without proof. | Run temp-workspace deletion simulation and record evidence. |

## Reviewer Questions

- Is the root manifest plus root content bundle approach sufficient to replace
  direct script coupling to `team-doc/00-source/` and `team-doc/10-structured/`?
- Is `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` acceptable as the durable content archive,
  given the current corpus is about 1 MB?
- Is the physical deletion gate strict enough for source/export evidence?
