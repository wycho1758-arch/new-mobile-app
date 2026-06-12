# Computer Use And Tool Surfaces

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `mobile-app-dev-team/06-gates-and-evidence.md`
- `PROJECT_ENVIRONMENT.md`

Downstream consumers:

- Future tool adoption docs.
- QA and release evidence planning.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-3-xhigh-20260610.md

## Boundary

computer-use/tool surfaces are capability surfaces, not repository artifact paths by default.

They are not a repo-local Codex artifact unless a SoT says so.

## Required Fields For A Tool Surface

Every future computer-use/tool surface page should document:

- owner role or routing owner
- allowed use cases
- evidence boundary
- whether the surface is repo-local, pod-local, external, or human-gated
- required human gate, if the tool can affect production, privacy, legal, payment, external messaging, or failed-gate risk

## Current Examples

- Browser or computer-use interaction for local visual checks.
- `mobile-mcp` for local mobile visual QA/device automation when a simulator or device is available.
- Stitch for design handoff generation and extraction when Design workflow gates are satisfied.

## Evidence Boundary

Tool output is evidence only for the surface it actually exercised. RN Web evidence does not prove native module behavior. Railway deployment evidence does not prove full mobile release readiness. A human-gated action remains blocked until recorded human approval exists.
