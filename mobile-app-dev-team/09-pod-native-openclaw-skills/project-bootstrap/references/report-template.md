# Project Bootstrap Report Template

Use this template for `/workspace/state/project-bootstrap-report.json` or for a
human-readable summary derived from it.

```json
{
  "schema": "project-bootstrap/v1",
  "status": "ready_for_bootstrap | blocked",
  "repo": {
    "clone_url_status": "configured_non_secret | token_bearing_or_rejected",
    "path": "/workspace/projects/Wondermove-Inc/new-mobile-app",
    "path_status": "present | missing",
    "managed_path": {
      "registry": "/workspace/CODEX_MANAGED_PATHS.md",
      "status": "present | missing registry | missing managed path entry"
    }
  },
  "role": {
    "resolved": "Product/Planning | Design | Mobile Architect | Mobile App Dev | Backend/API Integrator | QA/Release | design | qa-release | missing",
    "normalized": "product-planning | design | mobile-architect | mobile-app-dev | backend-api-integrator | qa-release | missing",
    "expected": "match | mismatch | not_configured",
    "requires_stitch": false,
    "requires_eas": false
  },
  "repo_sot_files": {
    "AGENTS.md": "present | missing",
    "REPO_OPERATIONS.md": "present | missing",
    "PROJECT_ENVIRONMENT.md": "present | missing",
    ".codex/config.toml": "present | missing",
    "docs/TEMPLATE_VARIABLES.md": "present | missing",
    "docs/CREDENTIALS.md": "present | missing",
    "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md": "present | missing"
  },
  "pod_skills": {
    "project_bootstrap": "present | missing",
    "codex_cli_auth_setup": "present | missing",
    "pod_role_bootstrap": "present | missing",
    "stitch_adc_setup": "present | missing",
    "eas_robot_auth_setup": "present | missing"
  },
  "mcp": {
    "required": {
      "mobile_mcp": "configured | missing | skipped",
      "serena": "configured | missing | skipped",
      "stitch": "configured | missing | skipped"
    },
    "conditional": {
      "expo": "configured | missing | skipped",
      "atlassian": "configured | missing | skipped",
      "node_repl": "configured | missing | skipped",
      "playwright": "configured | missing | skipped"
    }
  },
  "cli": {
    "codex": "available | missing",
    "gh": "available | missing",
    "railway": "available | missing",
    "gcloud": "available | missing",
    "eas": "available | missing",
    "pnpm": "available | missing"
  },
  "external_status_refs": {
    "expo_owner": "present | missing",
    "eas_project_id": "present | missing",
    "expo_token_secret_ref": "present | missing",
    "railway_auth_ref": "present | missing",
    "google_cloud_project": "present | missing",
    "api_secret_ref": "present | missing",
    "human_gate_v1": "present | missing"
  },
  "reports": {
    "pod_role_bootstrap": "present | missing",
    "stitch_adc_setup": "present | missing | not_applicable",
    "eas_robot_auth_setup": "present | missing | not_applicable"
  },
  "blockers": ["status-only blocker reason"],
  "reporting": "status only; no auth token values, raw credential output, ADC JSON, database URLs, bearer tokens, or private keys"
}
```

Evidence may contain command names, exit statuses, object names, status labels,
and report paths. It must not contain auth token values, API keys, OAuth tokens,
refresh tokens, passwords, Google ADC JSON, service account JSON, database URLs,
bearer token values, private key material, raw stdout/stderr from status
commands, or rendered private-material-bearing manifests.
