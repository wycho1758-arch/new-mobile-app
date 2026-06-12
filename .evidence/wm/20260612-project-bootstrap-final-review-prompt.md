# Final Review Request: project-bootstrap pod-native skill

Review mode: xhigh / read-only.

## Request

Validate whether the implemented `project-bootstrap` pod-native OpenClaw skill
and SoT synchronization are sufficient to prepare later OrbStack `boram-*`
testing for WonderMove `new-mobile-app`.

## User Goal

- Create a plan and proceed with a skill for bootstrapping the project in
  OrbStack `boram-*`, not local `/workspace`.
- The skill must cover git repo clone/readiness, Codex CLI/auth readiness,
  project setup, MCP/CLI/account status coverage, and QC checklist.
- Check whether current skills or agents need changes based on SoT.
- Final review must use Reviewer(xhigh).

## SoT Basis

- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `PROJECT_ENVIRONMENT.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/17-orbstack-pod-config-values.md`
- `mobile-app-dev-team/18-orbstack-pod-config-setup-runbook-plan.md`
- `.agents/skills/` and `.codex/agents/` were checked for whether repo-local
  skill/agent changes are needed. The implementation keeps the new runtime
  artifact as pod-native only under
  `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/`.

## Plan Review Evidence

- Initial plan: `.evidence/wm/20260612-project-bootstrap-implementation-plan.md`
- Initial review: `.evidence/wm/20260612-project-bootstrap-implementation-plan-review.md`
  returned `NO_GO` for missing full workspace gate and missing
  `PROJECT_ENVIRONMENT.md` sync.
- Rereview: `.evidence/wm/20260612-project-bootstrap-implementation-plan-rereview.md`
  returned `GO`.

## Implemented Changes

- Added `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`.
- Added `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`.
- Added `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`.
- Updated pod skill matrix and source map.
- Updated pod environment bootstrap, OrbStack config values, and OrbStack setup
  runbook to include `project-bootstrap`, `/workspace/projects/Wondermove-Inc/new-mobile-app`,
  `/workspace/CODEX_MANAGED_PATHS.md`, and
  `/workspace/state/project-bootstrap-report.json`.
- Updated `PROJECT_ENVIRONMENT.md` and `docs/CODEX_MCP_ENVIRONMENT.md` with the
  pod-native project bootstrap source/runtime shape.
- Updated validators to require the new project-bootstrap artifacts and current
  boram repo path.
- Updated current pod-native skill docs/scripts from historical
  `/workspace/new-mobile-app` to `/workspace/projects/Wondermove-Inc/new-mobile-app`.

## Verification

Passed:

- `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`
- `pnpm run validate:team-doc`
- `pnpm run validate:repo-operations`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`

Additional smoke:

- Ran `project-bootstrap-preflight.sh` with local repo path and temp managed
  path registry. It exited 0 and produced `project-bootstrap/v1` JSON with
  `status: blocked`, `repo.path_status: present`, and
  `repo.managed_path.status: present`. Blockers were expected because this Mac
  environment does not have `/workspace/skills/project-bootstrap`,
  `/workspace/skills/codex-cli-auth-setup`, `/workspace/skills/pod-role-bootstrap`,
  or required Codex MCPs as pod-local `/workspace` artifacts.

## Non-Claims

- No live OrbStack `boram-*` pod was modified or tested.
- No live external EAS, Railway, Stitch, Jira, Confluence, GitHub branch
  protection, store submit, pod rollout, image, webhook, or production action
  was performed.
- This is source/runtime preparation for later boram pod testing, not live pod
  readiness proof.

## Review Questions

1. Does the implementation satisfy the SoT-based target of a pod-native
   `project-bootstrap` skill for later `boram-*` tests?
2. Are any repo-local `.agents/skills` or `.codex/agents` changes still required?
3. Are there any Critical, High, or Medium issues blocking handoff?
