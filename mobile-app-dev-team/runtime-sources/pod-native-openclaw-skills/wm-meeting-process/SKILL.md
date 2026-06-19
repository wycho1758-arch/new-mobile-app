---
name: wm-meeting-process
description: Run WonderMove meeting flows for review meetings, announcements, and short brainstorming, including role participation limits, memory-required announcements, corrective 1:1 follow-up, Codex PR handoff, and next-meeting stop conditions.
---

# WonderMove Meeting Process

Runtime shape: `/workspace/skills/wm-meeting-process/SKILL.md`

Use this pod-native OpenClaw skill when WonderMove agents need to run a
structured meeting flow. It covers three meeting modes:

1. Review meeting, including workflow review and 1:n coordination.
2. Announcement.
3. Brainstorming.

This skill defines meeting operation only. It does not replace Product/Planning
scope authority, role workflow documents, Workboard guards, Codex execution
contracts, reviewer evidence, GitHub PR review, human approval, or release
approval.

## 1. Meeting Mode Selection

Choose exactly one mode before opening the meeting.

### Review Meeting

Use `Review meeting` when the purpose is to inspect, coordinate, or agree on a
workflow, artifact, handoff, role boundary, policy, or execution plan.

Workflow-related comprehensive reviews and `1:n coordination` have the same
character in this skill: they are Review meetings. Do not create a separate
heavy process for 1:n coordination when the actual purpose is review,
coordination, feedback, or agreement.

Examples:

- reviewing `Design_WORKFLOW.md`;
- coordinating Design to Mobile App Dev handoff;
- reviewing Backend/API contract handoff expectations;
- checking Mobile Architect route/state workflow boundaries;
- reviewing QA/Release evidence ownership.

### Announcement

Use `Announcement` when a specific agent broadcasts a fact, policy, schedule,
completion, or instruction. Announcement is one-way by default.

Responders should only acknowledge, normally with:

```text
확인 완료
```

If someone needs discussion, correction, or objection handling, open a separate
Review meeting or 1:1 corrective follow-up. Do not turn the announcement thread
itself into a discussion.

Every Announcement must be recorded in agent memory by the responsible agent.
Record the announcement content, source, audience, required action, and whether
acknowledgement was requested. Do not store secrets in memory.

### Brainstorming

Use `Brainstorming` only for short idea generation.

Brainstorming must have:

- a specific topic;
- a specific purpose;
- named participants;
- a time box of 5 minutes or less;
- a simple output format.

Brainstorming does not approve execution. At the end, the owner converts the
ideas into one of: Review meeting, task, decision request, or no-action summary.

## 2. Review Meeting Protocol

A Review meeting starts with a compact declaration:

```text
REVIEW MEETING START
Target:
Purpose:
Owner:
Allowed roles:
Excluded roles:
Feedback scope:
Stop condition:
```

Rules:

- Review exactly one target artifact, handoff, topic, or workflow at a time.
- Only `Allowed roles` may provide feedback.
- Roles not listed in `Allowed roles` are excluded from feedback for this
  meeting.
- If an excluded role appears relevant during the meeting, the owner must pause
  and explicitly add that role before accepting feedback from it.
- Keep feedback inside `Feedback scope`.
- Treat out-of-scope feedback as out-of-scope instead of expanding the meeting.

For workflow reviews, use the exact committed path or PR URL as the target.
Local `/workspace/...` paths are not cross-pod evidence unless the receiver can
fetch or reproduce the artifact from an accepted durable source.

## 3. Announcement Protocol

An Announcement starts with:

```text
ANNOUNCEMENT
Announcer:
Audience:
Content:
Action required: yes/no
Expected response: 확인 완료
Memory record required: yes
```

Rules:

- The announcer must be a specific agent or role owner.
- Responders only acknowledge unless the announcer explicitly asks for a
  different response.
- The responsible agent records the announcement in memory.
- If the announcement creates a task, review, or decision need, open a separate
  workflow for that work.
- Do not store secret values, credentials, tokens, private endpoints, auth file
  contents, or sensitive personal details in memory.

## 4. Brainstorming Protocol

A Brainstorming session starts with:

```text
BRAINSTORMING START
Topic:
Purpose:
Participants:
Time box: <=5 minutes
Output format:
Owner for summary:
```

Rules:

- Maximum duration is 5 minutes.
- The topic and purpose must be explicit before the session begins.
- Brainstorming output is ideas only, not approval.
- The owner closes with a short summary and the next container: Review meeting,
  task, decision request, or no action.

Close with:

```text
BRAINSTORMING CLOSED
Ideas summary:
Next container:
Next owner:
```

## 5. Feedback Disposition

In Review meetings, classify each feedback item as one of:

- `accepted-no-change`;
- `clarification-only`;
- `change-required`;
- `out-of-scope`.

Record feedback in this compact form:

```text
Feedback:
Raised by:
Disposition:
Reason:
Next action:
```

If any feedback is `change-required`, the owner must stop the Review meeting and
route corrective follow-up before any next Review meeting begins.

## 6. Corrective 1:1 Follow-Up

`1:1` is not a separate meeting mode in this skill. It is the corrective
follow-up mechanism used when a Review meeting finds `change-required` feedback
or when a single owner must resolve a blocker.

Stop phrase:

```text
REVIEW MEETING STOPPED
Reason:
Feedback item:
Next action: 1:1 corrective follow-up
```

The 1:1 corrective instruction must include:

```text
1:1 CORRECTIVE FOLLOW-UP
Source review:
Target file:
Required change:
Non-goals:
Execution method:
Validation:
Reviewer:
PR required: yes/no
Forbidden actions:
Report back with:
```

For managed repository changes, default to the applicable WonderMove role
workflow and Codex execution contract. The corrective owner should use a branch,
commit, PR, validation, reviewer evidence, and Spring/Product Delivery Lead
review unless the owner explicitly records why that is not applicable.

## 7. Codex, PR, Reviewer, Validation, And Merge Handoff

When corrective follow-up modifies repository files, use the smallest safe
handoff:

1. Start from latest `main`.
2. Create a focused branch.
3. Make only the requested change.
4. Run `git diff --check -- <changed-paths>`.
5. Run the validator matching the changed surface:
   - workflow docs: `node scripts/validate-workflow-docs.mjs`;
   - runtime sources or pod-native skills: `node scripts/validate-runtime-sources.mjs`.
6. Request the relevant reviewer or record why Spring/Product Planning review is
   sufficient for docs-only meeting-process changes.
7. Open a PR with feedback mapping, validation, reviewer evidence, and residual
   limits.
8. Spring/Product Delivery Lead decides merge or feedback.

Merge handoff requires:

- PR exists;
- validation passed or residual limit is explicitly accepted;
- reviewer or Spring review passed;
- no scope drift;
- no secret exposure;
- no unresolved human gate.

## 8. Stop Conditions Before The Next Review Meeting

Do not start the next Review meeting while the current Review meeting has open
feedback, pending corrective follow-up, pending PR, or pending human decision.

The next Review meeting may start only when all are true:

1. Current Review meeting is closed.
2. Every feedback item has a disposition.
3. Any `change-required` item has a completed corrective PR/review/merge or a
   recorded no-change decision.
4. Spring/Product Delivery Lead explicitly starts the next Review meeting.

Close a Review meeting with:

```text
REVIEW MEETING CLOSED
Decision:
Feedback disposition:
Next meeting allowed: yes/no
```

## 9. Safety Boundaries

Do not expose secrets, environment variables, tokens, credentials, private
endpoints, auth files, Google ADC JSON, service account JSON, OAuth codes, or
private config contents in meetings, memory, PR bodies, comments, prompts, or
reports.

Meetings cannot bypass human gates, approval boundaries, reviewer gates,
validation failures, production restrictions, release gates, or role ownership.
