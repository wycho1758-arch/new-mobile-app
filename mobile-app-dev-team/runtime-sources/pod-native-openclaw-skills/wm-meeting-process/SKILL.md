---
name: wm-meeting-process
description: Run WonderMove role-scoped meetings including 1:1, 1:n, announcements, brainstorming, and sequential comprehensive reviews with explicit participation limits, stop/revision/resume rules, Codex-based corrective work, and chat-room reporting.
---

# WonderMove Meeting Process

Runtime shape: `/workspace/skills/wm-meeting-process/SKILL.md`

This pod-native OpenClaw skill defines reusable meeting operation rules for
WonderMove delivery work. Use it when a Product Delivery Lead or role owner must
run a structured meeting, review, announcement, 1:1 instruction, 1:n discussion,
brainstorming session, or comprehensive workflow review across role pods.

It is a meeting-process skill only. It does not replace Product/Planning scope
ownership, role workflow documents, repo-local Codex skills, Workboard guards,
reviewer evidence, human gates, or GitHub PR review.

## Core Principles

- One meeting has one owner, one purpose, one explicit participant set, and one
  durable outcome.
- The meeting owner must state whether the meeting is 1:1, 1:n, announcement,
  brainstorming, review, or comprehensive sequential review.
- Only roles related to the meeting scope may participate. Unrelated roles must
  not add feedback, decisions, or side topics.
- Meeting chat is coordination evidence only. Durable decisions, fixes, PRs,
  review evidence, and handoffs must be recorded in the accepted system of
  record.
- If feedback requires a document or code change, stop the meeting before
  assigning correction work.
- Corrective repository work must follow the approved role workflow, Workboard
  guard, wake guard, Codex execution contract when applicable, validation,
  reviewer evidence, PR handoff, and Spring/Product Delivery Lead review.

## Meeting Modes

### 1:1 Instruction

Use for direct owner-to-practitioner instructions, blocker handling, corrective
work assignment, or role-specific clarification.

Required opening:

- target practitioner or role;
- exact task or question;
- source of truth or artifact path;
- allowed actions;
- forbidden actions;
- expected reply format;
- deadline or wake-guard timing when needed.

### 1:n Coordination

Use when multiple related roles must coordinate a bounded handoff or resolve an
interface question.

Required opening:

- meeting owner;
- participating roles;
- excluded roles;
- agenda;
- decision owner for each topic;
- expected output;
- stop condition.

### Announcement

Use for one-way status, policy, completion, schedule, or instruction broadcasts.
Announcements do not accept feedback unless the owner explicitly opens a follow
up meeting.

Required opening:

- audience;
- announcement purpose;
- what changed;
- action required or no-action-required;
- source of truth link or path;
- escalation path for objections.

### Brainstorming

Use only when the purpose is option generation, not approval or execution.
Brainstorming output must be converted into a bounded decision request or task
before implementation begins.

Required opening:

- problem statement;
- participant roles;
- non-goals;
- idea capture format;
- selection criteria;
- who converts ideas into a decision or task;
- time box.

### Comprehensive Sequential Review

Use when a set of related workflow, policy, design, architecture, contract,
implementation, QA, or release documents must be reviewed one at a time.

This mode is strict:

1. The meeting owner selects exactly one target artifact.
2. The owner states the exact path, review scope, participating roles, excluded
   roles, expected feedback format, and stop condition.
3. Only related roles may participate.
4. If feedback requires correction, the owner must strongly pause or stop that
   review meeting.
5. The owner must send a 1:1 corrective instruction to the artifact's main
   author before starting any other target artifact review.
6. The correction must follow the applicable Codex, Workboard, wake-guard,
   validation, reviewer, PR, and merge/review process.
7. The next artifact review cannot start until the current artifact is accepted,
   corrected and merged, or explicitly closed as no-change-needed by the owner.

## Participation Rules

Before opening a meeting, classify each role as one of:

- required participant;
- optional participant;
- observer only;
- excluded.

For role-scoped workflow reviews:

- Product/Planning participates when scope, approval, non-goals, evidence,
  human gates, or cross-role handoff are affected.
- Design participates when UX quality, interaction, visual hierarchy, design
  options, accessibility, Stitch, publication, or Design handoff are affected.
- Mobile Architect participates when route/state, module boundary, dependency,
  runtime, API co-sign, or releaseability risk is affected.
- Backend/API Integrator participates when contracts, schemas, mocks, fixtures,
  auth/session behavior, error behavior, API service scope, or migrations are
  affected.
- Mobile App Dev participates when mobile implementation, app integration,
  selectors, screens, routes, runtime behavior, or implementation evidence are
  affected.
- QA/Release participates when evidence ladder, test plan, release readiness,
  failure classification, EAS/release evidence, or risk reporting is affected.

If a role is not related to the selected artifact or agenda item, the meeting
owner must state that the role is excluded from feedback for that meeting.

## Feedback Handling

Feedback must be recorded as one of:

- no-change-needed;
- clarification-only;
- correction-required;
- blocked-by-missing-source;
- human-decision-required;
- out-of-scope-for-this-meeting.

When feedback is `correction-required`, `blocked-by-missing-source`, or
`human-decision-required`, the meeting owner must stop the current review and
route the next action before any other review begins.

Use this stop phrase or a close equivalent:

```text
MEETING STOPPED: feedback requires owner-routed follow-up. No further review on
this artifact or next artifact may continue until the corrective path is issued.
```

## Corrective Work Routing

For repository artifact changes, the owner must send a 1:1 instruction to the
main author or assigned role owner. The instruction must include:

- target artifact path;
- exact feedback to address;
- accepted source of truth;
- non-goals;
- required branch/commit/PR handoff;
- required validation;
- required reviewer evidence;
- forbidden actions;
- reporting room or channel;
- deadline or wake-guard cadence.

If the correction modifies the managed repository, use the applicable
WonderMove role workflow and Codex execution contract. Do not allow direct
ad-hoc edits when the accepted workflow requires Codex.

## Resume And Completion

A stopped meeting may resume only when one of these is true:

- corrective PR is merged and post-merge review is accepted;
- feedback is explicitly withdrawn by the feedback owner;
- Product/Planning or the meeting owner records a no-change-needed decision with
  reason;
- required human decision is recorded through the approved workspace mechanism;
- the review is closed as blocked with next owner and wake-guard.

Completion report must include:

- meeting mode;
- target artifact;
- participants and excluded roles;
- decisions;
- feedback disposition;
- corrective PR or issue links when any;
- residual blockers;
- next action;
- system of record updated.

## Safety And Boundaries

Do not expose secrets, environment variables, tokens, credentials, private
endpoints, auth files, Google ADC JSON, service account JSON, OAuth codes, or
private config contents in meeting prompts, chat, evidence, or reports.

Do not use meetings to bypass human gates, approval boundaries, reviewer gates,
failed validation, production restrictions, release gates, or role ownership.

Meetings can coordinate decisions. They cannot replace required validation,
reviewer evidence, GitHub PR review, human approval, or production/release
approval.
