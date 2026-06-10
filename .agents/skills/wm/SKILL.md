---
name: wm
description: Use only when explicitly invoked as $wm or /wm to run the WonderMove mobile repo workflow for scoped planning, tests-first implementation, read-only Codex review evidence, and branch/PR gate readiness in this repository. Do not use for generic Expo/RN advice, external runtime repository edits, or self-approval; route review-only requests to read-only custom agents.
---

# wm

Use this repo-local WonderMove workflow only when the user explicitly invokes `$wm` or `/wm`.

Review-only requests MUST route to the read-only custom agents without triggering write-side implementation.

## Operating Rules

- `$wm` / `/wm` MUST plan before non-trivial work: clarify scope, owner, affected paths, expected tests, evidence path, and gate impact before editing.
- `$wm` / `/wm` plans MUST use SoT-grounded planning: cite or name the verified Source of Truth inputs used for each material decision. If a required SoT cannot be read or verified, mark that part unknown or blocked; do not fill gaps with predictions, assumptions, or expected behavior.
- Stay read-only until the initial plan is established; proceed only when the user request calls for execution and required human gates are not blocking.
- Use Serena for symbolic navigation and bounded code lookup when it improves confidence. Use focused `rg` for repo search, and route review, research, or gate triage to the appropriate read-only custom agent.
- Follow TDD: write or update evals/tests/validator assertions before implementation changes.
- Keep changes inside this repository. Do not modify external platform/runtime repositories.
- Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
- Use `packages/contracts` as the single source of truth for shared API schemas and mobile-facing request/response types.
- Keep React Native UI on NativeWind, React Native primitives, and semantic design tokens.
- Preserve branch and PR workflow; do not push directly to `main`.

## Mandatory SoT And Review Gates

- Non-trivial implementation runs MUST NOT proceed past planning until the applicable local SoT has been read and cited or named in the plan.
- If applicable SoT is missing, unreadable, or ambiguous, mark the item unknown or blocked instead of proceeding from assumptions.
- Pre-implementation plan review evidence and final actual-work review evidence are mandatory for non-trivial implementation runs.
- The completed implementation plan must be reviewed by the appropriate read-only reviewer before implementation starts, unless the user explicitly requested planning-only and no repo edits will follow.
- The actual completed work must be reviewed by the appropriate read-only reviewer against the approved plan, git diff, command output, and evidence before Done.
- The headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.

## Workflow

1. Confirm the task is explicitly invoked with `$wm` or `/wm`.
2. For non-trivial work, produce a short SoT-grounded plan before implementation. Include scope, owner role, affected paths, expected tests, evidence path, gate impact, any human gate or handoff needed before execution, and the SoT sources used. A completed implementation plan must be reviewed by the appropriate read-only reviewer before implementation starts, unless the user explicitly requested planning-only and no repo edits will follow.
3. Identify the role boundary:
   - Mobile UI/runtime implementation: use `.agents/skills/mobile-app-dev-workflow/SKILL.md`.
   - Mobile-facing backend/API contract work: use `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`.
   - Review, docs research, or gate triage: call the relevant read-only custom agent.
4. Read the applicable local SoT before planning or editing: `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, and any relevant role `references/sot.md` file. Do not base plans on predictions, assumptions, or expected behavior when the SoT is missing or ambiguous.
5. Add or update the narrowest failing test, eval fixture, harness assertion, or validator check first.
6. Implement the smallest repo-scoped change that satisfies the test and respects ownership boundaries.
7. Run the applicable verification:
   - Runtime changes: `pnpm run test:runtime`.
   - Runtime path or harness changes: `pnpm run test:local-harness`.
   - Workspace code changes: `pnpm turbo run lint test`.
   - Mobile runtime changes: `pnpm --filter mobile exec expo install --check`, mobile lint/test/doctor, and local visual QA when a simulator or device is available.
8. After implementation and tests, actual completed work must be reviewed by the appropriate read-only reviewer against the approved plan, git diff, command output, and evidence before Done.
9. Record evidence under `.evidence/` or `evals/*/results/` for review, gate, harness, or QA proof. Persist plan-review and final-review evidence for every non-trivial implementation run.
10. Before the final user completion report, run `git diff` for the changed paths, check full `git status --short`, and include the material diff/change details in the completion report.

## Symbolic Navigation

Use Serena MCP for symbol overview, symbol lookup, reference search, and bounded code navigation. If Serena is unavailable, use focused `rg` and file reads, and record the degraded lookup path in evidence when it affects confidence.

## Read-Only Review Routing

Use `scripts/codex-headless-review.mjs` as one supported path for Codex headless high review evidence. The headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.

Allowed custom agents:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-gate-fix-advisor`
- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `po-docs-researcher`
- `design-reviewer`
- `design-researcher`

Reviewer/researcher outputs must include source references, must not edit files, and must not recursively delegate.

## Forbidden

- Using this workflow for generic Expo/RN questions that do not depend on this repo's SoT.
- Treating review-only prompts as write-side implementation work.
- Inventing API contracts outside `packages/contracts`.
- Treating hook reminders as the hard pass/fail gate.
- Accepting production, privacy, legal, payment, external messaging, or failed-gate risk without the required human gate.
- Writing `$wm` plans from predictions, assumptions, or expected behavior instead of verified SoT.
- Marking work done without command output, evidence path, or explicit blocked reason.
