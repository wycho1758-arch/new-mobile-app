# Organization Model

Status: reusable template guidance
Source class: index
Upstream SoT:

- `mobile-app-dev-team/organization/team-composition.md`
- `mobile-app-dev-team/organization/role-capability-matrix.md`

Downstream consumers:

- Future organization-model pages.
- Role contract and workflow pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose


## Consolidated Former Files

- `gatekeeper-model.md` -> consolidated below
- `role-boundaries.md` -> consolidated below
- `team-shape.md` -> consolidated below

## Gatekeeper Model

Former file: `gatekeeper-model.md`

### Model

Release Gatekeeper (System) is non-LLM and deterministic.

It is a required-check concept, not a person, custom agent, LLM practitioner, or reviewer.

### Invariants

- No Gatekeeper SOUL.md.
- Gatekeeper cannot replace human approval.
- Gatekeeper cannot accept failed-gate risk.
- Gatekeeper cannot reinterpret failed required checks.
- Gatekeeper records deterministic pass/fail from required evidence.

### Failure Handling

When a gate fails:

1. The failed check remains failed.
2. A read-only reviewer or advisor may classify the issue.
3. The owning implementation workflow fixes the issue.
4. QA/Release reruns or records evidence.
5. Product/Planning or a human owner handles rework caps, scope decisions, and failed-gate risk acceptance.

## Role Boundaries

Former file: `role-boundaries.md`

### Boundary Rules

- Product/Planning owns scope, readiness, non-goals, routing, and human-gate coordination. It must not implement app, backend, design, QA, or release work.
- Design owns design quality and implementation-ready mobile UX handoff. It must not make Product/Planning the design-quality approver.
- Mobile Architect owns architecture, route/state/runtime/API impact review, and releaseability risk. It must not absorb Mobile App Dev or Backend/API Integrator implementation ownership.
- Mobile App Dev owns tests-first Expo React Native implementation from approved tasks. It must not invent API contracts or duplicate schemas outside `packages/contracts`.
- Backend/API Integrator owns mobile-facing contracts, mocks, fixtures, auth/session behavior, error mapping, and approved backend/API delivery. It must not implement native UI.
- QA/Release owns evidence planning, execution, failure classification, and release-risk reporting. It must not accept failed-gate risk or replace Product/Planning/human decisions.
- Release Gatekeeper (System) consumes required checks and emits deterministic pass/fail. It must not perform LLM judgment.

### Reviewer Boundary

Every read-only reviewer must cite sources, avoid file edits, and avoid recursive delegation. A read-only reviewer can identify findings but cannot approve failed gates, accept human-gate risk, or become the implementation owner.

### Generalization

For a different organization, rewrite the role names and domain responsibilities, but preserve:

- one owner per decision surface,
- one producer per required artifact,
- explicit handoff receiver,
- clear do-not-do boundary,
- evidence owner,
- human-gate trigger,
- deterministic gate separation.

## Team Shape

Former file: `team-shape.md`

### Current Project Example

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

### Reusable Rule

future organizations may change role names or counts, but they must keep the distinction between:

- Display Title: the human-readable role label.
- Operating Role: the stable routing and validation value.
- Type: LLM role, non-LLM deterministic gate, human owner, or external system.

### When To Add A Role

avoid adding roles until a repeated ownership gap exists.

Add or split a role only when:

- a recurring responsibility lacks a clear owner,
- a handoff repeatedly fails because ownership is ambiguous,
- a deterministic gate is being treated like LLM judgment,
- a human-gated decision is being hidden inside an implementation role, or
- validation/evidence needs a distinct accountable surface.

List non-LLM deterministic gates separately from LLM roles. Do not make a SOUL.md for deterministic gates.
