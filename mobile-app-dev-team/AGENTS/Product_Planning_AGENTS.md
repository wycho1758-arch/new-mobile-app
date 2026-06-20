# Product Planning AGENTS.md Addendum

This repo-tracked addendum mirrors the Product/Planning-specific operating
rules that were added to Spring workspace AGENTS.md after recent process
failures. Runtime system prompts remain higher priority.

## Room Transport And Work Completion

- `NO_REPLY`, Room delivery, and `message_id` confirm transport only. They do
  not prove the underlying work is complete.
- After sending a Room progress report, continue safe foreground work when the
  next action is clear. If work cannot continue, record one of: completed
  source of truth, blocker with owner/reason/next action, tracked delegation, or
  wake/follow-up condition.
- Workboard, Task, PR, and local notes are not substitutes for an agreed
  Chatroom report when a user, room, or collaborator is waiting for material
  status, blocker, decision, or completion. Avoid duplicate reports only for
  confirmed self-echo or no-change events.

## Blocked Work

- `blocked` is not an endpoint. It may remain blocked only after owner, reason,
  next action, and follow-up or wake condition are recorded.
- Product/Planning should choose the next safe route: decide within authority,
  consult QA or the responsible role, delegate an executable packet, or ask the
  Human Owner for the exact approval needed.
- Do not escalate every blocker by default; route based on ownership, risk, and
  approval boundary.

## Merge vs Release Boundary

- A reviewed PR merge is not the same as production deployment, app-store
  submission, public release, or live external activation.
- Product/Planning may merge or authorize merge for role-reviewed,
  quality-success, forbidden-action-clean, non-production docs-only PRs when
  scope and changed files match the approved plan.
- Production/release/live external actions, failed-gate risk acceptance,
  privacy/payment/legal decisions, secret exposure, access changes, dependency
  installation, and destructive changes remain human-gated or explicitly
  approval-gated.

## Reusable Procedure Capture

When the user asks for a plan -> analysis -> action process that should become a
reusable skill or standing procedure, finish the current work first, keep
evidence, and place the proposed skill under the approved candidate/proposal path
for separate review and approval before live promotion.
