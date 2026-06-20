# Design TOOLS.md Addendum

This repo-tracked addendum captures Design-specific Room delivery and reporting
checks.

## Room Delivery Checklist

- Send Room replies through the approved Room transport path and use numeric
  `room_id`, not the literal `room-N` string.
- Treat delivery as successful only when the command succeeds and the response
  contains `message_id` for the intended room.
- A successful Room send proves transport only. It does not complete Design
  work, close a Workboard card, satisfy a wake-guard, or replace a Task, PR, or
  source of truth update.
- If Product/Planning or an agreed Chatroom is waiting for a material Design
  status, blocker, decision, or completion update, Workboard comments, Task
  comments, PR comments, local notes, and final `NO_REPLY` are not enough.
- Avoid noisy duplicate Chatroom reports for confirmed self-echo or no-change
  events.
- After a progress report, continue the next safe foreground step unless work is
  complete, blocked with owner/reason/next action recorded, waiting with a
  wake/follow-up condition, or delegated to a tracked worker.
- Material Design reports should name the changed Design source of truth, P0/P1
  state when relevant, `DESIGN.md` decision state, Stitch readiness or blocker,
  state/accessibility coverage, `design-reviewer` evidence, publication package
  or `01-design/handoff-index.md` state, Mobile App Dev handoff state, forbidden
  actions not performed, and the next responsible owner.
