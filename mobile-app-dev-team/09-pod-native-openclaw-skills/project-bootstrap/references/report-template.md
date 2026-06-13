# Project Bootstrap Report Template

Use this template for `/workspace/state/project-bootstrap-report.json` or for a
human-readable summary derived from it.

The agent-owned setup phase writes
`/workspace/state/project-bootstrap-agent-setup-report.json` before this
preflight report. That report has this shape:

```json
{
  "schema": "project-bootstrap-agent-setup/v1",
  "status": "completed | blocked",
  "role": {
    "resolved": "product-planning | design | mobile-architect | mobile-app-dev | backend-api-integrator | qa-release | missing",
    "status": "configured | not_resolved",
    "identity_path": "/workspace/IDENTITY",
    "env_path": "/workspace/state/project-bootstrap-role.env"
  },
  "managed_path": {
    "registry": "/workspace/CODEX_MANAGED_PATHS.md",
    "repo_path": "/workspace/projects/Wondermove-Inc/new-mobile-app/",
    "canonical_repo_path": "/workspace/projects/Wondermove-Inc/new-mobile-app/",
    "status": "present | repaired | blocked_wrong_repo_path"
  },
  "codex_cli_setup": "not_needed | available_after_precheck | missing_after_precheck | codex_cli_precheck_missing",
  "mcp": {
    "mobile_mcp": "already_configured | registered | registration_unverified | codex_cli_missing | blocked",
    "serena": "already_configured | registered | registration_unverified | codex_cli_missing | blocked",
    "stitch": "already_configured | registered | registration_unverified | codex_cli_missing | blocked"
  },
  "reports": {
    "stitch_adc_setup": "not_applicable | already_present | generated | script_missing | not_generated",
    "eas_robot_auth_setup": "not_applicable | already_present | generated | script_missing | not_generated"
  },
  "git": {
    "identity": "already_configured | configured_from_approved_source | missing_approved_source | partial_approved_source | invalid_approved_source | configuration_unverified | git_missing",
    "github_auth": "setup_git_completed | setup_git_failed | missing | gh_missing"
  },
  "preflight": "not_run | pass | blocked | script_missing",
  "reporting": "status only; no credential values, raw auth output, ADC JSON, database URLs, bearer tokens, or private keys"
}
```

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
    "resolved": "<raw resolved role value; canonical slug required> | missing",
    "normalized": "product-planning | design | mobile-architect | mobile-app-dev | backend-api-integrator | qa-release | missing",
    "canonical": "canonical | non_canonical | unknown | missing",
    "workspace_identity": "<raw /workspace/IDENTITY first-line value; canonical slug required> | missing",
    "workspace_identity_canonical": "canonical | non_canonical | unknown | not_configured",
    "workspace_identity_match": "match | mismatch | not_configured",
    "expected": "match | mismatch | not_configured",
    "expected_canonical": "canonical | non_canonical | unknown | not_configured",
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
  "nested_reports": {
    "pod_role_bootstrap": {
      "status": "ready | blocked | missing | unknown | unreadable",
      "blockers": ["status-only blocker reason"]
    }
  },
  "blocker_guide": {
    "path": "/workspace/state/project-bootstrap-blockers.md",
    "status": "written | not_applicable",
    "reference": "/workspace/skills/project-bootstrap/references/blocker-resolution-guide.md",
    "reference_status": "present | missing"
  },
  "blockers": ["status-only blocker reason"],
  "reporting": "status only; no auth token values, raw credential output, ADC JSON, database URLs, bearer tokens, or private keys"
}
```

Evidence may contain command names, exit statuses, object names, status labels,
report paths, and the generated blocker guide path. It must not contain auth
token values, API keys, OAuth tokens, refresh tokens, passwords, Google ADC JSON,
service account JSON, database URLs, bearer token values, private key material,
raw stdout/stderr from status commands, or rendered private-material-bearing
manifests.

## Interpretation Notes

- Treat the report `blockers` array as the source for user-facing blockers.
  A field value of `missing` outside that array can be status-only inventory.
- `cli.railway`, `cli.gcloud`, and `cli.eas` are always recorded as status
  inventory. For `product-planning`, `missing` values in those fields are not
  blockers unless a later SoT-selected action requires the tool.
- `reports.pod_role_bootstrap: missing` before
  `/workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh` runs means the
  report has not been generated yet. It is pending workflow evidence, not a
  user-owned blocker.
- `reports.pod_role_bootstrap: present` with
  `nested_reports.pod_role_bootstrap.status: blocked` is a current workflow
  blocker. The project report must not be treated as fully ready until the nested
  pod-role report is ready or source-backed not applicable.
- `reports.stitch_adc_setup` is actionable only when
  `role.requires_stitch` is true. `reports.eas_robot_auth_setup` is actionable
  only when `role.requires_eas` is true.
