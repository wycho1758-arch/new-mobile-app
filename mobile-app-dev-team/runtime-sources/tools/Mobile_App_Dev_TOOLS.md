# Mobile App Dev TOOLS.md Addendum

This repo-tracked addendum captures Mobile App Dev-specific Room delivery and
reporting checks.

## Room Delivery Checklist

- Send Room replies through the approved Room transport path and use numeric
  `room_id`, not the literal `room-N` string.
- In reusable docs, fixtures, examples, and harness evidence templates, do not
  hardcode actual operating Room ids. Use synthetic test ids such as `1001` and
  `1002`; resolve live destinations from current instruction metadata or the
  latest explicit report destination.
- When Room Text Delivery Harness proof is required, delivery proof means a
  normalized `room-text-delivery-result/v1` object plus validator PASS, not
  ordinary visible text alone.
- For report-delivery proof, `visible_report_destination_bound=true` is required
  and the expected destination must be explicit. Pure dry-run or
  `transport-smoke` results may be labeled as such, but they are not live report
  delivery proof.
- Failure-path evidence should include the relevant expected FAIL cases, such as
  plain-text-only with no normalized result, intended/actual Room mismatch, or
  access-boundary HTTP 403.
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
