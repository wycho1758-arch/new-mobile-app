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

assert_file_contains() {
  local file="$1"
  local expected="$2"
  if ! grep -F -- "${expected}" "${file}" >/dev/null 2>&1; then
    printf 'assertion failed: expected %s to contain %s\n' "${file}" "${expected}" >&2
    exit 1
  fi
}

assert_file_not_contains() {
  local file="$1"
  local unexpected="$2"
  if grep -F -- "${unexpected}" "${file}" >/dev/null 2>&1; then
    printf 'assertion failed: expected %s not to contain %s\n' "${file}" "${unexpected}" >&2
    exit 1
  fi
}

assert_action_section_not_contains() {
  local file="$1"
  local unexpected="$2"
  node - "${file}" "${unexpected}" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const unexpected = process.argv[3];
const body = fs.readFileSync(file, 'utf8');
const start = body.indexOf('### What you need to do');
const endCandidates = [
  body.indexOf('### Do not send in chat', start + 1),
  body.indexOf('### Technical details for support', start + 1),
  body.indexOf('## Current Status Summary', start + 1),
].filter((index) => index !== -1);
const end = endCandidates.length > 0 ? Math.min(...endCandidates) : -1;
if (start === -1 || end === -1 || end <= start) {
  console.error(`assertion failed: could not find action section in ${file}`);
  process.exit(1);
}
const section = body.slice(start, end);
if (section.includes(unexpected)) {
  console.error(`assertion failed: expected action section in ${file} not to contain ${unexpected}`);
  process.exit(1);
}
NODE
}

assert_markdown_heading_body_starts_with() {
  local file="$1"
  local heading="$2"
  local expected="$3"
  node - "${file}" "${heading}" "${expected}" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const heading = process.argv[3];
const expected = process.argv[4];
const body = fs.readFileSync(file, 'utf8');
const start = body.indexOf(heading);
if (start === -1) {
  console.error(`assertion failed: could not find heading ${heading} in ${file}`);
  process.exit(1);
}
const afterHeading = body.slice(start + heading.length).split('\n').map((line) => line.trim());
const firstBodyLine = afterHeading.find((line) => line.length > 0);
if (!firstBodyLine || !firstBodyLine.startsWith(expected)) {
  console.error(`assertion failed: expected first body line after ${heading} in ${file} to start with ${expected}; got ${firstBodyLine || '<none>'}`);
  process.exit(1);
}
NODE
}

assert_text_order() {
  local file="$1"
  local first="$2"
  local second="$3"
  node - "${file}" "${first}" "${second}" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const first = process.argv[3];
const second = process.argv[4];
const body = fs.readFileSync(file, 'utf8');
const firstIndex = body.indexOf(first);
const secondIndex = body.indexOf(second);
if (firstIndex === -1 || secondIndex === -1 || firstIndex >= secondIndex) {
  console.error(`assertion failed: expected ${first} to appear before ${second} in ${file}`);
  process.exit(1);
}
NODE
}

assert_primary_guidance_not_contains() {
  local file="$1"
  local unexpected="$2"
  node - "${file}" "${unexpected}" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const unexpected = process.argv[3];
const body = fs.readFileSync(file, 'utf8');
const start = body.indexOf('## Action needed');
const support = body.indexOf('### Technical details for support');
const detected = body.indexOf('## Detected Blockers');
const endCandidates = [support, detected].filter((index) => index !== -1);
const end = endCandidates.length > 0 ? Math.min(...endCandidates) : -1;
if (start === -1 || end === -1 || end <= start) {
  console.error(`assertion failed: could not find primary guidance bounds in ${file}`);
  process.exit(1);
}
const section = body.slice(start, end);
if (section.includes(unexpected)) {
  console.error(`assertion failed: expected primary guidance in ${file} not to contain ${unexpected}`);
  process.exit(1);
}
NODE
}

assert_korean_primary_guidance_not_contains() {
  local file="$1"
  local unexpected="$2"
  node - "${file}" "${unexpected}" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const unexpected = process.argv[3];
const body = fs.readFileSync(file, 'utf8');
const starts = [
  body.indexOf('## 도움이 필요합니다'),
  body.indexOf('## 조치가 필요합니다'),
].filter((index) => index !== -1);
const supportStarts = [
  body.indexOf('### 기술 지원 세부 정보'),
  body.indexOf('### 지원용 기술 세부 정보'),
  body.indexOf('### Technical details for support'),
  body.indexOf('## Current Status Summary'),
].filter((index) => index !== -1);
if (starts.length === 0 || supportStarts.length === 0) {
  console.error(`assertion failed: could not find Korean primary guidance bounds in ${file}`);
  process.exit(1);
}
const start = Math.min(...starts);
const end = Math.min(...supportStarts.filter((index) => index > start));
if (!Number.isFinite(end) || end <= start) {
  console.error(`assertion failed: invalid Korean primary guidance bounds in ${file}`);
  process.exit(1);
}
const section = body.slice(start, end);
if (section.includes(unexpected)) {
  console.error(`assertion failed: expected Korean primary guidance in ${file} not to contain ${unexpected}`);
  process.exit(1);
}
NODE
}

assert_primary_guidance_has_korean_text() {
  local file="$1"
  node - "${file}" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const body = fs.readFileSync(file, 'utf8');
const koreanMatches = body.match(/[가-힣]/g) || [];
if (koreanMatches.length < 40) {
  console.error(`assertion failed: expected first-class Korean generated guidance in ${file}`);
  process.exit(1);
}
NODE
}

assert_report_blockers_support_only() {
  local file="$1"
  local report="$2"
  node - "${file}" "${report}" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
const reportFile = process.argv[3];
const body = fs.readFileSync(file, 'utf8');
const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
const starts = [
  body.indexOf('## 도움이 필요합니다'),
  body.indexOf('## Action needed'),
].filter((index) => index !== -1);
const supportStarts = [
  body.indexOf('### 기술 지원 세부 정보'),
  body.indexOf('### Technical details for support'),
  body.indexOf('## Current Status Summary'),
].filter((index) => index !== -1);
if (starts.length === 0 || supportStarts.length === 0) {
  console.error(`assertion failed: could not find primary/support guidance bounds in ${file}`);
  process.exit(1);
}
const start = Math.min(...starts);
const end = Math.min(...supportStarts.filter((index) => index > start));
if (!Number.isFinite(end) || end <= start) {
  console.error(`assertion failed: invalid primary/support guidance bounds in ${file}`);
  process.exit(1);
}
const primary = body.slice(start, end);
const support = body.slice(end);
const rawBlockers = new Set();
for (const blocker of report.blockers || []) {
  if (typeof blocker === 'string' && blocker) rawBlockers.add(blocker);
}
for (const blocker of report.nested_reports?.pod_role_bootstrap?.blockers || []) {
  if (typeof blocker === 'string' && blocker) rawBlockers.add(blocker);
}
for (const blocker of rawBlockers) {
  if (primary.includes(blocker)) {
    console.error(`assertion failed: raw blocker ${blocker} appeared in primary guidance`);
    process.exit(1);
  }
  if (!support.includes(blocker)) {
    console.error(`assertion failed: raw blocker ${blocker} missing from support details`);
    process.exit(1);
  }
}
NODE
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
	  PROJECT_BOOTSTRAP_USER_LANGUAGE="auto" \
	  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="en-US" \
	  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
	  WM_ROLE="product-planning" \
	  WM_EXPECTED_ROLE="product-planning" \
	  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

	  assert_json_field "${report_path}" "r.status === 'ready_for_bootstrap'"
	  assert_json_field "${report_path}" "Array.isArray(r.blockers) && r.blockers.length === 0"
	  assert_json_field "${report_path}" "r.user_summary.language.requested === 'auto'"
	  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === 'en-US'"
	  assert_json_field "${report_path}" "r.user_summary.language.selected === 'en'"
	  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === null"
	  assert_json_field "${report_path}" "r.role.normalized === 'product-planning' && r.role.requires_stitch === false && r.role.requires_eas === false"
	  assert_json_field "${report_path}" "r.cli.railway === 'missing' && r.cli.gcloud === 'missing' && r.cli.eas === 'missing'"
	  assert_json_field "${report_path}" "r.reports.pod_role_bootstrap === 'missing'"
}

case_project_preflight_blocks_on_pod_role_report_blocked() {
  local tmpdir repo_path report_path pod_report_path blockers_md_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  pod_report_path="${tmpdir}/state/pod-role-bootstrap-report.json"
  blockers_md_path="${tmpdir}/state/project-bootstrap-blockers.md"
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
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${blockers_md_path}" \
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
  assert_file_contains "${blockers_md_path}" "## Action needed"
  assert_markdown_heading_body_starts_with "${blockers_md_path}" "## Action needed" "GitHub connection is needed"
  assert_file_contains "${blockers_md_path}" "GitHub connection is needed"
  assert_file_contains "${blockers_md_path}" "GitHub login screen"
  assert_file_contains "${blockers_md_path}" "sign in with your GitHub account and approve"
  assert_file_contains "${blockers_md_path}" "### What you need to do"
  assert_file_contains "${blockers_md_path}" "GitHub login"
  assert_file_contains "${blockers_md_path}" "Git commit author name and email"
  assert_text_order "${blockers_md_path}" "GitHub login" "Git commit author name and email"
  assert_file_contains "${blockers_md_path}" "### What I will do after that"
  assert_file_contains "${blockers_md_path}" "check the GitHub connection"
  assert_file_contains "${blockers_md_path}" "### Do not send in chat"
  assert_file_contains "${blockers_md_path}" "passwords, tokens, 2FA codes"
  assert_file_contains "${blockers_md_path}" "### Technical details for support"
  assert_file_contains "${blockers_md_path}" "github-auth-unavailable"
  assert_file_contains "${blockers_md_path}" "## Support Reference"
  assert_primary_guidance_not_contains "${blockers_md_path}" "Technical details:"
  assert_primary_guidance_not_contains "${blockers_md_path}" "github-auth-unavailable"
  assert_primary_guidance_not_contains "${blockers_md_path}" "git-identity-missing"
  assert_primary_guidance_not_contains "${blockers_md_path}" "pod-role-bootstrap blocked"
  assert_file_not_contains "${blockers_md_path}" "## Detected Blockers"
  assert_file_not_contains "${blockers_md_path}" "## Resolution Guide"
  assert_file_not_contains "${blockers_md_path}" "The pod agent cannot continue because"
  assert_file_not_contains "${blockers_md_path}" "approved artifact"
  assert_file_not_contains "${blockers_md_path}" "platform owner action"
  assert_file_not_contains "${blockers_md_path}" "nested pod role readiness result"
  assert_file_not_contains "${blockers_md_path}" "codex-preflight --pod"
  assert_file_not_contains "${blockers_md_path}" "authenticated gh state"
  assert_file_not_contains "${blockers_md_path}" "mounted/managed GitHub auth source"
  assert_file_not_contains "${blockers_md_path}" "Create /workspace/state/pod-role-bootstrap-report.json"
  assert_file_not_contains "${blockers_md_path}" 'create `/workspace/state/pod-role-bootstrap-report.json`'
}

case_project_preflight_guides_missing_sot_and_mcp() {
  local tmpdir repo_path report_path blockers_md_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  blockers_md_path="${tmpdir}/state/project-bootstrap-blockers.md"
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
  : > "${tmpdir}/mcps.txt"
  for file in \
    AGENTS.md \
    REPO_OPERATIONS.md \
    PROJECT_ENVIRONMENT.md \
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
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${blockers_md_path}" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('missing repo SoT file .codex/config.toml')"
  assert_json_field "${report_path}" "r.blockers.includes('missing required MCP mobile-mcp')"
  assert_file_contains "${blockers_md_path}" "## Action needed"
  assert_file_contains "${blockers_md_path}" "approved project file source"
  assert_file_contains "${blockers_md_path}" ".codex/config.toml"
  assert_file_contains "${blockers_md_path}" "approved MCP/tool-auth config"
  assert_file_contains "${blockers_md_path}" "Do not install arbitrary tools"
  assert_file_contains "${blockers_md_path}" 'Do not use `@latest`'
  assert_file_contains "${blockers_md_path}" "I will recheck the project files"
  assert_file_not_contains "${blockers_md_path}" 'Run `codex mcp list` yourself'
  assert_action_section_not_contains "${blockers_md_path}" 'linked `human-gate/v1` decision'
}

case_project_preflight_guides_missing_codex_cli() {
  local tmpdir repo_path report_path blockers_md_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  blockers_md_path="${tmpdir}/state/project-bootstrap-blockers.md"
  mkdir -p \
    "${tmpdir}/state" \
    "${tmpdir}/skills/project-bootstrap" \
    "${tmpdir}/skills/codex-cli-auth-setup" \
    "${tmpdir}/skills/pod-role-bootstrap" \
    "${repo_path}/.codex" \
    "${repo_path}/docs" \
    "${repo_path}/mobile-app-dev-team/09-pod-native-openclaw-skills"
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

  PATH="${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  REPO_PATH="${repo_path}" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${blockers_md_path}" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('missing codex CLI')"
  assert_file_contains "${blockers_md_path}" "platform owner refresh"
  assert_file_contains "${blockers_md_path}" "approved Codex CLI artifact"
  assert_file_contains "${blockers_md_path}" "pod image/runtime"
  assert_file_contains "${blockers_md_path}" "I will rerun version checks"
  assert_file_not_contains "${blockers_md_path}" "install Codex yourself"
}

case_project_preflight_guides_role_specific_secure_sources() {
  local tmpdir repo_path report_path blockers_md_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  blockers_md_path="${tmpdir}/state/project-bootstrap-blockers.md"
  mkdir -p \
    "${tmpdir}/bin" \
    "${tmpdir}/state" \
    "${tmpdir}/skills/project-bootstrap" \
    "${tmpdir}/skills/codex-cli-auth-setup" \
    "${tmpdir}/skills/pod-role-bootstrap" \
    "${tmpdir}/skills/stitch-adc-setup" \
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
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${blockers_md_path}" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="design" \
  WM_EXPECTED_ROLE="design" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('missing stitch-adc-setup report')"
  assert_file_contains "${blockers_md_path}" "approved secure credential source"
  assert_file_contains "${blockers_md_path}" "Secret, secure store, tool auth, mounted file, or human-present login"
  assert_file_contains "${blockers_md_path}" "## Support Reference"
  assert_file_contains "${blockers_md_path}" "Google ADC JSON"
  assert_file_contains "${blockers_md_path}" "service account JSON"
  assert_file_contains "${blockers_md_path}" "database URLs"
  assert_file_contains "${blockers_md_path}" "bearer tokens"
  assert_file_not_contains "${blockers_md_path}" 'Create `/workspace/state`'
  assert_file_not_contains "${blockers_md_path}" 'Choose `WM_ROLE`'
  assert_file_not_contains "${blockers_md_path}" 'Repair `/workspace/CODEX_MANAGED_PATHS.md` yourself'
  assert_file_not_contains "${blockers_md_path}" "Register missing required MCPs yourself"
  assert_file_not_contains "${blockers_md_path}" 'Align `pnpm-pin-mismatch` yourself'
}

case_project_preflight_korean_language_contract() {
  local tmpdir repo_path report_path pod_report_path blockers_md_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  pod_report_path="${tmpdir}/state/pod-role-bootstrap-report.json"
  blockers_md_path="${tmpdir}/state/project-bootstrap-blockers.md"
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
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${blockers_md_path}" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  PROJECT_BOOTSTRAP_USER_LANGUAGE="ko" \
  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="한국어" \
  POD_ROLE_BOOTSTRAP_REPORT="${pod_report_path}" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.user_summary.language.requested === 'ko'"
  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === '한국어'"
  assert_json_field "${report_path}" "r.user_summary.language.selected === 'ko'"
  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === null"
  assert_file_contains "${blockers_md_path}" "## 도움이 필요합니다"
  assert_file_contains "${blockers_md_path}" "### 현재 상태"
  assert_file_contains "${blockers_md_path}" "### 이미 확인한 내용"
  assert_file_contains "${blockers_md_path}" "### 제가 다음에 할 수 있는 일"
  assert_file_contains "${blockers_md_path}" "### 사용자에게 필요한 최소 작업"
  assert_file_contains "${blockers_md_path}" "### 채팅으로 보내지 마세요"
  assert_file_contains "${blockers_md_path}" "### 기술 지원 세부 정보"
  assert_file_contains "${blockers_md_path}" "Selected language: ko"
  assert_file_contains "${blockers_md_path}" "제가 GitHub 로그인 화면을 열어드리면, 사용자는 그 화면에서 로그인하고 승인만 해주세요. 이후 연결 확인과 재검사는 제가 처리합니다."
  assert_file_contains "${blockers_md_path}" "원하는 commit 이름/이메일이 있으면 알려주세요. 없으면 승인된 GitHub 계정 기준으로 설정 가능한지 확인하겠습니다."
  assert_primary_guidance_has_korean_text "${blockers_md_path}"
  assert_file_not_contains "${blockers_md_path}" "## Action needed"
  assert_file_not_contains "${blockers_md_path}" "### What you need to do"
  assert_file_not_contains "${blockers_md_path}" "### What I will do after that"
  assert_file_not_contains "${blockers_md_path}" "### Do not send in chat"
  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "github-auth-unavailable"
  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "git-identity-missing"
  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "pod-role-bootstrap blocked"
  assert_report_blockers_support_only "${blockers_md_path}" "${report_path}"
}

# full blocker matrix coverage labels for validate-team-doc:
# role identity; repo/managed path; Git identity; CLI/runtime; package-manager;
# package manager mismatch; MCP; approved MCP/tool-auth config; conditional login/auth; GitHub auth;
# secure credentials/API/Railway; public non-secret app config;
# human-gate/v1; nested pod role report.
# Language contract literals: PROJECT_BOOTSTRAP_USER_LANGUAGE=ko,
# PROJECT_BOOTSTRAP_USER_LANGUAGE=en, PROJECT_BOOTSTRAP_USER_LANGUAGE=auto,
# agent running project-bootstrap-preflight.sh sets PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE from the current user message,
# PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR, PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어,
# fallback_reason: "missing_current_user_language_hint",
# fallback_reason: "unsupported_requested_language".
# raw blocker IDs are support-only; support-only raw blockers;
# Raw blockers must appear only in support details and JSON.
# browser-use and computer-use can open or guide the login surface; user only signs in, approves, or enters credentials in the real login surface.
# Korean GitHub auth primary copy must include: GitHub 연결이 필요합니다.
case_project_preflight_korean_language_fallbacks() {
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
    "result": {
      "blockers": [
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
  PROJECT_BOOTSTRAP_USER_LANGUAGE="auto" \
  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.user_summary.language.requested === 'auto'"
  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === ''"
  assert_json_field "${report_path}" "r.user_summary.language.selected === 'en'"
  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === 'missing_current_user_language_hint'"
  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers.md" "Selected language: en"
  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers.md" "Fallback reason: missing_current_user_language_hint"

  report_path="${tmpdir}/state/project-bootstrap-report-auto-ko-language.json"
  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  REPO_PATH="${repo_path}" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers-auto-ko-language.md" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  PROJECT_BOOTSTRAP_USER_LANGUAGE="auto" \
  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="ko-KR" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.user_summary.language.requested === 'auto'"
  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === 'ko-KR'"
  assert_json_field "${report_path}" "r.user_summary.language.selected === 'ko'"
  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === null"
  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-auto-ko-language.md" "Selected language: ko"
  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-auto-ko-language.md" "제가 GitHub 로그인 화면을 열어드리면, 사용자는 그 화면에서 로그인하고 승인만 해주세요. 이후 연결 확인과 재검사는 제가 처리합니다."

  report_path="${tmpdir}/state/project-bootstrap-report-auto-en-language.json"
  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  REPO_PATH="${repo_path}" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers-auto-en-language.md" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  PROJECT_BOOTSTRAP_USER_LANGUAGE="auto" \
  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="en-US" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.user_summary.language.requested === 'auto'"
  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === 'en-US'"
  assert_json_field "${report_path}" "r.user_summary.language.selected === 'en'"
  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === null"

  report_path="${tmpdir}/state/project-bootstrap-report-en-language.json"
  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  REPO_PATH="${repo_path}" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers-en-language.md" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  PROJECT_BOOTSTRAP_USER_LANGUAGE="en" \
  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="English" \
  POD_ROLE_BOOTSTRAP_REPORT="${pod_report_path}" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.user_summary.language.requested === 'en'"
  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === 'English'"
  assert_json_field "${report_path}" "r.user_summary.language.selected === 'en'"
	  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === null"
	  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-en-language.md" "## Action needed"
	  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-en-language.md" "Selected language: en"
	  assert_text_order "${tmpdir}/state/project-bootstrap-blockers-en-language.md" "### What the agent already checked" "### What I will do after that"
	  assert_text_order "${tmpdir}/state/project-bootstrap-blockers-en-language.md" "### What I will do after that" "### What you need to do"
	  assert_file_not_contains "${tmpdir}/state/project-bootstrap-blockers-en-language.md" "## 도움이 필요합니다"

  report_path="${tmpdir}/state/project-bootstrap-report-invalid-language.json"
  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
  REPO_PATH="${repo_path}" \
  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers-invalid-language.md" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  PROJECT_BOOTSTRAP_USER_LANGUAGE="fr" \
  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="한국어" \
  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
  WM_ROLE="product-planning" \
  WM_EXPECTED_ROLE="product-planning" \
  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

  assert_json_field "${report_path}" "r.user_summary.language.requested === 'fr'"
  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === '한국어'"
  assert_json_field "${report_path}" "r.user_summary.language.selected === 'en'"
  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === 'unsupported_requested_language'"
	  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-invalid-language.md" "Selected language: en"
	  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-invalid-language.md" "Fallback reason: unsupported_requested_language"

	  report_path="${tmpdir}/state/project-bootstrap-report-invalid-alias-language.json"
	  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
	  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
	  REPO_PATH="${repo_path}" \
	  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
	  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
	  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers-invalid-alias-language.md" \
	  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
	  PROJECT_BOOTSTRAP_USER_LANGUAGE="ko-KR" \
	  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="ko-KR" \
	  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
	  WM_ROLE="product-planning" \
	  WM_EXPECTED_ROLE="product-planning" \
	  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

	  assert_json_field "${report_path}" "r.user_summary.language.requested === 'ko-KR'"
	  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === 'ko-KR'"
	  assert_json_field "${report_path}" "r.user_summary.language.selected === 'en'"
	  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === 'unsupported_requested_language'"
	  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-invalid-alias-language.md" "Selected language: en"
	  assert_file_contains "${tmpdir}/state/project-bootstrap-blockers-invalid-alias-language.md" "Fallback reason: unsupported_requested_language"

	  report_path="${tmpdir}/state/project-bootstrap-report-secret-current-language.json"
	  PATH="${tmpdir}/bin:${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
	  FAKE_CODEX_MCP_STATE="${tmpdir}/mcps.txt" \
	  REPO_PATH="${repo_path}" \
	  CODEX_MANAGED_PATHS="${tmpdir}/CODEX_MANAGED_PATHS.md" \
	  PROJECT_BOOTSTRAP_REPORT_PATH="${report_path}" \
	  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${tmpdir}/state/project-bootstrap-blockers-secret-current-language.md" \
	  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
	  PROJECT_BOOTSTRAP_USER_LANGUAGE="auto" \
	  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="token=do-not-persist" \
	  POD_ROLE_BOOTSTRAP_REPORT="${tmpdir}/state/pod-role-bootstrap-report.json" \
	  WM_ROLE="product-planning" \
	  WM_EXPECTED_ROLE="product-planning" \
	  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

	  assert_json_field "${report_path}" "r.user_summary.language.requested === 'auto'"
	  assert_json_field "${report_path}" "r.user_summary.language.current_user_hint === '[redacted_current_user_language_hint]'"
	  assert_json_field "${report_path}" "r.user_summary.language.selected === 'en'"
	  assert_json_field "${report_path}" "r.user_summary.language.fallback_reason === 'missing_current_user_language_hint'"
	  assert_file_not_contains "${report_path}" "token=do-not-persist"
	  assert_file_not_contains "${tmpdir}/state/project-bootstrap-blockers-secret-current-language.md" "token=do-not-persist"
	}

case_project_preflight_korean_full_blocker_matrix() {
  local tmpdir repo_path report_path pod_report_path blockers_md_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/project-bootstrap-report.json"
  pod_report_path="${tmpdir}/state/pod-role-bootstrap-report.json"
  blockers_md_path="${tmpdir}/state/project-bootstrap-blockers.md"
	  mkdir -p \
	    "${tmpdir}/bin" \
	    "${tmpdir}/state" \
	    "${tmpdir}/skills/project-bootstrap" \
	    "${tmpdir}/skills/pod-role-bootstrap" \
	    "${tmpdir}/skills/stitch-adc-setup" \
	    "${repo_path}/.codex" \
	    "${repo_path}/docs" \
	    "${repo_path}/mobile-app-dev-team/09-pod-native-openclaw-skills"
  make_fake_codex "${tmpdir}/bin"
  : > "${tmpdir}/mcps.txt"
  for file in \
    AGENTS.md \
    REPO_OPERATIONS.md \
    PROJECT_ENVIRONMENT.md \
    docs/TEMPLATE_VARIABLES.md \
    docs/CREDENTIALS.md \
    mobile-app-dev-team/09-pod-native-openclaw-skills/README.md
  do
    : > "${repo_path}/${file}"
  done
  cat > "${pod_report_path}" <<'JSON'
{
  "schema": "pod-role-bootstrap/v1",
  "status": "blocked",
  "preflight": {
	    "result": {
	      "blockers": [
	        { "reason": "missing role identity" },
	        { "reason": "missing managed path entry" },
	        { "reason": "missing /workspace/skills/codex-cli-auth-setup" },
	        { "reason": "pnpm-pin-mismatch" },
	        { "reason": "conditional-auth-unavailable" },
	        { "reason": "public-app-config-missing" },
        { "reason": "api-railway-secure-source-missing" },
        { "reason": "human-gate/v1 required" }
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
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="${blockers_md_path}" \
  PROJECT_BOOTSTRAP_SKILLS_ROOT="${tmpdir}/skills" \
  PROJECT_BOOTSTRAP_USER_LANGUAGE="ko" \
  PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="ko-KR" \
  POD_ROLE_BOOTSTRAP_REPORT="${pod_report_path}" \
  WM_ROLE="design" \
  WM_EXPECTED_ROLE="design" \
	  /bin/bash "${PREFLIGHT_SCRIPT}" >/dev/null

	  assert_json_field "${report_path}" "r.status === 'blocked'"
	  assert_json_field "${report_path}" "r.blockers.includes('missing registry')"
	  assert_json_field "${report_path}" "r.blockers.includes('missing /workspace/skills/codex-cli-auth-setup')"
	  assert_json_field "${report_path}" "r.user_summary.language.selected === 'ko'"
	  assert_json_field "${report_path}" "r.nested_reports.pod_role_bootstrap.blockers.includes('missing role identity')"
	  assert_json_field "${report_path}" "r.nested_reports.pod_role_bootstrap.blockers.includes('missing managed path entry')"
	  assert_json_field "${report_path}" "r.nested_reports.pod_role_bootstrap.blockers.includes('missing /workspace/skills/codex-cli-auth-setup')"
	  assert_file_contains "${blockers_md_path}" "역할"
	  assert_file_contains "${blockers_md_path}" "관리 경로"
	  assert_file_contains "${blockers_md_path}" "프로젝트 파일"
  assert_file_contains "${blockers_md_path}" "pod skill"
  assert_file_contains "${blockers_md_path}" "Codex CLI"
  assert_file_contains "${blockers_md_path}" "MCP"
  assert_file_contains "${blockers_md_path}" "pnpm@9.15.9"
  assert_file_contains "${blockers_md_path}" "package.json"
  assert_file_contains "${blockers_md_path}" "pnpm-lock.yaml"
  assert_file_contains "${blockers_md_path}" "corepack --version"
  assert_file_contains "${blockers_md_path}" "pnpm --version"
  assert_file_contains "${blockers_md_path}" "공개 앱 설정"
  assert_file_contains "${blockers_md_path}" "보안 credential source"
  assert_file_contains "${blockers_md_path}" "human-gate/v1"
  assert_file_contains "${blockers_md_path}" "사용자에게 pnpm 버전을 고르게 하지 않습니다"
  assert_file_contains "${blockers_md_path}" "Secret, secure store, tool auth, mounted file, human-present login"
	  assert_file_contains "${blockers_md_path}" "### 기술 지원 세부 정보"
	  assert_file_contains "${blockers_md_path}" "missing role identity"
	  assert_file_contains "${blockers_md_path}" "missing managed path entry"
	  assert_file_contains "${blockers_md_path}" "missing /workspace/skills/codex-cli-auth-setup"
	  assert_file_contains "${blockers_md_path}" "pnpm-pin-mismatch"
	  assert_file_contains "${blockers_md_path}" "public-app-config-missing"
	  assert_file_contains "${blockers_md_path}" "api-railway-secure-source-missing"
	  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "missing role identity"
	  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "missing managed path entry"
	  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "missing /workspace/skills/codex-cli-auth-setup"
	  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "pnpm-pin-mismatch"
	  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "public-app-config-missing"
	  assert_korean_primary_guidance_not_contains "${blockers_md_path}" "api-railway-secure-source-missing"
  assert_report_blockers_support_only "${blockers_md_path}" "${report_path}"
  assert_file_not_contains "${blockers_md_path}" "Choose a pnpm version"
  assert_file_not_contains "${blockers_md_path}" 'Align `pnpm-pin-mismatch` yourself'
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
case_project_preflight_guides_missing_sot_and_mcp
case_project_preflight_guides_missing_codex_cli
case_project_preflight_guides_role_specific_secure_sources
case_project_preflight_korean_language_contract
case_project_preflight_korean_language_fallbacks
case_project_preflight_korean_full_blocker_matrix

printf 'project-bootstrap-agent-setup smoke passed\n'
