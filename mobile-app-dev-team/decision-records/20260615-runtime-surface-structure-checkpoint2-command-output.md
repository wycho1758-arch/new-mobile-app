# Runtime Surface Structure Checkpoint 2 Command Output

Date: 2026-06-15

Scope:

- Replaced `scripts/validate-team-doc.mjs` with a composition wrapper.
- Preserved the previous managed-doc validator body as
  `scripts/validate-team-doc-managed.mjs` so existing detailed checks are not
  removed during the split.
- Added shared helper utilities in `scripts/lib/team-doc-validation-helpers.mjs`.
- Added surface validators:
  - `scripts/validate-runtime-sources.mjs`
  - `scripts/validate-workflow-docs.mjs`
  - `scripts/validate-governance-docs.mjs`
  - `scripts/validate-reference-docs.mjs`
- Kept `scripts/validate-team-doc-structure.mjs` as the structure surface
  validator from Checkpoint 1.
- Added explicit package scripts for each surface validator.
- Updated `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`,
  `.github/workflows/quality-gate.yml`, `scripts/validate-project-environment.mjs`,
  and `mobile-app-dev-team/99-source-map.md` so the new validator surfaces are
  documented and detected by runtime-change gates.
- No physical `mobile-app-dev-team/**` path rename, harness narrowing, live pod
  update, `/workspace/skills` update, or external platform update was performed.

## Validator Size Snapshot

Command:

```sh
wc -l scripts/validate-team-doc.mjs scripts/validate-team-doc-managed.mjs scripts/validate-runtime-sources.mjs scripts/validate-workflow-docs.mjs scripts/validate-governance-docs.mjs scripts/validate-reference-docs.mjs scripts/lib/team-doc-validation-helpers.mjs
```

Exit status: 0

Output excerpt:

```text
30 scripts/validate-team-doc.mjs
2440 scripts/validate-team-doc-managed.mjs
142 scripts/validate-runtime-sources.mjs
69 scripts/validate-workflow-docs.mjs
50 scripts/validate-governance-docs.mjs
87 scripts/validate-reference-docs.mjs
126 scripts/lib/team-doc-validation-helpers.mjs
2944 total
```

## Syntax Check

Command:

```sh
for f in scripts/*.mjs scripts/lib/*.mjs; do node --check "$f" || exit 1; done
```

Exit status: 0

Output excerpt:

```text
<no output>
```

## Surface Package Commands

Command:

```sh
pnpm run validate:team-doc:structure && pnpm run validate:runtime-sources && pnpm run validate:workflow-docs && pnpm run validate:governance-docs && pnpm run validate:reference-docs
```

Exit status: 0

Output excerpt:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated runtime source docs.
Validated workflow docs.
Validated governance docs.
Validated reference docs.
```

## validate:team-doc Wrapper

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 0

Output excerpt:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated runtime source docs.
Validated workflow docs.
Validated governance docs.
Validated reference docs.
Validated current mobile-app-dev-team managed docs.
Validated current mobile-app-dev-team surface validators.
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

## validate:repo-operations

Command:

```sh
node scripts/validate-repo-operations.mjs
```

Exit status: 0

Output excerpt:

```text
Validated repo operations policy ownership.
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
Validated runtime source docs.
Validated workflow docs.
Validated governance docs.
Validated reference docs.
Validated current mobile-app-dev-team managed docs.
Validated current mobile-app-dev-team surface validators.
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
Validated runtime source docs.
Validated workflow docs.
Validated governance docs.
Validated reference docs.
Validated current mobile-app-dev-team managed docs.
Validated current mobile-app-dev-team surface validators.
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
  docs/scripts only and does not mutate `/workspace/SOUL.md`,
  `/workspace/AGENTS.md`, or `/workspace/skills/<slug>/`.
- Physical path rename proof: not applicable. Checkpoint 3 owns physical
  `mobile-app-dev-team/**` movement.
- Harness narrowing proof: not applicable. Checkpoint 4 owns harness
  applicability narrowing; this checkpoint only updates detection for new
  validator scripts.
- Confluence/Jira/GitHub branch protection proof: not applicable. No live
  external platform update was requested or performed.

## Reviewer Input Notes

The checkpoint reviewer should check:

- `validate-team-doc.mjs` is now a composition wrapper.
- Surface validators produce distinct failure ownership for structure,
  runtime-source, workflow, governance, and reference docs.
- `validate-team-doc-managed.mjs` preserves the previous monolithic checks as a
  parity backstop, so gate strength is not weakened during the split.
- Package scripts and runtime-change path detection include the new validators.
- `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, and `99-source-map.md` are in
  sync with the new validator surfaces.
- This checkpoint did not start physical path rename or harness narrowing.
