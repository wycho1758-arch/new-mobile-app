# Codex MCP Environment Guide

Last updated: 2026-06-10

This guide configures the Codex MCP and supporting CLI environment for this
repository after the repo has been cloned and dependencies have been installed.
It is repo-scoped: do not use it to configure unrelated projects or external
runtime repositories.

For fresh OpenClaw role pods, start with
`mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md`. Pod readiness requires
the checkout at `/workspace/projects/Wondermove-Inc/new-mobile-app`, the matching entry in
`/workspace/CODEX_MANAGED_PATHS.md`, `project-bootstrap` status-only evidence,
and `pod-role-bootstrap` status-only evidence before this repo-local MCP guide
is treated as actionable inside the pod.

Source of truth inputs:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `.codex/config.toml`
- `.agents/skills/qa-railway-workflow/SKILL.md`
- `docs/SETUP.md`
- `docs/CREDENTIALS.md`

Official references checked for this guide:

- Expo MCP: https://docs.expo.dev/eas/ai/mcp/
- Expo EAS CLI: https://docs.expo.dev/eas/cli/
- Expo EAS build setup: https://docs.expo.dev/build/setup/
- Expo programmatic access: https://docs.expo.dev/accounts/programmatic-access/
- Railway CLI: https://docs.railway.com/cli
- Railway login: https://docs.railway.com/cli/login
- Google ADC overview: https://docs.cloud.google.com/docs/authentication/application-default-credentials
- Google ADC local setup: https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment
- `gcloud auth application-default login`: https://docs.cloud.google.com/sdk/gcloud/reference/auth/application-default/login

## Scope

Configure or verify these MCP servers:

| MCP | Scope | Required | Auth model |
| --- | --- | --- | --- |
| `mobile-mcp` | Local mobile visual QA/device automation | Yes | No `codex mcp login`; stdio server |
| `serena` | Symbolic code navigation | Yes | No `codex mcp login`; stdio server |
| `stitch` | Design handoff/generation/export | Yes | No `codex mcp login`; requires Google ADC for actual Stitch use |
| `expo` | Official Expo MCP/plugin workflows | Yes | `codex mcp login expo` OAuth |
| `atlassian` | Jira/Confluence/internal knowledge | Yes | Remote/plugin-specific auth |
| `node_repl` | Codex app/browser/plugin support | Optional inventory | Codex app managed |
| `playwright` | MCP browser automation support | Yes | No `codex mcp login`; stdio server |

Configure or verify these auxiliary CLIs:

| CLI | Scope | Required |
| --- | --- | --- |
| `railway` | `$qa-railway-workflow` deploy/evidence operations | Yes |
| `gcloud` | Stitch Google Cloud prerequisites | Yes |
| `eas` / `eas-cli` | EAS init/build/submit/update operations | Conditional baseline exception |
| workspace `expo` CLI | Project Expo commands | Yes through `apps/mobile` dependencies |

Excluded from this repo guide:

- `pencil`
- `tavily`

If either is enabled in a developer's global Codex environment, that is not a
repo requirement. Do not copy a local `tavily` MCP URL into docs or evidence
because it can contain API-key-like material.

## Safety Rules

- Do not commit, paste, print, or persist token values, OAuth secrets, service
  account JSON, private keys, `.p8` files, Railway tokens, Expo tokens, Google
  credentials, database URLs, bearer tokens, or customer identifiers.
- `EXPO_PUBLIC_*` values are public client config, not secrets. Still never put
  bearer tokens, signing keys, passwords, or private endpoints in them.
- Do not use `@latest` for repo-required MCPs. Use the pinned commands from
  `.codex/config.toml`. `expo` uses the fixed remote MCP URL
  `https://mcp.expo.dev/mcp`.
- Do not run `railway setup agent` for this repo unless a human explicitly asks
  for Railway-owned agent integration. The repo-local Railway workflow forbids
  it by default because it can modify broader tool configuration.
- Run simulator/device operations serially. `mobile-mcp` is excluded from CI
  gates and remains a local QA/device automation surface.
- Verify auth in the actual target Codex session. Headless reviewers and the
  interactive Codex app can report different auth displays for remote MCPs.

## Prerequisites

From the repo root:

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
```

Expected baseline:

```bash
pnpm turbo run lint test
pnpm run test:runtime
```

The full local harness is required for runtime-related PRs:

```bash
pnpm run test:local-harness
```

Account prerequisites depend on which workflows are selected:

- Expo account/org for `expo` MCP, EAS project setup, and EAS CLI workflows.
- Google account/project for Stitch.
- Railway account for Railway deploy/evidence workflows.
- Atlassian account/workspace for Jira, Confluence, or internal knowledge work.

## Baseline Verification

Start with:

```bash
codex mcp list
```

Expected repo-required entries:

- `mobile-mcp`
- `serena`
- `stitch`
- `expo`
- `atlassian`
- `playwright`

Expected required CLI surfaces:

- `railway`
- `gcloud`

Baseline exception:

- EAS CLI remains conditional until EAS work is selected.

Inspect each required MCP:

```bash
codex mcp get mobile-mcp
codex mcp get serena
codex mcp get stitch
```

If they are present and enabled, do not re-add them. If they are missing, add
the exact pinned commands below.

## `mobile-mcp`

Purpose:

- Local visual QA/device automation for mobile UI/runtime checks.
- Required when a simulator or device is available.
- Not a CI gate.

Expected repo config:

```toml
[mcp_servers.mobile-mcp]
command = "npx"
args = ["-y", "@mobilenext/mobile-mcp@0.0.58"]
```

Add if missing:

```bash
codex mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@0.0.58
```

Verify:

```bash
codex mcp get mobile-mcp
codex mcp list
```

Expected outcome:

- `Status` is `enabled`.
- `Auth` is `Unsupported` or otherwise indicates no OAuth login path.

Operational rules:

- Do not parallelize simulator/device operations.
- Record device/visual QA evidence only for the actual simulator/device surface
  exercised.
- RN Web E2E does not prove native modules, permissions, lifecycle, push,
  biometrics, camera, GPS, or other hardware/device behavior.

## `serena`

Purpose:

- Symbol overview.
- Symbol lookup.
- Reference search.
- Bounded code navigation.

Expected repo config:

```toml
[mcp_servers.serena]
startup_timeout_sec = 15
command = "uvx"
args = ["-p", "3.13", "--from", "git+https://github.com/oraios/serena@v1.5.3", "serena", "start-mcp-server", "--project-from-cwd", "--context=codex"]
```

Add if missing:

```bash
codex mcp add serena -- uvx -p 3.13 --from git+https://github.com/oraios/serena@v1.5.3 serena start-mcp-server --project-from-cwd --context=codex
```

Verify:

```bash
codex mcp get serena
codex mcp list
```

Expected outcome:

- `Status` is `enabled`.
- No `codex mcp login` step is required.

If unavailable:

- Verify `uvx` is available.
- Verify network/package resolution.
- Use focused `rg` and file reads as a fallback.
- Record the degraded lookup path when it affects evidence confidence.

## `stitch`

Purpose:

- Design handoff/generation/export workflows.
- Used by repo Design adapters and Stitch operating rules.

Expected repo config:

```toml
[mcp_servers.stitch]
command = "npx"
args = ["-y", "stitch-mcp@1.3.2"]
```

Add if missing:

```bash
codex mcp add stitch -- npx -y stitch-mcp@1.3.2
```

Verify MCP registration:

```bash
codex mcp get stitch
codex mcp list
```

Expected MCP outcome:

- `Status` is `enabled`.
- No `codex mcp login stitch` step is required.

Google Cloud prerequisites for actual Stitch use:

```bash
gcloud --version
gcloud auth login
gcloud auth application-default login
gcloud config get-value project
```

Set the project if needed:

```bash
gcloud config set project <project-id>
```

Verify service enablement without printing credentials:

```bash
gcloud services list --enabled --filter='stitch.googleapis.com' --format='value(config.name)'
```

Expected outcome:

- A project is configured.
- Application Default Credentials exist for the selected account.
- `stitch.googleapis.com` is enabled for the selected project.

Record only account/project/service status in evidence. Do not record ADC token
values or credential file contents.

## `expo`

Purpose:

- Official Expo MCP/plugin workflows.
- Generic Expo, React Native, EAS, dev client, SDK upgrade, deployment, native
  UI, API route, and data fetching guidance.

Boundary:

- Repo skills remain authoritative for contracts, role boundaries, evidence,
  and QA gates.
- `expo` MCP does not replace `mobile-mcp` for local visual QA/device
  automation.

Verify:

```bash
codex mcp get expo
codex mcp list
```

If missing, add the remote MCP from repo SoT:

```bash
codex mcp add expo --url https://mcp.expo.dev/mcp
```

Login:

```bash
codex mcp login expo
```

Complete the browser OAuth flow. Then verify in the same target Codex
environment:

```bash
codex mcp list
```

Expected outcome:

- `expo` is `enabled`.
- The auth display should no longer report the startup failure
  `The expo MCP server is not logged in`.

If Codex still reports startup incomplete for `expo` after a successful login:

1. Restart Codex.
2. Re-run `codex mcp list`.
3. Re-run `codex mcp login expo` if the target environment still reports a
   login requirement.

Note: Auth display can be session-specific. The interactive Codex session may
show OAuth while a headless reviewer sandbox reports `Unsupported`. Treat the
target Codex session as authoritative.

## `atlassian`

Purpose:

- Jira, Confluence, and internal knowledge workflows when needed.

Add if missing:

```bash
codex mcp add atlassian -- npx -y mcp-remote@0.1.38 https://mcp.atlassian.com/v1/mcp
```

Verify:

```bash
codex mcp get atlassian
codex mcp list
```

Expected outcome:

- `Status` is `enabled`.
- `codex mcp list` may show `Auth: Unsupported`; remote auth can be handled by
  the MCP/plugin/server flow.

This MCP is required for project-bootstrap readiness so Jira/Confluence or
company knowledge workflows do not stop later on missing MCP setup. Remote auth
can still require user presence in the real login surface.

## `node_repl`

Purpose:

- Codex app/browser/plugin support surface.
- Usually managed by the Codex app/runtime, not by this repo.
- Optional project-bootstrap inventory. Missing `node_repl` does not block
  project-bootstrap readiness.

Verify:

```bash
codex mcp list
codex mcp get node_repl
```

If missing:

- Do not copy another user's absolute app path into shared docs or repo config.
- Treat it as optional app/plugin inventory unless a separate Codex app/runtime
  task explicitly requires it.

## `playwright` MCP

Purpose:

- MCP browser automation support.

Add if missing:

```bash
codex mcp add playwright -- npx -y @executeautomation/playwright-mcp-server@1.0.12
```

Verify:

```bash
codex mcp get playwright
codex mcp list
```

Do not confuse this MCP with repo RN Web E2E.

Repo RN Web E2E uses the mobile workspace Playwright package:

```bash
pnpm --filter mobile exec playwright install chromium
pnpm --filter mobile e2e:web
```

## Excluded MCPs

`pencil` is excluded from this repo setup guide.

`tavily` is excluded from this repo setup guide. If a local developer already
has `tavily` configured globally, do not copy its MCP URL into docs/evidence
because it can contain secret-like API key material.

## Railway CLI

Purpose:

- `$qa-railway-workflow` deploy/evidence operations.
- API service deployment, Postgres/service checks, variables, domains, logs,
  health checks, and RN Web E2E API URL handoff.

Railway is not a Codex MCP in this repo. It is required for project-bootstrap
readiness.

`project-bootstrap-agent-setup.sh` may install Railway with the approved
non-secret command when it is missing, npm is available, and
`PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`:

```bash
npm i -g @railway/cli
```

Without explicit approval, it reports `install_blocked_needs_approval`, lists
the `install_plan`, keeps `installed_exact` empty, and waits. After an approved
install, it reports only verified successful installs in `installed_exact`;
failed attempts are not reported as installed. It then rechecks:

Verify:

```bash
railway --version
railway whoami
```

Login:

```bash
railway login
```

The agent starts `railway login` when a human is present. The user signs in only
in the Railway browser surface. If the environment has no browser, use the
official pairing flow:

Browserless login:

```bash
railway login --browserless
```

CI/non-interactive auth:

- Use exactly one of `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN`.
- Do not print either token.
- Do not store token values in docs/evidence.

Repo workflow boundaries:

- Do not run `railway setup agent` unless explicitly requested by a human.
- Do not use `railway up --no-gitignore` unless a human explicitly approves the
  file exposure risk.
- Evidence can list project/service/deployment IDs, domain, health responses,
  command exit status, and variable names.
- Evidence must not include `DATABASE_URL`, `API_BEARER_TOKEN`,
  `RAILWAY_TOKEN`, or `RAILWAY_API_TOKEN` values.

## EAS CLI

Purpose:

- Conditional local EAS operations such as `eas init`, build, submit, update,
  credentials, and EAS environment/secret management.

EAS CLI is the baseline exception and is not required for project-bootstrap
readiness unless EAS work is selected. Current local state can
be checked with:

```bash
pnpm --filter mobile exec eas --version
```

If this returns `Command "eas" not found`, decide whether local EAS operations
are in scope before installing.

For human-owned `eas init`, follow `docs/SETUP.md`:

```bash
cd apps/mobile
npx eas-cli@latest init
```

Human gate:

- `eas init` requires an Expo account and EAS project ownership.
- Agent workflows should not perform store, billing, or production-risk
  decisions without recorded human approval.

Non-interactive EAS auth:

- `EXPO_TOKEN` can authenticate EAS CLI without `eas login`.
- The token must come from an Expo access token/Robot user flow and be injected
  as a secret.
- Never commit, paste, or log the token value.

Verify workspace Expo CLI separately:

```bash
pnpm --filter mobile exec expo --version
```

Use the workspace Expo CLI as the project reference. Do not treat a global
legacy `expo` binary as authoritative for this repo.
`project-bootstrap-agent-setup.sh` checks Expo CLI auth with
`npx --no-install expo whoami` so a status check does not install packages.
Expo MCP auth remains separate and is verified in the target Codex session.

## gcloud CLI

Purpose:

- Google Cloud prerequisite for Stitch. gcloud is required for
  project-bootstrap readiness.

`project-bootstrap-agent-setup.sh` may install gcloud only when an explicit
approved official Google Cloud CLI installer source is available and
`PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`. On Ubuntu, the official package setup
adds the Google Cloud apt source with a signed keyring, imports the Google Cloud
public key, runs `sudo apt-get update`, and installs `google-cloud-cli`. If the
runtime cannot use the approved installer source or explicit install approval is
absent, keep the installer precondition blocked instead of inventing another
source.

The agent rechecks `gcloud --version` after install. gcloud account login, ADC
approval, and project ID selection require the user in the official Google
surface; the agent starts the CLI commands and records status only.

Verify CLI:

```bash
gcloud --version
```

Authenticate the gcloud CLI:

```bash
gcloud auth login
gcloud auth list
```

Configure ADC:

```bash
gcloud auth application-default login
```

Set or verify the project:

```bash
gcloud config set project <project-id>
gcloud config get-value project
```

Verify Stitch service enablement:

```bash
gcloud services list --enabled --filter='stitch.googleapis.com' --format='value(config.name)'
```

Do not store ADC credential file contents or token values in this repo or in
evidence. Metadata-only proof may record path, filename, owner/group, mode,
size, modification time, and status command results for:

- `/root/.railway/` or `${HOME}/.railway/`
- `/root/.config/gcloud/` or `${HOME}/.config/gcloud/`
- `/root/.config/gcloud/application_default_credentials.json` when present
- GitHub CLI storage location reported by `gh auth status`, or
  `${HOME}/.config/gh/` when present
- Expo/EAS directories such as `${HOME}/.expo/` or `${HOME}/.eas/` when present

Do not open Finder or a file explorer during routine checks. Use terminal
metadata output by default. Open the Ubuntu file explorer with `xdg-open`,
`gio open`, or `nautilus` only when the user explicitly asks for visual
credential-location proof and the run sets
`PROJECT_BOOTSTRAP_OPEN_CREDENTIAL_FILE_EXPLORER=true`. If no file explorer
exists or opening is disabled, use terminal metadata output only. Never print
credential file contents.

## Final Verification Checklist

Run from the repo root unless noted otherwise:

```bash
codex mcp list
codex mcp get mobile-mcp
codex mcp get serena
codex mcp get stitch
codex mcp get expo
codex mcp get atlassian
codex mcp get playwright
railway --version
railway whoami
gcloud --version
gcloud config get-value project
pnpm --filter mobile exec expo --version
```

Conditional checks:

```bash
pnpm --filter mobile exec eas --version
pnpm --filter mobile exec playwright install chromium
```

If this guide or `PROJECT_ENVIRONMENT.md` changes in a PR, run:

```bash
pnpm run test:runtime
pnpm run test:local-harness
```

For full workspace readiness before PR:

```bash
pnpm turbo run lint test
```

## Troubleshooting

### Expo MCP Startup Incomplete

Symptom:

```text
The expo MCP server is not logged in. Run `codex mcp login expo`.
MCP startup incomplete (failed: expo)
```

Fix:

```bash
codex mcp login expo
codex mcp list
```

Approve the browser OAuth flow. Restart Codex if the current session still
shows the old startup failure.

### Required MCP Missing

Use the pinned `codex mcp add` command in this guide. Then verify:

```bash
codex mcp list
codex mcp get <name>
```

### `serena` Startup Timeout

Check:

```bash
uvx --version
codex mcp get serena
```

If still unavailable, use focused `rg` and file reads and record that degraded
lookup path when it affects evidence confidence.

### Stitch MCP Starts But Cannot Operate

Check:

```bash
gcloud auth list
gcloud auth application-default login
gcloud config get-value project
gcloud services list --enabled --filter='stitch.googleapis.com' --format='value(config.name)'
```

### Railway Login Missing

Check:

```bash
railway whoami
```

If unauthenticated:

```bash
railway login
```

Use browserless login only when a normal browser flow is unavailable:

```bash
railway login --browserless
```

### EAS CLI Unavailable

Check whether local EAS work is actually required. If it is not required, leave
EAS CLI uninstalled and rely on the configured EAS workflows/human gates.

If local EAS work is required, follow current Expo EAS CLI docs and then verify:

```bash
pnpm --filter mobile exec eas --version
```

### Secret Appeared In Output

1. Stop copying the output.
2. Rotate the affected secret.
3. Record only that rotation occurred.
4. Do not commit raw output.

## Maintenance

- Keep this guide synchronized with `PROJECT_ENVIRONMENT.md` when MCPs,
  plugins, CLI expectations, or verification gates change.
- Keep `.codex/config.toml` as the source for repo-required MCP pinning.
- Re-check official Expo, Railway, and Google Cloud docs before changing
  install/login commands.
- Store setup/review evidence under `.evidence/`.
