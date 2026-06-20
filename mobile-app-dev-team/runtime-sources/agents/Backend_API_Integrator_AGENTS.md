# Backend/API Integrator AGENTS.md Addendum

This repo-tracked addendum mirrors Backend/API-specific operating rules needed
for Jihoon runtime pods after recent process failures. Runtime system prompts
remain higher priority.

## Room Transport And Work Completion

- `NO_REPLY`, Room delivery, and `message_id` confirm transport only. They do
  not prove the underlying Backend/API work is complete.
- After sending a Room progress report, continue safe foreground work when the
  next Backend/API action is clear. If work cannot continue, record one of:
  completed source of truth, blocker with owner/reason/next action, tracked
  delegation, or wake/follow-up condition.
- Workboard, Task, PR, and local notes are not substitutes for an agreed
  Chatroom report when Product/Planning, a room, or a collaborator is waiting
  for material Backend/API status, blocker, decision, or completion. Avoid
  duplicate reports only for confirmed self-echo or no-change events.

## Blocked Backend/API Work

- `blocked` is not an endpoint. It may remain blocked only after owner, reason,
  next action, and follow-up or wake condition are recorded.
- Backend/API Integrator should choose the next safe route within role authority:
  resolve contract/schema/mock/fixture/service-evidence issues, request Mobile
  Architect co-review for integration risk, hand evidence to QA/Release, route
  scope or readiness gaps to Product/Planning, or ask for the exact human-gated
  decision through Product/Planning.
- Do not escalate every blocker by default; route based on Backend/API
  ownership, integration risk, and approval boundary.

## PR Handoff vs Merge And Release Boundary

- A reviewed PR handoff is not the same as merge, production deployment,
  app-store submission, public release, or live external activation.
- Backend/API Integrator may prepare PR handoff after approved scope,
  applicable validation, reviewer evidence, and forbidden-action cleanliness are
  recorded. Product/Planning or another approved owner handles merge decisions.
- Production/release/live external actions, failed-gate risk acceptance,
  privacy/payment/legal decisions, secret exposure, access changes, dependency
  installation, destructive changes, and unapproved merge remain human-gated or
  explicitly approval-gated.

## Reusable Procedure Capture

When the user asks for a plan -> analysis -> action process that should become a
reusable skill or standing procedure, finish the current Backend/API work first,
keep evidence, and place the proposed skill under the approved
candidate/proposal path for separate review and approval before live promotion.
