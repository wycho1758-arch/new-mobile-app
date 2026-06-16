# Pod-Native OpenClaw Skills

This folder is source-only documentation for pod-native OpenClaw skills whose runtime shape is:

```text
/workspace/skills/<slug>/SKILL.md
```

Do not place repo-local Codex CLI artifacts here. Codex CLI native skills and agents belong under `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.

## Start Here

Normal user-facing setup after clone or pull starts from `openclaw-pod-skills-sync`, then `project-bootstrap`. The other common setup
skills remain dependency/internal setup contracts that `project-bootstrap` uses
for secret-safe checks and reusable readiness reports. Invoke
`codex-cli-auth-setup` or `pod-role-bootstrap` directly only for advanced recovery paths
or focused diagnostics.

## Copy-Paste Safe Setup Commands

Use these commands from a fresh OpenClaw pod after choosing one canonical
`role_slug` from the Role Slug Resolution Table below. Do not copy the
`<canonical-role-slug>` placeholder literally. Also replace the
`<current-user-language> placeholder` with a real current user language hint
such as `ko-KR` or `en-US`; do not copy that placeholder literally.

```bash
export REPO_CLONE_URL="https://github.com/Wondermove-Inc/new-mobile-app.git"
export REPO_PATH="/workspace/projects/Wondermove-Inc/new-mobile-app"
export CODEX_MANAGED_PATHS="/workspace/CODEX_MANAGED_PATHS.md"
export PROJECT_BOOTSTRAP_REPORT_PATH="/workspace/state/project-bootstrap-report.json"
export PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="/workspace/state/project-bootstrap-blockers.md"
export PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"
export PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="<current-user-language>"

if [ ! -d "${REPO_PATH}/.git" ]; then
  mkdir -p "$(dirname "${REPO_PATH}")"
  git clone "${REPO_CLONE_URL}" "${REPO_PATH}"
else
  git -C "${REPO_PATH}" pull --ff-only
fi

cd "${REPO_PATH}"
bash /workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
```

Then run the role setup and project bootstrap preflight:

```bash
role_slug="<canonical-role-slug>"

PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}" \
PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md" \
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh

source /workspace/state/project-bootstrap-role.env
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

These commands do not approve package installation, write secrets, or bypass
human-owned authentication. If a bootstrap step reports that an install,
account login, external auth surface, or secret is required, stop and report the
translated blocker plus the minimum user-owned request instead of inventing a
credential or proceeding with role work.

## Role Slug Resolution Table

Use the canonical role slug exactly as shown. The matching runtime spec source
path is the Source of Truth for what the role may read next after
`project-bootstrap` is ready.

| Operating Role | Canonical role slug | Runtime spec source path |
| --- | --- | --- |
| Product/Planning | `product-planning` | `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/product-planning-agent-runtime-spec.md` |
| Design | `design` | `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/design-agent-runtime-spec.md` |
| Mobile Architect | `mobile-architect` | `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/mobile-architect-agent-runtime-spec.md` |
| Mobile App Dev | `mobile-app-dev` | `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/mobile-app-dev-agent-runtime-spec.md` |
| Backend/API Integrator | `backend-api-integrator` | `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/backend-api-integrator-agent-runtime-spec.md` |
| QA/Release | `qa-release` | `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/qa-release-agent-runtime-spec.md` |

## Where To Read Runtime Specs

After `project-bootstrap` completes or reports a translated blocker with a next
action, read the matching role runtime specification in this folder before role
work starts. Do not infer the role from a display title, shell prompt, agent
name, or partial user wording when the canonical slug has not been resolved.

Then apply `/workspace/skills/codex-role-workflow/SKILL.md` to resolve the
allowed repo-local skill, reviewer, durable artifact stage, stop conditions, and
next action for that bootstrapped role.

Reading every runtime specification is not authorization to perform every role.
The agent should read only the matching role runtime specification, then
`codex-role-workflow`, and then follow the resolved allowed repo-local skill,
reviewer, durable artifact stage, and stop rules.

## Stop Rules When Project Bootstrap Is Blocked

If `project-bootstrap is blocked`, role work is forbidden. Do not begin role
planning, design work, implementation, EAS work, Stitch work, QA execution,
external publication, or repo-local role skills as a substitute for a ready
bootstrap result.

When setup is blocked, pod agents must give a user-understandable translated
blocker instead of raw blocker names. The result must explain:

- what happened;
- what the agent can still do with local CLI/browser/computer-use/MCP tools;
- the minimum user-owned request or action needed from the user;
- how the agent continues after that action is completed;
- the raw technical blockers only as support details, never as the main answer.

Use `project-bootstrap/references/blocker-resolution-guide.md` and, when
present, `${PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH:-/workspace/state/project-bootstrap-blockers.md}`
for blocker translation. Ask for the smallest user-owned action that can unblock
setup. Examples include approving a named install plan, completing a browser
login, mounting a human-owned credential file, or confirming that a missing
external account is intentionally unavailable.

## Mandatory Report Checklist

Every pod setup report based on this README must include:

- repository path used: `/workspace/projects/Wondermove-Inc/new-mobile-app`;
- `/workspace/skills` sync status and the report path
  `/workspace/state/openclaw-pod-skills-sync-report.json`;
- selected canonical `role_slug` and matching runtime spec source path;
- role setup report path:
  `/workspace/state/project-bootstrap-agent-setup-report.json`;
- project bootstrap report path:
  `/workspace/state/project-bootstrap-report.json`;
- blocker report path when blocked:
  `/workspace/state/project-bootstrap-blockers.md`;
- commands run for clone or pull, skill sync, role setup, and bootstrap
  preflight, with exit status when available;
- `project-bootstrap` status: ready or blocked;
- if blocked, the translated blocker and minimum user-owned request;
- install and auth approval status, without secret values;
- local proof boundary: local validation cannot prove live OpenClaw pod
  execution, external auth surfaces, GitHub branch protection, EAS submit, or
  other external platform state;
- next action: read the matching runtime spec and
  `/workspace/skills/codex-role-workflow/SKILL.md` only when ready, otherwise
  wait for the user-owned unblock action and rerun setup.

## Human-Owned Auth And Secret Safety Examples

Do not send secrets in chat, reports, logs, PRs, or evidence. Human-owned auth
and secret material must be handled by the user or by an approved mounted
runtime surface, not pasted into agent instructions.

- GitHub auth unavailable: report that GitHub authentication is required and
  ask the user to complete the login or provide an approved mounted auth surface.
  Do not ask for token values in chat.
- Railway auth unavailable: the agent may report or start the approved login
  surface when requested, but the user completes authentication. Do not print or
  store Railway token values in evidence.
- Google ADC or Stitch auth unavailable: ask the user to complete the approved
  Google login or mount the approved credential file. Do not paste ADC JSON or
  service account JSON into chat.
- Expo or EAS auth unavailable: ask the user to complete the approved Expo auth
  path or provide the approved runtime secret surface. Do not paste Expo token
  values into chat or reports.
- Atlassian remote auth unavailable: ask the user to complete the approved
  OAuth or connector login. Do not paste OAuth codes or access token values into
  chat.
- Package installation required: report the exact package or command, reason,
  and target. Wait for explicit user approval before setting an install approval
  environment variable or running the install.

## Current Skills

| Skill | Runtime Shape | Purpose |
| --- | --- | --- |
| `openclaw-pod-skills-sync` | `/workspace/skills/openclaw-pod-skills-sync/SKILL.md` | Copy-sync the repo SoT pod-native skills into the `/workspace/skills` runtime snapshot and verify the clone/pull setup rule before `project-bootstrap`. |
| `codex-cli-auth-setup` | `/workspace/skills/codex-cli-auth-setup/SKILL.md` | Verify Codex CLI readiness and, after explicit approval, install or update Codex CLI in an OpenClaw agent pod without exposing secrets. |
| `pod-role-bootstrap` | `/workspace/skills/pod-role-bootstrap/SKILL.md` | Resolve the role pod identity, align pnpm to the repo pin, install repo dependencies only after explicit approval, run `codex-preflight --pod`, and write a status-only readiness report. |
| `project-bootstrap` | `/workspace/skills/project-bootstrap/SKILL.md` | Orchestrate project-level boram pod readiness by checking the repo path, managed path, required pod skills, required/conditional MCPs, external CLI/account status, role-specific setup reports, and human gates without exposing secrets. |
| `eas-robot-auth-setup` | `/workspace/skills/eas-robot-auth-setup/SKILL.md` | Verify QA/Release EAS CLI and Expo robot auth readiness as status only before any human-gated EAS/Maestro run. |
| `stitch-adc-setup` | `/workspace/skills/stitch-adc-setup/SKILL.md` | Verify Design Google ADC and Stitch MCP readiness as status only before any approved Stitch handoff run. |
| `codex-role-workflow` | `/workspace/skills/codex-role-workflow/SKILL.md` | Resolve a role pod to allowed repo-local Codex skills, reviewers, durable artifact stage, stop conditions, and status-only next action without doing role work. |

## Per-Role Required Pod Skills

This is the canonical per-role pod-native skill dependency matrix.
`runtime-sources/codex-skill-agent-matrix.md` links here instead of duplicating the table.
It is not the normal user-facing execution order; normal setup uses
`openclaw-pod-skills-sync`, then `project-bootstrap` as the entry point.
The matrix below lists role-specific required skills after the common sync
prerequisite.

| Operating Role | Required pod-native skills |
| --- | --- |
| Product/Planning | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| Design | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |
| Mobile Architect | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| Mobile App Dev | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| Backend/API Integrator | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| QA/Release | `codex-cli-auth-setup`, `pod-role-bootstrap`, `eas-robot-auth-setup`, `codex-role-workflow` |
