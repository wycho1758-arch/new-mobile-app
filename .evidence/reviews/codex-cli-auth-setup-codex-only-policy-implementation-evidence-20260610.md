# codex-cli-auth-setup Codex-only policy implementation evidence

Date: 2026-06-10

## Scope

Changed paths:

- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md`

Evidence paths:

- `.evidence/reviews/codex-cli-auth-setup-codex-only-policy-plan-rereview-20260610.md`
- `.evidence/reviews/codex-cli-auth-setup-codex-only-policy-implementation-evidence-20260610.md`
- `.evidence/reviews/codex-cli-auth-setup-codex-only-policy-final-review-20260610.md`

## OrbStack pod observations

Commands were run against kube context `orbstack`, namespace `clawpod`, pod `boram-vf7sbm-agent-0`, container `agent`.

Observed non-secret state:

- `/workspace/AGENTS.md` exists.
- `/workspace/CODEX_MANAGED_PATHS.md` exists.
- `/workspace/codex-hooks/codex-run` exists.
- `/workspace/codex-hooks/AGENT-INTEGRATION-GUIDE.md` exists.
- `/workspace/skills/codex-cli-auth-setup/SKILL.md` exists.
- `/workspace/AGENTS.md` already contains `## Codex-only Repo Work Policy`.
- `/workspace/AGENTS.md` uses `this agent MUST use Codex CLI as the execution engine`.
- `/workspace/AGENTS.md` references `/workspace/CODEX_MANAGED_PATHS.md`.
- `/workspace/AGENTS.md` defaults to `/workspace/codex-hooks/codex-run` when available.
- `/workspace/CODEX_MANAGED_PATHS.md` currently contains examples only and does not include `/workspace/new-mobile-app/`.
- No git worktree under `/workspace` was observed during `find /workspace -maxdepth 4 -name .git`.

Boundary: these observations describe the current boram-* pod state only. They do not prove other OpenClaw agents or future pods are configured.

## TDD evidence

After adding validator assertions and before updating the skill document, `pnpm run validate:team-doc` failed as expected with missing terms:

- `## OpenClaw AGENTS.md Codex-only Repo Work Policy`
- `this agent MUST use Codex CLI as the execution engine`
- `/workspace/CODEX_MANAGED_PATHS.md`
- `/workspace/codex-hooks/codex-run`
- `/workspace/new-mobile-app/`
- `Project path`

## Implementation summary

- Added positive validator assertions requiring the codex-cli-auth-setup skill to document the OpenClaw AGENTS.md Codex-only repo policy, managed paths registry, hook wrapper, and `/workspace/new-mobile-app/` project path.
- Added forbidden-term checks for `Boram MUST`, `Boram must`, `Boram SHOULD`, and `Boram should`.
- Added an explicit regex validator that fails if the skill uses `Boram` as the policy subject with MUST/SHOULD wording.
- Added a new skill section with agent-neutral AGENTS.md guidance using `this agent`.
- Added project path setup guidance that requires the GitHub repository checkout path and CODEX-managed path entry to be `/workspace/new-mobile-app/`.

## Verification

`pnpm run validate:team-doc`: PASS

Key output:

```text
Validated team-doc: 71 source files, 32 structured files.
```

`pnpm run test:runtime`: PASS

Key output:

```text
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated team-doc: 71 source files, 32 structured files.
Passed 44 hook fixture tests.
```

`pnpm run test:local-harness`: PASS

Key output:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated team-doc: 71 source files, 32 structured files.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
```

## Dirty worktree note

The worktree had pre-existing unrelated modifications before this task, including staged reviewer JSON envelope/runtime files and unstaged `ref-organization` changes in `scripts/validate-team-doc.mjs`. This change did not revert or modify those unrelated edits.
