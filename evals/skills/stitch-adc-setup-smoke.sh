#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${ROOT_DIR}/mobile-app-dev-team/runtime-sources/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh"

make_isolated_bin() {
  local bin_dir="$1"
  mkdir -p "${bin_dir}"
  ln -sf "$(command -v node)" "${bin_dir}/node"
}

make_fake_codex() {
  local bin_dir="$1"
  cat > "${bin_dir}/codex" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "mcp" && "${2:-}" == "list" ]]; then
  printf '%s\n' "${FAKE_CODEX_MCP_LIST:-stitch}"
  exit 0
fi
exit 64
SH
  chmod +x "${bin_dir}/codex"
}

make_fake_gcloud_stateful() {
  local bin_dir="$1"
  local command_log_path="$2"
  local auth_state_path="$3"
  local adc_state_path="$4"
  local project_state_path="$5"
  local quota_project_state_path="$6"
  local service_state_path="$7"
  mkdir -p "${bin_dir}"
  cat > "${bin_dir}/gcloud" <<SH
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "\$*" >> "${command_log_path}"
case "\${1:-} \${2:-} \${3:-}" in
  "--version  ")
    printf 'Google Cloud SDK fake\n'
    ;;
  "auth list --format=value(account)")
    if [[ -f "${auth_state_path}" ]]; then
      printf 'agent@example.test\n'
    else
      printf 'No credentialed accounts.\n'
    fi
    ;;
  "auth login "|"auth login --no-launch-browser")
    : > "${auth_state_path}"
    ;;
  "auth application-default print-access-token")
    [[ -f "${adc_state_path}" ]]
    ;;
  "auth application-default login")
    : > "${adc_state_path}"
    ;;
  "auth application-default get-quota-project")
    if [[ -s "${quota_project_state_path}" ]]; then
      cat "${quota_project_state_path}"
    else
      exit 1
    fi
    ;;
  "config get-value project")
    if [[ -s "${project_state_path}" ]]; then
      cat "${project_state_path}"
    else
      printf '(unset)\n'
    fi
    ;;
  "config set project")
    printf '%s\n' "\${4:-}" > "${project_state_path}"
    ;;
  "services list --enabled")
    if [[ -f "${service_state_path}" ]]; then
      printf 'stitch.googleapis.com\n'
    fi
    ;;
  "services enable stitch.googleapis.com")
    if [[ "\${FAKE_GCLOUD_SERVICE_ENABLE_FAIL:-false}" == "true" ]]; then
      exit 1
    fi
    : > "${service_state_path}"
    ;;
  *)
    exit 64
    ;;
esac
SH
  chmod +x "${bin_dir}/gcloud"
}

make_fake_gcloud_installer() {
  local installer_path="$1"
  local marker_path="$2"
  local command_log_path="$3"
  mkdir -p "$(dirname "${installer_path}")"
  cat > "${installer_path}" <<SH
#!/usr/bin/env bash
set -euo pipefail
target_bin="\${1:?target bin dir required}"
mkdir -p "\${target_bin}"
printf '%s\n' "ran" > "${marker_path}"
cat > "\${target_bin}/gcloud" <<'CLI'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "\$*" >> "${command_log_path}"
case "\${1:-} \${2:-} \${3:-}" in
  "--version  ")
    printf 'Google Cloud SDK fake\n'
    ;;
  "auth list --format=value(account)")
    printf 'No credentialed accounts.\n'
    ;;
  "auth application-default print-access-token")
    exit 1
    ;;
  "auth application-default get-quota-project")
    exit 1
    ;;
  "config get-value project")
    printf '(unset)\n'
    ;;
  *)
    exit 64
    ;;
esac
CLI
chmod +x "\${target_bin}/gcloud"
SH
  chmod +x "${installer_path}"
}

run_precheck() {
  local tmpdir="$1"
  shift
  mkdir -p "${tmpdir}/home" "${tmpdir}/state" "${tmpdir}/tools"
  HOME="${tmpdir}/home" \
    PATH="${tmpdir}/bin:/usr/bin:/bin:/usr/sbin:/sbin" \
    REPORT_PATH="${tmpdir}/state/stitch-adc-setup-report.json" \
    STITCH_ADC_AGENT_TOOL_BIN_DIR="${tmpdir}/tools/bin" \
    "$@" \
    /bin/bash "${SCRIPT}" >/dev/null
}

assert_json_field() {
  local report="$1"
  local expression="$2"
  node -e "const r=require(process.argv[1]); if (!(${expression})) { console.error('assertion failed:', process.argv[2]); process.exit(1); }" "${report}" "${expression}"
}

assert_file_contains() {
  local file_path="$1"
  local needle="$2"
  if ! grep -F "${needle}" "${file_path}" >/dev/null 2>&1; then
    printf 'assertion failed: expected %s to contain %s\n' "${file_path}" "${needle}" >&2
    exit 1
  fi
}

assert_file_not_contains() {
  local file_path="$1"
  local needle="$2"
  if [[ -f "${file_path}" ]] && grep -F "${needle}" "${file_path}" >/dev/null 2>&1; then
    printf 'assertion failed: expected %s not to contain %s\n' "${file_path}" "${needle}" >&2
    exit 1
  fi
}

assert_json_no_secret_like() {
  local report="$1"
  node - "${report}" <<'NODE'
const fs = require('node:fs');
const report = fs.readFileSync(process.argv[2], 'utf8');
const forbidden = [
  /ya29\.[A-Za-z0-9._-]+/,
  /-----BEGIN [^-]+PRIVATE KEY-----/,
  /"private_key"\s*:/i,
  /"type"\s*:\s*"service_account"/i,
  /"client_email"\s*:\s*"[^"]+@[^"]+"/i,
  /"refresh_token"\s*:/i,
  /authorization["']?\s*:\s*["']?bearer\s+[A-Za-z0-9._-]+/i,
];
for (const pattern of forbidden) {
  if (pattern.test(report)) {
    console.error(`secret-like value found: ${pattern}`);
    process.exit(1);
  }
}
NODE
}

case_missing_gcloud_reports_installer_source_needed() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"

  run_precheck "${tmpdir}" env

  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.command_status === 'missing'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.install_decision === 'install_unavailable_needs_platform_source'"
  assert_json_field "${report_path}" "Array.isArray(r.installed_exact) && r.installed_exact.length === 0"
  assert_json_no_secret_like "${report_path}"
}

case_installer_requires_explicit_approval() {
  local tmpdir report_path installer_path marker_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  installer_path="${tmpdir}/installers/install-gcloud.sh"
  marker_path="${tmpdir}/gcloud-installer-ran"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_installer "${installer_path}" "${marker_path}" "${tmpdir}/gcloud-command-log"

  run_precheck "${tmpdir}" env STITCH_ADC_GCLOUD_INSTALLER_PATH="${installer_path}"

  [[ ! -f "${marker_path}" ]]
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.install_decision === 'install_blocked_needs_approval'"
  assert_json_field "${report_path}" "r.install_plan.some((entry) => entry.tool === 'gcloud' && entry.approval_required === true)"
  assert_json_field "${report_path}" "Array.isArray(r.installed_exact) && r.installed_exact.length === 0"
  assert_json_no_secret_like "${report_path}"
}

case_approved_installer_runs_and_records_exact_install() {
  local tmpdir report_path installer_path marker_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  installer_path="${tmpdir}/installers/install-gcloud.sh"
  marker_path="${tmpdir}/gcloud-installer-ran"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_installer "${installer_path}" "${marker_path}" "${tmpdir}/gcloud-command-log"

  run_precheck "${tmpdir}" env STITCH_ADC_GCLOUD_INSTALLER_PATH="${installer_path}" STITCH_ADC_INSTALL_APPROVED=true

  [[ -f "${marker_path}" ]]
  [[ -x "${tmpdir}/tools/bin/gcloud" ]]
  assert_file_contains "${tmpdir}/gcloud-command-log" "--version"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.command_status === 'available'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.install_decision === 'install_attempted'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.version_status === 'checked'"
  assert_json_field "${report_path}" "r.installed_exact.some((entry) => entry.tool === 'gcloud' && entry.package === 'google-cloud-cli')"
  assert_json_no_secret_like "${report_path}"
}

case_auth_and_adc_login_require_human_present() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_stateful "${tmpdir}/bin" "${tmpdir}/gcloud-command-log" "${tmpdir}/auth-state" "${tmpdir}/adc-state" "${tmpdir}/project-state" "${tmpdir}/quota-project-state" "${tmpdir}/service-state"
  printf 'wm-test-project\n' > "${tmpdir}/project-state"

  run_precheck "${tmpdir}" env

  assert_file_contains "${tmpdir}/gcloud-command-log" "auth list --format=value(account)"
  assert_file_not_contains "${tmpdir}/gcloud-command-log" "auth login"
  assert_file_not_contains "${tmpdir}/gcloud-command-log" "auth application-default login"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.auth_status === 'missing'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.login_flow === 'needs_human_present'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.adc_status === 'missing'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.adc_login_flow === 'needs_human_present'"
  assert_json_no_secret_like "${report_path}"
}

case_human_present_starts_browser_auth_flows() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_stateful "${tmpdir}/bin" "${tmpdir}/gcloud-command-log" "${tmpdir}/auth-state" "${tmpdir}/adc-state" "${tmpdir}/project-state" "${tmpdir}/quota-project-state" "${tmpdir}/service-state"
  printf 'wm-test-project\n' > "${tmpdir}/project-state"
  : > "${tmpdir}/service-state"

  run_precheck "${tmpdir}" env STITCH_ADC_HUMAN_PRESENT=true

  assert_file_contains "${tmpdir}/gcloud-command-log" "auth login"
  assert_file_contains "${tmpdir}/gcloud-command-log" "auth application-default login"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.auth_status === 'available'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.adc_status === 'available'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.adc_quota_project.status === 'missing'"
  assert_json_no_secret_like "${report_path}"
}

case_service_enable_requires_explicit_opt_in() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_stateful "${tmpdir}/bin" "${tmpdir}/gcloud-command-log" "${tmpdir}/auth-state" "${tmpdir}/adc-state" "${tmpdir}/project-state" "${tmpdir}/quota-project-state" "${tmpdir}/service-state"
  : > "${tmpdir}/auth-state"
  : > "${tmpdir}/adc-state"
  printf 'wm-test-project\n' > "${tmpdir}/project-state"
  printf 'wm-test-project\n' > "${tmpdir}/quota-project-state"

  run_precheck "${tmpdir}" env

  assert_file_not_contains "${tmpdir}/gcloud-command-log" "services enable stitch.googleapis.com"
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.stitch_api.service_status === 'missing'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.stitch_api.service_enable_flow === 'needs_explicit_enable_approval'"
  assert_json_no_secret_like "${report_path}"
}

case_project_set_and_service_enable_recheck_ready() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_stateful "${tmpdir}/bin" "${tmpdir}/gcloud-command-log" "${tmpdir}/auth-state" "${tmpdir}/adc-state" "${tmpdir}/project-state" "${tmpdir}/quota-project-state" "${tmpdir}/service-state"
  : > "${tmpdir}/auth-state"
  : > "${tmpdir}/adc-state"
  printf 'wm-test-project\n' > "${tmpdir}/quota-project-state"

  run_precheck "${tmpdir}" env STITCH_ADC_GOOGLE_CLOUD_PROJECT=wm-test-project STITCH_ADC_ENABLE_STITCH_API=true

  assert_file_contains "${tmpdir}/gcloud-command-log" "config set project wm-test-project"
  assert_file_contains "${tmpdir}/gcloud-command-log" "services enable stitch.googleapis.com"
  assert_json_field "${report_path}" "r.status === 'ready_for_design_gate'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.project_status === 'configured'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.adc_quota_project.status === 'configured'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.adc_quota_project.project_id === 'wm-test-project'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.stitch_api.service_status === 'enabled'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.stitch_api.service_enable_flow === 'stitch_api_enable_started'"
  assert_json_no_secret_like "${report_path}"
}

case_adc_quota_project_required_for_ready() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_stateful "${tmpdir}/bin" "${tmpdir}/gcloud-command-log" "${tmpdir}/auth-state" "${tmpdir}/adc-state" "${tmpdir}/project-state" "${tmpdir}/quota-project-state" "${tmpdir}/service-state"
  : > "${tmpdir}/auth-state"
  : > "${tmpdir}/adc-state"
  printf 'wm-test-project\n' > "${tmpdir}/project-state"
  : > "${tmpdir}/service-state"

  run_precheck "${tmpdir}" env

  assert_file_contains "${tmpdir}/gcloud-command-log" "auth application-default get-quota-project"
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.checks.google_adc_quota_project === 'missing'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.adc_quota_project.status === 'missing'"
  assert_json_field "${report_path}" "r.summary.adc_quota_project.status === 'missing'"
  assert_json_no_secret_like "${report_path}"
}

case_service_enable_failure_does_not_overclaim_ready() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/stitch-adc-setup-report.json"
  mkdir -p "${tmpdir}/bin"
  make_isolated_bin "${tmpdir}/bin"
  make_fake_codex "${tmpdir}/bin"
  make_fake_gcloud_stateful "${tmpdir}/bin" "${tmpdir}/gcloud-command-log" "${tmpdir}/auth-state" "${tmpdir}/adc-state" "${tmpdir}/project-state" "${tmpdir}/quota-project-state" "${tmpdir}/service-state"
  : > "${tmpdir}/auth-state"
  : > "${tmpdir}/adc-state"
  printf 'wm-test-project\n' > "${tmpdir}/project-state"
  printf 'wm-test-project\n' > "${tmpdir}/quota-project-state"

  run_precheck "${tmpdir}" env STITCH_ADC_ENABLE_STITCH_API=true FAKE_GCLOUD_SERVICE_ENABLE_FAIL=true

  assert_file_contains "${tmpdir}/gcloud-command-log" "services enable stitch.googleapis.com"
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.stitch_api.service_status !== 'enabled'"
  assert_json_field "${report_path}" "r.tool_readiness.gcloud.stitch_api.service_enable_flow === 'stitch_api_enable_failed'"
  assert_json_no_secret_like "${report_path}"
}

case_missing_gcloud_reports_installer_source_needed
case_installer_requires_explicit_approval
case_approved_installer_runs_and_records_exact_install
case_auth_and_adc_login_require_human_present
case_human_present_starts_browser_auth_flows
case_service_enable_requires_explicit_opt_in
case_project_set_and_service_enable_recheck_ready
case_adc_quota_project_required_for_ready
case_service_enable_failure_does_not_overclaim_ready

printf '%s\n' "stitch-adc-setup smoke passed"
