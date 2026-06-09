---
name: po-planning-completeness-review
description: Use when Product/Planning must review a completed planning package with relevant role owners before execution starts. This repo-local Codex adapter maps mobile-planning-completeness-review to po-* naming and returns a role review matrix, gap list, readiness decision, and handoff only when ready; it must not execute development work or require irrelevant reviewers.
---

# PO Planning Completeness Review

Use this Product/Planning adapter after PRD decomposition and before execution begins.

## Source Crosswalk

- Local Codex skill: `po-planning-completeness-review`
- Product/Planning source skill: `mobile-planning-completeness-review`
- Source page: `1374519387`
- Parent SOUL: Product/Planning `1373798422`

The `po-*` slug is the repo-local Codex adapter name required for Product/Planning runtime use. It reviews planning output and does not replace `po-prd-to-execution`.

## Required Inputs

- Planning package: PRD/brief, work items, acceptance criteria, evidence requirements, constraints, non-goals, and decision log.
- Relevant design, architecture, backend/API, QA/release, security/privacy, platform, and human owner references.
- Output from requirement office-hours when used.

## Workflow

1. Gather the planning package and verify accepted SoT links.
2. Build a role review matrix with only relevant roles.
3. Ask each relevant role for missing information, SoT conflict, risk, blocked assumption, required evidence, and acceptance changes.
4. Use A2A/NATS only with runtime support and evidence; otherwise use feature room notes, Confluence comments, or Jira comments.
5. Record reviewer, channel, timestamp, response, gaps, and owner. Silence is not approval unless a SoT defines a timeout rule.
6. Classify gaps as missing requirement, conflict, technical dependency, design dependency, release dependency, human decision, or runtime capability blocker.
7. Update planning artifacts only within approved scope.
8. Verify every execution task has owner, input artifact, output artifact, acceptance criteria, evidence requirement, dependency, open decisions, next responsible role, platform scope, and release/rollback note when relevant.
9. Return exactly one readiness state: `READY_FOR_EXECUTION`, `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or `BLOCKED_BY_RUNTIME_CAPABILITY`.

## Output

- Planning completeness review summary.
- Role review matrix.
- Gap list with owner and blocking status.
- Updates applied within approved scope.
- Execution handoff only when `READY_FOR_EXECUTION`.

## Forbidden

- Do not start execution while critical gaps, missing owners, missing acceptance criteria, or unresolved human gates remain.
- Do not implement code, modify app/backend files, or change external platform/runtime repositories.
- Do not claim unsupported A2A/NATS review.
- Do not require every possible role to review every plan.
- Do not add speculative requirements or extra architecture outside approved scope.
- Do not treat feature-room/chat content as final SoT unless linked back to the accepted SoT location.

## Required Evals

- Positive: completed planning package review triggers this skill.
- Negative: implementation request does not trigger this skill.
- Negative: review-only request does not trigger this skill.
