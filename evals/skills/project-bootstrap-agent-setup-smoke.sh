#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${ROOT_DIR}/mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh"
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

case_design_full_setup
case_wrong_repo_path_blocks_repair
case_missing_codex_orders_precheck
case_qa_role_report_generation

printf 'project-bootstrap-agent-setup smoke passed\n'
