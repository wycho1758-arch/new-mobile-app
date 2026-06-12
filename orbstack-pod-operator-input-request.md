# OrbStack Pod Operator Input Request

This document defines the next documentation update to make before handing
OrbStack/OpenClaw pod setup to an owner/operator.

## Decision

`mobile-app-dev-team/17-orbstack-pod-config-values.md` should be reshaped from a
broad value inventory into an operator input request form.

Values that are already source-backed by `PROJECT_ENVIRONMENT.md`, git state, or
`mobile-app-dev-team/16-pod-environment-bootstrap.md` should not be requested
from the user again. The operator should provide only values that cannot be
derived from repo SoT or values that must be supplied as status/reference
evidence for security reasons.

## Values To Read From Repo SoT

Do not ask the user/operator to re-enter these unless they intentionally need an
override and provide the reason.

| Source | Values |
| --- | --- |
| `PROJECT_ENVIRONMENT.md` | pnpm/package manager expectation, Expo/RN/NativeWind baseline, public Expo variable rules, API default port, Railway QA API URL, Railway service names, Railway Dockerfile path, Railway healthcheck path, required gates |
| `package.json` | `packageManager` source value |
| git state | current remote URL, branch, and commit pin |
| `mobile-app-dev-team/16-pod-environment-bootstrap.md` | default `REPO_PATH`, default `CODEX_MANAGED_PATHS`, default `STATE_DIR`, default `REPORT_PATH`, restart/readiness/preflight rules |

## Values To Request From Owner/Operator

| Input | Purpose | Accepted Format | Security Rule |
| --- | --- | --- | --- |
| Target pod id or selector | Identify the canary role pod | Pod name, deployment selector, or role-pod selector | Non-secret |
| `WM_ROLE` | Runtime role identity | Role string such as `mobile-app-dev`, `qa-release`, or `design` | Non-secret |
| `WM_EXPECTED_ROLE` | Guardrail against role mismatch | Same role string format as `WM_ROLE` | Non-secret |
| Repo presence in target pod | Decide whether clone is needed | `repo_exists=true/false`; if false, provide token-free clone URL | Do not embed tokens in clone URLs |
| `REPO_PATH` override | Use only when target pod path differs from default | Absolute POSIX path | Non-secret |
| Managed path approval | Prove Codex-managed path is approved | Registry path plus normalized entry status | Prefer status/evidence, not raw full file dump |
| Required `/workspace/skills/*` presence | Prove pod-native bootstrap artifacts exist | Directory presence status for required skills | Status-only |
| Customer public Expo config | Preview/release/EAS app identity and public API endpoint | App display name, slug, scheme, iOS bundle id, Android package, public API URL | Public client config; never include credentials or private endpoints |
| `EXPO_OWNER` | EAS account or organization owner | Expo account/org name | Non-secret |
| `EAS_PROJECT_ID` | EAS project link | UUID or status from human-owned EAS setup | Non-secret/status |
| Expo token secret reference | Non-interactive EAS auth | Secret object/key name plus presence status | Never provide token value |
| GitHub auth status | Private repo, branch, PR, or GitHub status work | Tool auth status or secretRef/status | Never provide token value |
| Codex auth status | Pod Codex CLI readiness | Tool auth file/status | Never print auth JSON |
| API private runtime references | API runtime/migration/auth scope | SecretRef/status for database and bearer-token material | Never provide DB URL or bearer token plaintext |
| Railway auth reference | Railway CLI operations | SecretRef/status | Never provide token value |
| Google ADC / Stitch access | Design role Stitch work | Mounted private file path or tool auth status | Never inline ADC JSON |
| ASC credential references | iOS submit scope | App Store Connect key references/status | Human-owned; never provide private key plaintext |
| Google Play service account reference | Android submit scope | Mounted private file reference/status | Human-owned; never inline JSON |
| Rollout/readiness evidence | Required after pod-template variable or reference changes | Rollout status, readiness status, redacted pod preflight result | Redacted summary only |
| `human-gate/v1` approval | Required before live external action | Approval artifact/link/status | No live action before approval |

## Public Expo Config Rule

`EXPO_PUBLIC_*` values are compiled into the client app and are not private.
They are still user/operator inputs for customer, preview, release, and EAS
configuration because template fallback values are local-only.

Never place bearer tokens, passwords, signing keys, private service endpoints,
or other credentials in `EXPO_PUBLIC_*`.

## Secure Submission Format

Use a short operator response document instead of chat for anything that could
be confused with secret material.

Recommended shape:

```yaml
target:
  pod_selector: "<pod or selector>"
  wm_role: "<role>"
  wm_expected_role: "<role>"

repo:
  repo_exists: true
  repo_path_override: null
  clone_url_if_missing: null
  managed_path_registry: "/workspace/CODEX_MANAGED_PATHS.md"
  managed_path_entry_present: true

skills:
  codex_cli_auth_setup: "present|missing"
  pod_role_bootstrap: "present|missing"
  eas_robot_auth_setup: "present|missing|not_applicable"
  stitch_adc_setup: "present|missing|not_applicable"

public_expo_config:
  app_display_name: "<public display name>"
  app_slug: "<public slug>"
  app_scheme: "<public scheme>"
  ios_bundle_identifier: "<public bundle id>"
  android_package: "<public package>"
  api_url: "<public API base URL>"
  expo_owner: "<Expo account or org>"
  eas_project_id: "<UUID or not_applicable>"

credential_status:
  github_auth: "present|missing|not_applicable"
  codex_auth: "present|missing"
  expo_token_secret_ref: "<object/key or not_applicable>"
  api_private_refs: "present|missing|not_applicable"
  railway_auth_ref: "present|missing|not_applicable"
  google_adc_ref: "present|missing|not_applicable"
  asc_refs: "present|missing|not_applicable"
  google_play_ref: "present|missing|not_applicable"

evidence:
  rollout_readiness: "<path/status or not_applicable>"
  bootstrap_preflight: "<path/status or pending>"
  human_gate_v1: "<path/status or not_requested>"
```

Do not include raw stdout/stderr from `gh`, `codex`, EAS, Stitch, Railway, or
cloud CLI status commands. Store only command name, exit status, key/object
names, and redacted status labels.

## Next Documentation Update

Update `mobile-app-dev-team/17-orbstack-pod-config-values.md` so it becomes:

1. `PROJECT_ENVIRONMENT.md`-backed values: read-only SoT, not user input.
2. Operator input request form: only live pod values, role identity, approvals,
   credential refs/status, and customer public Expo config.
3. Secure response format: YAML or table form that forbids secret values and raw
   command output.
4. Stop criteria: missing role/pod identity, managed path approval, required
   skill artifacts, credential status, rollout evidence, or human gate.
