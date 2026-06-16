# Project Bootstrap Auth Gates Work Unit

Status: done.

This is the durable Git handoff for the local working plan at
`docs/plans/active/20260614-project-bootstrap-auth-gates-goal.md`. The active
plan path is intentionally gitignored and remains a local execution checklist.

## Objective

Make `project-bootstrap` fail closed when an OpenClaw agent pod is not actually
ready, and make pod-native setup reproducible from source:

- clone `https://github.com/Wondermove-Inc/new-mobile-app.git` to
  `/workspace/projects/Wondermove-Inc/new-mobile-app`;
- register pod-native OpenClaw skills from
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/` into `/workspace/skills`;
- ensure `/workspace/AGENTS.md` contains Project Workspace Defaults;
- block `project-bootstrap` when Railway, gcloud active account, Google ADC,
  Expo MCP auth, or Expo CLI login is absent.

## Decision

`codex-cli-auth-setup` and `project-bootstrap` stay logically separate.
`project-bootstrap` consumes
`/workspace/state/project-bootstrap-agent-setup-report.json` as a hard preflight
input. This keeps provider-session setup reusable while making the auth
readiness contract directly testable.

## Completion State

| Area | State | Evidence |
| --- | --- | --- |
| Runtime setup script | done | `project-bootstrap-agent-setup.sh` owns repo clone, skill registration, `/workspace/AGENTS.md` defaults, auth checks, install approval, and success-only `installed_exact`. |
| Preflight auth gate | done | `project-bootstrap-preflight.sh` blocks on missing/unreadable/blocked setup reports and distinct provider auth blockers. |
| Pod-role clone safety | done | `pod-bootstrap.sh` rejects token-bearing `REPO_CLONE_URL` before existing-checkout and clone recovery paths. |
| SoT docs and validators | done | `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `docs/CODEX_MCP_ENVIRONMENT.md`, project-bootstrap docs, pod-role docs, and `scripts/validate-team-doc.mjs` were updated. |
| Design prerequisite | not-applicable | `01-design/handoff-index.md` records no layout, interaction, visual hierarchy, design publication, or Stitch handoff scope. |
| Architecture prerequisite | required | `02-architecture/architecture-note.md` records the Expo SDK 56 patch dependency boundary and required verification. |
| API contract prerequisite | not-applicable | `03-contract-api/api-contract.md` records no `packages/contracts`, schema, auth/session, error mapping, or backend route scope. |
| Expo SDK 56 patch drift | done | Approved by `https://github.com/Wondermove-Inc/new-mobile-app/issues/18#issuecomment-4701146359`; updated only `@expo/metro-runtime`, `expo`, `expo-dev-client`, `expo-linking`, `expo-router`, `jest-expo`, `pnpm-lock.yaml`, and the matching `PROJECT_ENVIRONMENT.md` baseline. |

## Verification

Completed runtime/OpenClaw checks:

- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `node scripts/validate-team-doc.mjs`
- `node scripts/validate-repo-operations.mjs`
- `node scripts/validate-project-environment.mjs`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`
- `pnpm --filter mobile lint`
- `pnpm --filter mobile test`
- `git diff --check`

Completed Expo patch-remediation checks:

- `pnpm --filter mobile exec expo install --check`
- `pnpm --filter mobile run doctor`

## Reviewer Evidence

- `.evidence/reviews/20260614-project-bootstrap-auth-gates-red-review-v3-xhigh.md`:
  RED coverage GO.
- `.evidence/reviews/20260614-project-bootstrap-auth-gates-green-behavior-v2-xhigh.md`:
  behavior GO after success-only `installed_exact` hardening.
- `.evidence/reviews/20260614-project-bootstrap-auth-gates-sot-xhigh.md`:
  SoT/validator GO.
- `.evidence/reviews/20260614-project-bootstrap-auth-gates-final-v2-xhigh.md`:
  final GO with no Critical/High/Medium/Low findings.
- `.evidence/reviews/20260614-project-bootstrap-auth-gates-package-remediation-final-xhigh.md`:
  package remediation final GO with no Critical/High/Medium/Low findings.

## Human Gate

Package remediation was approved by GitHub issue comment
`https://github.com/Wondermove-Inc/new-mobile-app/issues/18#issuecomment-4701146359`
for exactly:

- `@expo/metro-runtime`
- `expo`
- `expo-dev-client`
- `expo-linking`
- `expo-router`
- `jest-expo`
- `pnpm-lock.yaml`

## Blocked Audit History

Earlier 2026-06-14 continuation requests did not include the required GitHub
decision URL, so package remediation stayed blocked at that time. Runtime/OpenClaw
auth-gate work remained complete and validated.

## Resume Attempt

The chat thread later approved the package update list, but the durable
work-unit could not leave `blocked-human` until a `human-gate/v1` decision file
referenced a GitHub issue comment or PR review URL. The required approval anchor
had to approve exactly:

- `@expo/metro-runtime`
- `expo`
- `expo-dev-client`
- `expo-linking`
- `expo-router`
- `jest-expo`
- `pnpm-lock.yaml`

Package files remained unchanged until that GitHub decision URL became available.

The approval text was repeated in chat without a GitHub decision URL. The
reviewer rechecked the state and returned NO_GO again because
`work-unit-next` still reports `human-gate-pending` and no package edit is
allowed.

The same chat approval was repeated again without a GitHub decision URL.
`work-unit-next` still reported `allowed_actions: []`, so work stayed blocked
on `human-gate-decision`.

The approval was then anchored in GitHub issue comment
`https://github.com/Wondermove-Inc/new-mobile-app/issues/18#issuecomment-4701146359`.
The human-gate decision file is
`00-product-planning/human-gates/expo-sdk-56-patch-dependency-approval.json`,
and package remediation may proceed within the approved scope.

Before package edits, reviewer required role prerequisite artifacts. Design and
API are explicitly not applicable. Architecture is required because dependency
patch remediation touches the runtime/dependency surface.

The package update installed:

- `@expo/metro-runtime`: `~56.0.15`
- `expo`: `~56.0.11`
- `expo-dev-client`: `~56.0.20`
- `expo-linking`: `~56.0.14`
- `expo-router`: `~56.2.10`
- `jest-expo`: `~56.0.5`

The lockfile was regenerated by Expo/pnpm. `PROJECT_ENVIRONMENT.md` was updated
for the Expo baseline fields enforced by `scripts/validate-project-environment.mjs`.

Package remediation verification completed:

- `pnpm --filter mobile exec expo install --check`
- `pnpm --filter mobile run doctor`
- `pnpm --filter mobile lint`
- `pnpm --filter mobile test`
- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness`
- `pnpm run validate:work-units`
- `pnpm run validate:evidence-hygiene`
- `git diff --check`
