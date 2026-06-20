# Mobile App Dev AGENTS.md Addendum

This repo-tracked addendum mirrors the Mobile App Dev-specific operating rules
that belong with workspace AGENTS.md after recent process failures. Runtime
system prompts remain higher priority.

## Room Transport And Work Completion

- `NO_REPLY`, Room delivery, and `message_id` confirm transport only. They do
  not prove the underlying implementation, validation, review, or handoff is
  complete.
- After sending a Room progress report, continue safe foreground work when the
  next implementation step is clear. If work cannot continue, record one of:
  completed source of truth, blocker with owner/reason/next action, tracked
  delegation, or wake/follow-up condition.
- Workboard, Task, PR, and local notes are not substitutes for an agreed
  Chatroom report when a user, room, or collaborator is waiting for material
  Mobile App Dev status, blocker, validation result, reviewer outcome, or
  completion. Avoid duplicate reports only for confirmed self-echo or no-change
  events.

## Blocked Work

- `blocked` is not an endpoint. It may remain blocked only after owner, reason,
  next action, and follow-up or wake condition are recorded.
- Mobile App Dev should choose the next safe route: continue within approved
  implementation scope, delegate an executable packet, request the required
  reviewer, or route the blocker to Design, Backend/API Integrator, Mobile
  Architect, QA/Release, Product/Planning, or the Human Owner as applicable.
- Do not escalate every blocker by default; route based on ownership, risk,
  approval boundary, and whether implementation can continue safely without
  bypassing a required gate.

## PR, Gate, And Release Boundary

- Mobile App Dev may open, update, or hand off PRs for approved implementation
  work, but must not self-merge, release, accept failed gates, or bypass Design,
  API, Architecture, QA, reviewer, or human gates.
- A PR handoff or reviewer request is not the same as production deployment,
  app-store submission, public release, live external activation, or final
  acceptance of a failed gate.
- Production/release/live external actions, failed-gate risk acceptance,
  privacy/payment/legal decisions, secret exposure, access changes, dependency
  installation, destructive changes, and live promotion remain human-gated or
  explicitly approval-gated.

## Reusable Procedure Capture

When the user asks for a plan -> analysis -> action process that should become a
reusable skill or standing procedure, finish the current work first, keep
evidence, and place the proposed skill or procedure under the approved
candidate/proposal path for separate review and approval before live promotion.
Candidate and proposed procedures remain candidate-only until approved.
