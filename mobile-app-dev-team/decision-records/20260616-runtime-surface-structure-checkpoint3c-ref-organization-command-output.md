# Runtime Surface Structure Checkpoint 3-C Ref Organization Command Output

Date: 2026-06-16

Scope:

- Moved `mobile-app-dev-team/ref-organization/` section folders from numeric
  prefixes to structure names:
  - `00-orientation-and-sot/` -> `orientation-and-sot/`
  - `01-organization-model/` -> `organization-model/`
  - `02-runtime-surfaces/` -> `runtime-surfaces/`
  - `03-role-contracts-and-capabilities/` -> `role-contracts-and-capabilities/`
  - `04-workflows-and-handoffs/` -> `workflows-and-handoffs/`
  - `05-skills-agents-and-tools/` -> `skills-agents-and-tools/`
  - `06-gates-evidence-and-audit/` -> `gates-evidence-and-audit/`
  - `07-repo-template-and-runtime/` -> `repo-template-and-runtime/`
  - `08-new-organization-template/` -> `new-organization-template/`
  - `99-source-map-and-migration/` -> `source-map-and-migration/`
- Updated current `ref-organization` links in the reference index, source map,
  runtime-surface report, source-map/migration crosswalk, and validators.
- Did not move `_archive/`, role SOULs, pod-native OpenClaw skill source root,
  source-map filename, governance/organization/workflow docs, app code,
  package code, or infra.

## RED Validator Check

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 1, expected before physical folder movement.

Output excerpt:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated runtime source docs.
Validated workflow docs.
Validated governance docs.
- missing reference organization section README: mobile-app-dev-team/ref-organization/orientation-and-sot/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/organization-model/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/runtime-surfaces/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/role-contracts-and-capabilities/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/workflows-and-handoffs/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/skills-agents-and-tools/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/gates-evidence-and-audit/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/repo-template-and-runtime/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/new-organization-template/README.md
- missing reference organization section README: mobile-app-dev-team/ref-organization/source-map-and-migration/README.md
- reference organization section must drop numeric prefix: mobile-app-dev-team/ref-organization/00-orientation-and-sot
validate-team-doc failed at reference docs
```

## Structure Snapshot

Command:

```sh
find mobile-app-dev-team/ref-organization -maxdepth 2 -type f | sort
```

Exit status: 0

Output:

```text
mobile-app-dev-team/ref-organization/README.md
mobile-app-dev-team/ref-organization/gates-evidence-and-audit/README.md
mobile-app-dev-team/ref-organization/new-organization-template/README.md
mobile-app-dev-team/ref-organization/organization-model/README.md
mobile-app-dev-team/ref-organization/orientation-and-sot/README.md
mobile-app-dev-team/ref-organization/repo-template-and-runtime/README.md
mobile-app-dev-team/ref-organization/role-contracts-and-capabilities/README.md
mobile-app-dev-team/ref-organization/runtime-surfaces/README.md
mobile-app-dev-team/ref-organization/skills-agents-and-tools/README.md
mobile-app-dev-team/ref-organization/source-map-and-migration/README.md
mobile-app-dev-team/ref-organization/workflows-and-handoffs/README.md
```

## Stale Reference Scans

Focused active ref-organization document scan:

```sh
rg -n '(00-orientation-and-sot|01-organization-model|02-runtime-surfaces|03-role-contracts-and-capabilities|04-workflows-and-handoffs|05-skills-agents-and-tools|06-gates-evidence-and-audit|07-repo-template-and-runtime|08-new-organization-template|99-source-map-and-migration)' mobile-app-dev-team/ref-organization --glob '!mobile-app-dev-team/_archive/**'
```

Exit status: 1, expected because active ref-organization docs have no old
section-name matches.

Broad current-source path scan:

```sh
rg -n 'ref-organization/(00-orientation-and-sot|01-organization-model|02-runtime-surfaces|03-role-contracts-and-capabilities|04-workflows-and-handoffs|05-skills-agents-and-tools|06-gates-evidence-and-audit|07-repo-template-and-runtime|08-new-organization-template|99-source-map-and-migration)' AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex mobile-app-dev-team docs package.json .github --glob '!mobile-app-dev-team/_archive/**' --glob '!docs/plans/active/**'
```

Exit status: 0

Output excerpt:

```text
Remaining matches are the explicit old-to-new rows in
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md and the
legacyPath entries in scripts/validate-team-doc-structure.mjs.
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

Command:

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

Command:

```sh
git diff --check && git diff --cached --check
pnpm run validate:evidence-hygiene
```

Exit status: 0

Output excerpt:

```text
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

## Not Applicable Boundaries

- Checkpoint 3-D archive reclassification is not applicable; `_archive/`
  physical paths were not moved by 3-C.
- Checkpoint 3-E role SOUL movement is not applicable.
- Checkpoint 3-F pod-native OpenClaw skill source-root movement is not
  applicable.
- Checkpoint 5 source-map filename movement is not applicable; `99-source-map.md`
  remains in place.
- App code, package code, API contracts, native runtime behavior, and external
  platform proof were not changed.
