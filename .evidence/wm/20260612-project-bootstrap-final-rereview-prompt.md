# Final Rereview Request: project-bootstrap pod-native skill

Review mode: xhigh / read-only.

## Prior Final Review

Prior final review:
`.evidence/wm/20260612-project-bootstrap-final-review.md`

Verdict was `NO_GO` with three Medium findings:

1. Role-specific readiness could be skipped for lowercase pod role identifiers
   such as `design` and `qa-release`.
2. `project-bootstrap-preflight.sh` did not verify repo SoT files despite the
   runbook saying it verifies `PROJECT_ENVIRONMENT.md`.
3. Required gate results were summarized but not backed by durable
   command-output artifacts with exit status.

## Fixes Since Prior Review

- Updated `project-bootstrap-preflight.sh` to normalize role values. It now maps
  `Design`, `design`, and `product-designer` to Stitch-required readiness, and
  maps `QA/Release`, `qa-release`, `qa`, and `release` to EAS-required
  readiness.
- Updated `project-bootstrap-preflight.sh` to check repo SoT files under
  `REPO_PATH`:
  - `AGENTS.md`
  - `REPO_OPERATIONS.md`
  - `PROJECT_ENVIRONMENT.md`
  - `.codex/config.toml`
  - `docs/TEMPLATE_VARIABLES.md`
  - `docs/CREDENTIALS.md`
  - `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- Added `repo_sot_files` and normalized role fields to the project bootstrap
  report shape.
- Updated `project-bootstrap` SKILL and report template to document role aliases
  and repo SoT file evidence.
- Updated validators so `project-bootstrap` must include `qa-release`,
  `repo_sot_files`, `REPO_OPERATIONS.md`, and `.codex/config.toml`.
- Captured durable command-output evidence with exit status.

## Evidence

Gate evidence:

- `.evidence/wm/project-bootstrap/20260612-command-output.md`
  - `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`: exit 0
  - `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`: exit 0
  - `pnpm run validate:team-doc`: exit 0
  - `pnpm run validate:repo-operations`: exit 0
  - `pnpm run test:runtime`: exit 0
  - `pnpm run test:local-harness`: exit 0
  - `pnpm turbo run lint test`: exit 0

Smoke evidence:

- `.evidence/wm/project-bootstrap/20260612-smoke-output.md`
  - `WM_ROLE=design` produced `requires_stitch: true` and present repo SoT file statuses.
  - `WM_ROLE=qa-release` produced `requires_eas: true` and present repo SoT file statuses.
  - Both smoke runs exited 0 and intentionally remained `blocked` because this
    local Mac is not a boram pod with `/workspace/skills/*` artifacts.

## Non-Claims

- No live OrbStack `boram-*` pod was modified or tested.
- No live external EAS, Railway, Stitch, Jira, Confluence, GitHub branch
  protection, store submit, pod rollout, image, webhook, or production action
  was performed.
- This is source/runtime preparation for later boram pod testing, not live pod
  readiness proof.

## Review Questions

1. Are the prior three Medium findings resolved?
2. Does the implementation satisfy the SoT-based target of a pod-native
   `project-bootstrap` skill for later `boram-*` tests?
3. Are any repo-local `.agents/skills` or `.codex/agents` changes still required?
4. Are there any Critical, High, or Medium issues blocking handoff?
