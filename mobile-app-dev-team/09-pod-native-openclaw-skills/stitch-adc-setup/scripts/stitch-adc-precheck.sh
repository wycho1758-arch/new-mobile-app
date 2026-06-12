#!/usr/bin/env bash
set -euo pipefail

REPORT_PATH="${REPORT_PATH:-/workspace/state/stitch-adc-setup-report.json}"

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

mkdir -p "$(dirname "${REPORT_PATH}")"

gcloud_cli="$(command_status gcloud)"
codex_cli="$(command_status codex)"
adc_status="skipped"
project_status="missing"
stitch_mcp_status="skipped"

if [[ "${gcloud_cli}" == "available" ]]; then
  if gcloud auth application-default print-access-token >/dev/null 2> >(redact >&2); then
    adc_status="available"
  else
    adc_status="blocked"
  fi

  if gcloud config get-value project >/dev/null 2> >(redact >&2); then
    project_status="configured"
  fi
fi

if [[ "${codex_cli}" == "available" ]]; then
  if codex mcp list 2> >(redact >&2) | grep -q 'stitch'; then
    stitch_mcp_status="configured"
  else
    stitch_mcp_status="missing"
  fi
fi

node - "$REPORT_PATH" "$gcloud_cli" "$adc_status" "$project_status" "$codex_cli" "$stitch_mcp_status" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const [reportPath, gcloudCli, adcStatus, projectStatus, codexCli, stitchMcpStatus] = process.argv.slice(2);
const ready = gcloudCli === 'available' && adcStatus === 'available' && stitchMcpStatus === 'configured';
const report = {
  schema: 'stitch-adc-setup/v1',
  status: ready ? 'ready_for_design_gate' : 'blocked',
  checks: {
    gcloud_cli: gcloudCli,
    google_adc: adcStatus,
    google_cloud_project: projectStatus,
    codex_cli: codexCli,
    stitch_mcp: stitchMcpStatus,
  },
  live_use: {
    requires: 'Design workflow gates and human-gate/v1 when applicable',
    mcp_source: '.codex/config.toml',
  },
  reporting: 'status only; no auth token values',
};
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
NODE

echo "stitch-adc-setup complete: report=${REPORT_PATH}"
