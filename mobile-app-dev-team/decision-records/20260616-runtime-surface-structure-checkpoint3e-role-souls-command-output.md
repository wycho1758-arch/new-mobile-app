# Runtime Surface Structure Checkpoint 3-E Role SOUL Command Output

Date: 2026-06-16

Scope:

- Moved `mobile-app-dev-team/02-role-souls/` to
  `mobile-app-dev-team/runtime-sources/role-souls/`.
- Updated active role SOUL references in source map, team README, role-contract
  reference docs, pod-native runtime specs, repo-local skill references,
  runtime-surface reports, validators, and project-bootstrap smoke fixtures.
- Kept old-path mentions only in the approved goal-plan mapping and validator
  legacy/stale checks.
- Did not move pod-native OpenClaw skill source root, source-map filename,
  archive content, app code, package code, API contracts, or infra.

## RED Validator Check

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 1, expected before physical role SOUL movement.

Output excerpt:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
- role SOUL runtime source must be reclassified out of legacy path: mobile-app-dev-team/02-role-souls
- missing required runtime SOUL document: mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md
- missing required runtime SOUL: mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md
- missing required runtime SOUL document: mobile-app-dev-team/runtime-sources/role-souls/design-soul.md
- missing required runtime SOUL: mobile-app-dev-team/runtime-sources/role-souls/design-soul.md
- missing required runtime SOUL document: mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md
- missing required runtime SOUL: mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md
- missing required runtime SOUL document: mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md
- missing required runtime SOUL: mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md
- missing required runtime SOUL document: mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md
- missing required runtime SOUL: mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md
- missing required runtime SOUL document: mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md
- missing required runtime SOUL: mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md
validate-team-doc failed at runtime source docs
```

## Structure Snapshot

Command:

```sh
find mobile-app-dev-team/runtime-sources -maxdepth 2 -type f | sort
```

Exit status: 0

Output:

```text
mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md
mobile-app-dev-team/runtime-sources/role-souls/design-soul.md
mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md
mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md
mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md
mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md
```

## Stale Reference Scan

Command:

```sh
rg -n '02-role-souls' AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex mobile-app-dev-team docs evals package.json .github --glob '!mobile-app-dev-team/_archive/**' --glob '!docs/plans/active/**'
```

Exit status: 0

Output excerpt:

```text
Remaining matches are limited to:
- mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md old-to-new mapping and risk note
- scripts/validate-runtime-sources.mjs legacyRoleSoulRoot stale-path rejection
- scripts/validate-team-doc-managed.mjs legacyRoleSoulRoot stale-path rejection
- scripts/validate-team-doc-structure.mjs legacyPath registry
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
Validated runtime source docs.
Validated workflow docs.
Validated governance docs.
Validated reference docs.
Validated current mobile-app-dev-team managed docs.
Validated current mobile-app-dev-team surface validators.
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
self-test all passed
local harness all passed
```

## Archive Validator

Command:

```sh
pnpm run validate:team-doc-archive
```

Exit status: 0

Output excerpt:

```text
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
```

## Pod-Native Smoke

Commands:

```sh
bash evals/skills/openclaw-pod-skills-sync-smoke.sh
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Exit status: 0

Output excerpt:

```text
openclaw-pod-skills-sync smoke passed
project-bootstrap-agent-setup smoke passed
```

The project-bootstrap smoke also printed unauthenticated Railway/gcloud status
probes and still exited 0.

## Whitespace And Evidence Hygiene

Commands:

```sh
git diff --check
git diff --cached --check
pnpm run validate:evidence-hygiene
```

Exit status: 0

Output excerpt:

```text
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

## Corrected Stale Reference Scan

The initial stale-reference scan omitted `.claude/`; the first xhigh review
found two active `.claude` references to the removed `02-role-souls` root. Those
references were updated to `mobile-app-dev-team/runtime-sources/role-souls/`.

Command:

```sh
rg -n "02-role-souls" AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex .claude mobile-app-dev-team docs evals package.json .github --glob '!mobile-app-dev-team/_archive/**' --glob '!docs/plans/active/**' --glob '!.evidence/**'
```

Exit status: 0

Output:

```text
scripts/validate-team-doc-managed.mjs:207:const legacyRoleSoulRoot = `${managedTeamDocRoot}/02-role-souls`;
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:195:  02-role-souls/
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:329:| `02-role-souls/` | `runtime-sources/role-souls/` | SOUL seed/source input | strong |
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:815:| `02-role-souls` rename으로 `/workspace/SOUL.md` seed 설명 drift | High | role-souls validator 유지, project-bootstrap docs update |
scripts/validate-runtime-sources.mjs:21:const legacyRoleSoulRoot = `${teamRoot}/02-role-souls`;
scripts/validate-team-doc-structure.mjs:15:  { legacyPath: `${teamRoot}/02-role-souls/`, targetPath: `${teamRoot}/runtime-sources/role-souls/`, kind: 'dir', surfaceClass: 'R2', strength: 'strong' },
```

Remaining matches are the Checkpoint 3-E old-to-new plan mapping and validator
legacy-root rejection/registry checks. No active `.claude`, `.agents`, `.codex`,
smoke fixture, README, source-map, role contract, or pod-native runtime-spec
references remain on the old role SOUL path.

## Rerun After Reviewer NO_GO Fix

Commands:

```sh
pnpm run validate:team-doc
pnpm run test:runtime
pnpm run test:local-harness
pnpm run validate:team-doc-archive
bash evals/skills/openclaw-pod-skills-sync-smoke.sh
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
pnpm run validate:evidence-hygiene
git diff --check
```

Exit status: 0 for all commands.

Output excerpts:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated runtime source docs.
Validated workflow docs.
Validated governance docs.
Validated reference docs.
Validated current mobile-app-dev-team managed docs.
Validated current mobile-app-dev-team surface validators.
Validated 14 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Passed 44 hook fixture tests.
Tasks:    7 successful, 7 total
self-test all passed
local harness all passed
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
openclaw-pod-skills-sync smoke passed
project-bootstrap-agent-setup smoke passed
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

The project-bootstrap smoke printed unauthenticated Railway/gcloud status probes
and still exited 0, matching the earlier checkpoint evidence boundary.

## Not Applicable Boundaries

- Checkpoint 3-F pod-native OpenClaw skill source-root movement is not
  applicable.
- Checkpoint 5 source-map filename movement is not applicable; `99-source-map.md`
  remains in place.
- Archive reclassification already completed in Checkpoint 3-D.
- App code, package code, API contracts, native runtime behavior, and external
  platform proof were not changed.
