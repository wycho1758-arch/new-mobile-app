# Product/Planning Skill Routing Update Plan

Date: 2026-06-09
Mode: `$wm` planning-only
Status: Draft pending reviewer

## Objective

Update the Product/Planning skill-routing model so project work is routed by the actual user input type, not by a single fixed PRD-only chain. The plan must preserve the current SoT default sequence while documenting the conditional feedback loops required during real project execution.

Top-level invariant: every user instruction enters through Product/Planning intake first. Product/Planning may then clarify, size, decompose, review, or hand off to the responsible downstream owner, but no user request bypasses Product/Planning readiness and gate checks.

## SoT Inputs

- `mobile-requirement-office-hours` page `1374519364`: clarifies ambiguous or incomplete requirements before PRD decomposition; produces facts, assumptions, unknowns, non-goals, human gates, and readiness.
- `mobile-work-unit-planning-and-agent-sprint` page `1374650456`: sizes broad PRD, selected work units, MVP increments, agent sprint boundaries, vertical slices, and proactive reports; may start from user request, PRD, clarified brief, existing backlog, or practitioner report.
- `mobile-prd-to-execution` page `1373634562`: converts only a ready PRD or bounded work unit into Epic/Story/role-scoped Tasks.
- `mobile-planning-completeness-review` page `1374519387`: reviews completed planning output and routes unclear or scope-changing items back to requirement office-hours or human decision.
- Product Planning Operational Skills Summary page `1374421079`: current default process is requirement clarification, work-unit sizing, PRD-to-execution, completeness review, then execution.
- Repo adapters: `.agents/skills/po-{requirement-office-hours,work-unit-planning-and-agent-sprint,prd-to-execution,planning-completeness-review}/SKILL.md`.

## Current Finding

The default SoT sequence remains:

```text
po-requirement-office-hours
-> po-work-unit-planning-and-agent-sprint
-> po-prd-to-execution
-> po-planning-completeness-review
-> execution role skills
```

However, this sequence is not sufficient as the only runtime routing model. `po-work-unit-planning-and-agent-sprint` explicitly accepts a PRD or broad product intent as upstream input. Therefore, for an apparently detailed but oversized PRD, the correct operational flow may start with work-unit sizing and then route specific unclear points to requirement office-hours.

## Target Routing Model

### Route A: Rough Idea Or Non-PRD Requirement

Input examples:
- "이런 기능을 만들고 싶어."
- "참가자가 대회에 쉽게 신청하게 해줘."
- target user, acceptance signal, platform scope, or constraints are missing.

Actual skill flow:

```text
po-requirement-office-hours
-> if READY_FOR_PRD_DECOMPOSITION and still broad: po-work-unit-planning-and-agent-sprint
-> if bounded: po-prd-to-execution
-> po-planning-completeness-review
```

Reason:
- The request is unclear before sizing. Clarification must separate facts, assumptions, unknowns, non-goals, and human gates before task generation.

### Route B: Broad But Detailed PRD

Input examples:
- Full PRD with phases, many features, payments, privacy, messaging, admin, public views, and release concerns.
- PickleHub-style PRD.

Actual skill flow:

```text
po-work-unit-planning-and-agent-sprint
-> if selected work unit exposes critical unknowns: po-requirement-office-hours
-> po-work-unit-planning-and-agent-sprint re-check
-> if READY_FOR_MOBILE_PRD_TO_EXECUTION: po-prd-to-execution
-> po-planning-completeness-review
```

Reason:
- The first problem is oversize, not missing product intent. The skill must classify the PRD as PRODUCT_GOAL or oversized MVP scope, select one MVP increment or agent sprint, then clarify only the blocking unknowns inside the selected unit.

Required output:
- Work-unit level.
- Selected MVP increment or agent sprint goal.
- Deferred scope and non-goals.
- Human gates.
- Open decisions routed to owner.
- Next state: READY_FOR_MOBILE_PRD_TO_EXECUTION, NEEDS_SMALLER_SLICE, HUMAN_DECISION_REQUIRED, REJECTED_OR_NON_GOAL, or BACKLOG_CANDIDATE.

### Route C: Modification Request During Active Work

Input examples:
- "이 기능에 파트너 초대 링크도 추가해줘."
- "결제 정책을 단체 할인 기준으로 바꿔줘."
- "MVP에 알림 채널을 추가해줘."

Actual skill flow:

```text
po-work-unit-planning-and-agent-sprint
-> classify as within-approved-scope | scope-change | human-gate | non-goal
-> if unclear or scope-changing: po-requirement-office-hours or human decision
-> if bounded and approved: po-prd-to-execution update packet
-> po-planning-completeness-review
```

Reason:
- A modification request is not automatically a PRD update. Product/Planning must decide whether it belongs in the current work unit, becomes a backlog candidate, needs human approval, or is a non-goal.

Human gates:
- payment or money movement.
- PII/privacy.
- external messaging.
- legal/terms.
- production submit.
- accepting failed-gate risk.

### Route D: Problem, Issue, Bug, Or Failure Request

Input examples:
- "결제가 중복 처리돼."
- "대진표가 잘못 생성돼."
- "알림이 안 갔어."
- "QA gate가 실패했어."

Actual skill flow:

```text
Product/Planning intake
-> if accepted task packet exists and planning completeness is READY_FOR_EXECUTION:
     route to downstream owner skill without new PRD-to-execution decomposition
-> else: po-work-unit-planning-and-agent-sprint
-> classify as bug-fix | failure/rework | release-evidence-gap | human-gate | symptom-without-evidence
-> if missing facts/repro/evidence/source expectation: po-requirement-office-hours
-> if new or changed role-owned work is bounded: po-prd-to-execution for fix task packet
-> po-planning-completeness-review
-> downstream owner skill
```

Downstream owner examples:
- API contract or backend behavior: `mobile-backend-api-integrator-workflow`.
- mobile UI/runtime fix: `mobile-app-dev-workflow`.
- release evidence or gate failure:
  - Owner role: QA/Release.
  - Input artifact: failed gate output, PR/evidence link, release candidate context, and affected acceptance line.
  - Output artifact: classified release evidence gap, rework owner routing, rerun checklist, and gate status update.
  - Evidence path: `.evidence/<task-id>/qa-release-gate-triage.md` or linked CI/QA artifact.
  - Readiness state: `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or `READY_FOR_EXECUTION` only after evidence is fixed and reviewed.

Reason:
- Issues often arrive as symptoms, not requirements. Product/Planning must avoid assigning implementation until owner, evidence, repro, expected behavior source, and gate impact are known.

### Route E: Direct Implementation Request

Input examples:
- "이 화면을 구현해줘."
- "이 API 연결해줘."
- "이 버그를 고쳐줘."

Actual skill flow:

```text
Product/Planning intake
If accepted task packet exists and planning completeness is READY_FOR_EXECUTION:
  downstream owner skill directly
Else:
  po-work-unit-planning-and-agent-sprint or po-requirement-office-hours first
```

Reason:
- Product/Planning should not let direct implementation language bypass task readiness, evidence, role ownership, or human gates.

### Route F: Review-Only Request

Input examples:
- "이 PRD 검토해줘."
- "이 계획이 빠진 게 없는지 봐줘."
- "gate 리스크만 확인해줘."

Actual agent flow:

```text
Product/Planning intake
-> select only relevant read-only agent(s):
   po-planning-reviewer for planning package, PRD decomposition, task readiness
   po-scope-gate-reviewer for scope containment, human gates, risk acceptance
   po-docs-researcher for SoT uncertainty or source research
```

Reason:
- Review-only input must not trigger write-side skill execution or repo edits. Do not require every reviewer for every request, and do not recursively delegate.

### Route G: Practitioner Proactive Report

Input examples:
- agent reports repeated failure.
- release evidence gap.
- blocker discovery.
- retrospective improvement.

Actual skill flow:

```text
Product/Planning intake
po-work-unit-planning-and-agent-sprint
-> triage as REJECT | NON_GOAL | BACKLOG_CANDIDATE | SPRINT_IMPROVEMENT | HUMAN_DECISION_REQUIRED | RUNTIME_CAPABILITY_BLOCKED
-> only after approval: po-prd-to-execution or downstream owner
```

Reason:
- Proactive reports are proposals, not execution instructions. They must not create Jira issues, code changes, SOUL changes, or scope changes automatically.

## Proposed Update Phases

### Phase 1: Document The Routing Policy

Scope:
- Update Product/Planning runtime documentation only.
- No app/backend implementation.

Execution task packet:
- Owner role: Product/Planning.
- Input artifact: this reviewed plan, SoT page references, existing `po-*` adapters.
- Output artifact: documented routing policy update in approved repo docs or adapter docs.
- Done-when: default sequence, conditional broad-PRD loop, Product/Planning-first invariant, and exception routing are all documented with source crosswalks.
- Evidence path: `.evidence/po-runtime-application/product-planning-skill-routing-update-plan-review.md`.
- Open decisions: whether to update only evidence/docs or promote the policy into runtime validator-required fixtures.
- Next responsible role: Product/Planning for Phase 2 test-first updates if implementation is approved.

Candidate paths:
- `.evidence/po-runtime-application/product-planning-skill-routing-update-plan.md`
- `PROJECT_ENVIRONMENT.md`
- `evals/local-harness/README.md`
- Product/Planning `po-*` skill docs if implementation is approved later.

Quality gate:
- Reviewer confirms default order and conditional loop are both represented.

### Phase 2: Add Eval Coverage Before Runtime Behavior Changes

Test-first additions:
- `evals/skills/po-work-unit-planning-and-agent-sprint/broad-prd-positive.prompt.md`
- `evals/skills/po-work-unit-planning-and-agent-sprint/modification-request-positive.prompt.md`
- `evals/skills/po-work-unit-planning-and-agent-sprint/issue-triage-positive.prompt.md`
- `evals/skills/po-requirement-office-hours/sized-unknown-positive.prompt.md`
- negative fixture proving `po-prd-to-execution` does not run on oversized or unclear PRD.
- direct implementation request fixture proving Product/Planning checks for accepted task packet/readiness before downstream owner handoff.
- review-only request fixture proving read-only agents are selected only when relevant and write-side skills do not run.
- proactive report fixture proving no automatic Jira/code/SOUL/scope change before Product/Planning triage.
- human-gate stop fixtures for payment/refund, PII/privacy, external messaging, production submit, legal/terms, business approval, compliance/policy, irreversible scope tradeoff, Human Owner budget/business decision, and accepting failed-gate risk.
- QA/Release evidence-gap fixture requiring owner, input artifact, output artifact, evidence path, readiness state, and rework owner.

Execution task packet:
- Owner role: Product/Planning.
- Input artifact: Phase 1 routing policy and current `evals/skills/po-*` fixtures.
- Output artifact: routing eval fixtures and validator/harness assertions.
- Done-when: every route A-G and every human gate stop has a positive or negative fixture.
- Evidence path: `evals/skills/po-work-unit-planning-and-agent-sprint/` and `evals/skills/po-requirement-office-hours/` fixture paths plus validator output.
- Open decisions: exact filename convention for route fixtures.
- Next responsible role: Product/Planning for adapter wording update.

Validator/harness expectation:
- Ensure the above fixtures exist if the routing policy is promoted from documentation into runtime validation.

Quality gate:
- `node scripts/validate-runtime-artifacts.mjs`.
- `node scripts/test-local-harness.mjs --self-test --stage product-planning`.
- Full runtime gates only after unrelated root Claude artifacts are resolved.

### Phase 3: Update Adapters To Encode Conditional Routing

Candidate changes:
- `po-work-unit-planning-and-agent-sprint`:
  - state all user instructions enter Product/Planning intake first.
  - explicitly state it may run before office-hours for broad but apparently usable PRDs.
  - require routing specific critical unknowns to `po-requirement-office-hours`.
  - require re-check before `po-prd-to-execution`.
- `po-requirement-office-hours`:
  - clarify it may be invoked after work-unit sizing for selected-slice unknowns.
- `po-prd-to-execution`:
  - require `READY_FOR_MOBILE_PRD_TO_EXECUTION` or equivalent bounded readiness before decomposition.
- `po-planning-completeness-review`:
  - preserve route-back for scope-changing uncertainty.

Execution task packet:
- Owner role: Product/Planning.
- Input artifact: passing route evals from Phase 2.
- Output artifact: updated `po-*` adapter docs and validator coverage.
- Done-when: adapters encode Product/Planning-first intake, conditional feedback loops, gate stops, no-auto-execution, and task-readiness boundaries without replacing any existing skill.
- Evidence path: `.evidence/po-runtime-application/product-planning-skill-routing-final-review.md`.
- Open decisions: whether source Confluence mirror docs should be updated after repo adapter validation.
- Next responsible role: read-only reviewer.

Quality gate:
- Runtime validator and skill evals pass.
- Reviewer confirms no replacement of existing skill responsibilities.

### Phase 4: Reviewer And Gate Evidence

Reviewers:
- `po-planning-reviewer`: order, role boundaries, task readiness.
- `po-scope-gate-reviewer`: human-gate handling.
- `po-docs-researcher`: SoT ambiguity if source docs conflict.

Verification:
- `pnpm run test:runtime`.
- `pnpm run test:local-harness`.
- `pnpm turbo run lint test` only if workspace code changes.

Execution task packet:
- Owner role: Product/Planning.
- Input artifact: implementation diff, command output, and routing eval results.
- Output artifact: reviewer report and final gate evidence.
- Done-when: `po-planning-reviewer` and `po-scope-gate-reviewer` report no blocking findings, or findings are explicitly recorded as blocked.
- Evidence path: `.evidence/po-runtime-application/product-planning-skill-routing-final-review.md`.
- Open decisions: root Claude artifact cleanup remains owner-controlled if still present.
- Next responsible role: repo owner for PR staging/scope split.

Known blocker:
- Current root `CLAUDE.md` and `.claude` artifacts make runtime gates fail until owner resolves or removes them.

## Exception Handling

- Every user instruction starts with Product/Planning intake, even when it will immediately route to a downstream owner skill.
- If input has payment, refund, money movement, PII/privacy, external messaging, legal/terms, production submit, business approval, compliance/policy decision, Human Owner budget/business decision, irreversible scope tradeoff, or accept-risk-after-gate-failure: stop automatic progression and mark human gate.
- If input lacks owner, acceptance line, evidence path/URL, dependency, non-goal, or next responsible role: do not hand to execution.
- If input asks for implementation but no accepted task packet exists: route back to Product/Planning sizing or clarification.
- If issue is a reproducible implementation defect with an accepted task packet: route to owner role skill, not Product/Planning decomposition.
- If issue is a symptom without facts/repro/evidence: route to `po-requirement-office-hours`.
- If user asks for review only: use read-only agent, do not run write-side skill.
- If a practitioner report proposes scope change: triage only, no automatic Jira/code/SOUL change.
- If selected work unit is still too broad after sizing: return `NEEDS_SMALLER_SLICE`.
- If runtime capability is missing, unsupported, or not evidenced: return `RUNTIME_CAPABILITY_BLOCKED`.

## Recommendation

Keep the SoT default order as the canonical documentation:

```text
po-requirement-office-hours
-> po-work-unit-planning-and-agent-sprint
-> po-prd-to-execution
-> po-planning-completeness-review
```

Add an explicit conditional route for broad but sufficiently described PRDs:

```text
po-work-unit-planning-and-agent-sprint
-> po-requirement-office-hours for selected-slice unknowns only
-> po-work-unit-planning-and-agent-sprint re-check
-> po-prd-to-execution
-> po-planning-completeness-review
```

This preserves the current SoT while matching real project intake behavior.
