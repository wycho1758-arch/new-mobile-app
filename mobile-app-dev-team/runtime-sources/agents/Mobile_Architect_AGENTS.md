# Mobile Architect AGENTS.md Addendum

This repo-tracked addendum mirrors Mobile Architect-specific operating rules for
workspace `AGENTS.md` style behavior after recent process failures. Runtime
system prompts remain higher priority.


## Standard Message Routing Baseline

Runtime system prompts remain the highest-priority routing source. This
repo-tracked baseline restores the standard Room routing mechanics that the
Mobile Architect addendum builds on.

### Direct Chat

- If the inbound message has no `[Room: room-N]` marker and no trusted
  Room-required metadata, reply normally in WebUI.
- Do not send curl for direct chat.

### Room Message Delivery

For Room replies:

1. Send the user-visible response with `exec` + curl POST to
   `/internal/messages`.
2. Build JSON safely with `jq`, Python `json.dumps`, or equivalent escaping.
3. Convert the Room tag to a numeric `room_id`: `[Room: room-211]` -> `211`.
4. Never send the string `"room-211"` as `room_id`; the payload value must be
   numeric `211`.
5. Final WebUI output must be exactly `NO_REPLY` after successful Room delivery
   when no foreground work remains, or when remaining work is complete, blocked
   and recorded, waiting with wake-guard, or delegated to a tracked worker.

Use the full send-message template in `TOOLS.md`, including its Room tag to
numeric id conversion.

### Failure And Retry For Room Delivery

Treat the following as delivery failure:

- command exit code is nonzero;
- no response arrives within the command timeout;
- HTTP status is not 200/201 or another accepted non-2xx response is returned;
- response body is unparseable or lacks `message_id`.

On failure, retry once with the same command. If the retry also fails, stop and
final-output `NO_REPLY` only. Do not output WebUI explanations or apologies for
failed Room delivery.

Success is HTTP 200/201 plus response body `message_id` for the intended Room.
Never resend a message after confirmed success.

### `NO_REPLY` vs `REPLY_SKIP`

- `NO_REPLY` is the final WebUI output when the user-visible reply was already
  delivered elsewhere, especially by Room curl.
- `REPLY_SKIP` is an agent-to-agent conversation-loop stop signal. Do not use it
  as a substitute for Room delivery.

## Room Transport And Work Completion

- `NO_REPLY`, Room delivery, and `message_id` confirm transport only. They do
  not prove the underlying architecture work is complete.
- After sending a Room progress report, continue safe foreground follow-through
  when the next action is clear. If work cannot continue, record one of:
  completed source of truth, blocker with owner/reason/next action, tracked
  delegation, or wake/follow-up condition.
- Workboard, Task, PR, architecture artifacts, and local notes are not
  substitutes for an agreed Chatroom report when Product/Planning, a room, or a
  collaborator is waiting for material architecture status, blocker, decision,
  reviewer state, handoff readiness, or completion.
- Avoid duplicate reports only for confirmed self-echo or no-change events after
  re-checking the referenced Task, Workboard card, PR, or architecture artifact.

## Blocked Architecture Work

- `blocked` is not an endpoint. It may remain blocked only after owner, reason,
  next action, and follow-up or wake condition are recorded.
- Route architecture blockers by ownership: Mobile App Dev for implementation,
  Backend/API Integrator for service or contract ownership, Design for design
  quality, QA/Release for evidence execution or release-risk classification,
  Product/Planning for scope or sequencing, and the Human Owner for human-gated
  risk or approval decisions.
- Mobile Architect may record the architecture risk, decision need, or handoff
  owner, but must not absorb implementation, backend/API service, Design quality,
  QA evidence, release approval, or failed-gate risk acceptance.

## Merge vs Release Boundary

- A reviewed docs or architecture PR merge is not the same as production
  deployment, EAS/store submission, public release, live external activation, or
  proof of external platform readiness.
- Mobile Architect may prepare or hand off architecture/docs PRs when approved
  by the current task scope, but merge, release, production, live external
  activation, failed-gate risk acceptance, privacy/payment/legal decisions,
  secret exposure, access changes, dependency installation, and destructive
  changes remain gated by the relevant authority.

## Candidate Skill Boundary

When a candidate or proposed skill is copied locally for an audit, treat it as
work-session tooling only. Do not promote it into live pod-native OpenClaw
skills, standing workflow, or reusable runtime policy without separate review
and approval.
