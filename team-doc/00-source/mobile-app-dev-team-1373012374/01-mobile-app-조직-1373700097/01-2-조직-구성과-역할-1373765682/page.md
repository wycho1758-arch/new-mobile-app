---
pageId: "1373765682"
sourceTitle: "01-2. 조직 구성과 역할"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765682"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 6 LLM agents + non-LLM Gatekeeper 조직 구성과 각 역할의 책임 경계를 정의한다. |
| --- | --- |
| Upstream | 01-1, \[00\] 00-2 (역할 분리 기준) |
| --- | --- |
| Downstream | 01-3 Workflows, 01-4 Skills, 01-5 SOUL.md 템플릿 |
| --- | --- |
| 관련 DEC-ID | DEC-001, DEC-002, DEC-003 |
| --- | --- |
| 출처 | 운영계획 §1 판단·§5.2\~§5.7 Role Mission·§5.8 |
| --- | --- |

## 조직 구성

조직은 6 LLM agents와 1 non-LLM Gatekeeper로 구성됩니다. 각 LLM 역할의 상세 SOUL.md 본문은 01-5 하위 역할 페이지를 참조합니다.

| 역할 | Role Mission | 유형 | 상세 |
| --- | --- | --- | --- |
| Product/Planning | Convert PRDs into executable Jira/Tasks work without over-scoping. | LLM | 01-5 하위 역할 페이지 참조 |
| Design | Produce implementable mobile UX handoff. | LLM | 01-5 하위 역할 페이지 참조 |
| Mobile Architect | Keep the Expo app architecture coherent and releaseable. | LLM | 01-5 하위 역할 페이지 참조 |
| Mobile App Dev | Implement Expo React Native features from approved tasks and contracts. | LLM | 01-5 하위 역할 페이지 참조 |
| Backend/API Integrator | Keep backend/API integration safe, explicit, and testable. | LLM | 01-5 하위 역할 페이지 참조 |
| QA/Release | Make release state measurable through Maestro, EAS, and evidence. | LLM | 01-5 하위 역할 페이지 참조 |
| Gatekeeper | deterministic predicate로 pass/fail을 판정 (Role Mission 없음) | non-LLM | 아래 'Gatekeeper에는 SOUL.md를 만들지 않는다' 참조 |

## Backend/API Integrator 분리 근거

Backend/API Integrator는 Mobile App Dev와 분리해야 합니다.

## Gatekeeper에는 SOUL.md를 만들지 않는다

Gatekeeper는 LLM agent가 아닙니다. Gatekeeper의 정의 파일(SKILL.md, deterministic script, GitHub workflow)은 신규 mobile repo에 두며, 해당 파일 경로는 **mobile-gatekeeper skill 페이지(01-4 하위)가 소유**합니다.

Gatekeeper는 말하지 않고 판단합니다. 판단 기준은 deterministic predicate입니다.