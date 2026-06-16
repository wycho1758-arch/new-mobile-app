# Runtime Surface Structure Checkpoint 3-B Governance Organization Workflows Command Output

Date: 2026-06-16

Scope:

- Moved governance documents:
  - `00-sot-and-principles.md` -> `governance/sot-and-principles.md`
  - `06-gates-and-evidence.md` -> `governance/gates-and-evidence.md`
  - `15-human-ops-live-readiness-annex.md` -> `governance/human-ops-live-readiness-annex.md`
  - `20-app-eas-ota-rollback-runbook.md` -> `governance/app-eas-ota-rollback-runbook.md`
- Moved organization documents:
  - `01-team-composition.md` -> `organization/team-composition.md`
  - `03-role-capability-matrix.md` -> `organization/role-capability-matrix.md`
  - `07-new-team-template-guide.md` -> `organization/new-team-template-guide.md`
- Moved workflow documents:
  - `05-work-processes.md` -> `workflows/work-processes.md`
  - `10-github-artifact-workflow.md` -> `workflows/github-artifact-workflow.md`
  - `14-native-e2e-strategy.md` -> `workflows/native-e2e-strategy.md`
  - `19-entry-case-routing.md` -> `workflows/entry-case-routing.md`
- Updated `README.md`, `99-source-map.md`, surface validators, managed parity
  checks, Codex skill references, pod-native runtime source references, and
  durable work-unit references that pointed at these current files.
- Did not move `99-source-map.md`, `02-role-souls/`,
  `04-skills-and-agents-matrix.md`, `09-pod-native-openclaw-skills/`,
  `16-pod-environment-bootstrap.md`, `17-orbstack-pod-config-values.md`,
  `ref-organization/`, or `_archive/`.

## RED Validator Check

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 1, expected before physical file movement.

Output excerpt:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
Validated runtime source docs.
- missing required workflow doc: mobile-app-dev-team/workflows/work-processes.md
- missing required workflow doc: mobile-app-dev-team/workflows/github-artifact-workflow.md
- missing required workflow doc: mobile-app-dev-team/workflows/native-e2e-strategy.md
- missing required workflow doc: mobile-app-dev-team/workflows/entry-case-routing.md
validate-team-doc failed at workflow docs
```

## Structure Snapshot

Command:

```sh
find mobile-app-dev-team -maxdepth 2 -type f | sort | sed -n '1,120p'
```

Exit status: 0

Output excerpt:

```text
mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md
mobile-app-dev-team/governance/gates-and-evidence.md
mobile-app-dev-team/governance/human-ops-live-readiness-annex.md
mobile-app-dev-team/governance/sot-and-principles.md
mobile-app-dev-team/organization/new-team-template-guide.md
mobile-app-dev-team/organization/role-capability-matrix.md
mobile-app-dev-team/organization/team-composition.md
mobile-app-dev-team/workflows/entry-case-routing.md
mobile-app-dev-team/workflows/github-artifact-workflow.md
mobile-app-dev-team/workflows/native-e2e-strategy.md
mobile-app-dev-team/workflows/work-processes.md
```

## Current Old-Name Search

Command:

```sh
rg -n 'mobile-app-dev-team/(00-sot-and-principles|01-team-composition|03-role-capability-matrix|05-work-processes|06-gates-and-evidence|07-new-team-template-guide|10-github-artifact-workflow|14-native-e2e-strategy|15-human-ops-live-readiness-annex|19-entry-case-routing|20-app-eas-ota-rollback-runbook)\.md|`(00-sot-and-principles|01-team-composition|03-role-capability-matrix|05-work-processes|06-gates-and-evidence|07-new-team-template-guide|10-github-artifact-workflow|14-native-e2e-strategy|15-human-ops-live-readiness-annex|19-entry-case-routing|20-app-eas-ota-rollback-runbook)\.md`' AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex mobile-app-dev-team docs package.json .github --glob '!mobile-app-dev-team/_archive/**' --glob '!docs/plans/active/**'
```

Exit status: 0

Output excerpt:

```text
Remaining matches are the explicit old-to-new rename crosswalk rows in
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md.
```

Follow-up validation rerun after the stale-reference fix:

```sh
pnpm run validate:team-doc
pnpm run test:runtime
pnpm run test:local-harness
bash evals/skills/openclaw-pod-skills-sync-smoke.sh
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
git diff --check && git diff --cached --check
pnpm run validate:evidence-hygiene
```

Exit status: 0 for each command.

Output excerpt:

```text
Validated current mobile-app-dev-team surface validators.
Passed 44 hook fixture tests.
local harness all passed
openclaw-pod-skills-sync smoke passed
project-bootstrap-agent-setup smoke passed
Validated evidence hygiene artifacts.
```

The project-bootstrap smoke also printed unauthenticated Railway/gcloud status
probes and still exited 0.

## NO_GO Follow-Up Fix

Initial xhigh review output:

- `.evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-xhigh-review.md`

Finding addressed:

- Durable work-unit references under
  `docs/plans/work-units/codex-role-workflow-runtime-routing/` still used
  moved 3-B filenames as active current references.

Follow-up edits:

- Updated active work-unit packet references to the new structured paths:
  - `mobile-app-dev-team/workflows/entry-case-routing.md`
  - `mobile-app-dev-team/workflows/work-processes.md`
  - `mobile-app-dev-team/workflows/github-artifact-workflow.md`
  - `mobile-app-dev-team/governance/gates-and-evidence.md`
  - `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`

Focused work-unit stale-reference scan:

```sh
rg -n '00-sot-and-principles|01-team-composition|03-role-capability-matrix|05-work-processes|06-gates-and-evidence|07-new-team-template-guide|10-github-artifact-workflow|14-native-e2e-strategy|15-human-ops-live-readiness-annex|19-entry-case-routing|20-app-eas-ota-rollback-runbook' docs/plans/work-units
```

Exit status: 1, expected because there are no matches.

Broad non-archive source scan:

```sh
rg -n 'mobile-app-dev-team/(00-sot-and-principles|01-team-composition|03-role-capability-matrix|05-work-processes|06-gates-and-evidence|07-new-team-template-guide|10-github-artifact-workflow|14-native-e2e-strategy|15-human-ops-live-readiness-annex|19-entry-case-routing|20-app-eas-ota-rollback-runbook)\.md|`(00-sot-and-principles|01-team-composition|03-role-capability-matrix|05-work-processes|06-gates-and-evidence|07-new-team-template-guide|10-github-artifact-workflow|14-native-e2e-strategy|15-human-ops-live-readiness-annex|19-entry-case-routing|20-app-eas-ota-rollback-runbook)\.md`' AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex mobile-app-dev-team docs package.json .github --glob '!mobile-app-dev-team/_archive/**' --glob '!docs/plans/active/**'
```

Exit status: 0

Output excerpt:

```text
Remaining matches are the explicit old-to-new rename crosswalk rows in
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md.
```

Ignored local planning notes under `docs/plans/active/**` are excluded from
this broad scan because that path is ignored by `.gitignore` and is not part
of the staged checkpoint artifact set.

Archive diff check:

```sh
git diff --name-status -- mobile-app-dev-team/_archive
git diff --cached --name-status -- mobile-app-dev-team/_archive
```

Exit status: 0 for both commands, no output.

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

The project-bootstrap smoke also printed unauthenticated external-tool status
lines such as Railway login prompts. Those were blocker-status checks inside
the smoke and the script still exited 0.

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

- Source-map filename movement is not applicable to 3-B. `99-source-map.md`
  remains in place; Checkpoint 5 owns final source-map rename and crosswalk.
- Runtime-source movement is not applicable to 3-B. Role SOULs, Codex skill
  matrix, pod-native OpenClaw skill source root, pod bootstrap, and pod config
  value docs remain at their current paths.
- Ref-organization numeric-folder movement is not applicable to 3-B.
  Current ref-organization indexes may cite moved current docs, but 3-C owns
  physical ref-organization folder renames.
- Archive reclassification is not applicable to 3-B. `_archive/` has no
  unstaged or staged diff for this checkpoint.
- Live OpenClaw pod proof, Confluence/Jira/GitHub branch-protection proof,
  mobile UI/device automation, and API contract tests beyond workspace
  lint/test are not applicable. No live external platform, mobile UI,
  package contract, API route, or native runtime behavior changed.

## Reviewer Input Notes

The checkpoint reviewer should check:

- This is Checkpoint 3-B only, not the full Checkpoint 3 rename.
- Governance, organization, and workflow docs moved to their target folders.
- Current indexes and validators use the new target paths.
- Old 3-B filenames in tracked/non-ignored checkpoint sources outside
  `_archive/` and checkpoint evidence artifacts remain only in the goal-plan
  rename crosswalk.
- `_archive/`, `ref-organization/` physical folder names, source-map filename,
  role SOULs, and pod-native OpenClaw skill source root were not moved.
- Pod-native smoke was run because `codex-role-workflow` and runtime specs now
  cite `workflows/entry-case-routing.md`.
