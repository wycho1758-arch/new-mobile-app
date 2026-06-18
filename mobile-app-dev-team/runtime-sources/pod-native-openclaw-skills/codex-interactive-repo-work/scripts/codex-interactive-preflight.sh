#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${CODEX_INTERACTIVE_REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
WRAPPER_PATH="${CODEX_INTERACTIVE_WRAPPER_PATH:-/workspace/codex-hooks/codex-run}"
CONTRACT_PATH="${CODEX_INTERACTIVE_CONTRACT_PATH:-/workspace/skills/codex-interactive-repo-work/SKILL.md}"
REPORT_PATH="${CODEX_INTERACTIVE_PREFLIGHT_REPORT_PATH:-/workspace/state/codex-interactive-repo-work-preflight.json}"

redact() {
  sed -E 's/(token|key|secret|password|credential)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

status_for_file() {
  local path="$1"
  if [[ -f "${path}" && -r "${path}" ]]; then
    printf '%s\n' "present"
  elif [[ -e "${path}" ]]; then
    printf '%s\n' "unreadable"
  else
    printf '%s\n' "missing"
  fi
}

status_for_executable() {
  local path="$1"
  if [[ -x "${path}" ]]; then
    printf '%s\n' "available"
  elif [[ -e "${path}" ]]; then
    printf '%s\n' "not_executable"
  else
    printf '%s\n' "missing"
  fi
}

repo_status="missing"
if [[ -d "${REPO_PATH}/.git" ]]; then
  repo_status="present"
elif [[ -d "${REPO_PATH}" ]]; then
  repo_status="not_git_checkout"
fi

codex_status="missing"
if command -v codex >/dev/null 2>&1; then
  codex_status="available"
fi

wrapper_status="$(status_for_executable "${WRAPPER_PATH}")"
contract_status="$(status_for_file "${CONTRACT_PATH}")"

launcher_preference="/workspace/codex-hooks/codex-run"
launcher_required="blocked"
wrapper_fallback_reason=""
if [[ "${wrapper_status}" == "available" ]]; then
  launcher_required="${WRAPPER_PATH}"
elif [[ "${codex_status}" == "available" ]]; then
  launcher_required="codex"
  wrapper_fallback_reason="wrapper_${wrapper_status}"
fi

blockers=()
if [[ "${repo_status}" != "present" ]]; then
  blockers+=("managed repo missing or not a git checkout")
fi
if [[ "${codex_status}" != "available" ]]; then
  blockers+=("missing codex CLI")
fi
if [[ "${contract_status}" != "present" ]]; then
  blockers+=("missing /workspace/skills/codex-interactive-repo-work")
fi
if [[ "${launcher_required}" == "blocked" ]]; then
  blockers+=("no compatible Codex launcher")
fi

status="ready"
if [[ "${#blockers[@]}" -gt 0 ]]; then
  status="blocked"
fi

mkdir -p "$(dirname "${REPORT_PATH}")"
node - "$REPORT_PATH" "$status" "$REPO_PATH" "$repo_status" "$WRAPPER_PATH" "$wrapper_status" "$codex_status" "$CONTRACT_PATH" "$contract_status" "$launcher_preference" "$launcher_required" "$wrapper_fallback_reason" "${blockers[@]}" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const [
  reportPath,
  status,
  repoPath,
  repoStatus,
  wrapperPath,
  wrapperStatus,
  codexStatus,
  contractPath,
  contractStatus,
  launcherPreference,
  launcherRequired,
  wrapperFallbackReason,
  ...blockers
] = process.argv.slice(2);

const report = {
  schema: 'codex-interactive-repo-work/v1',
  status,
  blockers,
  managed_repo: {
    root: repoPath,
    status: repoStatus,
  },
  launcher: {
    preference: launcherPreference,
    wrapper_path: wrapperPath,
    wrapper_status: wrapperStatus,
    codex_cli: codexStatus,
    launcher_used_or_required: launcherRequired,
    wrapper_fallback_reason: wrapperFallbackReason || null,
  },
  contract: {
    path: contractPath,
    status: contractStatus,
  },
  safety: {
    status_only: true,
    edits_repository_files: false,
    launches_interactive_codex: false,
    contents_checked: false,
    secret_safety_statement: 'auth token values and credential contents are never printed',
    external_proof_boundary: 'local preflight does not prove live OpenClaw PTY behavior or external platform state',
  },
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE

printf 'codex-interactive-repo-work preflight %s: report=%s\n' "${status}" "${REPORT_PATH}" | redact

if [[ "${status}" != "ready" ]]; then
  exit 1
fi
