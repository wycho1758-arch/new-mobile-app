#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${ROOT_DIR}/mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh"
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

make_role_files() {
  local repo_path="$1"
  local prefix="$2"
  local title="$3"
  mkdir -p \
    "${repo_path}/mobile-app-dev-team/runtime-sources/agents" \
    "${repo_path}/mobile-app-dev-team/runtime-sources/workflows" \
    "${repo_path}/mobile-app-dev-team/runtime-sources/heartbeat" \
    "${repo_path}/mobile-app-dev-team/runtime-sources/tools"

  cat > "${repo_path}/mobile-app-dev-team/runtime-sources/agents/${prefix}_AGENTS.md" <<EOF
# ${title} AGENTS.md Addendum

Role-specific AGENTS guidance.
EOF
  cat > "${repo_path}/mobile-app-dev-team/runtime-sources/workflows/${prefix}_WORKFLOW.md" <<EOF
# ${title} Workflow

Role-specific workflow guidance.
EOF
  cat > "${repo_path}/mobile-app-dev-team/runtime-sources/heartbeat/${prefix}_HEARTBEAT.md" <<EOF
# ${title} HEARTBEAT.md Addendum

Role-specific heartbeat guidance.
EOF
  cat > "${repo_path}/mobile-app-dev-team/runtime-sources/tools/${prefix}_TOOLS.md" <<EOF
# ${title} TOOLS.md Addendum

Role-specific tools guidance.
EOF
}

make_source_tree() {
  local source_root="$1"
  local repo_path
  repo_path="${source_root%/mobile-app-dev-team/runtime-sources/skills}"

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

  cat > "${source_root}/codex-interactive-repo-work/scripts/codex-run" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf 'codex-run fixture\n'
EOF
  chmod +x "${source_root}/codex-interactive-repo-work/scripts/codex-run"

  mkdir -p "${repo_path}/mobile-app-dev-team/runtime-sources/organizations"
  cat > "${repo_path}/mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md" <<'EOF'
# ORGANIZATIONS.md - Organizations and Reporting

Guidance only.
EOF

  make_role_files "${repo_path}" Product_Planning "Product Planning"
  make_role_files "${repo_path}" Design "Design"
  make_role_files "${repo_path}" Mobile_Architect "Mobile Architect"
  make_role_files "${repo_path}" Mobile_App_Dev "Mobile App Dev"
  make_role_files "${repo_path}" Backend_API_Integrator "Backend/API Integrator"
  make_role_files "${repo_path}" QA_Release "QA/Release"
}

run_sync() {
  local repo_path="$1"
  local source_root="$2"
  local target_root="$3"
  local workspace_root="$4"
  local report_path="$5"
  local role_slug="$6"
  local expected_role_slug="${7:-${role_slug}}"
  local legacy_root="${8:-${repo_path}/mobile-app-dev-team/runtime-sources/legacy-absent}"
  PATH="${NODE_BIN_DIR}:/usr/bin:/bin:/usr/sbin:/sbin" \
  OPENCLAW_POD_SKILLS_REPO_PATH="${repo_path}" \
  OPENCLAW_POD_SKILLS_SOURCE_ROOT="${source_root}" \
  OPENCLAW_POD_SKILLS_ROOT="${target_root}" \
  OPENCLAW_POD_SKILLS_CANDIDATE_ROOT="${repo_path}/mobile-app-dev-team/runtime-sources/skills-candidate" \
  OPENCLAW_POD_SKILLS_LEGACY_SOURCE_ROOT="${legacy_root}" \
  OPENCLAW_WORKSPACE_AGENTS_PATH="${workspace_root}/AGENTS.md" \
  OPENCLAW_WORKSPACE_WORKFLOW_PATH="${workspace_root}/WORKFLOW.md" \
  OPENCLAW_WORKSPACE_HEARTBEAT_PATH="${workspace_root}/HEARTBEAT.md" \
  OPENCLAW_WORKSPACE_TOOLS_PATH="${workspace_root}/TOOLS.md" \
  OPENCLAW_CODEX_HOOKS_ROOT="${workspace_root}/codex-hooks" \
  OPENCLAW_ORGANIZATIONS_SOURCE_PATH="${repo_path}/mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md" \
  OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH="${workspace_root}/ORGANIZATIONS.md" \
  OPENCLAW_ROLE_SLUG="${role_slug}" \
  OPENCLAW_EXPECTED_ROLE_SLUG="${expected_role_slug}" \
  OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH="${report_path}" \
  /bin/bash "${SCRIPT}" >/dev/null
}

assert_common_success_report() {
  local report_path="$1"
  local role_slug="$2"
  local prefix="$3"
  assert_json_field "${report_path}" "r.schema === 'openclaw-pod-skills-sync/v2'"
  assert_json_field "${report_path}" "r.status === 'completed'"
  assert_json_field "${report_path}" "r.mode === 'copy'"
  assert_json_field "${report_path}" "r.source_authority === 'repo_sot'"
  assert_json_field "${report_path}" "r.runtime_target === 'runtime_snapshot'"
  assert_json_field "${report_path}" "r.role.slug === '${role_slug}'"
  assert_json_field "${report_path}" "r.role.file_prefix === '${prefix}'"
  assert_json_field "${report_path}" "r.paths.source_root.includes('/runtime-sources/skills')"
  assert_json_field "${report_path}" "r.paths.candidate_root.includes('/runtime-sources/skills-candidate')"
  assert_json_field "${report_path}" "r.skills['project-bootstrap'].status === 'applied'"
  assert_json_field "${report_path}" "r.skills['project-bootstrap'].cmp === true"
  assert_json_field "${report_path}" "/^[a-f0-9]{64}$/.test(r.skills['project-bootstrap'].sha256)"
  assert_json_field "${report_path}" "r.workspace_organizations.status === 'applied'"
  assert_json_field "${report_path}" "r.workspace_organizations.guidance_only === true"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.status === 'applied'"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.cmp === true"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_workflow.cmp === true"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_heartbeat.cmp === true"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_tools.cmp === true"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.positive_role_identifier_scan === true"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.negative_known_other_role_residue_scan === true"
  assert_json_field "${report_path}" "r.codex_hooks.codex_run.status === 'applied'"
  assert_json_field "${report_path}" "r.codex_hooks.codex_run.target_path.endsWith('/codex-hooks/codex-run')"
  assert_json_field "${report_path}" "r.codex_hooks.codex_run.cmp === true"
  assert_json_field "${report_path}" "/^[a-f0-9]{64}$/.test(r.codex_hooks.codex_run.sha256)"
  assert_json_field "${report_path}" "r.categories.applied.some((entry) => entry.kind === 'codex_hook_wrapper' && entry.name === 'codex_run')"
  assert_json_field "${report_path}" "r.categories.applied.some((entry) => entry.kind === 'workspace_agents')"
  assert_json_field "${report_path}" "Array.isArray(r.categories.skipped)"
  assert_json_field "${report_path}" "Array.isArray(r.categories.missing)"
  assert_json_field "${report_path}" "Array.isArray(r.categories.blocked)"
  assert_json_field "${report_path}" "Array.isArray(r.categories.role_mismatch)"
}

case_copy_sync_product_planning_role() {
  local tmpdir repo_path source_root target_root workspace_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  target_root="${tmpdir}/workspace/skills"
  workspace_root="${tmpdir}/workspace"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  make_source_tree "${source_root}"

  run_sync "${repo_path}" "${source_root}" "${target_root}" "${workspace_root}" "${report_path}" "product-planning"

  [[ -f "${target_root}/project-bootstrap/SKILL.md" ]]
  [[ -x "${workspace_root}/codex-hooks/codex-run" ]]
  assert_file_contains "${workspace_root}/codex-hooks/codex-run" "codex-run fixture"
  [[ -f "${workspace_root}/ORGANIZATIONS.md" ]]
  assert_file_contains "${workspace_root}/AGENTS.md" "Product Planning AGENTS.md Addendum"
  assert_file_contains "${workspace_root}/WORKFLOW.md" "Product Planning Workflow"
  assert_file_contains "${workspace_root}/HEARTBEAT.md" "Product Planning HEARTBEAT.md Addendum"
  assert_file_contains "${workspace_root}/TOOLS.md" "Product Planning TOOLS.md Addendum"
  assert_file_not_contains "${workspace_root}/AGENTS.md" "QA/Release AGENTS.md Addendum"
  assert_common_success_report "${report_path}" "product-planning" "Product_Planning"
}

case_copy_sync_qa_release_role() {
  local tmpdir repo_path source_root target_root workspace_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  target_root="${tmpdir}/workspace/skills"
  workspace_root="${tmpdir}/workspace"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  make_source_tree "${source_root}"

  run_sync "${repo_path}" "${source_root}" "${target_root}" "${workspace_root}" "${report_path}" "qa-release"

  assert_file_contains "${workspace_root}/AGENTS.md" "QA/Release AGENTS.md Addendum"
  assert_file_contains "${workspace_root}/WORKFLOW.md" "QA/Release Workflow"
  assert_file_not_contains "${workspace_root}/AGENTS.md" "Product Planning AGENTS.md Addendum"
  assert_common_success_report "${report_path}" "qa-release" "QA_Release"
}

case_missing_source_root_blocks() {
  local tmpdir repo_path report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${repo_path}/mobile-app-dev-team/runtime-sources/skills" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('missing source root')"
}

case_empty_source_root_blocks() {
  local tmpdir repo_path source_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  mkdir -p "${source_root}"
  make_role_files "${repo_path}" Product_Planning "Product Planning"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('empty source root')"
}

case_missing_skill_entrypoint_blocks() {
  local tmpdir repo_path source_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  make_source_tree "${source_root}"
  rm -f "${source_root}/project-bootstrap/SKILL.md"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('missing SKILL.md: project-bootstrap')"
  assert_json_field "${report_path}" "r.categories.missing.some((entry) => entry.kind === 'skill_entrypoint')"
}

case_missing_organizations_source_is_status_only() {
  local tmpdir repo_path source_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  make_source_tree "${source_root}"
  rm -f "${repo_path}/mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning"
  assert_json_field "${report_path}" "r.status === 'completed'"
  assert_json_field "${report_path}" "Array.isArray(r.blockers) && r.blockers.length === 0"
  assert_json_field "${report_path}" "r.workspace_organizations.status === 'missing'"
  assert_json_field "${report_path}" "r.categories.skipped.some((entry) => entry.kind === 'workspace_organizations' && entry.status === 'missing')"
}

case_report_is_secret_safe() {
  local tmpdir repo_path source_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  make_source_tree "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  OPENAI_API_KEY="token=do-not-persist" run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning"
  assert_json_no_secret_like "${report_path}"
}

case_no_symlink_runtime_snapshot() {
  local tmpdir repo_path source_root target_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  target_root="${tmpdir}/workspace/skills"
  make_source_tree "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  run_sync "${repo_path}" "${source_root}" "${target_root}" "${tmpdir}/workspace" "${report_path}" "product-planning"
  for slug in project-bootstrap openclaw-pod-skills-sync codex-role-workflow codex-interactive-repo-work; do
    [[ ! -L "${target_root}/${slug}" ]]
  done
  assert_json_field "${report_path}" "r.mode === 'copy'"
}

case_missing_role_file_blocks() {
  local tmpdir repo_path source_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  make_source_tree "${source_root}"
  rm -f "${repo_path}/mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.some((entry) => entry.includes('missing role file'))"
  assert_json_field "${report_path}" "r.categories.missing.some((entry) => entry.kind === 'workspace_workflow')"
}

case_role_identifier_scan_blocks() {
  local tmpdir repo_path source_root report_path workspace_root
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  workspace_root="${tmpdir}/workspace"
  make_source_tree "${source_root}"
  cat > "${repo_path}/mobile-app-dev-team/runtime-sources/agents/Product_Planning_AGENTS.md" <<'EOF'
# Workspace AGENTS.md Addendum

Role-specific AGENTS guidance.
EOF
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${workspace_root}" "${report_path}" "product-planning"; then
    return 1
  fi
  [[ ! -f "${workspace_root}/AGENTS.md" ]]
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.some((entry) => entry.includes('role identifier scan failed'))"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.status === 'blocked'"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.positive_role_identifier_scan === false"
  assert_json_field "${report_path}" "r.categories.blocked.some((entry) => entry.kind === 'workspace_agents' && entry.positive_role_identifier_scan === false)"
}

case_other_role_residue_scan_blocks() {
  local tmpdir repo_path source_root report_path workspace_root
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  workspace_root="${tmpdir}/workspace"
  make_source_tree "${source_root}"
  cat > "${repo_path}/mobile-app-dev-team/runtime-sources/agents/Product_Planning_AGENTS.md" <<'EOF'
# Product Planning and QA/Release AGENTS.md Addendum

Role-specific AGENTS guidance.
EOF
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${workspace_root}" "${report_path}" "product-planning"; then
    return 1
  fi
  [[ ! -f "${workspace_root}/AGENTS.md" ]]
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.some((entry) => entry.includes('role identifier scan failed'))"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.status === 'blocked'"
  assert_json_field "${report_path}" "r.workspace_operating_files.workspace_agents.negative_known_other_role_residue_scan === false"
  assert_json_field "${report_path}" "r.categories.blocked.some((entry) => entry.kind === 'workspace_agents' && entry.negative_known_other_role_residue_scan === false)"
}

case_unknown_role_blocks() {
  local tmpdir repo_path source_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  make_source_tree "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('unknown role slug')"
}

case_role_mismatch_blocks() {
  local tmpdir repo_path source_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  make_source_tree "${source_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning" "qa-release"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('role mismatch')"
  assert_json_field "${report_path}" "r.categories.role_mismatch.length === 1"
}

case_candidate_path_ambiguity_blocks() {
  local tmpdir repo_path candidate_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  candidate_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills-candidate"
  make_source_tree "${candidate_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${candidate_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('candidate_path_ambiguity')"
}

case_legacy_path_detection_blocks() {
  local tmpdir repo_path source_root legacy_root report_path
  tmpdir="$(mktemp -d)"
  repo_path="${tmpdir}/repo"
  source_root="${repo_path}/mobile-app-dev-team/runtime-sources/skills"
  legacy_root="${repo_path}/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills"
  make_source_tree "${source_root}"
  mkdir -p "${legacy_root}"
  report_path="${tmpdir}/state/openclaw-pod-skills-sync-report.json"
  if run_sync "${repo_path}" "${source_root}" "${tmpdir}/skills" "${tmpdir}/workspace" "${report_path}" "product-planning" "product-planning" "${legacy_root}"; then
    return 1
  fi
  assert_json_field "${report_path}" "r.status === 'blocked'"
  assert_json_field "${report_path}" "r.blockers.includes('legacy_path_seen')"
}

case_copy_sync_product_planning_role
case_copy_sync_qa_release_role
case_missing_source_root_blocks
case_empty_source_root_blocks
case_missing_skill_entrypoint_blocks
case_missing_organizations_source_is_status_only
case_report_is_secret_safe
case_no_symlink_runtime_snapshot
case_missing_role_file_blocks
case_role_identifier_scan_blocks
case_other_role_residue_scan_blocks
case_unknown_role_blocks
case_role_mismatch_blocks
case_candidate_path_ambiguity_blocks
case_legacy_path_detection_blocks

printf 'openclaw-pod-skills-sync smoke passed\n'
