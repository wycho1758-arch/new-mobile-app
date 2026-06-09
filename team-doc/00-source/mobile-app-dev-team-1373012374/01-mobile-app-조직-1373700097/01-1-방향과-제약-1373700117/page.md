---
pageId: "1373700117"
sourceTitle: "01-1. 방향과 제약"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700117"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | Mobile App 조직의 목적·전제·생성 표면 기준 가능/불가·중요 제약·MVP 제외 목록을 정의한다. 본 섹션 전체의 방향 기준점이다. |
| --- | --- |
| Upstream | \[00\] 00-1 원칙과 제약, \[01\] 부모 |
| --- | --- |
| Downstream | 01-2, 01-6, 01-7 (01-3\~01-5는 01-2를 통한 전이 의존) |
| --- | --- |
| 관련 DEC-ID | DEC-004, DEC-013, DEC-020 |
| --- | --- |
| 출처 | 운영계획 §1·§2·§7 |
| --- | --- |

## 1. 목적과 결론

이 문서는 프로그램 수정 계획이 아닙니다. 목표는 사용자가 `admin-portal`과 `admin-api`가 제공하는 조직 생성/배포 flow를 통해 신규 모바일앱 프로젝트를 만들 LLM 개발 조직을 well-made 형태로 구성하는 것입니다.

정확한 전제는 다음과 같습니다.

```
admin-portal / admin-api\n= 사용자-facing 조직 생성/운영 표면\n= Soul Builder Job, deploy API, organization, departments, agents, SOUL.md, rooms, Tasks, webhook\n\nnew-mobile-app repo\n= 실제 신규 모바일앱 프로젝트\n= Confluence 설계안(ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안, pageId 1371963427) 기준 모노레포 템플릿\n= pnpm workspace + Turborepo, apps/mobile(Expo), packages/contracts\n= EAS, Maestro, GitHub CI, Codex skills, deterministic gate, evidence
```

최종 판단:

* 현재 프로젝트의 소스를 생성된 agent가 직접 호출하거나 수정해서 조직을 구성하는 개념은 아닙니다.
* 사용자는 `admin-portal`에서 조직 생성을 요청하고, `admin-api`가 Soul Builder Job과 deploy API를 통해 조직/부서/agent/k8s resources를 생성합니다.
* 생성된 agents는 이후 rooms, Tasks, workspace, 신규 mobile repo에서 작업합니다.
* 신규 mobile repo의 기본 환경(모노레포 구조, 스택, EAS/Maestro/Sentry 구성)은 Confluence 설계안을 SoT로 따릅니다. 본 문서는 그 위에 조직 운영 레이어(gatekeeper, evidence, repo-scoped skills, PR template)를 정의합니다.
* 앱 코드와 CI/CD 강제력은 신규 mobile repo에 둡니다.
* 조직은 MVP 기준 `6 LLM agents + non-LLM Gatekeeper`가 적정합니다.
* Backend/API Integrator는 Mobile App Dev와 분리해야 합니다.
* Gatekeeper는 LLM agent가 아니라 `Codex skill wrapper + deterministic script + GitHub required check`로 둡니다.
* `openclaw-cloud` agent image와 runtime bootstrap 코드는 생성된 조직의 운영 대상이 아닙니다. 필요한 CLI는 agent 생성 후 bootstrap task로 설치합니다.

## 2. admin-portal/admin-api 생성 표면 기준 가능한 것과 아닌 것

### 가능한 것

사용자가 실제로 이용하는 생성/운영 표면은 `admin-portal`과 `admin-api`입니다. 아래 SoT 경로는 운영자가 직접 호출할 파일이 아니라, 해당 표면이 실제로 존재하는지 검증하기 위한 내부 근거입니다. 생성된 agents의 SOUL.md나 작업 지시에는 아래 내부 경로를 실행 대상으로 넣지 않습니다.

| 운영 표면 | SoT 검증 근거(내부 경로) | 검증 기반 판단(운영 지시 아님) |
| --- | --- | --- |
| admin-portal onboarding/Soul Builder flow | `src/admin-portal/app/(onboarding)/onboarding/hooks/use-soul-builder-job.ts:13` | 사용자가 portal에서 Soul Builder Job을 시작할 수 있음 |
| admin-api Soul Builder Job 시작 | `src/admin-api/src/routes/ai-chat.ts:331` | 요청을 받아 SOUL.md 생성 job을 시작함 |
| admin-api Soul Builder deploy API | `src/admin-api/src/routes/ai-chat.ts:380` | 완료된 job을 조직/부서/agent 생성으로 배포함 |
| department/agent 생성 | `src/admin-api/src/services/soul-builder-job.service.ts:633`, `:741` | 가입 시 생성된 organization을 재활용하고, 사용자 flow로 department/agent 생성 가능 |
| SOUL.md server-side 보강 | `src/admin-api/src/services/agent-orchestrator.ts:57`, `:140`, `:427` | 생성된 SOUL.md에 Security Policy와 Sub-Agent Delegation mandatory section을 보강함 |
| SOUL.md pod 마운트 | `src/admin-api/src/services/k8s-manifests.ts:633` | 생성된 agent runtime에 SOUL.md를 주입 가능 |
| agent별 workspace/root PVC | `src/admin-api/src/services/k8s-manifests.ts:622`, `:700` | 생성 후 workspace 기반 CLI/bootstrap 가능 |
| Tasks MCP 등록 지원 | `src/tasks/src/core/init.ts:209` | Claude/Codex 모두 Tasks 접근 가능 |
| Task 기본 필드 | `src/tasks/src/types/index.ts:26` | execution task 저장 가능 |
| room/task 알림 | `src/admin-api/src/services/task-notification.ts:625` | task 이벤트를 room으로 전달 가능 |
| webhook preset/rule | `src/admin-api/src/services/webhook.service.ts:286`, `:372` | GitHub/Jira/Sentry 등 이벤트 routing 가능 |

### 런타임 이미지 호환성 검증 근거 (읽기 전용, 영향도 0)

아래 항목은 admin-portal/admin-api 생성 표면이 아니라, 생성된 agent가 사용할 런타임 이미지의 호환성을 확인한 읽기 전용 근거입니다. 이 보고서는 agent image, entrypoint, runtime bootstrap 코드를 수정하거나 생성된 agent의 작업 대상으로 삼지 않습니다.

| 확인 대상 | SoT 검증 근거(내부 경로) | 검증 결과 |
| --- | --- | --- |
| Claude Code CLI 지원 | `agent/Dockerfile:222` | 생성된 agent의 기본 coding executor로 사용 가능함을 확인함. 이미지 수정은 범위 밖임 |
| Codex 인증 호환성 | `agent/entrypoint.sh:1559` | 런타임 이미지가 Codex 인증 sync를 지원함을 확인함. 프로젝트별 인증과 Codex CLI 설치는 생성 후 bootstrap task에서 준비함 |

### 아직 아닌 것

| 항목 | 현재 상태 | 운영 판단 |
| --- | --- | --- |
| 모바일앱 repo template | Confluence 설계안 확정(pageId 1371963427, 모노레포: pnpm + Turborepo + apps/mobile + packages/contracts) | repo 구현은 Phase 3에서 설계안 기준으로 수행 |
| EAS/Maestro native adapter | Confluence 설계안에 EAS Workflows(build→maestro, e2e-test profile) 설계 확정 | repo 구현은 Phase 3, 결과 수집은 evidence JSON 브리지로 처리 |
| Gatekeeper hard gate | 없음(Confluence 템플릿에는 quality-gate lint/test만 존재) | 신규 repo GitHub required check로 처리 — 템플릿 위 조직 레이어로 추가 |
| Tasks evidence 전용 schema | 없음 | MVP는 `.evidence/*.json`과 task/PR comment로 처리 |
| task status hard-block | 없음 | 하드 차단은 GitHub CI에 둠 |
| secret-only custom env | generic envVars는 ConfigMap/plain env에도 노출. agent pod에 `envFrom secretRef`로 임의 Secret을 붙이는 기능 없음(`k8s-manifests.ts`는 개별 `secretKeyRef`만). agent image에 eas-cli 미설치 | `EXPO_TOKEN`은 Confluence §8 패턴(Robot user + k8s Secret + 별도 Job) 또는 GitHub/EAS secrets 사용. agent workspace bootstrap CLI 설치는 보조 수단 |

중요한 제약:

* `src/tasks/backlog/config.yml`의 status는 `To Do / In Progress / Done`입니다.
* `onStatusChange` callback 실패는 상태 전이를 막지 않습니다.
* 따라서 현재 Tasks를 hard gate로 쓰면 안 됩니다.
* `EXPO_TOKEN`, GitHub token은 admin-api의 generic `envVars` 경로로 넣으면 ConfigMap/plain env 노출 위험이 있으므로, GitHub/EAS secrets 또는 별도 secret-only 주입 경로를 사용해야 합니다.
* EAS CLI 실행은 Confluence 설계안 §8의 Robot user + k8s Secret(`infra/clawpod/secret.example.yaml`) + 별도 Job(`infra/clawpod/agent-runner.yaml`) 패턴을 공식 예시로 따릅니다. agent pod에는 `envFrom secretRef` 기능과 eas-cli가 없으므로, agent가 workspace에서 직접 EAS CLI를 실행하는 bootstrap 방식은 보조 수단이며 이 경우에도 token은 secret-only 경로로만 주입합니다.

## 7. 최종 권고

지금 해야 할 일은 `openclaw-cloud` 소스를 생성된 agent가 직접 사용하는 구조를 만드는 것이 아니라, 사용자가 `admin-portal/admin-api` 생성 flow로 만들 모바일 개발 조직을 명확히 정의하는 것입니다.

권장 순서는 다음입니다.

1. 이 문서 기준으로 admin-portal/admin-api 생성 flow에 넣을 조직 정의, skill pack 배포 위치, SOUL.md template을 먼저 확정합니다.
2. Confluence 설계안 기준으로 신규 mobile repo(모노레포 템플릿)를 생성하고, 그 위에 조직 운영 레이어(gatekeeper, evidence, `.agents/skills`, PR template)를 추가합니다.
3. 작은 PRD 하나로 dry run을 수행합니다.
4. dry run에서 반복적으로 필요한 것만 별도 제품 개발 요청으로 admin-portal/admin-api 기능 확장에 승격합니다.

오버스펙을 피하기 위해 MVP에서 제외할 항목은 명확합니다.

* Sentry 운영 활성화 필수화 (템플릿의 조건부 내장 init은 유지, DSN 미주입 시 비활성)
* Detox/Appium
* 자체 macOS/Android runner
* device cloud
* S3 artifact store
* Tasks schema 수정
* Gatekeeper core service를 openclaw-cloud/admin-api에 내장
