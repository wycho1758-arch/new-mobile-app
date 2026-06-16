# Runtime Surface Structure Checkpoint 1 Command Output

Date: 2026-06-15

Scope:

- Added RED and valid structure fixtures under
  `evals/team-doc-structure/fixtures/`.
- Added `scripts/validate-team-doc-structure.mjs` as the Checkpoint 1
  structure registry validator.
- Wired `validate:team-doc` through `validate:team-doc:structure` in
  `package.json`.
- Updated `mobile-app-dev-team/99-source-map.md` to index the structure
  validator and fixture surface, and to state the local-only proof boundary.
- Updated `mobile-app-dev-team/runtime-surface-structure-goal-plan.md` to add
  the missing crosswalk row for the plan file's later `reports/` target path.
- No `mobile-app-dev-team/**` physical rename, surface validator split,
  harness narrowing, live pod update, `/workspace/skills` update, or external
  platform update was performed.

## Fixture Inventory

Command:

```sh
find evals/team-doc-structure/fixtures -maxdepth 1 -type f | sort
```

Exit status: 0

Output excerpt:

```text
evals/team-doc-structure/fixtures/invalid-archived-plan-current-doc.json
evals/team-doc-structure/fixtures/invalid-missing-source-map.json
evals/team-doc-structure/fixtures/invalid-pod-native-legacy-only.json
evals/team-doc-structure/fixtures/invalid-runtime-source-in-reports.json
evals/team-doc-structure/fixtures/invalid-top-level-numeric-prefix.json
evals/team-doc-structure/fixtures/valid-legacy-compatibility-window.json
evals/team-doc-structure/fixtures/valid-source-map-crosswalk.json
evals/team-doc-structure/fixtures/valid-target-registry.json
```

## File Size

Command:

```sh
wc -l scripts/validate-team-doc-structure.mjs evals/team-doc-structure/fixtures/*.json
```

Exit status: 0

Output excerpt:

```text
279 scripts/validate-team-doc-structure.mjs
368 total
```

## Syntax Check

Command:

```sh
node --check scripts/validate-team-doc-structure.mjs
```

Exit status: 0

Output excerpt:

```text
<no output>
```

## Targeted Fixture Gate

Command:

```sh
node scripts/validate-team-doc-structure.mjs --self-test
```

Exit status: 0

Output excerpt:

```text
Validated team-doc structure fixtures.
```

Fixture coverage:

- Invalid: new top-level numeric prefix.
- Invalid: missing source map.
- Invalid: runtime source under `reports/`.
- Invalid: pod-native runtime source present only at legacy numbered path when
  compatibility is disabled.
- Invalid: completed archived plan reintroduced as a current top-level doc.
- Valid: target registry.
- Valid: source-map crosswalk terms.
- Valid: explicit legacy compatibility window.

## Real Repo Structure Registry

Command:

```sh
node scripts/validate-team-doc-structure.mjs
```

Exit status: 0

Output excerpt:

```text
Validated mobile-app-dev-team structure registry.
```

## validate:team-doc

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 0

Output excerpt:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated current mobile-app-dev-team managed docs.
```

## validate:project-environment

Command:

```sh
pnpm run validate:project-environment
```

Exit status: 0

Output excerpt:

```text
Validated project environment fixtures.
Validated project environment drift checks.
```

## Whitespace Diff Check

Command:

```sh
git diff --check && git diff --cached --check
```

Exit status: 0

Output excerpt:

```text
<no output>
```

## test:runtime

Command:

```sh
pnpm run test:runtime
```

Exit status: 0

Output excerpt:

```text
Validated 14 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated current mobile-app-dev-team managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Validated work-unit next-action resolver fixtures.
Validated EAS evidence ingest fixtures.
Validated project environment fixtures.
Validated project environment drift checks.
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
Passed 44 hook fixture tests.
```

## test:local-harness

Command:

```sh
pnpm run test:local-harness
```

Exit status: 0

Output excerpt:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted codex-cli 0.137.0
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated current mobile-app-dev-team managed docs.
Tasks:    7 successful, 7 total
self-test all passed
local harness all passed
```

## Not Applicable Boundaries

- `mobile-mcp`: not applicable. No mobile UI, simulator, device, visual QA
  surface, selector, or React Native runtime was changed.
- API contract tests beyond workspace lint/test: not applicable. No
  `packages/contracts`, `apps/api`, schema, auth/session, fixture, or route
  contract changed.
- Live OpenClaw pod proof: not applicable. This checkpoint validates repo-local
  structure fixtures only and does not mutate `/workspace/SOUL.md`,
  `/workspace/AGENTS.md`, or `/workspace/skills/<slug>/`.
- Physical path rename proof: not applicable. The checkpoint deliberately
  stops before moving `mobile-app-dev-team/**` paths.
- Confluence/Jira/GitHub branch protection proof: not applicable. No live
  external platform update was requested or performed.

## Reviewer Input Notes

The checkpoint reviewer should check:

- The fixtures are RED/valid structure coverage, not an early physical rename.
- The validator explains failures before rename and allows the current numbered
  layout only through an explicit legacy compatibility window.
- The `validate:team-doc` package script now runs the structure self-test and
  real repo registry before the existing managed-doc validator.
- Source-map and plan updates are limited to indexing the new registry and
  correcting the plan file's missing future target row.
- The local harness result remains repo-local evidence and does not claim live
  pod or external platform proof.
