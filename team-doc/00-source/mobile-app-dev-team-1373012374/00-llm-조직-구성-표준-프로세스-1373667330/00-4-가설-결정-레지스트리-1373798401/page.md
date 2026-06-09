---
pageId: "1373798401"
sourceTitle: "00-4. 가설·결정 레지스트리"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798401"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 전 레이어(메타 + 모든 인스턴스)의 가설·결정을 단일 로그로 기록한다. 가설 변경 시 영향 추적의 진입점이다: 여기 행을 갱신한 뒤, 해당 DEC-ID를 헤더에 가진 페이지를 전수 갱신한다. |
| --- | --- |
| Upstream | 없음 (로그 — 결정의 근거는 각 행의 출처 열에 기록) |
| --- | --- |
| Downstream | DEC-ID를 헤더에 가진 모든 페이지 (파생 — 페이지 헤더가 edge SoT) |
| --- | --- |
| 관련 DEC-ID | 해당 없음 (레지스트리 자신) |
| --- | --- |
| 출처 | 각 행의 출처 열 참조 |
| --- | --- |

이 레지스트리는 결정 로그이므로 인스턴스 결정 행에는 도메인 도구명(고유명사)이 등장할 수 있다. 도메인 무관 원칙은 규범 본문(00-1\~00-3)에 적용되는 규칙이며 행 데이터에는 적용되지 않는다. '영향 페이지' 열은 각 페이지 헤더(edge SoT)의 전수 스캔으로 도출하는 파생 뷰다.

## 운영 규칙

* 결정 1건 = 1행. 같은 결정을 두 행으로 쪼개지 않는다.
* 상태: <custom data-type="status" data-id="id-0">유효</custom> / <custom data-type="status" data-id="id-1">변경</custom> / <custom data-type="status" data-id="id-2">폐기</custom> / <custom data-type="status" data-id="id-3">미채택</custom>
* 가설 변경 절차: 행 추가 또는 상태 변경 → 해당 DEC-ID를 헤더에 가진 페이지 전수 조회·갱신 → 갱신 페이지의 Downstream 재귀 재검토 (\[00\] 부모 페이지 규칙).

## 결정 로그

| DEC-ID | 날짜 | 결정·가설 | 적용 범위 | 상태 | 출처 | 영향 페이지 (파생) |
| --- | --- | --- | --- | --- | --- | --- |
| DEC-001 | 2026-06-05 | 조직은 6 LLM agents + non-LLM Gatekeeper로 구성 | \[01\] | <custom data-type="status" data-id="id-4">유효</custom> | 운영계획 §1 | \[01\] 부모, 01-2, 01-5, SOUL 역할 6페이지 |
| DEC-002 | 2026-06-05 | 거버넌스 판정자(Gatekeeper)는 LLM agent가 아니라 결정적 script + 저장소 required check | 메타 + \[01\] | <custom data-type="status" data-id="id-5">유효</custom> | 운영계획 §1·§3.1 #5·§5.8 | 00-2, 00-3, 01-2, mobile-gatekeeper |
| DEC-003 | 2026-06-05 | Backend/API Integrator를 Mobile App Dev와 분리 운영 | \[01\] | <custom data-type="status" data-id="id-6">유효</custom> | 운영계획 §1 | 01-2, mobile-api-contract, SOUL — Backend/API Integrator |
| DEC-004 | 2026-06-05 | Sentry 운영 활성화는 MVP 제외 — 템플릿의 조건부 init(DSN 미주입 시 비활성)만 유지. env-gap §6.2의 'Sentry 필수화 미채택'과 동일 결정 | \[01\] | <custom data-type="status" data-id="id-7">유효</custom> | 운영계획 §3.2·§7 | 01-1 |
| DEC-005 | 2026-06-05 | Gatekeeper required check는 모든 PR에서 상시 실행하되, evidence/E2E 검사 적용은 script 내부 task-PR 분기로 판정 (docs PR·bootstrap PR 통과 가능, sentinel job으로 skip 우회 차단) | 메타(추상 계약) + \[01\](구현) | <custom data-type="status" data-id="id-8">유효</custom> | 운영계획 §3.1 #5 (2026-06-05 수정본) | 00-3, 01-3, mobile-gatekeeper |
| DEC-006 | 2026-06-05 | 작업 repo root AGENTS.md를 6축 간결 outline으로 확장 | 메타(원칙) + \[01\](구성) | <custom data-type="status" data-id="id-9">유효</custom> | env-gap §4.1·§7 권고 1 | 00-3, 01-6, 01-7 |
| DEC-007 | 2026-06-05 | task의 acceptance criteria/evidence requirement 문구를 Done-when 형식으로 통일 (schema 변경 아님) | 메타(표준) + \[01\](skill 출력 규칙) | <custom data-type="status" data-id="id-10">유효</custom> | env-gap §4.2·§7 권고 2 | 00-3, 01-4, mobile-prd-to-execution, 01-7 |
| DEC-008 | 2026-06-05 | eslint-plugin-boundaries는 Phase 3 일괄이 아니라 src/features/ 최초 생성 PR과 동시 도입 | \[01\] | <custom data-type="status" data-id="id-11">유효</custom> | env-gap §5.4·§7 권고 3 | 01-6, 01-7 |
| DEC-009 | 2026-06-05 | rework cap 수치는 외부 표준 인용 없이 dry run에서 경험적 확정 | 메타(원칙) + \[01\](Phase 4) | <custom data-type="status" data-id="id-12">유효</custom> | env-gap §4.5·§7 권고 4 | 00-2, 01-3, 01-7 |
| DEC-010 | 2026-06-06 | Repo 템플릿 설계안 페이지(1371963427)를 조사자료 폴더에서 \[01\] 하위로 이동 (본문 무수정, pageId 유지) | 스페이스 구조 | <custom data-type="status" data-id="id-13">유효</custom> | 사용자 확정 (2026-06-06) | \[01\] 부모 |
| DEC-011 | 2026-06-06 | 메타 레이어는 현 스페이스 내 \[00\] 최상위 섹션으로 배치. 2번째 도메인 착수 시 별도 스페이스 승격 재평가 | 스페이스 구조 | <custom data-type="status" data-id="id-14">유효</custom> | 사용자 확정 (2026-06-06) | \[00\] 부모 |
| DEC-012 | 2026-06-06 | 페이지 세분화 분할: skill별 1페이지, SOUL.md 역할별 1페이지. 페이지 수 부담 실측 시 단일 페이지+앵커 fallback (재결재 필요) | 스페이스 구조 | <custom data-type="status" data-id="id-15">유효</custom> | 사용자 확정 (2026-06-06) | \[01\] 부모, 01-4 |
| DEC-013 | 2026-06-05 | Detox / Appium / device cloud / 자체 macOS·Android runner / S3 artifact store | \[01\] | <custom data-type="status" data-id="id-16">미채택</custom> | 운영계획 §7, env-gap §6.2 | 01-1 |
| DEC-014 | 2026-06-05 | per-package 중첩 AGENTS.md — 실행기 간 동작 차이 리스크가 MVP 이득보다 큼 | 메타 + \[01\] | <custom data-type="status" data-id="id-17">미채택</custom> | env-gap §4.1·§6.2 | 00-3, 01-6 |
| DEC-015 | 2026-06-05 | AGENTS.md 분량 정량 기준(100\~150줄 등) — 인용 출처가 수치를 지지하지 않음, 정성 원칙만 유지 | 메타 | <custom data-type="status" data-id="id-18">미채택</custom> | env-gap §6.2·§7 한계 | 없음 (근거: 01-9) |
| DEC-016 | 2026-06-05 | Stop hook 기반 하드 게이트 + 정량 rework cap — 1차 출처 검증 실패, required check가 이미 하드 게이트 | \[01\] | <custom data-type="status" data-id="id-19">미채택</custom> | env-gap §6.2 | 없음 (근거: 01-9) |
| DEC-017 | 2026-06-05 | 서버 상태 라이브러리(TanStack Query 등) 선제 도입 — 첫 API-backed feature 시 Mobile Architect가 결정 | \[01\] | <custom data-type="status" data-id="id-20">미채택</custom> | env-gap §5.3·§6.2 | 01-6 |
| DEC-018 | 2026-06-05 | eslint-plugin-boundaries의 Phase 3 선제 도입 — DEC-008(첫 feature 동시 도입)로 대체 | \[01\] | <custom data-type="status" data-id="id-21">미채택</custom> | env-gap §5.4·§6.2 | 없음 (근거: 01-9) |
| DEC-019 | 2026-06-05 | 에이전트 오케스트레이션 프레임워크 도입 — 단순·조합 가능 패턴으로 충분 | 메타 + \[01\] | <custom data-type="status" data-id="id-22">미채택</custom> | env-gap §4.4·§6.2 | 00-3 |
| DEC-020 | 2026-06-05 | Tasks schema 수정 / Gatekeeper core를 admin-api에 내장 — 플랫폼 확장은 dry run 근거로만 승격 (00-2 단계 6) | 메타 + \[01\] | <custom data-type="status" data-id="id-23">미채택</custom> | 운영계획 §7, env-gap §6.2 | 01-1, 01-7 |
| DEC-021 | 2026-06-06 | Design 역할의 디자인 저작 도구를 Google Stitch로 한정(Figma는 저작 도구에서 제외, 고객 요구 시 전달 포맷 옵션으로만 검토). 템플릿 repo root DESIGN.md를 디자인 시스템 SoT로 도입(Design agent 소유, 형식 기준은 Google 오픈소스 DESIGN.md 스펙). VoltAgent/awesome-design-md를 docs/design-references/에 vendored 포함(MIT 확인 — LICENSE·출처 고지 필수). handoff 전 Stitch 디자인의 HTML 추출(공식 ZIP export code.html 또는 Stitch MCP fetch)과 HTML 버전 퍼블리싱 전달 의무화. Stitch 조작은 공식 Stitch MCP server 경유 | \[01\] | <custom data-type="status" data-id="id-24">유효</custom> | 사용자 확정 (2026-06-06) + Stitch 공식 문서(remote MCP·ZIP export·DESIGN.md 오픈소스 스펙) + awesome-design-md LICENSE 실측(MIT) | SOUL.md — Design, 01-8, mobile-design-handoff, 01-5, 사전 등록 가이드 |
