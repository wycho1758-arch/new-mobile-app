#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
REPORT_PATH="${REPORT_PATH:-/workspace/state/pod-role-bootstrap-report.json}"
EXPECTED_PNPM_VERSION="${EXPECTED_PNPM_VERSION:-9.15.9}"
CODEX_MANAGED_PATHS="${CODEX_MANAGED_PATHS:-/workspace/CODEX_MANAGED_PATHS.md}"

redact() {
  sed -E 's/(token|key|secret|password)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

has_token_bearing_clone_url() {
  [[ "${REPO_CLONE_URL:-}" =~ ://[^/[:space:]]+@ ]] || [[ "${REPO_CLONE_URL:-}" =~ (token|password|secret|key)= ]]
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

  return 1
}

write_status_report() {
  local status="$1"
  local repo_acquisition="$2"
  local managed_path="$3"
  local preflight_status="$4"
  local blocker="$5"
  local preflight_json="${6:-}"

  node - "$REPORT_PATH" "$role" "$REPO_PATH" "$CODEX_MANAGED_PATHS" "$EXPECTED_PNPM_VERSION" "$status" "$repo_acquisition" "$managed_path" "$preflight_status" "$blocker" "$preflight_json" <<'NODE'
const fs = require('node:fs');
const [
  reportPath,
  role,
  repoPath,
  managedPathsRegistry,
  expectedPnpmVersion,
  status,
  repoAcquisition,
  managedPath,
  preflightStatus,
  blocker,
  preflightJsonPath,
] = process.argv.slice(2);

let preflight = null;
if (preflightJsonPath && fs.existsSync(preflightJsonPath)) {
  try {
    preflight = JSON.parse(fs.readFileSync(preflightJsonPath, 'utf8'));
  } catch {
    preflight = { parse_status: 'unavailable' };
  }
}

const report = {
  schema: 'pod-role-bootstrap/v1',
  status,
  role,
  repo_path: repoPath,
  repo_acquisition: repoAcquisition,
  managed_path: {
    registry: managedPathsRegistry,
    status: managedPath,
  },
  package_manager: {
    expected: `pnpm@${expectedPnpmVersion}`,
    status: 'checked by bootstrap and preflight',
  },
  preflight: {
    status: preflightStatus,
    blockers: blocker ? [blocker] : [],
    result: preflight,
  },
  status_only: {
    github_auth: 'checked by gh auth status when gh is available',
    codex_managed_path: managedPath,
  },
};

fs.mkdirSync(require('node:path').dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE
}

ensure_repo_checkout() {
  if has_token_bearing_clone_url; then
    write_status_report "blocked" "token_bearing_or_rejected" "not_checked" "skipped" "token-bearing REPO_CLONE_URL rejected"
    echo "pod-role-bootstrap failed: token-bearing REPO_CLONE_URL rejected" >&2
    exit 1
  fi

  if [[ -d "${REPO_PATH}" ]]; then
    printf '%s\n' "existing"
    return
  fi

  if [[ -z "${REPO_CLONE_URL:-}" ]]; then
    write_status_report "blocked" "missing REPO_CLONE_URL" "not_checked" "skipped" "repo path missing and REPO_CLONE_URL is not configured"
    echo "pod-role-bootstrap failed: repo path missing and REPO_CLONE_URL is not configured" >&2
    exit 1
  fi

  if command -v gh >/dev/null 2>&1; then
    gh auth status >/dev/null 2> >(redact >&2) || true
  fi

  mkdir -p "$(dirname "${REPO_PATH}")"
  git clone "${REPO_CLONE_URL}" "${REPO_PATH}" 2> >(redact >&2)
  printf '%s\n' "cloned"
}

check_managed_path() {
  if [[ ! -r "${CODEX_MANAGED_PATHS}" ]]; then
    write_status_report "blocked" "${repo_acquisition}" "missing registry" "skipped" "missing ${CODEX_MANAGED_PATHS}"
    echo "pod-role-bootstrap failed: missing ${CODEX_MANAGED_PATHS}" >&2
    exit 1
  fi

  managed_path="${REPO_PATH%/}/"
  if grep -Fx -- "- ${managed_path}" "${CODEX_MANAGED_PATHS}" >/dev/null 2>&1; then
    printf '%s\n' "present"
    return
  fi

  write_status_report "blocked" "${repo_acquisition}" "missing managed path entry" "skipped" "missing managed path entry for ${REPO_PATH}"
  echo "pod-role-bootstrap failed: missing managed path entry in ${CODEX_MANAGED_PATHS}" >&2
  exit 1
}

role="$(resolve_role || true)"
if [[ -z "${role}" ]]; then
  echo "pod-role-bootstrap failed: missing role identity" >&2
  exit 1
fi

if [[ -n "${WM_EXPECTED_ROLE:-}" && "${role}" != "${WM_EXPECTED_ROLE}" ]]; then
  echo "pod-role-bootstrap failed: role identity mismatch" >&2
  exit 1
fi

mkdir -p "$(dirname "${REPORT_PATH}")"

repo_acquisition="$(ensure_repo_checkout)"
managed_path="$(check_managed_path)"

cd "${REPO_PATH}"

corepack enable
corepack prepare "pnpm@${EXPECTED_PNPM_VERSION}" --activate
pnpm install --frozen-lockfile

preflight_tmp="$(mktemp)"
if node scripts/codex-preflight.mjs --pod --json >"${preflight_tmp}" 2> >(redact >&2); then
  write_status_report "ready" "${repo_acquisition}" "${managed_path}" "available" "" "${preflight_tmp}"
  rm -f "${preflight_tmp}"
else
  status=$?
  write_status_report "blocked" "${repo_acquisition}" "${managed_path}" "blocked" "codex-preflight --pod reported blockers" "${preflight_tmp}" || true
  rm -f "${preflight_tmp}"
  echo "pod-role-bootstrap failed: codex-preflight --pod reported blockers; report=${REPORT_PATH}" >&2
  exit "${status}"
fi

echo "pod-role-bootstrap complete: role=${role} report=${REPORT_PATH}"
