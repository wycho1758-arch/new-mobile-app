#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${OPENCLAW_POD_SKILLS_REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
SOURCE_ROOT="${OPENCLAW_POD_SKILLS_SOURCE_ROOT:-${REPO_PATH%/}/mobile-app-dev-team/09-pod-native-openclaw-skills}"
SKILLS_ROOT="${OPENCLAW_POD_SKILLS_ROOT:-/workspace/skills}"
WORKSPACE_AGENTS_PATH="${OPENCLAW_WORKSPACE_AGENTS_PATH:-/workspace/AGENTS.md}"
REPORT_PATH="${OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH:-${REPORT_PATH:-/workspace/state/openclaw-pod-skills-sync-report.json}}"
MODE="copy"
SOURCE_AUTHORITY="repo_sot"
RUNTIME_TARGET="runtime_snapshot"

redact() {
  sed -E 's/(token|key|secret|password|credential)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

write_report() {
  local status="$1"
  local blockers_json="$2"
  local skills_json="$3"
  local workspace_agents_status="$4"

  mkdir -p "$(dirname "${REPORT_PATH}")"
  node - "$REPORT_PATH" "$status" "$MODE" "$SOURCE_AUTHORITY" "$RUNTIME_TARGET" "$SOURCE_ROOT" "$SKILLS_ROOT" "$WORKSPACE_AGENTS_PATH" "$blockers_json" "$skills_json" "$workspace_agents_status" <<'NODE'
const fs = require('node:fs');
const [
  reportPath,
  status,
  mode,
  sourceAuthority,
  runtimeTarget,
  sourceRoot,
  runtimeRoot,
  workspaceAgentsPath,
  blockersJson,
  skillsJson,
  workspaceAgentsStatus,
] = process.argv.slice(2);

const report = {
  schema: 'openclaw-pod-skills-sync/v1',
  status,
  mode,
  source_authority: sourceAuthority,
  runtime_target: runtimeTarget,
  blockers: JSON.parse(blockersJson),
  paths: {
    source_root: sourceRoot,
    runtime_root: runtimeRoot,
    workspace_agents: workspaceAgentsPath,
  },
  skills: JSON.parse(skillsJson),
  workspace_agents: {
    project_workspace_defaults: workspaceAgentsStatus,
  },
};

fs.mkdirSync(require('node:path').dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE
}

json_array() {
  node - "$@" <<'NODE'
console.log(JSON.stringify(process.argv.slice(2)));
NODE
}

write_blocked_report() {
  local blocker="$1"
  write_report "blocked" "$(json_array "${blocker}")" "{}" "missing"
}

ensure_workspace_agents_defaults() {
  local exact_rule='After `git clone` or `git pull` for WonderMove new-mobile-app, use `openclaw-pod-skills-sync` to copy-sync `mobile-app-dev-team/09-pod-native-openclaw-skills` into `/workspace/skills`, then run `project-bootstrap`.'

  mkdir -p "$(dirname "${WORKSPACE_AGENTS_PATH}")"
  touch "${WORKSPACE_AGENTS_PATH}"

  if ! grep -F "## Project Workspace Defaults" "${WORKSPACE_AGENTS_PATH}" >/dev/null 2>&1; then
    {
      if [[ -s "${WORKSPACE_AGENTS_PATH}" ]]; then
        printf '\n'
      fi
      cat <<'EOF'
## Project Workspace Defaults

Primary project repository:
- Repository: https://github.com/Wondermove-Inc/new-mobile-app.git
- Local path: /workspace/projects/Wondermove-Inc/new-mobile-app

Default behavior:
- For new-mobile-app repository work, use `/workspace/projects/Wondermove-Inc/new-mobile-app` as the working directory.
- Do not use `/workspace` root as the project repo directory. The root contains agent operating files such as AGENTS.md, SOUL.md, WORKFLOW.md, and TOOLS.md.
- Do not confuse this file with the project-local `/workspace/projects/Wondermove-Inc/new-mobile-app/AGENTS.md`.
- Before installing dependencies or system packages, report what will be installed and wait for explicit approval unless the user already approved that installation.
- After any computer/package installation, report exactly what was installed.
EOF
    } >> "${WORKSPACE_AGENTS_PATH}"
  fi

  if ! grep -F "${exact_rule}" "${WORKSPACE_AGENTS_PATH}" >/dev/null 2>&1; then
    {
      printf '\n'
      printf '%s\n' "${exact_rule}"
    } >> "${WORKSPACE_AGENTS_PATH}"
  fi
}

if [[ ! -d "${SOURCE_ROOT}" ]]; then
  write_blocked_report "missing source root"
  exit 1
fi

if [[ ! -r "${SOURCE_ROOT}" || ! -x "${SOURCE_ROOT}" ]]; then
  write_blocked_report "unreadable source root"
  exit 1
fi

source_dir_count=0
for source_dir in "${SOURCE_ROOT}"/*; do
  [[ -d "${source_dir}" ]] || continue
  source_dir_count=$((source_dir_count + 1))
  slug="$(basename "${source_dir}")"
  if [[ ! -f "${source_dir}/SKILL.md" ]]; then
    write_blocked_report "missing SKILL.md: ${slug}"
    exit 1
  fi
done

if [[ "${source_dir_count}" -eq 0 ]]; then
  write_blocked_report "empty source root"
  exit 1
fi

mkdir -p "${SKILLS_ROOT}"

declare -a synced_slugs=()
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/openclaw-pod-skills-sync.XXXXXX")"
cleanup() {
  rm -rf "${tmp_root}"
}
trap cleanup EXIT

for source_dir in "${SOURCE_ROOT}"/*; do
  [[ -d "${source_dir}" ]] || continue
  slug="$(basename "${source_dir}")"
  cp -R "${source_dir}" "${tmp_root}/${slug}" 2> >(redact >&2)
  synced_slugs+=("${slug}")
done

for slug in "${synced_slugs[@]}"; do
  rm -rf "${SKILLS_ROOT%/}/${slug}"
  cp -R "${tmp_root}/${slug}" "${SKILLS_ROOT%/}/${slug}" 2> >(redact >&2)
done

ensure_workspace_agents_defaults

skills_json="$(node - "${synced_slugs[@]}" <<'NODE'
const skills = {};
for (const slug of process.argv.slice(2).sort()) {
  skills[slug] = { status: 'synced' };
}
console.log(JSON.stringify(skills));
NODE
)"

write_report "completed" "[]" "${skills_json}" "present"
