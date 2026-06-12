---
name: po-prd-to-execution
description: Use when Product/Planning has a ready PRD or bounded work unit and must convert it into Jira Epic/Story and role-scoped Tasks with Done-when acceptance criteria, evidence requirements, non-goals, human gates, and handoffs. This repo-local Codex adapter maps mobile-prd-to-execution to po-* naming and must not implement code or decompose unclear requests.
---

# PO PRD To Execution

Use this Product/Planning adapter only after the request has bounded readiness for decomposition.

## Source Crosswalk

- Local Codex skill: `po-prd-to-execution`
- Product/Planning source skill: `mobile-prd-to-execution`
- Source page: `1373634562`
- Parent SOUL: Product/Planning `1373798422`

The `po-*` slug is the repo-local Codex adapter name required for Product/Planning runtime use. It adapts the existing Case B decomposition skill without adding a standalone Product/Planning role wrapper.

## Required Inputs

- Ready PRD, clarified requirement brief, or bounded work-unit decision with `READY_FOR_MOBILE_PRD_TO_EXECUTION` or equivalent bounded readiness.
- Target platform, release scope, non-goals, external API/backend notes, and human-gate flags.
- Known design, architecture, backend/API, QA/release, and evidence constraints.

## Workflow

1. Confirm the PRD is ready and bounded; route unclear requirements back to `po-requirement-office-hours`.
2. Route oversized PRDs, full-product plans, or unbounded MVP scope back to `po-work-unit-planning-and-agent-sprint` before decomposition.
3. Separate user goals, screens, data, integration, release, and evidence requirements.
4. Create or draft Jira Epic and Story structure tied to acceptance criteria.
5. Break Stories into role-scoped Tasks for relevant roles.
6. Attach owner role, input artifact, output artifact, expected output, Done-when acceptance criteria, evidence requirement, dependencies, open decisions, and next responsible role to every Task.
7. Mark API contract needs and human-gate categories explicitly.
8. Include QA/Release work; do not omit evidence and release-readiness tasks.
9. Produce feature-room or coordination-log instructions without treating chat as final SoT.

## Output

- Epic/Story plan linked to PRD acceptance criteria.
- Role-scoped Task packet.
- Scope decision log with admitted, deferred, and rejected non-goal items.
- Evidence requirements, human gates, and next-role handoffs.

## Forbidden

- Do not decompose unclear requests into execution work.
- Do not decompose oversized PRDs or unbounded work units.
- Do not implement mobile UI, backend APIs, migrations, or release operations.
- Do not approve production submit or failed-gate risk.
- Do not create ad-hoc API contracts outside `packages/contracts`.
- Do not modify external platform/runtime repositories.

## Required Evals

- Positive: ready PRD decomposition triggers this skill.
- Negative: unclear request does not trigger this skill.
- Negative: review-only request does not trigger this skill.
