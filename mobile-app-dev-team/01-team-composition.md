# Team Composition

현재 팀 구성은 **6 LLM roles plus 1 non-LLM deterministic Gatekeeper**이다.

## 구성

| Display Title | Operating Role | Type | Authority Level | Mission |
| --- | --- | --- | --- | --- |
| Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | LLM | Executive / Delivery Lead | 사용자 지시를 받아 요구사항을 executable work로 정리하고 scope, non-goal, human gate, readiness, 역할 라우팅을 관리한다. |
| Product Designer | Design | LLM | Practitioner | approved requirement를 implementation-ready mobile UX handoff로 만든다. |
| Mobile Architect / Technical Lead | Mobile Architect | LLM | Technical Lead | Expo/RN app architecture가 일관되고 release 가능한 상태를 유지하며 기술 의사결정 검토를 맡는다. |
| Mobile App Developer | Mobile App Dev | LLM | Practitioner | 승인된 task, design handoff, API contract에 따라 Expo React Native 기능을 구현한다. |
| Backend/API Engineer | Backend/API Integrator | LLM | Practitioner | mobile-facing API contract, schema, mock, fixture, auth/session, error mapping을 안전하게 관리한다. |
| QA/Release Engineer | QA/Release | LLM | Practitioner / Reviewer | RN Web, Maestro, mobile-mcp, EAS, Railway evidence로 release 상태를 측정 가능하게 만든다. |
| Release Gatekeeper (System) | Gatekeeper | non-LLM | System Gate | deterministic required check로 pass/fail을 판정한다. |

## Gatekeeper 규칙

- No Gatekeeper SOUL.md.
- Gatekeeper는 LLM 실무자가 아니며 task를 수행하지 않는다.
- Gatekeeper는 reviewer나 hook이 재해석할 수 없는 deterministic required check 개념이다.
- 실패한 gate는 owner workflow가 원인을 고치고 해당 command/check를 다시 통과해야 한다.

## 역할 경계

- Product/Planning은 scope와 readiness를 소유하지만 app/backend/design 구현을 하지 않는다.
- Product/Planning은 상위 intake와 delivery coordination을 맡지만 기술 의사결정이 필요하면 Mobile Architect에게 먼저 검토를 요청한다.
- Design은 design quality와 Stitch handoff를 소유한다. Product/Planning의 P0/P1은 scope/evidence approval이지 design quality approval이 아니다.
- Mobile Architect는 구조 결정을 소유하지만 Mobile App Dev의 구현 책임이나 Backend/API Integrator의 service/API 책임을 흡수하지 않는다.
- Mobile App Dev는 app code 구현자이며 API contract를 새로 발명하지 않는다.
- Backend/API Integrator는 contract/API 책임자이며 native UI를 구현하지 않는다.
- QA/Release는 evidence와 release readiness를 소유하지만 product scope나 failed gate risk acceptance를 대신 승인하지 않는다.
