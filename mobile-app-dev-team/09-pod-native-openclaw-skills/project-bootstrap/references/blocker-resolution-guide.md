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

## Role Identity Blockers

Related blockers:

- `missing role identity`
- `missing-role-identity`
- `WM_ROLE must use canonical role slug`
- `/workspace/IDENTITY must use canonical role slug`
- `WM_ROLE and /workspace/IDENTITY mismatch`
- `WM_EXPECTED_ROLE mismatch`

Resolution:

1. Choose the canonical role slug from the assigned SOUL:
   - `product-planning`
   - `design`
   - `mobile-architect`
   - `mobile-app-dev`
   - `backend-api-integrator`
   - `qa-release`
2. Set all configured role surfaces to the same canonical slug:

```bash
export WM_ROLE="<canonical-role-slug>"
export WM_EXPECTED_ROLE="<canonical-role-slug>"
printf '%s\n' "<canonical-role-slug>" > /workspace/IDENTITY
```

Agent action:

- If the assigned pod role is unambiguous from a user instruction, pod selector,
  or local role handoff file, the agent may prepare the non-secret commands.
- If the role is ambiguous, ask the user to choose the canonical slug.

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
- The agent should tell the user that running `pod-role-bootstrap` will activate
  the pinned pnpm and install dependencies.

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
- The agent must not invent an email address. Ask the user or use an approved
  org standard if one is explicitly available in the pod handoff.

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

- The agent may inspect `.codex/config.toml`, run `codex mcp list`, and report
  configured/missing status.
- The agent may prepare exact non-secret setup commands from repo-pinned config.
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
- The agent may prepare a non-secret managed-path patch or command for user
  review.
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

- The agent may run status-only setup prechecks when their skill is present and
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
