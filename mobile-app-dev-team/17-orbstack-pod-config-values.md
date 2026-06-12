# OrbStack Pod Config Values

This file lists the current non-secret values that can be confirmed from the
repo and the values that still must be supplied by the owner/operator before a
role pod can be bootstrapped. It is not live pod evidence and it does not prove
that an OrbStack/OpenClaw pod has these values configured.

Do not add token values, OAuth material, private keys, database URLs, bearer
tokens, auth JSON, rendered Secret manifests, or raw status-command output to
this file.

## Confirmed Non-Secret Values

| Key | Current Value | Use | Source |
| --- | --- | --- | --- |
| `REPO_CLONE_URL` | `https://github.com/Wondermove-Inc/new-mobile-app.git` | Clone URL only when the repo is absent from the target pod. Must stay token-free. | `git remote get-url origin` |
| `REPO_REF` | `feat/mobile-app-template` | Repeatable checkout branch for canary use when a commit pin is not required. | `git rev-parse --abbrev-ref HEAD` |
| `REPO_COMMIT` | `ccff06faf01f8c553598a3cde7c997f69378f7d6` | Stronger repeatability pin for canary checkout. This is the current `HEAD` before uncommitted handoff doc changes; update after final commit if the pod must reproduce this document revision exactly. | `git rev-parse HEAD` |
| `REPO_PATH` | `/workspace/projects/Wondermove-Inc/new-mobile-app` | Default pod checkout path expected by bootstrap docs. Target pod may override it explicitly. | `mobile-app-dev-team/16-pod-environment-bootstrap.md` |
| `CODEX_MANAGED_PATHS` | `/workspace/CODEX_MANAGED_PATHS.md` | Default managed-path registry path. Target pod may override it only for scripts that support the override. | `mobile-app-dev-team/16-pod-environment-bootstrap.md` |
| Managed path entry | `- /workspace/projects/Wondermove-Inc/new-mobile-app/` | Owner-approved entry required before Codex-managed repo work. | `mobile-app-dev-team/16-pod-environment-bootstrap.md` |
| `STATE_DIR` | `/workspace/state` | Default state/evidence directory for pod preflight and bootstrap reports. | `mobile-app-dev-team/16-pod-environment-bootstrap.md` |
| `PROJECT_BOOTSTRAP_REPORT_PATH` | `/workspace/state/project-bootstrap-report.json` | Default project-level pod readiness report path. | `mobile-app-dev-team/16-pod-environment-bootstrap.md`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md` |
| `REPORT_PATH` | `/workspace/state/pod-role-bootstrap-report.json` | Default bootstrap report path when no override is provided. | `mobile-app-dev-team/16-pod-environment-bootstrap.md` |
| `EXPECTED_PNPM_VERSION` | `9.15.9` | Expected package manager version. Source order is `package.json` `packageManager`, confirmation in `PROJECT_ENVIRONMENT.md`, then explicit source-backed override. | `package.json`, `PROJECT_ENVIRONMENT.md` |
| Expo SDK | `56` | Current mobile runtime baseline. | `AGENTS.md`, `PROJECT_ENVIRONMENT.md` |
| React Native | `0.85` | Current mobile runtime baseline. | `AGENTS.md`, `PROJECT_ENVIRONMENT.md` |
| NativeWind | `v5 preview` | Current mobile styling baseline. | `AGENTS.md`, `PROJECT_ENVIRONMENT.md` |
| `API_PORT` | `3000` | Default API listen port when `apps/api` is in scope. | `docs/TEMPLATE_VARIABLES.md`, `PROJECT_ENVIRONMENT.md` |
| `RAILWAY_DOCKERFILE_PATH` | `apps/api/Dockerfile` | Railway API service build path when Railway deployment is in scope. | `PROJECT_ENVIRONMENT.md` |
| `RAILWAY_HEALTHCHECK_PATH` | `/readyz` | Railway API service healthcheck path when Railway deployment is in scope. | `PROJECT_ENVIRONMENT.md` |
| Railway project | `new-mobile-app` | Current QA Railway project name for status/evidence only. | `PROJECT_ENVIRONMENT.md` |
| Railway API service | `api` | Current QA Railway API service name for status/evidence only. | `PROJECT_ENVIRONMENT.md` |
| Railway database service | `Postgres` | Current QA Railway database service name for status/evidence only. | `PROJECT_ENVIRONMENT.md` |
| Railway QA API URL | `https://api-production-3d74.up.railway.app` | Current QA API base URL; do not assume it is the target customer production URL. | `PROJECT_ENVIRONMENT.md` |
| Railway deployment id | `4c701f22-3ce9-40ef-a4bd-560252b773f3` | Latest verified QA deployment id for status/evidence only. | `PROJECT_ENVIRONMENT.md` |
| API health paths | `/livez`, `/readyz` | Current API health endpoints. | `PROJECT_ENVIRONMENT.md` |

## Template Local Defaults

These are actual current fallback values in the repo. They are acceptable for
local/template checks only and must not be treated as customer, preview,
release, or EAS job configuration.

| Key | Current Fallback | Use | Source |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_APP_ENV` | `development` | Local app environment label. | `PROJECT_ENVIRONMENT.md` |
| `EXPO_PUBLIC_APP_DISPLAY_NAME` | `Mobile App Template` | Local/template display name fallback. | `apps/mobile/app.config.ts`, `PROJECT_ENVIRONMENT.md` |
| `EXPO_PUBLIC_APP_SLUG` | `mobile-app-template` | Local/template Expo slug fallback. | `apps/mobile/app.config.ts`, `PROJECT_ENVIRONMENT.md` |
| `EXPO_PUBLIC_APP_SCHEME` | `mobileapptemplate` | Local/template deep link scheme fallback. | `apps/mobile/app.config.ts`, `PROJECT_ENVIRONMENT.md` |
| `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER` | `com.template.mobile` | Local/template iOS bundle id fallback. | `apps/mobile/app.config.ts`, `PROJECT_ENVIRONMENT.md` |
| `EXPO_PUBLIC_ANDROID_PACKAGE` | `com.template.mobile` | Local/template Android package fallback. | `apps/mobile/app.config.ts`, `PROJECT_ENVIRONMENT.md` |
| `EXPO_PUBLIC_API_URL` | `https://example.invalid` app config fallback; `http://127.0.0.1:65535` documented RN Web local placeholder | Local-only API fallback. Provide an explicit public API URL for preview, release, or EAS job configuration. | `apps/mobile/app.config.ts`, `PROJECT_ENVIRONMENT.md` |

## Required Owner/Operator Inputs Not Confirmed Internally

| Required Input | Current Status | Use | How It Must Be Supplied |
| --- | --- | --- | --- |
| Target pod id or target role pod selector | Missing | Identifies the pod receiving the handoff. | Owner/operator provides the concrete pod or canary selector. |
| `WM_ROLE` | Missing | Runtime role identity. | Non-secret pod config, workspace bootstrap file, or `/workspace/IDENTITY`. |
| `WM_EXPECTED_ROLE` | Missing | Guardrail that must match resolved role identity. | Non-secret pod config or workspace bootstrap file. |
| Repo presence in target pod | Missing | Determines whether clone is needed. | Pod-internal read-only preflight checks `${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}`. |
| Owner-approved managed path entry in target pod | Missing | Allows Codex-managed work under the repo path. | Owner/operator adds normalized entry to `${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}`. |
| `/workspace/skills/project-bootstrap` | Missing from local repo because this is a pod artifact | Required project-level boram pod readiness skill. | Installed under `/workspace/skills` in the target pod from `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/`. |
| `/workspace/skills/codex-cli-auth-setup` | Missing from local repo because this is a pod artifact | Required pod-native auth precheck skill. | Installed under `/workspace/skills` in the target pod from `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/`. |
| `/workspace/skills/pod-role-bootstrap` | Missing from local repo because this is a pod artifact | Required pod bootstrap skill. | Installed under `/workspace/skills` in the target pod from `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/`. |
| `EXPO_OWNER` | Missing | Required when EAS project, build, submit, or release evidence is in scope. | Owner/operator provides public Expo account or organization name. |
| `EAS_PROJECT_ID` | Missing | Required after human-owned EAS project initialization. | Owner/operator provides UUID/status from EAS project setup. |
| `EXPO_TOKEN_SECRET_NAME` or Expo token secretRef object/key | Missing | Required when QA/Release EAS work needs non-interactive Expo robot auth. | Owner/operator provides secret object/key reference and status only; never token value. |
| Customer public Expo config | Missing for customer/preview/release use | App display name, slug, scheme, iOS bundle id, Android package, and public API URL. | Owner/operator provides non-secret public values. Do not place credentials in `EXPO_PUBLIC_*`. |
| GitHub auth | Missing | Required for private clone, branch, PR, or GitHub status work. | Tool auth or secretRef/status only. Never use token-bearing clone URLs. |
| Codex auth | Missing | Required before pod Codex CLI work. | Tool auth file/status only. Never print auth JSON. |
| Expo robot auth | Missing | Required for QA/Release EAS work. | SecretRef/status only; value never appears in reports. |
| API private runtime values | Missing | Required when `apps/api` runtime, migrations, or auth checks are in scope. | SecretRef/status only for database and bearer-token material. |
| Railway auth | Missing | Required only for Railway CLI/project mutation or status work beyond public health checks. | SecretRef/status only. |
| Google ADC / Stitch access | Missing | Required for Design role Stitch handoff work. | Mounted private file path or tool auth status only. Never inline ADC JSON. |
| ASC credentials | Missing | Required only for iOS submit. | Human-owned App Store Connect key references/status only. |
| Google Play service account | Missing | Required only for Android submit. | Human-owned mounted private file reference/status only. |
| Rollout/readiness evidence | Missing | Required after pod-template variable or Secret reference changes. | Operator records rollout status, readiness, and pod-internal redacted preflight result. |
| `human-gate/v1` approval | Missing | Required before live external action. | Human approval artifact; docs and preflight do not replace approval. |

## Handoff Decision

The current repo contains enough non-secret source information to prepare a
canary handoff package, but it does not contain target-pod identity, live pod
readiness, managed-path approval in the pod, `/workspace/skills` installation
proof, `project-bootstrap` report proof, or credential status. Request those
items from the owner/operator before running bootstrap.
