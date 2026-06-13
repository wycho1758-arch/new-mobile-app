# Pod Environment Bootstrap

This document is the zero-to-ready sequence for a fresh OpenClaw role pod that
will work on this Codex-managed mobile app template repository.

It is source guidance only. It does not modify a live pod, GitHub setting,
Secret, ConfigMap, EAS project, or Stitch project, and it does not prove actual OrbStack/OpenClaw pod execution.
Before using it as an OrbStack canary handoff, run the read-only preflight in
this document, then use `project-bootstrap` as the standard user-facing entry
point. Agent-owned deterministic setup may be repaired by `project-bootstrap`;
human-owned credentials, accounts, live approvals, missing source artifacts, and
missing pod skill artifacts remain blockers.

## Source Of Truth

- `AGENTS.md` defines repo rules, runtime paths, and required gates.
- `REPO_OPERATIONS.md` defines the Codex-only repo work policy for pods.
- `PROJECT_ENVIRONMENT.md` defines current Codex MCP pins and runtime facts.
- `.codex/config.toml` is the pinned MCP configuration source.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md` is the
  pod-native skill matrix.
- `docs/TEMPLATE_VARIABLES.md` defines template variables and render timing.
- `docs/CREDENTIALS.md` defines credential owners, injection paths, and
  delegation limits.

## OrbStack Pod Configuration Inputs

Use this section as the handoff checklist for the person configuring an
OrbStack/OpenClaw role pod. Values are grouped by where they are consumed.
Do not paste token values, API keys, OAuth tokens, refresh tokens, passwords,
private keys, or full secret-bearing config contents into reports or chat.

### Configuration Channels

Choose the delivery channel by data class. Do not collapse these values into
one runtime dump.

| Channel | Allowed Data | Restart Rule | Notes |
| --- | --- | --- | --- |
| ConfigMap or pod config | Non-secret bootstrap values only. | Pod-template variable changes require patch, rollout restart, readiness, and pod-internal preflight. | Use for role, repo path, public Expo config, and non-secret paths. |
| Secret or tool auth | Credentials only. | Existing pods must restart after pod-template Secret reference changes. Mounted files may have refresh latency and still require process re-read. | Use for GitHub auth, Codex auth, Expo auth, database URL, API auth, Railway auth, ADC, ASC, and Google service account material. |
| Workspace bootstrap file | Non-secret bootstrap config only. | No pod restart required, but existing long-running shell/Codex sessions must be discarded or re-source the file. | Keep it under `/workspace/state/` or another managed non-secret path. |
| Volume mount | Non-secret config file or mounted private file. | Some runtimes refresh files without pod restart, but the target process must re-read the file. Prefer restart when consumer behavior is unknown. | Do not inline JSON credentials into process variables. Mount private files. |
| Wrapper or `source` file | Non-secret next-exec/session values only. | Applies only to the next exec/session. Existing long-running sessions do not inherit changes. | Good for local canary checks, not proof that pod template is configured. |

Default operating rule: if a value is injected through pod-template variables
or references, patch configuration, rollout restart, wait for readiness, then
run the pod-internal redacted read-only preflight again. OpenClaw config patches
are not assumed to hot-reload unless that exact field is documented as
hot-reloadable.

Recommended canary sequence:

```text
config/private-material patch
-> rollout restart
-> readiness check
-> pod-internal redacted read-only preflight
-> project-bootstrap
   (runs dependency/internal setup such as codex-cli-auth-setup and
   pod-role-bootstrap when the workflow reaches those checks)
```

### Data Classification

| Class | Values | Allowed Delivery |
| --- | --- | --- |
| Non-secret bootstrap config | `REPO_PATH`, `CODEX_MANAGED_PATHS`, `STATE_DIR`, `REPORT_PATH`, `PROJECT_BOOTSTRAP_REPORT_PATH`, `EXPECTED_PNPM_VERSION`, `WM_ROLE`, `WM_EXPECTED_ROLE`, non-secret `REPO_CLONE_URL`, `REPO_REF`, `REPO_COMMIT`, `EXPO_OWNER`, `EAS_PROJECT_ID`, `API_PORT`, Railway Dockerfile/health paths | ConfigMap/pod config, workspace bootstrap file, wrapper/source file. |
| Public Expo config | `APP_DISPLAY_NAME`, `APP_SLUG`, `APP_SCHEME`, `IOS_BUNDLE_IDENTIFIER`, `ANDROID_PACKAGE`, `API_URL` | ConfigMap/pod config or non-secret workspace bootstrap file. Never include bearer tokens, passwords, signing keys, or private endpoints. |
| Secret/tool auth | `GITHUB_TOKEN`, Codex auth, `EXPO_TOKEN`, `DATABASE_URL`, `API_BEARER_TOKEN`, Railway auth, Google ADC, ASC key, Google service account JSON | Secret, secure store, tool auth, or mounted private file only. Report presence/status only. |

### Repo Checkout And Role Identity

| Key | Required When | What To Provide | Example |
| --- | --- | --- | --- |
| `REPO_PATH` | Optional override | Checkout path used by `pod-role-bootstrap`. Default is `/workspace/projects/Wondermove-Inc/new-mobile-app`. | `/workspace/projects/Wondermove-Inc/new-mobile-app` |
| `REPO_CLONE_URL` | Required only when `REPO_PATH` is missing | Non-secret clone URL for this repository. Do not embed tokens in the URL. | `https://github.com/acme/new-mobile-app.git` |
| `REPO_REF` or `REPO_COMMIT` | Recommended for canary repeatability | Branch, tag, or commit pin used by the checkout procedure. | `main`, `preview`, `abc1234` |
| `WM_ROLE` | Required unless `/workspace/IDENTITY` exists | Role identity for the pod. | `mobile-app-dev`, `qa-release`, `design` |
| `WM_EXPECTED_ROLE` | Recommended | Guardrail value that must match resolved role identity. | `qa-release` |
| `/workspace/IDENTITY` | Alternative to `WM_ROLE` | First line contains the pod role. | `mobile-app-dev` |
| `/workspace/CODEX_MANAGED_PATHS.md` | Required | Canonical managed-path registry. It must contain the managed path entry. | `- /workspace/projects/Wondermove-Inc/new-mobile-app/` |
| `CODEX_MANAGED_PATHS` | Optional script override | Use only for scripts that explicitly support it. Evidence must name the registry file checked. | `/workspace/CODEX_MANAGED_PATHS.md` |
| `PROJECT_BOOTSTRAP_GIT_USER_NAME` / `PROJECT_BOOTSTRAP_GIT_USER_EMAIL` | Required when pod Git identity is missing and an approved org identity exists | Complete non-secret approved Git author identity pair for this pod. The agent may set `git config --global` from this pair. | `WonderMove Pod Agent` / `pod-agent@example.invalid` |
| `WM_GIT_USER_NAME` / `WM_GIT_USER_EMAIL` | Alternative approved Git identity source | Complete non-secret approved role/pod Git author identity pair. Do not invent values or mix with another source family. | `WonderMove QA Pod` / `qa-pod@example.invalid` |
| `PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH` | Optional local handoff path | File containing one complete approved `KEY=value` Git identity pair. Do not include private material or partial values intended to combine with env vars. | `/workspace/state/git-identity.env` |
| `GITHUB_TOKEN` or `gh auth` | Required for private repo or PR work | GitHub auth material as secret/status only. | Secret value, never printed |

`REPO_CLONE_URL` is a repo acquisition setting, not a mobile app runtime
setting. If the repo already exists at `/workspace/projects/Wondermove-Inc/new-mobile-app`, bootstrap
may proceed without it. Private repository access should come from GitHub auth
or a deploy secret, not from a token-bearing URL printed in logs.
`/workspace/CODEX_MANAGED_PATHS.md` is the canonical registry. `CODEX_MANAGED_PATHS`
may override the registry only for scripts that explicitly support it, and
readiness evidence must name which registry file was checked.

### Mobile Public Runtime Configuration

These values become `EXPO_PUBLIC_*` entries for Expo. They are public client
configuration compiled into the app bundle. They are not private, but they
must never contain bearer tokens, passwords, signing keys, private endpoints,
or other credentials.

| Template Value | Runtime Env | What To Provide | Example |
| --- | --- | --- | --- |
| `APP_DISPLAY_NAME` | `EXPO_PUBLIC_APP_DISPLAY_NAME` | User-visible app name. | `Customer Mobile` |
| `APP_SLUG` | `EXPO_PUBLIC_APP_SLUG` | Expo slug. | `customer-mobile` |
| `APP_SCHEME` | `EXPO_PUBLIC_APP_SCHEME` | Deep link scheme. | `customermobile` |
| `IOS_BUNDLE_IDENTIFIER` | `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER` | iOS bundle identifier. | `com.customer.mobile` |
| `ANDROID_PACKAGE` | `EXPO_PUBLIC_ANDROID_PACKAGE` | Android package/appId; also render `.maestro/home.yml` `appId`. | `com.customer.mobile` |
| `API_URL` | `EXPO_PUBLIC_API_URL` | Public API base URL the app calls. | `https://api.customer.com` |

Preview, release, and EAS job config fail when app display name, slug, scheme,
API URL, iOS bundle identifier, or Android package are missing.
Local-only placeholders such as `Mobile App Template` or `com.template.mobile`
are not production/customer settings.

### Expo And EAS Inputs

| Key | Required When | What To Provide | Example |
| --- | --- | --- | --- |
| `EXPO_OWNER` | EAS project/account setup | Expo account or organization that owns the project. | `customer-org` |
| `EAS_PROJECT_ID` | After `eas init` | EAS project UUID. Human owner runs `eas init`; Robot user does not own this step. | `00000000-0000-0000-0000-000000000000` |
| `EXPO_TOKEN_SECRET_NAME` | EAS pod secret injection | Kubernetes Secret name referenced by pod manifests. | `clawpod-eas-qa-customer-mobile` |
| `EXPO_TOKEN` | EAS CLI non-interactive auth | Expo Organization Robot user access token. Store only in Secret. | Secret value, never printed |

`EXPO_TOKEN` may be delegated to agents only through Secret injection. Store
account creation, billing, `eas init`, and production-risk decisions remain
human-owned.

### API And Railway Inputs

These are required only when `apps/api` is part of the target setup or the pod
must verify deployed backend reachability.

| Key | Required When | What To Provide | Example |
| --- | --- | --- | --- |
| `DATABASE_URL` | API runtime and migrations | PostgreSQL connection URL. Inject as secretRef/status-only, never plaintext. | `secretRef/status-only, apps/api only` |
| `API_PORT` | API runtime override | API listen port. Default is `3000`. | `3000` |
| `API_BEARER_TOKEN` | API runtime | Bearer token used by API auth checks. Inject as secretRef/status-only, never plaintext. | `secretRef/status-only, apps/api only` |
| `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN` | Railway CLI automation | Exactly one Railway auth token, if Railway operations are in scope. | `secretRef/status-only, Railway only` |
| `RAILWAY_DOCKERFILE_PATH` | Railway API deployment | Dockerfile path for the API service. | `apps/api/Dockerfile` |
| `RAILWAY_HEALTHCHECK_PATH` | Railway API deployment | Healthcheck path. | `/readyz` |

Railway evidence may list project name, service name, deployment id, domain,
health responses, exit status, and variable names. It must not include
`DATABASE_URL`, `API_BEARER_TOKEN`, `RAILWAY_TOKEN`, or `RAILWAY_API_TOKEN`
values.

### Role-Specific External Inputs

| Role | Input | When Needed | Handling |
| --- | --- | --- | --- |
| Design | Google Application Default Credentials and Stitch access | Before approved Stitch design handoff work | Mounted private file path or tool auth only; never inline ADC JSON. Verify with `stitch-adc-setup`; report status only. |
| QA/Release | EAS CLI and `EXPO_TOKEN` presence | Before approved EAS/Maestro evidence run | Verify with `eas-robot-auth-setup`; report status only. |
| QA/Release | Simulator/emulator/device or mobile-mcp path | Native evidence | Native readiness needs separate L2/L3 evidence, not just pod bootstrap. |
| Release/Human owner | `EXPO_ASC_KEY_ID`, `EXPO_ASC_ISSUER_ID`, `.p8` private key | iOS submit | Human-owned; inject as EAS/k8s secrets, never commit files. |
| Release/Human owner | Google Play service account JSON | Android submit after first manual upload | Human-owned; inject as secret file, never inline JSON. |

Store account creation, agreements, billing, 2FA, payment cards, and first
Google Play upload are human-only steps and must not be delegated to an agent.

## Example Pod Handoff

This is an example of the non-secret shape to provide to the OrbStack/OpenClaw
operator. Replace placeholder values before use. Keep private values in the
target secure store, not in committed files, chat, or command output.

```bash
# Non-secret repo and role config
export REPO_PATH="/workspace/projects/Wondermove-Inc/new-mobile-app"
export REPO_CLONE_URL="https://github.com/acme/new-mobile-app.git"
export REPO_REF="main"
export WM_ROLE="qa-release"
export WM_EXPECTED_ROLE="qa-release"
export CODEX_MANAGED_PATHS="/workspace/CODEX_MANAGED_PATHS.md"
export PROJECT_BOOTSTRAP_REPORT_PATH="/workspace/state/project-bootstrap-report.json"
export REPORT_PATH="/workspace/state/pod-role-bootstrap-report.json"

# Public mobile app config; compiled into the app bundle
export APP_DISPLAY_NAME="Customer Mobile"
export APP_SLUG="customer-mobile"
export APP_SCHEME="customermobile"
export IOS_BUNDLE_IDENTIFIER="com.customer.mobile"
export ANDROID_PACKAGE="com.customer.mobile"
export API_URL="https://api.customer.com"

# EAS and secret names
export EXPO_OWNER="customer-org"
export EAS_PROJECT_ID="00000000-0000-0000-0000-000000000000"
export EXPO_TOKEN_SECRET_NAME="clawpod-eas-qa-customer-mobile"

# API/Railway non-secret config, when apps/api is used
export API_PORT="3000"
export RAILWAY_DOCKERFILE_PATH="apps/api/Dockerfile"
export RAILWAY_HEALTHCHECK_PATH="/readyz"
```

Credential inventory to create separately. These are labels and handling rules,
not shell assignments:

```text
GITHUB_TOKEN: secretRef/tool-auth/status-only, never plaintext
Codex auth: tool auth file/status-only, never print auth JSON
EXPO_TOKEN: secretRef/status-only, never plaintext
DATABASE_URL: secretRef/status-only, apps/api only
API_BEARER_TOKEN: secretRef/status-only, apps/api only
RAILWAY_TOKEN or RAILWAY_API_TOKEN: secretRef/status-only, Railway only
Google ADC: mounted private file or gcloud ADC status-only, never inline JSON
EXPO_ASC_KEY_ID: secretRef/status-only, iOS submit only
EXPO_ASC_ISSUER_ID: secretRef/status-only, iOS submit only
ASC_API_KEY: mounted private file, iOS submit only
GOOGLE_SERVICE_ACCOUNT_KEY: mounted private file, Android submit only
```

Example managed path registry:

```text
# /workspace/CODEX_MANAGED_PATHS.md
- /workspace/projects/Wondermove-Inc/new-mobile-app/
```

Secret and ConfigMap rendering must stay separated by data class. Prefer a
non-secret ConfigMap for public/mobile/bootstrap values and a Secret or tool
auth path for private values. The current `infra/clawpod/secret.example.yaml`
contains both `EXPO_TOKEN` and public `EXPO_PUBLIC_*` values for deployment
convenience, so any rendered output from that file is private-material-bearing.

Do not print rendered private-material-bearing manifests to chat, logs,
evidence, or PR comments. Do not commit rendered manifests. If a human/ops owner
renders one, they must do so from a trusted shell and record only key names,
object names, exit status, and redacted status.

### Operator Reference URLs

These external references are operator aids only. They are not repo SoT, live
pod evidence, or a substitute for `human-gate/v1` approval.

- GitHub cloning a repository: https://docs.github.com/articles/cloning-a-repository
- GitHub remote URL guidance: https://docs.github.com/en/get-started/git-basics/about-remote-repositories
- Kubernetes ConfigMaps: https://kubernetes.io/docs/concepts/configuration/configmap/
- Configure Pods with ConfigMaps: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/
- Kubernetes Secrets: https://kubernetes.io/docs/concepts/configuration/secret/
- Kubernetes Deployments and rollout behavior: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- `kubectl rollout`: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/
- `kubectl rollout restart`: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/
- Expo environment variables: https://docs.expo.dev/guides/environment-variables/
- EAS environment variables: https://docs.expo.dev/eas/environment-variables/
- EAS overview: https://docs.expo.dev/eas/
- Create first EAS build and initialize project: https://docs.expo.dev/build/setup/
- EAS `projectId` behavior from `eas init`: https://docs.expo.dev/tutorial/eas/configure-development-build/
- EAS CLI reference: https://docs.expo.dev/eas/cli/
- Expo programmatic access: https://docs.expo.dev/accounts/programmatic-access/
- Railway variables: https://docs.railway.com/variables
- Railway CLI: https://docs.railway.com/cli
- Railway variable command: https://docs.railway.com/cli/variable
- Railway environments: https://docs.railway.com/cli/environment
- How Application Default Credentials works: https://docs.cloud.google.com/docs/authentication/application-default-credentials
- Set up Application Default Credentials: https://docs.cloud.google.com/docs/authentication/provide-credentials-adc
- Google Cloud service accounts: https://docs.cloud.google.com/iam/docs/service-account-overview
- Create Google Cloud service account keys: https://docs.cloud.google.com/iam/docs/keys-create-delete
- Google Play Developer API service account setup: https://developers.google.com/android-publisher/getting_started
- Apple App Store Connect API keys: https://developer.apple.com/documentation/appstoreconnectapi/creating-api-keys-for-app-store-connect-api
- Expo app credentials: https://docs.expo.dev/app-signing/app-credentials/
- Expo iOS credentials: https://docs.expo.dev/app-signing/ios-credentials/
- Expo Android credentials: https://docs.expo.dev/app-signing/android-credentials/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Submit iOS: https://docs.expo.dev/submit/ios/
- EAS Submit Android: https://docs.expo.dev/submit/android/

## Zero-To-Ready Sequence

1. Pod ConfigMap and Secret material must exist before bootstrap starts.
   Secret values are never printed; reports use status only.
2. Patch configuration through the correct channel. If pod-template variables
   or references changed, rollout restart, wait for readiness, and discard or
   re-source any old long-running sessions.
3. Run read-only preflight and write
   `${STATE_DIR:-/workspace/state}/bootstrap-preflight.json`. If required
   source artifacts, skill directories, repo access, or credential status checks
   are missing, continue only through `project-bootstrap` blocker handling:
   agent-owned deterministic setup may be repaired by `project-bootstrap`, while
   human-owned credentials, accounts, or live-action approvals remain blockers.
4. Run `project-bootstrap` from `/workspace/skills/project-bootstrap/SKILL.md`
   as the standard user-facing entry point. It performs the normal setup flow:
   agent-owned role identity and managed-path setup, project readiness
   preflight, Codex CLI/auth status setup, repo checkout/bootstrap through
   `pod-role-bootstrap`, re-preflight, role-specific status checks,
   `PROJECT_ENVIRONMENT.md` checks, and `human-gate/v1` policy checks. It writes
   status-only evidence to
   `${PROJECT_BOOTSTRAP_REPORT_PATH:-/workspace/state/project-bootstrap-report.json}`.
   If the generated `pod-role-bootstrap` report is present and blocked,
   `project-bootstrap` must surface that nested blocked status instead of
   presenting the pod as fully ready.
5. Treat `codex-cli-auth-setup` and `pod-role-bootstrap` as
   dependency/internal setup contracts for normal setup. Run them directly only
   for advanced recovery, focused diagnostics, or when `project-bootstrap`
   reports a source-backed blocker that asks for that exact check. Direct runs
   must still preserve secret-safe status-only reporting.
6. Confirm the generated reports:
   - `${PROJECT_BOOTSTRAP_REPORT_PATH:-/workspace/state/project-bootstrap-report.json}`;
   - `${STATE_DIR:-/workspace/state}/project-bootstrap-agent-setup-report.json`;
   - `${REPORT_PATH:-/workspace/state/pod-role-bootstrap-report.json}` when the
     workflow reaches repo checkout/bootstrap.
7. Verify Codex MCP status from the checked-out repo using `.codex/config.toml`
   as the pin source. Do not duplicate MCP versions in pod-local claims.
8. Run role-specific checks when needed and not already generated by
   `project-bootstrap`:
   - Design: `stitch-adc-setup` verifies Google ADC and Stitch MCP readiness.
   - QA/Release: `eas-robot-auth-setup` verifies EAS CLI and Expo robot auth
     readiness before any human-gated EAS/Maestro run.

## Missing Or Blocked Criteria

| Missing Condition | Required Action |
| --- | --- |
| Required SoT file is missing | Stop and request the missing repo artifact. Do not infer settings. |
| Required pod-native skill directory is missing | Stop and request skill installation or the missing `/workspace/skills/<slug>` artifact. |
| Repo path is missing | Clone only if non-secret `REPO_CLONE_URL` is explicitly configured; otherwise stop. |
| Managed path entry is missing | Stop until the owner-approved `${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}` entry exists. |
| Git identity is missing | If approved `PROJECT_BOOTSTRAP_GIT_USER_NAME` plus `PROJECT_BOOTSTRAP_GIT_USER_EMAIL`, approved `WM_GIT_USER_NAME` plus `WM_GIT_USER_EMAIL`, or one complete approved pair in `PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH` exists, let `project-bootstrap` set Git config. Otherwise request one approved non-secret Git identity pair. |
| Credential status is missing | Mark blocked or role-specific not applicable. Never work around by pasting plaintext credentials. |
| Public Expo config is missing for preview, release, or EAS job config | Stop and request the missing public config value. Do not use template fallbacks for customer/release jobs. |
| Role-specific capability is not needed | Record `not_applicable` with the role and source reason. |
| Live external action is requested without approval | Stop until a `human-gate/v1` decision exists. |

For the common `git-identity-missing` plus `github-auth-unavailable` case,
report a minimum request instead of raw blocker names: ask for one approved
non-secret Git identity pair and either approved mounted/managed GitHub auth or
the user's presence for human-present `gh auth login` / browser/device login.
The agent may use browser/computer-use to open the auth flow, but the user must
enter credentials. After that, the agent reruns the status checks and bootstrap.

Role-specific `not_applicable` examples:

| Role | Check | N/A When |
| --- | --- | --- |
| Product/Planning, Mobile Architect, Mobile App Dev, Backend/API Integrator | `eas-robot-auth-setup` | The work unit does not require EAS/Maestro evidence. |
| Non-Design roles | `stitch-adc-setup` | The pod will not run Stitch design generation/export. |
| Non-API work | `DATABASE_URL` and `API_BEARER_TOKEN` | `apps/api` is not used by the current work unit. |
| Non-Railway work | Railway auth and Railway service paths | Railway deploy/log/health evidence is not in scope. |

## Read-Only Preflight Commands

Run these checks inside the configured pod or equivalent OrbStack workspace.
The commands in this section are status checks only; they must not install
dependencies, write repo-local result files, or prove external platform behavior.
External platform behavior requires separate live evidence.

```bash
set -euo pipefail

# Required source and skill presence
REPO_PATH="${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
REPO_PATH="${REPO_PATH%/}"
MANAGED_PATH="${REPO_PATH}/"
CODEX_MANAGED_PATHS="${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}"
STATE_DIR="${STATE_DIR:-/workspace/state}"

test -d "${REPO_PATH}"
cd "${REPO_PATH}"
test -f AGENTS.md
test -f REPO_OPERATIONS.md
test -f PROJECT_ENVIRONMENT.md
test -f .codex/config.toml
test -f docs/TEMPLATE_VARIABLES.md
test -f docs/CREDENTIALS.md
test -f mobile-app-dev-team/09-pod-native-openclaw-skills/README.md
test -d mobile-app-dev-team/09-pod-native-openclaw-skills
test -d /workspace/skills/project-bootstrap
test -d /workspace/skills/codex-cli-auth-setup
test -d /workspace/skills/pod-role-bootstrap
grep -Fx -- "- ${MANAGED_PATH}" "${CODEX_MANAGED_PATHS}"

# Role status
test -n "${WM_ROLE:-}" || test -s /workspace/IDENTITY
printf '%s\n' "${WM_ROLE:-$(head -n 1 /workspace/IDENTITY 2>/dev/null || true)}"

# GitHub auth status only; do not store raw stdout/stderr as evidence
gh auth status

# Repo preflight without writing result files
EXPECTED_PNPM_VERSION="$(
  node -p "require('./package.json').packageManager.replace(/^pnpm@/, '')"
)"
node scripts/codex-preflight.mjs --pod --json --no-write

# Codex MCP status only; do not store raw stdout/stderr as evidence
codex mcp list
```

Do not store raw stdout/stderr from `gh`, `codex`, EAS, Stitch, or Railway
status commands. Store only redacted summaries: command name, exit status, key
names, object names, and status labels.

Write the preflight result summary to
`${STATE_DIR:-/workspace/state}/bootstrap-preflight.json` only after the
read-only checks above have completed. The operator or wrapper that writes the
summary creates `STATE_DIR`; the read-only command block above does not create
directories. The file must contain no secret values.

```json
{
  "schema": "bootstrap-preflight/v1",
  "status": "pass | blocked",
  "checked_at": "<iso-8601>",
  "command": "read-only-preflight",
  "result": {},
  "blocker": "missing artifact or null",
  "evidence_path": "${STATE_DIR:-/workspace/state}/bootstrap-preflight.json"
}
```

Evidence may contain command names, exit statuses, key names, object names, and
status labels. It must not contain token values, auth JSON, database URLs,
bearer token values, private key material, raw stdout/stderr, or secret-bearing
full config contents.

## Bootstrap Execution Commands

Run these only after the read-only preflight has no required blockers.

```bash
REPO_PATH="${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
REPO_PATH="${REPO_PATH%/}"
export REPO_PATH
export REPO_CLONE_URL="${REPO_CLONE_URL:-https://github.com/Wondermove-Inc/new-mobile-app.git}"
export CODEX_MANAGED_PATHS="${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}"
export PROJECT_BOOTSTRAP_REPORT_PATH="${PROJECT_BOOTSTRAP_REPORT_PATH:-/workspace/state/project-bootstrap-report.json}"
export PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH:-/workspace/state/project-bootstrap-blockers.md}"

bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
source /workspace/state/project-bootstrap-role.env 2>/dev/null || true
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
bash /workspace/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh
bash /workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

`project-bootstrap` is the normal execution model. The explicit script calls
above show its current dependency/internal setup contracts for operators who
need shell-level canary evidence; they are not separate peer setup decisions for
the user. Do not run this block until missing SoT files, missing pod-native
skills, and required credential-status blockers have been resolved or
source-backed as role-specific `not_applicable`.

For QA/Release EAS readiness:

```bash
bash /workspace/skills/eas-robot-auth-setup/scripts/eas-robot-auth-precheck.sh
```

For Design Stitch readiness:

```bash
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh
```

## First Canary Evidence

This document is a runbook, not proof that a pod is ready. First application of
this runbook must target one canary pod only. Record separate redacted evidence
for the canary before treating the process as a standard operating path.

Required canary evidence:

- redacted `${STATE_DIR:-/workspace/state}/bootstrap-preflight.json`;
- rollout and readiness result when pod-template variables or references changed;
- pod-internal read-only preflight result;
- `project-bootstrap` result;
- `pod-role-bootstrap` result;
- role-specific check result, or source-backed `not_applicable` reason;
- linked `human-gate/v1` decision before any live external action.

## Ready Definition

A role pod is ready for repo work only when:

- role identity is resolved;
- `${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}` exists;
- `${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}` contains the
  normalized managed path entry for `${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}`;
- `project-bootstrap` exits 0 and writes status-only project readiness evidence;
- `pod-role-bootstrap` exits 0;
- required role-specific pod-native checks either pass or are documented as
  not applicable;
- any live external action is covered by the required `human-gate/v1` decision.

## Non-Claims

This bootstrap does not prove:

- live OrbStack/OpenClaw pod behavior outside the observed pod;
- GitHub branch protection, push, PR, or review behavior;
- EAS build, submit, update, Maestro cloud, or native device behavior;
- Stitch generation/export behavior;
- Jira, Confluence, Railway, or other external platform behavior.

Those claims require separate human-approved live evidence.
