# Codex Hook Local Configuration

This directory contains repo-local Codex hooks. Commit hook source and tests, but do not commit pod-local direct-message configuration.

## Stop completion direct-message hook

`mobile-stop-call-check.mjs` has two independent opt-in paths:

- `WM_STOP_CALL_CHECK_ENABLE=1`: existing HTTP/MCP health check behavior.
- `WM_STOP_COMPLETION_DM_ENABLE=1`: completion direct-message behavior for role pods.

When the completion DM path is not enabled, the hook is a no-op for DM delivery. This preserves Kim Tae-won's environment and any pod that has not explicitly created local config.

### Supported role pods

Only these role slugs are accepted by `WM_STOP_COMPLETION_DM_ROLE` or inferred from `AGENT_ID`:

- `spring`
- `sohee`
- `jihoon`
- `seulgi`
- `hyunwoo`
- `sarah`

Each pod must point to its own direct room. Do not share room IDs across roles.

### Local untracked env file

Create this file locally if your pod should send completion DMs:

```text
.codex/hooks/stop-completion-dm.env
```

The file is git-ignored. `mobile-stop-call-check.mjs` reads this file directly at Stop time and only accepts `WM_STOP_COMPLETION_DM_*` keys. It does not shell-evaluate the file. Example shape, with placeholders only:

```sh
export WM_STOP_COMPLETION_DM_ENABLE=1
export WM_STOP_COMPLETION_DM_ROLE=sohee
export WM_STOP_COMPLETION_DM_ROOM_ID=<numeric-direct-room-id>
export WM_STOP_COMPLETION_DM_TASK_ID=<task-id-or-work-unit-id>
export WM_STOP_COMPLETION_DM_RUN_ID=<codex-run-id-or-session-id>
# Optional; defaults to http://admin-api:3000/internal/messages.
export WM_STOP_COMPLETION_DM_ENDPOINT=http://admin-api:3000/internal/messages
# Optional; defaults to AGENT_ID.
export WM_STOP_COMPLETION_DM_FROM_AGENT_ID=<agent-id>
# Optional custom runbook. Keep it non-secret.
export WM_STOP_COMPLETION_DM_RUNBOOK_JSON='["Update the owning Task/Workboard with validation evidence.","Hand off to the next role only after evidence is attached.","Keep live/external/production/secret-bearing actions blocked until approved."]'
```

Do not store gateway tokens, private endpoints, or other sensitive values in tracked docs. Keep the numeric direct room ID local to the pod. The hook reads `GATEWAY_TOKEN` from the pod environment at runtime and never prints it; the local env file parser intentionally ignores non-`WM_STOP_COMPLETION_DM_*` keys.

### Message contents

The Stop hook message includes:

1. Role pod completion notice, for example `[Codex Stop Hook] Spring pod 작업 완료 알림`.
2. `task=<id>; run=<id>` identifier.
3. Completion summary from the final assistant message.
4. Next-step runbook.

If neither `WM_STOP_COMPLETION_DM_TASK_ID` nor `WM_STOP_COMPLETION_DM_RUN_ID` is set while DM is enabled, the hook blocks instead of sending an ambiguous message.

### Local validation

Use dry-run for safe local checks:

```sh
WM_STOP_COMPLETION_DM_ENABLE=1 \
WM_STOP_COMPLETION_DM_DRY_RUN=1 \
WM_STOP_COMPLETION_DM_ROLE=sohee \
WM_STOP_COMPLETION_DM_TASK_ID=TASK-1 \
WM_STOP_COMPLETION_DM_RUN_ID=local-test \
node .codex/hooks/mobile-stop-call-check.mjs <<'JSON'
{"hook_event_name":"Stop","last_assistant_message":"Done with evidence: pnpm run test:hooks passed."}
JSON
```

The repository hook harness also covers the local-only POST payload path without calling external services:

```sh
pnpm run test:hooks
```
