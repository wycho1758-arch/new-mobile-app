# Mobile App Dev HEARTBEAT.md Addendum

This repo-tracked addendum mirrors Mobile App Dev heartbeat handling rules for
current continuity work.

## Rules

- Do not infer or revive old implementation tasks from prior chat, memory, room
  history, git history, Workboard, Task, PR, wake-guard, reviewer mention, or
  corrective follow-up.
- If system-provided continuity names a Workboard card, Task, PR, room,
  wake-guard, reviewer, or corrective follow-up, treat that named item as
  current active work even when the local Active Items list is empty.
- Read the named source of truth before reporting `HEARTBEAT_OK` or closing. If
  the continuity signal is stale or ambiguous, re-check the current Task,
  Workboard card, PR, room, reviewer thread, wake-guard, corrective follow-up,
  or durable source; do not infer completion from stale context.
- Do not reply `HEARTBEAT_OK` while named current continuity work is present.
  Continue, resolve, record a blocker, report material status, or preserve a
  wake/follow-up condition.
- If no named current work is present after re-checking the available source of
  truth, `HEARTBEAT_OK` is allowed.
- If an item needs a decision, report the exact decision needed to the agreed
  destination only after owner, blocker reason, next action, and next check or
  stop condition are recorded.
- Forbidden in heartbeat unless explicitly approved by an execution packet:
  dependency install, auth/live external action, secret/env output, repo
  mutation, PR creation, direct merge/push, destructive action,
  production/release action, or external readiness proof.
