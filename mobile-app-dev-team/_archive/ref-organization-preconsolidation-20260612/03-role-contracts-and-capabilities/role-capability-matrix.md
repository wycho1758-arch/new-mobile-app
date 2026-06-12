# Role Capability Matrix

Status: reusable template guidance
Source class: template
Upstream SoT:

- `mobile-app-dev-team/03-role-capability-matrix.md`
- `mobile-app-dev-team/01-team-composition.md`

Downstream consumers:

- Future capability matrix creation work.
- Handoff responsibility pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-4-xhigh-20260610.md

## Required Matrix Columns

Every organization should maintain a capability matrix with these columns:

| Display Title | Operating Role | Can Do | Produces | Must Handoff To | Must Not Do |
| --- | --- | --- | --- | --- | --- |
| Example LLM Role | Stable routing role | Owned actions | Artifacts | Receiving owner | Forbidden ownership |
| Release Gatekeeper (System) | Gatekeeper | Deterministic pass/fail | Required-check result | Owning workflow | LLM judgment, SOUL.md, risk acceptance |

## Required Durable Handoff Fields

When a capability produces or consumes durable role artifacts, the capability matrix or its linked handoff table must also identify:

| owner | input artifact | output artifact | acceptance criteria | evidence requirement | next responsible role | durable handoff |
| --- | --- | --- | --- | --- | --- | --- |
| Role owner | Source packet, contract, design, or evidence | Produced artifact | Done-when condition | Required proof | Receiver role | GitHub branch/commit/PR and `docs/plans/work-units/<work-unit-id>/` |

These fields prevent the capability matrix from becoming a status-only role summary. The matrix must make handoff ownership reviewable.

## Rules

- `Can Do` must describe owned action, not vague participation.
- `Produces` must name artifacts or evidence.
- `Must Handoff To` must name the next accountable role.
- `Must Not Do` must prevent ownership collapse.
- Release Gatekeeper (System) must remain separate from LLM roles.
- Durable handoff fields must include owner, input artifact, output artifact, acceptance criteria, evidence requirement, next responsible role, GitHub branch/commit/PR, and `docs/plans/work-units/<work-unit-id>/`.

## Current Project Role Families

Use the current WonderMove mobile role families as examples:

- Product/Planning
- Design
- Mobile Architect
- Mobile App Dev
- Backend/API Integrator
- QA/Release
- Release Gatekeeper (System)

For a different organization, replace the domain-specific role families but preserve the columns and deterministic gate separation.
