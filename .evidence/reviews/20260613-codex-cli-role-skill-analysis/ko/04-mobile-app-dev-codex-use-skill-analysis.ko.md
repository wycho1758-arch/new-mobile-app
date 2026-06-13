# Mobile App Dev Codex 사용 Skill 분석

Role: Mobile App Dev
SOUL: `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md`

## 역할 기준

Mobile App Dev는 승인된 task, Design handoff, API contract를 기준으로 Expo React Native 구현을 담당합니다. TDD가 필수이고, NativeWind/RN primitives/semantic tokens/stable `testID`를 사용해야 합니다.

## 현재 상태

사용 가능한 repo-local Codex skill:

- `mobile-app-dev-workflow`
- `wm`
- `wm-orchestrate`
- `git-workflow`

사용 가능한 custom agent:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-gate-fix-advisor`

pod-native setup skill:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

주요 durable artifact:

- `docs/plans/work-units/<work-unit-id>/04-mobile-app/implementation-summary.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/test-plan.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/selector-changes.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/api-integration-note.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/command-output.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/reviewer.md`

판정: **부분 충족**입니다. `mobile-app-dev-workflow`는 있지만, pod에서 precondition 확인과 `04-mobile-app/*` handoff를 강제하는 bridge가 필요합니다.

## Role-specific Codex 운영 보강

Mobile App Dev pod에서 Codex는 구현 전에 승인된 task와 구현 가능 조건을 먼저 증명해야 합니다.

1. SoT를 read-only로 확인합니다. Product/Planning task, Design handoff, `packages/contracts`, Mobile Architect note, QA 요구사항을 확인합니다.
2. 계획 단계에서는 코드를 수정하지 않습니다. UI/API/runtime 조건이 부족하면 추측하지 않고 해당 owner로 되돌립니다.
3. 계획에는 변경 대상 파일, 먼저 추가할 failing test/eval/fixture/validator, 필요한 selector/testID 변경, 실행할 검증 명령, reviewer output path를 포함합니다.
4. 계획은 `wm-implementation-reviewer`로 검토하고 사용자에게 보고합니다. API contract ambiguity가 있으면 `wm-contract-reviewer`도 사용합니다.
5. 계획 승인 후 tests-first로 구현합니다.
6. 작업 완료 후 command output과 exit status를 `04-mobile-app/*`에 기록합니다.
7. 최종 reviewer는 구현이 승인된 task, Design/API/architecture 조건, TDD evidence, role boundary를 충족했는지 확인합니다.
8. `git diff`와 `git status --short`로 app 변경, tests, evidence가 계획과 일치하는지 확인하고 보고합니다.

이 보강은 Mobile App Dev가 API contract 생성, backend implementation, QA/release approval, human gate acceptance를 대신하지 않도록 하는 기준입니다.

### Codex Implementation Plan Packet

Mobile App Dev의 구현 계획은 다른 독립 pod가 추측 없이 실행할 수 있을 정도로 구체적이어야 합니다. "화면을 수정한다" 또는 "API를 연결한다" 수준의 계획은 부족합니다.

필수 packet field:

- 승인된 task 또는 work-unit id
- 정확한 route, screen, component, module
- UI 작업의 Design handoff path와 선택된 Design option
- 해당 state matrix 항목: default, loading, empty, error, permission-denied 등
- API-backed 작업의 API contract, mock, fixture path와 version
- route/runtime/dependency/state/navigation architecture 영향이 있으면 Mobile Architect note path
- 구현 전에 먼저 추가/수정할 test, eval, fixture, validator
- selector 및 `testID` 영향, stable kebab-case 이름
- non-goals와 stop conditions
- 실행할 verification commands와 evidence path
- plan reviewer output path
- final reviewer output path

실행 제약:

- reviewed plan report가 있기 전에는 app code를 수정하지 않습니다.
- final reviewer가 실제 diff, command output, evidence, `04-mobile-app/*` artifact를 승인된 계획과 대조하기 전에는 최종 완료 보고를 하지 않습니다.
- 완료 보고에는 변경 경로의 `git diff`와 전체 `git status --short` 요약이 들어가야 합니다.
- 필요한 Design handoff, contract/fixture, architecture note, human-gate decision이 없으면 추측하지 않고 `blocked` 또는 handoff로 처리합니다.

## 필요한 Codex CLI 프로세스

1. pod readiness를 확인합니다.
2. role이 Mobile App Dev인지 확인합니다.
3. 실행 승인 조건을 확인합니다.
   - 승인된 Product/Planning task
   - UI 작업이면 Design handoff
   - API-backed 작업이면 `packages/contracts` 또는 승인된 mock/fixture
   - route/runtime 영향이면 Mobile Architect note
4. `mobile-app-dev-workflow`를 사용합니다.
5. 구현 전에 가장 좁은 failing test/eval/validator/fixture를 먼저 추가합니다.
6. app code는 `apps/mobile/**` 안에서 최소 변경으로 구현합니다.
7. 필요한 검증을 실행합니다.
8. `04-mobile-app/*`에 evidence와 command output을 기록합니다.
9. `wm-implementation-reviewer` review를 받습니다.
10. QA/Release로 handoff합니다.

## 현재 문제점

Missing process:

- fresh Mobile App Dev pod가 언제 `mobile-app-dev-workflow`를 사용할 수 있는지 판단하는 bridge가 없습니다.

Missing pod-native bridge skill:

- 필요합니다. `codex-role-workflow`가 Mobile App Dev identity, precondition, tests-first, reviewer, `04-mobile-app/*`를 연결해야 합니다.

Missing repo-local Codex skill:

- 현재 추가 필요 없음. primary skill은 있습니다.

Missing custom reviewer/researcher/advisor:

- 현재 추가 필요 없음. `wm-implementation-reviewer`와 `wm-contract-reviewer`가 있습니다.

Ambiguous handoff path:

- `04-mobile-app/*`, command output, reviewer evidence, PR handoff를 bridge와 skill에서 강제해야 합니다.

Overlap or role-boundary risk:

- Mobile App Dev가 API contract를 만들거나 backend를 구현하거나 QA/release approval을 주장하면 안 됩니다.

External proof or human-gate risk:

- local test는 native/EAS/device proof가 아닙니다. production/privacy/legal/payment/failed-gate-risk는 human gate입니다.

Validator/eval gap:

- Design handoff 없는 UI 구현 요청을 거부하는 eval이 필요합니다.
- API ambiguity를 Backend/API Integrator로 routing하는 eval이 필요합니다.

## 추가/보강 권고

추가:

- `codex-role-workflow`

보강:

- `.agents/skills/mobile-app-dev-workflow/SKILL.md`

보강 내용:

- 승인된 task 필요
- Design/API/architecture precondition
- 다른 pod가 추측 없이 실행 가능한 `Codex Implementation Plan Packet`
- tests-first
- `04-mobile-app/*`
- plan reviewer와 final reviewer
- reviewer evidence
- `git diff`/`git status --short` 확인
- GitHub branch/PR handoff

현재 실제 `.agents/skills/mobile-app-dev-workflow/SKILL.md`는 이 분석보다 얇습니다. 이후 실제 skill 구현에서는 complete packet, pre-implementation reviewer, final reviewer, `git diff`, `git status --short`, `04-mobile-app/*` durable artifact 계약을 추가해야 합니다.

## 완료 기준

- 승인된 execution task 없이 시작하지 않습니다.
- UI 작업은 Design handoff를 요구합니다.
- API-backed 작업은 `packages/contracts`를 요구합니다.
- 구현 계획은 수정 전에 reviewer로 검토됩니다.
- 구현 계획 packet은 다른 독립 pod가 추측 없이 실행할 수 있을 만큼 구체적입니다.
- 테스트/eval/fixture/validator가 구현보다 먼저 있습니다.
- command output과 exit status가 기록됩니다.
- 최종 reviewer가 구현 결과와 evidence를 확인합니다.
- `git diff`와 `git status --short` 확인 결과가 보고됩니다.
- reviewer evidence 후 QA/Release로 handoff됩니다.
