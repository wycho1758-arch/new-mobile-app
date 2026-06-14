# project-bootstrap required tool ownership implementation checkpoint

Date: 2026-06-14
Checkpoint: 2 - implementation before SoT docs

## Scope

Implemented the previously red evals for required `node_repl`, Railway, and
gcloud readiness.

Changed source paths:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`

SoT docs and local `docs/confluence` mirror are intentionally still pending for
the next checkpoint.

## Implementation summary

- Added `tool_readiness.node_repl` to the agent setup report.
- Kept `node_repl` owned by the Codex app/plugin environment and avoided a
  repo-local MCP registration suggestion.
- Added approved-installer handling for required `railway` and `gcloud` CLIs.
- Installation is attempted only from explicit non-secret installer path env vars:
  - `PROJECT_BOOTSTRAP_RAILWAY_INSTALLER_PATH`
  - `PROJECT_BOOTSTRAP_GCLOUD_INSTALLER_PATH`
  - `PROJECT_BOOTSTRAP_AGENT_TOOL_BIN_DIR`
- After an approved installer runs, the script updates the role env PATH and
  rechecks CLI availability and `--version`.
- Railway auth and gcloud project state are checked status-only with output
  redirected/redacted.
- Preflight guidance now names `node_repl`, Railway CLI, and gcloud CLI as
  mandatory blockers and gives minimal user/platform actions.

## Commands

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh evals/skills/project-bootstrap-agent-setup-smoke.sh
```

## Results

```text
project-bootstrap-agent-setup smoke passed
```

```text
bash -n exited 0
```

Some existing smoke cases printed local `railway`/`gcloud` status messages to
stderr because those older cases use the host PATH. The newly added missing and
approved-installer cases use a node-only fixture PATH and do not depend on host
Railway/gcloud availability.

## Pending next checkpoint

- Update root SoT docs and project-bootstrap references.
- Update local `docs/confluence` mirror for changed runtime/MCP/project-bootstrap
  facts.
- Do not perform live Confluence publication without explicit target page IDs,
  current versions, proposed body diff, reviewer evidence, and user approval.
