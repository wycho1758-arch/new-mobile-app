#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${ROOT_DIR}/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh"
NODE_BIN_DIR="$(dirname "$(command -v node)")"

assert_file_contains() {
  local file="$1"
  local text="$2"
  grep -F -- "${text}" "${file}" >/dev/null
}

assert_file_not_contains() {
  local file="$1"
  local text="$2"
  ! grep -F -- "${text}" "${file}" >/dev/null
}

assert_json_field() {
  local file="$1"
  local expression="$2"
  node - "${file}" "${expression}" <<'NODE'
const fs = require('node:fs');
const [file, expression] = process.argv.slice(2);
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Function('r', `return (${expression});`)(r)) {
  console.error(`JSON assertion failed: ${expression}`);
  process.exit(1);
}
NODE
}

assert_json_no_secret_like() {
  local file="$1"
  assert_file_not_contains "${file}" "OPENAI_API_KEY="
  assert_file_not_contains "${file}" "EXPO_TOKEN="
  assert_file_not_contains "${file}" "GITHUB_TOKEN="
  assert_file_not_contains "${file}" "GOOGLE_APPLICATION_CREDENTIALS="
  assert_file_not_contains "${file}" "token=do-not-persist"
}

make_source_skill() {
  local source_root="$1"
  local slug="$2"
  mkdir -p "${source_root}/${slug}/scripts"
  cat > "${source_root}/${slug}/SKILL.md" <<EOF
---
name: ${slug}
description: Test fixture skill ${slug}.
---

# ${slug}

status only
EOF
  printf '#!/usr/bin/env bash\nset -euo pipefail\n' > "${source_root}/${slug}/scripts/${slug}.sh"
  chmod +x "${source_root}/${slug}/scripts/${slug}.sh"
}

make_source_tree() {
  local source_root="$1"
  for slug in \
    openclaw-pod-skills-sync \
    project-bootstrap \
    codex-cli-auth-setup \
    pod-role-bootstrap \
    eas-robot-auth-setup \
    stitch-adc-setup \
    codex-role-workflow \
    codex-interactive-repo-work
  do
    make_source_skill "${source_root}" "${slug}"
  done
  mkdir -p "$(dirname "${source_root}")"
  cat > "$(dirname "${source_root}")/ORGANIZATIONS.md" <<'EOF'
# ORGANIZATIONS.md - Organizations and Reporting

Guidance only.
EOF
}

run_sync() {
  local source_root="$1"
  local target_root="$2"
  local agents_path="$3"
  local report_path="$4"
  local organizations_source_path="${5:-$(dirname "${source_root}")/ORGANIZATIONS.md}"
  local workspace_organizations_path="${6:-$(dirname "${agents_path}")/ORGANIZATIONS.md}"
  PATH="${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  OPENCLAW_POD_SKILLS_SOURCE_ROOT="${source_root}" \
  OPENCLAW_POD_SKILLS_ROOT="${target_root}" \
  OPENCLAW_WORKSPACE_AGENTS_PATH="${agents_path}" \
  OPENCLAW_ORGANIZATIONS_SOURCE_PATH="${organizations_source_path}" \
  OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH="${workspace_organizations_path}" \
  OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH="${report_path}" \
  /bin/bash "${SCRIPT}" >/dev/null
}

case_copy_sync_all_pod_skills() {
  local tmpdir source_root target_root agents_path organizations_path report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  target_root="${tmpdir}/workspace/skills"
  agents_path="${tmpdir}/workspace/AGENTS.md"
  organizations_path="${tmpdir}/workspace/ORGANIZATIONS.md"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  make_source_tree "${source_root}"

  run_sync "${source_root}" "${target_root}" "${agents_path}" "${report_path}"

  [[ -f "${organizations_path}" ]]
  assert_file_contains "${organizations_path}" "Organizations and Reporting"
  for slug in \
    openclaw-pod-skills-sync \
    project-bootstrap \
    codex-cli-auth-setup \
    pod-role-bootstrap \
    eas-robot-auth-setup \
    stitch-adc-setup \
    codex-role-workflow \
    codex-interactive-repo-work
  do
    [[ -f "${target_root}/${slug}/SKILL.md" ]]
    [[ -x "${target_root}/${slug}/scripts/${slug}.sh" ]]
  done
  assert_json_field "${report_path}" "r.schema === 'openclaw-pod-skills-sync/v1'"
  assert_json_field "${report_path}" "r.status === 'completed'"
  assert_json_field "${report_path}" "r.mode === 'copy'"
  assert_json_field "${report_path}" "r.source_authority === 'repo_sot'"
  assert_json_field "${report_path}" "r.runtime_target === 'runtime_snapshot'"
  assert_json_field "${report_path}" "r.skills['project-bootstrap'].status === 'synced'"
  assert_json_field "${report_path}" "r.workspace_agents.project_workspace_defaults === 'present'"
  assert_json_field "${report_path}" "r.paths.workspace_organizations.endsWith('/workspace/ORGANIZATIONS.md')"
  assert_json_field "${report_path}" "r.workspace_organizations.status === 'copied'"
  assert_json_field "${report_path}" "r.workspace_organizations.guidance_only === true"
  assert_file_contains "${agents_path}" "git clone"
  assert_file_contains "${agents_path}" "git pull"
  assert_file_contains "${agents_path}" "openclaw-pod-skills-sync"
  assert_file_contains "${agents_path}" "project-bootstrap"
}

case_missing_source_root_blocks() {
  local tmpdir report_path
  tmpdir="$(mktemp -d)"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${tmpdir}/missing-source" "${tmpdir}/skills" "${tmpdir}/AGENTS.md" "${report_path}"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('missing source root')"
}

case_unreadable_source_root_blocks() {
  local tmpdir source_root report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  mkdir -p "${source_root}"
  chmod 000 "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${source_root}" "${tmpdir}/skills" "${tmpdir}/AGENTS.md" "${report_path}"; then
    chmod 700 "${source_root}"
    return 1
  fi
  chmod 700 "${source_root}"
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('unreadable source root')"
}

case_empty_source_root_blocks() {
  local tmpdir source_root report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  mkdir -p "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${source_root}" "${tmpdir}/skills" "${tmpdir}/AGENTS.md" "${report_path}"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('empty source root')"
}

case_missing_skill_entrypoint_blocks() {
  local tmpdir source_root report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  make_source_tree "${source_root}"
  rm -f "${source_root}/project-bootstrap/SKILL.md"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${source_root}" "${tmpdir}/skills" "${tmpdir}/AGENTS.md" "${report_path}"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('missing SKILL.md: project-bootstrap')"
}

case_missing_organizations_source_is_status_only() {
  local tmpdir source_root report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  make_source_tree "${source_root}"
  rm -f "$(dirname "${source_root}")/ORGANIZATIONS.md"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  run_sync "${source_root}" "${tmpdir}/skills" "${tmpdir}/AGENTS.md" "${report_path}"
  assert_json_field "${report_path}" "r.status === 'completed'"
  assert_json_field "${report_path}" "Array.isArray(r.blockers) && r.blockers.length === 0"
  assert_json_field "${report_path}" "r.workspace_organizations.status === 'missing'"
  assert_json_field "${report_path}" "r.skills['project-bootstrap'].status === 'synced'"
}

case_unreadable_organizations_source_is_status_only() {
  local tmpdir source_root organizations_source_path report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  make_source_tree "${source_root}"
  organizations_source_path="$(dirname "${source_root}")/ORGANIZATIONS.md"
  rm -f "${organizations_source_path}"
  mkdir -p "${organizations_source_path}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  run_sync "${source_root}" "${tmpdir}/skills" "${tmpdir}/AGENTS.md" "${report_path}"
  assert_json_field "${report_path}" "r.status === 'completed'"
  assert_json_field "${report_path}" "Array.isArray(r.blockers) && r.blockers.length === 0"
  assert_json_field "${report_path}" "r.workspace_organizations.status === 'unreadable'"
  assert_json_field "${report_path}" "r.skills['project-bootstrap'].status === 'synced'"
}

case_report_is_secret_safe() {
  local tmpdir source_root report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  make_source_tree "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  OPENAI_API_KEY="token=do-not-persist" run_sync "${source_root}" "${tmpdir}/skills" "${tmpdir}/AGENTS.md" "${report_path}"
  assert_json_no_secret_like "${report_path}"
}

case_no_symlink_runtime_snapshot() {
  local tmpdir source_root target_root report_path
  tmpdir="$(mktemp -d)"
  source_root="${tmpdir}/repo/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  target_root="${tmpdir}/workspace/skills"
  make_source_tree "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  run_sync "${source_root}" "${target_root}" "${tmpdir}/AGENTS.md" "${report_path}"
  for slug in project-bootstrap openclaw-pod-skills-sync codex-role-workflow codex-interactive-repo-work; do
    [[ ! -L "${target_root}/${slug}" ]]
  done
  assert_json_field "${report_path}" "r.mode === 'copy'"
}

case_copy_sync_all_pod_skills
case_missing_source_root_blocks
case_unreadable_source_root_blocks
case_empty_source_root_blocks
case_missing_skill_entrypoint_blocks
case_missing_organizations_source_is_status_only
case_unreadable_organizations_source_is_status_only
case_report_is_secret_safe
case_no_symlink_runtime_snapshot

printf 'openclaw-pod-skills-sync smoke passed\n'
