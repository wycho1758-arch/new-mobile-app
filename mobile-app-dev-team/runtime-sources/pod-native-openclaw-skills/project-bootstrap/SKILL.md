---
name: project-bootstrap
description: Orchestrate WonderMove new-mobile-app setup inside an OpenClaw/OrbStack boram pod by checking the target repo path, managed path, required pod-native skills, Codex MCP status, role-specific Stitch/EAS readiness, external CLI/account status, and human gates with status-only reporting before running live work.
---

# Project Bootstrap

Use this pod-native OpenClaw skill when an OrbStack `boram-*` role pod must be
prepared for the WonderMove `new-mobile-app` repository before role work starts.
This is an orchestration skill. It does not replace the role-specific pod skills.
After clone or pull, run `openclaw-pod-skills-sync` first so the repo SoT
pod-native skills are copy-synced into `/workspace/skills`; this skill may seed
only `openclaw-pod-skills-sync` as a fallback and then delegates broader runtime
skill, `/workspace/AGENTS.md`, and `/workspace/ORGANIZATIONS.md` sync to that
skill.
The agent must inspect and set up its own pod environment for non-secret,
local, deterministic readiness items before asking the user for help. Do not ask
the user to perform agent-owned setup such as role identity writing, managed
path registry updates, status checks, local report directory creation, or
repo-pinned non-secret config checks.

Runtime shape:

```text
/workspace/skills/project-bootstrap/SKILL.md
```

Primary setup script:

```text
/workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
```

## Safety Rules

- Do not print auth token values, API keys, OAuth tokens, refresh tokens,
  passwords, Google ADC JSON, service account JSON, database URLs, bearer tokens,
  private keys, or full secret-bearing config contents.
- Report GitHub, Codex, Expo, EAS, Railway, Google ADC, Stitch, API, and store
  credential readiness as status only.
- Do not run live EAS, Railway deploy, Stitch generation/export, Jira,
  Confluence, GitHub branch protection, store submit, pod rollout, image
  build/push, webhook, or production-risk commands from this setup check.
- Do not claim live OrbStack/OpenClaw, mobile-mcp, native device, EAS, Stitch,
  Railway, Atlassian, GitHub branch protection, or production readiness from
  local source validation or status-only reports.

## Required Environment And Status-Only Values

The generated report contains both actionable blockers and status inventory.
Agents must decide user-facing blockers from the `blockers` array, role flags,
selected work scope, and workflow phase, not from the word `missing` alone.

For every pod role, `project-bootstrap` must inventory these project environment
entries before role work starts:

- Required MCPs: `mobile-mcp`, `serena`, `stitch`, `expo`, `atlassian`, and
  `playwright`.
- Optional MCP inventory: `node_repl` is Codex app/plugin-owned and does not
  block `project-bootstrap`.
- CLI inventory: `railway` and `gcloud`.
- EAS CLI is the baseline exception. `cli.eas: missing` is status-only until
  QA/Release EAS work or another approved EAS action is selected.

Inventory or CLI availability gaps can block completion of the common
project-bootstrap setup flow and must preserve the install approval boundaries
below. Live/auth readiness is role/work-scope conditional: Design needs
Stitch/Google ADC readiness before approved Stitch work; QA/Release needs EAS
readiness before approved EAS/Maestro work; Railway auth, service, and deployed
API evidence are required only for API, Railway, deployment, or deployed-backend
verification work. Non-Design, non-Railway, and non-EAS work must not be blocked
by unrelated live/auth readiness when Product/Planning has explicitly bounded
the work to local docs/review or another non-live scope.

The agent must first perform non-secret setup that it can own:

- run `openclaw-pod-skills-sync` so `/workspace/skills` is a copy snapshot of
  the repo SoT; the same sync also attempts `/workspace/ORGANIZATIONS.md` as
  report-only guidance status;
- register pinned MCPs from repo SoT for `mobile-mcp`, `serena`, `stitch`,
  `expo`, `atlassian`, and `playwright`;
- report the exact install plan and wait for explicit approval before any
  package or system installer runs, unless the user already approved it;
- install Railway with `npm i -g @railway/cli` only when missing, npm is
  available, and `PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`, then recheck
  `railway --version`;
- install gcloud only from an approved official Google Cloud CLI installer
  source and only when `PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`, then recheck
  `gcloud --version`;
- after any package/system install, report only verified successful installs in
  `installed_exact`; failed attempts must remain outside `installed_exact`;
- start `railway login`, `gcloud auth login`, and when needed
  `gcloud auth application-default login` only with a human present for the real
  provider surface;
- set the Google Cloud project with `gcloud config set project <project-id>`
  after the user provides the non-secret project ID, then verify with
  `gcloud config get-value project`;
- verify GitHub, Expo, Railway, and gcloud credential storage by metadata only:
  path, filename, owner/group, mode, size, and modification time; never read
  credential contents;
- rerun status checks and `project-bootstrap` preflight after setup changes;
- report only the remaining human/platform-owned blockers.

Human/platform-owned examples:

- `expo` OAuth login or account approval;
- Atlassian remote auth if the target session requires it;
- approved gcloud installer source approval when none is already available to
  the agent;
- Railway browser sign-in after the agent starts `railway login`;
- Google browser sign-in after the agent starts `gcloud auth login` or
  `gcloud auth application-default login`;
- Google Cloud project ID selection, or Stitch service enablement.

For a Product/Planning pod (`product-planning`):

- `reports.pod_role_bootstrap: missing` before step 6 is pending bootstrap
  evidence, not a user blocker. Run `pod-role-bootstrap` only when the workflow
  reaches that step and common blockers are absent.
- Do not ask the user to create the pod-role-bootstrap report manually.

For Design and QA/Release pods, role-specific report requirements are controlled
by `role.requires_stitch` and `role.requires_eas`. Missing Stitch or EAS setup
reports become blockers only when the matching role flag is true.

## User Language Contract

The generated report and blocker Markdown support `PROJECT_BOOTSTRAP_USER_LANGUAGE`
with these exact modes:

- `PROJECT_BOOTSTRAP_USER_LANGUAGE=ko`
- `PROJECT_BOOTSTRAP_USER_LANGUAGE=en`
- `PROJECT_BOOTSTRAP_USER_LANGUAGE=auto`

`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` is the current user-language hint used
only when the requested mode is `auto`; accepted hint aliases are not accepted as
requested language modes. Unrecognized or secret-like current-language hints are
not persisted verbatim. The report records
`fallback_reason: "missing_current_user_language_hint"` when `auto` has no usable
hint and `fallback_reason: "unsupported_requested_language"` when the requested
language is not supported. The selected language is always recorded under
`user_summary.language` in the generated JSON report.

The agent running project-bootstrap-preflight.sh sets PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE from the current user message before
invoking preflight. Do not ask the user to provide that hint as a separate setup
value. For a Korean current user message, keep
`PROJECT_BOOTSTRAP_USER_LANGUAGE=auto` and export either
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR` or
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어`; explicit
`PROJECT_BOOTSTRAP_USER_LANGUAGE=ko` still forces Korean output. If the agent
omits the current-language hint in `auto` mode, the report selects English and
records `fallback_reason: "missing_current_user_language_hint"`; for Korean
conversations, treat that as an agent setup miss and rerun with the hint set.

raw blocker IDs are support-only. The generated Markdown must treat
support-only raw blockers as technical details: Raw blockers must appear only in
support details and JSON, never as the primary user guidance. For interactive
auth, the agent must use browser-use or computer-use to open or guide the login surface when possible. The user only signs in, approves, or enters credentials in the real login surface.

Raw blockers must appear only in support details and JSON.

## Required Project Defaults

- Repository: `https://github.com/Wondermove-Inc/new-mobile-app.git`
- Repo path: `/workspace/projects/Wondermove-Inc/new-mobile-app`
- Managed-path registry: `/workspace/CODEX_MANAGED_PATHS.md`
- Workspace organizations guidance: `/workspace/ORGANIZATIONS.md`
- Organizations guidance source:
  `mobile-app-dev-team/runtime-sources/ORGANIZATIONS.md`
- Runtime environment SoT: `PROJECT_ENVIRONMENT.md`
- Required managed path entry:

```text
- /workspace/projects/Wondermove-Inc/new-mobile-app/
```

Default behavior:

- For new-mobile-app repository work, use `/workspace/projects/Wondermove-Inc/new-mobile-app` as the working directory.
- Do not use `/workspace` root as the project repo directory. The root contains agent operating files such as AGENTS.md, ORGANIZATIONS.md, SOUL.md, WORKFLOW.md, and TOOLS.md.
- Do not confuse this file with the project-local `/workspace/projects/Wondermove-Inc/new-mobile-app/AGENTS.md`.
- Before installing dependencies or system packages, report what will be installed and wait for explicit approval unless the user already approved that installation.
- After any computer/package installation, report exactly what was installed.

`/workspace/ORGANIZATIONS.md` is guidance only. Project bootstrap records the
artifact's presence/readability as report-only status; missing or unreadable
organizations guidance must not block bootstrap or preflight by itself, and the
file must not be parsed as reporting-line, approval-boundary, or role-contract
enforcement policy.
Project bootstrap must not parse reporting lines, approval boundaries, or role contracts from this file as enforcement policy.

## Required Pod Skills

Common setup:

- `/workspace/skills/codex-cli-auth-setup/SKILL.md`
- `/workspace/skills/pod-role-bootstrap/SKILL.md`
- `/workspace/skills/codex-role-workflow/SKILL.md`
- `/workspace/skills/codex-interactive-repo-work/SKILL.md`

`openclaw-pod-skills-sync` copy-syncs every
`mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>` directory
into `/workspace/skills/<slug>`. The `codex-interactive-repo-work` skill is a
required common skill in that runtime snapshot so downstream managed-repo edits
cannot proceed without the Codex CLI interactive PTY execution contract.

Role-specific setup:

- Design (`design`):
  `/workspace/skills/stitch-adc-setup/SKILL.md`
- QA/Release (`qa-release`):
  `/workspace/skills/eas-robot-auth-setup/SKILL.md`

If a required skill directory is missing, stop and request skill installation or
a pod artifact refresh. Do not work around missing skills by pasting secrets or
copying unverified runtime files.

## Required Next Routing Step

`project-bootstrap` is setup and readiness only. It must not decide or execute
role work.

When preflight writes `/workspace/state/project-bootstrap-report.json`, the
report includes `routing.next_skill: "codex-role-workflow"`. After readiness is
complete, apply `/workspace/skills/codex-role-workflow/SKILL.md` before any role
work so the pod resolves the current role, entry case, allowed repo-local Codex
skills, required reviewers, durable artifact stage, and human/external proof
blocks from the managed repo SoT.

If `codex-role-workflow` returns `codex_interactive_required: true`, the next
execution contract is
`/workspace/skills/codex-interactive-repo-work/SKILL.md`. `project-bootstrap`
must verify that this skill was included in the `/workspace/skills` sync before
role work starts; it must not let a role pod substitute direct file edits for
the Codex CLI interactive PTY contract.

The required routing identity sources are:

- `/workspace/SOUL.md`
- `/workspace/IDENTITY`
- `/workspace/state/project-bootstrap-role.env`

The managed repo SoT root for routing is
`/workspace/projects/Wondermove-Inc/new-mobile-app`; do not infer routing from
memory or from stale files under `/workspace/skills`.

## Canonical Role Identity

The agent must derive the canonical role slug from the runtime pod SOUL before
the first preflight run, then pass that slug as the explicit setup parameter.
In generated OpenClaw role pods, the runtime SOUL path is `/workspace/SOUL.md`.
This is the same requirement as: derive the canonical role slug from the pod SOUL.
The project repository keeps role source templates under
`mobile-app-dev-team/runtime-sources/role-souls/`, but the live pod must not rely on those
source filenames to identify its role.

Do not write display titles or operating-role names such as `Mobile App Dev`,
`Product/Planning`, `Design`, or `QA/Release` to `WM_ROLE`. Do not ask the user
to choose a role slug when `/workspace/SOUL.md`, a pod selector, or a local role
handoff already identifies the assigned role.
Do not ask the user to choose a role slug.

| SOUL file | Canonical role slug |
| --- | --- |
| `product-planning-soul.md` | `product-planning` |
| `design-soul.md` | `design` |
| `mobile-architect-soul.md` | `mobile-architect` |
| `mobile-app-dev-soul.md` | `mobile-app-dev` |
| `backend-api-integrator-soul.md` | `backend-api-integrator` |
| `qa-release-soul.md` | `qa-release` |

For the most reliable bootstrap path, read `/workspace/SOUL.md`, choose exactly
one canonical slug from the table above, then pass that value to
`project-bootstrap-agent-setup.sh` as `PROJECT_BOOTSTRAP_ROLE_SLUG`. This is
non-secret setup work and should be done by the agent:

```bash
role_slug="<canonical-role-slug>"
PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}" \
PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md" \
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
source /workspace/state/project-bootstrap-role.env
```

`project-bootstrap-agent-setup.sh` validates `PROJECT_BOOTSTRAP_ROLE_SLUG`
against the canonical role allowlist, writes `/workspace/IDENTITY`, and writes
`/workspace/state/project-bootstrap-role.env` with `WM_ROLE` and
`WM_EXPECTED_ROLE` set to that same slug. If `WM_ROLE`, `WM_EXPECTED_ROLE`, or
`/workspace/IDENTITY` is already configured with a conflicting role, the setup
must block instead of silently overriding the existing identity. Do not rely on
`EXPECTED_WM_ROLE` for this skill.

If `PROJECT_BOOTSTRAP_ROLE_SLUG` is not provided, existing `WM_ROLE`,
`WM_EXPECTED_ROLE`, and `/workspace/IDENTITY` values are still valid only when
they already exactly match one canonical slug. Display titles and operating-role
labels must not be normalized into a role identity. The setup script does not
infer or write a new role from `PROJECT_BOOTSTRAP_ROLE_SOUL_PATH`, pod
selectors, or hostnames when the explicit slug is absent; the skill/agent must
perform that selection before calling the script.

If the pod does not contain any SOUL file, selector, or role handoff that lets
the agent determine the role, keep `missing-role-identity` (`missing role
identity`) blocked and request a pod artifact refresh or role-source handoff. Do
not convert that blocker into a question asking the user which role to pick.

Do not ask the user to perform agent-owned setup. The agent must inspect and set
up its own pod environment for non-secret role identity surfaces whenever the
assigned role is already available from SOUL, selector, or handoff context.

## Workflow

1. Set non-secret project defaults in the target pod session:

```bash
export REPO_CLONE_URL="https://github.com/Wondermove-Inc/new-mobile-app.git"
export REPO_PATH="/workspace/projects/Wondermove-Inc/new-mobile-app"
export CODEX_MANAGED_PATHS="/workspace/CODEX_MANAGED_PATHS.md"
export PROJECT_BOOTSTRAP_WORKSPACE_ORGANIZATIONS_PATH="/workspace/ORGANIZATIONS.md"
export PROJECT_BOOTSTRAP_REPORT_PATH="/workspace/state/project-bootstrap-report.json"
export PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="/workspace/state/project-bootstrap-blockers.md"
export PROJECT_BOOTSTRAP_USER_LANGUAGE="auto"
# Set AGENT_CURRENT_USER_LANGUAGE from the current user message before preflight.
export PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="${AGENT_CURRENT_USER_LANGUAGE:?set from current user message, e.g. ko-KR or 한국어}"
```

2. Resolve and apply agent-owned identity setup before preflight. Read
   `/workspace/SOUL.md`, select exactly one canonical slug from the six allowed
   values, and pass that selection to the setup script.
   Do not copy the placeholder literally. Replace it with one of
   `product-planning`, `design`, `mobile-architect`, `mobile-app-dev`,
   `backend-api-integrator`, or `qa-release` based on the pod SOUL, selector, or
   role handoff:

```bash
role_slug="<canonical-role-slug>"
PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}" \
PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md" \
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
```

If `/workspace/SOUL.md` does not identify exactly one of
`product-planning`, `design`, `mobile-architect`, `mobile-app-dev`,
`backend-api-integrator`, or `qa-release`, keep role identity blocked and request
a pod artifact refresh or role-source handoff. Do not ask the user to choose the
role.

3. Run agent-owned setup before blocker report. This step performs only
   non-secret, local, deterministic setup that the agent can do itself before
   the user sees a blocker list:

```bash
PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}" \
PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md" \
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
```

This script must:

- repair the managed-path registry when the repo path is the known SoT path;
- register the required pod-native skills from
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md` into
  `/workspace/skills`;
- register missing required MCPs from repo-pinned non-secret commands when the
  registration is agent-owned;
- run Codex CLI/auth status setup before `missing codex CLI` becomes terminal;
- run role-specific status-only setup reports for Design and QA/Release when
  their local setup skills exist;
- write `/workspace/state/project-bootstrap-agent-setup-report.json`.

The agent must source the generated role environment for the current shell before
running role-bound tools that read `WM_ROLE`:

```bash
source /workspace/state/project-bootstrap-role.env
```

4. Run the project readiness preflight:

```bash
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

If blockers are present, give the user the generated Markdown guide at
`${PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH:-/workspace/state/project-bootstrap-blockers.md}`.
The guide is backed by `references/blocker-resolution-guide.md` and explains
which actions the agent can perform with local tools/browser/MCP status checks
versus which actions need user-owned credentials, account decisions, or
`human-gate/v1`.

The final blocked response must be a user-understandable result, not only raw
blocker names. It must include the current state in plain language, agent-owned
actions already checked or still possible, the minimum user request, and the
next step where the agent can continue. When the nested pod role report is in
scope, say that `pod-role-bootstrap` generates `/workspace/state/pod-role-bootstrap-report.json` and `project-bootstrap`
surfaces that status in the project report. Do not ask the user to create that
report file manually.

5. If common blockers are absent, run Codex CLI/auth setup:

```bash
bash /workspace/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh
```

6. Run repo checkout/bootstrap:

```bash
bash /workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh
```

7. Re-run project readiness preflight after `pod-role-bootstrap` writes its
report. Then run role-specific checks when applicable:

```bash
# Design only, before approved Stitch work
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh

# QA/Release only, before approved EAS/Maestro work
bash /workspace/skills/eas-robot-auth-setup/scripts/eas-robot-auth-precheck.sh
```

8. Stop before any live external action unless a linked `human-gate/v1` approval
exists for the exact action and evidence path.

## QC Checklist

- Target pod id/selector and canonical `WM_ROLE`/`WM_EXPECTED_ROLE` are present
  or blocked. `WM_ROLE`, `WM_EXPECTED_ROLE`, and `/workspace/IDENTITY` must use
  the same canonical role slug when configured.
- Repo path is `/workspace/projects/Wondermove-Inc/new-mobile-app`.
- `REPO_CLONE_URL` is non-secret and token-free before clone.
- Required repo SoT files exist in the checkout: `AGENTS.md`,
  `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`, `.codex/config.toml`,
  `docs/TEMPLATE_VARIABLES.md`, `docs/CREDENTIALS.md`, and the pod-native skill
  matrix README. These are recorded in the report as `repo_sot_files`.
- `/workspace/CODEX_MANAGED_PATHS.md` contains the normalized repo path entry.
- Required pod skills exist under `/workspace/skills`.
- Agent-owned setup before blocker report has run and produced
  `/workspace/state/project-bootstrap-agent-setup-report.json`.
- Required MCPs are status-checked: `mobile-mcp`, `serena`, `stitch`, `expo`,
  `atlassian`, and `playwright`. `node_repl` is optional Codex app/plugin
  inventory.
- Missing required MCPs are registered from pinned repo SoT when Codex CLI is
  available and no credential flow or app-owned runtime restoration is required.
- Railway and gcloud CLI availability is status-checked and inventoried.
  Missing CLI availability can block completion of the common setup flow, but
  Railway auth/service evidence and Google ADC/Stitch auth evidence are
  user-facing blockers only when the selected role/work scope needs that
  surface. Any package/system install requires explicit
  `PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`; otherwise the agent reports
  `install_blocked_needs_approval`, lists the `install_plan`, keeps
  `installed_exact` empty, and waits. After approved installs, the report lists
  only verified successful installs in `installed_exact`; failed attempts must
  not be reported as installed. Railway auth, gcloud auth, and gcloud ADC are
  separate status fields; they become blockers only when the selected role/work
  scope needs that live/auth surface.
- Expo MCP auth and workspace Expo CLI auth are separate readiness surfaces.
  Expo MCP is checked for the target Codex session, while Expo CLI is checked
  with `npx --no-install expo whoami` so status checks do not install packages.
  EAS CLI remains the baseline exception until EAS work is selected.
- `project-bootstrap-preflight.sh` consumes
  `/workspace/state/project-bootstrap-agent-setup-report.json` as a hard input.
  Missing, unreadable, blocked, or auth-incomplete setup reports block
  project-bootstrap.
- Git identity is configured only from an approved non-secret local source such
  as `PROJECT_BOOTSTRAP_GIT_USER_NAME` plus
  `PROJECT_BOOTSTRAP_GIT_USER_EMAIL`, `WM_GIT_USER_NAME` plus
  `WM_GIT_USER_EMAIL`, or `PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH`. Use a complete
  name/email pair from one approved source; do not compose identity values
  across source families. Do not invent name/email values.
- GitHub auth setup is status-only. If authenticated `gh` state or approved
  mounted auth material exists, the agent may run `gh auth setup-git`; otherwise
  keep `github-auth-unavailable` as a human/platform blocker.
- API secret refs, Railway token refs, Google ADC, EXPO_TOKEN, App Store Connect,
  and Google Play credentials are recorded only as status/ref labels, never
  values.
- `pod-role-bootstrap` report is present after `pod-role-bootstrap` runs, or is
  explicitly reported as pending/not-run before that workflow step. Do not treat
  pre-bootstrap `reports.pod_role_bootstrap: missing` as a user blocker by
  itself.
- If the generated `pod-role-bootstrap` report is present and blocked,
  `project-bootstrap` must surface `pod-role-bootstrap blocked` and the nested
  status-only blocker reasons in the project report.
- Design and QA/Release setup reports are present or source-backed not
  applicable.
- Live external actions are blocked without `human-gate/v1`.
- Reports contain redacted summaries only and no raw status-command output.
- Blocked reports include a `blocker_guide` path and write
  `/workspace/state/project-bootstrap-blockers.md` by default, unless
  `PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH` overrides it.

## Done When

- `/workspace/state/project-bootstrap-report.json` exists.
- `/workspace/state/project-bootstrap-agent-setup-report.json` exists or is
  source-backed not applicable for a pure read-only precheck.
- Common blockers are empty or explicitly reported.
- When common blockers exist,
  `/workspace/state/project-bootstrap-blockers.md` or
  `${PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH}` exists and can be handed to the user.
- Role-specific checks are `ready`, `blocked`, or source-backed
  `not_applicable`.
- The report records MCP/CLI/account readiness as status only.
- The report links or names the `pod-role-bootstrap`,
  `stitch-adc-setup`, and `eas-robot-auth-setup` reports when they are in scope.
- No secret values or raw credential-bearing output are printed or persisted.

## Agent-Owned Setup Contract

The `project-bootstrap-agent-setup.sh` contract is intentionally narrow. It may
set role identity, create state directories, repair the managed-path registry
only for the canonical WonderMove repo path, register missing required MCPs from
pinned repo configuration when agent-owned, and run role-specific status-only setup reports. It
must not perform account creation,
credential entry, branch protection changes, live deploys, EAS build/submit,
Stitch generation/export, store submission, production release, or failed-gate
risk acceptance.

If a local setup action fails because a credential, account, cloud project,
external authority, `human-gate/v1` approval, wrong repo path, or conflicting
managed ownership is missing, keep that item as a blocker and include the
blocker guide path in the report.

See `references/report-template.md` for the expected report shape and
`references/blocker-resolution-guide.md` for the blocker-resolution guide that
is embedded in the generated user Markdown.
