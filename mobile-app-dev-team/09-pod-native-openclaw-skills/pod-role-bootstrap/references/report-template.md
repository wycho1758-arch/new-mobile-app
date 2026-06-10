# Pod Role Bootstrap Report Template

Use this template for `/workspace/state/pod-role-bootstrap-report.json` or for a
human-readable summary derived from it.

```json
{
  "schema": "pod-role-bootstrap/v1",
  "role": "<resolved WM_ROLE or /workspace/IDENTITY first line>",
  "repo_path": "/workspace/new-mobile-app",
  "package_manager": {
    "expected": "pnpm@9.15.9",
    "status": "match | mismatch"
  },
  "preflight": {
    "status": "available | blocked | skipped",
    "blockers": ["status-only blocker reason"]
  },
  "capabilities": {
    "rn_web_e2e": true,
    "native_e2e_local": false,
    "eas_cloud": "configured | missing"
  },
  "status_only": {
    "git_identity": "configured | missing",
    "github_auth": "available | missing",
    "codex_config": "present | missing",
    "codex_mcp": "available | missing",
    "chromium": "available | missing"
  }
}
```

Do not include auth token values, API keys, OAuth tokens, refresh tokens,
passwords, full auth JSON, or full secret-bearing config contents.
