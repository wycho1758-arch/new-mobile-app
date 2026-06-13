# Backend/API Integrator Codex 사용 Skill 분석

Role: Backend/API Integrator
SOUL: `mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md`

## 역할 기준

Backend/API Integrator는 mobile-facing API contract, zod schema, TypeScript type, auth/session, error mapping, mocks, fixtures, bounded backend service delivery를 담당합니다.

React Native UI를 구현하지 않으며, API type은 반드시 `packages/contracts`를 SoT로 사용해야 합니다.

## 현재 상태

사용 가능한 repo-local Codex skill:

- `mobile-backend-api-integrator-workflow`
- `wm`
- `wm-orchestrate`
- `git-workflow`

사용 가능한 custom agent:

- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-implementation-reviewer`
- `wm-gate-fix-advisor`

pod-native setup skill:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

주요 durable artifact:

- `docs/plans/work-units/<work-unit-id>/03-contract-api/api-contract.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/contract-diff.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/mock-fixture-report.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/backend-service-evidence.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/migration-note.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/runtime-smoke.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/rollback-note.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/reviewer.md`

판정: **부분 충족**입니다. primary API skill은 있지만, pod에서 contract-only, fixture integration, bounded backend service delivery를 분류하는 bridge가 필요합니다.

## Role-specific Codex 운영 보강

Backend/API Integrator pod에서 Codex는 구현보다 contract classification을 먼저 해야 합니다.

1. SoT를 read-only로 확인합니다. Product/Planning task, `packages/contracts`, existing API routes/services/db boundaries, Mobile App Dev needs, QA evidence requirements를 읽습니다.
2. 계획 단계에서는 schema, mock, fixture, backend code를 수정하지 않습니다.
3. 작업을 contract-only, mock/fixture integration, bounded backend service, migration/service evidence 중 하나 이상으로 분류합니다.
4. 계획에는 `packages/contracts` 변경 여부, compatibility risk, auth/session/error mapping, mock/fixture impact, migration/rollback need, reviewer output path를 포함합니다.
5. 외부 API, auth provider, Railway, database, migration tool의 공식 문서가 필요하면 `wm-docs-researcher` 또는 공식 문서 확인을 계획에 포함합니다.
6. 계획은 `wm-contract-reviewer`로 검토하고 사용자에게 보고합니다.
7. 계획 승인 후에만 contract/test/fixture/service 변경을 진행합니다.
8. 작업 완료 후 최종 reviewer가 contract SoT, duplicate type 금지, service evidence, rollback note, handoff quality를 확인합니다.
9. `git diff`와 `git status --short`로 contract/API/evidence 변경이 승인된 scope와 일치하는지 확인하고 보고합니다.

이 보강은 Backend/API Integrator가 React Native UI 구현, QA readiness self-approval, production credential handling, irreversible migration approval을 대신하지 않도록 하는 기준입니다.

### Codex API Contract Plan Packet

Backend/API Integrator의 API 계획은 Mobile App Dev와 QA/Release가 추측 없이 소비할 수 있을 정도로 구체적이어야 합니다. feature 이름만 있고 endpoint shape, schema name, fixture, error mapping이 없으면 부족합니다.

필수 packet field:

- work-unit id와 consuming mobile flow
- work type classification: contract-only, mock/fixture, bounded backend service, migration, deployment config, service evidence
- HTTP API가 있으면 endpoint, method, path
- `packages/contracts` 안의 zod schema name
- request/response example
- auth, session, error mapping
- mocks, fixtures, fixture ownership
- compatibility 또는 breaking-change assessment
- scope에 포함된 경우 migration, rollback, runtime-smoke, service-evidence path
- 실행할 verification commands와 evidence path
- plan reviewer output path
- final reviewer output path

실행 제약:

- reviewed plan report가 있기 전에는 contract, API, mock, fixture, migration, service config를 수정하지 않습니다.
- final reviewer가 실제 diff, command output, evidence, `packages/contracts`, duplicate type 금지, `03-contract-api/*` artifact를 승인된 계획과 대조하기 전에는 최종 완료 보고를 하지 않습니다.
- 완료 보고에는 변경 경로의 `git diff`와 전체 `git status --short` 요약이 들어가야 합니다.
- 승인된 backend scope, migration approval, service evidence path, consuming mobile flow가 없으면 추측하지 않고 `blocked` 또는 handoff로 처리합니다.

## 필요한 Codex CLI 프로세스

1. pod readiness를 확인합니다.
2. role이 Backend/API Integrator인지 확인합니다.
3. 승인된 API/backend scope를 확인합니다.
4. 작업 유형을 분류합니다.
   - contract-only
   - mock/fixture integration
   - bounded `apps/api` backend service
   - migration/service evidence
5. `mobile-backend-api-integrator-workflow`를 사용합니다.
6. `packages/contracts`를 먼저 갱신하거나 확인합니다.
7. mocks, fixtures, auth/session, error mapping을 contract와 맞춥니다.
8. backend 구현은 승인된 scope가 있을 때만 합니다.
9. `wm-contract-reviewer` review를 받습니다.
10. `03-contract-api/*` artifact를 작성하고 Mobile App Dev 및 QA/Release로 handoff합니다.

## 현재 문제점

Missing process:

- fresh Backend/API pod가 `mobile-backend-api-integrator-workflow`를 언제 어떻게 사용할지 판단하는 bridge가 없습니다.

Missing pod-native bridge skill:

- 필요합니다. `codex-role-workflow`가 role identity, work-type classification, `03-contract-api/*`, reviewer routing을 연결해야 합니다.

Missing repo-local Codex skill:

- 현재 추가 필요 없음. primary API workflow는 있습니다.

Missing custom reviewer/researcher/advisor:

- 현재 추가 필요 없음. `wm-contract-reviewer`가 contract review에 적합합니다.

Ambiguous handoff path:

- `03-contract-api/*`, service evidence, migration note, rollback note, QA handoff를 더 명확히 강제해야 합니다.

Overlap or role-boundary risk:

- Backend/API Integrator가 React Native UI를 구현하거나, `packages/contracts` 외부에 duplicate type을 만들거나, QA readiness를 self-approve하면 안 됩니다.

External proof or human-gate risk:

- local service evidence는 production readiness가 아닙니다. production credential, irreversible migration, PII/payment/legal/compliance, failed-gate-risk는 human gate입니다.

Validator/eval gap:

- UI 요청을 중단하거나 Mobile App Dev로 routing하는 eval이 필요합니다.
- `packages/contracts` 사용을 강제하는 eval이 필요합니다.

## 추가/보강 권고

추가:

- `codex-role-workflow`

보강:

- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`

보강 내용:

- contract-only / fixture / backend service classification
- Mobile App Dev와 QA/Release가 추측 없이 소비할 수 있는 `Codex API Contract Plan Packet`
- `03-contract-api/*` outputs
- migration note
- runtime smoke
- rollback note
- service evidence
- plan reviewer와 final reviewer
- `git diff`/`git status --short` 확인
- QA/Release handoff

현재 실제 `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`는 이 분석보다 얇습니다. 이후 실제 skill 구현에서는 complete API contract packet, pre-implementation reviewer, final reviewer, `git diff`, `git status --short`, `03-contract-api/*` durable artifact 계약을 추가해야 합니다.

## 완료 기준

- API 작업 유형을 먼저 분류합니다.
- API contract plan packet은 Mobile App Dev와 QA/Release가 추측 없이 소비할 수 있을 만큼 구체적입니다.
- `packages/contracts`가 단일 SoT입니다.
- 계획은 수정 전에 `wm-contract-reviewer`로 검토됩니다.
- mocks/fixtures가 contract와 일치합니다.
- backend service는 승인된 경우만 구현됩니다.
- service evidence와 rollback note가 필요 시 존재합니다.
- 최종 reviewer가 contract, evidence, handoff를 확인합니다.
- `git diff`와 `git status --short` 확인 결과가 보고됩니다.
- `wm-contract-reviewer` evidence 후 handoff합니다.
