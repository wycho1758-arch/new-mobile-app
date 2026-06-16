# Runtime Surface Structure Checkpoint 4 Harness Narrowing Command Output

Date: 2026-06-16

Scope:

- Narrowed `.github/workflows/quality-gate.yml` conditional local-harness
  detection from broad team-doc/runtime-doc paths to Codex runtime and harness
  paths.
- Kept `pnpm run test:runtime` and `pnpm turbo run lint test` as always-run
  quality-gate commands.
- Added project-environment fixture coverage for:
  - required local-harness trigger paths such as `.agents/**`, `.codex/**`,
    `evals/local-harness/**`, selected Codex runtime scripts, root runtime
    policy files, package metadata, and workflow YAML.
  - non-local-harness-only paths such as `mobile-app-dev-team/reports/**`,
    `mobile-app-dev-team/ref-organization/**`,
    `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**`,
    pod-native smoke fixtures, team-doc structure fixtures, and durable
    `docs/plans/**` docs.
- Added local-harness README applicability assertions so generated harness
  summaries fail if the applicability contract is removed.
- Updated `PROJECT_ENVIRONMENT.md` and `REPO_OPERATIONS.md` to document the same
  applicability model.

## RED: Project Environment Fixture/Drift Check

Command:

```sh
pnpm run validate:project-environment
```

Exit status: 1, expected before narrowing workflow/docs after adding the new
fixture checks.

Output excerpt:

```text
- valid-current.json: valid fixture failed:
  - quality-gate.yml must run local harness for REPO_OPERATIONS.md
  - quality-gate.yml must not require local harness for mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md
  - quality-gate.yml must not require local harness for mobile-app-dev-team/ref-organization/source-map-and-migration/README.md
  - quality-gate.yml must not require local harness for mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md
  - quality-gate.yml must not require local harness for mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
  - quality-gate.yml must not require local harness for evals/skills/openclaw-pod-skills-sync-smoke.sh
  - quality-gate.yml must not require local harness for evals/team-doc-structure/fixtures/valid-target-registry.json
  - quality-gate.yml must not require local harness for docs/plans/work-units/project-bootstrap-auth-gates/README.md
  - PROJECT_ENVIRONMENT.md must document local harness applicability term: Local harness is required for Codex runtime and harness changes
  - REPO_OPERATIONS.md must document local harness applicability term: ## Local Harness Applicability
```

## RED: Harness README Applicability Check

Command:

```sh
node scripts/test-local-harness.mjs --stage all
```

Exit status: 1, expected before adding the README applicability section.

Output:

```text
local harness all failed
- summary: missing local harness applicability term
- summary: missing local harness applicability term
- summary: missing local harness applicability term
- summary: missing local harness applicability term
- summary: missing local harness applicability term
- summary: missing local harness applicability term
```

## Changed Files For Checkpoint 4

Command:

```sh
git diff --name-only
```

Exit status: 0

Output:

```text
.github/workflows/quality-gate.yml
PROJECT_ENVIRONMENT.md
REPO_OPERATIONS.md
evals/local-harness/README.md
evals/local-harness/project-environment/fixtures/invalid-quality-gate-missing-repo-operations.json
scripts/test-local-harness.mjs
scripts/validate-project-environment.mjs
```

New fixture files:

```text
evals/local-harness/project-environment/fixtures/invalid-quality-gate-missing-local-harness-path.json
evals/local-harness/project-environment/fixtures/invalid-quality-gate-team-doc-broad-trigger.json
```

## Syntax Checks

Commands:

```sh
node --check scripts/validate-project-environment.mjs
node --check scripts/test-local-harness.mjs
```

Exit status: 0 for both commands.

## validate:project-environment

Command:

```sh
pnpm run validate:project-environment
```

Exit status: 0

Output:

```text
Validated project environment fixtures.
Validated project environment drift checks.
```

## Targeted Local Harness

Command:

```sh
node scripts/test-local-harness.mjs --stage all
```

Exit status: 0

Output:

```text
local harness all passed
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
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated current mobile-app-dev-team surface validators.
Tasks:    7 successful, 7 total
Cached:    7 cached, 7 total
self-test all passed
local harness all passed
```

Workspace tests executed inside `pnpm run test:local-harness`:

```text
@template/contracts:test: tests 1, pass 1
@template/api:test: Test Files 1 passed, Tests 2 passed
mobile:test: Test Suites 2 passed, Tests 5 passed
```

## Whitespace Checks

Commands:

```sh
git diff --check
git diff --cached --check
```

Exit status: 0 for both commands.
