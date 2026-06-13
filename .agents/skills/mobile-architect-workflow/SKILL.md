---
name: mobile-architect-workflow
description: Use when Mobile Architect must produce repo-scoped architecture planning, ADRs, route/state impact, module boundary, runtime/dependency policy, API co-sign, releaseability, or EAS strategy handoff without implementing app, backend, design, or QA work.
---

# Mobile Architect Workflow

Use this repo-local Codex skill for Mobile Architect work in this repository.

Review-only requests must use read-only reviewer agents or code-review mode instead of this write-side workflow.

## Required Inputs

- Approved task, PRD slice, or work-unit ID.
- Affected route, state owner, module boundary, dependency/runtime surface, or releaseability concern.
- Relevant Design handoff, API contract, QA evidence requirement, or Product/Planning non-goal.
- Expected artifact path under `docs/plans/work-units/<work-unit-id>/02-architecture/`.

## Workflow

1. Read the applicable SoT: `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, the work-unit files, and affected role artifacts.
2. Create a SoT-grounded architecture plan before edits. Include assumptions, unknowns, non-goals, owner handoff, evidence requirement, and a plan reviewer.
3. Ask `wm-implementation-reviewer` or `wm-contract-reviewer` to review the plan when the decision affects route/state, contracts, dependencies, runtime, EAS, or releaseability.
4. Produce only architecture artifacts: ADR, route/state impact note, module boundary note, runtime/dependency policy note, API co-sign note, EAS strategy note, or risk handoff.
5. Use `02-architecture/` as the durable artifact stage.
6. For API co-sign work, reference `packages/contracts`, auth/session/error implications, and Backend/API Integrator ownership.
7. For releaseability work, record EAS and QA/Release evidence implications without approving release readiness.
8. After the architecture artifact is complete, request the final reviewer before reporting Done.
9. Report material `git diff` and full `git status --short` in the completion summary.

## Boundaries

- Do not implement mobile UI, components, routes, tests, or app runtime behavior.
- Do not implement backend services, migrations, API routes, or contract schemas.
- Do not absorb Mobile App Dev, Backend/API Integrator, Design, Product/Planning, or QA/Release ownership.
- Do not approve failed gates, production submit, billing, privacy, legal, or external proof decisions.
- Do not expose credentials, tokens, `.env` values, private account data, or secret file contents.

## Required Output

- ADR or architecture note path in `02-architecture/`.
- route/state impact, module boundary, runtime/dependency policy, API co-sign, releaseability, or EAS decision as applicable.
- Owners and handoff targets: Product/Planning, Design, Mobile App Dev, Backend/API Integrator, QA/Release.
- Reviewer evidence path from `wm-implementation-reviewer`, `wm-contract-reviewer`, or `wm-docs-researcher` when used.
- Final reviewer verdict.
- `git diff` and `git status --short` summary.

## Required Evals

- Positive: Mobile Architect ADR or route/state impact request triggers this skill.
- Positive: API co-sign architecture request triggers this skill.
- Negative: Mobile App Dev implementation request does not trigger this skill.
- Negative: review-only architecture inspection does not trigger this skill.
