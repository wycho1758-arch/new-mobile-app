# project-bootstrap required tool ownership final gates

Date: 2026-06-14
Checkpoint: final local verification before final reviewer

## Commands and results

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
git diff --check
```

Result: exited 0.

Key output:

```text
project-bootstrap-agent-setup smoke passed
```

Note: existing smoke cases print local `railway`/`gcloud` unauthenticated/status
messages to stderr when host CLIs are present. The command still exited 0.

```bash
pnpm run test:runtime
```

Result: exited 0.

Key output:

```text
Validated project environment drift checks.
Validated evidence hygiene artifacts.
Passed 44 hook fixture tests.
```

```bash
pnpm turbo run lint test
```

Result: exited 0.

Key output:

```text
Tasks:    7 successful, 7 total
```

```bash
pnpm run test:local-harness
```

Result: exited 0.

Key output:

```text
self-test all passed
local harness all passed
```

```bash
pnpm run validate:evidence-hygiene
```

Result: exited 0.

Key output:

```text
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

## project-bootstrap recheck after setup/docs changes

Command shape:

```bash
tmpdir=$(mktemp -d)
mkdir -p "$tmpdir/state" "$tmpdir/skills/project-bootstrap" "$tmpdir/skills/codex-cli-auth-setup" "$tmpdir/skills/pod-role-bootstrap" "$tmpdir/skills/stitch-adc-setup" "$tmpdir/skills/eas-robot-auth-setup"
printf -- '- %s/\n' "$PWD" > "$tmpdir/CODEX_MANAGED_PATHS.md"
REPO_PATH="$PWD" \
CODEX_MANAGED_PATHS="$tmpdir/CODEX_MANAGED_PATHS.md" \
PROJECT_BOOTSTRAP_SKILLS_ROOT="$tmpdir/skills" \
PROJECT_BOOTSTRAP_REPORT_PATH="$tmpdir/state/project-bootstrap-report.json" \
PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="$tmpdir/state/project-bootstrap-blockers.md" \
POD_ROLE_BOOTSTRAP_REPORT="$tmpdir/state/pod-role-bootstrap-report.json" \
WM_ROLE="product-planning" \
WM_EXPECTED_ROLE="product-planning" \
PROJECT_BOOTSTRAP_USER_LANGUAGE="auto" \
PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="ko-KR" \
bash mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

Result: preflight report generated.

Summary:

```json
{
  "status": "blocked",
  "blockers": [
    "missing required MCP mobile-mcp",
    "missing required MCP serena",
    "missing required MCP stitch",
    "missing required MCP expo",
    "missing required MCP atlassian",
    "missing required MCP node_repl",
    "missing required MCP playwright"
  ],
  "cli": {
    "codex": "available",
    "gh": "available",
    "railway": "available",
    "gcloud": "available",
    "eas": "missing",
    "pnpm": "available"
  },
  "language": {
    "requested": "auto",
    "current_user_hint": "ko-KR",
    "selected": "ko",
    "fallback_reason": null
  }
}
```

Interpretation:

- The updated preflight correctly treats Railway and gcloud as available in this
  local environment.
- EAS remains the baseline exception.
- The remaining local preflight blockers are current Codex MCP registry state in
  this shell, not a repo implementation/test failure.
- No live Confluence publish was attempted.
