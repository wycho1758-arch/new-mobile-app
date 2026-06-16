# Runtime Surface Structure Checkpoint 3-F Pod-Native Command Output

Date: 2026-06-16

Scope:

- Moved `mobile-app-dev-team/09-pod-native-openclaw-skills/` to
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/`.
- Updated active pod-native source references in root policy docs, project
  environment docs, repo operations docs, source map, team README, runtime
  surface/reference reports, durable work-unit docs, validators, and smoke
  fixtures.
- Updated the pod-native sync/bootstrap scripts so their default source root is
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills`.
- Kept old-path mentions only in the approved goal-plan mapping/risk note,
  validator legacy/stale checks, and the invalid legacy-only structure fixture.
- Did not move `99-source-map.md`, role SOUL files, app code, package code, API
  contracts, native runtime behavior, or infra.

## RED Validator Check

Command:

```sh
pnpm run validate:team-doc
```

Exit status: 1, expected after validators were updated and before the physical
pod-native source-root move.

Output excerpt:

```text
Validated team-doc structure fixtures.
Validated mobile-app-dev-team structure registry.
- pod-native runtime source must be reclassified out of legacy path: mobile-app-dev-team/09-pod-native-openclaw-skills
- missing required pod-native runtime source: mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md
- missing required pod-native skill: mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md
- missing required pod-native skill: mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md
- missing required pod-native skill: mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md
- missing required pod-native role workflow skill: mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md
- missing required pod-native runtime spec: mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/product-planning-agent-runtime-spec.md
validate-team-doc failed at runtime source docs
```

## Structure Snapshot

Command:

```sh
find mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills -maxdepth 3 -type f | sort
```

Exit status: 0

Output excerpt:

```text
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/product-planning-agent-runtime-spec.md
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/qa-release-agent-runtime-spec.md
```

## Staged Rename Summary

Command:

```sh
git diff --cached --name-status --find-renames -- mobile-app-dev-team/09-pod-native-openclaw-skills mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills
```

Exit status: 0

Output excerpt:

```text
R100	mobile-app-dev-team/09-pod-native-openclaw-skills/README.md	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md
R100	mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md
R100	mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh
R087	mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md
R092	mobile-app-dev-team/09-pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md
R096	mobile-app-dev-team/09-pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
R099	mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md
R099	mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
R099	mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh	mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

All 28 files under the old pod-native source root are staged as renames into
`runtime-sources/pod-native-openclaw-skills/`; lower similarity scores are from
path-reference updates inside the moved files.

## Stale Reference Scan

The first xhigh review found that the original scan omitted root `CLAUDE.md`.
`CLAUDE.md` was updated to
`mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`, and
the corrected scan below includes `CLAUDE.md`.

Command:

```sh
rg -n "09-pod-native-openclaw-skills" CLAUDE.md AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex .claude mobile-app-dev-team docs evals package.json .github --glob '!mobile-app-dev-team/_archive/**' --glob '!docs/plans/active/**' --glob '!.evidence/**'
```

Exit status: 0

Output:

```text
scripts/validate-team-doc-managed.mjs:192:const legacyPodNativeOpenClawSkillRoot = `${managedTeamDocRoot}/09-pod-native-openclaw-skills`;
scripts/validate-runtime-sources.mjs:20:const legacyPodNativeRoot = `${teamRoot}/09-pod-native-openclaw-skills`;
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:141:| `mobile-app-dev-team/09-pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md` | repo-authored pod-native skill source가 `/workspace/skills`로 copy-sync되는 bridge |
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:142:| `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md` | `/workspace/SOUL.md`에서 canonical role slug를 유도하고 `/workspace/skills`를 사용한다는 runtime 기준 |
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:201:  09-pod-native-openclaw-skills/
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:335:| `09-pod-native-openclaw-skills/` | `runtime-sources/pod-native-openclaw-skills/` | pod-native runtime source | strong |
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:648:  기존 `09-pod-native-openclaw-skills/`를 제거하면 안 된다.
mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md:814:| `09-pod-native-openclaw-skills` rename으로 skill sync 깨짐 | High | compatibility window, smoke first, reviewer checkpoint |
evals/team-doc-structure/fixtures/invalid-pod-native-legacy-only.json:11:    "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md": "---\nname: project-bootstrap\ndescription: fixture\n---\n"
scripts/validate-team-doc-structure.mjs:21:  { legacyPath: `${teamRoot}/09-pod-native-openclaw-skills/`, targetPath: `${teamRoot}/runtime-sources/pod-native-openclaw-skills/`, kind: 'dir', surfaceClass: 'R1', strength: 'strong' },
```

Remaining matches are the Checkpoint 3-F old-to-new plan mapping/risk note,
validator legacy-root rejection/registry checks, and the invalid legacy-only
fixture. No active root policy, root `CLAUDE.md`, repo operations, project
environment, smoke script, source map, README, durable work-unit doc, `.claude`,
`.agents`, or `.codex` reference remains on the old pod-native path.

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

## Pod-Native Smokes

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

The project-bootstrap smoke printed unauthenticated Railway/gcloud status probes
and still exited 0.

## Whitespace Checks

Commands:

```sh
git diff --check
git diff --cached --check
```

Exit status: 0

## Evidence Hygiene

Command:

```sh
pnpm run validate:evidence-hygiene
```

Exit status: 0

Output excerpt:

```text
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

## Rerun After Reviewer NO_GO Fix

The first xhigh review returned `NO_GO` because root `CLAUDE.md` still
referenced `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` and the
stale-reference scan did not include `CLAUDE.md`. `CLAUDE.md` now references
`mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`.

Commands:

```sh
pnpm run validate:team-doc
pnpm run test:runtime
pnpm run test:local-harness
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
```

## Not Applicable Boundaries

- Checkpoint 5 source-map filename movement is not applicable; `99-source-map.md`
  remains in place.
- Role SOUL movement already completed in Checkpoint 3-E.
- Archive reclassification already completed in Checkpoint 3-D.
- App code, package code, API contracts, native runtime behavior, infra, live
  OpenClaw pod proof, and external platform proof were not changed.
