# Stitch ADC Setup Report Template

Use this template for `/workspace/state/stitch-adc-setup-report.json` or for a
human-readable summary derived from it.

```json
{
  "schema": "stitch-adc-setup/v1",
  "status": "ready_for_design_gate | blocked",
  "checks": {
    "gcloud_cli": "available | missing",
    "google_adc": "available | blocked | skipped",
    "google_cloud_project": "configured | missing",
    "codex_cli": "available | missing",
    "stitch_mcp": "configured | missing | skipped"
  },
  "live_use": {
    "requires": "Design workflow gates and human-gate/v1 when applicable",
    "mcp_source": ".codex/config.toml"
  },
  "reporting": "status only; no auth token values"
}
```

Do not include auth token values, API keys, OAuth tokens, refresh tokens,
passwords, Google ADC JSON, private keys, full auth JSON, or full
secret-bearing config contents.
