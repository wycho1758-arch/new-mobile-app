# OrbStack Pod Config Setup Runbook Plan

This plan defines how the owner/operator should supply missing values for an
OrbStack/OpenClaw role pod. It is source guidance only; it is not live evidence,
does not modify an external platform, and must not be used as a PASS artifact.

Official documentation URLs were checked on 2026-06-11 and are included for
operator setup steps. Repo-specific behavior remains governed by `AGENTS.md`,
`REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`, `docs/TEMPLATE_VARIABLES.md`,
`docs/CREDENTIALS.md`, and `mobile-app-dev-team/16-pod-environment-bootstrap.md`.

## Plan Verdict

Use the existing bootstrap runbook with additional owner/operator values. The
current repo can provide non-secret defaults and pins, but cannot infer target
pod identity, live pod configuration, managed-path approval, credential status,
or role-specific external access.

First application must be a single canary pod:

```text
collect non-secret values and status-only credential refs
-> patch the correct pod/config channel
-> rollout restart when pod-template variables or references changed
-> wait for readiness
-> run pod-internal redacted read-only preflight
-> stop on blockers or run project-bootstrap
-> run pod-role-bootstrap only after project-bootstrap has no required blockers
-> record redacted evidence
```

No live external action is allowed before `human-gate/v1`.

## Step 1 - Identify Target Pod And Role

Owner/operator supplies:

- Target pod id, deployment, or role-pod selector.
- `WM_ROLE`.
- `WM_EXPECTED_ROLE`.
- `/workspace/IDENTITY` only when the pod uses file-based identity instead of
  explicit role variables.

Apply as non-secret pod config, ConfigMap, workspace bootstrap file, or wrapper
source file. If the value is injected through a pod template, use the restart
sequence in Step 6.

## Step 2 - Provide Repo Acquisition Inputs

Use these current repo values unless the canary intentionally targets a
different branch or commit:

- `REPO_CLONE_URL`: `https://github.com/Wondermove-Inc/new-mobile-app.git`
- `REPO_REF`: `feat/mobile-app-template`
- `REPO_COMMIT`: `ccff06faf01f8c553598a3cde7c997f69378f7d6`
- `REPO_PATH`: `/workspace/projects/Wondermove-Inc/new-mobile-app`

If the repo already exists in the target pod, do not clone. If it is missing,
clone only from a non-secret URL and use GitHub auth or deploy credentials via a
secure channel for private access.

Official reference:

- GitHub cloning a repository: https://docs.github.com/articles/cloning-a-repository
- GitHub remote repository URL guidance: https://docs.github.com/en/get-started/git-basics/about-remote-repositories

## Step 3 - Approve Managed Path

Owner/operator must ensure the target pod registry exists and contains the
normalized repo path:

```bash
REPO_PATH="${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
REPO_PATH="${REPO_PATH%/}"
MANAGED_PATH="${REPO_PATH}/"
CODEX_MANAGED_PATHS="${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}"
grep -Fx -- "- ${MANAGED_PATH}" "${CODEX_MANAGED_PATHS}"
```

Missing managed path means stop until an owner-approved entry exists. The pod is
not ready for Codex-managed repo work without this registry entry.

## Step 4 - Install Required Pod Skills

The target pod must contain these runtime artifacts:

- `/workspace/skills/project-bootstrap`
- `/workspace/skills/codex-cli-auth-setup`
- `/workspace/skills/pod-role-bootstrap`

Role-specific additions:

- QA/Release: `/workspace/skills/eas-robot-auth-setup`
- Design: `/workspace/skills/stitch-adc-setup`

The source artifacts in this repo are under
`mobile-app-dev-team/09-pod-native-openclaw-skills/`. Missing skill directory
means stop and request skill installation or a pod image/artifact refresh.

## Step 5 - Classify And Apply Values

Use the data channel from `mobile-app-dev-team/16-pod-environment-bootstrap.md`:

| Data | Channel | Required Action |
| --- | --- | --- |
| Role, repo path, state path, report path, pnpm expectation, public mobile config | ConfigMap, pod config, workspace bootstrap file, or wrapper/source file | Apply as non-secret values only. |
| GitHub auth, Codex auth, Expo robot auth, API private runtime values, Railway auth, Google ADC, ASC key, Google Play service account JSON | Secret, secure store, tool auth, or mounted private file | Provide reference/status only. Never place private values in chat, reports, committed files, or public Expo config. |
| Public Expo app config | ConfigMap, pod config, or non-secret workspace bootstrap file | Allowed because it is compiled into the app bundle, but it must not contain credentials or private endpoints. |

Official references:

- Kubernetes ConfigMaps: https://kubernetes.io/docs/concepts/configuration/configmap/
- Configure Pods with ConfigMaps: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/
- Kubernetes Secrets: https://kubernetes.io/docs/concepts/configuration/secret/
- Expo environment variables: https://docs.expo.dev/guides/environment-variables/
- EAS environment variables: https://docs.expo.dev/eas/environment-variables/

## Step 6 - Restart And Readiness Rule

If pod-template variables, `envFrom`, `valueFrom`, or Secret references changed,
the operator must run:

```text
patch
-> rollout restart
-> rollout/readiness status
-> pod-internal redacted read-only preflight
```

Workspace files and wrapper/source files do not require pod restart, but they
apply only to the next exec/session. Existing long-running shell or Codex
sessions must be discarded or re-source the file.

Official references:

- Kubernetes Deployments and rollout behavior: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- `kubectl rollout`: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/
- `kubectl rollout restart`: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/

## Step 7 - Configure Expo/EAS Inputs When In Scope

Owner/operator must provide these non-secret values before preview, release, or
EAS job config:

- `EXPO_OWNER`
- `EAS_PROJECT_ID`
- `EXPO_TOKEN_SECRET_NAME` or the concrete Expo token secretRef object/key name
- `EXPO_PUBLIC_APP_DISPLAY_NAME`
- `EXPO_PUBLIC_APP_SLUG`
- `EXPO_PUBLIC_APP_SCHEME`
- `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`
- `EXPO_PUBLIC_ANDROID_PACKAGE`
- `EXPO_PUBLIC_API_URL`

The current template fallbacks are local-only and must not be used as customer
release settings. The Expo robot token is private material and must be supplied
as a secretRef object/key plus status only.

Official references:

- EAS overview: https://docs.expo.dev/eas/
- Create first EAS build and initialize project: https://docs.expo.dev/build/setup/
- EAS `projectId` behavior from `eas init`: https://docs.expo.dev/tutorial/eas/configure-development-build/
- EAS CLI reference: https://docs.expo.dev/eas/cli/
- Expo programmatic access: https://docs.expo.dev/accounts/programmatic-access/

## Step 8 - Configure API And Railway Inputs When In Scope

Known non-secret repo values:

- `API_PORT`: `3000`
- `RAILWAY_DOCKERFILE_PATH`: `apps/api/Dockerfile`
- `RAILWAY_HEALTHCHECK_PATH`: `/readyz`
- Current QA API URL: `https://api-production-3d74.up.railway.app`

Owner/operator supplies status-only private references for API database and
bearer-token material, plus Railway auth when Railway CLI operations are in
scope. Evidence may record project/service names, deployment id, public domain,
health response status, variable names, command name, and exit status. Do not
store raw CLI stdout/stderr from Railway commands.

Official references:

- Railway variables: https://docs.railway.com/variables
- Railway CLI: https://docs.railway.com/cli
- Railway variable command: https://docs.railway.com/cli/variable
- Railway environments: https://docs.railway.com/cli/environment

## Step 9 - Configure Design Or Release Credentials When In Scope

Design/Stitch:

- Provide Google ADC as mounted private file path or tool auth status only.
- Run the pod-native `stitch-adc-setup` status check.

Release submit:

- iOS submit requires human-owned App Store Connect credential references.
- Android submit requires human-owned Google Play service account reference.
- First Google Play upload and store account/billing/agreement steps remain
  human-owned.

Official references:

- How Application Default Credentials works: https://docs.cloud.google.com/docs/authentication/application-default-credentials
- Set up Application Default Credentials: https://docs.cloud.google.com/docs/authentication/provide-credentials-adc
- Google Cloud service accounts: https://docs.cloud.google.com/iam/docs/service-account-overview
- Create Google Cloud service account keys: https://docs.cloud.google.com/iam/docs/keys-create-delete
- Google Play Developer API service account setup: https://developers.google.com/android-publisher/getting_started
- Apple App Store Connect API keys: https://developer.apple.com/documentation/appstoreconnectapi/creating-api-keys-for-app-store-connect-api
- EAS Submit overview: https://docs.expo.dev/submit/introduction/
- EAS Submit iOS: https://docs.expo.dev/submit/ios/
- EAS Submit Android: https://docs.expo.dev/submit/android/

## Step 10 - Run Read-Only Preflight Before Bootstrap

Operator or wrapper creates `${STATE_DIR:-/workspace/state}` if it does not
exist, then runs a read-only preflight that checks:

- Required SoT files in the repo.
- Required `/workspace/skills/*` directories in the pod.
- Repo path presence.
- Normalized managed path entry.
- `PROJECT_ENVIRONMENT.md` consistency for repo runtime facts.
- Required MCP names: `mobile-mcp`, `serena`, and `stitch`; conditional MCPs:
  `expo`, `atlassian`, `node_repl`, and `playwright`.
- Auxiliary CLI status for `codex`, GitHub auth, Railway, `gcloud`, EAS, and
  workspace Expo when in scope.
- Credential status checks as status-only or role-specific N/A.

The preflight result must be written to
`${STATE_DIR:-/workspace/state}/bootstrap-preflight.json` with this schema:

```json
{
  "status": "pass|blocked",
  "checked_at": "ISO-8601 timestamp",
  "command": "redacted command name",
  "result": "redacted summary",
  "blocker": "null or missing artifact name",
  "evidence_path": "path to redacted evidence"
}
```

Do not store raw stdout/stderr from `gh`, `codex`, EAS, Stitch, or Railway
status commands. Store only redacted summaries: command name, exit status, key
names, object names, and status labels.

## Step 11 - Missing And Block Handling

| Missing Item | Decision |
| --- | --- |
| Required SoT file | Stop and request the artifact or correct repo checkout. |
| Required pod skill directory | Stop and request skill install or pod artifact refresh. |
| Repo path | Clone only when explicit non-secret `REPO_CLONE_URL` is configured; otherwise stop. |
| Managed path entry | Stop until owner-approved normalized entry exists. |
| Credential status | Block or mark role-specific N/A. Never work around with plaintext. |
| Rollout/readiness evidence after pod-template change | Stop and request operator evidence. |
| `human-gate/v1` for live external action | Stop until explicit approval exists. |

## Step 12 - Bootstrap Execution Gate

Run `project-bootstrap` first after read-only preflight passes or role-specific
N/A is justified. It writes redacted project-level evidence to
`${PROJECT_BOOTSTRAP_REPORT_PATH:-/workspace/state/project-bootstrap-report.json}`.
Run `pod-role-bootstrap` only after the project-level report has no required
blockers. The role bootstrap may install dependencies and write redacted
state/evidence under `${STATE_DIR:-/workspace/state}` or configured
`REPORT_PATH`.

Evidence required for the first canary:

- Redacted `bootstrap-preflight.json`.
- Rollout/readiness result when pod-template values or references changed.
- Pod-internal preflight result.
- `project-bootstrap` result.
- `pod-role-bootstrap` result.
- Role-specific pass or N/A reason.
- `human-gate/v1` before any live external action.

## Reviewer Checklist

Before handoff, reviewer must confirm:

- The values file contains only non-secret actual values or missing/status-only
  requests.
- The runbook uses official URLs for external setup steps.
- `REPO_PATH`, `CODEX_MANAGED_PATHS`, and `STATE_DIR` overrides are respected.
- `/workspace/skills/project-bootstrap` and
  `${PROJECT_BOOTSTRAP_REPORT_PATH:-/workspace/state/project-bootstrap-report.json}`
  are included in the first canary path.
- Managed path check normalizes trailing slash.
- Restart/readiness/preflight sequence is present.
- Raw status-command output and rendered private manifests are forbidden.
- The document does not claim live pod PASS.
