---
name: codex-cli-auth-setup
description: Verify and, after explicit approval, install or update the OpenAI Codex CLI in an OpenClaw/clawpod-agent Linux workspace, including checking npm/node prerequisites, verifying ~/.codex/auth.json without exposing secrets, running codex doctor, and testing codex exec with --dangerously-bypass-approvals-and-sandbox. Use when asked to set up Codex CLI, configure Codex auth, validate no-approval Codex execution, or produce a SoT-style report of Codex CLI readiness.
---

# Codex CLI Auth Setup

Use this pod-native OpenClaw skill to validate Codex CLI on an OpenClaw agent
host and install or update it only after explicit approval.
For fresh role pods, follow the full sequence in
`mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md`: Codex auth readiness
comes before repo checkout/bootstrap readiness.

Runtime shape:

```text
/workspace/skills/codex-cli-auth-setup/SKILL.md
```

## Safety Rules

- Never print auth token values, API keys, OAuth tokens, refresh tokens, passwords, or full secret-bearing config contents.
- Report auth presence, file mode, key names, and health status only.
- Treat `--dangerously-bypass-approvals-and-sandbox` as high risk. Use it only for explicit user requests or controlled smoke tests.
- Use harmless smoke commands, for example `printf CODEX_EXEC_OK`.
- Apply redaction to command output before sharing reports.
- Prefer Markdown reports for room/user reporting.

## Repo Operations Policy Reference

When this skill is used to configure a pod that will operate on a GitHub
repository through Codex CLI, keep repo-wide operating policy in the repository
root policy files. For this repo, the policy owner is `REPO_OPERATIONS.md`;
`AGENTS.md` should only carry the runtime instruction surface needed by Codex.

Keep AGENTS.md policy agent-neutral. Use `this agent`, `assistant`, or
`the agent` as the subject, not a named pod or persona. Named identity belongs
in SOUL.md or IDENTITY.md, not AGENTS.md.

Do not duplicate the full root policy in this pod-native skill. This skill
only records the OpenClaw pod setup facts that must be checked before repo work
is routed through Codex CLI.

Project path setup:

- GitHub repository checkout path: `/workspace/projects/Wondermove-Inc/new-mobile-app/`
- Codex-managed paths registry: `/workspace/CODEX_MANAGED_PATHS.md`
- Required managed path entry: `/workspace/projects/Wondermove-Inc/new-mobile-app/`
- Default Codex hook wrapper: `/workspace/codex-hooks/codex-run`

Use this registry shape:

```markdown
# Codex-managed Paths

Add repository or directory paths here. Any task targeting these paths must be
executed through Codex CLI according to the root repo operations policy in
`REPO_OPERATIONS.md` and the runtime instructions in `AGENTS.md`.

- /workspace/projects/Wondermove-Inc/new-mobile-app/
```

When checking an existing OpenClaw pod, inspect AGENTS.md,
`REPO_OPERATIONS.md`, and `/workspace/CODEX_MANAGED_PATHS.md` without reading
secrets. The policy setup is not complete until `/workspace/projects/Wondermove-Inc/new-mobile-app/`
is present in the managed-paths registry and repository work is routed through
the configured Codex hook wrapper.

## Codex Stop-Hook Completion DM Setup

Use this section when the user explicitly asks to enable or verify Codex Stop
hook direct-message delivery for a role pod. This is a local pod setting, not a
tracked secret or shared runtime default.

1. Confirm the repo hook is registered without printing secrets:

```bash
python3 -c "import json; obj=json.load(open('.codex/hooks.json')); print(json.dumps(obj.get('hooks', {}).get('Stop'), indent=2))"
```

2. Create the local untracked env file only after explicit instruction. Keep it
mode `0600`, keep it git-ignored, and never write `GATEWAY_TOKEN`, OAuth
tokens, refresh tokens, API keys, passwords, or private config values into it.
The hook reads the gateway token from the inherited hook environment at runtime.

```sh
# .codex/hooks/stop-completion-dm.env
export WM_STOP_COMPLETION_DM_ENABLE=1
export WM_STOP_COMPLETION_DM_ROLE=<spring|sohee|jihoon|seulgi|hyunwoo|sarah>
export WM_STOP_COMPLETION_DM_ROOM_ID=<numeric-direct-room-id>
export WM_STOP_COMPLETION_DM_TASK_ID=<task-or-work-unit-id>
export WM_STOP_COMPLETION_DM_RUN_ID=<run-or-session-id>
export WM_STOP_COMPLETION_DM_ENDPOINT=http://admin-api:3000/internal/messages
export WM_STOP_COMPLETION_DM_FROM_AGENT_ID=<agent-id>
export WM_STOP_COMPLETION_DM_RUNBOOK_JSON='["Confirm the Room message_id for delivery.","Record evidence before closing.","Do not store tokens or secret values in this file."]'
```

3. Verify with dry-run first, then perform one live Stop-hook check only when
message delivery is explicitly requested. Do not print the inherited gateway
token or dump the full environment.

```bash
WM_STOP_COMPLETION_DM_DRY_RUN=1 \
node .codex/hooks/mobile-stop-call-check.mjs <<'JSON'
{"hook_event_name":"Stop","last_assistant_message":"Dry-run completion DM check."}
JSON

node .codex/hooks/mobile-stop-call-check.mjs <<'JSON'
{"hook_event_name":"Stop","last_assistant_message":"Live Stop-hook completion DM check."}
JSON
```

Expected live result: the hook returns `continue: true` and the configured Room
receives a message from the role pod. Record the returned Room `message_id` or
visible Room delivery evidence in the Task/Workboard/report.

If the live check fails, report the blocker without exposing secrets. Common
blockers are missing numeric room id, missing inherited `GATEWAY_TOKEN`, missing
agent id, unreachable `admin-api`, or the local env file not being present in
the hook working directory.

## Workflow

1. Check prerequisites and any existing install:

```bash
node --version
npm --version
command -v codex || true
codex --version || true
npm list -g --depth=0 2>/dev/null | grep -Ei 'codex|openai' || true
```

2. Check package metadata:

```bash
npm view @openai/codex version name bin --json
```

3. Install or update Codex CLI only after approval.

Before running an installer, the agent must report the exact package and version
target and wait for explicit approval unless the user already approved that
exact install. Do not use `@latest` unless the user explicitly approved that
exact target.

```bash
npm i -g @openai/codex@<approved-version>
```

4. Verify basic execution:

```bash
codex --version
codex --help | head -40
```

5. Check auth and config without leaking secrets. Prefer the bundled script:

```bash
bash /workspace/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh
```

6. Run doctor with redaction:

```bash
codex doctor 2>&1 | sed -E 's/(token|key|secret|password)([=: ][^ ]+)/\1=***REDACTED***/Ig' | head -120
```

7. Test no-approval execution only when explicitly requested:

```bash
codex exec --dangerously-bypass-approvals-and-sandbox \
  'Run exactly this shell command and return only its output: printf CODEX_EXEC_OK'
```

Expected indicators:

```text
approval: never
sandbox: danger-full-access
CODEX_EXEC_OK
```

## Reporting

Include:

- installed Codex CLI version
- install path
- auth file presence and mode, not contents
- `codex doctor` summary
- no-approval smoke test status when requested
- any missing MCP configuration, if relevant

Do not include secret values or full `auth.json` contents.

See `references/report-template.md` for a concise report template.
