# Team Shape

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `mobile-app-dev-team/01-team-composition.md`
- `mobile-app-dev-team/07-new-team-template-guide.md`
- `mobile-app-dev-team/12-ref-organization-goal-plan.md`

Downstream consumers:

- Role boundary and role contract pages.
- Future new-organization planning work.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-4-xhigh-20260610.md

## Current Project Example

The current WonderMove mobile team uses 6 LLM roles plus 1 non-LLM deterministic Gatekeeper.

| Display Title | Operating Role | Type |
| --- | --- | --- |
| Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | LLM |
| Product Designer | Design | LLM |
| Mobile Architect / Technical Lead | Mobile Architect | LLM |
| Mobile App Developer | Mobile App Dev | LLM |
| Backend/API Engineer | Backend/API Integrator | LLM |
| QA/Release Engineer | QA/Release | LLM |
| Release Gatekeeper (System) | Gatekeeper | non-LLM deterministic gate |

## Reusable Rule

future organizations may change role names or counts, but they must keep the distinction between:

- Display Title: the human-readable role label.
- Operating Role: the stable routing and validation value.
- Type: LLM role, non-LLM deterministic gate, human owner, or external system.

## When To Add A Role

avoid adding roles until a repeated ownership gap exists.

Add or split a role only when:

- a recurring responsibility lacks a clear owner,
- a handoff repeatedly fails because ownership is ambiguous,
- a deterministic gate is being treated like LLM judgment,
- a human-gated decision is being hidden inside an implementation role, or
- validation/evidence needs a distinct accountable surface.

List non-LLM deterministic gates separately from LLM roles. Do not make a SOUL.md for deterministic gates.
