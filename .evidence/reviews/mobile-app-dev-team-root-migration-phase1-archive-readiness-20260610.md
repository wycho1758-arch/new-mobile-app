# mobile-app-dev-team Root Migration Phase 1 Archive Readiness

Date: 2026-06-10
Scope: Phase 1 archive readiness prerequisite for `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`

## Phase 0 Entry Gate

Phase 0 Reviewer(high) returned GO with a Low note about one unrelated untracked
evidence file. Phase 1 began with a fresh `git status --short` check.

## Current Status At Phase 1 Start

`git status --short`:

```text
 M .agents/skills/wm/SKILL.md
 M PROJECT_ENVIRONMENT.md
 M docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md
 M evals/skills/wm/positive.prompt.md
 M scripts/validate-runtime-artifacts.mjs
 M team-doc/mobile-app-dev-team/05-work-processes.md
 M team-doc/mobile-app-dev-team/06-gates-and-evidence.md
 M team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-confluence-scope-xhigh-20260610.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-phase0-baseline-20260610.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-plan-high-review-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-rereview-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.json
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-rereview-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-20260610.md
?? .evidence/reviews/wm-subagent-routing-final-review-20260610.md
?? docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md
?? docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md
?? evals/skills/wm/write-executor-negative.prompt.md
```

## Archive Files

```text
manifest_exists_exit=0
bundle_exists_exit=0
```

`wc -l TEAM_DOC_ARCHIVE_MANIFEST.json TEAM_DOC_ARCHIVE_BUNDLE.jsonl`:

```text
1794 TEAM_DOC_ARCHIVE_MANIFEST.json
118 TEAM_DOC_ARCHIVE_BUNDLE.jsonl
1912 total
```

## Live Legacy Directory State

`find team-doc -maxdepth 2 -type d | sort`:

```text
team-doc
team-doc/_meta
team-doc/mobile-app-dev-team
team-doc/mobile-app-dev-team/02-role-souls
team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills
team-doc/mobile-app-dev-team/ref-organization
```

Interpretation:

- `team-doc/00-source` is already absent in the live working tree.
- `team-doc/10-structured` is already absent in the live working tree.
- `team-doc/_meta` remains live but is expected to be archive-preserved.

## Archive Validator

`node scripts/validate-team-doc-archive.mjs; echo "archive_exit=$?"`:

```text
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
archive_exit=0
```

## Validator Input Inspection

Relevant search:

```text
scripts/validate-team-doc-archive.mjs:12:const manifestFile = 'TEAM_DOC_ARCHIVE_MANIFEST.json';
scripts/validate-team-doc-archive.mjs:13:const bundleFile = 'TEAM_DOC_ARCHIVE_BUNDLE.jsonl';
scripts/validate-team-doc-archive.mjs:62:function readArchiveManifest() {
scripts/validate-team-doc-archive.mjs:71:function readArchiveBundle() {
scripts/validate-team-doc-archive.mjs:122:const manifest = readArchiveManifest();
scripts/validate-team-doc-archive.mjs:123:const bundleEntries = readArchiveBundle();
```

Notes:

- `scripts/validate-team-doc-archive.mjs` still declares `docRoot` and helper
  functions for current crosswalk lookup, but archive source, bundle content,
  source markdown, structured markdown, and `_meta` validation are read from root
  archive files.
- `scripts/create-team-doc-archive-manifest.mjs` is a live-tree capture tool and
  reads `team-doc/00-source`, `team-doc/10-structured`, and `team-doc/_meta`.
- `scripts/generate-team-doc.mjs` writes and recreates `team-doc`.

## Temp Workspace Absence Check

Temp workspace:

```text
/tmp/wm-root-migration-phase1.ILBWVT
```

Commands performed inside temp workspace:

```text
test ! -e team-doc/00-source
test ! -e team-doc/10-structured
test -d team-doc/_meta
rm -rf team-doc/00-source team-doc/10-structured team-doc/_meta
test ! -e team-doc/00-source
test ! -e team-doc/10-structured
test ! -e team-doc/_meta
node scripts/validate-team-doc-archive.mjs
```

Output:

```text
TMPDIR=/tmp/wm-root-migration-phase1.ILBWVT
no_00_source_before_exit=0
no_10_structured_before_exit=0
meta_exists_before_exit=0
no_00_source_after_exit=0
no_10_structured_after_exit=0
no_meta_after_exit=0
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
archive_exit=0
```

## Tooling Decision: Reviewer(xhigh) GO

Reviewer(xhigh) returned GO for Phase 1 decision scope with no Critical, High,
or Medium findings.

Decision:

- `scripts/create-team-doc-archive-manifest.mjs` must be retired from active
  tooling after final capture, or moved to archived tooling with a
  pre-deletion-only guard. `package.json` `generate:team-doc-archive` must be
  removed from active workflow or demoted before physical deletion.
- `scripts/generate-team-doc.mjs` must be retired from active tooling or moved
  to archived tooling with an explicit legacy-only guard. Do not rewrite it to
  emit `mobile-app-dev-team/` without a separate SoT-approved migration.

Source-backed rationale:

- `scripts/create-team-doc-archive-manifest.mjs` reads live `team-doc` inputs
  and rewrites root archive files, so it is a pre-deletion capture tool rather
  than an active post-deletion gate.
- `scripts/generate-team-doc.mjs` removes and recreates `team-doc`, so leaving
  it active after deletion can silently reintroduce the directory.
- `scripts/validate-team-doc-archive.mjs` validates root archive files and
  passed without live `team-doc/00-source`, `team-doc/10-structured`, or
  `team-doc/_meta` in the temp workspace.
- `REPO_OPERATIONS.md` treats root archive files as the historical archive SoT
  and identifies `generate-team-doc.mjs` as legacy/migration tooling.

Residual risks:

- This GO applies only to Phase 1 archive-readiness decision, not to physical
  deletion of `team-doc/`.
- Implementation must still remove or rehome active script/package references
  before Phase 5/Phase 8 deletion.
- If archived tooling is retained, validators should ensure it is not reachable
  through active runtime gates or package scripts.
