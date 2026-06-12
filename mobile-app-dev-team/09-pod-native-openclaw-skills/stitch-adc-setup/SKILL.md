---
name: stitch-adc-setup
description: Verify Google Application Default Credentials and Stitch MCP readiness inside an OpenClaw Design role pod with status-only reporting and no credential disclosure.
---

# Stitch ADC Setup

Use this pod-native OpenClaw skill when a Design role pod must verify whether
Google ADC and the repo-pinned Stitch MCP path are ready before an approved
Stitch design handoff run.

Runtime shape:

```text
/workspace/skills/stitch-adc-setup/SKILL.md
```

## Safety Rules

- Do not print auth token values, API keys, OAuth tokens, refresh tokens,
  passwords, Google ADC JSON, private keys, or full secret-bearing config
  contents.
- Report Google ADC, gcloud, project, and Stitch MCP readiness as status only.
- Do not run live Stitch generation or export from this setup check.
- Live Stitch use requires the Design workflow gates and any required
  `human-gate/v1` decision.

## Workflow

1. Run the status-only precheck.

```bash
bash /workspace/skills/stitch-adc-setup/scripts/stitch-adc-precheck.sh
```

2. Review the report under `/workspace/state/`.

The default report path is:

```text
/workspace/state/stitch-adc-setup-report.json
```

3. Use repo-local Design skills only after Product/Planning scope/evidence gates
are satisfied. Stitch MCP details are sourced from `.codex/config.toml`; do not
copy MCP versions into pod-local claims.

## Done When

- Google ADC status is reported.
- `gcloud auth application-default` status is reported without printing
  credential values.
- `codex mcp list` or equivalent Stitch MCP status is reported.
- Any live Stitch action is blocked until the required Design gates and
  `human-gate/v1` decisions are satisfied.
- The report contains status only and no auth token values.

See `references/report-template.md` for the expected report shape.
