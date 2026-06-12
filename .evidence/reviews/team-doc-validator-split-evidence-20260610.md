# Team Doc Validator Split Evidence - 2026-06-10

## Scope

Split current managed team-doc validation from historical archive/reference
validation for:

- `team-doc/00-source/`
- `team-doc/10-structured/`
- `team-doc/_meta/`

The goal is to stop presenting the Confluence-shaped corpus as an active current
team/runtime gate while retaining explicit archive/reference integrity checks.

## SoT Basis

- `AGENTS.md`: runtime/doc changes require the applicable runtime gates.
- `PROJECT_ENVIRONMENT.md`: current runtime, skill, and MCP state lives in root
  project environment SoT.
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`: `AGENTS.md`,
  `PROJECT_ENVIRONMENT.md`, `.agents/skills`, and `.codex/agents` outrank
  `team-doc/10-structured/` and `team-doc/00-source/`.
- `team-doc/mobile-app-dev-team/99-source-map.md`: historical source names and
  structured inputs are crosswalk/reference material, not current runtime SoT.
- `REPO_OPERATIONS.md`: validators enforce policy; they are not policy owners.

## Reviewer Checkpoint

Pre-implementation reviewer(xhigh): GO.

Reviewer notes incorporated:

- Do not move only the first `requiredDirs` and frontmatter loops; classify later
  `legacyStructuredFiles`, crosswalk, term checks, and output counts.
- Update `scripts/validate-repo-operations.mjs` so the split has executable
  assertions.
- Keep archive/reference validation explicit and out of `test:runtime`.

## Implementation Summary

- `scripts/validate-team-doc.mjs`
  - Removed active required input traversal for `00-source`, `10-structured`,
    source markdown frontmatter, structured markdown frontmatter, `_meta`
    page-map/split-map, and obsolete structured-doc checks.
  - Restricted secret scanning to `team-doc/mobile-app-dev-team/**`.
  - Kept current managed docs, active repo-local skills/agents, pod-native skill,
    GitHub artifact workflow, and current ref-organization document checks.
  - Output now reports current managed docs validation instead of source and
    structured corpus counts.
- `scripts/validate-team-doc-archive.mjs`
  - Added explicit archive/reference validation for `00-source`,
    `10-structured`, `_meta`, split-map/sourcePath/frontmatter integrity,
    obsolete generated skill guards, archive secret scan, and migration crosswalk
    coverage.
- `package.json`
  - Added `validate:team-doc-archive`.
  - Kept `test:runtime` as active gates only:
    `validate`, `validate:repo-operations`, `validate:team-doc`, `test:hooks`.
- `REPO_OPERATIONS.md`
  - Documents active current team/runtime gate vs archive/reference gate.
  - Classifies `scripts/generate-team-doc.mjs` as legacy Confluence-shaped corpus
    generation/migration tooling, not current validation.
- `scripts/validate-repo-operations.mjs`
  - Asserts `validate:team-doc-archive` exists.
  - Asserts `test:runtime` excludes archive/reference validation.
  - Asserts `validate-team-doc.mjs` no longer contains archive corpus traversal
    and archive-only checks.

## Command Evidence

Initial TDD failure after adding assertions:

```text
pnpm run validate:repo-operations
- REPO_OPERATIONS.md missing required repo operations term: validate:team-doc-archive
- package.json missing validate:team-doc-archive archive/reference validator script
- missing required repo operations file: scripts/validate-team-doc-archive.mjs
- scripts/validate-team-doc.mjs includes forbidden duplicated repo policy term: listFiles('00-source'
- scripts/validate-team-doc.mjs includes forbidden duplicated repo policy term: listFiles('10-structured'
- scripts/validate-team-doc.mjs includes forbidden duplicated repo policy term: sourcePath must live under 00-source
exit 1
```

Passing checks after implementation:

```text
pnpm run validate:repo-operations
Validated repo operations policy ownership.
exit 0
```

```text
pnpm run validate:team-doc
Validated current team-doc managed docs.
exit 0
```

```text
pnpm run validate:team-doc-archive
Validated team-doc archive/reference corpus: 71 source files, 32 structured files.
exit 0
```

```text
pnpm run test:hooks
Passed 44 hook fixture tests.
exit 0
```

```text
pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.
exit 0
```

```text
pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
test:runtime passed
pnpm turbo run lint test passed
self-test all passed
local harness all passed
exit 0
```

## Connection Audit

Active current gate:

- `validate:team-doc` no longer traverses `team-doc/00-source/` or
  `team-doc/10-structured/` as active input.
- Remaining `team-doc/10-structured` and `team-doc/00-source` strings in
  `validate-team-doc.mjs` are current managed-doc content requirements for
  historical/reference explanation, not file traversal.

Archive/reference gate:

- `validate:team-doc-archive` owns `00-source`, `10-structured`, and `_meta`
  integrity.
- It is not included in `test:runtime`.
- Run it explicitly for archive/reference corpus changes or migration audits.

## Residual Risk

- Existing uncommitted/untracked workspace changes remain outside this change
  set. Final status must separate those from this validator split.
- `scripts/generate-team-doc.mjs` still generates the old Confluence-shaped
  corpus; it is now classified as legacy/migration tooling, but not renamed.
