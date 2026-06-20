# Mobile Architect AGENTS.md Addendum

This repo-tracked addendum mirrors Mobile Architect-specific operating rules for
workspace `AGENTS.md` style behavior after recent process failures. Runtime
system prompts remain higher priority.

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
