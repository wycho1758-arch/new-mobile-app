# node_repl Removal Login Proof Implementation Checkpoint

Date: 2026-06-14
Checkpoint: 2 - implementation

## Scope

Implemented the plan across the project-bootstrap runtime layer:

- `node_repl` is optional Codex app/plugin inventory and no longer a
  `project-bootstrap` required MCP blocker.
- Railway remains a required CLI. When missing, the setup script runs
  `npm i -g @railway/cli`, rechecks `railway --version`, checks
  `railway whoami`, and starts `railway login` when
  `PROJECT_BOOTSTRAP_HUMAN_PRESENT=true`.
- gcloud remains a required CLI. The setup script records gcloud auth, ADC, and
  project status fields, supports `gcloud auth login`,
  `gcloud auth application-default login` when explicitly required, and
  verifies project selection with `gcloud config get-value project`.
- Credential storage proof is metadata-only for Railway, gcloud, GitHub, and
  Expo/EAS paths. Report fields set `contents_checked: false`.
- English/Korean blocker guidance now tells the user that the agent performs
  install/login commands and the user only signs in or provides the non-secret
  project ID.
- Local SoT docs and local Confluence mirror were updated. No live Confluence
  publish was performed.

## Changed Paths

- `PROJECT_ENVIRONMENT.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`

## Focused Verification

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result:

```text
project-bootstrap-agent-setup smoke passed
```

Exit code: 0

## Secret Safety

The smoke eval still runs `assert_json_no_secret_like` on generated reports.
Credential proof fields are path/status metadata only and explicitly record
`contents_checked: false`.

## Reviewer Status

Pending xhigh reviewer check before broader gates.
