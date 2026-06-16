# Runtime Surface Structure Numeric Removal Command Output

Date: 2026-06-16

Scope:
- Remove remaining numbered current top-level team-doc files `04`, `16`, and `17`.
- Move them to structure-based `runtime-sources/` target paths.
- Tighten structure validation so current repo validation no longer allows numbered top-level runtime-source docs.
- Record what `test:runtime`, `pnpm turbo run lint test`, and `test:local-harness` check under `mobile-app-dev-team/`.

## Path Changes

Removed current top-level numbered files:
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/17-orbstack-pod-config-values.md`

New target paths:
- `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`
- `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md`
- `mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md`

### `find mobile-app-dev-team -maxdepth 1 -type f -name '[0-9][0-9]-*.md' -print | sort`

Exit: 0

Output:
- No output.

## Validation Commands

### `node scripts/validate-team-doc-structure.mjs --self-test && node scripts/validate-team-doc-structure.mjs`

Exit: 0

Summary:
- Validated team-doc structure fixtures.
- Validated mobile-app-dev-team structure registry.
- Current repo validation now runs with `legacyCompatibility: false`.

### `node scripts/validate-runtime-sources.mjs`

Exit: 0

Summary:
- Validated runtime source docs.
- Runtime-source validation reads the target `runtime-sources/codex-skill-agent-matrix.md`, `runtime-sources/pod-environment-bootstrap.md`, and `runtime-sources/orbstack-pod-config-values.md` paths.

### `node scripts/validate-team-doc-managed.mjs`

Exit: 0

Summary:
- Validated current mobile-app-dev-team managed docs.
- Managed parity checks now read the target `runtime-sources/` paths.

### `pnpm run validate:team-doc`

Exit: 0

Summary:
- Validated team-doc structure fixtures.
- Validated mobile-app-dev-team structure registry.
- Validated runtime source docs.
- Validated workflow docs.
- Validated governance docs.
- Validated reference docs.
- Validated current mobile-app-dev-team managed docs.
- Validated current mobile-app-dev-team surface validators.

## Requested Gate Commands

### `pnpm run test:runtime`

Exit: 0

Summary:
- Validated 14 skills, 13 agents, and 4 hook events.
- Codex headless review helper self-test passed.
- Validated repo operations policy ownership.
- Validated current mobile-app-dev-team surface validators.
- Validated work-unit status fixtures and artifacts.
- Validated work-unit next-action resolver fixtures.
- Validated EAS evidence ingest fixtures.
- Validated project environment fixtures and drift checks.
- Validated evidence hygiene fixtures and artifacts.
- Passed 44 hook fixture tests.

Mobile-app-dev-team coverage:
- Directly includes `pnpm run validate:team-doc`.
- Checks current managed team docs through split validators for structure, runtime sources, workflows, governance docs, reference docs, and managed parity.
- Checks `mobile-app-dev-team/_archive` placement for completed-plan and preconsolidation archive paths through reference/structure validators.
- Does not prove live OpenClaw pod execution, `/workspace/skills`, external platform state, native device behavior, or the semantic correctness of every report sentence.

### `pnpm turbo run lint test`

Exit: 0

Summary:
- Turbo packages in scope: `@template/api`, `@template/contracts`, `mobile`.
- Tasks: 7 successful, 7 total.
- `@template/contracts`: 1 test passed.
- `@template/api`: 1 test file passed, 2 tests passed.
- `mobile`: 2 test suites passed, 5 tests passed.

Mobile-app-dev-team coverage:
- No direct `mobile-app-dev-team/` document validation.
- This command checks workspace package lint/test behavior for `apps/api`, `packages/contracts`, and `apps/mobile`.
- It only covers `mobile-app-dev-team/` indirectly if package code imports or depends on those files; this repo does not use it as a team-doc validator.

### `pnpm run test:local-harness`

Exit: 0

Summary:
- clean-tree-guard self-test passed.
- codex-preflight self-test passed.
- codex-preflight accepted `/opt/homebrew/bin/codex (codex-cli 0.137.0)`.
- Nested `pnpm run test:runtime` passed.
- Nested `pnpm turbo run lint test` passed.
- Local harness self-test passed.
- Local harness all passed.

Mobile-app-dev-team coverage:
- Includes the same `mobile-app-dev-team/` coverage as nested `pnpm run test:runtime`.
- The local harness itself validates repo-local Codex runtime fixtures, offline role/gate snapshots, and Codex smoke expectations under `evals/local-harness/`.
- It does not broaden `mobile-app-dev-team/` prose validation beyond `validate:team-doc`.
- It does not prove live OpenClaw pod packaging, `/workspace/skills`, external platform state, or mobile device QA.
