# Mobile App Dev Agent Runtime Specification

Date: 2026-06-15

This document specifies how an OpenClaw/Codex agent that has
`mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md` must set itself up
and operate after reading `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`.

The scope is Mobile App Dev only.

## Purpose

The goal is to let a Mobile App Dev role agent move from its SOUL identity to
the correct pod-native setup path, repo-local implementation workflow skill,
reviewers, durable artifacts, Design/API/architecture gates, evidence
requirements, and stop conditions without guessing.

This document is not a new skill and not a feature implementation plan. It is an
operating specification and SoT-grounded risk report for the current
configuration.

## Runtime Surface Model

```text
repo source of pod-native skills
  mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/SKILL.md
        |
        | openclaw-pod-skills-sync
        v
pod runtime snapshot
  /workspace/skills/<slug>/SKILL.md

repo-local Codex runtime
  .agents/skills/<skill-name>/SKILL.md
  .codex/agents/<agent-name>.toml
```

Rules:

- Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime.
- Their source of truth is under
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`.
- Repo-local Codex skills must remain under `.agents/skills/`.
- Repo-local Codex custom agents must remain under `.codex/agents/`.
- Do not put repo-local Codex skill or custom-agent artifacts in the pod-native
  skill tree.

## Mobile App Dev Identity

The Mobile App Dev role has names that must not be confused:

| Layer | Value |
| --- | --- |
| Display Title | Mobile App Developer |
| Operating Role | Mobile App Dev |
| Canonical pod/runtime slug | mobile-app-dev |

The canonical slug used for workflow routing is:

```text
mobile-app-dev
```

The agent must not write display titles or operating-role labels such as
`Mobile App Developer` or `Mobile App Dev` to pod runtime role identity surfaces
when a canonical slug is required.

## Role Identity Surfaces

The current pod setup contract recognizes these role identity surfaces:

```text
WM_ROLE
WM_EXPECTED_ROLE
/workspace/IDENTITY
```

Required Mobile App Dev setup command:

```bash
role_slug="mobile-app-dev"
PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}" \
PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md" \
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
source /workspace/state/project-bootstrap-role.env
```

The agent must pass the exact canonical slug as `PROJECT_BOOTSTRAP_ROLE_SLUG`.
`project-bootstrap-agent-setup.sh` validates the selected slug and writes
`WM_ROLE`, `WM_EXPECTED_ROLE`, and `/workspace/IDENTITY`. The agent must not
write those identity surfaces directly as a substitute for the setup script.

Operational meaning:

- `WM_ROLE` is the primary environment role identity after the generated
  `/workspace/state/project-bootstrap-role.env` file is sourced.
- `/workspace/IDENTITY` is a file fallback and cross-process persisted identity
  written by the setup script.
- `WM_EXPECTED_ROLE` is a guardrail written by the setup script and must match
  the resolved role when set.

This is intentionally redundant. The redundancy prevents a pod, wrapper,
bootstrap script, or resumed process from silently running with the wrong role.
If multiple surfaces are configured, they must resolve to the same canonical
slug.

If `WM_ROLE`, `/workspace/IDENTITY`, the pod SOUL, or `WM_EXPECTED_ROLE` point to
different canonical roles, the agent must report `blocked` with a role mismatch
reason and must not invoke repo-local Mobile App Dev skills.

## Normal Setup Flow

The normal user-facing setup path is:

```text
git clone or git pull
        |
        v
openclaw-pod-skills-sync
        |
        v
project-bootstrap
        |
        +-- verifies required pod skills
        +-- runs/uses status-only readiness checks
        +-- performs agent-owned non-secret setup
        +-- reports remaining human/platform blockers
        |
        v
codex-role-workflow
        |
        v
repo-local Mobile App Dev workflow skill
```

Important distinction:

- `openclaw-pod-skills-sync` is the normal sync step after clone or pull.
- `project-bootstrap` is the normal project readiness entry point.
- `codex-cli-auth-setup`, `pod-role-bootstrap`, and `codex-role-workflow` are
  required Mobile App Dev pod-native skills.
- `codex-role-workflow` resolves the allowed repo-local skill, reviewers,
  durable artifact stage, stop conditions, and status-only next action.

## Managed Repo SoT Path Resolution

When a pod-native skill runs from `/workspace/skills/<slug>/SKILL.md`, it is
outside the managed project repository. The agent must not resolve repo SoT paths
relative to `/workspace/skills`.

Resolve SoT from the managed project repository root. In the standard pod
runtime, that root is:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

The Mobile App Dev role must read current repo SoT before routing or producing
implementation artifacts. Required SoT includes:

- `mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md`
- `mobile-app-dev-team/organization/team-composition.md`
- `mobile-app-dev-team/organization/role-capability-matrix.md`
- `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md`
- `mobile-app-dev-team/governance/gates-and-evidence.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- `mobile-app-dev-team/workflows/github-artifact-workflow.md`
- `mobile-app-dev-team/workflows/entry-case-routing.md`
- `PROJECT_ENVIRONMENT.md`
- `.agents/skills/mobile-app-dev-workflow/SKILL.md`
- `.codex/agents/wm-implementation-reviewer.toml`
- `.codex/agents/wm-contract-reviewer.toml`
- `.codex/agents/wm-docs-researcher.toml`

If any required SoT cannot be read, the agent must report that part as unknown
or blocked. It must not infer implementation policy from memory.

## Role Routing

Mobile App Dev does not receive work directly from chat. It receives an approved
execution task or a deterministic durable work-unit next action.

The allowed repo-local Codex skill is:

```text
mobile-app-dev-workflow
```

The required reviewers are:

```text
wm-implementation-reviewer
wm-contract-reviewer
```

Use `wm-docs-researcher` only for read-only technical uncertainty research. It
is advisory and is not a verdict-producing reviewer.

The durable artifact stage is:

```text
docs/plans/work-units/<work-unit-id>/04-mobile-app/
```

## Mobile App Dev Outputs

Mobile App Dev owns tests-first Expo React Native implementation for approved
tasks. It produces app implementation evidence only inside the approved scope.

Managed outputs under `04-mobile-app` are:

- `implementation-summary.md`
- `test-plan.md`
- `selector-changes.md`
- `api-integration-note.md`
- `command-output.md`
- `reviewer.md`

Actual mobile code remains in `apps/mobile`. Command output must include exit
status.

## Required Inputs Before Implementation

Mobile App Dev may start implementation only after the following inputs are
available or explicitly marked not applicable by the owning role:

- approved execution task;
- accepted non-goals and scope boundaries from Product/Planning;
- Design handoff when layout, interaction, or visual hierarchy matters;
- selected Design option and five-state matrix for UI work;
- API contract, approved mocks/fixtures, or explicit API non-goal;
- Mobile Architect handoff when route/state/runtime/dependency/releaseability
  risk exists;
- evidence requirement and expected commands;
- stable selector impact statement.

If any required input is missing, the role must stop and route back to the
owning role instead of guessing.

## Design Boundary

When UI layout, interaction, or visual hierarchy matters, Mobile App Dev must
not implement from chat text or ASCII descriptions alone.

Required Design readiness for UI work:

- P0 before Stitch generation;
- exactly two Stitch options;
- P1 before HTML/image extraction;
- committed publication artifacts;
- selected Design option;
- default, loading, empty, error, and permission-denied states in the five-state
  matrix;
- design-reviewer evidence.

Missing Design handoff blocks UI implementation. Missing selected Design option
or five-state matrix blocks UI implementation.

## Contract Boundary

Mobile App Dev implements against approved API contracts. It does not own
backend service behavior or API schema design.

Contract rules:

- `packages/contracts` is the single source of truth for shared API/domain
  schemas and request/response types.
- Mobile App Dev consumes approved mocks/fixtures until the real API is
  confirmed.
- Backend/API Integrator owns mobile-facing API contracts, service/API behavior,
  mocks, fixtures, auth/session, and error mapping.
- API-backed implementation must stop or route back when the API contract,
  fixture, auth/session behavior, error mapping, or mock-vs-real alignment is
  missing or ambiguous.
- Contract drift discovered during implementation must route to
  Backend/API Integrator and `wm-contract-reviewer`, not be silently fixed in
  app code.
- `04-mobile-app/api-integration-note.md` records API integration evidence and
  handoff. It does not create new schema ownership.

Missing API contract blocks API-backed implementation. The Mobile App Dev agent
must not invent contracts outside `packages/contracts`, change `apps/api`,
database schema, migrations, Railway deployment, or backend runtime behavior.

## Implementation Boundary

Mobile App Dev implements only approved mobile scope.

Allowed implementation surface:

- Expo Router screens and navigation wiring inside approved scope;
- React Native primitives;
- NativeWind;
- semantic design tokens;
- stable kebab-case `testID` values;
- local component structure;
- tests, fixtures, selector checks, and evidence files required by the task.

Forbidden implementation surface:

- backend service behavior;
- API contract ownership;
- database schema or migrations;
- Railway operations;
- shadcn/ui for React Native screens;
- customer app config or secrets;
- external platform/runtime repositories;
- production submit or failed-gate risk acceptance;
- QA/Release readiness approval.

## Tests And Evidence

Mobile App Dev follows tests-first delivery. The agent must add or update the
narrowest proving test, fixture, selector check, or validator before
implementation changes.

Expected evidence depends on scope:

- L0 `jest`: unit, component, contract, and runtime checks.
- L1 `rn-web`: RN Web + Playwright for browser-reproducible flows.
- Mobile app code changes generally require `pnpm --filter mobile lint` and
  `pnpm --filter mobile test`.
- Mobile environment/runtime changes require `expo install --check`, mobile
  lint/test/doctor, and `codex mcp list` where applicable.
- RN Web evidence does not prove native behavior.
- Native behavior requires Maestro/mobile-mcp evidence when simulator, emulator,
  or device access is available.

QA/Release owns achieved evidence later. Mobile App Dev records implementation
evidence and handoff, but does not self-approve release readiness.

## Runtime Status And Output Contract

Mobile App Dev routing status uses the `codex-role-workflow/v1` contract.

Use exactly one of:

```text
status: ready | blocked | not_applicable
```

Required fields:

- `resolved_role`;
- `role_identity_source`;
- `entry_case`;
- `routing_reason`;
- `process_sot`;
- `allowed_repo_local_codex_skills`;
- `required_reviewers`;
- `durable_artifact_stage`;
- `readiness_state_or_required_gate`;
- `blocked_reason` when status is `blocked`;
- `not_applicable_reason` when status is `not_applicable`;
- `human_gate_or_external_proof_blocker`;
- `next_action`;
- `secret_safety_statement`;
- `external_proof_boundary`.

## Current-Configuration Risk Report

If this Mobile App Dev configuration is applied as-is, these are the expected
blockers and failure modes:

| Condition | Required behavior |
| --- | --- |
| Missing accepted execution task or durable next action | missing accepted task blocks Mobile App Dev work. |
| UI work without committed Design handoff | missing Design handoff blocks UI implementation. |
| UI work without selected option or states | missing selected Design option or five-state matrix blocks UI implementation. |
| API-backed work without contract SoT | missing API contract blocks API-backed implementation. |
| No test-first proof exists | missing test-first evidence blocks implementation. |
| Selector change lacks aligned app/Jest/Maestro updates | selector changes without app, Jest, and Maestro alignment block handoff. |
| Route/state/runtime/dependency/releaseability risk lacks architecture handoff | route/state/runtime risk without Mobile Architect handoff blocks implementation. |
| Required command fails | failed gate remains failed until the owner fixes and reruns it. |
| Reviewer evidence missing | missing reviewer evidence blocks Done. |
| Request for native/external proof from local checks | Report boundary; local validation does not prove native behavior, mobile-mcp, Maestro, EAS, GitHub branch protection, store submission, or production readiness. |

## Stop Conditions

The Mobile App Dev agent must stop when:

- role identity is missing or mismatched;
- required pod-native skills are missing;
- accepted Product/Planning task or durable work-unit handoff is missing;
- Design handoff, selected option, state matrix, or `design-reviewer` evidence is
  missing for UI work;
- API contract, approved mock/fixture, auth/session behavior, error mapping, or
  mock-vs-real alignment is missing for API-backed work;
- route/state/runtime/dependency/releaseability risk lacks Mobile Architect
  handoff;
- test-first evidence is missing;
- required verification fails;
- secrets or credential values would be printed;
- production-submit, payment, privacy, legal, external messaging, or
  failed-gate-risk requires `human-gate/v1`;
- reviewer evidence is missing;
- external proof is being requested from local evidence.

## Minimal Mobile App Dev Runtime Output

When routing Mobile App Dev work, the agent should produce a compact status
record with:

```text
schema: codex-role-workflow/v1
resolved_role: Mobile App Dev
role_identity_source: WM_ROLE | /workspace/IDENTITY | pod SOUL
canonical_slug: mobile-app-dev
entry_case: direct_implementation_language
routing_reason: accepted task packet plus READY_FOR_EXECUTION or durable next action
process_sot:
  - mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md
  - mobile-app-dev-team/workflows/entry-case-routing.md
  - mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md
  - mobile-app-dev-team/governance/gates-and-evidence.md
  - mobile-app-dev-team/workflows/github-artifact-workflow.md
  - PROJECT_ENVIRONMENT.md
allowed_repo_local_codex_skills:
  - mobile-app-dev-workflow
required_reviewers:
  - wm-implementation-reviewer
  - wm-contract-reviewer
durable_artifact_stage: 04-mobile-app
readiness_state_or_required_gate: <accepted task, Design/API/architecture/evidence state, or human gate>
blocked_reason: <required when status is blocked>
not_applicable_reason: <required when status is not_applicable>
human_gate_or_external_proof_blocker: <gate or external proof blocker, or none>
next_action: <bounded next step>
secret_safety_statement: secrets were not printed or persisted
external_proof_boundary: local evidence does not prove native behavior or external platforms
```

## Other Role Runtime Reports

This Mobile App Dev report is the fourth one-document checkpoint after
Product/Planning, Design, and Mobile Architect received reviewer GO. It is one document
in the role-by-role report sequence. Do not create Backend/API
Integrator or QA/Release runtime reports until this Mobile App Dev report has
passed validation and received reviewer GO.

Each later report must cite the relevant role SOUL, pod-native skill matrix,
`codex-role-workflow`, work-process and gate SoT, role-specific repo-local
skills, required reviewers, durable artifact stage, evidence requirements, stop
conditions, external proof boundary, and any problem found under the current
configuration.

Do not treat the future role reports as pod-native skills unless a later SoT
explicitly creates a `/workspace/skills/<slug>/SKILL.md` runtime shape for them.
They are analysis/report documents unless separately promoted through an
approved skill-creation workflow.

## Reviewer Status

The plan for this Mobile App Dev runtime specification received GO from
`wm-implementation-reviewer` for workflow, mobile implementation boundary,
evidence, and one-document sequencing. It also received bounded plan GO from
`wm-contract-reviewer` for API usage and `packages/contracts` boundary claims.
