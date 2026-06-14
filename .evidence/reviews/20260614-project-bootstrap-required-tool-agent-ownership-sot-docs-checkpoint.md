# project-bootstrap required tool ownership SoT/docs checkpoint

Date: 2026-06-14
Checkpoint: 3 - SoT docs and local Confluence mirror sync

## Scope

Updated repo-local SoT docs and project-bootstrap references after implementation
checkpoint 2 passed review.

Changed documentation paths:

- `PROJECT_ENVIRONMENT.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`

## SoT updates

- `PROJECT_ENVIRONMENT.md` now records that Railway/gcloud are mandatory
  project-bootstrap CLI surfaces and may be installed by the agent only from
  explicit approved non-secret installer paths.
- `project-bootstrap/SKILL.md` now separates agent-owned approved-installer work
  from human/platform-owned login, token, ADC, project selection, and service
  enablement.
- `docs/CODEX_MCP_ENVIRONMENT.md` now documents:
  - `PROJECT_BOOTSTRAP_RAILWAY_INSTALLER_PATH`
  - `PROJECT_BOOTSTRAP_GCLOUD_INSTALLER_PATH`
  - `PROJECT_BOOTSTRAP_AGENT_TOOL_BIN_DIR`
  - role env PATH persistence and post-install `--version` rechecks.
- `report-template.md` now includes the new `tool_readiness` schema.
- `blocker-resolution-guide.md` now describes the approved-installer ownership
  ladder and remaining human/platform-owned actions.
- Local `docs/confluence` mirror now contains the changed runtime fact section.

## Confluence publication status

Local mirror updated. Live Confluence publication was not performed.

Reason: `REPO_OPERATIONS.md` and `PROJECT_ENVIRONMENT.md` require explicit
target page IDs, current versions, proposed body changes, reviewer evidence, and
user approval before live Confluence publish/update. Those inputs are not present
for this checkpoint.

## Commands

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh evals/skills/project-bootstrap-agent-setup-smoke.sh
rg -n "install/login|install, ADC|install, account|installation, account|install/token|install setup remains|install remains|Railway CLI install|gcloud CLI install|install/login/token" PROJECT_ENVIRONMENT.md docs/CODEX_MCP_ENVIRONMENT.md docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap
```

## Results

```text
project-bootstrap-agent-setup smoke passed
bash -n exited 0
```

The contradiction search found no remaining SoT statement that makes
Railway/gcloud CLI installation entirely human-owned. It found only expected
workflow labels or current minimal-action text that separates approved
installer setup from human-owned login/credential work.
