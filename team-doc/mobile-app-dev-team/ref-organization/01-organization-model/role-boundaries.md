# Role Boundaries

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `team-doc/mobile-app-dev-team/01-team-composition.md`
- `team-doc/mobile-app-dev-team/03-role-capability-matrix.md`
- `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`

Downstream consumers:

- Role contract pages.
- Workflow and handoff pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-4-xhigh-20260610.md

## Boundary Rules

- Product/Planning owns scope, readiness, non-goals, routing, and human-gate coordination. It must not implement app, backend, design, QA, or release work.
- Design owns design quality and implementation-ready mobile UX handoff. It must not make Product/Planning the design-quality approver.
- Mobile Architect owns architecture, route/state/runtime/API impact review, and releaseability risk. It must not absorb Mobile App Dev or Backend/API Integrator implementation ownership.
- Mobile App Dev owns tests-first Expo React Native implementation from approved tasks. It must not invent API contracts or duplicate schemas outside `packages/contracts`.
- Backend/API Integrator owns mobile-facing contracts, mocks, fixtures, auth/session behavior, error mapping, and approved backend/API delivery. It must not implement native UI.
- QA/Release owns evidence planning, execution, failure classification, and release-risk reporting. It must not accept failed-gate risk or replace Product/Planning/human decisions.
- Release Gatekeeper (System) consumes required checks and emits deterministic pass/fail. It must not perform LLM judgment.

## Reviewer Boundary

Every read-only reviewer must cite sources, avoid file edits, and avoid recursive delegation. A read-only reviewer can identify findings but cannot approve failed gates, accept human-gate risk, or become the implementation owner.

## Generalization

For a different organization, rewrite the role names and domain responsibilities, but preserve:

- one owner per decision surface,
- one producer per required artifact,
- explicit handoff receiver,
- clear do-not-do boundary,
- evidence owner,
- human-gate trigger,
- deterministic gate separation.
