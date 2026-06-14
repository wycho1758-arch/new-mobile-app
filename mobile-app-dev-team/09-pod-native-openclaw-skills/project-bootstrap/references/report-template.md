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
    "stitch": "already_configured | registered | registration_unverified | codex_cli_missing | blocked",
    "expo": "already_configured | registered | registration_unverified | codex_cli_missing | blocked",
    "atlassian": "already_configured | registered | registration_unverified | codex_cli_missing | blocked",
    "node_repl": "already_configured | app_environment_missing | codex_cli_missing | blocked",
    "playwright": "already_configured | registered | registration_unverified | codex_cli_missing | blocked"
  },
  "tool_readiness": {
    "node_repl": {
      "required": true,
      "owner": "codex_app_plugin",
      "status": "already_configured | app_environment_missing | codex_cli_missing | blocked",
      "install_decision": "already_available | app_environment_owned",
      "minimum_user_action": "status-only minimal action text"
    },
    "railway": {
      "required": true,
      "owner": "agent_with_approved_installer_then_human_auth",
      "command_status": "available | missing",
      "install_decision": "already_available | install_attempted | install_unavailable_needs_platform_source",
      "installer_status": "not_needed | executed | failed | missing | not_executable",
      "version_status": "checked | failed | not_checked",
      "auth_status": "available | missing | not_checked",
      "tool_bin_dir": "/workspace/state/project-bootstrap-tools/bin",
      "minimum_user_action": "status-only minimal action text"
    },
    "gcloud": {
      "required": true,
      "owner": "agent_with_approved_installer_then_human_auth",
      "command_status": "available | missing",
      "install_decision": "already_available | install_attempted | install_unavailable_needs_platform_source",
      "installer_status": "not_needed | executed | failed | missing | not_executable",
      "version_status": "checked | failed | not_checked",
      "project_status": "available | missing | not_checked",
      "tool_bin_dir": "/workspace/state/project-bootstrap-tools/bin",
      "minimum_user_action": "status-only minimal action text"
    }
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
  "user_summary": {
    "language": {
      "requested": "auto | ko | en | unsupported value from PROJECT_BOOTSTRAP_USER_LANGUAGE",
      "current_user_hint": "accepted value from PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE | [redacted_current_user_language_hint] | [unsupported_current_user_language_hint]",
      "selected": "ko | en",
      "fallback_reason": null
    }
  },
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
      "stitch": "configured | missing | skipped",
      "expo": "configured | missing | skipped",
      "atlassian": "configured | missing | skipped",
      "node_repl": "configured | missing | skipped",
      "playwright": "configured | missing | skipped"
    },
    "baseline_exception": {
      "eas_cli": "status_only_until_eas_workflow_selected"
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

Language contract fields are addressed as `user_summary.language.requested`,
`user_summary.language.current_user_hint`, `user_summary.language.selected`, and
`user_summary.language.fallback_reason`. Supported env modes are
`PROJECT_BOOTSTRAP_USER_LANGUAGE=ko`, `PROJECT_BOOTSTRAP_USER_LANGUAGE=en`, and
`PROJECT_BOOTSTRAP_USER_LANGUAGE=auto`, with
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` used for auto detection.
The agent running project-bootstrap-preflight.sh sets PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE from the current user message before the
preflight script runs. The user does not provide this value manually. For a
Korean current user message, use `PROJECT_BOOTSTRAP_USER_LANGUAGE=auto` with
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR` or
`PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어`; explicit
`PROJECT_BOOTSTRAP_USER_LANGUAGE=ko` still forces Korean output.
Current-language hint aliases are accepted only when the requested mode is
`auto`; unrecognized or secret-like current-language hints are not persisted
verbatim.
Fallback reasons are `fallback_reason: "missing_current_user_language_hint"` and
`fallback_reason: "unsupported_requested_language"`.

Evidence may contain command names, exit statuses, object names, status labels,
report paths, and the generated blocker guide path. It must not contain auth
token values, API keys, OAuth tokens, refresh tokens, passwords, Google ADC JSON,
service account JSON, database URLs, bearer token values, private key material,
raw stdout/stderr from status commands, or rendered private-material-bearing
manifests.

## Generated Blocker Markdown Shape

When the report is blocked, `/workspace/state/project-bootstrap-blockers.md`
must begin with a user-facing summary. Raw blocker names belong only in the
support details section and the JSON report:

```markdown
## Action needed

<Plain-language current state. For GitHub auth blockers, start with:
GitHub connection is needed before I can continue.>

### What I will do after that

- <The status-only local checks, setup script, report regeneration, and
  bootstrap/preflight rerun the agent will perform.>
- <For auth, the agent will open or guide the login surface when possible.>

### What you need to do

- <Only the smallest user-owned action: a public non-secret value, approved
  project file source, approved secure credential source, human-present login,
  platform owner refresh, or linked `human-gate/v1` decision.>
- <For GitHub auth, be present for the GitHub login screen the agent opens or
  guides; sign in with your GitHub account and approve the request there.>

### Do not send in chat

- <Passwords, tokens, 2FA codes, recovery codes, private keys, database URLs,
  bearer tokens, Google ADC JSON, service account JSON, or full secret-bearing
  config.>

### Technical details for support

- <Raw blocker names and support details only. Do not place this content before
  the user action.>
```

Korean mode is selected with `PROJECT_BOOTSTRAP_USER_LANGUAGE=ko` and uses this
generated shape:

```markdown
## 도움이 필요합니다

GitHub 연결이 필요합니다.

### 현재 상태

### 이미 확인한 내용

### 제가 다음에 할 수 있는 일

### 사용자에게 필요한 최소 작업

### 채팅으로 보내지 마세요

### 기술 지원 세부 정보
```

raw blocker IDs are support-only. support-only raw blockers must be listed only
after the technical support heading or in JSON. Raw blockers must appear only in
support details and JSON, never as the primary user request.

Raw blockers must appear only in support details and JSON.

Future JSON reports may add more `user_summary` fields with the same shape:
`action_needed`, `user_request`, `agent_next_action`, and
`do_not_send_in_chat`. The generated Markdown remains the user-facing contract.

## Interpretation Notes

- Treat the report `blockers` array as the source for user-facing blockers.
  A field value of `missing` outside that array can be status-only inventory.
- `expo`, `atlassian`, `node_repl`, `playwright`, `railway`, and `gcloud` are
  required for project-bootstrap readiness. Missing values in those fields must
  appear in the `blockers` array.
- `cli.eas` is recorded as status inventory and remains the baseline exception
  unless QA/Release EAS work or another approved EAS action is selected.
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
