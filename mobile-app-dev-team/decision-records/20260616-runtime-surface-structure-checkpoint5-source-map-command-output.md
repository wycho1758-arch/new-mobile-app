# Runtime Surface Structure Checkpoint 5 Source Map Command Output

Date: 2026-06-16

Scope:

- Renamed `mobile-app-dev-team/99-source-map.md` to
  `mobile-app-dev-team/source-map.md`.
- Reworked the source map around the required final sections:
  - `Current Repo Sources`
  - `Runtime Surface Classes`
  - `Old-To-New Rename Crosswalk`
  - `Validator Responsibility Crosswalk`
  - `Harness Applicability Crosswalk`
  - `Historical/Archive Crosswalk`
  - `External Proof Boundary`
- Updated active references in the team README, ref-organization docs,
  governance docs, `.agents` SoT references, classification reports, and
  validators.
- Kept old filename mentions only where intentional: the approved goal-plan
  old-to-new mapping/risk notes, validator legacy rejection checks, and the
  source-map crosswalk row.
- Did not change `TEAM_DOC_ARCHIVE_MANIFEST.json` or
  `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.

## RED Validator Check

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 1, expected after validators were updated and before the physical
source-map rename.

Output:

```text
Validated team-doc structure fixtures.
- missing source map: expected mobile-app-dev-team/source-map.md
- legacy source map must be renamed to target path: mobile-app-dev-team/99-source-map.md -> mobile-app-dev-team/source-map.md
validate-team-doc failed at team-doc structure registry
```

## Changed Files For Checkpoint 5

Command:

```sh
git diff --name-status -- mobile-app-dev-team/99-source-map.md mobile-app-dev-team/source-map.md mobile-app-dev-team/README.md mobile-app-dev-team/ref-organization/source-map-and-migration/README.md mobile-app-dev-team/ref-organization/README.md mobile-app-dev-team/governance/sot-and-principles.md .agents/skills/mobile-app-dev-workflow/references/sot.md .agents/skills/mobile-backend-api-integrator-workflow/references/sot.md scripts/validate-reference-docs.mjs scripts/validate-team-doc-structure.mjs scripts/validate-team-doc-managed.mjs scripts/validate-repo-operations.mjs mobile-app-dev-team/reports/runtime-surface-classification-improvement-report.md mobile-app-dev-team/reports/runtime-surface-classification-improvement-report-v2.md
```

Exit status: 0

Output:

```text
M	.agents/skills/mobile-app-dev-workflow/references/sot.md
M	.agents/skills/mobile-backend-api-integrator-workflow/references/sot.md
M	mobile-app-dev-team/README.md
M	mobile-app-dev-team/governance/sot-and-principles.md
M	mobile-app-dev-team/ref-organization/README.md
M	mobile-app-dev-team/ref-organization/source-map-and-migration/README.md
M	mobile-app-dev-team/reports/runtime-surface-classification-improvement-report-v2.md
M	mobile-app-dev-team/reports/runtime-surface-classification-improvement-report.md
M	mobile-app-dev-team/source-map.md
M	scripts/validate-reference-docs.mjs
M	scripts/validate-repo-operations.mjs
M	scripts/validate-team-doc-managed.mjs
M	scripts/validate-team-doc-structure.mjs
```

## Stale Filename Scan

Command:

```sh
rg -n "99-source-map\\.md" CLAUDE.md AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex .claude mobile-app-dev-team docs evals package.json .github --glob '!mobile-app-dev-team/_archive/**' --glob '!docs/plans/active/**' --glob '!.evidence/**'
```

Exit status: 0

Output:

```text
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:212:  99-source-map.md
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:221:- `99-source-map.md`가 왜 가장 마지막 번호인지, 실제 중요도는 어떤지?
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:347:| `99-source-map.md` | `source-map.md` | index/crosswalk SoT | strong for index, not runtime proof |
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:380:`99-source-map.md`는 숫자를 제거하는 방향이 기본안이다.
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:384:  99-source-map.md
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:826:- `99-source-map.md`는 `source-map.md` 또는 reviewer-approved 중요도 기반 이름으로 바뀌어야 한다.
scripts/validate-reference-docs.mjs:62:if (exists(`${teamRoot}/99-source-map.md`)) {
scripts/validate-reference-docs.mjs:63:  errors.push(`${teamRoot}/99-source-map.md must be renamed to ${teamRoot}/source-map.md`);
scripts/validate-team-doc-structure.mjs:9:const sourceMapLegacyPath = `${teamRoot}/99-source-map.md`;
mobile-app-dev-team/source-map.md:69:| `mobile-app-dev-team/99-source-map.md` | `mobile-app-dev-team/source-map.md` | `I1` | Completed in Checkpoint 5; old filename is rejected by validators. |
```

Remaining matches are intentional legacy references: the approved goal-plan
mapping/risk note, validator legacy rejection checks, and the source-map
old-to-new crosswalk row.

## validate:team-doc

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 0

Output:

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

## validate:reference-docs

Command:

```sh
pnpm run validate:reference-docs
```

Exit status: 0

Output:

```text
Validated reference docs.
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

## Archive Validator

Command:

```sh
pnpm run validate:team-doc-archive
```

Exit status: 0

Output:

```text
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
```

Archive validator was run as supporting evidence. Checkpoint 5 did not change
`TEAM_DOC_ARCHIVE_MANIFEST.json` or `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.

## Whitespace Check

Command:

```sh
git diff --check
```

Exit status: 0
