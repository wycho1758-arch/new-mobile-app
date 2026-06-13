#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
CANONICAL_REPO_PATH="${PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
CODEX_MANAGED_PATHS="${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}"
STATE_DIR="${STATE_DIR:-/workspace/state}"
IDENTITY_PATH="${IDENTITY_PATH:-/workspace/IDENTITY}"
ROLE_ENV_PATH="${PROJECT_BOOTSTRAP_ROLE_ENV_PATH:-${STATE_DIR}/project-bootstrap-role.env}"
REPORT_PATH="${PROJECT_BOOTSTRAP_AGENT_SETUP_REPORT_PATH:-${STATE_DIR}/project-bootstrap-agent-setup-report.json}"
PREFLIGHT_SCRIPT="${PROJECT_BOOTSTRAP_PREFLIGHT_SCRIPT:-/workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh}"
CODEX_CLI_PRECHECK="${CODEX_CLI_PRECHECK:-/workspace/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh}"
STITCH_ADC_PRECHECK="${STITCH_ADC_PRECHECK:-/workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh}"
EAS_ROBOT_AUTH_PRECHECK="${EAS_ROBOT_AUTH_PRECHECK:-/workspace/skills/eas-robot-auth-setup/scripts/eas-robot-auth-precheck.sh}"
STITCH_ADC_REPORT="${STITCH_ADC_REPORT:-${STATE_DIR}/stitch-adc-setup-report.json}"
EAS_ROBOT_AUTH_REPORT="${EAS_ROBOT_AUTH_REPORT:-${STATE_DIR}/eas-robot-auth-setup-report.json}"
GIT_IDENTITY_PATH="${PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH:-}"

redact() {
  sed -E 's/(token|key|secret|password|credential)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

normalize_role() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's#[[:space:]_/]+#-#g; s#^-+##; s#-+$##'
}

is_canonical_role() {
  case "$1" in
    product-planning|design|mobile-architect|mobile-app-dev|backend-api-integrator|qa-release)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

role_from_soul_path() {
  case "$(basename "$1")" in
    product-planning-soul.md) printf 'product-planning' ;;
    design-soul.md) printf 'design' ;;
    mobile-architect-soul.md) printf 'mobile-architect' ;;
    mobile-app-dev-soul.md) printf 'mobile-app-dev' ;;
    backend-api-integrator-soul.md) printf 'backend-api-integrator' ;;
    qa-release-soul.md) printf 'qa-release' ;;
    *) return 1 ;;
  esac
}

role_from_selector() {
  local selector
  selector="$(normalize_role "$1")"
  case "${selector}" in
    *product-planning*|*product*planning*) printf 'product-planning' ;;
    *mobile-architect*) printf 'mobile-architect' ;;
    *mobile-app-dev*|*app-dev*) printf 'mobile-app-dev' ;;
    *backend-api-integrator*|*backend*api*) printf 'backend-api-integrator' ;;
    *qa-release*|*release*) printf 'qa-release' ;;
    *design*) printf 'design' ;;
    *) return 1 ;;
  esac
}

resolve_agent_role() {
  local candidate=""

  for candidate in "${WM_ROLE:-}" "${WM_EXPECTED_ROLE:-}"; do
    if [[ -n "${candidate}" ]] && is_canonical_role "$(normalize_role "${candidate}")"; then
      normalize_role "${candidate}"
      return 0
    fi
  done

  if [[ -r "${IDENTITY_PATH}" ]]; then
    candidate="$(head -n 1 "${IDENTITY_PATH}" | tr -d '\r')"
    if [[ -n "${candidate}" ]] && is_canonical_role "$(normalize_role "${candidate}")"; then
      normalize_role "${candidate}"
      return 0
    fi
  fi

  for candidate in "${PROJECT_BOOTSTRAP_ROLE_SOUL_PATH:-}" "${WM_ROLE_SOUL_PATH:-}" "${POD_SOUL_PATH:-}"; do
    if [[ -n "${candidate}" ]] && role_from_soul_path "${candidate}" >/dev/null 2>&1; then
      role_from_soul_path "${candidate}"
      return 0
    fi
  done

  for candidate in "${WM_POD_SELECTOR:-}" "${BORAM_POD_SELECTOR:-}" "${POD_SELECTOR:-}" "${HOSTNAME:-}"; do
    if [[ -n "${candidate}" ]] && role_from_selector "${candidate}" >/dev/null 2>&1; then
      role_from_selector "${candidate}"
      return 0
    fi
  done

  return 1
}

write_role_identity() {
  local role="$1"
  mkdir -p "$(dirname "${IDENTITY_PATH}")" "$(dirname "${ROLE_ENV_PATH}")"
  printf '%s\n' "${role}" > "${IDENTITY_PATH}"
  {
    printf 'export WM_ROLE=%q\n' "${role}"
    printf 'export WM_EXPECTED_ROLE=%q\n' "${role}"
  } > "${ROLE_ENV_PATH}"
}

managed_path_status="not_checked"

repair_managed_path_registry() {
  local managed_path="${REPO_PATH%/}/"
  local canonical_path="${CANONICAL_REPO_PATH%/}/"

  if [[ "${managed_path}" != "${canonical_path}" ]]; then
    managed_path_status="blocked_wrong_repo_path"
    return
  fi

  mkdir -p "$(dirname "${CODEX_MANAGED_PATHS}")"

  if [[ ! -e "${CODEX_MANAGED_PATHS}" ]]; then
    {
      printf '# Codex-managed Paths\n\n'
      printf 'Add repository or directory paths here. Any task targeting these paths must be executed through Codex CLI.\n\n'
    } > "${CODEX_MANAGED_PATHS}"
  fi

  if ! grep -Fx -- "- ${managed_path}" "${CODEX_MANAGED_PATHS}" >/dev/null 2>&1; then
    printf '%s\n' "- ${managed_path}" >> "${CODEX_MANAGED_PATHS}"
    managed_path_status="repaired"
  else
    managed_path_status="present"
  fi
}

mcp_configured() {
  local name="$1"
  codex mcp list 2> >(redact >&2) | grep -Eq "(^|[[:space:]])${name}([[:space:]]|$)"
}

register_mcp() {
  local name="$1"
  if ! command -v codex >/dev/null 2>&1; then
    printf '%s\n' "codex_cli_missing"
    return
  fi

  if mcp_configured "${name}"; then
    printf '%s\n' "already_configured"
    return
  fi

  case "${name}" in
    mobile-mcp)
      codex mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@0.0.58 2> >(redact >&2) >/dev/null
      ;;
    serena)
      codex mcp add serena -- uvx -p 3.13 --from git+https://github.com/oraios/serena@v1.5.3 serena start-mcp-server --project-from-cwd --context=codex 2> >(redact >&2) >/dev/null
      ;;
    stitch)
      codex mcp add stitch -- npx -y stitch-mcp@1.3.2 2> >(redact >&2) >/dev/null
      ;;
    expo)
      codex mcp add expo --url https://mcp.expo.dev/mcp 2> >(redact >&2) >/dev/null
      ;;
    atlassian)
      codex mcp add atlassian -- npx -y mcp-remote@0.1.38 https://mcp.atlassian.com/v1/mcp 2> >(redact >&2) >/dev/null
      ;;
    playwright)
      codex mcp add playwright -- npx -y @executeautomation/playwright-mcp-server@1.0.12 2> >(redact >&2) >/dev/null
      ;;
    *)
      printf '%s\n' "unsupported"
      return
      ;;
  esac

  if mcp_configured "${name}"; then
    printf '%s\n' "registered"
  else
    printf '%s\n' "registration_unverified"
  fi
}

check_node_repl_status() {
  if ! command -v codex >/dev/null 2>&1; then
    printf '%s\n' "codex_cli_missing"
    return
  fi

  if mcp_configured node_repl; then
    printf '%s\n' "already_configured"
  else
    printf '%s\n' "app_environment_missing"
  fi
}

run_status_precheck() {
  local script_path="$1"
  local report_path="$2"
  if [[ -e "${report_path}" ]]; then
    printf '%s\n' "already_present"
    return
  fi
  if [[ ! -x "${script_path}" ]]; then
    printf '%s\n' "script_missing"
    return
  fi
  REPORT_PATH="${report_path}" bash "${script_path}" 2> >(redact >&2) >/dev/null
  if [[ -e "${report_path}" ]]; then
    printf '%s\n' "generated"
  else
    printf '%s\n' "not_generated"
  fi
}

strip_wrapping_quotes() {
  local value="$1"
  value="${value%$'\r'}"
  if [[ "${value}" == \"*\" && "${value}" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "${value}" == \'*\' && "${value}" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "${value}"
}

load_git_identity_file() {
  local file_path="$1"
  local key value
  [[ -n "${file_path}" && -r "${file_path}" ]] || return 0
  while IFS='=' read -r key value || [[ -n "${key}" ]]; do
    case "${key}" in
      PROJECT_BOOTSTRAP_GIT_USER_NAME|WM_GIT_USER_NAME)
        if [[ "${key}" == "PROJECT_BOOTSTRAP_GIT_USER_NAME" ]]; then
          git_identity_file_project_name="$(strip_wrapping_quotes "${value}")"
        else
          git_identity_file_wm_name="$(strip_wrapping_quotes "${value}")"
        fi
        ;;
      PROJECT_BOOTSTRAP_GIT_USER_EMAIL|WM_GIT_USER_EMAIL)
        if [[ "${key}" == "PROJECT_BOOTSTRAP_GIT_USER_EMAIL" ]]; then
          git_identity_file_project_email="$(strip_wrapping_quotes "${value}")"
        else
          git_identity_file_wm_email="$(strip_wrapping_quotes "${value}")"
        fi
        ;;
    esac
  done < "${file_path}"
}

select_git_identity_pair() {
  local saw_identity="false"
  local project_name project_email wm_name wm_email
  project_name="$(strip_wrapping_quotes "${PROJECT_BOOTSTRAP_GIT_USER_NAME:-}")"
  project_email="$(strip_wrapping_quotes "${PROJECT_BOOTSTRAP_GIT_USER_EMAIL:-}")"
  wm_name="$(strip_wrapping_quotes "${WM_GIT_USER_NAME:-}")"
  wm_email="$(strip_wrapping_quotes "${WM_GIT_USER_EMAIL:-}")"

  if [[ -n "${project_name}" || -n "${project_email}" ]]; then
    saw_identity="true"
    if [[ -n "${project_name}" && -n "${project_email}" ]]; then
      approved_git_name="${project_name}"
      approved_git_email="${project_email}"
      return 0
    fi
  fi

  if [[ -n "${wm_name}" || -n "${wm_email}" ]]; then
    saw_identity="true"
    if [[ -n "${wm_name}" && -n "${wm_email}" ]]; then
      approved_git_name="${wm_name}"
      approved_git_email="${wm_email}"
      return 0
    fi
  fi

  if [[ -n "${git_identity_file_project_name}" || -n "${git_identity_file_project_email}" ]]; then
    saw_identity="true"
    if [[ -n "${git_identity_file_project_name}" && -n "${git_identity_file_project_email}" ]]; then
      approved_git_name="${git_identity_file_project_name}"
      approved_git_email="${git_identity_file_project_email}"
      return 0
    fi
  fi

  if [[ -n "${git_identity_file_wm_name}" || -n "${git_identity_file_wm_email}" ]]; then
    saw_identity="true"
    if [[ -n "${git_identity_file_wm_name}" && -n "${git_identity_file_wm_email}" ]]; then
      approved_git_name="${git_identity_file_wm_name}"
      approved_git_email="${git_identity_file_wm_email}"
      return 0
    fi
  fi

  if [[ "${saw_identity}" == "true" ]]; then
    return 1
  fi
  return 2
}

configure_git_identity() {
  local selection_status
  if ! command -v git >/dev/null 2>&1; then
    printf '%s\n' "git_missing"
    return
  fi

  if git config --get user.name >/dev/null 2>&1 && git config --get user.email >/dev/null 2>&1; then
    printf '%s\n' "already_configured"
    return
  fi

  approved_git_name=""
  approved_git_email=""
  git_identity_file_project_name=""
  git_identity_file_project_email=""
  git_identity_file_wm_name=""
  git_identity_file_wm_email=""
  load_git_identity_file "${GIT_IDENTITY_PATH}"

  selection_status=0
  select_git_identity_pair || selection_status="$?"
  if [[ "${selection_status}" -ne 0 ]]; then
    case "${selection_status}" in
      1)
        printf '%s\n' "partial_approved_source"
        ;;
      *)
        printf '%s\n' "missing_approved_source"
        ;;
    esac
    return
  fi
  if [[ "${approved_git_email}" != *@* ]]; then
    printf '%s\n' "invalid_approved_source"
    return
  fi

  git config --global user.name "${approved_git_name}"
  git config --global user.email "${approved_git_email}"
  if git config --get user.name >/dev/null 2>&1 && git config --get user.email >/dev/null 2>&1; then
    printf '%s\n' "configured_from_approved_source"
  else
    printf '%s\n' "configuration_unverified"
  fi
}

configure_github_auth() {
  if ! command -v gh >/dev/null 2>&1; then
    printf '%s\n' "gh_missing"
    return
  fi

  if ! gh auth status >/dev/null 2> >(redact >&2); then
    printf '%s\n' "missing"
    return
  fi

  if gh auth setup-git >/dev/null 2> >(redact >&2); then
    printf '%s\n' "setup_git_completed"
  else
    printf '%s\n' "setup_git_failed"
  fi
}

mkdir -p "${STATE_DIR}" "$(dirname "${REPORT_PATH}")"

role_status="not_resolved"
resolved_role=""
if resolved_role="$(resolve_agent_role)"; then
  write_role_identity "${resolved_role}"
  role_status="configured"
fi

repair_managed_path_registry

codex_setup_status="not_needed"
if ! command -v codex >/dev/null 2>&1; then
  if [[ -x "${CODEX_CLI_PRECHECK}" ]]; then
    bash "${CODEX_CLI_PRECHECK}" 2> >(redact >&2) >/dev/null || true
    if command -v codex >/dev/null 2>&1; then
      codex_setup_status="available_after_precheck"
    else
      codex_setup_status="missing_after_precheck"
    fi
  else
    codex_setup_status="codex_cli_precheck_missing"
  fi
fi

mobile_mcp_status="$(register_mcp mobile-mcp || printf 'blocked')"
serena_mcp_status="$(register_mcp serena || printf 'blocked')"
stitch_mcp_status="$(register_mcp stitch || printf 'blocked')"
expo_mcp_status="$(register_mcp expo || printf 'blocked')"
atlassian_mcp_status="$(register_mcp atlassian || printf 'blocked')"
node_repl_mcp_status="$(check_node_repl_status || printf 'blocked')"
playwright_mcp_status="$(register_mcp playwright || printf 'blocked')"

role_requires_stitch="false"
role_requires_eas="false"
case "${resolved_role}" in
  design) role_requires_stitch="true" ;;
  qa-release) role_requires_eas="true" ;;
esac

stitch_report_status="not_applicable"
eas_report_status="not_applicable"
if [[ "${role_requires_stitch}" == "true" ]]; then
  stitch_report_status="$(run_status_precheck "${STITCH_ADC_PRECHECK}" "${STITCH_ADC_REPORT}")"
fi
if [[ "${role_requires_eas}" == "true" ]]; then
  eas_report_status="$(run_status_precheck "${EAS_ROBOT_AUTH_PRECHECK}" "${EAS_ROBOT_AUTH_REPORT}")"
fi

git_identity_status="$(configure_git_identity || printf 'blocked')"
github_auth_status="$(configure_github_auth || printf 'blocked')"

preflight_status="not_run"
if [[ "${PROJECT_BOOTSTRAP_RUN_PREFLIGHT:-0}" == "1" ]]; then
  if [[ -x "${PREFLIGHT_SCRIPT}" ]]; then
    if bash "${PREFLIGHT_SCRIPT}" 2> >(redact >&2) >/dev/null; then
      preflight_status="pass"
    else
      preflight_status="blocked"
    fi
  else
    preflight_status="script_missing"
  fi
fi

node - "$REPORT_PATH" "$resolved_role" "$role_status" "$IDENTITY_PATH" "$ROLE_ENV_PATH" "$CODEX_MANAGED_PATHS" "$REPO_PATH" "$CANONICAL_REPO_PATH" "$managed_path_status" "$codex_setup_status" "$mobile_mcp_status" "$serena_mcp_status" "$stitch_mcp_status" "$expo_mcp_status" "$atlassian_mcp_status" "$node_repl_mcp_status" "$playwright_mcp_status" "$stitch_report_status" "$eas_report_status" "$git_identity_status" "$github_auth_status" "$preflight_status" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const [
  reportPath,
  resolvedRole,
  roleStatus,
  identityPath,
  roleEnvPath,
  managedPathRegistry,
  repoPath,
  canonicalRepoPath,
  managedPathStatus,
  codexSetupStatus,
  mobileMcpStatus,
  serenaMcpStatus,
  stitchMcpStatus,
  expoMcpStatus,
  atlassianMcpStatus,
  nodeReplMcpStatus,
  playwrightMcpStatus,
  stitchReportStatus,
  easReportStatus,
  gitIdentityStatus,
  githubAuthStatus,
  preflightStatus,
] = process.argv.slice(2);

const setupBlocked = managedPathStatus.startsWith('blocked');

const report = {
  schema: 'project-bootstrap-agent-setup/v1',
  status: setupBlocked ? 'blocked' : 'completed',
  role: {
    resolved: resolvedRole || 'missing',
    status: roleStatus,
    identity_path: identityPath,
    env_path: roleEnvPath,
  },
  managed_path: {
    registry: managedPathRegistry,
    repo_path: `${repoPath.replace(/\/$/, '')}/`,
    canonical_repo_path: `${canonicalRepoPath.replace(/\/$/, '')}/`,
    status: managedPathStatus,
  },
  codex_cli_setup: codexSetupStatus,
  mcp: {
    mobile_mcp: mobileMcpStatus,
    serena: serenaMcpStatus,
    stitch: stitchMcpStatus,
    expo: expoMcpStatus,
    atlassian: atlassianMcpStatus,
    node_repl: nodeReplMcpStatus,
    playwright: playwrightMcpStatus,
  },
  reports: {
    stitch_adc_setup: stitchReportStatus,
    eas_robot_auth_setup: easReportStatus,
  },
  git: {
    identity: gitIdentityStatus,
    github_auth: githubAuthStatus,
  },
  preflight: preflightStatus,
  reporting: 'status only; no credential values, raw auth output, ADC JSON, database URLs, bearer tokens, or private keys',
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE

echo "project-bootstrap agent setup complete: report=${REPORT_PATH}"
