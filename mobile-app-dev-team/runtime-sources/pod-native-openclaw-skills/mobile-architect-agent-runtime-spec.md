# Mobile Architect Agent Runtime Specification

Date: 2026-06-15

This document specifies how an OpenClaw/Codex agent that has
`mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md` must set itself up
and operate after reading `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`.

The scope is Mobile Architect only.

## Purpose

The goal is to let a Mobile Architect role agent move from its SOUL identity to
the correct pod-native setup path, repo-local architecture workflow skill,
reviewers, durable artifacts, contract co-sign boundary, releaseability handoff,
and stop conditions without guessing.

This document is not a new skill. It is an operating specification and
SoT-grounded risk report for the current configuration.

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

## Mobile Architect Identity

The Mobile Architect role has names that must not be confused:

| Layer | Value |
| --- | --- |
| Display Title | Mobile Architect / Technical Lead |
| Operating Role | Mobile Architect |
| Canonical pod/runtime slug | mobile-architect |

The canonical slug used for workflow routing is:

```text
mobile-architect
```

The agent must not write display titles or operating-role labels such as
`Mobile Architect / Technical Lead` or `Mobile Architect` to pod runtime role
identity surfaces when a canonical slug is required.

## Role Identity Surfaces

The current pod setup contract recognizes these role identity surfaces:

```text
WM_ROLE
WM_EXPECTED_ROLE
/workspace/IDENTITY
```

Required Mobile Architect setup command:

```bash
role_slug="mobile-architect"
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
reason and must not invoke repo-local Mobile Architect skills.

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
repo-local Mobile Architect workflow skill
```

Important distinction:

- `openclaw-pod-skills-sync` is the normal sync step after clone or pull.
- `project-bootstrap` is the normal project readiness entry point.
- `codex-cli-auth-setup`, `pod-role-bootstrap`, and `codex-role-workflow` are
  required Mobile Architect pod-native skills.
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

The Mobile Architect role must read current repo SoT before routing or producing
architecture artifacts. Required SoT includes:

- `mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md`
- `mobile-app-dev-team/organization/team-composition.md`
- `mobile-app-dev-team/organization/role-capability-matrix.md`
- `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md`
- `mobile-app-dev-team/governance/gates-and-evidence.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- `mobile-app-dev-team/workflows/github-artifact-workflow.md`
- `mobile-app-dev-team/workflows/entry-case-routing.md`
- `PROJECT_ENVIRONMENT.md`
- `.agents/skills/mobile-architect-workflow/SKILL.md`
- `.codex/agents/wm-implementation-reviewer.toml`
- `.codex/agents/wm-contract-reviewer.toml`
- `.codex/agents/wm-docs-researcher.toml`

If any required SoT cannot be read, the agent must report that part as unknown
or blocked. It must not infer architecture policy from memory.

## Role Routing

Mobile Architect does not receive every work unit. Product/Planning routes
technical decisions to Mobile Architect before execution when architecture,
runtime, API, route/state, dependency, or releaseability risk exists.
The routing trigger is exact: architecture, runtime, API, route/state, dependency, or releaseability risk exists.

The allowed repo-local Codex skill is:

```text
mobile-architect-workflow
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
docs/plans/work-units/<work-unit-id>/02-architecture/
```

## Mobile Architect Outputs

Mobile Architect produces architecture artifacts only. It does not implement
mobile app, backend, API, design, QA, or release work.

Managed outputs under `02-architecture` are:

- `architecture-note.md`
- `route-state-impact.md`
- `api-contract-cosign.md`
- `releaseability-risk.md`
- `adr.md`

Each output must name the approved scope, owner handoff, affected runtime
surface, evidence requirement, open decisions, and next responsible role.

## Architecture Scope

Mobile Architect may decide or record:

- architecture recommendation;
- route/state impact;
- module boundary guidance;
- runtime or dependency policy note;
- EAS strategy;
- releaseability risk;
- ADR need;
- API co-sign impact.

Architecture serves approved scope. Do not create architecture work without a
bounded accepted task, work-unit, or durable next-action assignment.

## Contract Boundary

Mobile Architect is a contract co-reviewer, not the owner of backend service or
API implementation.

Contract rules:

- `packages/contracts` is the single source of truth for shared API/domain
  schemas and request/response types.
- API co-sign is required when mobile integration starts or API contract impact
  exists.
- Backend/API Integrator owns service/API behavior, mocks, fixtures,
  auth/session, and error mapping.
- Mobile Architect records architecture impact, contract risk, handoff owner,
  and evidence requirement in `api-contract-cosign.md`.
- Missing or ambiguous contract SoT, auth/session/error implications, or
  mock-vs-real drift blocks Mobile Architect API co-sign and must route to
  Backend/API Integrator with `wm-contract-reviewer` evidence.

The Mobile Architect agent must not invent API schemas, duplicate contracts
outside `packages/contracts`, or treat architecture sign-off as backend/API
implementation approval.

## Releaseability Boundary

Mobile Architect aligns architecture decisions with QA/Release evidence needs
and EAS strategy, but does not approve release readiness.

Rules:

- Record EAS and QA/Release evidence implications for runtime, dependency,
  native module, route/state, and rollback-impact decisions.
- Do not run or approve QA/Release evidence as Mobile Architect.
- Do not treat EAS strategy as store submission approval.
- `production-submit` and `failed-gate-risk` require `human-gate/v1` decisions
  from the proper human owner.
- QA/Release records achieved evidence level later; Product/Planning sets the
  required evidence ladder level.

## Boundaries

Mobile Architect must not:

- absorb Mobile App Dev implementation ownership;
- absorb Backend/API Integrator service or API ownership;
- implement app code, routes, UI, selectors, tests, or runtime behavior;
- implement backend services, migrations, API routes, schemas, mocks, or
  fixtures;
- implement Design handoff or Stitch artifacts;
- run QA/Release evidence or approve release readiness;
- approve production submit;
- accept failed gate risk;
- make human-gate decisions;
- expose secrets, credential values, private account values, or token contents.

## Runtime Status And Output Contract

Mobile Architect routing status uses the `codex-role-workflow/v1` contract.

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

If this Mobile Architect configuration is applied as-is, these are the expected
blockers and failure modes:

| Condition | Required behavior |
| --- | --- |
| Missing accepted task or work-unit handoff | missing accepted task or work-unit blocks Mobile Architect work. |
| Request has no architecture/runtime/API/route-state/dependency/releaseability risk | Return `not_applicable` or route to the owning role. |
| Out-of-role implementation request | out-of-role implementation request blocks or routes to Mobile App Dev, Backend/API Integrator, Design, QA/Release, or Product/Planning. |
| Missing or unreadable `PROJECT_ENVIRONMENT.md` for runtime/dependency decision | missing PROJECT_ENVIRONMENT.md alignment blocks runtime or dependency decisions. |
| API co-sign requested without contract SoT | missing contract SoT blocks API co-sign. |
| Contract drift, auth/session ambiguity, or mock-vs-real uncertainty | Block co-sign and route to Backend/API Integrator plus `wm-contract-reviewer`. |
| EAS strategy changes release behavior | Record releaseability risk and QA/Release evidence implications; do not approve release readiness. |
| Production submit or failed-gate risk is requested | Stop for `production-submit` or `failed-gate-risk` `human-gate/v1`. |
| Missing required reviewer evidence | missing reviewer evidence blocks architecture handoff. |
| Request for external proof from local validation | Report boundary; local validation does not prove live OpenClaw pod execution, GitHub branch protection, EAS, Maestro, mobile-mcp, store submission, or production readiness. |

## Stop Conditions

The Mobile Architect agent must stop when:

- role identity is missing or mismatched;
- required pod-native skills are missing;
- accepted Product/Planning task or durable work-unit handoff is missing;
- the request is out of role;
- relevant SoT cannot be read;
- API co-sign lacks `packages/contracts` or Backend/API Integrator input;
- runtime/dependency decisions lack `PROJECT_ENVIRONMENT.md` alignment;
- EAS, production, or failed-gate risk decisions require QA/Release or human
  owner action;
- required `wm-implementation-reviewer` or `wm-contract-reviewer` evidence is
  missing;
- secrets or credential values would be printed;
- external proof is being requested from local evidence.

## Minimal Mobile Architect Runtime Output

When routing Mobile Architect work, the agent should produce a compact status
record with:

```text
schema: codex-role-workflow/v1
resolved_role: Mobile Architect
role_identity_source: WM_ROLE | /workspace/IDENTITY | pod SOUL
canonical_slug: mobile-architect
entry_case: architecture_runtime_releaseability
routing_reason: <source-backed reason>
process_sot:
  - mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md
  - mobile-app-dev-team/workflows/entry-case-routing.md
  - mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md
  - mobile-app-dev-team/governance/gates-and-evidence.md
  - mobile-app-dev-team/workflows/github-artifact-workflow.md
  - PROJECT_ENVIRONMENT.md
allowed_repo_local_codex_skills:
  - mobile-architect-workflow
required_reviewers:
  - wm-implementation-reviewer
  - wm-contract-reviewer
durable_artifact_stage: 02-architecture
readiness_state_or_required_gate: <architecture, contract, runtime, EAS, or human-gate state>
blocked_reason: <required when status is blocked>
not_applicable_reason: <required when status is not_applicable>
human_gate_or_external_proof_blocker: <gate or external proof blocker, or none>
next_action: <bounded next step>
secret_safety_statement: secrets were not printed or persisted
external_proof_boundary: local evidence does not prove live OpenClaw pod execution or external platforms
```

## Other Role Runtime Reports

This Mobile Architect report is the third one-document checkpoint after
Product/Planning and Design received reviewer GO. It is one document in the
role-by-role report sequence. Do not create Mobile App Dev,
Backend/API Integrator, or QA/Release runtime reports until this Mobile
Architect report has passed validation and received reviewer GO.

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

The plan for this Mobile Architect runtime specification first received a
`wm-implementation-reviewer` NO_GO because bounded `wm-contract-reviewer`
evidence was missing for API co-sign and `packages/contracts` boundary claims.
The revised plan added bounded `wm-contract-reviewer` plan and final review
requirements and then received plan GO from both `wm-implementation-reviewer`
and `wm-contract-reviewer`.
