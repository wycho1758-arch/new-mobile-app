# EAS Robot Auth Setup Report Template

Use this template for `/workspace/state/eas-robot-auth-setup-report.json` or
for a human-readable summary derived from it.

```json
{
  "schema": "eas-robot-auth-setup/v1",
  "status": "ready_for_human_gate | blocked",
  "checks": {
    "eas_cli": "available | missing",
    "expo_token": "present | missing",
    "eas_whoami": "available | blocked | skipped"
  },
  "live_use": {
    "requires": "human-gate/v1",
    "ingest": "scripts/ingest-eas-evidence.mjs",
    "output_schema": "eas-evidence/v1"
  },
  "reporting": "status only; no auth token values"
}
```

Do not include auth token values, API keys, OAuth tokens, refresh tokens,
passwords, full auth JSON, or full secret-bearing config contents.
