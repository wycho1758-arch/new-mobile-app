# Project Bootstrap Blocker Resolution Guide

Use this guide when `project-bootstrap` writes
`/workspace/state/project-bootstrap-blockers.md`. The guide is for resolving
blockers before `pod-role-bootstrap`; it does not authorize live EAS, Railway,
Stitch, GitHub branch-protection, store-submit, pod rollout, or production-risk
work.

## Agent/tool-use boundary

The agent pod is a Linux virtualized computer and most tools are expected to
already be installed. The agent should use available CLI, browser, and MCP tools
for status checks, local file inspection, non-secret config generation, and
safe verification before asking the user to act.
The agent must not ask the user to perform setup that the agent can complete
with local tools and non-secret inputs.

The agent may:

- Run status-only checks such as `node --version`, `pnpm --version`,
  `corepack --version`, `git status --short`, `git config --get user.name`,
  `git config --get user.email`, `gh auth status`, `codex mcp list`, and
  `test -e <path>`.
- Inspect repo SoT files, `.codex/config.toml`, `/workspace/IDENTITY`,
  `/workspace/CODEX_MANAGED_PATHS.md`, and generated reports.
- Write non-secret bootstrap files under `/workspace/state/` or generate shell
  snippets for the user to review.
- Use browser/tool automation to open local docs, help pages, or interactive
  auth UI only when a human is present for credential entry.

The agent must not:

- Do not print token values, OAuth codes, API keys, passwords, ADC JSON, service
  account JSON, database URLs, bearer tokens, or private keys.
- Do not type secrets into chat or durable evidence.
- Do not run `pod-role-bootstrap`, `pnpm install`, EAS builds/submits, Railway
  deploys, Stitch generation/export, or GitHub mutation commands from this
  blocker-resolution guide.
- Do not install broad system tools unless an explicit project-bootstrap step
  requires that installation. Prefer existing pod tools and pinned repo config.

## Agent-owned setup actions

Before reporting a blocker to the user, the agent must inspect and set up every
non-secret local environment item it can safely control:

- Role identity: derive the canonical role from the pod SOUL, selector, or local
  role handoff, then write `WM_ROLE`, `WM_EXPECTED_ROLE`, and
  `/workspace/IDENTITY`.
- Managed path registry: if `/workspace/CODEX_MANAGED_PATHS.md` is missing or
  lacks the canonical WonderMove repo path, create or update it with the
  normalized non-secret repo path entry. Do not repair unknown or conflicting
  repo paths.
- Report paths: create `/workspace/state` and any configured report/blocker
  output directory.
- Local status checks: run non-secret version, file, git, `gh auth status`, and
  `codex mcp list` checks, recording only status labels.
- Repo-pinned non-secret config: inspect `.codex/config.toml` and
  `PROJECT_ENVIRONMENT.md`; when a pinned, credential-free MCP/tool setup is
  defined there, run the setup or produce the exact local command without asking
  the user to do it manually.

Do not ask the user to choose the role, write `/workspace/IDENTITY`, create
local state directories, run status commands, or copy non-secret managed-path
entries.

## Human-owned blockers

Only ask the user or platform owner for actions that require human authority,
credentials, account decisions, paid/external platform choices, or a linked
`human-gate/v1`. Keep these as blockers until the human-owned input exists.
Never request secret values in chat; ask for mounted/managed credentials or an
interactive login path instead.

## Blocker Classification

| Classification | Examples | Required handling |
| --- | --- | --- |
| Agent-owned | Role identity from SOUL/selector/handoff, `/workspace/state` directories, `/workspace/CODEX_MANAGED_PATHS.md`, required MCP registration from pinned repo SoT, role-specific status-only setup reports | The agent runs the local setup before reporting blockers. |
| Agent-owned if approved source exists | Git identity from an approved local handoff, GitHub CLI setup when auth material is already mounted, repo clone when a non-secret clone URL is known, conditional MCP registration when selected by SoT | The agent uses the approved local source. If the source is absent or ambiguous, keep a human-owned blocker. |
| Human-owned blockers | Account login, credential provisioning, cloud project authority, store credentials, billing choices, branch protection, production release, failed-gate risk acceptance, missing pod artifact refresh | The agent gives the generated Markdown guide and waits for the external authority or artifact to exist. |

The default order is: run
`/workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`,
source `/workspace/state/project-bootstrap-role.env` when present, rerun
preflight, and only then report unresolved blockers to the user.

## Status-Only Missing Values

Not every `missing` status in `/workspace/state/project-bootstrap-report.json`
is a blocker. The agent must report user-facing blockers from the report
`blockers` array and the current workflow phase.

Status-only examples:

- `cli.railway: missing` is a tool inventory result. It is not a
  Product/Planning bootstrap blocker unless an approved Railway action is in
  scope.
- `cli.gcloud: missing` is a tool inventory result. It is not a
  Product/Planning bootstrap blocker and is relevant only when Design/Stitch
  setup is selected by SoT.
- `cli.eas: missing` is a tool inventory result. It is not a Product/Planning
  bootstrap blocker and is relevant only when QA/Release EAS work is selected
  by SoT.
- `reports.pod_role_bootstrap: missing` before `pod-role-bootstrap` runs means
  the bootstrap evidence has not been produced yet. It is pending workflow
  evidence, not a request for the user to create the report.

Agent action:

- If `blockers` is empty and the current role is `product-planning`, continue
  the workflow even when Railway, gcloud, EAS, or the pre-bootstrap
  `pod_role_bootstrap` report are `missing`.
- Do not ask the user to install optional CLIs or write report files when the
  missing value is status-only.
- If a later approved action requires one of these tools, rerun the relevant
  role-specific setup/precheck and classify unresolved credential or account
  requirements under the human-owned blocker rules.

## Role Identity Blockers

Related blockers:

- `missing role identity`
- `missing-role-identity`
- `WM_ROLE must use canonical role slug`
- `/workspace/IDENTITY must use canonical role slug`
- `WM_ROLE and /workspace/IDENTITY mismatch`
- `WM_EXPECTED_ROLE mismatch`

Resolution:

1. The agent must set the identity itself when the assigned SOUL, pod selector,
   or local role handoff already identifies the role. Do not ask the user to choose the role in that case.
2. Use the canonical role slug from the assigned SOUL:
   - `product-planning`
   - `design`
   - `mobile-architect`
   - `mobile-app-dev`
   - `backend-api-integrator`
   - `qa-release`
3. Set all configured role surfaces to the same canonical slug:

```bash
role_slug="<canonical-role-slug>"
export WM_ROLE="${role_slug}"
export WM_EXPECTED_ROLE="${role_slug}"
printf '%s\n' "${role_slug}" > /workspace/IDENTITY
```

Agent-owned setup actions:

- If the assigned pod role is unambiguous from a user instruction, pod selector,
  SOUL file, or local role handoff file, the agent should run the non-secret
  setup commands and rerun the read-only preflight.

Human-owned blockers:

- If the role is ambiguous because no SOUL file, selector, or role handoff is
  available, request a pod artifact refresh or role-source handoff. Do not ask
  the user to choose the role as a substitute for missing pod identity evidence.

## Package Manager Blockers

Related blockers:

- `pnpm-pin-mismatch`
- package manager mismatch in the generated report

Resolution:

- The repo SoT is root `package.json` `packageManager`, currently
  `pnpm@9.15.9`.
- `pod-role-bootstrap` intentionally runs `corepack enable`,
  `corepack prepare "pnpm@9.15.9" --activate`, and
  `pnpm install --frozen-lockfile`.
- Seeing another currently active `pnpm --version` before bootstrap is a
  blocker candidate, not a reason to manually edit package files.

Agent action:

- The agent may verify `package.json`, `pnpm-lock.yaml`, `corepack --version`,
  and current `pnpm --version`.
- The agent should run `pod-role-bootstrap` when the setup flow reaches that
  step and the user has authorized bootstrap execution. That script activates
  the pinned pnpm and installs dependencies. Do not ask the user to manually
  choose a pnpm version.

## Git Identity Blockers

Related blockers:

- `git-identity-missing`

Resolution:

Set the commit author identity expected for this pod:

```bash
git config --global user.name "<approved name>"
git config --global user.email "<approved email>"
```

Agent action:

- The agent may check current values with `git config --global --get user.name`
  and `git config --global --get user.email`.
- If an approved local handoff or org-standard source already provides the
  author identity, the agent may set it directly.
- The agent must not invent an email address. If no approved source exists,
  keep a human-owned blocker and provide this guide.

## GitHub Auth Blockers

Related blockers:

- `github-auth-unavailable`

Resolution:

- Authenticate GitHub through `gh auth login` or a mounted/managed secret path
  approved for the pod.
- Record only status such as `gh auth status` success/failure. Never record
  token values.

Agent action:

- The agent may run `gh auth status`.
- If local authenticated CLI state or mounted auth material already exists, the
  agent may complete non-secret verification and setup-git steps.
- The agent may open a browser/device-login flow only with a human present for
  credential entry.
- The agent must not paste tokens, OAuth codes, or private auth output into
  chat, reports, or evidence.

## Codex MCP Blockers

Related blockers:

- `codex-mcp-unavailable`
- `missing required MCP mobile-mcp`
- `missing required MCP serena`
- `missing required MCP stitch`
- missing conditional MCP status for `expo`, `atlassian`, `node_repl`, or
  `playwright`

Resolution:

- Compare `codex mcp list` with repo `.codex/config.toml` and
  `PROJECT_ENVIRONMENT.md`.
- Required project MCPs are `mobile-mcp`, `serena`, and `stitch`.
- Some MCP auth, such as Expo or Google ADC/Stitch, may require human-owned
  login or mounted credential files.

Agent action:

- The agent must inspect `.codex/config.toml`, run `codex mcp list`, and
  register missing required MCPs when the pinned command is credential-free.
- The agent may prepare exact non-secret setup commands from repo-pinned config
  only when Codex CLI itself is unavailable or registration fails for a
  source-backed reason.
- The agent must not use `@latest` when a pinned version exists in SoT.
- The agent must not print ADC JSON or auth files.

## Repo And Managed Path Blockers

Related blockers:

- repo path missing
- token-bearing `REPO_CLONE_URL`
- missing `/workspace/CODEX_MANAGED_PATHS.md`
- missing managed path entry
- missing repo SoT file

Resolution:

- Repo path should be `/workspace/projects/Wondermove-Inc/new-mobile-app`.
- `/workspace/CODEX_MANAGED_PATHS.md` must contain:

```text
- /workspace/projects/Wondermove-Inc/new-mobile-app/
```

Agent action:

- The agent may check file and directory presence.
- The agent must repair the managed-path registry when the repo path is the
  canonical WonderMove SoT path and there is no conflicting managed ownership.
- If `REPO_PATH` points anywhere else, keep it blocked as a wrong repo path
  instead of adding the override to `/workspace/CODEX_MANAGED_PATHS.md`.
- If clone is required, `REPO_CLONE_URL` must be non-secret and token-free.

## Role-Specific Setup Report Blockers

Related blockers:

- `missing stitch-adc-setup report`
- `missing eas-robot-auth-setup report`

Resolution:

- Design pods need the Stitch/Google ADC readiness report before approved Stitch
  work.
- QA/Release pods need the EAS robot auth readiness report before approved
  EAS/Maestro work.

Agent action:

- The agent must run status-only setup prechecks when their skill is present and
  the action is not a live external operation.
- Credentials remain secret/status-only. Missing credentials require a human or
  platform owner.

## Human Gate Blockers

Related blockers:

- missing `human-gate/v1`
- any blocker involving production, store submit, paid account setup, external
  messaging, privacy/legal/payment risk, or failed-gate risk acceptance

Resolution:

- Stop and request a linked `human-gate/v1` decision for the exact action and
  evidence path.

Agent action:

- The agent may prepare a concise human-gate request with blocker, owner,
  evidence path, and risk.
- The agent must not accept or bypass the risk on behalf of the human owner.
