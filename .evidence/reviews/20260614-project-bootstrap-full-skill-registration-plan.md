# Project Bootstrap Full Skill Registration Plan

## Request

Improve `project-bootstrap` so pod-native OpenClaw skills from
`mobile-app-dev-team/09-pod-native-openclaw-skills/` are registered under
`/workspace/skills/` according to repo SoT.

## SoT Inputs

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`

## Initial Plan Review

Reviewer: `wm-implementation-reviewer`
Mode: `plan`
Verdict: `NO_GO`

Findings addressed:

- `pnpm run test:local-harness` must be a required gate for this runtime/evals/scripts change.
- The full README `Current Skills` set must drive setup registration and report/preflight status.
- Preflight must explicitly report/block missing `codex-role-workflow`.

## Revised Plan

Scope:

- Update only repo-local pod-native runtime skill files, validators, docs, and evals.
- No external platform/runtime repositories.
- No package/system install.
- No secret-bearing output.

Full pod-native skill list from README:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`
- `eas-robot-auth-setup`
- `stitch-adc-setup`
- `codex-role-workflow`

Tests first:

- Update `evals/skills/project-bootstrap-agent-setup-smoke.sh` so clone/setup
  registration expects all six README skills under the configured skills root.
- Add direct preflight assertion that missing `codex-role-workflow` is surfaced
  as a required `/workspace/skills/codex-role-workflow` blocker.

Implementation:

- Update `project-bootstrap-agent-setup.sh` so the full pod-native skill list
  is registered from the repo source into `PROJECT_BOOTSTRAP_SKILLS_ROOT`.
- Include all six skill statuses in `workspace_skills`.
- Update `project-bootstrap-preflight.sh` so `pod_skills` includes
  `codex-role-workflow` and missing `codex-role-workflow` blocks consistently.
- Update `SKILL.md`, `references/report-template.md`,
  `mobile-app-dev-team/16-pod-environment-bootstrap.md`, and
  `scripts/validate-team-doc.mjs` as needed so docs and validators reflect the
  full skill registration contract.

Checkpoint boundaries:

1. Test/eval expectations updated.
2. Setup/preflight implementation updated.
3. Docs/templates/validator sync updated.
4. Verification and final reviewer.

Required verification:

- `bash -n` for touched shell scripts.
- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `pnpm run validate:team-doc`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`

If any required gate cannot run, persist the exact blocked reason and do not
mark the goal complete.
