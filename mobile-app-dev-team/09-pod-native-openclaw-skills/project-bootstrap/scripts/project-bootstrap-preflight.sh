#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
REPO_CLONE_URL="${REPO_CLONE_URL:-https://github.com/Wondermove-Inc/new-mobile-app.git}"
CODEX_MANAGED_PATHS="${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}"
REPORT_PATH="${PROJECT_BOOTSTRAP_REPORT_PATH:-${REPORT_PATH:-/workspace/state/project-bootstrap-report.json}}"
POD_ROLE_BOOTSTRAP_REPORT="${POD_ROLE_BOOTSTRAP_REPORT:-/workspace/state/pod-role-bootstrap-report.json}"
STITCH_ADC_REPORT="${STITCH_ADC_REPORT:-/workspace/state/stitch-adc-setup-report.json}"
EAS_ROBOT_AUTH_REPORT="${EAS_ROBOT_AUTH_REPORT:-/workspace/state/eas-robot-auth-setup-report.json}"

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

file_status() {
  if [[ -e "$1" ]]; then
    printf 'present'
  else
    printf 'missing'
  fi
}

dir_status() {
  if [[ -d "$1" ]]; then
    printf 'present'
  else
    printf 'missing'
  fi
}

resolve_role() {
  if [[ -n "${WM_ROLE:-}" ]]; then
    printf '%s\n' "${WM_ROLE}"
    return
  fi

  if [[ -r /workspace/IDENTITY ]]; then
    head -n 1 /workspace/IDENTITY | tr -d '\r'
    return
  fi

  printf 'missing'
}

status_from_env_ref() {
  if [[ -n "${1:-}" ]]; then
    printf 'present'
  else
    printf 'missing'
  fi
}

normalize_role() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's#[[:space:]_/]+#-#g; s#^-+##; s#-+$##'
}

mcp_status() {
  local name="$1"
  if ! command -v codex >/dev/null 2>&1; then
    printf 'skipped'
    return
  fi

  if codex mcp list 2> >(redact >&2) | grep -Eq "(^|[[:space:]])${name}([[:space:]]|$)"; then
    printf 'configured'
  else
    printf 'missing'
  fi
}

managed_path_status="missing registry"
managed_path="${REPO_PATH%/}/"
if [[ -r "${CODEX_MANAGED_PATHS}" ]]; then
  if grep -Fx -- "- ${managed_path}" "${CODEX_MANAGED_PATHS}" >/dev/null 2>&1; then
    managed_path_status="present"
  else
    managed_path_status="missing managed path entry"
  fi
fi

role="$(resolve_role)"
role_key="$(normalize_role "${role}")"
role_expected_status="not_configured"
if [[ -n "${WM_EXPECTED_ROLE:-}" ]]; then
  expected_role_key="$(normalize_role "${WM_EXPECTED_ROLE}")"
  if [[ "${role_key}" == "${expected_role_key}" ]]; then
    role_expected_status="match"
  else
    role_expected_status="mismatch"
  fi
fi

role_requires_stitch="false"
role_requires_eas="false"
case "${role_key}" in
  design|product-designer)
    role_requires_stitch="true"
    ;;
  qa-release|qa|release)
    role_requires_eas="true"
    ;;
esac

mkdir -p "$(dirname "${REPORT_PATH}")"

node - "$REPORT_PATH" \
  "$role" \
  "$role_key" \
  "$role_expected_status" \
  "$REPO_PATH" \
  "$(dir_status "${REPO_PATH}")" \
  "$(file_status "${REPO_PATH}/AGENTS.md")" \
  "$(file_status "${REPO_PATH}/REPO_OPERATIONS.md")" \
  "$(file_status "${REPO_PATH}/PROJECT_ENVIRONMENT.md")" \
  "$(file_status "${REPO_PATH}/.codex/config.toml")" \
  "$(file_status "${REPO_PATH}/docs/TEMPLATE_VARIABLES.md")" \
  "$(file_status "${REPO_PATH}/docs/CREDENTIALS.md")" \
  "$(file_status "${REPO_PATH}/mobile-app-dev-team/09-pod-native-openclaw-skills/README.md")" \
  "$REPO_CLONE_URL" \
  "$CODEX_MANAGED_PATHS" \
  "$managed_path_status" \
  "$(dir_status /workspace/skills/project-bootstrap)" \
  "$(dir_status /workspace/skills/codex-cli-auth-setup)" \
  "$(dir_status /workspace/skills/pod-role-bootstrap)" \
  "$(dir_status /workspace/skills/stitch-adc-setup)" \
  "$(dir_status /workspace/skills/eas-robot-auth-setup)" \
  "$(command_status codex)" \
  "$(command_status gh)" \
  "$(command_status railway)" \
  "$(command_status gcloud)" \
  "$(command_status eas)" \
  "$(command_status pnpm)" \
  "$(mcp_status mobile-mcp)" \
  "$(mcp_status serena)" \
  "$(mcp_status stitch)" \
  "$(mcp_status expo)" \
  "$(mcp_status atlassian)" \
  "$(mcp_status node_repl)" \
  "$(mcp_status playwright)" \
  "$(file_status "${POD_ROLE_BOOTSTRAP_REPORT}")" \
  "$(file_status "${STITCH_ADC_REPORT}")" \
  "$(file_status "${EAS_ROBOT_AUTH_REPORT}")" \
  "$role_requires_stitch" \
  "$role_requires_eas" \
  "$(status_from_env_ref "${EXPO_OWNER:-}")" \
  "$(status_from_env_ref "${EAS_PROJECT_ID:-}")" \
  "$(status_from_env_ref "${EXPO_TOKEN_SECRET_NAME:-}")" \
  "$(status_from_env_ref "${RAILWAY_TOKEN_SECRET_NAME:-${RAILWAY_PROJECT_ID:-}}")" \
  "$(status_from_env_ref "${GOOGLE_CLOUD_PROJECT:-}")" \
  "$(status_from_env_ref "${API_SECRET_REF:-${DATABASE_URL_SECRET_NAME:-}}")" \
  "$(status_from_env_ref "${HUMAN_GATE_V1_PATH:-}")" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');

const [
  reportPath,
  role,
  roleKey,
  expectedRoleStatus,
  repoPath,
  repoPathStatus,
  agentsFile,
  repoOperationsFile,
  projectEnvironmentFile,
  codexConfigFile,
  templateVariablesFile,
  credentialsFile,
  podSkillMatrixFile,
  repoCloneUrl,
  managedRegistry,
  managedPathStatus,
  projectBootstrapSkill,
  codexCliAuthSetupSkill,
  podRoleBootstrapSkill,
  stitchAdcSetupSkill,
  easRobotAuthSetupSkill,
  codexCli,
  ghCli,
  railwayCli,
  gcloudCli,
  easCli,
  pnpmCli,
  mobileMcp,
  serenaMcp,
  stitchMcp,
  expoMcp,
  atlassianMcp,
  nodeReplMcp,
  playwrightMcp,
  podRoleBootstrapReport,
  stitchAdcReport,
  easRobotAuthReport,
  roleRequiresStitch,
  roleRequiresEas,
  expoOwner,
  easProjectId,
  expoTokenSecret,
  railwayAuth,
  googleCloudProject,
  apiSecretRef,
  humanGate,
] = process.argv.slice(2);

const blockers = [];
const tokenBearingCloneUrl = /:\/\/[^/\s]+@/.test(repoCloneUrl) || /(?:token|password|secret|key)=/i.test(repoCloneUrl);

function requirePresent(label, value) {
  if (value !== 'present') blockers.push(label);
}

if (role === 'missing') blockers.push('missing role identity');
if (expectedRoleStatus === 'mismatch') blockers.push('WM_EXPECTED_ROLE mismatch');
if (repoPathStatus !== 'present' && (!repoCloneUrl || tokenBearingCloneUrl)) {
  blockers.push('repo missing and REPO_CLONE_URL is missing or token-bearing');
}
const requiredSotFiles = {
  'AGENTS.md': agentsFile,
  'REPO_OPERATIONS.md': repoOperationsFile,
  'PROJECT_ENVIRONMENT.md': projectEnvironmentFile,
  '.codex/config.toml': codexConfigFile,
  'docs/TEMPLATE_VARIABLES.md': templateVariablesFile,
  'docs/CREDENTIALS.md': credentialsFile,
  'mobile-app-dev-team/09-pod-native-openclaw-skills/README.md': podSkillMatrixFile,
};
if (repoPathStatus === 'present') {
  for (const [name, status] of Object.entries(requiredSotFiles)) {
    if (status !== 'present') blockers.push(`missing repo SoT file ${name}`);
  }
}
if (managedPathStatus !== 'present') blockers.push(managedPathStatus);
requirePresent('missing /workspace/skills/project-bootstrap', projectBootstrapSkill);
requirePresent('missing /workspace/skills/codex-cli-auth-setup', codexCliAuthSetupSkill);
requirePresent('missing /workspace/skills/pod-role-bootstrap', podRoleBootstrapSkill);
if (codexCli !== 'available') blockers.push('missing codex CLI');
for (const [name, status] of [['mobile-mcp', mobileMcp], ['serena', serenaMcp], ['stitch', stitchMcp]]) {
  if (status !== 'configured') blockers.push(`missing required MCP ${name}`);
}
if (roleRequiresStitch === 'true') {
  requirePresent('missing /workspace/skills/stitch-adc-setup', stitchAdcSetupSkill);
  if (stitchAdcReport !== 'present') blockers.push('missing stitch-adc-setup report');
}
if (roleRequiresEas === 'true') {
  requirePresent('missing /workspace/skills/eas-robot-auth-setup', easRobotAuthSetupSkill);
  if (easRobotAuthReport !== 'present') blockers.push('missing eas-robot-auth-setup report');
}

const report = {
  schema: 'project-bootstrap/v1',
  status: blockers.length ? 'blocked' : 'ready_for_bootstrap',
  repo: {
    clone_url_status: tokenBearingCloneUrl ? 'token_bearing_or_rejected' : 'configured_non_secret',
    path: repoPath,
    path_status: repoPathStatus,
    managed_path: {
      registry: managedRegistry,
      status: managedPathStatus,
    },
  },
  role: {
    resolved: role,
    normalized: roleKey,
    expected: expectedRoleStatus,
    requires_stitch: roleRequiresStitch === 'true',
    requires_eas: roleRequiresEas === 'true',
  },
  repo_sot_files: requiredSotFiles,
  pod_skills: {
    project_bootstrap: projectBootstrapSkill,
    codex_cli_auth_setup: codexCliAuthSetupSkill,
    pod_role_bootstrap: podRoleBootstrapSkill,
    stitch_adc_setup: stitchAdcSetupSkill,
    eas_robot_auth_setup: easRobotAuthSetupSkill,
  },
  mcp: {
    required: {
      mobile_mcp: mobileMcp,
      serena: serenaMcp,
      stitch: stitchMcp,
    },
    conditional: {
      expo: expoMcp,
      atlassian: atlassianMcp,
      node_repl: nodeReplMcp,
      playwright: playwrightMcp,
    },
  },
  cli: {
    codex: codexCli,
    gh: ghCli,
    railway: railwayCli,
    gcloud: gcloudCli,
    eas: easCli,
    pnpm: pnpmCli,
  },
  external_status_refs: {
    expo_owner: expoOwner,
    eas_project_id: easProjectId,
    expo_token_secret_ref: expoTokenSecret,
    railway_auth_ref: railwayAuth,
    google_cloud_project: googleCloudProject,
    api_secret_ref: apiSecretRef,
    human_gate_v1: humanGate,
  },
  reports: {
    pod_role_bootstrap: podRoleBootstrapReport,
    stitch_adc_setup: roleRequiresStitch === 'true' ? stitchAdcReport : 'not_applicable',
    eas_robot_auth_setup: roleRequiresEas === 'true' ? easRobotAuthReport : 'not_applicable',
  },
  blockers,
  reporting: 'status only; no auth token values, raw credential output, ADC JSON, database URLs, bearer tokens, or private keys',
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE

echo "project-bootstrap preflight complete: report=${REPORT_PATH}"
