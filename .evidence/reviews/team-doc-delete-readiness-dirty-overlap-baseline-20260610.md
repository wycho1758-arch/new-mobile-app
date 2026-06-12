# team-doc Delete-Readiness Dirty-Overlap Baseline

Date: 2026-06-10
Checkpoint: 1
Purpose: preserve the state of already-dirty planned paths before implementation
edits continue.

## Overlapping Dirty Paths

These files are already modified in the working tree and are also listed as
expected affected paths in the delete-readiness plan:

- `REPO_OPERATIONS.md`
- `package.json`
- `scripts/validate-repo-operations.mjs`
- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- `team-doc/mobile-app-dev-team/README.md`

The implementation must work with these existing changes and must not revert
unrelated content.

## Baseline SHA-256

```text
baec90a8e96d44b8da1d6c38f799f3cbcdfab7bbf2baf4b856d50a6c3c5cf755  REPO_OPERATIONS.md
f958a421c2e0a6bcff955d94bfe268ec4cb54b770984175a787191f07525305f  package.json
994accaad79e196ed5edaba732f050948d37372568d04abb81deb2fbd96f529c  scripts/validate-repo-operations.mjs
79bc4dc816b94e51932bff94d8224b11b796073d5ef65110900374b8706cb577  scripts/validate-team-doc.mjs
6a124dc7c5a919e0bb2f83763cada5c3083cc281adfb558fb7a944da5bee2653  team-doc/mobile-app-dev-team/99-source-map.md
b3f4ebd0eb0a6fcf1625ea234cd906911e7dffe19abcbb68cd49512d0e06921d  team-doc/mobile-app-dev-team/README.md
1e1fc80e188393316bf8c8b1c7467fa55b0e85e85f823430f93448b19b14427b  docs/plans/active/20260610-team-doc-archive-delete-readiness-plan.md
```

## Baseline Diff Stat

```text
31	13	REPO_OPERATIONS.md
1	0	package.json
47	0	scripts/validate-repo-operations.mjs
517	163	scripts/validate-team-doc.mjs
12	3	team-doc/mobile-app-dev-team/99-source-map.md
4	0	team-doc/mobile-app-dev-team/README.md
```

## Full Baseline Patch

Saved at:

`.evidence/reviews/team-doc-delete-readiness-dirty-overlap-baseline-20260610.patch`

## Baseline Validator Results

```text
pnpm run validate:repo-operations
Validated repo operations policy ownership.

pnpm run validate:team-doc
Validated current team-doc managed docs.

pnpm run validate:team-doc-archive
Validated team-doc archive/reference corpus: 71 source files, 32 structured files.
```
