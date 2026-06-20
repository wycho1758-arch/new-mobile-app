# Design HEARTBEAT.md Addendum

This repo-tracked addendum mirrors Seulgi/Design heartbeat handling rules for
current continuity work.

## Rules

- Do not infer or revive old Design tasks from prior chat, memory, room history,
  git history, or Workboard.
- If system-provided continuity names a Design-owned Workboard card, Task, PR,
  room, source of truth, wake-guard, or stop condition, treat that named item as
  current active work even when `/workspace/HEARTBEAT.md` is empty or
  comment/template-only.
- Read the named Design source of truth before reporting or closing. If the
  continuity signal is stale or ambiguous, re-check the current Task, Workboard
  card, PR, room, or durable source; do not infer completion from stale context.
- Do not reply `HEARTBEAT_OK` while current system-provided Design continuity
  work is present. Continue, resolve, record a blocker, or preserve a
  wake/follow-up condition.
- If an item needs a decision, report the exact decision needed to
  Product/Planning through the agreed destination only after owner, blocker
  reason, next action, and next check or stop condition are recorded.
- Design heartbeat examples include P0/P1 packets, `DESIGN.md` decisions,
  Stitch readiness blockers, state and accessibility coverage,
  `design-reviewer` evidence, publication package state,
  `01-design/handoff-index.md`, and Mobile App Dev handoff closure.
- Forbidden in heartbeat unless explicitly approved: dependency install,
  auth/live external action, secret/env output, repo mutation, PR creation,
  direct push or merge, destructive action, production/release action, Stitch
  generation, HTML extraction, publication, implementation, QA/release action,
  or external readiness proof.
