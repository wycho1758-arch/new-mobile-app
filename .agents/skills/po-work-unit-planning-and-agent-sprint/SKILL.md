---
name: po-work-unit-planning-and-agent-sprint
description: Use when Product/Planning must shape a broad PRD or proactive practitioner report into a bounded MVP increment, vertical slice, agent sprint, story, task, or triage decision. This repo-local Codex adapter maps mobile-work-unit-planning-and-agent-sprint to po-* naming and must not authorize automatic scope expansion, Jira execution, SOUL changes, code edits, or human-gate bypass.
---

# PO Work-Unit Planning And Agent Sprint

Use this Product/Planning adapter to choose the safe size and shape of work before execution agents receive tasks.

## Source Crosswalk

- Local Codex skill: `po-work-unit-planning-and-agent-sprint`
- Product/Planning source skill: `mobile-work-unit-planning-and-agent-sprint`
- Source page: `1374650456`
- Parent SOUL: Product/Planning `1373798422`

The `po-*` slug is the repo-local Codex adapter name required for Product/Planning runtime use. It is not a generic orchestration layer and does not create a standalone role wrapper.

## Required Inputs

- Clarified requirement brief, PRD, existing backlog item, or practitioner improvement report.
- Acceptance lines, non-goals, constraints, human-gate flags, and known dependencies.
- Design, architecture, backend/API, QA/release, security/privacy, and human owner inputs when relevant.

## Workflow

1. Load the SoT and classify the planning problem.
2. Reject oversized handoffs that lack a bounded owner, acceptance line, evidence, or non-goal.
3. Shape unvalidated product work into the smallest usable MVP increment.
4. Prefer a vertical slice over layer-only work unless enabling infrastructure is required by approved scope.
5. Define a single coherent agent sprint goal when multiple roles must coordinate.
6. Prepare a handoff with owner role, input artifacts, output artifacts, acceptance line, evidence, dependencies, open decisions, non-goals, human gates, and next responsible role.
7. Triage proactive reports as `REJECT`, `NON_GOAL`, `BACKLOG_CANDIDATE`, `SPRINT_IMPROVEMENT`, `HUMAN_DECISION_REQUIRED`, or `RUNTIME_CAPABILITY_BLOCKED`.
8. Publish the selected work-unit level and rationale in the accepted SoT location.

## Output

- Work-unit decision: `PRODUCT_GOAL`, `MVP_INCREMENT`, `AGENT_SPRINT`, `VERTICAL_SLICE`, `STORY_WORK_ITEM`, `EXECUTION_TASK`, or `ONE_DAY_STEP`.
- Bounded handoff package and MVP-first approval plan when needed.
- Agent sprint agenda when multi-role coordination is required.
- Proactive report triage result.

## Forbidden

- Do not hand the full product plan to one execution agent.
- Do not implement code, modify app/backend files, or change external platform/runtime repositories.
- Do not let cron or proactive reports create Jira issues, code changes, scope changes, or SOUL changes automatically.
- Do not treat practitioner suggestions as approved product scope.
- Do not bypass human gates.
- Do not replace requirement office-hours, PRD-to-execution, or planning completeness review.

## Required Evals

- Positive: broad PRD or proactive report shaping triggers this skill.
- Negative: backend/API implementation ownership does not trigger this skill.
- Negative: review-only request does not trigger this skill.
