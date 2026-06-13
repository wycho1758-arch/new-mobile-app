#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${ROOT_DIR}/mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh"
PREFLIGHT_SCRIPT="${ROOT_DIR}/mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh"
NODE_BIN_DIR="$(dirname "$(command -v node)")"
NO_CODEX_PATH="${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin"

make_fake_codex() {
  local bin_dir="$1"
  cat > "${bin_dir}/codex" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
state="${FAKE_CODEX_MCP_STATE}"
if [[ "$1" == "mcp" && "$2" == "list" ]]; then
  [[ -f "$state" ]] && cat "$state"
  exit 0
fi
if [[ "$1" == "mcp" && "$2" == "add" ]]; then
  printf '%s\n' "$3" >> "$state"
  exit 0
fi
exit 1
SH
  chmod +x "${bin_dir}/codex"
}

make_fake_gh_authenticated() {
  local bin_dir="$1"
  cat > "${bin_dir}/gh" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
calls="${FAKE_GH_CALLS}"
printf '%s\n' "$*" >> "$calls"
if [[ "$1" == "auth" && "$2" == "status" ]]; then
  exit 0
fi
if [[ "$1" == "auth" && "$2" == "setup-git" ]]; then
  exit 0
fi
exit 1
SH
  chmod +x "${bin_dir}/gh"
}

make_fake_gh_unauthenticated() {
  local bin_dir="$1"
  cat > "${bin_dir}/gh" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
if [[ -n "${FAKE_GH_CALLS:-}" ]]; then
  printf '%s\n' "$*" >> "${FAKE_GH_CALLS}"
fi
exit 1
SH
  chmod +x "${bin_dir}/gh"
}

make_report_precheck() {
  local script_path="$1"
  local schema="$2"
  mkdir -p "$(dirname "${script_path}")"
  cat > "${script_path}" <<SH
#!/usr/bin/env bash
set -euo pipefail
mkdir -p "\$(dirname "\${REPORT_PATH}")"
printf '{"schema":"${schema}","status":"blocked"}\n' > "\${REPORT_PATH}"
SH
  chmod +x "${script_path}"
}

assert_json_field() {
  local report="$1"
  local expression="$2"
  node -e "const r=require(process.argv[1]); if (!(${expression})) { console.error('assertion failed:', process.argv[2]); process.exit(1); }" "${report}" "${expression}"
}

case_design_full_setup() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"
  make_report_precheck "${tmpdir}/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh" "stitch-adc-setup/v1"

  PATH="${tmpdir}/bin:${PATH}" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  WM_POD_SELECTOR="boram-design" \
  STITCH_ADC_PRECHECK="${tmpdir}/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh" \
  STITCH_ADC_REPORT="${tmpdir}/state/stitch-adc-setup-report.json" \
  /bin/bash "${SCRIPT}" >/dev/null

  [[ "$(cat "${tmpdir}/IDENTITY")" == "design" ]]
  grep -Fx -- "- ${tmpdir}/repo/" "${tmpdir}/CODEX_MANAGED_PATHS.md" >/dev/null
  for name in mobile-mcp serena stitch; do grep -Fx -- "${name}" "${tmpdir}/mcps.txt" >/dev/null; done
  [[ -f "${tmpdir}/state/stitch-adc-setup-report.json" ]]
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.status === 'completed'"
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.managed_path.status === 'repaired'"
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.mcp.mobile_mcp === 'registered' && r.mcp.serena === 'registered' && r.mcp.stitch === 'registered'"
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.reports.stitch_adc_setup === 'generated'"
}

case_wrong_repo_path_blocks_repair() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/canonical"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"

  PATH="${tmpdir}/bin:${PATH}" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/canonical" \
  WM_POD_SELECTOR="boram-design" \
  /bin/bash "${SCRIPT}" >/dev/null

  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.status === 'blocked'"
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.managed_path.status === 'blocked_wrong_repo_path'"
  if [[ -e "${tmpdir}/CODEX_MANAGED_PATHS.md" ]]; then
    ! grep -Fx -- "- ${tmpdir}/repo/" "${tmpdir}/CODEX_MANAGED_PATHS.md" >/dev/null
  fi
}

case_missing_codex_orders_precheck() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/skills/codex-cli-auth-setup/scripts"
  cat > "${tmpdir}/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
printf 'codex precheck ran\n' > "${STATE_DIR}/codex-precheck-ran"
SH
  chmod +x "${tmpdir}/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh"

  PATH="${NO_CODEX_PATH}" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  WM_POD_SELECTOR="boram-qa-release" \
  CODEX_CLI_PRECHECK="${tmpdir}/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh" \
  /bin/bash "${SCRIPT}" >/dev/null

  [[ -f "${tmpdir}/state/codex-precheck-ran" ]]
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.codex_cli_setup === 'missing_after_precheck'"
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.mcp.mobile_mcp === 'codex_cli_missing'"
}

case_qa_role_report_generation() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"
  make_report_precheck "${tmpdir}/skills/eas-robot-auth-setup/scripts/eas-robot-auth-precheck.sh" "eas-robot-auth-setup/v1"

  PATH="${tmpdir}/bin:${PATH}" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  WM_POD_SELECTOR="boram-qa-release" \
  EAS_ROBOT_AUTH_PRECHECK="${tmpdir}/skills/eas-robot-auth-setup/scripts/eas-robot-auth-precheck.sh" \
  EAS_ROBOT_AUTH_REPORT="${tmpdir}/state/eas-robot-auth-setup-report.json" \
  /bin/bash "${SCRIPT}" >/dev/null

  [[ -f "${tmpdir}/state/eas-robot-auth-setup-report.json" ]]
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.role.resolved === 'qa-release'"
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.reports.eas_robot_auth_setup === 'generated'"
}

case_git_identity_from_approved_env() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/home"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"

  PATH="${tmpdir}/bin:${PATH}" \
  HOME="${tmpdir}/home" \
  GIT_CONFIG_NOSYSTEM=1 \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_GIT_USER_NAME="WonderMove Pod Agent" \
  PROJECT_BOOTSTRAP_GIT_USER_EMAIL="pod-agent@wondermove.local" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  [[ "$(HOME="${tmpdir}/home" git config --global --get user.name)" == "WonderMove Pod Agent" ]]
  [[ "$(HOME="${tmpdir}/home" git config --global --get user.email)" == "pod-agent@wondermove.local" ]]
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.identity === 'configured_from_approved_source'"
}

case_git_identity_from_wm_env() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/home"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"

  PATH="${tmpdir}/bin:${PATH}" \
  HOME="${tmpdir}/home" \
  GIT_CONFIG_NOSYSTEM=1 \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  WM_GIT_USER_NAME="WonderMove WM Pod" \
  WM_GIT_USER_EMAIL="wm-pod@wondermove.local" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  [[ "$(HOME="${tmpdir}/home" git config --global --get user.name)" == "WonderMove WM Pod" ]]
  [[ "$(HOME="${tmpdir}/home" git config --global --get user.email)" == "wm-pod@wondermove.local" ]]
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.identity === 'configured_from_approved_source'"
}

case_git_identity_from_approved_file() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/home"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"
  printf '%s\n' \
    'PROJECT_BOOTSTRAP_GIT_USER_NAME=WonderMove File Pod' \
    'PROJECT_BOOTSTRAP_GIT_USER_EMAIL=file-pod@wondermove.local' \
    > "${tmpdir}/git-identity.env"

  PATH="${tmpdir}/bin:${PATH}" \
  HOME="${tmpdir}/home" \
  GIT_CONFIG_NOSYSTEM=1 \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH="${tmpdir}/git-identity.env" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  [[ "$(HOME="${tmpdir}/home" git config --global --get user.name)" == "WonderMove File Pod" ]]
  [[ "$(HOME="${tmpdir}/home" git config --global --get user.email)" == "file-pod@wondermove.local" ]]
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.identity === 'configured_from_approved_source'"
}

case_missing_git_identity_does_not_invent_values() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/home"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"

  PATH="${tmpdir}/bin:${PATH}" \
  HOME="${tmpdir}/home" \
  GIT_CONFIG_NOSYSTEM=1 \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  ! HOME="${tmpdir}/home" GIT_CONFIG_NOSYSTEM=1 git config --global --get user.name >/dev/null
  ! HOME="${tmpdir}/home" GIT_CONFIG_NOSYSTEM=1 git config --global --get user.email >/dev/null
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.identity === 'missing_approved_source'"
}

case_git_identity_rejects_mixed_approved_sources() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/home"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"

  PATH="${tmpdir}/bin:${PATH}" \
  HOME="${tmpdir}/home" \
  GIT_CONFIG_NOSYSTEM=1 \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_GIT_USER_NAME="Project Name Only" \
  WM_GIT_USER_EMAIL="wm-email-only@wondermove.local" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  ! HOME="${tmpdir}/home" GIT_CONFIG_NOSYSTEM=1 git config --global --get user.name >/dev/null
  ! HOME="${tmpdir}/home" GIT_CONFIG_NOSYSTEM=1 git config --global --get user.email >/dev/null
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.identity === 'partial_approved_source'"

  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo" "${tmpdir}/home"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"
  printf 'PROJECT_BOOTSTRAP_GIT_USER_EMAIL=file-email-only@wondermove.local\n' > "${tmpdir}/git-identity.env"

  PATH="${tmpdir}/bin:${PATH}" \
  HOME="${tmpdir}/home" \
  GIT_CONFIG_NOSYSTEM=1 \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_GIT_USER_NAME="Project Env Name Only" \
  PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH="${tmpdir}/git-identity.env" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  ! HOME="${tmpdir}/home" GIT_CONFIG_NOSYSTEM=1 git config --global --get user.name >/dev/null
  ! HOME="${tmpdir}/home" GIT_CONFIG_NOSYSTEM=1 git config --global --get user.email >/dev/null
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.identity === 'partial_approved_source'"
}

case_github_auth_setup_git_when_authenticated() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_authenticated "${tmpdir}/bin"

  PATH="${tmpdir}/bin:${PATH}" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  FAKE_GH_CALLS="${tmpdir}/gh-calls.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  grep -Fx -- "auth status" "${tmpdir}/gh-calls.txt" >/dev/null
  grep -Fx -- "auth setup-git" "${tmpdir}/gh-calls.txt" >/dev/null
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.github_auth === 'setup_git_completed'"
}

case_github_auth_missing_skips_setup_git() {
  local tmpdir
  tmpdir="$(mktemp -d)"
  mkdir -p "${tmpdir}/bin" "${tmpdir}/state" "${tmpdir}/repo"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gh_unauthenticated "${tmpdir}/bin"

  PATH="${tmpdir}/bin:${PATH}" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  FAKE_GH_CALLS="${tmpdir}/gh-calls.txt" \
  STATE_DIR="${tmpdir}/state" \
  IDENTITY_PATH="${tmpdir}/IDENTITY" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  REPO_PATH="${tmpdir}/repo" \
  PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH="${tmpdir}/repo" \
  WM_POD_SELECTOR="boram-mobile-app-dev" \
  /bin/bash "${SCRIPT}" >/dev/null

  grep -Fx -- "auth status" "${tmpdir}/gh-calls.txt" >/dev/null
  ! grep -Fx -- "auth setup-git" "${tmpdir}/gh-calls.txt" >/dev/null
  assert_json_field "${tmpdir}/state/project-bootstrap-agent-setup-report.json" "r.git.github_auth === 'missing'"
}

case_product_planning_status_only_missing_preflight() {
  local tmpdir repo_path report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  mkdir -p \
    "${tmpdir}/bin" \
    "${tmpdir}/state" \
    "${tmpdir}/skills/project-bootstrap" \
    "${tmpdir}/skills/codex-cli-auth-setup" \
    "${tmpdir}/skills/pod-role-bootstrap" \
    "${repo_path}/.codex" \
    "${repo_path}/docs" \
    "${repo_path}/mobile-app-dev-team/09-pod-native-openclaw-skills"
  make_fake_codex "${tmpdir}/bin"
  printf '%s\n' mobile-mcp serena stitch > "${tmpdir}/mcps.txt"
  for file in \
    AGENTS.md \
    REPO_OPERATIONS.md \
    PROJECT_ENVIRONMENT.md \
    .codex/config.toml \
    docs/TEMPLATE_VARIABLES.md \
    docs/CREDENTIALS.md \
    mobile-app-dev-team/09-pod-native-openclaw-skills/README.md
  do
    : > "${repo_path}/${file}"
  done
  printf -- '- %s/\n' "${repo_path}" > "${tmpdir}/CODEX_MANAGED_PATHS.md"

  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  REPO_PATH="${repo_path}" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers.md" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.status === 'ready_for_bootstrap'"
  assert_json_field "${report_path}" "Array.isArray(r.blockers) && r.blockers.length === 0"
  assert_json_field "${report_path}" "r.role.normalized === 'product-planning' && r.role.requires_stitch === false && r.role.requires_eas === false"
  assert_json_field "${report_path}" "r.cli.railway === 'missing' && r.cli.gcloud === 'missing' && r.cli.eas === 'missing'"
  assert_json_field "${report_path}" "r.reports.pod_role_bootstrap === 'missing'"
}

case_project_preflight_blocks_on_pod_role_report_blocked() {
  local tmpdir repo_path report_path pod_report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  pod_report_path="${tmpdir}/state/pod-role-bootstrap-report.json"
  mkdir -p \
    "${tmpdir}/bin" \
    "${tmpdir}/state" \
    "${tmpdir}/skills/project-bootstrap" \
    "${tmpdir}/skills/codex-cli-auth-setup" \
    "${tmpdir}/skills/pod-role-bootstrap" \
    "${repo_path}/.codex" \
    "${repo_path}/docs" \
    "${repo_path}/mobile-app-dev-team/09-pod-native-openclaw-skills"
  make_fake_codex "${tmpdir}/bin"
  printf '%s\n' mobile-mcp serena stitch > "${tmpdir}/mcps.txt"
  for file in \
    AGENTS.md \
    REPO_OPERATIONS.md \
    PROJECT_ENVIRONMENT.md \
    .codex/config.toml \
    docs/TEMPLATE_VARIABLES.md \
    docs/CREDENTIALS.md \
    mobile-app-dev-team/09-pod-native-openclaw-skills/README.md
  do
    : > "${repo_path}/${file}"
  done
  printf -- '- %s/\n' "${repo_path}" > "${tmpdir}/CODEX_MANAGED_PATHS.md"
  cat > "${pod_report_path}" <<'JSON'
{
  "schema": "pod-role-bootstrap/v1",
  "status": "blocked",
  "preflight": {
    "blockers": ["codex-preflight --pod reported blockers"],
    "result": {
      "blockers": [
        { "reason": "git-identity-missing" },
        { "reason": "github-auth-unavailable" }
      ]
    }
  }
}
JSON

  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  REPO_PATH="${repo_path}" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers.md" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  POD_ROLE_BOOTSTRAP_REPORT="${pod_report_path}" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.reports.pod_role_bootstrap === 'present'"
  assert_json_field "${report_path}" "r.nested_reports.pod_role_bootstrap.status === 'blocked'"
  assert_json_field "${report_path}" "r.nested_reports.pod_role_bootstrap.blockers.includes('git-identity-missing')"
  assert_json_field "${report_path}" "r.nested_reports.pod_role_bootstrap.blockers.includes('github-auth-unavailable')"
  assert_json_field "${report_path}" "r.blockers.includes('pod-role-bootstrap blocked')"
}

case_design_full_setup
case_wrong_repo_path_blocks_repair
case_missing_codex_orders_precheck
case_qa_role_report_generation
case_git_identity_from_approved_env
case_git_identity_from_wm_env
case_git_identity_from_approved_file
case_missing_git_identity_does_not_invent_values
case_git_identity_rejects_mixed_approved_sources
case_github_auth_setup_git_when_authenticated
case_github_auth_missing_skips_setup_git
case_product_planning_status_only_missing_preflight
case_project_preflight_blocks_on_pod_role_report_blocked

printf 'project-bootstrap-agent-setup smoke passed\n'
