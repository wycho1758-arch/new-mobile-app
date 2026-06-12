#!/usr/bin/env bash
set -euo pipefail

REPORT_PATH="${REPORT_PATH:-/workspace/state/eas-robot-auth-setup-report.json}"

redact() {
  sed -E 's/(token|key|secret|password)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

command_status() {
  if command -v "$1" >/dev/null 2>&1; then
    printf 'available'
  else
    printf 'missing'
  fi
}

mkdir -p "$(dirname "${REPORT_PATH}")"

eas_cli="$(command_status eas)"
expo_token_status="missing"
if [[ -n "${EXPO_TOKEN:-}" ]]; then
  expo_token_status="present"
fi

whoami_status="skipped"
if [[ "${eas_cli}" == "available" ]]; then
  if eas whoami >/dev/null 2> >(redact >&2); then
    whoami_status="available"
  else
    whoami_status="blocked"
  fi
fi

node - "$REPORT_PATH" "$eas_cli" "$expo_token_status" "$whoami_status" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const [reportPath, easCli, expoTokenStatus, whoamiStatus] = process.argv.slice(2);
const report = {
  schema: 'eas-robot-auth-setup/v1',
  status: easCli === 'available' && expoTokenStatus === 'present' ? 'ready_for_human_gate' : 'blocked',
  checks: {
    eas_cli: easCli,
    expo_token: expoTokenStatus,
    eas_whoami: whoamiStatus,
  },
  live_use: {
    requires: 'human-gate/v1',
    ingest: 'scripts/ingest-eas-evidence.mjs',
    output_schema: 'eas-evidence/v1',
  },
  reporting: 'status only; no auth token values',
};
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE

echo "eas-robot-auth-setup complete: report=${REPORT_PATH}"
