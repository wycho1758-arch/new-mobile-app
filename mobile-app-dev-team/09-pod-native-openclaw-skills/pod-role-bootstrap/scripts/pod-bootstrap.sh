#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${REPO_PATH:-/workspace/new-mobile-app}"
REPORT_PATH="${REPORT_PATH:-/workspace/state/pod-role-bootstrap-report.json}"
EXPECTED_PNPM_VERSION="${EXPECTED_PNPM_VERSION:-9.15.9}"

redact() {
  sed -E 's/(token|key|secret|password)([=: ][^ ]+)/\1=***REDACTED***/Ig'
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

role="$(resolve_role || true)"
if [[ -z "${role}" ]]; then
  echo "pod-role-bootstrap failed: missing role identity" >&2
  exit 1
fi

if [[ -n "${WM_EXPECTED_ROLE:-}" && "${role}" != "${WM_EXPECTED_ROLE}" ]]; then
  echo "pod-role-bootstrap failed: role identity mismatch" >&2
  exit 1
fi

if [[ ! -d "${REPO_PATH}" ]]; then
  echo "pod-role-bootstrap failed: repo path missing: ${REPO_PATH}" >&2
  exit 1
fi

mkdir -p "$(dirname "${REPORT_PATH}")"

cd "${REPO_PATH}"

corepack enable
corepack prepare "pnpm@${EXPECTED_PNPM_VERSION}" --activate
pnpm install --frozen-lockfile

preflight_tmp="$(mktemp)"
if node scripts/codex-preflight.mjs --pod --json >"${preflight_tmp}" 2> >(redact >&2); then
  cp "${preflight_tmp}" "${REPORT_PATH}"
  rm -f "${preflight_tmp}"
else
  status=$?
  cp "${preflight_tmp}" "${REPORT_PATH}" || true
  rm -f "${preflight_tmp}"
  echo "pod-role-bootstrap failed: codex-preflight --pod reported blockers; report=${REPORT_PATH}" >&2
  exit "${status}"
fi

echo "pod-role-bootstrap complete: role=${role} report=${REPORT_PATH}"
