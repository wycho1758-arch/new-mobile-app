---
name: mobile-app-dev-workflow
description: Use when implementing or reviewing an Expo React Native mobile feature, API-backed screen, navigation/state change, or evidence-producing mobile PR in the new mobile app repo. This thin wrapper sequences the Mobile App Dev SOUL.md role through the SoT mobile-design-handoff, mobile-api-contract, mobile-qa-release, and mobile-gatekeeper skills; it must not be used for backend ownership, openclaw-cloud changes, or self-approval.
---

# Mobile App Dev Workflow

Use this as a thin role workflow for Mobile App Dev work in this repo.

## Required Inputs

- Task ID and target route/screen.
- Approved design handoff or explicit design gap.
- API contract, mock, or fixture path for API-backed work.
- Expected verification command and evidence location.

## Workflow

1. Confirm scope and ownership. Do not edit `openclaw-cloud` or backend/auth/payment code.
2. Read `references/sot.md` for the Confluence SoT map when task context is incomplete.
3. Confirm design and API contract before implementation.
4. Write or update tests first.
5. Implement the smallest mobile change that satisfies the task.
6. Run the relevant test, lint/typecheck/build, or E2E evidence command.
7. Record evidence under `.evidence/` or `evals/*/results/` and report unresolved risks.

## Forbidden

- Implementing backend contract changes silently.
- Expanding UX or route scope without a new task.
- Marking work done without test/evidence output.
- Treating hooks as the hard pass/fail gate; use deterministic scripts and CI for hard gates.

## Required Evals

- Positive: API-backed mobile screen implementation request triggers this skill.
- Negative: backend API design ownership request does not trigger this skill.
- End-to-end: design + contract + test evidence are all reflected in the final plan.
