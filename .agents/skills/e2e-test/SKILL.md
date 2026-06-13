---
name: e2e-test
description: Use when explicitly invoked as $e2e-test to plan, reset, execute, and record repo-scoped mobile E2E evidence across RN Web Playwright, Maestro, mobile-mcp, or manual HUMAN-GATE checks. This is a QA evidence workflow, not an app/backend implementation or bug-fix workflow, and must not be confused with the EAS build profile or workflow label named e2e-test.
---

# E2E Test

Use this repo-local QA workflow only when the user explicitly invokes `$e2e-test`.

This skill is separate from the EAS build profile or workflow label named `e2e-test`.

## Required Inputs

- Target task, route, screen, or user flow.
- Test layer: RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE.
- Target build or surface, including local web, simulator, emulator, physical device, or EAS artifact.
- Expected selectors, preferably stable kebab-case `testID` values.
- Evidence directory under `.evidence/e2e-test/`.

## Workflow

1. Read the relevant SoT before execution: `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `docs/SETUP.md`, and task-specific docs or prior evidence when present.
2. Create a bounded E2E test plan before running E2E. Include target surface/build, layer, routes/screens, selectors, commands, reset steps, canonical evidence path, expected screenshots/logs, native availability, exit criteria, and SoT inputs.
3. Initialize the tested instance before running the plan:
   - RN Web: start from a fresh Playwright browser context, clear storage/cookies, avoid stale `test-results`, and use deterministic public test env from the Playwright config when available.
   - Maestro or `mobile-mcp`: list available devices first, run simulator/device operations serially, and terminate, reinstall, relaunch, or reset app state when the target environment supports it.
   - Manual HUMAN-GATE: require the user to start a fresh app/session and record how the reset was performed.
4. Execute the plan exactly. If the plan changes, record the reason in evidence before continuing.
5. Record command output and exit status in `commands.md`.
6. For every problem, record objective evidence: screenshot path, console log or device log path when available, expected vs actual result, selector/screen/route, timestamp, environment/build details, and reproduction steps.
7. Write a final `summary.md` that states pass/fail status, untested native or hardware scope, residual risk, release proof limits, and whether follow-up implementation work is required.
8. Failed gate or failed gate risk acceptance requires Product/Planning or human approval; QA must not self-approve a failed gate or convert failed evidence into release readiness.
9. Request the final reviewer before reporting Done.
10. Report material `git diff` and full `git status --short` in the user summary.
11. Route fixes through `$wm` with the relevant implementation workflow. Do not fix app, backend, contract, or runtime defects inside this skill.

## Evidence

Use a unique path:

```text
.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/
```

Required artifacts:

- `plan.md`
- `commands.md`
- screenshots for visual failures or key checkpoints
- console logs and device logs when available
- `issues.md`
- `summary.md`

The canonical evidence path is the unique `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` directory for this run. Link every command, screenshot, log, issue, reviewer result, and residual risk from that path.

## Evidence Ladder

- L0 `jest`: unit/component/contract/runtime checks. This skill may link L0 evidence but does not replace the relevant test command.
- L1 `rn-web`: RN Web Playwright evidence for browser-reproducible UI, navigation, state, and business flows.
- L2 `eas-maestro`: EAS/Maestro native evidence. Use only after a live EAS run has been approved and completed; offline fixtures validate ingestion and redaction only.
- L3 `human-device`: linked device or `mobile-mcp` evidence plus a `human-gate/v1` residual-risk decision. A bare human approval is not enough.

For work units, Product/Planning sets `status.json.evidence_ladder.required_level` and QA/Release records `achieved_level`. Do not mark `05-qa-release` complete with RN Web evidence when L2 or L3 is required unless an approved `failed-gate-risk` waiver is linked.

## Boundaries

- RN Web E2E validates only browser-reproducible UI, navigation, state, and business logic flows.
- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or hardware features.
- Manual QR or local native checks are HUMAN-GATE evidence with residual risk; they do not replace Maestro or `mobile-mcp` automation requirements.
- Never hardcode customer app names, bundle IDs, API URLs, tokens, credentials, or private endpoints.
- Treat `EXPO_PUBLIC_*` values as public client configuration.
- Do not parallelize simulator or device operations.
- Do not report completion before final reviewer evidence, `git diff`, and `git status --short`.

## Required Evals

- Positive: explicit `$e2e-test` request triggers plan, reset, execution, and evidence requirements.
- Negative: generic Expo/RN E2E tool selection does not trigger this repo skill.
- Negative: review-only E2E evidence inspection does not trigger this skill.
