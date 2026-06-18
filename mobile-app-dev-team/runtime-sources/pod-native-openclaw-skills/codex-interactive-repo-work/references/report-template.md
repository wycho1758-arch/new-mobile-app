# Codex Interactive Repo Work Report Template

Use this template for `/workspace/state/codex-interactive-repo-work-preflight.json`
or for a human-readable summary derived from it.

The preflight helper writes this status only shape:

```json
{
  "schema": "codex-interactive-repo-work/v1",
  "status": "ready | blocked",
  "blockers": ["managed repo missing or not a git checkout"],
  "managed_repo": {
    "root": "/workspace/projects/Wondermove-Inc/new-mobile-app",
    "status": "present | missing | not_git_checkout"
  },
  "launcher": {
    "preference": "/workspace/codex-hooks/codex-run",
    "wrapper_path": "/workspace/codex-hooks/codex-run",
    "wrapper_status": "available | missing | not_executable",
    "codex_cli": "available | missing",
    "launcher_used_or_required": "/workspace/codex-hooks/codex-run | codex | blocked",
    "wrapper_fallback_reason": "wrapper_missing | wrapper_not_executable | null"
  },
  "contract": {
    "path": "/workspace/skills/codex-interactive-repo-work/SKILL.md",
    "status": "present | missing | unreadable"
  },
  "safety": {
    "status_only": true,
    "edits_repository_files": false,
    "launches_interactive_codex": false,
    "contents_checked": false,
    "secret_safety_statement": "auth token values and credential contents are never printed",
    "external_proof_boundary": "local preflight does not prove live OpenClaw PTY behavior or external platform state"
  }
}
```

Do not include token values, private endpoints, private account values,
credential values, secret file contents, Google ADC JSON, service account JSON,
database URLs, bearer tokens, or private keys.
