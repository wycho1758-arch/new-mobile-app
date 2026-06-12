---
name: project-bootstrap
description: Orchestrate WonderMove new-mobile-app setup inside an OpenClaw/OrbStack boram pod by checking the target repo path, managed path, required pod-native skills, Codex MCP status, role-specific Stitch/EAS readiness, external CLI/account status, and human gates with status-only reporting before running live work.
---

# Project Bootstrap

Use this pod-native OpenClaw skill when an OrbStack `boram-*` role pod must be
prepared for the WonderMove `new-mobile-app` repository before role work starts.
This is an orchestration skill. It does not replace the role-specific pod skills.

Runtime shape:

```text
/workspace/skills/project-bootstrap/SKILL.md
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

## Required Project Defaults

- Repository: `https://github.com/Wondermove-Inc/new-mobile-app.git`
- Repo path: `/workspace/projects/Wondermove-Inc/new-mobile-app`
- Managed-path registry: `/workspace/CODEX_MANAGED_PATHS.md`
- Runtime environment SoT: `PROJECT_ENVIRONMENT.md`
- Required managed path entry:

```text
- /workspace/projects/Wondermove-Inc/new-mobile-app/
```

## Required Pod Skills

Common setup:

- `/workspace/skills/codex-cli-auth-setup/SKILL.md`
- `/workspace/skills/pod-role-bootstrap/SKILL.md`

Role-specific setup:

- Design (`design`):
  `/workspace/skills/stitch-adc-setup/SKILL.md`
- QA/Release (`qa-release`):
  `/workspace/skills/eas-robot-auth-setup/SKILL.md`

If a required skill directory is missing, stop and request skill installation or
a pod artifact refresh. Do not work around missing skills by pasting secrets or
copying unverified runtime files.

## Canonical Role Identity

Use `SOUL.md` only to choose the role, then write the canonical runtime slug to
pod identity. Do not write display titles or operating-role names such as
`Mobile App Dev`, `Product/Planning`, `Design`, or `QA/Release` to `WM_ROLE`.

| SOUL file | Canonical role slug |
| --- | --- |
| `product-planning-soul.md` | `product-planning` |
| `design-soul.md` | `design` |
| `mobile-architect-soul.md` | `mobile-architect` |
| `mobile-app-dev-soul.md` | `mobile-app-dev` |
| `backend-api-integrator-soul.md` | `backend-api-integrator` |
| `qa-release-soul.md` | `qa-release` |

For the most reliable bootstrap path, set all role identity surfaces to the same
canonical slug:

```bash
export WM_ROLE="<canonical-role-slug>"
export WM_EXPECTED_ROLE="<canonical-role-slug>"
printf '%s\n' "<canonical-role-slug>" > /workspace/IDENTITY
```

`WM_ROLE` takes precedence over `/workspace/IDENTITY`. If both are configured,
they must represent the same canonical role. `WM_EXPECTED_ROLE` is the supported
guardrail for pod-native bootstrap scripts; do not rely on `EXPECTED_WM_ROLE`
for this skill.

## Workflow

1. Set non-secret project defaults in the target pod session:

```bash
export REPO_CLONE_URL="https://github.com/Wondermove-Inc/new-mobile-app.git"
export REPO_PATH="/workspace/projects/Wondermove-Inc/new-mobile-app"
export CODEX_MANAGED_PATHS="/workspace/CODEX_MANAGED_PATHS.md"
export PROJECT_BOOTSTRAP_REPORT_PATH="/workspace/state/project-bootstrap-report.json"
export PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="/workspace/state/project-bootstrap-blockers.md"
```

2. Run the project readiness preflight:

```bash
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

If blockers are present, give the user the generated Markdown guide at
`${PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH:-/workspace/state/project-bootstrap-blockers.md}`.
The guide is backed by `references/blocker-resolution-guide.md` and explains
which actions the agent can perform with local tools/browser/MCP status checks
versus which actions need user-owned credentials, account decisions, or
`human-gate/v1`.

3. If common blockers are absent, run Codex CLI/auth setup:

```bash
bash /workspace/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh
```

4. Run repo checkout/bootstrap:

```bash
bash /workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh
```

5. Re-run project readiness preflight after `pod-role-bootstrap` writes its
report. Then run role-specific checks when applicable:

```bash
# Design only, before approved Stitch work
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh

# QA/Release only, before approved EAS/Maestro work
bash /workspace/skills/eas-robot-auth-setup/scripts/eas-robot-auth-precheck.sh
```

6. Stop before any live external action unless a linked `human-gate/v1` approval
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
- Required MCPs are status-checked: `mobile-mcp`, `serena`, and `stitch`.
- Conditional MCPs are checked when selected: `expo`, `atlassian`, `node_repl`,
  and `playwright`.
- Conditional CLIs/accounts are checked status-only: Railway, gcloud/ADC/Stitch
  project, EAS/Expo, workspace Expo, GitHub auth, and Codex auth.
- API secret refs, Railway token refs, Google ADC, EXPO_TOKEN, App Store Connect,
  and Google Play credentials are recorded only as status/ref labels, never
  values.
- `pod-role-bootstrap` report is present or blocked with a source-backed reason.
- Design and QA/Release setup reports are present or source-backed not
  applicable.
- Live external actions are blocked without `human-gate/v1`.
- Reports contain redacted summaries only and no raw status-command output.
- Blocked reports include a `blocker_guide` path and write
  `/workspace/state/project-bootstrap-blockers.md` by default, unless
  `PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH` overrides it.

## Done When

- `/workspace/state/project-bootstrap-report.json` exists.
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

See `references/report-template.md` for the expected report shape and
`references/blocker-resolution-guide.md` for the blocker-resolution guide that
is embedded in the generated user Markdown.
