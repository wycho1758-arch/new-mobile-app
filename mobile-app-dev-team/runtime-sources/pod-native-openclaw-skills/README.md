# Pod-Native OpenClaw Skills

This folder is source-only documentation for pod-native OpenClaw skills whose runtime shape is:

```text
/workspace/skills/<slug>/SKILL.md
```

The organizations and reporting guidance source for pod work lives next to the
runtime sources:

```text
mobile-app-dev-team/runtime-sources/ORGANIZATIONS.md
```

`openclaw-pod-skills-sync` copies that guidance to:

```text
/workspace/ORGANIZATIONS.md
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
export OPENCLAW_ORGANIZATIONS_SOURCE_PATH="${REPO_PATH}/mobile-app-dev-team/runtime-sources/ORGANIZATIONS.md"
export OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH="/workspace/ORGANIZATIONS.md"
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

# Create or verify the role operator's own GitHub fork after clone or pull.
# This gives the pod a writable repo remote for commits and PR branches even
# when it does not have direct write access to the organization repository.
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  if ! gh repo view "$(gh api user --jq .login)/new-mobile-app" >/dev/null 2>&1; then
    gh repo fork --remote --remote-name fork --default-branch-only
  elif ! git remote get-url fork >/dev/null 2>&1; then
    git remote add fork "https://github.com/$(gh api user --jq .login)/new-mobile-app.git"
  fi
  git remote -v | grep -E '^(origin|fork)[[:space:]]'
else
  printf '%s\n' "GitHub CLI auth is unavailable; ask the Product Delivery Lead for the approved GitHub auth path before creating the role operator fork." >&2
fi

if [ -x "${REPO_PATH}/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh" ]; then
  bash "${REPO_PATH}/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh"
elif [ -x /workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh ]; then
  bash /workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
else
  printf '%s\n' "openclaw-pod-skills-sync script is missing from repo source and /workspace/skills." >&2
  exit 1
fi
```

In a fresh pod, the first sync should prefer the repo source script because the
runtime `/workspace/skills/openclaw-pod-skills-sync` copy may not exist yet. The
runtime path is only the fallback after a previous successful sync created it.

Then run the role setup and project bootstrap preflight:

```bash
role_slug="<canonical-role-slug>"

PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}" \
PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md" \
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh

source /workspace/state/project-bootstrap-role.env
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

These commands do not write secrets or bypass human-owned authentication. If a
bootstrap step reports that an install is required, complete the required
installation so the pod environment can converge with the Product Delivery Lead's
standard environment. If authentication, an external auth surface, or a secret is
required, ask the Product Delivery Lead for the approved path and follow that
instruction instead of inventing a credential or proceeding with role work.

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

## Escalation And Environment Consistency

When setup reports a blocker, the role pod must ask the Product Delivery Lead
for direction and then follow that direction. Do not route blocker questions to a
named individual in this README; route by role to the Product Delivery Lead.

The Product Delivery Lead owns cross-pod environment consistency. The Product
Delivery Lead should make sure every role pod uses the same setup policy,
required CLI baseline, install decisions, authentication path, reporting format,
and rerun order after clone or pull.

Required installations should be completed rather than left as permanent setup
blockers. If an install is needed to satisfy `project-bootstrap`, the role pod
should report the exact install requirement to the Product Delivery Lead, receive
the approved install direction, perform the installation to completion, and then
rerun setup/preflight.

Authentication-related setup is different from installation. If GitHub, Railway,
Google Cloud, Google ADC, Stitch, Expo, EAS, Atlassian, or another external auth
surface is required, the role pod must ask the Product Delivery Lead for the
approved auth path. The Product Delivery Lead coordinates the human-owned login
or mounted credential surface. Role pods must not request, paste, print, store,
or commit token values, passwords, ADC JSON, service account JSON, OAuth codes,
or other secrets.

## Stop Rules When Project Bootstrap Is Blocked

If `project-bootstrap is blocked`, role work is forbidden. Do not begin role
planning, design work, implementation, EAS work, Stitch work, QA execution,
external publication, or repo-local role skills as a substitute for a ready
bootstrap result.

When setup is blocked, pod agents must give a user-understandable translated
blocker instead of raw blocker names. The result must explain:

- what happened;
- what the agent can still do with local CLI/browser/computer-use/MCP tools;
- the minimum Product Delivery Lead direction, install action, or human-owned auth action needed;
- how the agent continues after that action is completed;
- the raw technical blockers only as support details, never as the main answer.

The final user-understandable result should ask for the minimum request/action
that unblocks the next concrete setup step.

Use `project-bootstrap/references/blocker-resolution-guide.md` and, when
present, `${PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH:-/workspace/state/project-bootstrap-blockers.md}`
for blocker translation. Ask for the smallest user-owned action that can unblock
setup. Examples include Product Delivery Lead direction for a named install
plan, completing a browser login, mounting a human-owned credential file, or
confirming that a missing external account is intentionally unavailable.

## Mandatory Report Checklist

Every pod setup report based on this README must include:

- repository path used: `/workspace/projects/Wondermove-Inc/new-mobile-app`;
- `/workspace/skills` sync status and the report path
  `/workspace/state/openclaw-pod-skills-sync-report.json`;
- `/workspace/ORGANIZATIONS.md` sync status, source path
  `mobile-app-dev-team/runtime-sources/ORGANIZATIONS.md`, and guidance-only
  boundary;
- selected canonical `role_slug` and matching runtime spec source path;
- role setup report path:
  `/workspace/state/project-bootstrap-agent-setup-report.json`;
- project bootstrap report path:
  `/workspace/state/project-bootstrap-report.json`;
- Stitch ADC setup report path and status:
  `/workspace/state/stitch-adc-setup-report.json`;
- blocker report path when blocked:
  `/workspace/state/project-bootstrap-blockers.md`;
- commands run for clone or pull, skill sync, role setup, and bootstrap
  preflight, with exit status when available;
- clone or pull report fields: before/after commit, fetched branches, pruned branches, and changed files summary;
- repo packageManager pin and active pnpm version, including mismatch and whether any alignment was performed;
- `project-bootstrap` status: ready or blocked;
- if blocked, the translated blocker and minimum Product Delivery Lead direction, install action, or human-owned auth action;
- install and auth approval status, without secret values;
- local proof boundary: local validation cannot prove live OpenClaw pod
  execution, external auth surfaces, GitHub branch protection, EAS submit, or
  other external platform state;
- next action: read the matching runtime spec and
  `/workspace/skills/codex-role-workflow/SKILL.md` only when ready, otherwise
  ask the Product Delivery Lead for the required install/auth direction and rerun
  setup after the unblock action is complete.

## Human-Owned Auth And Secret Safety Examples

Do not send secrets in chat, reports, logs, PRs, or evidence. Human-owned auth
and secret material must be handled by the user or by an approved mounted
runtime surface, not pasted into agent instructions.

- GitHub auth unavailable: report that GitHub authentication is required and
  ask the Product Delivery Lead for the approved login or mounted auth surface.
  Do not ask for token values in chat.
- Railway CLI missing: install the required Railway CLI according to Product
  Delivery Lead direction, then rerun setup/preflight. Railway authentication
  still requires the approved human-owned login path. Do not print or store
  Railway token values in evidence.
- Railway auth unavailable: ask the Product Delivery Lead for the approved login
  path. The human owner completes authentication through the approved surface.
- Google Cloud CLI missing: install `gcloud` from the Product Delivery Lead's
  approved official source, then rerun setup/preflight.
- Google ADC or Stitch auth unavailable: ask the Product Delivery Lead for the
  approved Google login or mounted credential path. Do not paste ADC JSON or
  service account JSON into chat.
- Expo or EAS auth unavailable: ask the Product Delivery Lead for the approved
  Expo/EAS auth path or runtime secret surface. Do not paste Expo token values
  into chat or reports.
- Atlassian remote auth unavailable: ask the Product Delivery Lead for the
  approved OAuth or connector login path. Do not paste OAuth codes or access
  token values into chat.
- Package installation required: report the exact package or command, reason,
  and target to the Product Delivery Lead, follow the approved install direction,
  complete the installation, and rerun setup/preflight.

## Current Skills

| Skill | Runtime Shape | Purpose |
| --- | --- | --- |
| `openclaw-pod-skills-sync` | `/workspace/skills/openclaw-pod-skills-sync/SKILL.md` | Copy-sync the repo SoT pod-native skills into the `/workspace/skills` runtime snapshot, apply `/workspace/AGENTS.md` and `/workspace/ORGANIZATIONS.md`, and verify the clone/pull setup rule before `project-bootstrap`. |
| `codex-cli-auth-setup` | `/workspace/skills/codex-cli-auth-setup/SKILL.md` | Verify Codex CLI readiness and install or update Codex CLI according to Product Delivery Lead setup direction without exposing secrets. |
| `pod-role-bootstrap` | `/workspace/skills/pod-role-bootstrap/SKILL.md` | Resolve the role pod identity, align pnpm to the repo pin according to Product Delivery Lead setup direction, install required repo dependencies, run `codex-preflight --pod`, and write a status-only readiness report. |
| `project-bootstrap` | `/workspace/skills/project-bootstrap/SKILL.md` | Orchestrate project-level boram pod readiness by checking the repo path, managed path, required pod skills, required/conditional MCPs, external CLI/account status, role-specific setup reports, and human gates without exposing secrets. |
| `eas-robot-auth-setup` | `/workspace/skills/eas-robot-auth-setup/SKILL.md` | Verify QA/Release EAS CLI and Expo robot auth readiness as status only before any human-gated EAS/Maestro run. |
| `stitch-adc-setup` | `/workspace/skills/stitch-adc-setup/SKILL.md` | Verify pod-wide Google ADC and Stitch MCP readiness as status-only setup evidence for every operating role. Live Stitch work still requires approved role scope and gates. |
| `codex-role-workflow` | `/workspace/skills/codex-role-workflow/SKILL.md` | Resolve a role pod to allowed repo-local Codex skills, reviewers, durable artifact stage, stop conditions, and status-only next action without doing role work. |

## Per-Role Required Pod Skills

This is the canonical per-role pod-native skill dependency matrix.
`runtime-sources/codex-skill-agent-matrix.md` links here instead of duplicating the table.
It is not the normal user-facing execution order; normal setup uses
`openclaw-pod-skills-sync`, then `project-bootstrap` as the entry point.
The matrix below lists required skills after the common sync prerequisite.
`stitch-adc-setup` is listed for every operating role so Google ADC and Stitch
MCP readiness is always reported as status-only setup evidence. This common
requirement does not authorize non-Design roles to run live Stitch work or
bypass approved role scope.

| Operating Role | Required pod-native skills |
| --- | --- |
| Product/Planning | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |
| Design | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |
| Mobile Architect | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |
| Mobile App Dev | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |
| Backend/API Integrator | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |
| QA/Release | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `eas-robot-auth-setup`, `codex-role-workflow` |
