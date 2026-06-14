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
  "$(status_from_env_ref "${HUMAN_GATE_V1_PATH:-}")" \
  "${PROJECT_BOOTSTRAP_USER_LANGUAGE:-auto}" \
  "${PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE:-}" <<'NODE'
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
  userLanguageRequestedRaw,
  currentUserLanguageHintRaw,
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
for (const [name, status] of [
  ['mobile-mcp', mobileMcp],
  ['serena', serenaMcp],
  ['stitch', stitchMcp],
  ['expo', expoMcp],
  ['atlassian', atlassianMcp],
  ['node_repl', nodeReplMcp],
  ['playwright', playwrightMcp],
]) {
  if (status !== 'configured') blockers.push(`missing required MCP ${name}`);
}
for (const [name, status] of [['railway', railwayCli], ['gcloud', gcloudCli]]) {
  if (status !== 'available') blockers.push(`missing required CLI ${name}`);
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

// Language contract literals for validators and generated reports:
// PROJECT_BOOTSTRAP_USER_LANGUAGE=ko, PROJECT_BOOTSTRAP_USER_LANGUAGE=en,
// PROJECT_BOOTSTRAP_USER_LANGUAGE=auto, PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE.
// agent running project-bootstrap-preflight.sh sets PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE from the current user message.
// PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR, PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어.
// fallback_reason: "missing_current_user_language_hint"
// fallback_reason: "unsupported_requested_language"
// user_summary.language.requested, user_summary.language.current_user_hint,
// user_summary.language.selected, user_summary.language.fallback_reason.
// Korean generated output includes: ## 도움이 필요합니다; ### 현재 상태;
// ### 이미 확인한 내용; ### 제가 다음에 할 수 있는 일;
// ### 사용자에게 필요한 최소 작업; ### 채팅으로 보내지 마세요;
// GitHub 연결이 필요합니다.
// full blocker matrix; repo/managed path; CLI/runtime; package-manager;
// pnpm-pin-mismatch; package manager mismatch; package.json; pnpm-lock.yaml;
// corepack --version; pnpm --version; pnpm@9.15.9; conditional login/auth;
// GitHub auth; secure credentials/API/Railway; public non-secret app config;
// nested pod role report; raw blocker IDs are support-only;
// support-only raw blockers; Raw blockers must appear only in support details and JSON.
// browser-use can open or guide the login surface; user only signs in, approves, or enters credentials in the real login surface.
function normalizeLanguageValue(value) {
  return String(value || '').trim().toLowerCase();
}

function isSecretLikeLanguageHint(value) {
  return /(?:token|password|secret|credential|bearer|private[_-]?key|database_url|ghp_|github_pat_|-----begin)/i.test(value);
}

function sanitizeCurrentLanguageHint(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (isSecretLikeLanguageHint(raw)) return '[redacted_current_user_language_hint]';
  const normalized = normalizeLanguageValue(raw);
  if (normalized === 'ko' || normalized === 'ko-kr' || normalized === 'korean' || raw === '한국어') return raw;
  if (normalized === 'en' || normalized === 'en-us' || normalized === 'english') return raw;
  return '[unsupported_current_user_language_hint]';
}

function selectUserLanguage(requestedRaw, currentHintRaw) {
  const requested = String(requestedRaw || 'auto').trim() || 'auto';
  const rawCurrentUserHint = String(currentHintRaw || '').trim();
  const currentUserHint = sanitizeCurrentLanguageHint(rawCurrentUserHint);
  const normalizedRequested = normalizeLanguageValue(requested);
  const normalizedHint = normalizeLanguageValue(rawCurrentUserHint);
  if (normalizedRequested === 'ko') {
    return { requested, current_user_hint: currentUserHint, selected: 'ko', fallback_reason: null };
  }
  if (normalizedRequested === 'en') {
    return { requested, current_user_hint: currentUserHint, selected: 'en', fallback_reason: null };
  }
  if (normalizedRequested && normalizedRequested !== 'auto') {
    return { requested, current_user_hint: currentUserHint, selected: 'en', fallback_reason: 'unsupported_requested_language' };
  }
  if (!normalizedHint || currentUserHint.startsWith('[')) {
    return { requested, current_user_hint: currentUserHint, selected: 'en', fallback_reason: 'missing_current_user_language_hint' };
  }
  if (normalizedHint === 'ko' || normalizedHint === 'ko-kr' || normalizedHint === 'korean' || rawCurrentUserHint === '한국어') {
    return { requested, current_user_hint: currentUserHint, selected: 'ko', fallback_reason: null };
  }
  if (normalizedHint === 'en' || normalizedHint === 'en-us' || normalizedHint === 'english') {
    return { requested, current_user_hint: currentUserHint, selected: 'en', fallback_reason: null };
  }
  return { requested, current_user_hint: currentUserHint, selected: 'en', fallback_reason: 'missing_current_user_language_hint' };
}

const userLanguage = selectUserLanguage(userLanguageRequestedRaw, currentUserLanguageHintRaw);

function buildBlockerContext() {
  const nestedBlockers = new Set(podRoleBootstrapNestedReport.blockers);
  const blockerSet = new Set(blockers);
  const supportBlockers = blockers
    .concat(podRoleBootstrapNestedReport.blockers)
    .filter((blocker) => blocker !== 'codex-preflight --pod reported blockers');
  const allBlockers = new Set(supportBlockers);
  const hasAny = (predicate) => supportBlockers.some(predicate);
  const hasText = (text) => supportBlockers.some((blocker) => blocker.includes(text));
  const hasPodRoleBlocked = blockers.includes('pod-role-bootstrap blocked');
  const hasGitIdentityMissing = nestedBlockers.has('git-identity-missing');
  const hasGithubAuthUnavailable = nestedBlockers.has('github-auth-unavailable');
  const hasRoleIdentity = hasText('missing role identity') || hasText('canonical role slug') || hasText('/workspace/IDENTITY') || hasText('WM_EXPECTED_ROLE mismatch');
  const hasManagedPath = blockerSet.has('missing registry') || blockerSet.has('missing managed path entry') || nestedBlockers.has('missing managed path entry');
  const hasMissingRepoSot = blockers.some((blocker) => blocker.startsWith('missing repo SoT file '));
  const hasMissingCodexCli = blockerSet.has('missing codex CLI');
  const missingRequiredMcps = blockers
    .filter((blocker) => blocker.startsWith('missing required MCP '))
    .map((blocker) => blocker.replace('missing required MCP ', ''));
  const hasMissingRequiredMcp = missingRequiredMcps.length > 0;
  const missingRequiredClis = blockers
    .filter((blocker) => blocker.startsWith('missing required CLI '))
    .map((blocker) => blocker.replace('missing required CLI ', ''));
  const hasMissingRequiredCli = missingRequiredClis.length > 0;
  const hasProjectEnvironmentTools = hasMissingRequiredMcp || hasMissingRequiredCli;
  const hasMissingPodSkill = hasAny((blocker) => blocker.startsWith('missing /workspace/skills/'));
  const hasPackageManager = nestedBlockers.has('pnpm-pin-mismatch') || hasAny((blocker) => /package manager/i.test(blocker));
  const hasConditionalAuth = nestedBlockers.has('conditional-auth-unavailable');
  const hasPublicAppConfig = nestedBlockers.has('public-app-config-missing');
  const hasApiRailwaySecureSource = nestedBlockers.has('api-railway-secure-source-missing');
  const hasCredentialReportBlocker = blockerSet.has('missing stitch-adc-setup report') || blockerSet.has('missing eas-robot-auth-setup report') || hasApiRailwaySecureSource;
  const hasHumanGateBlocker = hasAny((blocker) => /human-gate|live external|risk-bearing/i.test(blocker));
  const technicalBlockers = supportBlockers
    .map((blocker) => `\`${blocker}\``)
    .join(', ');
  return {
    nestedBlockers,
    allBlockers,
    hasPodRoleBlocked,
    hasGitIdentityMissing,
    hasGithubAuthUnavailable,
    hasRoleIdentity,
    hasManagedPath,
    hasMissingRepoSot,
    hasMissingCodexCli,
    missingRequiredMcps,
    hasMissingRequiredMcp,
    missingRequiredClis,
    hasMissingRequiredCli,
    hasProjectEnvironmentTools,
    hasMissingPodSkill,
    hasPackageManager,
    hasConditionalAuth,
    hasPublicAppConfig,
    hasCredentialReportBlocker,
    hasHumanGateBlocker,
    technicalBlockers,
  };
}

function appendSupportDetails(lines, ctx, language) {
  const heading = language.selected === 'ko' ? '### 기술 지원 세부 정보' : '### Technical details for support';
  lines.push(
    '',
    heading,
    '',
    `- Selected language: ${language.selected}`,
  );
  if (language.fallback_reason) {
    lines.push(`- Fallback reason: ${language.fallback_reason}`);
  }
  lines.push(`- Blockers: ${ctx.technicalBlockers || 'none'}.`);
}

function buildEnglishResult(ctx, language) {
  const lines = [
    '## Action needed',
    '',
  ];

  if (ctx.hasGithubAuthUnavailable) {
    lines.push('GitHub connection is needed before I can continue.');
    lines.push('This environment is not connected to GitHub yet, so I cannot access or upload repository changes.');
    lines.push('I can use browser-use or computer-use to open or guide the login surface when possible; the user only signs in, approves, or enters credentials in the real login surface.');
    if (ctx.hasPodRoleBlocked) {
      lines.push('The setup report exists, but the project is not ready until this GitHub connection is fixed.');
    }
  } else {
    lines.push('Project bootstrap needs one more user-owned item before I can continue safely.');
    if (ctx.hasPodRoleBlocked) {
      lines.push('The setup report exists, but the project is not ready yet.');
    }
  }

  lines.push(
    '',
    '### Current state',
    '',
    '- I found one or more setup blockers that need either a public non-secret value, approved source, secure credential source, external owner help, or human gate.',
    '',
    '### What the agent already checked',
    '',
    '- The agent ran the project readiness preflight and recorded status-only local checks.',
    '- The agent checked the repo path, managed path, required skills, required MCPs, and generated report paths that are visible to this preflight.',
    '- The agent can use local CLI, MCP status checks, and browser/computer-use for safe setup; a login screen requires a human to be present for credential entry.',
  );

  if (ctx.hasPodRoleBlocked) {
    lines.push('- The agent read `/workspace/state/pod-role-bootstrap-report.json`; that report is generated by `pod-role-bootstrap` and consumed by `project-bootstrap`.');
  }
  if (ctx.hasGitIdentityMissing) {
    lines.push('- Git commit identity is still missing because no approved public name/email pair is available yet.');
  }
  if (ctx.hasGithubAuthUnavailable) {
    lines.push('- GitHub connection is still unavailable because no completed GitHub login is available in this environment.');
  }
  if (ctx.hasPackageManager) {
    lines.push('- Package manager status was checked against `package.json`, `pnpm-lock.yaml`, `corepack --version`, and `pnpm --version`; the repo pin is `pnpm@9.15.9`.');
  }
  if (ctx.hasProjectEnvironmentTools) {
    lines.push('- Missing project environment tools must be ready before project-bootstrap can pass. The required baseline includes Expo MCP, Atlassian MCP, node_repl, Playwright MCP, Railway CLI, and gcloud CLI. EAS CLI is the only baseline exception.');
    if (ctx.missingRequiredMcps.includes('node_repl')) {
      lines.push('- node_repl is mandatory and must be restored by the Codex app/plugin environment owner; I cannot create a repo-local replacement for it.');
    }
    if (ctx.missingRequiredClis.includes('railway')) {
      lines.push('- Railway CLI is mandatory. I can install it only from an approved non-secret Railway CLI installer source, then you complete Railway login in the official surface or through an approved secure token source.');
    }
    if (ctx.missingRequiredClis.includes('gcloud')) {
      lines.push('- gcloud CLI is mandatory. I can install it only from an approved non-secret gcloud CLI installer source, then you complete Google ADC login and project selection in the official surface.');
    }
  }

	  lines.push(
	    '',
	    '### What I will do after that',
	    '',
	  );
	  const nextActions = [];
	  if (ctx.hasGitIdentityMissing || ctx.hasGithubAuthUnavailable) {
	    nextActions.push('I will check the GitHub connection, set up Git to use that login after authentication works, apply the approved Git identity source if needed, rerun `pod-role-bootstrap`, and rerun `project-bootstrap` preflight.');
  }
  if (ctx.hasMissingRepoSot || ctx.hasMissingPodSkill || ctx.hasManagedPath || ctx.hasRoleIdentity) {
    nextActions.push('I will recheck the project files, required pod skills, managed path, and repo SoT, then rerun setup and preflight.');
  }
  if (ctx.hasMissingCodexCli || ctx.hasMissingRequiredMcp || ctx.hasMissingRequiredCli || ctx.hasPackageManager) {
    nextActions.push('I will rerun version checks, Codex CLI checks, MCP/CLI checks, agent-owned pinned MCP registration, setup, and project-bootstrap preflight after the approved runtime or tool-auth source exists.');
  }
  if (ctx.hasCredentialReportBlocker || ctx.hasConditionalAuth || ctx.hasPublicAppConfig) {
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
	    '### What you need to do',
	    '',
	  );

	  const userRequests = [];
	  if (ctx.hasGithubAuthUnavailable) {
	    userRequests.push('Be present for the GitHub login screen I open or guide; sign in with your GitHub account and approve the request there. Do not send GitHub tokens in chat.');
	  }
	  if (ctx.hasGitIdentityMissing) {
	    userRequests.push('Provide the Git commit author name and email to use for commits, or point me to an approved local handoff file. This is public/non-secret. I will not invent an email address.');
	  }
	  if (ctx.hasMissingRepoSot) {
	    userRequests.push('Provide the correct checkout or approved project file source for the missing project file, such as `.codex/config.toml`. Do not paste a secret-bearing config in chat.');
	  }
	  if (ctx.hasMissingPodSkill) {
	    userRequests.push('Ask the platform owner to install or refresh the exact missing pod skill artifact.');
	  }
	  if (ctx.hasMissingCodexCli) {
	    userRequests.push('Ask the platform owner for a platform owner refresh of the pod image/runtime or an approved Codex CLI artifact. Do not manually add unapproved binaries.');
	  }
	  if (ctx.hasMissingRequiredMcp) {
	    userRequests.push(`For MCPs that I can add from pinned repo config, I will do that first. For the remaining MCP/tool-auth items (${ctx.missingRequiredMcps.join(', ')}), be present for OAuth/login when needed or ask the platform owner to restore the Codex app/plugin environment. Do not install arbitrary tools. Do not use \`@latest\`.`);
	  }
	  if (ctx.hasMissingRequiredCli) {
	    if (ctx.missingRequiredClis.includes('railway')) {
	      userRequests.push('Provide or approve an approved non-secret Railway CLI installer source. After I install and recheck it, complete Railway login only in the real login surface or through an approved secure token source.');
	    }
	    if (ctx.missingRequiredClis.includes('gcloud')) {
	      userRequests.push('Provide or approve an approved non-secret gcloud CLI installer source. After I install and recheck it, complete Google ADC login and project selection only in the official gcloud/browser surface.');
	    }
	    const otherMissingClis = ctx.missingRequiredClis.filter((name) => !['railway', 'gcloud'].includes(name));
	    if (otherMissingClis.length) {
	      userRequests.push(`Ask the platform owner to provide or approve the required CLI setup for: ${otherMissingClis.join(', ')}. Use real login surfaces or approved secure sources only; do not send secrets in chat.`);
	    }
	  }
	  if (ctx.hasPackageManager) {
	    userRequests.push('Do not choose a pnpm version. Ask for platform/runtime refresh only if the pinned package-manager setup cannot run in the pod.');
	  }
	  if (ctx.hasPublicAppConfig) {
	    userRequests.push('Provide the approved public non-secret app config source. Do not send private endpoints, signing keys, tokens, or credentials.');
	  }
	  if (ctx.hasCredentialReportBlocker || ctx.hasConditionalAuth) {
	    userRequests.push('Provide an approved secure credential source through Secret, secure store, tool auth, mounted file, or human-present login. This is credential availability only, not raw secret text.');
	  }
	  if (ctx.hasHumanGateBlocker) {
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
    '### Do not send in chat',
    '',
    '- Do not send passwords, tokens, 2FA codes, recovery codes, private keys, database URLs, bearer tokens, Google ADC JSON, service account JSON, or full secret-bearing config.',
    '- I will ask only for a user-owned approval, public non-secret value, approved secure place, or human-present login when I cannot safely do that part myself.',
  );

  appendSupportDetails(lines, ctx, language);
  return lines.join('\n');
}

function buildKoreanResult(ctx, language) {
  const lines = [
    '## 도움이 필요합니다',
    '',
  ];

  if (ctx.hasGithubAuthUnavailable) {
    lines.push('GitHub 연결이 필요합니다. 이 환경은 아직 GitHub에 연결되어 있지 않아 저장소 접근이나 업로드를 계속할 수 없습니다.');
    lines.push('제가 GitHub 로그인 화면을 열어드리면, 사용자는 그 화면에서 로그인하고 승인만 해주세요. 이후 연결 확인과 재검사는 제가 처리합니다.');
  } else {
    lines.push('프로젝트 부트스트랩을 안전하게 계속하려면 사람 권한이 필요한 항목이 하나 이상 남아 있습니다.');
  }
  if (ctx.hasPodRoleBlocked) {
    lines.push('`pod-role-bootstrap` 보고서는 존재하지만 아직 준비 상태가 아니며, `project-bootstrap`이 그 상태를 프로젝트 보고서에 반영했습니다.');
  }

  lines.push(
    '',
    '### 현재 상태',
    '',
    '- 제가 로컬에서 할 수 있는 상태 확인과 비밀이 아닌 설정 점검은 먼저 수행했습니다.',
  );
  if (ctx.hasRoleIdentity) lines.push('- 역할 정보가 필요합니다. 역할은 SOUL, pod selector, handoff에서 확인되면 제가 설정해야 합니다.');
  if (ctx.hasManagedPath) lines.push('- 관리 경로 등록 상태를 확인했습니다. 알려진 repo/managed path는 제가 다시 점검하고 고칠 수 있습니다.');
  if (ctx.hasMissingRepoSot) lines.push('- 프로젝트 파일 일부가 없거나 올바른 체크아웃이 필요합니다.');
  if (ctx.hasMissingPodSkill) lines.push('- 필요한 pod skill 아티팩트가 누락되어 platform owner 확인이 필요합니다.');
  if (ctx.hasMissingCodexCli) lines.push('- Codex CLI/runtime 상태가 준비되지 않았습니다.');
  if (ctx.hasMissingRequiredMcp) lines.push(`- MCP 설정이 누락되었습니다: ${ctx.missingRequiredMcps.join(', ')}.`);
  if (ctx.hasMissingRequiredCli) lines.push(`- 프로젝트 환경 도구가 누락되었습니다: ${ctx.missingRequiredClis.join(', ')}. EAS CLI만 기본 예외입니다.`);
  if (ctx.missingRequiredMcps.includes('node_repl')) {
    lines.push('- node_repl은 필수입니다. Codex app/plugin environment 소유자가 복구/활성화해야 하며, 제가 repo-local 대체 경로를 만들면 안 됩니다.');
  }
  if (ctx.missingRequiredClis.includes('railway')) {
    lines.push('- Railway CLI는 필수입니다. 승인된 비밀값 없는 Railway CLI installer source가 있으면 제가 설치와 재확인을 진행하고, 로그인은 공식 화면/승인된 secure token source에서만 진행합니다.');
  }
  if (ctx.missingRequiredClis.includes('gcloud')) {
    lines.push('- gcloud CLI는 필수입니다. 승인된 비밀값 없는 gcloud CLI installer source가 있으면 제가 설치와 재확인을 진행하고, ADC 로그인과 프로젝트 선택은 공식 gcloud/browser 화면에서만 진행합니다.');
  }
  if (ctx.hasPackageManager) lines.push('- package-manager 상태를 확인했습니다. repo SoT는 `package.json`과 `pnpm-lock.yaml`이며 pin은 `pnpm@9.15.9`입니다.');
  if (ctx.hasPublicAppConfig) lines.push('- 공개 앱 설정(public non-secret app config) 출처가 필요합니다.');
  if (ctx.hasCredentialReportBlocker || ctx.hasConditionalAuth) lines.push('- 보안 credential source 또는 conditional login/auth 준비가 필요합니다.');
  if (ctx.hasHumanGateBlocker) lines.push('- `human-gate/v1` 승인이 필요한 외부/위험 작업이 포함되어 있습니다.');

  lines.push(
    '',
    '### 이미 확인한 내용',
    '',
    '- repo path, 관리 경로, 프로젝트 파일, pod skill, Codex CLI, MCP, 생성 보고서 경로를 상태값으로 확인했습니다.',
    '- GitHub auth, Git identity, package manager mismatch, MCP/CLI, 조건부 인증, 공개 앱 설정, API/Railway 보안 소스, human-gate 상태를 비밀값 없이 분류했습니다.',
  );
  if (ctx.hasPackageManager) {
    lines.push('- `package.json`, `pnpm-lock.yaml`, `corepack --version`, `pnpm --version`를 기준으로 package-manager 상태를 확인합니다.');
  }
  if (ctx.hasPodRoleBlocked) {
    lines.push('- nested pod role report(`/workspace/state/pod-role-bootstrap-report.json`)를 읽었습니다.');
  }

  lines.push(
    '',
    '### 제가 다음에 할 수 있는 일',
    '',
  );
  const nextActions = [];
  if (ctx.hasRoleIdentity || ctx.hasManagedPath || ctx.hasMissingRepoSot || ctx.hasMissingPodSkill) {
    nextActions.push('역할, 관리 경로, 프로젝트 파일, pod skill 상태를 다시 확인하고 가능한 비밀 없는 설정은 제가 적용한 뒤 preflight를 다시 실행하겠습니다.');
  }
  if (ctx.hasGithubAuthUnavailable || ctx.hasGitIdentityMissing) {
    nextActions.push('GitHub 연결 상태를 확인하고, 인증이 끝난 뒤 `gh auth setup-git` 및 승인된 Git identity 적용을 진행하겠습니다.');
  }
  if (ctx.hasMissingCodexCli || ctx.hasMissingRequiredMcp || ctx.hasMissingRequiredCli || ctx.hasPackageManager) {
    nextActions.push('Codex CLI/runtime, MCP/CLI, package-manager 버전 확인과 가능한 pinned MCP 등록을 다시 실행하겠습니다. 사용자에게 pnpm 버전을 고르게 하지 않습니다.');
  }
  if (ctx.hasCredentialReportBlocker || ctx.hasConditionalAuth || ctx.hasPublicAppConfig) {
    nextActions.push('승인된 source가 준비되면 redacted status-only setup report를 다시 만들고 비밀값 없이 다음 단계를 진행하겠습니다.');
  }
  if (nextActions.length === 0) {
    nextActions.push('필요한 입력이 준비되면 관련 setup과 `project-bootstrap` preflight를 다시 실행하겠습니다.');
  }
  for (const action of nextActions) lines.push(`- ${action}`);

  lines.push(
    '',
    '### 사용자에게 필요한 최소 작업',
    '',
  );
  const userRequests = [];
  if (ctx.hasGithubAuthUnavailable) {
    userRequests.push('제가 GitHub 로그인 화면을 열어드리면, 사용자는 그 화면에서 로그인하고 승인만 해주세요. 이후 연결 확인과 재검사는 제가 처리합니다. 토큰은 채팅으로 보내지 마세요.');
  }
  if (ctx.hasGitIdentityMissing) {
    userRequests.push('원하는 commit 이름/이메일이 있으면 알려주세요. 없으면 승인된 GitHub 계정 기준으로 설정 가능한지 확인하겠습니다. 제가 임의로 이메일을 만들지는 않습니다.');
  }
  if (ctx.hasMissingRepoSot) {
    userRequests.push('누락된 프로젝트 파일의 올바른 checkout 또는 승인된 파일 source를 제공해 주세요.');
  }
  if (ctx.hasMissingPodSkill || ctx.hasMissingCodexCli || ctx.hasMissingRequiredMcp || ctx.hasPackageManager) {
    userRequests.push('제가 pinned repo config로 추가할 수 있는 MCP는 먼저 처리하겠습니다. 그래도 남는 MCP/tool-auth, node_repl 앱 환경 또는 `pnpm@9.15.9` 기반 package-manager setup은 platform owner refresh나 실제 로그인 화면 승인이 필요합니다.');
  }
  if (ctx.hasMissingRequiredCli) {
    if (ctx.missingRequiredClis.includes('railway')) {
      userRequests.push('승인된 비밀값 없는 Railway CLI installer source만 제공/승인해 주세요. 설치와 재확인은 제가 하고, Railway 로그인은 공식 화면 또는 승인된 secure token source에서만 진행합니다.');
    }
    if (ctx.missingRequiredClis.includes('gcloud')) {
      userRequests.push('승인된 비밀값 없는 gcloud CLI installer source만 제공/승인해 주세요. 설치와 재확인은 제가 하고, Google ADC 로그인/프로젝트 선택은 공식 gcloud/browser 화면에서만 진행합니다.');
    }
  }
  if (ctx.hasPublicAppConfig) {
    userRequests.push('공개 앱 설정 source만 제공해 주세요. 비밀 endpoint, token, signing key는 보내지 마세요.');
  }
  if (ctx.hasCredentialReportBlocker || ctx.hasConditionalAuth) {
    userRequests.push('Secret, secure store, tool auth, mounted file, human-present login 중 승인된 보안 credential source를 준비해 주세요.');
  }
  if (ctx.hasHumanGateBlocker) {
    userRequests.push('정확한 action과 evidence path가 적힌 `human-gate/v1` 결정을 연결해 주세요.');
  }
  if (userRequests.length === 0) {
    userRequests.push('지원 세부 정보에 적힌 항목에 맞는 공개 비밀 아님 값, 승인된 source, 보안 credential source, 또는 human-gate 결정을 제공해 주세요.');
  }
  for (const request of userRequests) lines.push(`- ${request}`);

  lines.push(
    '',
    '### 채팅으로 보내지 마세요',
    '',
    '- password, token, 2FA code, recovery code, private key, database URL, bearer token, Google ADC JSON, service account JSON, secret-bearing config는 채팅이나 evidence에 보내지 마세요.',
  );

  appendSupportDetails(lines, ctx, language);
  return lines.join('\n');
}

function buildUserUnderstandableResult(language) {
  const ctx = buildBlockerContext();
  return language.selected === 'ko' ? buildKoreanResult(ctx, language) : buildEnglishResult(ctx, language);
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
    buildUserUnderstandableResult(userLanguage),
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
    `- Required MCP expo: ${expoMcp}`,
    `- Required MCP atlassian: ${atlassianMcp}`,
    `- Required MCP node_repl: ${nodeReplMcp}`,
    `- Required MCP playwright: ${playwrightMcp}`,
    `- Required CLI railway: ${railwayCli}`,
    `- Required CLI gcloud: ${gcloudCli}`,
    `- EAS CLI baseline exception: ${easCli}`,
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
  user_summary: {
    language: {
      requested: userLanguage.requested,
      current_user_hint: userLanguage.current_user_hint,
      selected: userLanguage.selected,
      fallback_reason: userLanguage.fallback_reason,
    },
  },
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
      expo: expoMcp,
      atlassian: atlassianMcp,
      node_repl: nodeReplMcp,
      playwright: playwrightMcp,
    },
    baseline_exception: {
      eas_cli: 'status_only_until_eas_workflow_selected',
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
