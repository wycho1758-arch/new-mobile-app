# 모바일 앱 개발팀 직책/Role 업데이트 계획

상태: 승인 방향 반영 계획
작성일: 2026-06-10
대상 경로: `mobile-app-dev-team/`

## 목적

현재 문서는 Codex runtime 기준의 Operating Role을 안정적으로 유지한다. 이 계획은 사람이 이해하는 Display Title을 별도로 붙여 팀 피라미드와 커뮤니케이션 흐름을 명확히 한다.

핵심 원칙:

- Display Title은 사람이 읽는 직책명이다.
- Operating Role은 skill, agent, fixture, gate, handoff, validator가 사용하는 기존 Role 값이다.
- Chief Product Officer (CPO) / Product Delivery Lead는 Product/Planning의 표시 직책으로만 사용한다.
- Product/Planning은 사용자 지시 수신, 요구사항 정리, 범위/수용기준/evidence/human gate, 역할 라우팅을 관리한다.
- 기술 의사결정이 필요하면 Product/Planning이 Mobile Architect / Technical Lead에게 먼저 검토를 요청한다.
- Do not use CTO as a runtime role, agent, fixture, SOUL identity, H1, or filename.

## 권장 팀 구성

| Display Title | Operating Role | Authority Level | 주요 책임 |
| --- | --- | --- | --- |
| Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | Executive / Delivery Lead | 사용자 커뮤니케이션, 요구사항, scope/readiness, role routing, evidence, human-gate 관리 |
| Product Designer | Design | Practitioner | 모바일 UX, Stitch 기반 design handoff, 상태별 화면 정의 |
| Mobile Architect / Technical Lead | Mobile Architect | Technical Lead | 기술 구조, route/state/API/runtime, releaseability risk 검토 |
| Mobile App Developer | Mobile App Dev | Practitioner | Expo React Native 구현, TDD, NativeWind/RN UI, stable selector 관리 |
| Backend/API Engineer | Backend/API Integrator | Practitioner | API 계약, schema, mock, fixture, 승인된 backend/API 작업 |
| QA/Release Engineer | QA/Release | Practitioner / Reviewer | E2E evidence, Maestro/RN Web/mobile-mcp 검증, EAS/Railway release evidence |
| Release Gatekeeper (System) | Gatekeeper | System Gate | LLM 판단 없이 결정형 pass/fail 검증 수행. `soul.md` 없음 |

## C-Level 직책 판단

상위 관리 표시명은 Product/Planning에 둔다. 사용자는 Product/Planning에게 작업을 지시하고, Product/Planning은 요구사항을 정리한 뒤 각 role owner에게 handoff한다.

Chief Product Officer (CPO) / Product Delivery Lead가 적합한 이유:

- 제품 범위, 우선순위, 수용 기준, evidence, human gate를 관리하는 현재 Product/Planning 책임과 일치한다.
- 사용자와의 커뮤니케이션 및 역할 배분의 상위 조정자 역할을 표현한다.
- 기술 검토 권한을 Mobile Architect / Technical Lead에 남겨 역할 경계를 유지한다.
- Operating Role `Product/Planning`을 바꾸지 않으므로 runtime routing과 local harness 제약을 건드리지 않는다.

## 파일별 변경 기준

### `01-team-composition.md`

팀 구성표는 `Display Title`, `Operating Role`, `Type`, `Authority Level`, `Mission`을 함께 보여준다.

### `02-role-souls/*.md`

각 SOUL 파일의 H1은 기존 Operating Role 기준으로 유지한다. H1 아래에 아래 메타 블록을 추가한다.

```md
Display Title: <사람이 이해하는 직책명>
Operating Role: <기존 Role 이름>
Authority Level: <Executive / Delivery Lead | Technical Lead | Practitioner | Practitioner / Reviewer>
```

### `03-role-capability-matrix.md`

Capability matrix는 Display Title과 Operating Role을 모두 포함해 사람이 읽는 직책과 runtime 소유권을 분리한다.

### `04-skills-and-agents-matrix.md`

skill과 agent slug는 그대로 유지하고, 각 skill의 Display Title과 Operating Role 매핑만 추가한다.

### `05-work-processes.md`

작업 흐름은 `Chief Product Officer (CPO) / Product Delivery Lead receives the user request through Product/Planning` 구조를 기준으로 설명한다.

### `06-gates-and-evidence.md`

Gatekeeper는 `Release Gatekeeper (System)`으로 표시하지만 non-LLM deterministic gate로 유지한다. 사람, custom agent, SOUL.md, human approval 대체물이 아니다.

### `99-source-map.md`

Display Title to Operating Role crosswalk를 유지해 local team-doc 표시명과 runtime SoT 값을 구분한다.

## Validator 기준

`scripts/validate-team-doc.mjs`는 다음을 검증한다.

- Product/Planning SOUL에 `Display Title: Chief Product Officer (CPO) / Product Delivery Lead`가 있어야 한다.
- 모든 SOUL에 `Display Title`, `Operating Role`, `Authority Level` 블록이 있어야 한다.
- `01-team-composition.md`, `04-skills-and-agents-matrix.md`, `99-source-map.md`에 Display Title과 Operating Role crosswalk가 있어야 한다.
- `08-role-title-update-plan.md`는 위 안전장치 문장을 포함해야 한다.
- Gatekeeper SOUL.md는 만들지 않는다.

## 완료 기준

1. `pnpm run validate:team-doc` 통과.
2. `pnpm run test:runtime` 통과.
3. runtime-facing 변경으로 판단될 경우 `pnpm run test:local-harness` 통과.
4. Reviewer(xhigh)가 Critical/High blocker 없음으로 확인.
