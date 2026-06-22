#!/usr/bin/env bash
set -euo pipefail

REPORT_PATH="${REPORT_PATH:-/workspace/state/stitch-adc-setup-report.json}"
AGENT_TOOL_BIN_DIR="${STITCH_ADC_AGENT_TOOL_BIN_DIR:-/workspace/state/stitch-adc-tools/bin}"
GCLOUD_INSTALLER_PATH="${STITCH_ADC_GCLOUD_INSTALLER_PATH:-}"
INSTALL_APPROVED="${STITCH_ADC_INSTALL_APPROVED:-false}"
HUMAN_PRESENT="${STITCH_ADC_HUMAN_PRESENT:-false}"
GOOGLE_CLOUD_PROJECT_ID="${STITCH_ADC_GOOGLE_CLOUD_PROJECT:-}"
ENABLE_STITCH_API="${STITCH_ADC_ENABLE_STITCH_API:-false}"
STITCH_API_SERVICE_NAME="stitch.googleapis.com"
REPO_ROOT="${STITCH_ADC_REPO_ROOT:-/workspace/projects/Wondermove-Inc/new-mobile-app}"

redact() {
  sed -E 's/(token|key|secret|password|credential)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

command_status() {
  if command -v "$1" >/dev/null 2>&1; then
    printf 'available'
  else
    printf 'missing'
  fi
}

safe_version_check() {
  local cli_name="$1"
  if "${cli_name}" --version >/dev/null 2> >(redact >&2); then
    printf '%s\n' "checked"
  else
    printf '%s\n' "failed"
  fi
}

gcloud_auth_status_check() {
  local output
  output="$(gcloud auth list --format='value(account)' 2> >(redact >&2) || true)"
  if printf '%s\n' "${output}" | grep -E '[^[:space:]]' >/dev/null 2>&1 \
    && ! printf '%s\n' "${output}" | grep -Eiq 'no credentialed accounts|not logged in'; then
    printf '%s\n' "available"
  else
    printf '%s\n' "missing"
  fi
}

gcloud_adc_status_check() {
  if gcloud auth application-default print-access-token >/dev/null 2> >(redact >&2); then
    printf '%s\n' "available"
  else
    printf '%s\n' "missing"
  fi
}

safe_project_id_or_empty() {
  local candidate="$1"
  candidate="$(printf '%s' "${candidate}" | tr -d '\r' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  if printf '%s\n' "${candidate}" | grep -Eq '^[a-z][a-z0-9-]{4,28}[a-z0-9]$'; then
    printf '%s\n' "${candidate}"
  fi
}

gcloud_adc_quota_project_check() {
  local output safe_output
  if [[ "${gcloud_adc_status}" != "available" ]]; then
    gcloud_adc_quota_project_status="skipped"
    gcloud_adc_quota_project_id=""
    gcloud_adc_quota_project_safe="false"
    return
  fi

  output="$(gcloud auth application-default get-quota-project --format='value(quota_project_id)' 2> >(redact >&2) || true)"
  safe_output="$(safe_project_id_or_empty "${output}")"
  if [[ -n "${safe_output}" ]]; then
    gcloud_adc_quota_project_status="configured"
    gcloud_adc_quota_project_id="${safe_output}"
    gcloud_adc_quota_project_safe="true"
  else
    gcloud_adc_quota_project_status="missing"
    gcloud_adc_quota_project_id=""
    gcloud_adc_quota_project_safe="false"
  fi
}

gcloud_project_id_check() {
  local output
  output="$(gcloud config get-value project 2> >(redact >&2) || true)"
  safe_project_id_or_empty "${output}"
}

gcloud_project_status_check() {
  local output
  output="$(gcloud config get-value project 2> >(redact >&2) || true)"
  output="$(printf '%s' "${output}" | tr -d '\r' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  if [[ -n "${output}" && "${output}" != "(unset)" ]]; then
    printf '%s\n' "configured"
  else
    printf '%s\n' "missing"
  fi
}

stitch_api_service_status_check() {
  local output
  if ! output="$(gcloud services list --enabled --filter="${STITCH_API_SERVICE_NAME}" --format='value(config.name)' 2> >(redact >&2))"; then
    printf '%s\n' "blocked"
    return
  fi
  if printf '%s\n' "${output}" | grep -Fx "${STITCH_API_SERVICE_NAME}" >/dev/null 2>&1; then
    printf '%s\n' "enabled"
  else
    printf '%s\n' "missing"
  fi
}

ensure_gcloud_cli() {
  if command -v gcloud >/dev/null 2>&1; then
    gcloud_command_status="available"
    gcloud_install_decision="already_available"
    gcloud_installer_status="not_needed"
    gcloud_version_status="$(safe_version_check gcloud)"
    return
  fi

  if [[ -n "${GCLOUD_INSTALLER_PATH}" && -x "${GCLOUD_INSTALLER_PATH}" ]]; then
    if [[ "${INSTALL_APPROVED}" != "true" ]]; then
      gcloud_command_status="missing"
      gcloud_install_decision="install_blocked_needs_approval"
      gcloud_installer_status="approval_required"
      gcloud_version_status="not_checked"
      return
    fi

    mkdir -p "${AGENT_TOOL_BIN_DIR}"
    if "${GCLOUD_INSTALLER_PATH}" "${AGENT_TOOL_BIN_DIR}" >/dev/null 2> >(redact >&2); then
      export PATH="${AGENT_TOOL_BIN_DIR}:${PATH}"
      gcloud_install_decision="install_attempted"
      gcloud_installer_status="executed"
      if command -v gcloud >/dev/null 2>&1; then
        gcloud_command_status="available"
        gcloud_version_status="$(safe_version_check gcloud)"
      else
        gcloud_command_status="missing"
        gcloud_version_status="not_checked"
      fi
    else
      gcloud_command_status="missing"
      gcloud_install_decision="install_failed"
      gcloud_installer_status="failed"
      gcloud_version_status="not_checked"
    fi
    return
  fi

  gcloud_command_status="missing"
  gcloud_install_decision="install_unavailable_needs_platform_source"
  if [[ -n "${GCLOUD_INSTALLER_PATH}" ]]; then
    gcloud_installer_status="not_executable"
  else
    gcloud_installer_status="missing"
  fi
  gcloud_version_status="not_checked"
}

configure_gcloud_auth() {
  gcloud_auth_status="$(gcloud_auth_status_check)"
  if [[ "${gcloud_auth_status}" == "available" ]]; then
    gcloud_login_flow="not_needed"
    return
  fi
  if [[ "${HUMAN_PRESENT}" != "true" ]]; then
    gcloud_login_flow="needs_human_present"
    return
  fi
  if gcloud auth login --no-launch-browser >/dev/null 2> >(redact >&2); then
    gcloud_login_flow="gcloud_auth_no_launch_browser_started"
    gcloud_auth_status="$(gcloud_auth_status_check)"
  else
    gcloud_login_flow="gcloud_auth_no_launch_browser_failed"
  fi
}

configure_gcloud_adc() {
  gcloud_adc_status="$(gcloud_adc_status_check)"
  if [[ "${gcloud_adc_status}" == "available" ]]; then
    gcloud_adc_login_flow="not_needed"
    return
  fi
  if [[ "${HUMAN_PRESENT}" != "true" ]]; then
    gcloud_adc_login_flow="needs_human_present"
    return
  fi
  if gcloud auth application-default login --no-launch-browser >/dev/null 2> >(redact >&2); then
    gcloud_adc_login_flow="gcloud_adc_no_launch_browser_started"
    gcloud_adc_status="$(gcloud_adc_status_check)"
  else
    gcloud_adc_login_flow="gcloud_adc_no_launch_browser_failed"
  fi
}

configure_gcloud_project() {
  gcloud_project_status="$(gcloud_project_status_check)"
  gcloud_project_id="$(gcloud_project_id_check)"
  if [[ "${gcloud_project_status}" == "configured" ]]; then
    gcloud_project_set_flow="not_needed"
    return
  fi
  if [[ -z "${GOOGLE_CLOUD_PROJECT_ID}" ]]; then
    gcloud_project_set_flow="needs_project_id"
    return
  fi
  if gcloud config set project "${GOOGLE_CLOUD_PROJECT_ID}" >/dev/null 2> >(redact >&2); then
    gcloud_project_set_flow="attempted"
    gcloud_project_status="$(gcloud_project_status_check)"
    gcloud_project_id="$(gcloud_project_id_check)"
  else
    gcloud_project_set_flow="failed"
  fi
}

configure_stitch_api_service() {
  if [[ "${gcloud_command_status}" != "available" || "${gcloud_auth_status}" != "available" || "${gcloud_project_status}" != "configured" ]]; then
    stitch_api_service_status="skipped"
    stitch_api_service_enable_flow="skipped"
    return
  fi

  stitch_api_service_status="$(stitch_api_service_status_check)"
  if [[ "${stitch_api_service_status}" == "enabled" ]]; then
    stitch_api_service_enable_flow="not_needed"
    return
  fi
  if [[ "${stitch_api_service_status}" == "blocked" ]]; then
    stitch_api_service_enable_flow="skipped"
    return
  fi
  if [[ "${ENABLE_STITCH_API}" != "true" ]]; then
    stitch_api_service_enable_flow="needs_explicit_enable_approval"
    return
  fi

  if gcloud services enable "${STITCH_API_SERVICE_NAME}" >/dev/null 2> >(redact >&2); then
    stitch_api_service_status="$(stitch_api_service_status_check)"
    if [[ "${stitch_api_service_status}" == "enabled" ]]; then
      stitch_api_service_enable_flow="stitch_api_enable_started"
    else
      stitch_api_service_enable_flow="stitch_api_enable_failed"
    fi
  else
    stitch_api_service_status="$(stitch_api_service_status_check)"
    stitch_api_service_enable_flow="stitch_api_enable_failed"
  fi
}

mkdir -p "$(dirname "${REPORT_PATH}")"

gcloud_command_status="missing"
gcloud_install_decision="not_checked"
gcloud_installer_status="not_checked"
gcloud_version_status="not_checked"
gcloud_auth_status="skipped"
gcloud_login_flow="skipped"
gcloud_adc_status="skipped"
gcloud_adc_login_flow="skipped"
gcloud_adc_quota_project_status="skipped"
gcloud_adc_quota_project_id=""
gcloud_adc_quota_project_safe="false"
gcloud_project_status="missing"
gcloud_project_id=""
gcloud_project_command="gcloud config get-value project"
gcloud_project_set_flow="skipped"
stitch_api_service_status="skipped"
stitch_api_service_enable_flow="skipped"

ensure_gcloud_cli

if [[ "${gcloud_command_status}" == "available" ]]; then
  configure_gcloud_auth
  configure_gcloud_adc
  gcloud_adc_quota_project_check
  configure_gcloud_project
  configure_stitch_api_service
fi

codex_cli="$(command_status codex)"
stitch_mcp_status="skipped"
if [[ "${codex_cli}" == "available" ]]; then
  if codex mcp list 2> >(redact >&2) | grep -q 'stitch'; then
    stitch_mcp_status="configured"
  else
    stitch_mcp_status="missing"
  fi
fi

node - \
  "$REPORT_PATH" \
  "$gcloud_command_status" \
  "$gcloud_install_decision" \
  "$gcloud_installer_status" \
  "$gcloud_version_status" \
  "$gcloud_auth_status" \
  "$gcloud_login_flow" \
  "$gcloud_adc_status" \
  "$gcloud_adc_login_flow" \
  "$gcloud_adc_quota_project_status" \
  "$gcloud_adc_quota_project_id" \
  "$gcloud_adc_quota_project_safe" \
  "$gcloud_project_status" \
  "$gcloud_project_id" \
  "$gcloud_project_command" \
  "$gcloud_project_set_flow" \
  "$stitch_api_service_status" \
  "$stitch_api_service_enable_flow" \
  "$codex_cli" \
  "$stitch_mcp_status" \
  "$AGENT_TOOL_BIN_DIR" \
  "$STITCH_API_SERVICE_NAME" \
  "$REPO_ROOT" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const [
  reportPath,
  gcloudCommandStatus,
  gcloudInstallDecision,
  gcloudInstallerStatus,
  gcloudVersionStatus,
  gcloudAuthStatus,
  gcloudLoginFlow,
  gcloudAdcStatus,
  gcloudAdcLoginFlow,
  gcloudAdcQuotaProjectStatus,
  gcloudAdcQuotaProjectId,
  gcloudAdcQuotaProjectSafe,
  gcloudProjectStatus,
  gcloudProjectId,
  gcloudProjectCommand,
  gcloudProjectSetFlow,
  stitchApiServiceStatus,
  stitchApiServiceEnableFlow,
  codexCli,
  stitchMcpStatus,
  agentToolBinDir,
  stitchApiServiceName,
  repoRoot,
] = process.argv.slice(2);

const ready =
  gcloudCommandStatus === 'available' &&
  gcloudAuthStatus === 'available' &&
  gcloudAdcStatus === 'available' &&
  gcloudAdcQuotaProjectStatus === 'configured' &&
  gcloudAdcQuotaProjectSafe === 'true' &&
  gcloudProjectStatus === 'configured' &&
  stitchApiServiceStatus === 'enabled' &&
  stitchMcpStatus === 'configured';

const safeString = (value) => (typeof value === 'string' && value.length > 0 ? value : undefined);

function readStitchMcpConfig() {
  const configPath = path.join(repoRoot, '.codex', 'config.toml');
  const fallback = {
    status: stitchMcpStatus,
    mcp_source: '.codex/config.toml',
    check_command: 'codex',
    check_args: ['mcp', 'list'],
  };
  let text = '';
  try {
    text = fs.readFileSync(configPath, 'utf8');
  } catch {
    return fallback;
  }
  const sectionMatch = text.match(/\[mcp_servers\.stitch\]([\s\S]*?)(?=\n\[|$)/);
  if (!sectionMatch) {
    return fallback;
  }
  const section = sectionMatch[1];
  const commandMatch = section.match(/^\s*command\s*=\s*"([^"]+)"\s*$/m);
  const argsMatch = section.match(/^\s*args\s*=\s*\[([^\]]*)\]\s*$/m);
  const args = [];
  if (argsMatch) {
    const argPattern = /"([^"]+)"/g;
    let match;
    while ((match = argPattern.exec(argsMatch[1])) !== null) {
      args.push(match[1]);
    }
  }
  return {
    ...fallback,
    command: commandMatch ? commandMatch[1] : undefined,
    args,
  };
}

const stitchMcp = readStitchMcpConfig();

const installPlan = [];
if (gcloudInstallDecision === 'install_blocked_needs_approval') {
  installPlan.push({
    tool: 'gcloud',
    package: 'google-cloud-cli',
    command: 'approved Google Cloud CLI installer',
    approval_required: true,
  });
}

const installedExact = [];
if (
  gcloudInstallDecision === 'install_attempted' &&
  gcloudInstallerStatus === 'executed' &&
  gcloudCommandStatus === 'available' &&
  gcloudVersionStatus === 'checked'
) {
  installedExact.push({
    tool: 'gcloud',
    package: 'google-cloud-cli',
    command: 'approved Google Cloud CLI installer',
  });
}

const minimumUserAction = [];
if (gcloudCommandStatus !== 'available') {
  minimumUserAction.push('Provide a local executable Google Cloud CLI installer from an approved official source and set STITCH_ADC_INSTALL_APPROVED=true only after approval.');
}
if (gcloudAuthStatus === 'missing') {
  minimumUserAction.push('Be present for the browser-based gcloud auth login flow; do not send tokens or credential JSON in chat.');
}
if (gcloudAdcStatus === 'missing') {
  minimumUserAction.push('Be present for gcloud auth application-default login; do not send ADC JSON, service account JSON, or tokens in chat.');
}
if (gcloudAdcStatus === 'available' && gcloudAdcQuotaProjectStatus !== 'configured') {
  minimumUserAction.push('Configure a non-secret ADC quota project with a human/platform owner present; do not send verification codes, ADC JSON, or tokens in chat.');
}
if (gcloudProjectStatus === 'missing') {
  minimumUserAction.push('Provide the non-secret Google Cloud project id via STITCH_ADC_GOOGLE_CLOUD_PROJECT.');
}
if (stitchApiServiceEnableFlow === 'needs_explicit_enable_approval') {
  minimumUserAction.push('Set STITCH_ADC_ENABLE_STITCH_API=true only when the logged-in Google account may enable stitch.googleapis.com on the selected project.');
}

const report = {
  schema: 'stitch-adc-setup/v1',
  status: ready ? 'ready_for_design_gate' : 'blocked',
  summary: {
    google_cloud_project: {
      status: gcloudProjectStatus,
      project_id: safeString(gcloudProjectId),
    },
    google_adc: {
      status: gcloudAdcStatus,
    },
    adc_quota_project: {
      status: gcloudAdcQuotaProjectStatus,
      project_id: gcloudAdcQuotaProjectSafe === 'true' ? safeString(gcloudAdcQuotaProjectId) : undefined,
    },
    stitch_api_service: {
      status: stitchApiServiceStatus,
      service_name: stitchApiServiceName,
    },
    stitch_mcp: {
      source: stitchMcp.mcp_source,
      status: stitchMcp.status,
      command: stitchMcp.command,
      args: stitchMcp.args,
      check_command: stitchMcp.check_command,
      check_args: stitchMcp.check_args,
    },
  },
  checks: {
    gcloud_cli: gcloudCommandStatus,
    google_adc: gcloudAdcStatus,
    google_adc_quota_project: gcloudAdcQuotaProjectStatus,
    google_cloud_project: gcloudProjectStatus,
    codex_cli: codexCli,
    stitch_mcp: stitchMcpStatus,
  },
  tool_readiness: {
    gcloud: {
      required: true,
      owner: 'agent_with_approved_installer_then_human_auth',
      command_status: gcloudCommandStatus,
      install_decision: gcloudInstallDecision,
      installer_status: gcloudInstallerStatus,
      version_status: gcloudVersionStatus,
      auth_status: gcloudAuthStatus,
      login_flow: gcloudLoginFlow,
      adc_status: gcloudAdcStatus,
      adc_login_flow: gcloudAdcLoginFlow,
      adc_quota_project: {
        status: gcloudAdcQuotaProjectStatus,
        project_id: gcloudAdcQuotaProjectSafe === 'true' ? safeString(gcloudAdcQuotaProjectId) : undefined,
        command: 'gcloud auth application-default get-quota-project',
      },
      project_status: gcloudProjectStatus,
      project_id: safeString(gcloudProjectId),
      project_command: gcloudProjectCommand,
      project_set_flow: gcloudProjectSetFlow,
      tool_bin_dir: agentToolBinDir,
      stitch_api: {
        service_name: stitchApiServiceName,
        service_status: stitchApiServiceStatus,
        service_enable_flow: stitchApiServiceEnableFlow,
        enable_command: `gcloud services enable ${stitchApiServiceName}`,
      },
    },
    codex_cli: {
      command_status: codexCli,
    },
    stitch_mcp: {
      ...stitchMcp,
    },
  },
  install_plan: installPlan,
  installed_exact: installedExact,
  live_use: {
    requires: 'Design workflow gates and human-gate/v1 when applicable',
    mcp_source: '.codex/config.toml',
  },
  minimum_user_action: minimumUserAction,
  reporting: 'status only; no auth token values',
};
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE

echo "stitch-adc-setup complete: report=${REPORT_PATH}"
