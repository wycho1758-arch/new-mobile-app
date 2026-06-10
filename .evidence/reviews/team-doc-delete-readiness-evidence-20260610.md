# team-doc Delete-Readiness Evidence

Date: 2026-06-10
Scope: make `team-doc/00-source/` and `team-doc/10-structured/` delete-ready
by validating through root archive files.

## Checkpoint 1 Baseline

Baseline dirty-overlap evidence:

- `.evidence/reviews/team-doc-delete-readiness-dirty-overlap-baseline-20260610.md`
- `.evidence/reviews/team-doc-delete-readiness-dirty-overlap-baseline-20260610.patch`

Baseline validator results:

```text
pnpm run validate:repo-operations
Validated repo operations policy ownership.

pnpm run validate:team-doc
Validated current team-doc managed docs.

pnpm run validate:team-doc-archive
Validated team-doc archive/reference corpus: 71 source files, 32 structured files.
```

## Checkpoint 2 TDD Failure

Expected failures were introduced before implementation:

- `validate:repo-operations` failed on missing root archive files, missing
  `REPO_OPERATIONS.md` root archive terms, and legacy traversal terms still
  present in `scripts/validate-team-doc-archive.mjs`.
- `validate:team-doc` failed on missing root archive routing terms in
  `ref-organization` docs.

Reviewer(high) verdict: GO.

## Checkpoint 3 Root Archive Capture

Command:

```text
pnpm run generate:team-doc-archive
```

Output:

```text
Wrote TEAM_DOC_ARCHIVE_MANIFEST.json with 118 entries.
Wrote TEAM_DOC_ARCHIVE_BUNDLE.jsonl with 118 entries.
Captured 71 source markdown files and 32 structured markdown files.
```

Generated files:

- `TEAM_DOC_ARCHIVE_MANIFEST.json`
- `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`
- `scripts/create-team-doc-archive-manifest.mjs`

Reviewer(high) verdict: GO.

## Checkpoint 4 Root Archive Validator

Command:

```text
pnpm run validate:team-doc-archive
```

Output:

```text
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
```

Reviewer(high) verdict: GO.

## Checkpoint 5 Policy And Docs Routing

Commands:

```text
pnpm run validate:repo-operations
pnpm run validate:team-doc
pnpm run validate:team-doc-archive
```

Output:

```text
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
```

Initial Reviewer(high) verdict: NO-GO due to live
`find team-doc/10-structured` guidance in migration docs.

Remediation:

- Updated `validator-requirements.md` and `old-to-new-crosswalk.md` to define
  coverage through `TEAM_DOC_ARCHIVE_MANIFEST.json` and
  `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.
- Updated `scripts/validate-team-doc.mjs` to forbid that live find command in
  those docs.

Re-review verdict: GO.

## Checkpoint 6 Temp Workspace Delete-Safety Verification

Temp path:

```text
/tmp/team-doc-delete-readiness.eDv8WI
```

Copy command:

```text
rsync -a --exclude .git --exclude node_modules --exclude .turbo --exclude .expo --exclude .next --exclude .cache ./ /tmp/team-doc-delete-readiness.eDv8WI/
```

Delete and absence assertion, scoped to temp workspace:

```text
rm -rf team-doc/00-source team-doc/10-structured
test ! -e team-doc/00-source
test ! -e team-doc/10-structured
legacy directories absent in temp workspace
```

Temp validator commands and outputs:

```text
pnpm run validate:repo-operations
Validated repo operations policy ownership.

pnpm run validate:team-doc
Validated current team-doc managed docs.

pnpm run validate:team-doc-archive
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.

pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.
```

Reviewer(high) verdict: GO.

## Checkpoint 7 Real Workspace Final Verification

Commands:

```text
pnpm run validate:repo-operations
pnpm run validate:team-doc
pnpm run validate:team-doc-archive
pnpm run test:runtime
pnpm run test:local-harness
```

Outputs:

```text
pnpm run validate:repo-operations
Validated repo operations policy ownership.

pnpm run validate:team-doc
Validated current team-doc managed docs.

pnpm run validate:team-doc-archive
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.

pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.

pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
Test Suites: 2 passed, 2 total
Tests: 5 passed, 5 total
local harness all passed
```
