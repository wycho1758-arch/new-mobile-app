# team-doc Physical Deletion Evidence

Date: 2026-06-10
Scope: physical deletion of `team-doc/00-source/` and
`team-doc/10-structured/` after root archive capture and delete-readiness
review.

## Pre-delete State

```text
exists: team-doc/00-source
exists: team-doc/10-structured
TEAM_DOC_ARCHIVE_MANIFEST.json deletionReadiness.status:
captured-not-yet-delete-ready
```

Root archive retained:

```text
TEAM_DOC_ARCHIVE_MANIFEST.json totals.files: 118
TEAM_DOC_ARCHIVE_MANIFEST.json totals.sourceMarkdownFiles: 71
TEAM_DOC_ARCHIVE_MANIFEST.json totals.structuredMarkdownFiles: 32
TEAM_DOC_ARCHIVE_BUNDLE.jsonl lines: 118
```

## Physical Deletion

Command:

```text
rm -rf team-doc/00-source team-doc/10-structured
test ! -e team-doc/00-source
test ! -e team-doc/10-structured
```

Result:

```text
deleted: team-doc/00-source and team-doc/10-structured
```

`TEAM_DOC_ARCHIVE_MANIFEST.json` deletion status was updated to:

```text
physically-deleted-in-working-tree
```

## Post-delete Verification

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

## Note

The first `pnpm run test:runtime` attempt failed because an unrelated generated
root `.claude` runtime artifact existed. The forbidden artifact contained
generated memory files only and was removed with `fs.rmSync`; the rerun passed.
