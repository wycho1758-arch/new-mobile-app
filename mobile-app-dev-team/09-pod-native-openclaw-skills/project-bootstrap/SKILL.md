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

- Design (`Design`, `design`, or `product-designer`):
  `/workspace/skills/stitch-adc-setup/SKILL.md`
- QA/Release (`QA/Release`, `qa-release`, `qa`, or `release`):
  `/workspace/skills/eas-robot-auth-setup/SKILL.md`

If a required skill directory is missing, stop and request skill installation or
a pod artifact refresh. Do not work around missing skills by pasting secrets or
copying unverified runtime files.

## Workflow

1. Set non-secret project defaults in the target pod session:

```bash
export REPO_CLONE_URL="https://github.com/Wondermove-Inc/new-mobile-app.git"
export REPO_PATH="/workspace/projects/Wondermove-Inc/new-mobile-app"
export CODEX_MANAGED_PATHS="/workspace/CODEX_MANAGED_PATHS.md"
export PROJECT_BOOTSTRAP_REPORT_PATH="/workspace/state/project-bootstrap-report.json"
```

2. Run the project readiness preflight:

```bash
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

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

- Target pod id/selector and `WM_ROLE`/`WM_EXPECTED_ROLE` are present or blocked.
  Role comparison accepts display names and pod slugs such as `design` and
  `qa-release`.
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

## Done When

- `/workspace/state/project-bootstrap-report.json` exists.
- Common blockers are empty or explicitly reported.
- Role-specific checks are `ready`, `blocked`, or source-backed
  `not_applicable`.
- The report records MCP/CLI/account readiness as status only.
- The report links or names the `pod-role-bootstrap`,
  `stitch-adc-setup`, and `eas-robot-auth-setup` reports when they are in scope.
- No secret values or raw credential-bearing output are printed or persisted.

See `references/report-template.md` for the expected report shape.
