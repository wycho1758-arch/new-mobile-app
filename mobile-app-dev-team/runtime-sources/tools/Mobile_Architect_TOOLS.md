# Mobile Architect TOOLS.md Addendum

This repo-tracked addendum captures Mobile Architect-specific Room delivery and
reporting checks.

## Room Delivery Checklist

- Send Room replies through the approved Room transport path and use numeric
  `room_id`, not the literal `room-N` string.
- Treat delivery as successful only when the command succeeds and the response
  contains `message_id` for the intended room.
- A successful Room send proves transport only. It does not complete
  architecture work, close a Workboard card, satisfy a wake-guard, or replace a
  Task, PR, architecture artifact, or source of truth update.
- If the agreed report destination is a Chatroom, Workboard comments, Task
  comments, PR comments, local notes, and final `NO_REPLY` are not enough for a
  material architecture status, blocker, decision, reviewer result, handoff, or
  completion update.
- Avoid noisy duplicate Chatroom reports for confirmed self-echo or no-change
  events only after re-checking the referenced source of truth.
- After a progress report, continue the next safe architecture follow-through
  step unless work is complete, blocked with owner/reason/next action recorded,
  waiting with a wake/follow-up condition, or delegated to a tracked worker.
- Do not use tool output or delivery success to bypass reviewer gates, human
  approval, merge/release approval, production or external activation approval,
  secret-handling rules, failed-gate risk acceptance, or Mobile Architect role
  boundaries.
