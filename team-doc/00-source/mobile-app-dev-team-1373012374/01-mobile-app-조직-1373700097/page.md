---
pageId: "1373700097"
sourceTitle: "[01] Mobile App 조직"
sourceVersion: "1"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700097"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 도메인 인스턴스 #1 — 신규 모바일앱 개발 LLM 조직의 운영 정의 진입점 (표준 프로세스의 reference implementation) |
| --- | --- |
| Upstream | \[00\] LLM 조직 구성 표준 프로세스 |
| --- | --- |
| Downstream | 01-1 \~ 01-9 전체 |
| --- | --- |
| 관련 DEC-ID | DEC-001 (6 LLM agents + non-LLM Gatekeeper), DEC-010 (설계안 페이지 이동), DEC-012 (페이지 세분화 분할) |
| --- | --- |
| 출처 | docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md (운영계획), docs/reports/20260605-mobile-llm-organization-env-gap-and-dev-guidelines.md (env-gap), 본 섹션 하위 "Repo 템플릿 설계안" 페이지 (repo SoT) |
| --- | --- |

## 이 섹션이 하는 일

사용자가 admin-portal/admin-api 생성 flow로 만들 모바일 앱 개발 LLM 조직(6 LLM agents + non-LLM Gatekeeper)의 방향·제약, 역할, workflow, skill, SOUL.md 템플릿, 개발 지침, 진행 계획을 정의한다. 새 도메인 조직을 구성할 때는 이 섹션을 패턴으로 복제하되, 내용은 \[00\] 표준 프로세스 절차에 따라 새로 도출한다.

## 하위 페이지 인덱스

| 페이지 | 역할 | 구분 |
| --- | --- | --- |
| 01-1. 방향과 제약 | 목적·결론, 생성 표면 기준 가능/불가, MVP 제외 목록 | 설명 페이지 |
| 01-2. 조직 구성과 역할 | 6 LLM agents + non-LLM Gatekeeper 정의 | 설명 페이지 |
| 01-3. Workflows — Case A\~H | 케이스별 agent workflow 운영 절차 | 작성 페이지 |
| 01-4. Skills | skill 2-pack 배치 매트릭스 + MVP 5종 + 선택 skill (하위: skill별 페이지 5건) | 작성 페이지 |
| 01-5. SOUL.md 템플릿 | 공통 base + 역할별 템플릿 (하위: 역할별 페이지 6건) | 작성 페이지 |
| 01-6. 개발 지침 | root AGENTS.md 확장안 — 라우팅/레이어/상태/테스트 규칙 | 작성 페이지 |
| 01-7. 진행 계획과 상태 | Phase 0\~5 로드맵, 템플릿 설계안 추가 제안 표 | 작성 페이지 |
| 01-8. Repo 템플릿 설계안 | 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안 (기존 페이지 이동, 본문 무수정) | repo SoT |
| 01-9. 검증 근거·감사 기록 | SoT 검증 매트릭스, 오버스펙 감사, frozen input 해시 | 감사 기록 |
