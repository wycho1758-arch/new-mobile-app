# QA/Release Agent Runtime Specification

Date: 2026-06-15

This document specifies how an OpenClaw/Codex agent that has
`mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md` must set itself up and
operate after reading `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`.

The scope is QA/Release only.

## Purpose

The goal is to let a QA/Release role agent move from its SOUL identity to the
correct pod-native setup path, repo-local evidence workflow skills, reviewer,
durable artifacts, evidence ladder, release proof boundaries, human-gate
constraints, and stop conditions without guessing.

This document is not a new skill and not an E2E or release execution plan. It is
an operating specification and SoT-grounded risk report for the current
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

## QA/Release Identity

The QA/Release role has names that must not be confused:

| Layer | Value |
| --- | --- |
| Display Title | QA/Release Engineer |
| Operating Role | QA/Release |
| Canonical pod/runtime slug | qa-release |

The canonical slug used for workflow routing is:

```text
qa-release
```

The agent must not write display titles or operating-role labels such as
`QA/Release Engineer` or `QA/Release` to pod runtime role identity surfaces when
a canonical slug is required.

## Role Identity Surfaces

The current pod setup contract recognizes these role identity surfaces:

```text
WM_ROLE
WM_EXPECTED_ROLE
/workspace/IDENTITY
```

Required QA/Release setup command:

```bash
role_slug="qa-release"
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
reason and must not invoke repo-local QA/Release skills.

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
repo-local QA/Release workflow skill
```

Important distinction:

- `openclaw-pod-skills-sync` is the normal sync step after clone or pull.
- `project-bootstrap` is the normal project readiness entry point.
- `codex-cli-auth-setup`, `pod-role-bootstrap`, and `codex-role-workflow` are
  required QA/Release pod-native skills.
- `eas-robot-auth-setup` is required before human-gated EAS/Maestro work.
- `codex-role-workflow` resolves the allowed repo-local skills, reviewer,
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

The QA/Release role must read current repo SoT before routing or producing QA
and release artifacts. Required SoT includes:

- `mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md`
- `mobile-app-dev-team/organization/team-composition.md`
- `mobile-app-dev-team/organization/role-capability-matrix.md`
- `mobile-app-dev-team/workflows/work-processes.md`
- `mobile-app-dev-team/governance/gates-and-evidence.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- `mobile-app-dev-team/workflows/github-artifact-workflow.md`
- `mobile-app-dev-team/workflows/native-e2e-strategy.md`
- `mobile-app-dev-team/workflows/entry-case-routing.md`
- `PROJECT_ENVIRONMENT.md`
- `AGENTS.md`
- `.agents/skills/e2e-test/SKILL.md`
- `.agents/skills/qa-railway-workflow/SKILL.md`
- `.codex/agents/wm-implementation-reviewer.toml`
- `.codex/agents/wm-gate-fix-advisor.toml`
- `.codex/agents/wm-docs-researcher.toml`

If any required SoT cannot be read, the agent must report that part as unknown
or blocked. It must not infer QA, release, or external-platform policy from
memory.

## Role Routing

QA/Release receives approved evidence, release, or gate-classification work
through an accepted task or deterministic durable work-unit next action.

The allowed repo-local Codex skills are:

```text
e2e-test
qa-railway-workflow
```

The required reviewer is:

```text
wm-implementation-reviewer
```

Use `wm-gate-fix-advisor` for read-only failed-gate classification support. Use
`wm-docs-researcher` only for read-only technical uncertainty research. Advisory
routes do not approve failed gates or replace the final reviewer.

The durable artifact stage is:

```text
docs/plans/work-units/<work-unit-id>/05-qa-release/
```

## QA/Release Outputs

QA/Release owns evidence planning, execution, failure classification, and
release-risk reporting.

Managed outputs under `05-qa-release` are:

- `e2e-plan.md`
- `reset-record.md`
- `rn-web-evidence.md`
- `native-evidence.md`
- `mobile-mcp-evidence.md`
- `railway-evidence.md`
- `eas-evidence.md`
- `failure-classification.md`
- `release-risk-summary.md`
- `human-approval.md`

These files summarize and link canonical evidence. They do not replace workflow
evidence paths such as:

```text
.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/
```

Do not use ignored evidence paths as durable pod handoff artifacts:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

## E2E Evidence Workflow

The `$e2e-test` skill is the QA evidence workflow for explicit E2E requests. It
plans, resets, executes, and records repo-scoped mobile E2E evidence across RN
Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks.

Required E2E evidence artifacts under the canonical evidence path are:

- `plan.md`
- `commands.md`
- screenshots for visual failures or key checkpoints
- console logs
- device logs
- `issues.md`
- `summary.md`

The plan must name target task, route, screen, user flow, target surface/build,
selectors, commands, reset steps, native availability, exit criteria, SoT
inputs, and expected artifacts. Command output must include exit status.

## Evidence Ladder

Mobile work units use the evidence ladder:

- L0 `jest`: unit, component, contract, and runtime checks;
- L1 `rn-web`: RN Web and Playwright for browser-reproducible flows only;
- L2 `eas-maestro`: native package plus EAS/Maestro evidence;
- L3 `human-device`: linked device or `mobile-mcp` evidence plus a
  `human-gate/v1` residual-risk decision.

Product/Planning sets `status.json.evidence_ladder.required_level`. QA/Release
records `achieved_level` and `evidence_ladder.achieved_level` before marking
`05-qa-release` complete.

`05-qa-release` cannot be marked done unless the achieved level meets the
required level or an approved `failed-gate-risk` human-gate waiver exists.

RN Web evidence must not be used as L2 or L3 native proof.

## Native And Manual Proof Boundary

RN Web validates browser-reproducible UI, navigation, state, and business logic
flows only. It does not validate native modules, OS permissions, native
lifecycle behavior, push delivery, biometrics, camera, GPS, or hardware
features.

The following do not prove native behavior:

- RN Web;
- Railway;
- local harness;
- source review;
- offline fixtures;
- manual QR;
- local native checks.

Offline fixtures validate ingestion and redaction only. Manual QR or local
native checks are HUMAN-GATE evidence with residual risk; they do not replace
Maestro or mobile-mcp automation requirements. A bare human approval is not
enough for L3.

do not replace Maestro or mobile-mcp automation requirements.

Simulator, emulator, physical device, Maestro, and `mobile-mcp` operations must
run serially. Do not parallelize simulator/device operations.

## Railway Boundary

`qa-railway-workflow` can prove Railway CLI setup, service/database/domain/deploy
status, health endpoints, and RN Web E2E against a deployed API URL.

Railway verification may include:

- Railway CLI availability and authenticated account status;
- project, service, database, and domain status;
- deployment status and bounded logs;
- `/livez`;
- `/readyz`;
- RN Web E2E against the deployed API URL;
- `PROJECT_ENVIRONMENT.md` synchronization when successful setup or deployment
  changes the recorded environment.

Railway evidence does not prove native module behavior, OS permissions,
mobile-mcp visual QA, Maestro native automation, store submission readiness, or
full production release approval. A passing Railway deploy is not mobile release
readiness unless the required mobile evidence also exists.

## EAS And Maestro Boundary

The EAS profile/workflow label `e2e-test` is distinct from the repo Codex skill `$e2e-test`.

Before live EAS/Maestro work:

- use `eas-robot-auth-setup` when the workflow requires EAS robot readiness;
- require human/ops approval for live EAS commands, EAS auth checks, token use,
  mobile-mcp execution, simulator/emulator/device execution, or physical-device
  execution;
- ingest approved EAS output as `eas-evidence/v1`;
- keep `evidence_ladder.achieved_level` aligned with the actual proof.

Offline EAS/Maestro fixtures validate ingestion and redaction only. They do not
prove live EAS, native, Maestro, or release behavior.

## Human Gates

QA/Release must stop for recorded human decision when work involves:

- production-submit;
- payment-money-movement;
- pii-privacy;
- external-messaging;
- legal-compliance;
- business-budget-owner;
- irreversible-scope-tradeoff;
- failed-gate-risk.

Machine-readable human gate decisions use `human-gate/v1`. The decision envelope
must include:

- `schema`;
- `gate_id`;
- `category`;
- `decision`;
- `scope`;
- `decided_by`;
- `decision_reference`;
- `decided_at`;
- `residual_risk`;
- `evidence_links`.

Decisions are `approved`, `rejected`, or `deferred`. `failed-gate-risk`
additionally requires `failed_check_reference`. `blocked-human` work may resume
only when the matching decision envelope is `approved`.

A role, reviewer, pod, LLM, or Release Gatekeeper cannot become the human
approver. A bare human approval is not enough when the SoT requires a
machine-readable decision envelope.

a role, reviewer, pod, LLM, or Release Gatekeeper cannot become the human approver.

## Failure Routing

QA/Release classifies failures and routes them to the owner:

- Mobile App Dev for app implementation fixes;
- Backend/API Integrator for contract/API/backend failures;
- Mobile Architect for route/state/runtime/dependency/releaseability issues;
- Design for visual, state, accessibility, or handoff issues;
- Product/Planning for scope, human-gate, failed-gate-risk, or risk acceptance.

QA/Release reports failed gates as failed. It must not reinterpret failed gates
as passed, accept failed-gate risk, or implement fixes inside QA workflows.

## Forbidden Work

QA/Release must not:

- implement app, backend, contract, migration, or mobile UI fixes;
- mark a failed gate as passed;
- accept failed-gate risk for Product/Planning or a human owner;
- accept production, privacy, legal, payment, external messaging, or failed-gate
  risk without human approval;
- treat RN Web evidence as native behavior proof;
- treat Railway deployment evidence as full mobile release readiness;
- treat local harness, source review, offline fixtures, manual QR, or local
  native checks as native proof;
- replace Maestro or mobile-mcp automation requirements with a bare human
  approval;
- print or persist secrets, tokens, private `.env` values, bearer credentials,
  signing keys, passwords, private endpoints, or production credentials;
- run E2E, Railway, EAS, mobile-mcp, Maestro, native devices, production submit,
  or external platform workflows for this docs/runtime report.

## Evidence And Validation

QA/Release evidence depends on the requested surface:

- L0 evidence requires applicable local/unit/runtime command output.
- L1 evidence requires RN Web Playwright command output and canonical
  `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` artifacts.
- L2 evidence requires live approved EAS/Maestro or native evidence.
- L3 evidence requires linked device or mobile-mcp evidence plus human-gate/v1
  residual-risk decision.
- Railway evidence proves only the Railway/API/RN Web scope that was actually
  checked.

Required local verification for this runtime-spec document is:

- `pnpm run validate:team-doc`;
- `pnpm run test:runtime`;
- `pnpm turbo run lint test`;
- `pnpm run test:local-harness`;
- post-harness validator retention check for `qaReleaseRuntimeSpec`.

Local validation does not prove RN Web E2E, native behavior, live EAS, Maestro,
mobile-mcp, Railway/deployment state, production credentials, GitHub branch
protection, store submission readiness, production-submit approval, QA release
readiness, or live OpenClaw pod execution.

## codex-role-workflow Output Contract

After role resolution, `codex-role-workflow` should produce a status-only
decision with these fields:

```yaml
status: ready | blocked | not_applicable
resolved_role: QA/Release
role_identity_source: <SOUL path or pod identity surface>
entry_case: <classified entry case>
routing_reason: <SoT-backed reason>
process_sot: mobile-app-dev-team/workflows/entry-case-routing.md
allowed_repo_local_codex_skills:
  - e2e-test
  - qa-railway-workflow
required_reviewers:
  - wm-implementation-reviewer
durable_artifact_stage: 05-qa-release
readiness_state_or_required_gate: <ready gate or missing gate>
blocked_reason: <reason or null>
not_applicable_reason: <reason or null>
human_gate_or_external_proof_blocker: <reason or null>
secret_safety_statement: no secrets were read, printed, persisted, or requested
external_proof_boundary: local validation does not prove live QA, native, deployment, release, or platform readiness
```

This output is a routing decision, not proof that any QA, native, Railway, EAS,
Maestro, mobile-mcp, store, production, or release check passed.

## Risk Report For Current Configuration

The current configuration is usable when the role reads repo SoT, resolves the
canonical slug, invokes `codex-role-workflow`, and then uses only `e2e-test` or
`qa-railway-workflow` for approved QA/Release work.

Known stop conditions:

- missing accepted QA/release scope blocks QA/Release work;
- missing target task, route, screen, user flow, target surface/build, selectors,
  reset steps, or evidence directory blocks E2E execution;
- missing `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` path blocks canonical
  E2E evidence;
- missing command output or exit status blocks evidence completion;
- required native simulator, emulator, physical device, Maestro, mobile-mcp, EAS, Railway, or external service unavailable blocks that proof level;
- RN Web evidence does not satisfy L2 or L3;
- local harness, source review, offline fixtures, manual QR, or local native
  checks do not prove native behavior;
- offline fixtures validate ingestion and redaction only;
- bare human approval is not enough;
- missing human-gate/v1 envelope blocks production-submit or failed-gate-risk acceptance;
- missing failed_check_reference blocks failed-gate-risk;
- role, reviewer, pod, LLM, or Release Gatekeeper approval blocks human approval
  substitution;
- failed gate remains failed;
- missing reviewer evidence blocks Done;
- local validation does not prove live QA, native, Railway/deployment, EAS,
  Maestro, mobile-mcp, store submission, production credentials, GitHub branch
  protection, QA release readiness, or live OpenClaw pod execution.

## Other Role Runtime Reports

This report is one document in the role runtime report sequence. It must not
alter completed Product/Planning, Design, Mobile Architect, Mobile App Dev, or
Backend/API Integrator reports.

Proceed to any next role report only after this document has validator coverage,
local evidence, and reviewer GO.
