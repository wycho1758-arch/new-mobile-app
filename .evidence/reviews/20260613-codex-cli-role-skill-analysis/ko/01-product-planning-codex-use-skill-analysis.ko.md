# Product/Planning Codex 사용 Skill 분석

Role: Product/Planning
SOUL: `mobile-app-dev-team/02-role-souls/product-planning-soul.md`

## 역할 기준

Product/Planning은 요청을 받아서 요구사항을 명확히 하고, 작업 단위를 나누고, acceptance criteria와 evidence를 정의하고, 다음 role owner를 정하는 역할입니다.

이 role은 app/backend/design/QA/release 구현을 하지 않습니다. 사람의 승인이 필요한 human gate도 이 role이 식별하고 멈춰야 합니다.

## 현재 상태

사용 가능한 repo-local Codex skill:

- `po-requirement-office-hours`
- `po-work-unit-planning-and-agent-sprint`
- `po-prd-to-execution`
- `po-planning-completeness-review`
- `wm-orchestrate`
- `git-workflow`

사용 가능한 custom agent:

- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `po-docs-researcher`
- `wm-docs-researcher`

pod-native setup skill:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

주요 durable artifact:

- `docs/plans/work-units/<work-unit-id>/00-product-planning/*`
- `docs/plans/work-units/<work-unit-id>/07-pr/story-pr-plan.md`
- `docs/plans/work-units/<work-unit-id>/status.json`

판정: **부분 충족**입니다. Product/Planning skill 자체는 충분하지만, pod에서 어떤 `po-*` skill을 언제 선택해야 하는지 알려주는 pod-native bridge가 없습니다.

## Role-specific Codex 운영 보강

Product/Planning pod에서 Codex는 다음 순서를 기본값으로 가져야 합니다.

1. SoT를 읽고 요청 상태를 분류합니다. 이 단계에서는 수정하지 않습니다.
2. 요구사항, scope, human gate, next owner가 SoT로 확인되지 않으면 추측하지 않고 unknown으로 남깁니다.
3. `00-product-planning/*`, `07-pr/story-pr-plan.md`, `status.json`에 어떤 산출물이 필요한지 계획합니다.
4. 계획에는 어떤 `po-*` skill을 사용할지, 어떤 reviewer가 검토할지, 어떤 handoff artifact가 생길지를 명시합니다.
5. `po-planning-reviewer` 또는 `po-scope-gate-reviewer`로 계획을 검토하고 사용자에게 보고합니다.
6. 계획 승인 후에만 planning artifact를 작성하거나 갱신합니다.
7. 작업 완료 후 reviewer가 final scope, acceptance criteria, evidence, human gate, next owner를 다시 확인합니다.
8. `git diff`와 `git status --short`로 planning 변경이 승인된 방향과 일치하는지 확인하고 보고합니다.

이 보강은 Product/Planning이 구현을 시작하지 않도록 막고, 모호한 요청을 role-owned planning artifact로 정리하기 위한 기준입니다.

## 필요한 Codex CLI 프로세스

1. `project-bootstrap` 결과로 pod readiness를 확인합니다.
2. `WM_ROLE` 또는 `/workspace/IDENTITY`로 Product/Planning role인지 확인합니다.
3. checked-out repo에서 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, Product/Planning SOUL, `.agents/skills`, `.codex/agents`를 확인합니다.
4. 요청 상태에 따라 skill을 고릅니다.
   - 모호한 요청: `po-requirement-office-hours`
   - 넓은 목표/PRD: `po-work-unit-planning-and-agent-sprint`
   - 준비된 PRD/work unit: `po-prd-to-execution`
   - 실행 전 readiness 확인: `po-planning-completeness-review`
   - 이미 `status.json`이 있는 경우: `wm-orchestrate`
   - branch/PR handoff: `git-workflow`
5. `00-product-planning/*`와 `status.json`을 작성하거나 갱신합니다.
6. reviewer를 호출합니다.
   - planning completeness: `po-planning-reviewer`
   - scope/human gate: `po-scope-gate-reviewer`
   - SoT 불확실성: `po-docs-researcher`
7. branch/commit/PR 또는 committed work-unit artifact로 handoff합니다.

## 현재 문제점

Missing process:

- pod가 Product/Planning role일 때 어떤 `po-*` skill을 선택해야 하는지 결정하는 실행 절차가 없습니다.

Missing pod-native bridge skill:

- 필요합니다. `codex-role-workflow`가 Product/Planning role identity와 `po-*` skill decision tree를 연결해야 합니다.

Missing repo-local Codex skill:

- 현재 추가 필요 없음. `po-*` skill이 주요 workflow를 충분히 덮고 있습니다.

Missing custom reviewer/researcher/advisor:

- 현재 추가 필요 없음. `po-*` reviewer/researcher가 있습니다.

Ambiguous handoff path:

- `10-github-artifact-workflow.md`에는 경로가 있지만, pod-native 실행 과정이 그 경로를 강제하지 않습니다.

Overlap or role-boundary risk:

- bridge가 없으면 Product/Planning이 구현 role로 넘어갈 위험이 있습니다.

External proof or human-gate risk:

- planning output은 production submit, privacy/legal/payment, failed-gate-risk 승인 증거가 아닙니다.

Validator/eval gap:

- `codex-role-workflow` eval이 필요합니다. 모호한 요청, 넓은 PRD, ready PRD, implementation request stop을 검증해야 합니다.

## 추가/보강 권고

추가:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`

이 skill은 다음을 해야 합니다.

- Product/Planning role인지 확인
- 요청 상태에 맞는 `po-*` skill 선택
- `00-product-planning/*` artifact checklist 제시
- 필요한 reviewer 지정
- SoT 기반 read-only 계획, plan reviewer, 승인 후 실행, final reviewer, diff/status 보고를 강제
- human gate 또는 out-of-role work에서 중단

## 완료 기준

- Product/Planning pod가 요청 상태별로 올바른 `po-*` skill을 선택합니다.
- `00-product-planning/*`와 `status.json`을 정확히 연결합니다.
- 계획은 실행 전에 reviewer로 검토되고 사용자에게 보고됩니다.
- human gate에서 멈춥니다.
- 구현 작업을 직접 하지 않습니다.
- 최종 reviewer가 planning 산출물과 handoff가 목적을 충족했는지 확인합니다.
- `git diff`와 `git status --short` 확인 결과가 보고됩니다.
- GitHub branch/commit/PR 또는 committed artifact로 handoff합니다.
