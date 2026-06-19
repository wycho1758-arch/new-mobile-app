# Entry Case Routing

This is managed-doc guidance (SoT priority 5) and does not supersede higher-priority SoT. Runtime enforcement is largely a deferred follow-up, with two deterministic slices already enforced in `scripts/lib/work-unit-machine.mjs`: a `01-design` stage in `not-applicable` state must carry `non-goal` evidence (see §P-1), and a `production-submit` `human-gate/v1` decision must carry `rollback_owner`/`rollback_plan` (see `governance/app-eas-ota-rollback-runbook.md`). The remaining governance stays managed-doc/process-owned.

This document is a navigational taxonomy for how an incoming user input is classified and routed to the correct skill, operating role, or human gate. Every routing claim below is grounded in an actual line of a higher-priority SoT file and cites it as `<path>` §<section>. Where the SoT does not define a state, the gap is named explicitly rather than filled.

## Common Entry Point

Every user input enters Product/Planning (Chief Product Officer (CPO) / Product Delivery Lead) intake first; no input routes directly to an execution role.

- The CPO / Product Delivery Lead receives the user request through Product/Planning (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 1).
- "Every user instruction enters Product/Planning intake first; this adapter may then size, triage, or hand off the request without bypassing readiness and gate checks" (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §PO Work-Unit Planning And Agent Sprint intro).

From intake the request branches on its clarity and size:

- Unclear -> run `po-requirement-office-hours` (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 2; `.agents/skills/po-requirement-office-hours/SKILL.md` §PO Requirement Office-Hours intro).
- Broad -> run `po-work-unit-planning-and-agent-sprint` for work-unit sizing (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 3; `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 3).
- Ready -> run `po-prd-to-execution` (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 4).
- Pre-execution -> run `po-planning-completeness-review` before execution begins (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 5; `.agents/skills/po-planning-completeness-review/SKILL.md` §PO Planning Completeness Review intro).

## SoT-Named Input Categories

These categories are explicitly named in the Product/Planning planning SoT and are the authoritative classification surface.

- **Modification request** — classify as `within-approved-scope`, `scope-change`, `human-gate`, or `non-goal` before any update packet (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 5).
- **Issue / bug / failure request** — classify as `bug-fix`, `failure/rework`, `release-evidence-gap`, `human-gate`, or `symptom-without-evidence` before owner handoff (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 6).
- **Direct implementation language** — check whether an accepted task packet exists and planning completeness is `READY_FOR_EXECUTION`; if so, hand off to the downstream owner skill without new decomposition, otherwise route to sizing or clarification first (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 7; readiness state `READY_FOR_EXECUTION` from `.agents/skills/po-planning-completeness-review/SKILL.md` §Workflow step 10).
- **Proactive report** — preserve no-auto-execution (no Jira issue, code change, scope change, or SOUL change is created automatically) and triage as `REJECT`, `NON_GOAL`, `BACKLOG_CANDIDATE`, `SPRINT_IMPROVEMENT`, `HUMAN_DECISION_REQUIRED`, or `RUNTIME_CAPABILITY_BLOCKED` (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow steps 8 and 12).
- **PRD routing by clarity/size**:
  - Broad detailed or broad apparently-usable PRD -> run work-unit sizing before PRD-to-execution; route only selected-slice unknowns to `po-requirement-office-hours`, then re-check the work-unit decision (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 3).
  - Ready PRD -> `po-prd-to-execution` (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 4).
  - Unclear request -> `po-requirement-office-hours`, which returns one readiness state of `READY_FOR_PRD_DECOMPOSITION`, `NEEDS_USER_CLARIFICATION`, `OUT_OF_SCOPE`, or `HUMAN_GATE_REQUIRED` (`.agents/skills/po-requirement-office-hours/SKILL.md` §Workflow step 6).

## Report-Derived Case Grouping (NOT SoT-named)

The following five operational cases are a **report-derived grouping** mapped onto the SoT-named categories above. They are **NOT** named cases in any SoT file; they exist only as a convenience overlay in this managed-doc. The authoritative classification remains the SoT-named categories in the previous section.

- **C1 — PRD delivery.** A ready, bounded PRD routes to `po-prd-to-execution` (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 4). A broad PRD routes to work-unit sizing first via `po-work-unit-planning-and-agent-sprint` (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 3).
- **C2 — Additional text request.** Maps to the **modification request** classification: `within-approved-scope`, `scope-change`, `human-gate`, or `non-goal` (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 5).
- **C3 — Error / bug text.** Maps to the **issue / bug / failure request** classification: `bug-fix`, `failure/rework`, `release-evidence-gap`, `human-gate`, or `symptom-without-evidence` (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 6). For a `bug-fix` that proceeds to implementation, add or update the narrowest failing test first (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §4 Implementation, step 4).
- **C4 — New feature WITH a screen.** Routes through the Design path: confirm the `DESIGN.md` decision, prepare the P0 scope/evidence packet, stop for Product/Planning P0 approval, generate exactly two Stitch options, prepare the P1 packet, stop for P1 approval, extract/publish HTML and image artifacts, then request `design-reviewer` before Mobile App Dev implementation begins (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §2 Design Readiness, steps 2-9; `.agents/skills/design-mobile-design-handoff/SKILL.md` §Workflow steps 2, 5, 6, 9, 14, 15, 16, 17, 19). The trigger for this path is that **layout, interaction, or visual hierarchy matters** — not merely that the feature "has a screen" (`.agents/skills/design-mobile-design-handoff/SKILL.md` §Workflow step 4).
- **C5 — New feature WITHOUT a screen.** Uses **relevance-based conditional routing**, NOT a fixed path:
  - Mobile Architect / Technical Lead is involved **only** when architecture, runtime, API, route/state, dependency, or releaseability risk exists (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 6).
  - Backend/API Integrator is involved **only** when there is an API-backed task or contract uncertainty (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §3 API Readiness, step 1).
  - Implementation is **always** carried out through the owning operating role; do not delegate implementation to a write-capable executor (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §4 Implementation, step 5).
  - NOTE: the SoT does not itself define a Design `not-applicable` criteria for the no-screen case. This managed-doc fills that gap as decided guidance (see §P-1 below).

## Expanded Routing (E1-E16)

| Case | Owner / Route | SoT Citation |
| --- | --- | --- |
| E1 contract-only change | Backend/API Integrator: update or confirm `packages/contracts` | `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §3 API Readiness, step 2 |
| E2 backend service delivery | Backend/API Integrator: bounded `apps/api` change with DB schema/migration note, deployment config note, runtime smoke result, rollback note, and service evidence | `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §3 API Readiness, step 4 |
| E3 architecture decision | Mobile Architect / Technical Lead: decide architecture, route/state impact, EAS strategy | `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 6; `mobile-app-dev-team/organization/role-capability-matrix.md` §Role Capability Matrix (Mobile Architect row) |
| E4 design-system change | Design: `DESIGN.md` decision `KEEP_EXISTING_DESIGN_MD` / `UPDATE_DESIGN_MD_REQUIRED` / `BLOCKED_BY_DESIGN_SYSTEM_DECISION`, blocking Stitch generation if the system must change | `.agents/skills/design-mobile-design-handoff/SKILL.md` §Workflow step 2 |
| E5 refactor / tech-debt | Modification request classification, then narrowest failing test first plus read-only reviewer evidence | `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 5; `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §4 Implementation, steps 4 and 7 |
| E6 QA / E2E | QA/Release evidence ladder L0 `jest` / L1 `rn-web` / L2 `eas-maestro` / L3 `human-device` | `mobile-app-dev-team/governance/gates-and-evidence.md` §Mobile Evidence Ladder |
| E7 release / store submission | `production-submit` human gate plus the Railway boundary (Railway does not prove store submission readiness or full production release approval) | `mobile-app-dev-team/governance/gates-and-evidence.md` §Human Gates and §Railway Boundary; `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §5 QA And Release Evidence, step 6 |
| E8 gate failure | Failure Loop: failed check stays failed, owning workflow fixes, QA/Release reruns, rework cap / risk acceptance goes to Product/Planning or human owner | `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §6 Failure Loop |
| E9 human-gate-triggering work | One of the 8 deterministic human-gate categories | `mobile-app-dev-team/governance/gates-and-evidence.md` §Human Gates |
| E10 out-of-scope request | `OUT_OF_SCOPE` readiness (office-hours) or `NON_GOAL` triage (proactive report) | `.agents/skills/po-requirement-office-hours/SKILL.md` §Workflow step 6; `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 12 |
| E11 unclear request | `NEEDS_USER_CLARIFICATION` readiness from office-hours | `.agents/skills/po-requirement-office-hours/SKILL.md` §Workflow step 6 |
| E12 multi-role coordination | Define a single coherent `AGENT_SPRINT` goal | `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 10; §Output (work-unit decision enum) |
| E13 direct "build it" language | Requires an accepted task packet and `READY_FOR_EXECUTION`; otherwise route to sizing or clarification | `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 7; `.agents/skills/po-planning-completeness-review/SKILL.md` §Workflow step 10 |
| E14 proactive report | Triage states with no auto-execution | `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow steps 8 and 12 |
| E15 runtime-capability blocker | `RUNTIME_CAPABILITY_BLOCKED` (proactive triage) / `BLOCKED_BY_RUNTIME_CAPABILITY` (completeness review) | `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 12; `.agents/skills/po-planning-completeness-review/SKILL.md` §Workflow step 10 |
| E16 cross-pod handoff | Create/update the durable GitHub handoff root under `docs/plans/work-units/<work-unit-id>/`; a downstream pod consumes a branch/commit/PR, not another pod's local workspace | `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 8 and §4 Implementation, step 9; `mobile-app-dev-team/governance/gates-and-evidence.md` §Durable GitHub Handoff |

## Work-Unit Decision Enum

When sizing, the work-unit decision is exactly one of the following values (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Output):

- `PRODUCT_GOAL`
- `MVP_INCREMENT`
- `AGENT_SPRINT`
- `VERTICAL_SLICE`
- `STORY_WORK_ITEM`
- `EXECUTION_TASK`
- `ONE_DAY_STEP`

## P-1 — Design Relevance and `not-applicable` Criteria

The work-unit `not-applicable` state already exists in `scripts/lib/work-unit-machine.mjs` (the `states` set), but the SoT did not previously define when the `01-design` stage may use it. This section documents that criteria as decided guidance. It was approved by a `design-reviewer` (xhigh) decision recorded at `mobile-app-dev-team/decision-records/20260614-entry-case-cp2-p1-decision.md` (verdict GO, 0 findings). This is managed-doc guidance (SoT priority 5) and does not supersede higher-priority SoT; the semantic relevance judgment remains process-owned, while one deterministic slice is now runtime-enforced (see the Runtime enforcement note below).

- **Design is RELEVANT** when the work unit introduces or changes layout, interaction, or visual hierarchy (`.agents/skills/design-mobile-design-handoff/SKILL.md` §Workflow step 4).
- The **`01-design` stage MAY be marked `not-applicable`** only when the work unit introduces no new or changed layout, interaction, or visual hierarchy — for example pure backend/contract/data work, config/infra, non-visual logic, or test/evidence-only work.
- **Relevance classification owner**: Product/Planning classifies Design relevance during planning-completeness-review using the relevant-roles matrix (`.agents/skills/po-planning-completeness-review/SKILL.md` §Workflow step 2; `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 5). This is a relevance/scope classification only — Product/Planning does not own design quality, and Design remains the owner of the `01-design` stage and of design quality (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §2 Design Readiness; `.agents/skills/design-mobile-design-handoff/SKILL.md` §Workflow). The classification is recorded as the `01-design` stage state in `status.json`.
- **Guardrail**: marking `not-applicable` requires that none of layout, interaction, or visual hierarchy is in scope; if uncertain, default to RELEVANT (Design engaged). A text-only or ASCII description never authorizes implementation when layout, interaction, or visual hierarchy is in scope (`.agents/skills/design-mobile-design-handoff/SKILL.md` §Workflow step 4).
- **Runtime enforcement (partial)**: the durable `non-goal` evidence requirement is deterministically enforced — a `01-design` stage in `not-applicable` state must carry at least one `non-goal` evidence entry, validated in `scripts/lib/work-unit-machine.mjs` and covered by `scripts/validate-work-units.mjs --self-test` fixtures. This was scoped by a `wm-implementation-reviewer` (xhigh) decision at `mobile-app-dev-team/decision-records/20260614-entry-case-risk2-runtime-binding-decision.md`. The semantic relevance judgment (whether layout/interaction/visual hierarchy is in scope) is intentionally NOT hardcoded and remains process-owned.

## P-2 — Cross-Work-Unit Prioritization and Conflict

The SoT defines per-work-unit state and durable handoff but no cross-work-unit prioritization or conflict rule; this section fills that absent area as decided guidance. It was approved by a `po-scope-gate-reviewer` (xhigh) decision recorded at `mobile-app-dev-team/decision-records/20260614-entry-case-cp3-decision.md` (verdict GO, 0 findings). This is managed-doc guidance (SoT priority 5); runtime enforcement in skills/validators is a deferred follow-up and does not supersede higher-priority SoT.

- Each active work unit keeps its own `status.json` and durable handoff root `docs/plans/work-units/<work-unit-id>/` (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §1 Intake And Planning, step 8; `mobile-app-dev-team/governance/gates-and-evidence.md` §Durable GitHub Handoff). There is no automatic cross-work-unit preemption.
- Product/Planning owns prioritization and conflict resolution as scope owner / delivery lead; this is a routing/scope decision, not implementation (`mobile-app-dev-team/organization/role-capability-matrix.md` §Role Capability Matrix, Product/Planning row).
- Shared-artifact conflicts on the API contract route to Backend/API Integrator (the `packages/contracts` owner) with Mobile Architect co-review; the resolution is recorded in `packages/contracts` (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §3 API Readiness, steps 2 and 5).
- A prioritization decision that changes already-committed scope, or an irreversible scope tradeoff between work units, escalates to the `irreversible-scope-tradeoff` human gate (and `business-budget-owner` for budget/business decisions) (`mobile-app-dev-team/governance/gates-and-evidence.md` §Human Gates).

## P-3 — Emergency Hotfix: Expedited but Still Gated

The SoT defines no emergency production hotfix fast-path; production submit always requires recorded human approval. This section documents an expedited-but-still-gated path (never a bypass) as decided guidance, approved by the same `po-scope-gate-reviewer` (xhigh) decision at `mobile-app-dev-team/decision-records/20260614-entry-case-cp3-decision.md` (verdict GO, 0 findings). This is managed-doc guidance (SoT priority 5); runtime enforcement in skills/validators is a deferred follow-up and does not supersede higher-priority SoT.

- An emergency hotfix still enters Product/Planning intake and is classified under the issue/bug/failure request category as `bug-fix` or `failure/rework` (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md` §Workflow step 6).
- Tests-first still applies: add or update the narrowest failing test/eval/validator/fixture first (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §4 Implementation, step 4).
- Production submit STILL requires recorded human approval — there is no bypass or fast-path that skips the `production-submit` human gate (`mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §5 QA And Release Evidence, step 6; `mobile-app-dev-team/governance/gates-and-evidence.md` §Human Gates).
- "Expedited" means Product/Planning MAY prioritize the hotfix as the top work unit and compress non-gating steps; it MUST NOT skip required gates, evidence, or human approval.
- QA/Release owns post-hotfix evidence, the release-risk summary, and failure classification (`mobile-app-dev-team/organization/role-capability-matrix.md` §Role Capability Matrix, QA/Release row; `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` §6 Failure Loop).
- If a gate fails and shipping anyway is proposed, that requires the `failed-gate-risk` human gate (human owner decision) (`mobile-app-dev-team/governance/gates-and-evidence.md` §Human Gates).
