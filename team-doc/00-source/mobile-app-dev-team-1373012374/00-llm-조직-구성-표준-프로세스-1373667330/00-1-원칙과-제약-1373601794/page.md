---
pageId: "1373601794"
sourceTitle: "00-1. 원칙과 제약"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373601794"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 어떤 도메인의 LLM 조직을 구성하든 공통으로 적용되는 원칙과 플랫폼 제약을 정의한다. 조직 설계(00-2)와 산출물 작성(00-3)은 이 페이지를 전제로 한다. |
| --- | --- |
| Upstream | \[00\] LLM 조직 구성 표준 프로세스 (헤더 표준 블록·레이어 규칙) |
|  |  |
| Downstream | 00-2 조직 설계 절차, 00-3 산출물 표준. 각 도메인 인스턴스 — 인스턴스 측 Upstream 필드로 기록 |
|  |  |
| 관련 DEC-ID | 없음 (규범 원문 — 개별 결정은 00-4 참조) |
|  |  |
| 출처 | docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md §1·§2·§7 (도메인 무관 일반화 신규 저작 — 도메인 구체 내용은 인스턴스 섹션 소유) |
|  |  |

## 1. 생성 표면 원칙

* 조직 생성·운영의 사용자 표면은 admin-portal/admin-api다. 사용자가 portal에서 조직 생성을 요청하면 admin-api가 Soul Builder Job과 deploy API로 조직/부서/agent/k8s 리소스를 생성한다.
* 생성된 agents는 rooms, Tasks, workspace, 그리고 해당 조직의 작업 repo에서만 일한다.
* 조직 정의 문서([SOUL.md](http://SOUL.md) 템플릿, skill 명세)는 생성 flow의 입력/검토 산출물이며, 생성된 agent에게 플랫폼 내부 소스 경로를 실행 대상으로 지시하지 않는다.

## 2. Zero-impact 원칙

* 생성된 조직은 플랫폼(openclaw-cloud) 소스, agent image, entrypoint, runtime 설정을 수정하지 않는다.
* agent 작업에 필요한 도구(CLI 등)가 runtime image에 없으면 image를 고치지 않고 생성 후 bootstrap task로 workspace에 설치한다.
* 플랫폼 기능 확장이 반복적으로 필요해지면 dry run 근거를 들어 별도 제품 개발 요청으로 승격한다 (00-2 절차 6단계). 생성된 agents가 플랫폼 소스를 직접 수정한다는 뜻이 아니다.

## 3. 플랫폼 제약 (설계 시 우회 금지)

| 제약 | 내용 | 설계 귀결 |
| --- | --- | --- |
| Tasks는 hard gate가 아님 | task status는 To Do / In Progress / Done 3단계뿐이고, 상태 전이 callback 실패가 전이를 막지 않는다 | 강제력이 필요한 게이트는 작업 repo의 저장소 required check에 둔다 |
| generic env 경로는 secret에 부적합 | agent의 generic envVars는 ConfigMap/plain env에 노출된다. 임의 Secret 일괄 주입 기능은 없다 | 외부 서비스 토큰·자격증명은 secret 전용 경로(k8s Secret, 외부 서비스 secrets)로만 주입한다 |
| runtime image는 범용 | 도메인 전용 CLI는 기본 미설치 | bootstrap task로 설치하거나 별도 실행 Job 패턴을 쓴다 |

## 4. Human gate 분류 기준

다음 행위는 LLM 단독 결정 금지 — 반드시 human approval 기록 후 진행한다.

* production 배포·스토어 제출 등 외부 공개
* 결제·금전 이동
* PII/프라이버시 민감 동작
* 외부 메시징·메일·푸시 발송
* 법무·약관·계약
* gate 실패 후 위험 수용(accept risk)

## 5. SoT 운영 규칙

* 산출물 유형별 SoT를 분리한다: 요구사항/설계 문서 SoT, 제품 백로그, agent 실행 task, 코드·리뷰(PR), 빌드·검증 증거. room 메시지는 조정 로그일 뿐 코드·릴리즈의 SoT가 아니다.
* 단일 사실 단일 페이지: 동일 규칙을 두 문서에 본문으로 중복 기술하지 않는다.
* 모든 판단·점검은 추정이 아닌 SoT 실측을 근거로 한다.
* 증거 없는 Done 주장 금지 — Done은 검증 가능한 증거로만 성립한다.
* 페이지 간 의존 기록과 가설 변경 절차는 \[00\] 부모 페이지의 "페이지 헤더 표준 블록" 절을 따른다.

## 6. 오버스펙 금지

* task가 요구하지 않는 선택적 인프라를 만들지 않는다.
* MVP에서 검증 안 된 자동화·도구·schema 변경을 선제 도입하지 않는다 — dry run에서 반복 필요가 실측된 것만 승격한다.
* 모든 문서는 자기 목적을 본문에 포함하고, 소스에 없는 내용을 부풀리지 않는다.

> **범위 단서 (2026-06-09)**: 본 페이지의 원칙·제약(특히 §1 생성 표면·§3 플랫폼 제약)은 ClawPod 플랫폼(admin-portal/admin-api·k8s·openclaw-cloud)에 결속된다 — 비즈니스 도메인에는 무관하나 다른 오케스트레이션 플랫폼으로의 이식은 본 표준의 범위 밖이다.