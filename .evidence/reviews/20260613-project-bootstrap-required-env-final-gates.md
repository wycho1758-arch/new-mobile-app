# project-bootstrap required environment final gates

Date: 2026-06-13
Mode: `$wm` checkpoint 3, gates before final review

## Commands

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result:

```text
exit 0
project-bootstrap-agent-setup smoke passed
```

```text
pnpm run test:runtime
```

Result:

```text
exit 0
Validated 14 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current mobile-app-dev-team managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Validated work-unit next-action resolver fixtures.
Validated EAS evidence ingest fixtures.
Validated project environment fixtures.
Validated project environment drift checks.
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
Passed 44 hook fixture tests.
```

```text
git diff --check
```

Result:

```text
exit 0
```

```text
pnpm run test:local-harness
```

Result:

```text
exit 0
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
test:runtime passed inside local harness.
pnpm turbo run lint test passed inside local harness.
self-test all passed.
local harness all passed.
```

```text
project-bootstrap local preflight recheck
```

Result before PATH/codex-session recheck:

```text
exit 0
status: blocked
required MCPs: mobile-mcp, serena, stitch, expo, atlassian, node_repl, playwright missing
required CLIs: railway available, gcloud available
EAS CLI: missing, baseline exception
blocker guide written in Korean
```

Result after using the Codex binary validated by local harness (`/opt/homebrew/bin/codex`) and rerunning project-bootstrap preflight:

```text
exit 0
status: ready_for_bootstrap
required MCPs: mobile-mcp, serena, stitch, expo, atlassian, node_repl, playwright configured
required CLIs: railway available, gcloud available
EAS CLI: missing, baseline exception
blockers: []
report: .evidence/wm/project-bootstrap/20260613-required-env-local-recheck/project-bootstrap-report-after-agent-setup.json
```

The attempted Expo MCP OAuth flow was stopped because user approval in the real browser login surface is human-owned. No token, OAuth code, ADC JSON, or secret value was requested or recorded.

Post-user Expo login verification:

```text
/opt/homebrew/bin/codex mcp get expo
```

Result:

```text
exit 0
expo enabled: true
transport: streamable_http
url: <url-redacted>
bearer_token_env_var: -
```

After Expo login, project-bootstrap was rerun again:

```text
project-bootstrap local preflight recheck after Expo login
```

First post-login result:

```text
exit 0
status: blocked
remaining blocker: missing required MCP atlassian
```

The agent then verified/registered the pinned Atlassian MCP from repo SoT:

```text
/opt/homebrew/bin/codex mcp get atlassian
/opt/homebrew/bin/codex mcp add atlassian -- npx -y mcp-remote@0.1.38 https://mcp.atlassian.com/v1/mcp
```

Result:

```text
exit 0
atlassian enabled: true
transport: stdio
command: npx
args: -y mcp-remote@0.1.38 <url-redacted>
```

Final post-login project-bootstrap result:

```text
exit 0
status: ready_for_bootstrap
required MCPs: mobile-mcp, serena, stitch, expo, atlassian, node_repl, playwright configured
required CLIs: railway available, gcloud available
EAS CLI: missing, baseline exception
blockers: []
report: .evidence/wm/project-bootstrap/20260613-required-env-local-recheck/project-bootstrap-report-after-expo-login-2.json
```

## Notes

- No live EAS, Railway deploy, Google ADC login, Stitch generation/export, Atlassian mutation, GitHub branch protection, or production-risk command was run.
- Actual Railway/gcloud/node_repl availability remains platform/user-owned. The implementation makes missing readiness a blocker without collecting secrets.
