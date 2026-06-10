# Failure Loop

Status: reusable template guidance
Source class: procedure
Upstream SoT:

- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`

Downstream consumers:

- Gate/evidence pages.
- Future work-unit failure handling.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-5-xhigh-20260610.md

## Procedure

1. Failed check remains failed.
2. `wm-gate-fix-advisor` or another read-only advisor may classify the failure.
3. The owning implementation workflow fixes the issue.
4. QA/Release reruns or records the relevant evidence.
5. Product/Planning or a human owner handles rework caps, scope decisions, and failed-gate risk acceptance.

## Rules

- Do not relabel a failed gate as passed.
- Do not let a reviewer become the implementation owner.
- Do not let QA/Release accept product risk.
- Do not let implementation roles accept failed-gate risk acceptance.
