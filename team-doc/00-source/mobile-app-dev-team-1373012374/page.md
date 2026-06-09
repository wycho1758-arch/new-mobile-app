---
pageId: "1373012374"
sourceTitle: "mobile-app-dev-team"
sourceVersion: "3"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373012374"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

## 이 스페이스의 목적

사용자가 admin-portal/admin-api 생성 flow로 LLM 전문 조직을 구성할 때 사용하는 **기준 프로세스(SoT)**를 보관한다. 모바일 앱 개발 조직이 첫 번째 인스턴스이며, HR·marketing 등 다른 형태의 조직을 구성할 때도 동일한 표준 프로세스를 재사용한다. 사용자와 LLM 모두 이 트리를 직접 조회·갱신한다.

## 2-레이어 구조

| 레이어 | 섹션 | 내용 |
| --- | --- | --- |
| 메타 (도메인 무관) | \[00\] LLM 조직 구성 표준 프로세스 | 어떤 도메인이든 공통으로 적용되는 원칙·절차·산출물 표준·결정 레지스트리. 도메인 고유명사 금지 |
| 인스턴스 (도메인별) | \[01\] Mobile App 조직 | 모바일 앱 개발 조직의 구체 정의 (reference implementation). 새 도메인은 \[02\], \[03\]…으로 추가 |

의존 방향은 인스턴스 → 메타 단방향이다. 메타 레이어는 인스턴스를 참조하지 않는다. 페이지 간 의존 관계와 가설 변경 절차의 규칙은 \[00\] 부모 페이지의 "페이지 헤더 표준 블록" 절이 SoT다.

## 읽기 가이드

* 새 도메인 조직을 구성하려면: \[00\] 00-2 조직 설계 절차를 따라 진행하고, \[01\]을 패턴 예시로 참조한다.
* 기존 결정의 근거를 찾으려면: \[00\] 00-4 가설·결정 레지스트리에서 DEC-ID로 조회한다.
* 가설이 바뀌면: 00-4에 결정 행을 갱신하고, 해당 DEC-ID를 헤더에 가진 페이지를 전수 갱신한다.

## SoT 맵

전체 페이지 인덱스 (트리 구성 완료: 2026-06-06, 신규 25 + 이동 2).

| 섹션 | 페이지 |
| --- | --- |
| [\[00\] LLM 조직 구성 표준 프로세스](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667330) | [00-1. 원칙과 제약](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373601794) / [00-2. 조직 설계 절차](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373601815) / [00-3. 산출물 표준](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765641) / [00-4. 가설·결정 레지스트리](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798401) |
| [\[01\] Mobile App 조직](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700097) | [01-1. 방향과 제약](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700117) / [01-2. 조직 구성과 역할](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765682) / [01-3. Workflows — Case A\~H](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667425) / [01-4. Skills](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667362) / [01-5. SOUL.md 템플릿](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700138) / [01-6. 개발 지침](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634583) / [01-7. 진행 계획과 상태](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700222) / [01-8. Repo 템플릿 설계안](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1371963427) / [01-9. 검증 근거·감사 기록](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667446) |
| 01-4 하위 Skills (5) | [mobile-prd-to-execution](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634562) / [mobile-design-handoff](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765661) / [mobile-api-contract](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765723) / [mobile-qa-release](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667404) / [mobile-gatekeeper](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798443) |
| 01-5 하위 SOUL.md (6) | [Product/Planning](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798422) / [Design](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765702) / [Mobile Architect](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667383) / [Mobile App Dev](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700159) / [Backend/API Integrator](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700180) / [QA/Release](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700201) |
| 01-8 하위 | [온라인 서비스 사전 등록 가이드](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1372422154) |
| 조사자료 / 환경구축 / 템플릿 | 기존 유지 (순수 조사 보고서·폴더·템플릿 3종) |
