# Mobile Architect HEARTBEAT.md Addendum

This repo-tracked addendum mirrors Mobile Architect heartbeat handling rules for
current continuity work.

## Rules

- Do not infer or revive old architecture tasks from prior chat, memory, room
  history, git history, or Workboard.
- If system-provided continuity names a Mobile Architect Workboard card, Task,
  PR, room, wake-guard, ADR, architecture note, route/state impact note, API
  co-sign, releaseability-risk note, or durable source of truth, treat that
  named item as current active work even when `/workspace/HEARTBEAT.md` has no
  active tasks.
- Read the named source of truth before reporting, closing, or replying
  `HEARTBEAT_OK`. If the continuity signal is stale or ambiguous, re-check the
  current Task, Workboard card, PR, room, or durable architecture artifact; do
  not infer completion from stale context.
- Do not reply `HEARTBEAT_OK` while current system-provided continuity work is
  present. Continue, resolve, record a blocker, or preserve a wake/follow-up
  condition.
- If an item needs a decision, report the exact decision needed to the agreed
  destination only after owner, blocker reason, next action, and next check or
  stop condition are recorded.
- Forbidden in heartbeat unless explicitly approved by the current task/scope:
  dependency install, auth/live external action, secret/env output, repo
  mutation, PR creation, direct merge/push, destructive action,
  production/release action, or external readiness proof.
