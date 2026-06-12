# Role Contracts And Capabilities

Status: reusable template guidance
Source class: index
Upstream SoT:

- `mobile-app-dev-team/02-role-souls/`
- `mobile-app-dev-team/03-role-capability-matrix.md`
- `mobile-app-dev-team/_archive/12-ref-organization-goal-plan.md`

Downstream consumers:

- Future role contract pages.
- Workflow and handoff pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-4-xhigh-20260610.md

## Purpose

This consolidated section keeps the reusable reference-organization guidance in one navigable document. The former per-topic markdown files are listed below and preserved in `mobile-app-dev-team/_archive/ref-organization-preconsolidation-20260612/` for historical traceability.

## Consolidated Former Files

- `handoff-responsibilities.md` -> consolidated below
- `role-capability-matrix.md` -> consolidated below
- `role-soul-template.md` -> consolidated below

## Handoff Responsibilities

Former file: `handoff-responsibilities.md`

### Required Handoff Fields

Every execution task or durable role artifact must identify:

- owner
- input artifact
- output artifact
- acceptance criteria
- evidence requirement
- dependencies/blockers
- open decisions
- next responsible role

When work leaves the current pod or role runtime, the handoff must also include:

- GitHub branch/commit/PR
- `docs/plans/work-units/<work-unit-id>/`
- exact artifact path
- reviewer evidence path
- command output with exit status when applicable

### Handoff Rule

Local workspace state is not a durable handoff between pod-isolated agents. Use committed GitHub artifacts and work-unit docs for downstream consumption.

### Evidence Rule

Summary files can point to canonical evidence, but they do not replace canonical evidence. For example, work-unit QA summaries must link the actual E2E, mobile-mcp, Railway, EAS, or human approval evidence instead of copying only status claims.

## Role Capability Matrix

Former file: `role-capability-matrix.md`

### Required Matrix Columns

Every organization should maintain a capability matrix with these columns:

| Display Title | Operating Role | Can Do | Produces | Must Handoff To | Must Not Do |
| --- | --- | --- | --- | --- | --- |
| Example LLM Role | Stable routing role | Owned actions | Artifacts | Receiving owner | Forbidden ownership |
| Release Gatekeeper (System) | Gatekeeper | Deterministic pass/fail | Required-check result | Owning workflow | LLM judgment, SOUL.md, risk acceptance |

### Required Durable Handoff Fields

When a capability produces or consumes durable role artifacts, the capability matrix or its linked handoff table must also identify:

| owner | input artifact | output artifact | acceptance criteria | evidence requirement | next responsible role | durable handoff |
| --- | --- | --- | --- | --- | --- | --- |
| Role owner | Source packet, contract, design, or evidence | Produced artifact | Done-when condition | Required proof | Receiver role | GitHub branch/commit/PR and `docs/plans/work-units/<work-unit-id>/` |

These fields prevent the capability matrix from becoming a status-only role summary. The matrix must make handoff ownership reviewable.

### Rules

- `Can Do` must describe owned action, not vague participation.
- `Produces` must name artifacts or evidence.
- `Must Handoff To` must name the next accountable role.
- `Must Not Do` must prevent ownership collapse.
- Release Gatekeeper (System) must remain separate from LLM roles.
- Durable handoff fields must include owner, input artifact, output artifact, acceptance criteria, evidence requirement, next responsible role, GitHub branch/commit/PR, and `docs/plans/work-units/<work-unit-id>/`.

### Current Project Role Families

Use the current WonderMove mobile role families as examples:

- Product/Planning
- Design
- Mobile Architect
- Mobile App Dev
- Backend/API Integrator
- QA/Release
- Release Gatekeeper (System)

For a different organization, replace the domain-specific role families but preserve the columns and deterministic gate separation.

## Role SOUL Template

Former file: `role-soul-template.md`

### Required Fields

Each LLM role contract should define:

- Display Title
- Operating Role
- Authority Level
- Mission
- Responsibilities
- Inputs
- Outputs
- Available skills
- Available read-only agents
- Handoffs
- Do-not rules
- Human gate triggers

### Required Sections

Use a stable section order so reviewers and validators can compare roles:

1. Identity
2. Responsibilities
3. Skills
4. Communication Style
5. Decision Making
6. Boundaries
7. Goals
8. Working Principles
9. Security Policy
10. Sub-Agent & Background Delegation

### Template Rule

Gatekeeper does not inherit this template. Deterministic gates are not LLM practitioners and must not receive SOUL.md files.

### Current Project Example Use

Current WonderMove mobile role SOUL files can be used as examples, but future organizations should replace domain-specific terms, skills, and evidence paths with their verified SoT.
