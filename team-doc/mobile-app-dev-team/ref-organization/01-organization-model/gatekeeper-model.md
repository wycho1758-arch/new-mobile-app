# Gatekeeper Model

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `team-doc/mobile-app-dev-team/01-team-composition.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`

Downstream consumers:

- Gate and evidence pages.
- Role contract pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-4-xhigh-20260610.md

## Model

Release Gatekeeper (System) is non-LLM and deterministic.

It is a required-check concept, not a person, custom agent, LLM practitioner, or reviewer.

## Invariants

- No Gatekeeper SOUL.md.
- Gatekeeper cannot replace human approval.
- Gatekeeper cannot accept failed-gate risk.
- Gatekeeper cannot reinterpret failed required checks.
- Gatekeeper records deterministic pass/fail from required evidence.

## Failure Handling

When a gate fails:

1. The failed check remains failed.
2. A read-only reviewer or advisor may classify the issue.
3. The owning implementation workflow fixes the issue.
4. QA/Release reruns or records evidence.
5. Product/Planning or a human owner handles rework caps, scope decisions, and failed-gate risk acceptance.
