# Mobile Architect Codex 사용 Skill 분석

Role: Mobile Architect
SOUL: `mobile-app-dev-team/02-role-souls/mobile-architect-soul.md`

## 역할 기준

Mobile Architect는 route/state impact, module boundary, runtime policy, template deviation, API contract co-sign, releaseability risk, ADR을 다룹니다.

이 role은 app 구현, backend service 구현, QA/release 실행, human risk acceptance를 소유하지 않습니다.

## 현재 상태

사용 가능한 repo-local Codex skill:

- `wm`
- `wm-orchestrate`
- `git-workflow`

중요한 문제:

- **전용 `mobile-architect-workflow` repo-local skill이 없습니다.**

사용 가능한 custom agent:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-gate-fix-advisor`

중요한 문제:

- architecture decision quality를 전담 review하는 custom agent가 없습니다.

pod-native setup skill:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

주요 durable artifact:

- `docs/plans/work-units/<work-unit-id>/02-architecture/architecture-note.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/route-state-impact.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/api-contract-cosign.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/releaseability-risk.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/adr.md`

판정: **가장 큰 gap**입니다. pod-native bridge도 필요하지만, 그보다 먼저 또는 함께 `mobile-architect-workflow` repo-local skill이 필요합니다.

## Role-specific Codex 운영 보강

Mobile Architect pod에서 Codex는 architecture 판단을 구현으로 바꾸지 않고, SoT 기반 decision artifact로 만들어야 합니다.

1. 먼저 SoT를 read-only로 확인합니다. `AGENTS.md`, `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`, Mobile Architect SOUL, Product/Planning packet, 관련 Design/API/QA artifact를 읽습니다.
2. architecture trigger를 분류하고, 승인된 work unit 없이 새 architecture scope를 만들지 않습니다.
3. 계획에는 어떤 `02-architecture/*` artifact를 작성할지, 어떤 owner에게 handoff할지, 어떤 human gate가 필요한지를 명시합니다.
4. runtime/dependency/EAS/Expo/React Native 정책처럼 외부 공식 문서가 필요한 경우 `wm-docs-researcher` 또는 공식 문서 확인을 계획에 포함합니다.
5. 계획은 `mobile-architect-reviewer`가 추가되기 전까지 `wm-implementation-reviewer`, `wm-contract-reviewer`, `wm-docs-researcher`를 조합해 검토합니다.
6. 계획 승인 후에만 ADR, route/state impact, API co-sign, releaseability risk 문서를 작성합니다.
7. 최종 reviewer는 decision quality, role boundary, execution owner handoff, external proof limit를 확인합니다.
8. `git diff`와 `git status --short`로 architecture artifact만 의도대로 바뀌었는지 확인하고 보고합니다.

`mobile-architect-workflow`는 최소한 다음 checklist를 포함해야 합니다.

- decision: 어떤 architecture decision 또는 risk를 다루는가
- evidence: 어떤 SoT와 공식 문서를 근거로 삼는가
- impact: route/state/module/API/runtime/releaseability 영향은 무엇인가
- owner: 구현, API, QA, Product/human gate 중 누가 다음 owner인가
- stop: app/backend 구현, release execution, human risk acceptance를 하지 않았는가

## 필요한 Codex CLI 프로세스

1. `project-bootstrap`와 `pod-role-bootstrap` 결과를 확인합니다.
2. `WM_ROLE` 또는 `/workspace/IDENTITY`가 Mobile Architect인지 확인합니다.
3. 승인된 work unit인지 확인합니다. 승인된 scope 없이 architecture work를 만들지 않습니다.
4. architecture trigger를 분류합니다.
   - route/state impact
   - module boundary
   - runtime/dependency policy
   - API contract co-sign
   - releaseability/EAS strategy risk
   - ADR
5. 관련 SoT를 읽습니다.
   - `AGENTS.md`
   - `PROJECT_ENVIRONMENT.md`
   - Mobile Architect SOUL
   - Product/Planning task packet
   - Design/API/QA artifact
6. 오늘 기준으로는 `$wm` 명시 호출 또는 `wm-orchestrate`를 사용합니다.
7. 향후에는 `mobile-architect-workflow`를 사용해야 합니다.
8. `02-architecture/*` artifact를 작성합니다.
9. 다음 owner로 handoff합니다.
   - app 구현: Mobile App Dev
   - API/service: Backend/API Integrator
   - design impact: Design
   - release evidence: QA/Release
   - scope/human gate: Product/Planning 또는 human owner

## 현재 문제점

Missing process:

- ADR, route/state impact, API co-sign, releaseability risk를 처리하는 반복 가능한 Codex CLI 절차가 없습니다.

Missing repo-local Codex skill:

- `mobile-architect-workflow`가 필요합니다.

Missing pod-native bridge skill:

- `codex-role-workflow`가 필요합니다. Mobile Architect pod를 현재 interim path 또는 향후 `mobile-architect-workflow`로 연결해야 합니다.

Missing custom reviewer/researcher/advisor:

- `mobile-architect-reviewer` 추가를 검토해야 합니다.

Ambiguous handoff path:

- `02-architecture/*` 경로는 있지만, 어떤 trigger가 어떤 artifact로 가야 하는지 강제하는 skill이 없습니다.

Overlap or role-boundary risk:

- Mobile Architect가 app 구현, backend service 구현, release operation으로 넘어갈 위험이 큽니다.

External proof or human-gate risk:

- architecture note는 native/EAS/pod/branch-protection proof가 아닙니다. release risk나 failed-gate-risk는 human gate가 필요합니다.

Validator/eval gap:

- app/backend 구현 요청을 거부하는 eval이 필요합니다.
- ADR, route/state, API co-sign 요청이 `mobile-architect-workflow`로 routing되는 eval이 필요합니다.

## 추가/보강 권고

필수 추가 1:

- `.agents/skills/mobile-architect-workflow/SKILL.md`

이 skill은 다음을 다뤄야 합니다.

- architecture trigger 분류
- `02-architecture/*` artifact 작성 기준
- reviewer/researcher routing
- execution owner handoff
- SoT 기반 read-only 계획, plan reviewer, 승인 후 작성, final reviewer, diff/status 보고
- app/backend 구현 중단

필수 추가 2:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`

선택 추가:

- `.codex/agents/mobile-architect-reviewer.toml`

## 완료 기준

- Mobile Architect role에 전용 workflow가 있습니다.
- architecture artifact가 `02-architecture/*`에 기록됩니다.
- architecture 계획은 실행 전에 reviewer로 검토됩니다.
- implementation ownership을 가져가지 않습니다.
- API co-sign은 Backend/API Integrator와 연결됩니다.
- releaseability risk는 QA/Release와 human gate로 연결됩니다.
- 최종 reviewer가 decision quality와 handoff를 확인합니다.
- `git diff`와 `git status --short` 확인 결과가 보고됩니다.
