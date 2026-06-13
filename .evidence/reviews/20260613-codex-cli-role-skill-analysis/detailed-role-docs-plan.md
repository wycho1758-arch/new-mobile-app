# Role-Specific Codex CLI Skill Analysis Plan

Date: 2026-06-13
Mode: planning-only
Language: Korean
Scope:
- `mobile-app-dev-team/**`
- `.agents/skills/**`
- `.codex/agents/**`
- relevant validators, evals, scripts, and evidence paths

## 1. Objective

기존 `20260613-codex-cli-role-skill-analysis-plan.md`는 공통 분석 계획으로는
충분하지만, 각 role이 실제 Codex CLI를 어떻게 사용해야 하는지와 현재 skill/agent
보강이 무엇인지 판단하기에는 상세도가 부족하다.

이번 상세 분석 보고서는 다음 결정을 할 수 있을 정도로 작성한다.

1. 각 SOUL role별 현재 Codex CLI 사용 가능 상태를 확인한다.
2. 각 role별로 필요한 실제 프로세스를 단계별로 정의한다.
3. 현재 있는 repo-local Codex skill, custom agent, pod-native OpenClaw skill로
   무엇이 해결되고 무엇이 해결되지 않는지 구분한다.
4. 새로 추가해야 하는 skill 또는 agent를 role별로 특정한다.
5. 새 skill/agent가 어떤 SoT 기준 때문에 필요하며, 어떤 프로세스에서 사용 가능한지
   명확히 적는다.
6. 나중에 실제 Codex skill과 agents를 추가할 때 바로 구현 기준으로 쓸 수 있는
   role별 독립 문서를 만든다.

분석 기준은 generic Codex CLI 사용법이 아니다. 기준은 각 SOUL role이 독립 pod에서
자신의 업무를 Codex CLI로 전문적으로 수행하기 위해 필요한 role-specific workflow다.

## 2. No Open Questions

현재 기준으로 사용자에게 추가 질문이 필요한 불확실성은 없다.

분석 기준은 다음처럼 확정한다.

- 활성 role set은 `mobile-app-dev-team/02-role-souls/*-soul.md`의 6개 role이다.
- Gatekeeper는 SOUL role이 아니며 새 role 문서로 만들지 않는다.
- pod agent는 독립 OpenClaw/OrbStack pod 또는 VPC-like runtime에서 동작한다고 본다.
- pod 간 shared local storage는 없다고 보고, durable handoff는 GitHub branch/commit/PR
  또는 committed work-unit artifact로 한다.
- pod-native skill은 `/workspace/skills/<slug>/SKILL.md` runtime shape을 가져야 하며,
  source는 `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`다.
- repo-local Codex skill은 `.agents/skills/<skill-name>/SKILL.md`다.
- custom Codex agent는 `.codex/agents/<agent-name>.toml`이다.

## 3. SoT Inputs

### 3.1 Root And Runtime Policy

- `AGENTS.md`
  - TDD, branch/PR, runtime gates, Codex runtime paths, pod-native vs repo-local
    artifact ownership을 확인한다.
- `REPO_OPERATIONS.md`
  - root-owned policy, Codex-only repo work, secret safety, external proof limits를
    확인한다.
- `PROJECT_ENVIRONMENT.md`
  - Expo/RN/Codex runtime baseline과 required validation command를 확인한다.

### 3.2 Team SoT

- `mobile-app-dev-team/00-sot-and-principles.md`
  - active SoT priority와 historical skill 처리 기준을 확인한다.
- `mobile-app-dev-team/01-team-composition.md`
  - role 구성과 role responsibility alignment를 확인한다.
- `mobile-app-dev-team/02-role-souls/*.md`
  - 각 role의 identity, responsibility, tools/routing, boundaries, escalation을
    role별 문서의 최상위 기준으로 사용한다.
- `mobile-app-dev-team/03-role-capability-matrix.md`
  - role별 capability와 cross-role dependency를 확인한다.
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
  - active repo-local skill과 active custom agent mapping을 확인한다.
- `mobile-app-dev-team/05-work-processes.md`
  - role별 work process, handoff sequence, execution order를 확인한다.
- `mobile-app-dev-team/06-gates-and-evidence.md`
  - gate/evidence requirement를 role별 workflow에 연결한다.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
  - pod-native skill inventory와 role별 setup dependency를 확인한다.
- `mobile-app-dev-team/10-github-artifact-workflow.md`
  - isolated pod handoff, GitHub artifact, work-unit artifact 기준을 확인한다.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
  - fresh pod zero-to-ready flow와 project bootstrap 기준을 확인한다.
- `mobile-app-dev-team/17-orbstack-pod-config-values.md`
  - non-secret pod config, owner/operator values, live proof limits를 확인한다.
- `mobile-app-dev-team/99-source-map.md`
  - source map과 active-vs-archive 기준을 확인한다.

### 3.3 Actual Runtime Artifacts

- `.agents/skills/*/SKILL.md`
  - 각 repo-local Codex skill의 실제 trigger, scope, stop condition, output을 확인한다.
- `.codex/agents/*.toml`
  - reviewer/researcher/advisor agent의 role fit과 read-only boundary를 확인한다.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/*/SKILL.md`
  - existing pod-native skill이 setup-only인지 role-work execution까지 다루는지 확인한다.
- `scripts/validate-team-doc.mjs`
  - 향후 추가 문서/skill을 deterministic validation에 걸 수 있는지 확인한다.
- `evals/skills/**`, `evals/agents/**`, `evals/local-harness/**`
  - 향후 추가 skill/agent에 필요한 eval smoke coverage를 확인한다.

## 4. Required Output Files

최종 상세 분석 보고서는 하나의 긴 파일로 끝내지 않고 role별로 분리한다.

Base directory:

```text
.evidence/reviews/20260613-codex-cli-role-skill-analysis/
```

작성할 문서:

1. `00-index-and-executive-verdict.md`
   - 전체 결론, 공통 gap, 추가해야 할 skill/agent 요약, 우선순위.
2. `01-product-planning-codex-use-skill-analysis.md`
   - Product/Planning role 전용 상세 분석.
3. `02-design-codex-use-skill-analysis.md`
   - Design role 전용 상세 분석.
4. `03-mobile-architect-codex-use-skill-analysis.md`
   - Mobile Architect role 전용 상세 분석.
5. `04-mobile-app-dev-codex-use-skill-analysis.md`
   - Mobile App Dev role 전용 상세 분석.
6. `05-backend-api-integrator-codex-use-skill-analysis.md`
   - Backend/API Integrator role 전용 상세 분석.
7. `06-qa-release-codex-use-skill-analysis.md`
   - QA/Release role 전용 상세 분석.
8. `07-cross-role-skill-agent-implementation-recommendation.md`
   - 실제 추가/보강할 pod-native skill, repo-local Codex skill, custom agent,
     validator/eval 작업을 구현 단위로 정리한다.
9. `08-reviewer-checklist-and-final-verdict.md`
   - reviewer가 점검해야 할 기준과 최종 GO/NO-GO 판단 기준.

## 5. Per-Role Document Template

각 role별 문서는 동일한 구조로 작성한다.

### 5.1 Role Identity And SoT Basis

- role display title
- operating role
- authority level
- SOUL path
- role의 primary responsibility
- 관련 SoT 파일과 해당 파일이 증명하는 기준

### 5.2 Current State

아래 항목을 role별로 정확히 기재한다.

- 현재 SOUL이 지정한 tool/routing
- 현재 `.agents/skills`에 존재하는 usable skill
- 현재 `.codex/agents`에 존재하는 usable reviewer/researcher/advisor
- 현재 `09-pod-native-openclaw-skills`에 존재하는 setup dependency
- 현재 durable artifact path
- 현재 process coverage verdict:
  - Complete
  - Partial
  - Missing
  - Overloaded/Ambiguous

### 5.3 Required Role-Specific Codex CLI Process

각 role이 pod에서 실제로 따라야 할 절차를 단계별로 작성한다.

필수 단계:

1. pod readiness 확인
   - `project-bootstrap` 또는 role setup reports 확인.
2. role identity 확인
   - `WM_ROLE`, `/workspace/IDENTITY`, SOUL path 기준 확인.
3. checked-out repo 확인
   - `.agents/skills`, `.codex/agents`, work-unit artifact 존재 확인.
4. SoT intake
   - 해당 role이 반드시 읽어야 할 SoT 목록.
5. allowed Codex skill 선택
   - role별 allowed primary skills.
6. allowed custom agent 선택
   - role별 read-only reviewer/researcher/advisor.
7. work execution boundary
   - role이 직접 할 수 있는 일과 중단해야 하는 일.
8. evidence write
   - role별 artifact path, command output, reviewer evidence.
9. handoff
   - next responsible role, `status.json`, Git branch/commit/PR.
10. stop conditions
   - human gate, out-of-role work, missing SoT, failed gate, secrets risk.

### 5.4 Current Problems

role별 문제를 다음 분류로 나눠 적는다.

- Missing process
- Missing repo-local Codex skill
- Missing pod-native bridge skill
- Missing custom reviewer/researcher/advisor
- Missing validator/eval
- Ambiguous handoff path
- Overlap or role-boundary risk
- External proof or human-gate risk

### 5.5 Skill/Agent Additions Or Reinforcement

각 role 문서에는 반드시 다음 결론을 포함한다.

- 추가할 pod-native skill이 필요한가?
- 추가할 repo-local Codex skill이 필요한가?
- 기존 repo-local Codex skill 보강이면 어느 skill의 어느 책임을 보강해야 하는가?
- custom agent 추가가 필요한가?
- 기존 custom agent 보강이면 어느 agent의 review rubric을 보강해야 하는가?
- validator/eval이 필요한가?

각 제안은 아래 형식으로 작성한다.

```text
Recommendation:
- Add/Update:
- Artifact path:
- Reason:
- SoT basis:
- Used in process:
- Required inputs:
- Required outputs:
- Stop conditions:
- Validation:
- Non-goals:
```

### 5.6 Role-Specific Acceptance Criteria

나중에 실제 skill/agent를 추가했을 때 완료 판단에 쓸 수 있게, role별 acceptance
criteria를 체크리스트로 작성한다.

## 6. Role-Specific Analysis Plan

### 6.1 Product/Planning

Current expected state:

- repo-local skills already exist:
  - `po-requirement-office-hours`
  - `po-work-unit-planning-and-agent-sprint`
  - `po-prd-to-execution`
  - `po-planning-completeness-review`
  - `wm-orchestrate`
  - `git-workflow`
- custom agents already exist:
  - `po-planning-reviewer`
  - `po-scope-gate-reviewer`
  - `po-docs-researcher`
  - optionally `wm-docs-researcher`
- pod-native setup exists:
  - `codex-cli-auth-setup`
  - `pod-role-bootstrap`
  - normally through `project-bootstrap`

Report must determine:

- Product/Planning has strong repo-local skill coverage but lacks a pod-native
  role-work execution bridge from SOUL identity to Codex invocation.
- A common pod-native `codex-role-workflow` likely solves most of this role's
  issue if it maps Product/Planning to `po-*` skills and durable planning artifacts.
- Additional repo-local Product skill may not be required unless current `po-*`
  skills fail to cover one of intake, sizing, PRD decomposition, or completeness
  review.

Required process to document:

1. Start only after bootstrap readiness.
2. Read user request and accepted SoT.
3. Choose the correct `po-*` skill based on request state:
   - ambiguous request -> `po-requirement-office-hours`
   - broad goal/PRD -> `po-work-unit-planning-and-agent-sprint`
   - ready PRD/work unit -> `po-prd-to-execution`
   - before execution -> `po-planning-completeness-review`
4. Write `00-product-planning/*` and `status.json`.
5. Route reviewer:
   - planning completeness -> `po-planning-reviewer`
   - scope/human gate -> `po-scope-gate-reviewer`
   - SoT uncertainty -> `po-docs-researcher`
6. Stop on human gate or execution role work.

### 6.2 Design

Current expected state:

- repo-local skills already exist:
  - `design-mobile-design-handoff`
  - `design-stitch-mcp-operating-rules`
  - `wm-orchestrate`
  - `git-workflow`
- custom agents already exist:
  - `design-reviewer`
  - `design-researcher`
  - Product/Planning reviewer for P0/P1 scope/evidence readiness
- pod-native setup exists:
  - `stitch-adc-setup`
  - `codex-cli-auth-setup`
  - `pod-role-bootstrap`
  - normally through `project-bootstrap`

Report must determine:

- Design has strong role-specific repo-local coverage.
- Missing piece is an explicit pod-native Codex CLI process that tells Design pod
  how to move from approved planning packet to Stitch setup, P0/P1, artifacts,
  reviewer, and GitHub handoff.
- Existing `design-*` skills may need reinforcement only if they do not clearly
  state pod-originated invocation, output paths, or reviewer/evidence coupling.

Required process to document:

1. Confirm Product/Planning-approved requirement and P0 scope readiness.
2. Confirm `stitch-adc-setup` status if Stitch work is required.
3. Run Design repo-local skill through Codex CLI.
4. Produce exactly two Stitch-backed options.
5. Stop before HTML/image extraction until P1 approval.
6. Publish artifacts under `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/`.
7. Write `01-design/*`, manifest, handoff, state matrix.
8. Route `design-reviewer`.
9. Stop on missing P0/P1, unresolved `DESIGN.md`, or out-of-role API/app work.

### 6.3 Mobile Architect

Current expected state:

- SOUL explicitly states no dedicated repo-local skill is currently assigned.
- current usable skills:
  - `wm`
  - `wm-orchestrate`
  - `git-workflow`
- current custom agents:
  - `wm-implementation-reviewer`
  - `wm-contract-reviewer`
  - `wm-docs-researcher`
  - `wm-gate-fix-advisor`
- pod-native setup exists:
  - `codex-cli-auth-setup`
  - `pod-role-bootstrap`
  - normally through `project-bootstrap`

Report must determine:

- This is likely the largest role-specific gap.
- A common pod-native `codex-role-workflow` can route Mobile Architect to the
  correct SoT and agents, but may not be enough because the role lacks a dedicated
  repo-local Codex skill for architecture notes, route/state impact, ADR, API
  co-sign, and releaseability risk.
- The report must decide whether to recommend a new repo-local
  `mobile-architect-workflow` skill in addition to the pod-native bridge.

Required process to document:

1. Confirm approved work unit and affected runtime surface.
2. Read `PROJECT_ENVIRONMENT.md`, route/state/app architecture, contract impact,
   and release evidence requirements.
3. Determine whether architecture work is:
   - route/state impact review
   - runtime/dependency policy decision
   - API contract co-sign
   - releaseability/EAS strategy risk
   - ADR
4. Use docs researcher/reviewers for uncertainty.
5. Write `02-architecture/*` artifacts.
6. Route execution to Mobile App Dev, Backend/API Integrator, Design, or
   QA/Release without taking ownership.
7. Stop on implementation ownership, backend ownership, release risk acceptance,
   failed gate risk acceptance, or human-gated decision.

### 6.4 Mobile App Dev

Current expected state:

- repo-local skills already exist:
  - `mobile-app-dev-workflow`
  - `wm`
  - `wm-orchestrate`
  - `git-workflow`
- custom agents:
  - `wm-implementation-reviewer`
  - `wm-docs-researcher`
  - `wm-contract-reviewer`
  - `wm-gate-fix-advisor`
- pod-native setup exists:
  - `codex-cli-auth-setup`
  - `pod-role-bootstrap`
  - normally through `project-bootstrap`

Report must determine:

- Mobile App Dev has a primary repo-local implementation skill, but the pod-native
  process still needs to make the role's preconditions explicit:
  approved task, accepted Design handoff, accepted `packages/contracts`, TDD,
  evidence, reviewer, PR handoff.
- The current skill may need reinforcement if it does not fully express
  pod-isolated artifact handoff, role-state `04-mobile-app`, and interaction with
  `status.json`.

Required process to document:

1. Confirm assigned task and non-goals.
2. Confirm Design handoff and API contract where applicable.
3. Write failing test/fixture/selector/validator first.
4. Implement minimal repo-scoped app diff.
5. Run applicable mobile/runtime gates.
6. Write `04-mobile-app/*` evidence and update status.
7. Route implementation review.
8. Handoff to QA/Release or blocked owner.
9. Stop on missing handoff, API ambiguity, design ambiguity, route/runtime
   architecture change, secrets, or human-gated decision.

### 6.5 Backend/API Integrator

Current expected state:

- repo-local skills already exist:
  - `mobile-backend-api-integrator-workflow`
  - `wm`
  - `wm-orchestrate`
  - `git-workflow`
- custom agents:
  - `wm-contract-reviewer`
  - `wm-docs-researcher`
  - optionally `wm-implementation-reviewer` for cross-scope implementation review
- pod-native setup exists:
  - `codex-cli-auth-setup`
  - `pod-role-bootstrap`
  - normally through `project-bootstrap`

Report must determine:

- Backend/API Integrator has a primary repo-local skill, but the role-specific
  pod process must make contract-first behavior explicit.
- The report must distinguish contract-only, integration-only, and bounded backend
  service delivery.
- Existing skill may need reinforcement if it does not sufficiently cover
  migration procedure, service evidence, rollback note, and QA handoff from a pod.

Required process to document:

1. Confirm approved API/backend scope.
2. Decide work type:
   - contract-only
   - mock/fixture integration
   - bounded `apps/api` service
   - migration/service evidence
3. Update `packages/contracts` before app/API duplication.
4. Align mocks, fixtures, auth/session, errors.
5. Implement backend only if explicitly approved.
6. Write `03-contract-api/*` artifacts.
7. Route `wm-contract-reviewer`.
8. Handoff to Mobile App Dev and QA/Release.
9. Stop on UI work, duplicated contracts, private credentials, production-risk
   migrations, or human-gated decisions.

### 6.6 QA/Release

Current expected state:

- repo-local skills already exist:
  - `e2e-test`
  - `qa-railway-workflow`
  - `wm-orchestrate`
  - `git-workflow`
- custom agents:
  - `wm-gate-fix-advisor`
  - `wm-docs-researcher`
  - legacy mobile advisors only where current SoT allows
- pod-native setup exists:
  - `eas-robot-auth-setup`
  - `codex-cli-auth-setup`
  - `pod-role-bootstrap`
  - normally through `project-bootstrap`

Report must determine:

- QA/Release has repo-local E2E and Railway skills, but needs explicit
  pod-native role process for surface classification, evidence ladder, failed
  check routing, and release boundary.
- The report must decide whether QA/Release needs a new repo-local release
  readiness skill beyond `e2e-test` and `qa-railway-workflow`, or whether the
  common pod-native role workflow plus existing skills is enough.

Required process to document:

1. Confirm approved flow/release candidate and target surface.
2. Classify surface:
   - RN Web
   - native simulator/emulator/device
   - Maestro
   - mobile-mcp
   - EAS
   - Railway/deployed API
   - manual human gate
3. Run reset and test plan through `e2e-test` or service evidence through
   `qa-railway-workflow`.
4. Use `eas-robot-auth-setup` before approved EAS/Maestro work.
5. Write `.evidence/e2e-test/*`, `05-qa-release/*`, and `eas-evidence/v1` where
   applicable.
6. Route failure to owner using `failed_check_reference`.
7. Stop on unavailable device/service, production submit, failed-gate risk
   acceptance, secret exposure, or implementation work.

## 7. Cross-Role Implementation Recommendation Plan

The final cross-role recommendation document must evaluate these implementation
options.

### 7.1 New Pod-Native Skill

Candidate:

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md
```

Runtime shape:

```text
/workspace/skills/codex-role-workflow/SKILL.md
```

Purpose:

- bridge pod role identity to repo-local Codex skill/agent usage;
- enforce role-specific allowed skill/agent matrix;
- verify bootstrap/readiness before role work;
- require SoT intake, evidence, reviewer, and durable GitHub handoff;
- stop on human gates, out-of-role work, missing artifacts, failed gate risk,
  or secret-safety issue.

The report must determine whether this skill is required for all six roles. The
expected answer to verify is "yes", because current pod-native skills are setup
and auth readiness only, not role-work execution.

### 7.2 Possible Repo-Local Skill Additions

The report must evaluate role-by-role, but likely candidates are:

- `mobile-architect-workflow`
  - reason: Mobile Architect currently has no dedicated repo-local skill.
  - process: architecture note, route/state impact, runtime/dependency policy,
    API co-sign, releaseability risk, ADR.
- optional `qa-release-readiness-workflow`
  - reason: if `e2e-test` and `qa-railway-workflow` do not cover release
    readiness synthesis beyond individual evidence runs.
- optional reinforcement to existing `mobile-app-dev-workflow` and
  `mobile-backend-api-integrator-workflow`
  - reason: if pod-isolated `status.json`/work-unit artifact handoff is not
    explicit enough.

The report must not recommend new skills just to duplicate existing coverage.
Each recommendation must cite a missing process or missing SoT-to-runtime bridge.

### 7.3 Possible Custom Agent Additions

The report must evaluate whether existing read-only agents are enough.

Likely focus:

- Mobile Architect may need a dedicated read-only architecture reviewer if
  `wm-implementation-reviewer` and `wm-contract-reviewer` do not cover ADR,
  route/state impact, releaseability, and runtime policy review cleanly.
- QA/Release may need a dedicated release-readiness reviewer only if
  `wm-gate-fix-advisor` is too failure-triage oriented and does not review final
  release evidence synthesis.

The report must avoid adding agents when existing reviewer rubrics can be
reinforced instead.

## 8. Validation And Evidence Plan

Because this turn is planning-only, no implementation tests are required for the
plan itself. The final analysis report should still record:

- `git status --short`
- paths of generated analysis docs
- reviewer result, if reviewer is run

If the later implementation adds or modifies skills/agents/docs, expected checks:

- `pnpm run validate:team-doc`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test` if runtime/workspace code paths are affected
- targeted evals under `evals/skills/**` or `evals/agents/**` for new skill/agent
  behavior

## 9. Reviewer Plan

Before finalizing the detailed analysis report, run a read-only reviewer against:

- all role-specific analysis files;
- `07-cross-role-skill-agent-implementation-recommendation.md`;
- the SoT basis list;
- the recommendation that separates:
  - pod-native role bridge skill;
  - repo-local Codex role skills;
  - custom read-only agents;
  - validators/evals.

Reviewer should check:

1. all six SOUL roles are covered;
2. no Gatekeeper SOUL is introduced;
3. role-specific process is concrete enough to implement Codex skills/agents;
4. current state and gap classification are evidence-backed;
5. each proposed skill/agent cites SoT basis and process usage;
6. pod-native and repo-local boundaries are not mixed;
7. human gates, secret safety, and external-proof limits are preserved;
8. recommendations do not duplicate existing skills without a real missing
   process.

Use `wm-implementation-reviewer` unless a more specific reviewer exists for the
final report.

## 10. Delivery Sequence

1. Re-read all SoT files listed in section 3.
2. Inventory actual `.agents/skills`, `.codex/agents`, and pod-native skills.
3. Build a role-by-role evidence table from the six SOUL files.
4. Write `00-index-and-executive-verdict.md`.
5. Write six role-specific analysis documents.
6. Write cross-role implementation recommendation.
7. Write reviewer checklist and final verdict.
8. Run read-only reviewer.
9. Record git status and validation/evidence note.
10. Report concise summary with links to all generated files.

No code implementation, new skill creation, new agent creation, commit, PR, or
merge is included in this planning-only step.
