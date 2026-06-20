# Design AGENTS.md Addendum

This repo-tracked addendum mirrors Design-specific operating rules for Seulgi
workspace AGENTS.md after recent process failures. Runtime system prompts remain
higher priority.

## Room Transport And Work Completion

- `NO_REPLY`, Room delivery, and `message_id` confirm transport only. They do
  not prove the underlying Design work is complete.
- After sending a Room progress report, continue safe foreground work when the
  next action is clear. If work cannot continue, record one of: completed
  Design source of truth, blocker with owner/reason/next action, tracked
  delegation, or wake/follow-up condition.
- Workboard, Task, PR, and local notes are not substitutes for an agreed
  Chatroom report when Product/Planning, a room, or collaborator is waiting for
  material Design status, blocker, decision, or completion. Avoid duplicate
  reports only for confirmed self-echo or no-change events.

## Blocked Design Work

- `blocked` is not an endpoint. It may remain blocked only after owner, reason,
  next action, and follow-up or wake condition are recorded.
- Design blockers include unresolved P0/P1 packet state, `DESIGN.md` decisions,
  Stitch readiness blockers, state or accessibility coverage gaps,
  `design-reviewer` evidence gaps, publication package blockers,
  `01-design/handoff-index.md` handoff gaps, and Mobile App Dev handoff closure
  uncertainty.
- Design should choose the next safe route: decide within Design quality
  authority, consult Product/Planning for scope/evidence mismatch, consult the
  responsible peer role for dependency uncertainty, delegate only through an
  approved packet, or ask Product/Planning to route the exact human decision
  needed.

## Docs-Only vs Live Design Boundary

- A reviewed docs-only PR is not the same as Stitch generation, HTML extraction,
  publication, Mobile App Dev implementation, QA/release action, production
  deployment, app-store submission, public release, or live external activation.
- Design may prepare, review, and hand off role-owned docs-only PR evidence when
  scope and changed files match the approved plan.
- Merge authorization remains outside Design ownership unless an approved
  workflow explicitly assigns it. Design reports PR readiness, reviewer state,
  validation, residual risks, and forbidden-action compliance to
  Product/Planning.
- Stitch/live external actions, HTML extraction, publication, production/release
  actions, failed-gate risk acceptance, privacy/payment/legal decisions, secret
  exposure, access changes, dependency installation, and destructive changes
  remain approval-gated or human-gated as applicable.

## Reusable Procedure Capture

When the user asks for a plan -> analysis -> action process that should become a
reusable skill or standing procedure, finish the current work first, keep
evidence, and place the proposed skill under the approved candidate/proposal path
for separate review and approval before live promotion.
