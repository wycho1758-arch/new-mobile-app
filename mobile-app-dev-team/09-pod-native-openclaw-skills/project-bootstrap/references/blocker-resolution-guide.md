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
- Repo-pinned non-secret config: inspect `.codex/config.toml`,
  `PROJECT_ENVIRONMENT.md`, and `docs/CODEX_MCP_ENVIRONMENT.md`; when a pinned,
  credential-free MCP/tool setup is defined there, run the setup or produce the
  exact local command without asking the user to do it manually.

Do not ask the user to choose the role, write `/workspace/IDENTITY`, create
local state directories, run status commands, or copy non-secret managed-path
entries.

## Human-owned blockers

Only ask the user or platform owner for actions that require human authority,
credentials, account decisions, paid/external platform choices, or a linked
`human-gate/v1`. Keep these as blockers until the human-owned input exists.
Never request secret values in chat; ask for mounted/managed credentials or an
interactive login path instead.

## Language And Support-Only Contract

The generated report accepts `PROJECT_BOOTSTRAP_USER_LANGUAGE` with
`PROJECT_BOOTSTRAP_USER_LANGUAGE=ko`, `PROJECT_BOOTSTRAP_USER_LANGUAGE=en`, and
`PROJECT_BOOTSTRAP_USER_LANGUAGE=auto`. When `auto` is used,
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` supplies the current user hint. Hint
aliases such as `ko-KR`, `Korean`, `한국어`, `en-US`, and `English` are accepted
only for `PROJECT_BOOTSTRAP_USER_LANGUAGE=auto`; they are unsupported as
requested language modes. Unrecognized or secret-like current-language hints are
not persisted verbatim.

The agent running project-bootstrap-preflight.sh sets PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE from the current user message before
preflight. Do not ask the user to provide this hint separately. For a Korean
current user message, use `PROJECT_BOOTSTRAP_USER_LANGUAGE=auto` with
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR` or
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어`; explicit
`PROJECT_BOOTSTRAP_USER_LANGUAGE=ko` still forces Korean output.

The report records `fallback_reason: "missing_current_user_language_hint"` when
`auto` has no usable hint and `fallback_reason: "unsupported_requested_language"`
when a requested language is unsupported. raw blocker IDs are support-only:
support-only raw blockers must stay out of primary guidance. Raw blockers must
appear only in support details and JSON.

Raw blockers must appear only in support details and JSON.

For GitHub auth, the agent must use browser-use or computer-use to open or guide the login surface when possible. The user only signs in, approves, or enters credentials in the real login surface.

## Human-readable blocker table

Use this table to convert raw blockers into a user-understandable result. The
agent report must include what happened, what the agent can still do, the
Minimum user request, and the next step where the agent can continue.

| Raw blocker | Plain-language meaning | Minimum user request | Next agent action |
| --- | --- | --- | --- |
| `git-identity-missing` | The pod cannot create commits because no approved author name/email pair is available. | Share a preferred public commit name/email if one exists, or provide an approved local handoff file through `PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH`. If absent, the agent checks whether the approved GitHub account can support a non-invented Git identity source. | Configure Git from one approved source and rerun bootstrap. |
| `github-auth-unavailable` | GitHub connection is needed before the agent can continue with repository access or upload work. | Be present for the GitHub login screen; sign in with your GitHub account and approve the request. Never send tokens in chat. | Check the GitHub connection, set up Git to use that login after authentication works, then rerun bootstrap. |
| `pod-role-bootstrap blocked` | `project-bootstrap` found that the generated `pod-role-bootstrap` report is present but not ready. | Resolve the nested blocker requests only; do not create report files manually. | Rerun `pod-role-bootstrap`, then rerun `project-bootstrap` preflight. |

## Blocker Classification

| Classification | Examples | Required handling |
| --- | --- | --- |
| Agent-owned | Role identity from SOUL/selector/handoff, `/workspace/state` directories, `/workspace/CODEX_MANAGED_PATHS.md`, required MCP registration from pinned repo SoT, role-specific status-only setup reports | The agent runs the local setup before reporting blockers. |
| Agent-owned if approved source exists | Git identity from an approved local handoff, GitHub CLI setup when auth material is already mounted, repo clone when a non-secret clone URL is known, required MCP registration from pinned SoT when the setup is credential-free | The agent uses the approved local source. If the source is absent or ambiguous, keep a human-owned blocker. |
| Human-owned blockers | Account login, credential provisioning, cloud project authority, store credentials, billing choices, branch protection, production release, failed-gate risk acceptance, missing pod artifact refresh | The agent gives the generated Markdown guide and waits for the external authority or artifact to exist. |

## Full Blocker Matrix

The full blocker matrix includes these families:

| Family | Examples | Required handling |
| --- | --- | --- |
| role identity | `missing role identity`, non-canonical role, mismatch | Derive the role from SOUL, selector, or handoff; ask for pod artifact refresh only when no role source exists. |
| repo/managed path | missing registry, missing managed path entry, conflicting repo path | Repair only the known canonical managed path; ask for approved project source on conflict. |
| Git identity | `git-identity-missing` | Use one approved public name/email source; do not invent values. |
| CLI/runtime | missing Codex CLI, invalid runtime | Run approved precheck; ask platform owner refresh or approved Codex CLI artifact only if still blocked. |
| package-manager | `pnpm-pin-mismatch`, package manager mismatch | Verify `package.json`, `pnpm-lock.yaml`, `corepack --version`, and `pnpm --version`; use `pod-role-bootstrap` to activate `pnpm@9.15.9`. |
| MCP | missing required MCP | Compare `codex mcp list` with repo SoT and register pinned credential-free config when possible. |
| conditional login/auth | provider login or mounted auth requirement | Open or guide the real login surface when possible; the user enters credentials there. |
| GitHub auth | `github-auth-unavailable` | Tell the user that GitHub connection is needed, open or guide GitHub login, then run setup-git after auth. |
| secure credentials/API/Railway | API/Railway secret source, ADC/Stitch/EAS credential report | Ask for Secret, secure store, tool auth, mounted file, or human-present login. |
| public non-secret app config | missing app display name, app slug, app scheme, iOS bundle ID, Android package, public API URL | Ask for public non-secret app config values only; do not request secrets. |
| human-gate/v1 | live external or risk-bearing action | Require a linked `human-gate/v1` decision naming action and evidence. |
| nested pod role report | blocked `pod-role-bootstrap` result | Surface plain-language guidance; keep nested raw IDs in support details and JSON. |

Do not ask the user to perform agent-owned setup such as report directories,
role identity writing, canonical managed-path repair, pinned credential-free MCP
registration, or pnpm pin alignment.

The default order is: run
`/workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`,
source `/workspace/state/project-bootstrap-role.env` when present, rerun
preflight, and only then report unresolved blockers to the user.

## User-Facing Message Rules

The generated blocker guide should start with `## Action needed`, then use
`### What you need to do`, `### What I will do after that`, and
`### Do not send in chat`. Support-only blocker names must appear under
`### Technical details for support`, not before the user action.

Ask only for the smallest user-owned input. Use plain wording first and keep raw
blocker names for support details:

- For GitHub, the first body line should start with `GitHub connection is
  needed` when `github-auth-unavailable` is present. Tell the user that the
  agent will open or guide the GitHub login screen when possible, and that they
  should sign in with your GitHub account and approve the request there. Do not
  ask for tokens in chat.
- If Git identity is also missing, keep GitHub login first, then ask whether the
  user has a preferred public commit name/email. If not, check whether the
  approved GitHub account can support a non-invented Git identity source. Do not
  invent an email address.
- For project files, ask for the correct checkout or approved project file
  source.
- For platform/runtime problems, ask for platform owner refresh of the pod
  image/runtime, an approved Codex CLI artifact, or approved MCP/tool-auth
  config.
- For credentials, ask for an approved secure credential source.
- For live external or risk-bearing work, ask for a linked `human-gate/v1`
  decision.

Do not ask the user to perform agent-owned setup. The do-not-ask cases include
report directories, role identity writing, canonical managed-path repair,
pinned credential-free MCP registration, and pnpm pin alignment.

## Required Environment And Status-Only Values

Not every `missing` status in `/workspace/state/project-bootstrap-report.json`
is a blocker. The agent must report user-facing blockers from the report
`blockers` array and the current workflow phase.

Project-bootstrap required baseline:

- `mcp.expo`, `mcp.atlassian`, and `mcp.playwright` are required, along with
  `mobile-mcp`, `serena`, and `stitch`.
- `mcp.node_repl` is optional Codex app/plugin inventory. Missing `node_repl`
  does not block `project-bootstrap`.
- `cli.railway: missing` is a bootstrap blocker. The agent may check status and
  installs Railway with `npm i -g @railway/cli` when npm is available. The
  agent starts `railway login`; the user completes sign-in only in the real
  Railway surface.
- `cli.gcloud: missing` is a bootstrap blocker. The agent may check status and
  may install gcloud only from an approved official Google Cloud CLI installer
  source. The agent starts `gcloud auth login` and when needed
  `gcloud auth application-default login`; the user completes Google approval in
  the real surface. The user provides only the non-secret project ID, then the
  agent runs `gcloud config set project <project-id>` and verifies
  `gcloud config get-value project`.
- `cli.eas: missing` is the baseline exception. It is status-only until
  QA/Release EAS work or another approved EAS action is selected.
- `cli.eas: missing` is a tool inventory result. It is not a Product/Planning
  bootstrap blocker and is relevant only when QA/Release EAS work is selected
  by SoT.
- `reports.pod_role_bootstrap: missing` before `pod-role-bootstrap` runs means
  the bootstrap evidence has not been produced yet. It is pending workflow
  evidence, not a request for the user to create the report.

Agent action:

- If `blockers` is empty and the current role is `product-planning`, continue
  the workflow even when EAS or the pre-bootstrap `pod_role_bootstrap` report
  are `missing`.
- If a generated `pod-role-bootstrap` report is present and blocked, treat the
  nested report as the current workflow blocker even when the earlier common
  project preflight was ready to run bootstrap.
- Do not ask the user to write report files when the missing value is
  status-only.
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
- `project-bootstrap-agent-setup.sh` may use
  `PROJECT_BOOTSTRAP_GIT_USER_NAME` and `PROJECT_BOOTSTRAP_GIT_USER_EMAIL`, or
  `WM_GIT_USER_NAME` and `WM_GIT_USER_EMAIL`, as approved non-secret sources.
- `PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH` may point to a local handoff file with
  those same `KEY=value` names. Do not put private material in that file.
- The configured identity must come from one complete approved source pair. Do
  not mix a name from one source family with an email from another source
  family.
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
- `missing required MCP expo`
- `missing required MCP atlassian`
- `missing required MCP playwright`

Resolution:

- Compare `codex mcp list` with repo `.codex/config.toml` and
  `PROJECT_ENVIRONMENT.md`.
- Required project MCPs are `mobile-mcp`, `serena`, `stitch`, `expo`,
  `atlassian`, and `playwright`. `node_repl` is optional Codex app/plugin
  inventory.
- Some MCP auth, such as Expo or Google ADC/Stitch, may require human-owned
  login or mounted credential files.

Agent action:

- The agent must inspect `.codex/config.toml`, run `codex mcp list`, and
  register missing required MCPs when the pinned command is credential-free.
- The agent may register `expo`, `atlassian`, and `playwright` from pinned repo
  config. Expo OAuth and Atlassian remote auth still require user presence when
  the real login surface appears.
- `node_repl` is Codex app/plugin environment owned and optional for
  project-bootstrap. Do not invent a repo-local path or copy another user's
  absolute app path.
- The agent may prepare exact non-secret setup commands from repo-pinned config
  only when Codex CLI itself is unavailable or registration fails for a
  source-backed reason.
- The agent must not use `@latest` when a pinned version exists in SoT.
- The agent must not print ADC JSON or auth files.

## Codex CLI And Runtime Blockers

Related blockers:

- `missing codex CLI`
- `no-valid-codex-binary`
- `node-major-mismatch`
- terminal missing Codex CLI after agent-owned setup

Resolution:

- Ask for platform owner refresh of the pod image/runtime when the pod runtime
  does not match repo SoT.
- Ask for an approved Codex CLI artifact when the binary is missing or invalid
  after the agent has run the approved local precheck.
- Ask for approved MCP/tool-auth config when Codex exists but the required MCP
  cannot be registered or authenticated from pinned, credential-free repo SoT.

Agent action:

- The agent reruns version checks, Codex checks, MCP checks, setup, and preflight
  after the platform/runtime source exists.
- Do not ask a non-IT user to install arbitrary tools, choose package versions,
  or use `@latest`.

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

## Project Bootstrap Agent Setup And Auth Blockers

Related blockers:

- missing project-bootstrap-agent-setup report
- unreadable project-bootstrap-agent-setup report
- project-bootstrap-agent-setup blocked
- project-bootstrap-agent-setup auth readiness missing
- railway-cli-unavailable
- gcloud-cli-unavailable
- railway-auth-missing
- gcloud-auth-missing
- gcloud-adc-missing
- expo-mcp-auth-missing
- expo-cli-auth-missing

Resolution:

- The agent must run `/workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
  before `project-bootstrap-preflight.sh`.
- Railway, gcloud auth, Google ADC, Expo MCP auth, and workspace Expo CLI auth
  are separate readiness surfaces. Do not collapse them into a single
  "logged in" status.
- Railway and gcloud command availability are required before their auth states
  can be trusted. Missing CLI availability must keep the setup report blocked.
- Expo MCP proves the target Codex session OAuth surface. Expo CLI proves the
  workspace CLI session and is checked with `npx --no-install expo whoami`.
- Package or system installers require explicit
  `PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`. Without approval, report
  `install_blocked_needs_approval`, list `install_plan`, keep
  `installed_exact` empty, and wait.
- After approval, `installed_exact` may list only verified successful installs.
  `npm_global_install_failed` and `install_failed` are failed attempts, not
  installed software.

Agent action:

- Regenerate `/workspace/state/project-bootstrap-agent-setup-report.json`.
- Rerun `project-bootstrap-preflight.sh` with
  `PROJECT_BOOTSTRAP_AGENT_SETUP_REPORT_PATH` pointing at that setup report when
  a non-default state path is used.
- Ask the user only for the smallest human-owned login or approval action:
  Railway login, Google Cloud login/ADC, Expo MCP authorization, Expo CLI login,
  or installer approval. Never ask the user to send tokens, ADC JSON, service
  account JSON, or passwords in chat.

## Public App Config Blockers

Related blockers:

- preview, release, or EAS job needs public app configuration
- missing public app display or identifier values requested by a role-specific
  approved workflow

Resolution:

- Ask for public non-secret app config values only.
- The user-facing template may ask for app display name, app slug, app scheme,
  iOS bundle ID, Android package, and public API URL.
- Do not ask for customer secrets, private API keys, database URLs, bearer
  tokens, or credential-bearing config files.

Agent action:

- Apply approved public values only through the repo-approved non-secret config
  channel.
- Rerun the related project, EAS, Expo, or runtime checks after the public config
  exists.

## API/Railway Secret Blockers

Related blockers:

- API/backend work needs database, API, Railway, or deployment secret status
- missing secure credential source for Railway, API, or database checks

Resolution:

- Ask only for Secret, secure store, tool auth, mounted file, or human-present login
  that makes the credential available to the pod.
- Do not ask the user to paste `DATABASE_URL`, bearer tokens, Railway tokens,
  API keys, passwords, or full secret-bearing config in chat.

Agent action:

- Run redacted status checks only after the approved secure source exists.
- Record status, presence, file mode, object names, and key names only. Do not
  print secret values.

## Railway And gcloud CLI Blockers

Related blockers:

- `missing required CLI railway`
- `missing required CLI gcloud`

Resolution:

- Railway CLI is required for project-bootstrap readiness because this repo has
  Railway QA/API evidence workflows.
- gcloud CLI is required for project-bootstrap readiness because Stitch uses
  Google ADC and project state.
- The agent installs Railway with `npm i -g @railway/cli` when missing and npm
  is available, then rechecks `railway --version`.
- The agent may install gcloud only from an approved official Google Cloud CLI
  installer source, then rechecks `gcloud --version`.
- The agent starts `railway login`, `gcloud auth login`, and when needed
  `gcloud auth application-default login`; users enter credentials and approve
  only in the real provider surface.
- Project selection uses only the non-secret project ID:
  `gcloud config set project <project-id>`, then
  `gcloud config get-value project`.
- Railway token setup, Google ADC JSON, service account JSON, and credential
  contents remain human/platform owned and must never be sent in chat.
- EAS CLI is the only baseline exception and stays status-only until EAS work is
  selected.

Agent action:

- Check `railway --version`, `railway whoami`, `gcloud --version`,
  `gcloud auth list`, and `gcloud config get-value project` as status-only when
  available.
- Use browser/computer-use to open or guide the real login surface when possible
  and a human is present.
- Do not open Finder or a file explorer during routine checks. Report terminal
  metadata only by default.
- Open Ubuntu file explorer for `/root/.railway/`, `/root/.config/gcloud/`,
  GitHub, and Expo credential directories only when the user explicitly asks for
  visual credential-location proof and
  `PROJECT_BOOTSTRAP_OPEN_CREDENTIAL_FILE_EXPLORER=true`; otherwise report
  terminal metadata only. Metadata means path, filename, owner/group, mode,
  size, and modification time.
- Never ask for or print Railway tokens, Google ADC JSON, service account JSON,
  OAuth codes, private project credentials, or credential file contents.

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
