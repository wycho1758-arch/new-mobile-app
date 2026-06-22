# mobile-app-dev-team Expansion Task Packet

Date: 2026-06-19

## 0. Decision

- status: required
- PRD acceptance / SoT reference: user requested a staged SoT-based plan for
  expanding, checking, updating, and pruning `mobile-app-dev-team/**`.
- owner: Product/Planning
- input artifact: current repo SoT and reviewer-checked plan
- output artifact: this task packet
- acceptance criteria: every future edit/archive/delete slice must be recorded
  as a role-owned task packet with evidence and approval boundary before work
  starts.
- evidence requirement: current source checks, validator output, and reviewer
  verdict must be linked or summarized.
- dependencies/blockers: future execution requires accepted task packet plus
  `READY_FOR_EXECUTION`, or deterministic `status.json` next action.
- open decisions: exact future update slices, archive candidates, and role-agent
  execution order are not yet approved for execution.
- next responsible role: Product/Planning
- GitHub branch/PR handoff link: not created yet.

This packet is planning guidance only. It does not authorize repository edits,
archive/delete, Design/Stitch extraction, external publication, release,
production submit, or human-gated actions.

## 1. Verified SoT Inputs

- `AGENTS.md`: OpenClaw/Codex routing, repo-local Codex skill and agent paths,
  no evidence or human-gate bypass, no direct push to `main`.
- `REPO_OPERATIONS.md`: policy ownership map, narrowest authoritative owner
  rule, source/archive rules, OpenClaw/Codex boundary, validator responsibility,
  and local harness applicability.
- `mobile-app-dev-team/source-map.md`: current source registry, runtime surface
  classes, validator responsibility map, harness applicability, and external
  proof boundary.
- `mobile-app-dev-team/README.md`: pod role entry chain:
  `openclaw-pod-skills-sync -> project-bootstrap -> matching role runtime specification -> codex-role-workflow`.
- `mobile-app-dev-team/governance/sot-and-principles.md`: SoT priority and
  pending `.clode` / `.claude` terminology reconcile.
- `mobile-app-dev-team/governance/gates-and-evidence.md`: evidence ladder,
  `human-gate/v1`, Release Gatekeeper as non-LLM deterministic system, and
  durable GitHub handoff.
- `mobile-app-dev-team/organization/role-capability-matrix.md`: exact Operating
  Role, output, handoff, and must-not-own matrix.
- `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`: active
  repo-local skills, custom agents, reviewer matrix, and pod-native skill
  boundary.
- `mobile-app-dev-team/runtime-sources/skills/README.md`:
  role slug/runtime spec table and `/workspace/skills` runtime snapshot
  boundary.

## 2. Current Evidence

- `git status --short --branch`: clean `main...origin/main` at the time of
  planning.
- `pnpm run validate:workflow-docs`: PASS, `Validated workflow docs.`
- `pnpm run validate:team-doc`: PASS, validated active managed runtime
  composition, runtime source docs, routing support docs, and current
  `mobile-app-dev-team` surface validators.
- `rg "work-processes|05-work-processes" ...`: only legacy redirect/crosswalk
  references remain.
- `mobile-app-dev-team/.DS_Store`: ignored by `.gitignore`, not tracked; local
  cleanup only, not archive material.

## 3. Reviewer Result

Reviewer: `po-planning-reviewer`

First verdict: `NO_GO`.

Findings addressed:

- Add packet-level task completeness before execution.
- Add item-by-item scope mapping before update/archive/delete.
- Add explicit QA/Release evidence ownership or not-applicable rationale.
- Add explicit Design/Stitch P0/P1 acceptance checks and pre-P1 extraction stop.

Second verdict: `GO`.

Meaning of GO:

- GO applies to planning guidance only.
- GO does not approve edits, archive/delete, HTML extraction, publication,
  production submit, release, or human-gated actions.
- External platform state and live pod execution were not proven.

## 4. Mandatory Task Packet Layer

Before any future update, archive, delete, or practitioner execution, create a
slice-level task packet with all fields below:

- packet id
- owner role
- SoT acceptance/reference
- scope
- non-goal/deferred marker
- input artifact
- output artifact
- Done-when criteria
- evidence path or command
- dependencies/blockers
- open decisions
- next responsible role
- approval boundary
- human-gate status
- PR or work-unit link when work leaves the current pod

Example:

```text
packet id: R2-role-contract-audit
owner role: Product/Planning orchestrates; each SOUL-owning role owns its own role update.
SoT reference: role-capability-matrix.md + role SOUL + role WORKFLOW + pod runtime spec.
scope: check role identity, reports-to, escalation owner, owns/must-not-own, handoff, human gates, Gatekeeper boundary.
output artifact: per-role gap list and accepted update packet.
Done-when: every role has a role-centered contract decision and no name-centered behavior remains except practitioner labels.
evidence: validator output plus reviewer result.
next role: relevant SOUL-owning role.
```

## 5. Scope Ledger Rule

Phase 0 must produce a scope ledger before edits.

Each path/action must be classified as exactly one of:

- update-now with SoT reference
- review-only
- defer/non-goal
- archive-candidate with archive/source strategy
- local-cleanup-only
- external-proof-blocked

Archive/delete cannot proceed until the ledger records:

- source/archive class
- why the path is not an active SoT
- preservation strategy if historical value exists
- required validator command
- human-gate status if the action is irreversible or risk-bearing

Root archive SoT must be preserved. Deleted historical directories must not be
recreated only to satisfy stale references.

## 6. Phase Plan

### Phase 0. Baseline And SoT Inventory

- purpose: freeze the current source graph before expansion.
- owner: Product/Planning.
- affected surfaces: all `mobile-app-dev-team/**` planning targets.
- inputs: `AGENTS.md`, `REPO_OPERATIONS.md`, `source-map.md`, `README.md`,
  gates/evidence, role matrix, Codex matrix, current git tree.
- output: scope ledger plus path/surface/owner/validator/runtime-consumer
  matrix.
- Done-when: each path/action is classified and current checks are recorded.
- evidence: `git status`, `find`, `rg`, and applicable validators.
- next responsible role: Product/Planning.

Example classification:

```text
path: mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md
surface class: W1
owner: Product/Planning
action: update-now only if scope ledger maps the change to SoT acceptance
validator: pnpm run validate:workflow-docs
human-gate: not applicable unless publication/external action is added
```

### Phase 1. Role-Centered Runtime Contract Audit

- purpose: make every workflow operate by runtime role, not personal name.
- owner: Product/Planning orchestrates; each actual SOUL-owning role owns its
  role-specific update.
- inputs: six role SOUL files, six role WORKFLOW files, six pod runtime specs,
  related `.agents/skills` and `.codex/agents` entries.
- output: six role packets.
- Done-when: each role packet checks exact runtime role, reports-to role,
  escalation owner, owns/must-not-own, handoff target, human-gate boundary, and
  deterministic Gatekeeper as a system role.
- evidence: `pnpm run validate:team-doc` and targeted runtime-source validator
  when runtime-source files change.
- next responsible role: relevant role owner.

Role examples:

- Product/Planning owns scope, readiness, routing, evidence expectation, and
  human-gate coordination; it must not implement app/backend/design/QA/release
  work or decide technical architecture alone.
- Design owns design quality and Stitch-backed handoff; Product/Planning P0/P1
  is scope/evidence approval only.
- Mobile Architect owns architecture, route/state, runtime, dependency, API
  impact, and releaseability review; it must not absorb implementation/backend
  ownership.
- Mobile App Dev owns approved Expo React Native implementation and selectors;
  it must not invent contracts or backend behavior.
- Backend/API Integrator owns mobile-facing API contracts and approved backend
  service delivery; it must not implement native UI or self-approve QA
  readiness.
- QA/Release owns evidence plan/result and release-risk summary; it must not fix
  implementation or approve failed gates.
- Release Gatekeeper is deterministic system status only; no SOUL.md, no LLM
  judgment, no risk acceptance.

### Phase 2. Product/Planning And Common Workflow Cleanup

- purpose: separate common lifecycle/routing from role-specific execution.
- owner: Product/Planning.
- inputs: `Product_Planning_WORKFLOW.md`, `entry-case-routing.md`,
  `github-artifact-workflow.md`, `native-e2e-strategy.md`.
- output: workflow update packet for common lifecycle and routing.
- Done-when: common docs consistently cover goal/owner/scope/deadline/output/
  approval boundary, evidence check, facts/assumptions/decisions/blockers/next
  actions, lifecycle, SoT systems, status report format, wake-guard user-visible
  update, reviewer evidence, `READY_FOR_EXECUTION`, and no self-approval.
- evidence: `pnpm run validate:workflow-docs`.
- next responsible role: Product/Planning.

### Phase 3. Pod-Native Runtime Source Audit

- purpose: keep repo SoT, pod runtime snapshot, and Codex runtime boundaries
  distinct.
- owner: Product/Planning for routing; runtime-source owners per role for
  content.
- inputs: `runtime-sources/skills/**`, bootstrap docs,
  `codex-role-workflow`, and Codex skill/agent matrix.
- output: runtime-source packet.
- Done-when: sync/bootstrap/codex-role-workflow paths resolve from repo SoT, no
  repo-local Codex artifacts are placed in pod-native skill tree, and
  `/workspace/skills` remains a runtime snapshot only.
- evidence: `pnpm run test:runtime` and targeted pod-native smoke when
  pod-native skill sources change.
- next responsible role: relevant runtime-source owner.

### Phase 4. Governance, Evidence, And Human-Gate Consistency

- purpose: align evidence, human gates, rollback, and Gatekeeper boundaries.
- owner: Product/Planning coordinates; QA/Release owns QA/release evidence when
  in scope; Human Owner owns human-gated decisions.
- inputs: gates/evidence, human-ops annex, rollback runbook, role workflows,
  work-unit status schema.
- output: gate consistency packet.
- Done-when: `human-gate/v1` categories, failed-gate-risk, evidence ladder,
  Gatekeeper system status, and external-proof boundaries are consistent.
- evidence: `pnpm run validate:governance-docs` when governance docs change.
- next responsible role: Product/Planning or QA/Release depending on the slice.

### Phase 5. Reference And Archive Pruning

- purpose: remove overspec only after source/archive classification.
- owner: Product/Planning.
- inputs: `REPO_OPERATIONS.md` source/archive rules, `source-map.md`,
  `ref-organization/**`, and root archive files.
- output: archive ledger.
- Done-when: every candidate is classified before archive/delete.
- evidence: `pnpm run validate:reference-docs`; run
  `pnpm run validate:team-doc-archive` if root archive files or historical corpus
  are changed.
- next responsible role: Product/Planning.

Example:

```text
path: mobile-app-dev-team/ref-organization/<area>/README.md
action: review-only until scope ledger proves it is duplicate or stale
archive rule: preserve current-project example only when reusable guidance remains useful
validator: pnpm run validate:reference-docs
```

### Phase 6. Validator-First Implementation Slices

- purpose: make future changes enforceable before broad edits.
- owner: role depends on slice; Product/Planning tracks.
- inputs: accepted scope ledger and slice-level task packet.
- output: failing validator/eval/fixture first when behavior is enforceable,
  then minimal doc/runtime patch.
- Done-when: targeted validator passes and required gate evidence is recorded.
- evidence by surface:
  - W1: `pnpm run validate:workflow-docs`
  - R1/R2/C1: `pnpm run validate:team-doc`, `pnpm run test:runtime`, and
    targeted pod-native smoke when pod-native skill sources change
  - G1: `pnpm run validate:governance-docs`
  - H1/P1 archive/reference: `pnpm run validate:reference-docs` and archive
    validator when root archive files change
  - Codex runtime paths: `pnpm run test:runtime` and
    `pnpm run test:local-harness`
- next responsible role: owning role for the slice.

### Phase 7. Role-Agent Execution Loop

- purpose: let actual SOUL-owning agents perform role-specific updates.
- owner: actual role owner for its artifact; Product/Planning orchestrates.
- inputs: accepted task packet plus `READY_FOR_EXECUTION`, or deterministic
  `status.json` next action.
- output: role-owned artifact and evidence.
- Done-when: role owner reports outcome, evidence, blockers, reviewer state,
  gate state, and handoff state.
- evidence: committed work-unit files, command output, reviewer evidence, and
  PR links.
- next responsible role: downstream role from the task packet.

Downstream pods consume branch/commit/PR or
`docs/plans/work-units/<work-unit-id>/` artifacts, not another pod local
workspace.

### Phase 8. Integration And PR Readiness

- purpose: produce a reviewable repo state without bypassing gates.
- owner: Product/Planning coordinates; QA/Release owns evidence classification
  when in scope; Gatekeeper system reports deterministic required-check status.
- output: evidence index, reviewer verdicts, clean status/diff, branch/PR.
- Done-when: required checks pass or blockers are recorded, reviewers are
  separated from authors, and no external proof is claimed without actual proof.
- evidence: command output, reviewer verdicts, PR link, and work-unit status.
- next responsible role: Product/Planning or Human Owner when a human gate is
  required.

## 7. QA/Release Acceptance Rule

For every future slice, Product/Planning must either:

- create a QA/Release-owned evidence task with evidence requirement and handoff
  path; or
- mark QA/Release as not applicable with a reason.

QA/Release evidence examples:

- docs-only W1 update: not applicable unless release/readiness claims are added.
- runtime-source R1 update: QA/Release may be not applicable, but `test:runtime`
  and pod-native smoke evidence remain required by the owning workflow.
- mobile UI/runtime update: QA/Release owns evidence plan/result and the mobile
  evidence ladder level.
- release/readiness update: QA/Release owns release-risk summary and evidence
  classification, while Human Owner owns human-gated release approval.

## 8. Design/Stitch P0/P1 Acceptance Rule

If a future slice touches Design/Stitch/design-pub-html surfaces:

- Product/Planning may approve only PRD fit, non-goals, evidence readiness,
  human-gate routing, and scope alignment.
- Design owns design quality, selected option quality, Stitch authorship, design
  handoff quality, and publication package quality.
- P1 approval is required before any screen code fetch, `code.html` download,
  SDK `getHtml`, `htmlCode.downloadUrl` persistence, or HTML/image artifact
  publication.

If Design/Stitch is not touched, mark this rule not applicable with a reason.

## 9. Human-Gate Boundary

Stop for recorded human decision when work involves:

- production submit
- payment or money movement
- PII/privacy-sensitive behavior
- external messaging
- legal, terms, contract, or compliance decision
- business/budget owner decision
- irreversible scope tradeoff
- accepting risk after a failed gate

Human-gate records do not turn Product/Planning, a reviewer, an LLM role, a pod,
or deterministic Gatekeeper into a human approver.

## 10. Current Gap Register

| Gap | Severity | Owner | Required handling |
| --- | --- | --- | --- |
| Future slices are not yet packetized | High | Product/Planning | Create slice task packets before execution |
| Archive/delete candidates are not yet item-mapped | High | Product/Planning | Create scope ledger before archive/delete |
| QA/Release coverage must be explicit | Medium | Product/Planning + QA/Release | Add evidence task or not-applicable reason per slice |
| Design/Stitch P0/P1 must be explicit when touched | Medium | Product/Planning + Design | Add P0/P1 acceptance checks or not-applicable reason |
| External platform state is not proven | Medium | Owning role / Human Owner | Do not claim external proof without evidence |

## 11. Not Approved By This Packet

- app code changes
- backend/API code changes
- Design/Stitch generation or publication
- archive/delete execution
- Confluence/Jira/GitHub external mutation beyond normal future PR flow
- production submit
- release approval
- payment/PII/legal/external messaging decisions
- failed-gate risk acceptance

## 12. Next Action

Product/Planning should use this packet to create the Phase 0 scope ledger.
Only after the ledger maps target actions to SoT references, owners, validators,
and approval boundaries should downstream role-specific execution packets be
created.
