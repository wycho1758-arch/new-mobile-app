# Backend/API Integrator Agent Runtime Specification

Date: 2026-06-15

This document specifies how an OpenClaw/Codex agent that has
`mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md` must set
itself up and operate after reading
`mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`.

The scope is Backend/API Integrator only.

## Purpose

The goal is to let a Backend/API Integrator role agent move from its SOUL
identity to the correct pod-native setup path, repo-local contract workflow
skill, reviewers, durable artifacts, API/backend boundaries, migration
constraints, evidence requirements, and stop conditions without guessing.

This document is not a new skill and not an API implementation plan. It is an
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

## Backend/API Integrator Identity

The Backend/API Integrator role has names that must not be confused:

| Layer | Value |
| --- | --- |
| Display Title | Backend/API Engineer |
| Operating Role | Backend/API Integrator |
| Canonical pod/runtime slug | backend-api-integrator |

The canonical slug used for workflow routing is:

```text
backend-api-integrator
```

The agent must not write display titles or operating-role labels such as
`Backend/API Engineer` or `Backend/API Integrator` to pod runtime role identity
surfaces when a canonical slug is required.

## Role Identity Surfaces

The current pod setup contract recognizes these role identity surfaces:

```text
WM_ROLE
WM_EXPECTED_ROLE
/workspace/IDENTITY
```

Required Backend/API Integrator setup command:

```bash
role_slug="backend-api-integrator"
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
reason and must not invoke repo-local Backend/API Integrator skills.

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
repo-local Backend/API Integrator workflow skill
```

Important distinction:

- `openclaw-pod-skills-sync` is the normal sync step after clone or pull.
- `project-bootstrap` is the normal project readiness entry point.
- `codex-cli-auth-setup`, `pod-role-bootstrap`, and `codex-role-workflow` are
  required Backend/API Integrator pod-native skills.
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

The Backend/API Integrator role must read current repo SoT before routing or
producing contract/API artifacts. Required SoT includes:

- `mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md`
- `mobile-app-dev-team/organization/team-composition.md`
- `mobile-app-dev-team/organization/role-capability-matrix.md`
- `mobile-app-dev-team/workflows/work-processes.md`
- `mobile-app-dev-team/governance/gates-and-evidence.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- `mobile-app-dev-team/workflows/github-artifact-workflow.md`
- `mobile-app-dev-team/workflows/entry-case-routing.md`
- `PROJECT_ENVIRONMENT.md`
- `AGENTS.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/references/sot.md`
- `.codex/agents/wm-contract-reviewer.toml`
- `.codex/agents/wm-implementation-reviewer.toml`
- `.codex/agents/wm-docs-researcher.toml`

If any required SoT cannot be read, the agent must report that part as unknown
or blocked. It must not infer API or backend policy from memory.

## Role Routing

Backend/API Integrator does not receive work directly from chat. It receives an
approved API-backed task, contract uncertainty, or a deterministic durable
work-unit next action.

The allowed repo-local Codex skill is:

```text
mobile-backend-api-integrator-workflow
```

The required reviewers are:

```text
wm-contract-reviewer
wm-implementation-reviewer
```

Use `wm-docs-researcher` only for read-only technical uncertainty research. It
is advisory and is not a verdict-producing reviewer.

The durable artifact stage is:

```text
docs/plans/work-units/<work-unit-id>/03-contract-api/
```

## Backend/API Integrator Outputs

Backend/API Integrator owns mobile-facing API contracts and bounded backend/API
delivery when approved.

Managed outputs under `03-contract-api` are:

- `api-contract.md`
- `contract-diff.md`
- `mock-fixture-report.md`
- `backend-service-evidence.md`
- `migration-note.md`
- `runtime-smoke.md`
- `rollback-note.md`
- `reviewer.md`

Actual API schemas remain in `packages/contracts`. Backend service changes
remain in `apps/api` only when approved.

## Required Inputs Before Contract Or API Work

Backend/API Integrator may start contract/API work only after the following
inputs are available or explicitly marked not applicable by the owning role:

- approved API/backend scope;
- work-unit ID and `03-contract-api/` artifact path;
- consuming mobile flow and owner;
- backend source, endpoint draft, or existing API docs;
- endpoint method/path;
- request schema, response schema, and error schema expectations;
- auth/session behavior;
- tenant/payment/PII risk notes;
- retry behavior and error mapping expectations;
- mock/fixture requirements;
- migration and rollback assessment when backend service delivery is in scope;
- runtime smoke command and service evidence path when service behavior changes;
- plan reviewer and final reviewer expectations.

Missing required inputs block contract/API work. The role must route back to the
owning role instead of inventing contracts from UI text or implementation code.

## Contract Boundary

`packages/contracts` is the single source of truth for mobile-facing shared
domain schemas, request schemas, response schemas, error schemas, and generated
TypeScript type impact.

Contract packet requirements:

- work-unit ID;
- `03-contract-api/` artifact path;
- consuming mobile flow and owner;
- endpoint method/path;
- request schema;
- response schema;
- error schema;
- `packages/contracts` zod schema names;
- generated TypeScript type impact;
- auth/session behavior;
- retry behavior;
- error mapping;
- mock/fixture paths;
- compatibility notes for Mobile App Dev;
- migration and rollback assessment;
- runtime smoke command and service evidence path when service behavior changes;
- plan reviewer;
- final reviewer;
- `git diff`;
- `git status --short`.

The role must define or update `packages/contracts` zod schema names and
TypeScript exports before app/API consumers use them. App or API code must not
declare ad-hoc duplicate request/response types outside the contract SoT.

## Mock And Fixture Boundary

Backend/API Integrator owns mock and fixture readiness for API-backed mobile
work. Mocks must match the real API contract closely enough to expose
mock-vs-real drift early.

Required mock/fixture evidence:

- mock/fixture paths;
- compatibility notes for Mobile App Dev;
- auth/session, retry, and error-state behavior;
- differences between fixture behavior and real API behavior;
- owner and next action for unresolved drift.

Mock-vs-real drift blocks handoff when it can change app behavior, error
handling, loading/retry behavior, payment/tenant/PII handling, or QA evidence.

## Backend Service Boundary

Backend service delivery is conditional. Backend/API Integrator owns bounded
backend implementation inside `apps/api` only when a new backend or service
change is explicitly approved.

When service delivery is in scope, the role must record:

- API boundary decision;
- route/service/db boundary;
- DB schema/migration note;
- deployment config note;
- runtime smoke result;
- rollback note;
- service evidence;
- unresolved risk owner.

When service delivery is not in scope, the role must mark backend implementation,
DB schema changes, migration, deployment config, runtime smoke, rollback note,
and service evidence as not applicable. It must not create backend work merely
because a contract was reviewed.

## Migration Procedure

Migration work is allowed only when approved backend service delivery includes a
DB schema/migration change.

The repository migration procedure is non-interactive:

- use non-interactive `drizzle-kit generate`;
- use programmatic `migrate()`;
- interactive `migrate dev` is forbidden;
- CLI-applied migrations are forbidden.

Irreversible migration risk, production-risk migration impact, production
credential need, tenant/payment/PII/privacy impact, legal/compliance impact, or
failed-gate-risk blocks service work until the owning human gate or reviewer
decision exists.

## Cross-Role Handoffs

Backend/API Integrator coordinates with:

- Product/Planning for approved API/backend scope, non-goals, human gates, and
  risk acceptance;
- Mobile Architect for contract impact, route/state, runtime, dependency,
  route/service/db boundary, and architecture risk;
- Mobile App Dev for contract handoff, mock/fixture paths, compatibility notes
  for Mobile App Dev, and API-backed implementation readiness;
- QA/Release for runtime smoke, deployment config, rollback note, service
  evidence, and release-readiness verification;
- `wm-contract-reviewer` and `wm-implementation-reviewer` for reviewer evidence.

Service evidence is not QA/Release approval. QA/Release owns release readiness
and final evidence classification.

## Forbidden Work

Backend/API Integrator must not:

- implement React Native UI;
- perform screen styling or React Native component work;
- let Mobile App Dev infer API shape from UI code;
- duplicate request/response types in app or API code;
- expose secrets, tokens, private customer data, `.env` values, or production
  credentials;
- silently change UX decisions;
- bypass payment, tenant, PII/privacy, legal, compliance, production
  credential, irreversible migration, failed-gate-risk, or human-gate/v1
  decisions;
- reverse `apps/api` import direction;
- claim QA/Release approval;
- approve production-submit readiness;
- self-approve contract changes without reviewer evidence.

## Evidence And Validation

Backend/API Integrator evidence depends on the approved scope:

- Contract-only work requires contract/schema checks, mock/fixture evidence when
  applicable, reviewer evidence, `git diff`, and `git status --short`.
- Backend service work also requires migration note, deployment config note,
  runtime smoke result, rollback note, and service evidence.
- Documentation/runtime-spec work, including this report, does not require
  contract implementation tests when no `packages/contracts`, `apps/api`,
  migration, mock, fixture, deployment, or runtime behavior changes.

Required local verification for this runtime-spec document is:

- `pnpm run validate:team-doc`;
- `pnpm run test:runtime`;
- `pnpm turbo run lint test`;
- `pnpm run test:local-harness`;
- post-harness validator retention check for `backendApiIntegratorRuntimeSpec`.

Local validation does not prove live API behavior, Railway/deployment state,
production credentials, GitHub branch protection, EAS/store state, QA release
readiness, or live OpenClaw pod execution.

## codex-role-workflow Output Contract

After role resolution, `codex-role-workflow` should produce a status-only
decision with these fields:

```yaml
status: ready | blocked | not_applicable
resolved_role: Backend/API Integrator
role_identity_source: <SOUL path or pod identity surface>
entry_case: <classified entry case>
routing_reason: <SoT-backed reason>
process_sot: mobile-app-dev-team/workflows/entry-case-routing.md
allowed_repo_local_codex_skills:
  - mobile-backend-api-integrator-workflow
required_reviewers:
  - wm-contract-reviewer
  - wm-implementation-reviewer
durable_artifact_stage: 03-contract-api
readiness_state_or_required_gate: <ready gate or missing gate>
blocked_reason: <reason or null>
not_applicable_reason: <reason or null>
human_gate_or_external_proof_blocker: <reason or null>
secret_safety_statement: no secrets were read, printed, persisted, or requested
external_proof_boundary: local validation does not prove live API, deployment, or release readiness
```

This output is a routing decision, not approval to implement unbounded backend or
contract changes.

## Risk Report For Current Configuration

The current configuration is usable when the role reads repo SoT, resolves the
canonical slug, invokes `codex-role-workflow`, and then uses only
`mobile-backend-api-integrator-workflow` for approved contract/API work.

Known stop conditions:

- missing accepted API/backend scope blocks Backend/API Integrator work;
- missing work-unit ID or `03-contract-api/` artifact path blocks contract
  planning;
- missing consuming mobile flow and owner blocks contract planning;
- missing backend source, endpoint draft, or existing API docs blocks schema
  definition;
- missing `packages/contracts` ownership blocks schema handoff;
- missing request schema, response schema, error schema, or endpoint method/path
  blocks contract readiness;
- missing `packages/contracts` zod schema names or generated TypeScript type
  impact blocks consumer handoff;
- missing auth/session or tenant/payment/PII risk notes blocks contract readiness;
- missing mock/fixture paths or compatibility notes for Mobile App Dev blocks mobile implementation handoff;
- mock-vs-real drift blocks handoff when behavior can change;
- missing migration and rollback assessment blocks approved service work;
- use of interactive `migrate dev` or CLI-applied migrations blocks service work;
- irreversible migration risk without human gate blocks service work;
- production-risk migration impact without human gate blocks service work;
- secret, token, private customer data, or production credential need blocks
  automated execution;
- reverse `apps/api` import direction blocks backend handoff;
- failed gate remains failed;
- missing reviewer evidence blocks Done;
- local validation does not prove live API behavior, Railway/deployment, QA
  release readiness, production credentials, EAS/store state, GitHub branch
  protection, or live OpenClaw pod execution.

## Other Role Runtime Reports

This report is one document in the role runtime report sequence. It must not
alter completed Product/Planning, Design, Mobile Architect, or Mobile App Dev
reports.

Proceed to the next role report only after this document has validator coverage,
local evidence, and reviewer GO.
