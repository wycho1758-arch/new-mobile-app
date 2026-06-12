# Pod-side doc/skill realignment final review prompt

Review mode: final.

Review the completed repo-scoped update for pod-side docs, pod-native skills,
role souls, and validator coverage. Operate read-only, cite sources, and return
one valid reviewer JSON envelope.

## Scope

Baseline: `723acc122d0eb108aec496cb92fcbed1caeb5a08`

Changed paths:

- `scripts/validate-team-doc.mjs`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/README.md`
- `mobile-app-dev-team/99-source-map.md`
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `mobile-app-dev-team/02-role-souls/*.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/eas-robot-auth-setup/**`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/stitch-adc-setup/**`

## Previous NO_GO Findings Addressed

1. Clone-on-demand now requires explicit `REPO_CLONE_URL`, writes
   `repo_acquisition`, and blocks readiness unless `/workspace/CODEX_MANAGED_PATHS.md`
   contains `/workspace/projects/Wondermove-Inc/new-mobile-app/`.
2. Baseline dirty state was rechecked before implementation. `git status --short`
   was clean at the start of this resumed work.

## Verified SoT

- `AGENTS.md:5` defines pod-native `/workspace/skills/<slug>/SKILL.md` runtime shape and `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` source.
- `AGENTS.md:13` requires tests or validators before implementation changes.
- `AGENTS.md:57` through `AGENTS.md:60` define local harness limits and say it does not prove OpenClaw packaging behavior.
- `REPO_OPERATIONS.md:85` through `REPO_OPERATIONS.md:95` define Codex-only pod repo work, `/workspace/CODEX_MANAGED_PATHS.md`, `/workspace/projects/Wondermove-Inc/new-mobile-app/`, `/workspace/codex-hooks/codex-run`, and redacted status reporting.
- `REPO_OPERATIONS.md:135` through `REPO_OPERATIONS.md:140` define local harness requirement and non-claim limits.
- `PROJECT_ENVIRONMENT.md:219` through `PROJECT_ENVIRONMENT.md:225` define `$wm` SoT-grounded planning and review evidence.

## Actual Boram Observation

Read-only `kubectl exec` against `clawpod/boram-vf7sbm-agent-0`, `agent`
container still showed:

- `/workspace/skills/codex-cli-auth-setup/SKILL.md` exists.
- `pod-role-bootstrap`, `eas-robot-auth-setup`, and `stitch-adc-setup` are absent from the live pod.
- `/workspace/projects/Wondermove-Inc/new-mobile-app` is missing.
- `/workspace/CODEX_MANAGED_PATHS.md` contains only template comments and no `/workspace/projects/Wondermove-Inc/new-mobile-app/` entry.

This implementation updates repo source/docs/validators only. It does not claim
the live pod has been updated.

## Tests And Evidence

RED evidence:

- `pnpm run validate:team-doc` failed after validator-first changes with missing
  doc16, missing new skill files, missing clone/readiness terms, stale deferred
  OpenClaw text, missing role soul terms, and `/workspace/repo` drift.

GREEN evidence:

- `pnpm run validate:team-doc` exit 0:
  `Validated current mobile-app-dev-team managed docs.`
- `pnpm run test:runtime` exit 0:
  validated runtime artifacts, repo operations, team docs, work units,
  work-unit next resolver, EAS evidence fixtures, project environment drift,
  evidence hygiene, and 44 hook fixture tests.
- `pnpm run test:local-harness` exit 0:
  clean-tree guard self-test, codex preflight self-test, codex preflight,
  `test:runtime`, `pnpm turbo run lint test`, local harness self-test, and
  local harness all passed.
- Negative drift check:
  `rg -n "team-doc/mobile-app-dev-team|/workspace/repo\\b|OpenClaw skills are intentionally deferred|Do not invent OpenClaw skill names" mobile-app-dev-team docs/CODEX_MCP_ENVIRONMENT.md || true`
  returned no matches.

## Review Questions

1. Does the diff close the two prior Medium findings?
2. Are the changes repo-scoped and consistent with SoT?
3. Are tests/evidence sufficient for this runtime/docs change?
4. Are there any Critical/High/Medium findings blocking completion?
