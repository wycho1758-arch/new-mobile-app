#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
REPO_CLONE_URL="${REPO_CLONE_URL:-https://github.com/Wondermove-Inc/new-mobile-app.git}"
CODEX_MANAGED_PATHS="${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}"
SKILLS_ROOT="${PROJECT_BOOTSTRAP_SKILLS_ROOT:-/workspace/skills}"
REPORT_PATH="${PROJECT_BOOTSTRAP_REPORT_PATH:-${REPORT_PATH:-/workspace/state/project-bootstrap-report.json}}"
POD_ROLE_BOOTSTRAP_REPORT="${POD_ROLE_BOOTSTRAP_REPORT:-/workspace/state/pod-role-bootstrap-report.json}"
STITCH_ADC_REPORT="${STITCH_ADC_REPORT:-/workspace/state/stitch-adc-setup-report.json}"
EAS_ROBOT_AUTH_REPORT="${EAS_ROBOT_AUTH_REPORT:-/workspace/state/eas-robot-auth-setup-report.json}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BLOCKERS_MD_PATH="${PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH:-${BLOCKERS_MD_PATH:-/workspace/state/project-bootstrap-blockers.md}}"
BLOCKER_RESOLUTION_GUIDE="${PROJECT_BOOTSTRAP_BLOCKER_RESOLUTION_GUIDE:-${SKILL_ROOT}/references/blocker-resolution-guide.md}"

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

  read_identity_role
}

read_identity_role() {
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
identity_role="$(read_identity_role)"
identity_role_key="$(normalize_role "${identity_role}")"
role_canonical_status="missing"
if [[ "${role}" != "missing" ]]; then
  if ! is_canonical_role "${role_key}"; then
    role_canonical_status="unknown"
  elif [[ "${role}" == "${role_key}" ]]; then
    role_canonical_status="canonical"
  else
    role_canonical_status="non_canonical"
  fi
fi
identity_role_canonical_status="not_configured"
identity_role_match_status="not_configured"
if [[ "${identity_role}" != "missing" ]]; then
  if ! is_canonical_role "${identity_role_key}"; then
    identity_role_canonical_status="unknown"
  elif [[ "${identity_role}" == "${identity_role_key}" ]]; then
    identity_role_canonical_status="canonical"
  else
    identity_role_canonical_status="non_canonical"
  fi

  if [[ -n "${WM_ROLE:-}" ]]; then
    if [[ "${identity_role_key}" == "${role_key}" ]]; then
      identity_role_match_status="match"
    else
      identity_role_match_status="mismatch"
    fi
  fi
fi
role_expected_status="not_configured"
expected_role_canonical_status="not_configured"
if [[ -n "${WM_EXPECTED_ROLE:-}" ]]; then
  expected_role_key="$(normalize_role "${WM_EXPECTED_ROLE}")"
  if [[ "${role_key}" == "${expected_role_key}" ]]; then
    role_expected_status="match"
  else
    role_expected_status="mismatch"
  fi
  if ! is_canonical_role "${expected_role_key}"; then
    expected_role_canonical_status="unknown"
  elif [[ "${WM_EXPECTED_ROLE}" == "${expected_role_key}" ]]; then
    expected_role_canonical_status="canonical"
  else
    expected_role_canonical_status="non_canonical"
  fi
fi

role_requires_stitch="false"
role_requires_eas="false"
case "${role_key}" in
  design)
    role_requires_stitch="true"
    ;;
  qa-release)
    role_requires_eas="true"
    ;;
esac

mkdir -p "$(dirname "${REPORT_PATH}")"

node - "$REPORT_PATH" \
  "$BLOCKERS_MD_PATH" \
  "$BLOCKER_RESOLUTION_GUIDE" \
  "$role" \
  "$role_key" \
  "$role_canonical_status" \
  "$identity_role" \
  "$identity_role_canonical_status" \
  "$identity_role_match_status" \
  "$role_expected_status" \
  "$expected_role_canonical_status" \
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
  "$(dir_status "${SKILLS_ROOT%/}/project-bootstrap")" \
  "$(dir_status "${SKILLS_ROOT%/}/codex-cli-auth-setup")" \
  "$(dir_status "${SKILLS_ROOT%/}/pod-role-bootstrap")" \
  "$(dir_status "${SKILLS_ROOT%/}/stitch-adc-setup")" \
  "$(dir_status "${SKILLS_ROOT%/}/eas-robot-auth-setup")" \
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
  "$POD_ROLE_BOOTSTRAP_REPORT" \
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
  blockerGuidePath,
  blockerGuideReferencePath,
  role,
  roleKey,
  roleCanonicalStatus,
  identityRole,
  identityRoleCanonicalStatus,
  identityRoleMatchStatus,
  expectedRoleStatus,
  expectedRoleCanonicalStatus,
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
  podRoleBootstrapReportPath,
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

function readNestedReport(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return { status: 'missing', blockers: [] };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const nestedBlockers = new Set();
    if (Array.isArray(parsed?.preflight?.blockers)) {
      for (const blocker of parsed.preflight.blockers) {
        if (typeof blocker === 'string' && blocker) nestedBlockers.add(blocker);
      }
    }
    if (Array.isArray(parsed?.preflight?.result?.blockers)) {
      for (const blocker of parsed.preflight.result.blockers) {
        if (typeof blocker?.reason === 'string' && blocker.reason) nestedBlockers.add(blocker.reason);
      }
    }
    return {
      status: typeof parsed?.status === 'string' ? parsed.status : 'unknown',
      blockers: [...nestedBlockers],
    };
  } catch {
    return { status: 'unreadable', blockers: [] };
  }
}

const podRoleBootstrapNestedReport = readNestedReport(podRoleBootstrapReportPath);

function requirePresent(label, value) {
  if (value !== 'present') blockers.push(label);
}

if (role === 'missing') blockers.push('missing role identity');
if (roleCanonicalStatus === 'unknown') blockers.push('unknown WM_ROLE canonical slug');
if (roleCanonicalStatus === 'non_canonical') blockers.push('WM_ROLE must use canonical role slug');
if (identityRoleCanonicalStatus === 'unknown') blockers.push('unknown /workspace/IDENTITY canonical slug');
if (identityRoleCanonicalStatus === 'non_canonical') blockers.push('/workspace/IDENTITY must use canonical role slug');
if (identityRoleMatchStatus === 'mismatch') blockers.push('WM_ROLE and /workspace/IDENTITY mismatch');
if (expectedRoleStatus === 'mismatch') blockers.push('WM_EXPECTED_ROLE mismatch');
if (expectedRoleCanonicalStatus === 'unknown') blockers.push('unknown WM_EXPECTED_ROLE canonical slug');
if (expectedRoleCanonicalStatus === 'non_canonical') blockers.push('WM_EXPECTED_ROLE must use canonical role slug');
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
if (podRoleBootstrapNestedReport.status === 'blocked') blockers.push('pod-role-bootstrap blocked');

const blockerGuide = {
  path: blockerGuidePath,
  status: blockers.length ? 'written' : 'not_applicable',
  reference: blockerGuideReferencePath,
  reference_status: fs.existsSync(blockerGuideReferencePath) ? 'present' : 'missing',
};

function buildUserUnderstandableResult() {
  const nestedBlockers = new Set(podRoleBootstrapNestedReport.blockers);
  const blockerSet = new Set(blockers);
  const hasPodRoleBlocked = blockers.includes('pod-role-bootstrap blocked');
  const hasGitIdentityMissing = nestedBlockers.has('git-identity-missing');
  const hasGithubAuthUnavailable = nestedBlockers.has('github-auth-unavailable');
  const hasMissingRepoSot = blockers.some((blocker) => blocker.startsWith('missing repo SoT file '));
  const hasMissingCodexCli = blockerSet.has('missing codex CLI');
  const missingRequiredMcps = blockers
    .filter((blocker) => blocker.startsWith('missing required MCP '))
    .map((blocker) => blocker.replace('missing required MCP ', ''));
  const hasMissingRequiredMcp = missingRequiredMcps.length > 0;
  const hasMissingPodSkill = blockers.some((blocker) => blocker.startsWith('missing /workspace/skills/'));
  const hasCredentialReportBlocker = blockerSet.has('missing stitch-adc-setup report') || blockerSet.has('missing eas-robot-auth-setup report');
  const hasHumanGateBlocker = blockers.some((blocker) => /human-gate|live external|risk-bearing/i.test(blocker));
  const supportBlockers = blockers
    .concat(podRoleBootstrapNestedReport.blockers)
    .filter((blocker) => blocker !== 'codex-preflight --pod reported blockers');
  const technicalBlockers = supportBlockers
    .map((blocker) => `\`${blocker}\``)
    .join(', ');
  const lines = [
    '## Action needed',
    '',
  ];

  if (hasGithubAuthUnavailable) {
    lines.push('GitHub connection is needed before I can continue.');
    lines.push('This environment is not connected to GitHub yet, so I cannot access or upload repository changes.');
    lines.push('When the GitHub login screen opens, sign in with your GitHub account and approve the request.');
    if (hasPodRoleBlocked) {
      lines.push('The setup report exists, but the project is not ready until this GitHub connection is fixed.');
    }
  } else {
    lines.push('Project bootstrap needs one more user-owned item before I can continue safely.');
    if (hasPodRoleBlocked) {
      lines.push('The setup report exists, but the project is not ready yet.');
    }
  }

  lines.push(
    '',
    '### What the agent already checked',
    '',
    '- The agent ran the project readiness preflight and recorded status-only local checks.',
    '- The agent checked the repo path, managed path, required skills, required MCPs, and generated report paths that are visible to this preflight.',
    '- The agent can use local CLI, MCP status checks, and browser/computer-use for safe setup; a login screen requires a human to be present for credential entry.',
  );

  if (hasPodRoleBlocked) {
    lines.push('- The agent read `/workspace/state/pod-role-bootstrap-report.json`; that report is generated by `pod-role-bootstrap` and consumed by `project-bootstrap`.');
  }
  if (hasGitIdentityMissing) {
    lines.push('- Git commit identity is still missing because no approved public name/email pair is available yet.');
  }
  if (hasGithubAuthUnavailable) {
    lines.push('- GitHub connection is still unavailable because no completed GitHub login is available in this environment.');
  }

  lines.push(
    '',
    '### What you need to do',
    '',
  );

  const userRequests = [];
  if (hasGithubAuthUnavailable) {
    userRequests.push('Complete the GitHub login in the GitHub login screen. Sign in with your GitHub account and approve the request. Do not send GitHub tokens in chat.');
  }
  if (hasGitIdentityMissing) {
    userRequests.push('Provide the Git commit author name and email to use for commits, or point me to an approved local handoff file. This is public/non-secret. I will not invent an email address.');
  }
  if (hasMissingRepoSot) {
    userRequests.push('Provide the correct checkout or approved project file source for the missing project file, such as `.codex/config.toml`. Do not paste a secret-bearing config in chat.');
  }
  if (hasMissingPodSkill) {
    userRequests.push('Ask the platform owner to install or refresh the exact missing pod skill artifact.');
  }
  if (hasMissingCodexCli) {
    userRequests.push('Ask the platform owner for a platform owner refresh of the pod image/runtime or an approved Codex CLI artifact. Do not manually add unapproved binaries.');
  }
  if (hasMissingRequiredMcp) {
    userRequests.push(`Ask the platform owner for approved MCP/tool-auth config for: ${missingRequiredMcps.join(', ')}. Do not install arbitrary tools. Do not use \`@latest\`.`);
  }
  if (hasCredentialReportBlocker) {
    userRequests.push('Provide an approved secure credential source through Secret, secure store, tool auth, mounted file, or human-present login. This is credential availability only, not raw secret text.');
  }
  if (hasHumanGateBlocker) {
    userRequests.push('For live external or risk-bearing action, provide a linked `human-gate/v1` decision naming the exact action and evidence path.');
  }
  if (userRequests.length === 0) {
    userRequests.push('Provide only the missing project file source, public non-secret value, approved secure credential source, or human-gate decision named by the support details.');
  }
  for (const request of userRequests) {
    lines.push(`- ${request}`);
  }

  lines.push(
    '',
    '### What I will do after that',
    '',
  );
  const nextActions = [];
  if (hasGitIdentityMissing || hasGithubAuthUnavailable) {
    nextActions.push('I will check the GitHub connection, set up Git to use that login after authentication works, apply the approved Git identity source if needed, rerun `pod-role-bootstrap`, and rerun `project-bootstrap` preflight.');
  }
  if (hasMissingRepoSot || hasMissingPodSkill) {
    nextActions.push('I will recheck the project files, required pod skills, managed path, and repo SoT, then rerun setup and preflight.');
  }
  if (hasMissingCodexCli || hasMissingRequiredMcp) {
    nextActions.push('I will rerun version checks, Codex CLI checks, MCP checks, and bootstrap/preflight after the approved runtime or tool-auth source exists.');
  }
  if (hasCredentialReportBlocker) {
    nextActions.push('I will run the relevant redacted status-only setup report and continue only from status labels, not secret values.');
  }
  if (nextActions.length === 0) {
    nextActions.push('I will rerun the relevant local setup check and then rerun `project-bootstrap` preflight.');
  }
  for (const action of nextActions) {
    lines.push(`- ${action}`);
  }

  lines.push(
    '',
    '### Do not send in chat',
    '',
    '- Do not send passwords, tokens, 2FA codes, recovery codes, private keys, database URLs, bearer tokens, Google ADC JSON, service account JSON, or full secret-bearing config.',
    '- I will ask only for a user-owned approval, public non-secret value, approved secure place, or human-present login when I cannot safely do that part myself.',
    '',
    '### Technical details for support',
    '',
    `- Blockers: ${technicalBlockers || 'none'}.`,
  );

  return lines.join('\n');
}

if (blockers.length) {
  const generatedAt = new Date().toISOString();
  const markdown = [
    '# Project Bootstrap Blockers',
    '',
    `Generated at: ${generatedAt}`,
    `Report: ${reportPath}`,
    `Repo path: ${repoPath}`,
    '',
    buildUserUnderstandableResult(),
    '',
    '## Current Status Summary',
    '',
    `- Role: ${role}`,
    `- Role normalized: ${roleKey}`,
    `- Role canonical: ${roleCanonicalStatus}`,
    `- /workspace/IDENTITY: ${identityRole}`,
    `- /workspace/IDENTITY canonical: ${identityRoleCanonicalStatus}`,
    `- /workspace/IDENTITY match: ${identityRoleMatchStatus}`,
    `- WM_EXPECTED_ROLE: ${expectedRoleStatus}`,
    `- WM_EXPECTED_ROLE canonical: ${expectedRoleCanonicalStatus}`,
    `- Repo path status: ${repoPathStatus}`,
    `- Managed path status: ${managedPathStatus}`,
    `- Codex CLI: ${codexCli}`,
    `- GitHub CLI: ${ghCli}`,
    `- pnpm CLI: ${pnpmCli}`,
    `- Required MCP mobile-mcp: ${mobileMcp}`,
    `- Required MCP serena: ${serenaMcp}`,
    `- Required MCP stitch: ${stitchMcp}`,
    `- Pod role bootstrap report: ${podRoleBootstrapReport}`,
    '',
    '## Support Reference',
    '',
    `- Resolution guide: ${blockerGuideReferencePath}`,
    `- Resolution guide status: ${fs.existsSync(blockerGuideReferencePath) ? 'present' : 'missing'}`,
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(blockerGuidePath), { recursive: true });
  fs.writeFileSync(blockerGuidePath, markdown);
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
    canonical: roleCanonicalStatus,
    workspace_identity: identityRole,
    workspace_identity_canonical: identityRoleCanonicalStatus,
    workspace_identity_match: identityRoleMatchStatus,
    expected: expectedRoleStatus,
    expected_canonical: expectedRoleCanonicalStatus,
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
  nested_reports: {
    pod_role_bootstrap: podRoleBootstrapNestedReport,
  },
  blocker_guide: blockerGuide,
  blockers,
  reporting: 'status only; no auth token values, raw credential output, ADC JSON, database URLs, bearer tokens, or private keys',
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE

echo "project-bootstrap preflight complete: report=${REPORT_PATH}"
