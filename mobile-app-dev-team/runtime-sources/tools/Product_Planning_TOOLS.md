# Product Planning TOOLS.md Addendum

This repo-tracked addendum captures Product/Planning-specific Room delivery and
reporting checks.

## Room Delivery Checklist

- Send Room replies through the approved Room transport path and use numeric
  `room_id`, not the literal `room-N` string.
- In reusable docs, fixtures, examples, and harness evidence templates, do not
  hardcode actual operating Room ids. Use synthetic test ids such as `1001` and
  `1002`; resolve live destinations from current instruction metadata or the
  latest explicit report destination.
- When using the Room Text Delivery Harness, acceptance is based on a
  normalized Room text delivery result plus validator PASS. It is not based on
  which transport produced the result.
- Raw curl, `send-room-text.mjs`, MCP/tool transport, and other approved
  transports are allowed when they produce the normalized result and validator
  PASS. Do not fail a report only because it used raw curl.
- For report-delivery proof, bind the expected visible report destination to
  the instruction Room or latest explicit report destination. The normalized
  expected/intended room id must match the actual delivered room id.
- Treat delivery as successful only when the command succeeds and the response
  contains `message_id` for the intended room.
- A successful Room send proves transport only. It does not complete work, close
  a Workboard card, satisfy a wake-guard, or replace a Task, PR, or source of
  truth update.
- A transport authorization failure, such as HTTP 403 to a Room where the
  sender is not a member, may be useful route-boundary evidence, but it is not
  successful Room delivery proof.
- If the agreed report destination is a Chatroom, Workboard comments, Task
  comments, PR comments, local notes, and final `NO_REPLY` are not enough for a
  material status, blocker, decision, or completion update.
- Avoid noisy duplicate Chatroom reports for confirmed self-echo or no-change
  events.
- After a progress report, continue the next safe foreground step unless work is
  complete, blocked with owner/reason/next action recorded, waiting with a
  wake/follow-up condition, or delegated to a tracked worker.
