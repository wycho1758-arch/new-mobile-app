---
name: mobile-app-dev-workflow
description: Use when implementing a repo-scoped Expo React Native change that depends on this project's contract, evidence, QA, role-boundary, or mobile PR rules. This thin write-side wrapper applies the Mobile App Dev SOUL.md role using the repo SoT domains for design handoff, API contract, QA evidence, and gatekeeper boundaries; it must not be used for review-only tasks, generic Expo/RN guidance, backend ownership, external platform/runtime repository changes, or self-approval.
---

# Mobile App Dev Workflow

Use this as a thin write-side role workflow for Mobile App Dev work in this repo.

Review-only tasks must use read-only reviewer agents or code-review mode instead of this implementation workflow.

## Required Inputs

- Task ID and target route/screen.
- Approved design handoff or explicit design gap.
- API contract, mock, or fixture path for API-backed work.
- Expected verification command and evidence location.
- Work-unit artifact path under `docs/plans/work-units/<work-unit-id>/04-mobile-app/`.
- Selected Design option, five-state matrix, API contract status, stable `testID` selector impact, and reviewer evidence path.

## Workflow

1. Confirm scope and ownership. Do not edit external platform/runtime repositories or backend/auth/payment code.
2. Read `references/sot.md` for the repo-local source map when task context is incomplete.
3. Produce a Codex Implementation Plan Packet before implementation and request the plan reviewer when the change is non-trivial.
4. Confirm design and API contract before implementation.
5. Write or update tests first.
6. Implement the smallest mobile change that satisfies the task.
7. Run the relevant test, lint/typecheck/build, or E2E evidence command.
8. Record evidence under `.evidence/` or `evals/*/results/` and report unresolved risks.
9. Request the final reviewer before reporting Done.
10. Run `git diff` for changed paths and `git status --short`; include the material change summary in the user report.

## Codex Implementation Plan Packet

Every implementation plan must include:

- work-unit ID and `04-mobile-app/` artifact path;
- route, screen, component, and state owner;
- selected Design option and Design handoff path;
- state matrix for default, loading, empty, error, and permission-denied states;
- API contract, mock, fixture, or handoff blocker;
- architecture note or Mobile Architect handoff when route/state/runtime risk exists;
- first test to add or update before implementation;
- stable `testID` selector impact;
- evidence path and commands;
- plan reviewer and final reviewer;
- non-goals, blockers, and human-gate risks;
- completion requirement to report `git diff` and `git status --short`.

If the selected Design option, state matrix, or API contract is missing, stop and hand off to the owning role instead of guessing.

## Forbidden

- Implementing backend contract changes silently.
- Expanding UX or route scope without a new task.
- Marking work done without test/evidence output.
- Treating hooks as the hard pass/fail gate; use deterministic scripts and CI for hard gates.
- Reporting completion before final reviewer evidence, `git diff`, and `git status --short`.

## Required Evals

- Positive: API-backed mobile screen implementation request triggers this skill.
- Negative: backend API design ownership request does not trigger this skill.
- Negative: review-only mobile implementation review request does not trigger this skill.
- End-to-end: design + contract + test evidence are all reflected in the final plan.
