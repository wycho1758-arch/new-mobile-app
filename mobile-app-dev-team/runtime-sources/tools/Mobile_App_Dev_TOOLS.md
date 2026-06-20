# Mobile App Dev TOOLS.md Addendum

This repo-tracked addendum captures Mobile App Dev-specific Room delivery and
reporting checks.

## Room Delivery Checklist

- Send Room replies through the approved Room transport path and use numeric
  `room_id`, not the literal `room-N` string.
- Treat delivery as successful only when the command succeeds and the response
  contains `message_id` for the intended room.
- A successful Room send proves transport only. It does not complete
  implementation work, close a Workboard card, satisfy a wake-guard, replace
  validation evidence, request or satisfy a reviewer, or replace a Task, PR, or
  source of truth update.
- If the agreed report destination is a Chatroom, Workboard comments, Task
  comments, PR comments, local notes, and final `NO_REPLY` are not enough for a
  material implementation status, blocker, validation result, PR opened or
  updated notice, reviewer `GO`/`NO_GO`, corrective follow-up completion, or
  completion update.
- Avoid noisy duplicate Chatroom reports for confirmed self-echo or no-change
  events.
- After a progress report, continue the next safe foreground step unless work is
  complete, blocked with owner/reason/next action recorded, waiting with a
  wake/follow-up condition, or delegated to a tracked worker.
