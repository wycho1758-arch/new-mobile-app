# Pod Role Bootstrap Report Template

Use this template for `/workspace/state/pod-role-bootstrap-report.json` or for a
human-readable summary derived from it.

```json
{
  "schema": "pod-role-bootstrap/v1",
  "status": "ready | blocked",
  "role": "<resolved WM_ROLE or /workspace/IDENTITY first line>",
  "repo_path": "/workspace/projects/Wondermove-Inc/new-mobile-app",
  "repo_acquisition": "existing | cloned | missing REPO_CLONE_URL",
  "managed_path": {
    "registry": "/workspace/CODEX_MANAGED_PATHS.md",
    "status": "present | missing registry | missing managed path entry"
  },
  "package_manager": {
    "expected": "pnpm@9.15.9",
    "status": "checked by bootstrap and preflight"
  },
  "preflight": {
    "status": "available | blocked | skipped",
    "blockers": ["status-only blocker reason"],
    "result": {}
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

The `repo_acquisition` field records whether the checkout already existed,
was cloned from explicit pod configuration, or was blocked because
`REPO_CLONE_URL` was missing. The `managed_path` field records whether
`/workspace/CODEX_MANAGED_PATHS.md` contains the required
`/workspace/projects/Wondermove-Inc/new-mobile-app/` entry.

Do not include auth token values, API keys, OAuth tokens, refresh tokens,
passwords, full auth JSON, or full secret-bearing config contents.
