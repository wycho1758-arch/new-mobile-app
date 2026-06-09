---
pageId: "1373667362"
sourceTitle: "01-4. Skills"
sourceVersion: "4"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667362"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | 조직이 사용하는 skill의 2-pack 배치 체계, MVP 5종, Case A\~H skill coverage, 선택 skill 목록을 정의한다. 개별 skill 명세는 하위 페이지가 소유한다. |
| Upstream | 01-2, 01-3, \[00\] 00-3 (skill 명세 표준) |
| Downstream | 하위 skill 페이지 5건, Role-specific Codex Runtime, 01-3 Workflows |
| 관련 DEC-ID | DEC-007, DEC-012 |
| 출처 | 운영계획 §3 도입·참고·§3.2 + 01-3 Case A\~H + Role-specific Codex Runtime |

## Skill로 만들어야 하는 것

Codex 공식 문서 기준 skill은 반복 가능한 workflow를 instruction, reference, optional script로 포장하는 방식입니다. Skill은 한 가지 일을 잘해야 하며, deterministic 동작이 필요하면 script를 포함하는 것이 맞습니다.

이 조직에서는 skill을 두 위치로 나눕니다.

```
organization-runtime skill pack
= admin-portal/admin-api로 생성된 agents의 workspace 또는 user skill 위치에 설치
= 조직 운영, 회의, PRD/task 분해, bootstrap coordination에 사용

new-mobile-app repo skill pack
= 앱 repo 내부에서 구현/검증/릴리즈에 사용
= new-mobile-app/.agents/skills에 커밋
```

참고: 현재 프로젝트 내부의 `.codex/skills`는 이 보고서 작성과 검증에 사용한 운영자 측 도구입니다. 생성된 조직이 사용할 runtime skill은 admin-portal/admin-api로 agent가 생성된 뒤 agent workspace 또는 user skill 위치에 설치합니다. 신규 mobile repo에 체크인할 Codex repo-scoped skill은 repo root `.agents/skills`를 기본으로 둡니다. `.agents/skills`는 Confluence 템플릿 구조에 포함되어 있지 않으며, Phase 3에서 템플릿 repo 생성 후 조직 운영 레이어로 추가합니다.

## 작성 규칙

* MVP 5개 skill은 계속 SoT입니다. Case coverage skill이나 mode는 MVP 5를 대체하지 않습니다.
* Case A\~H coverage는 01-3의 반복 workflow를 기준으로 정의합니다. [SOUL.md](http://SOUL.md) role별 1개 wrapper를 기본값으로 만들지 않습니다.
* 기존 MVP skill이 이미 Case를 소유하면 신규 skill을 만들지 않고 해당 skill의 mode/checklist로 확장합니다.
* 신규 skill은 기존 MVP skill로 닫히지 않는 반복 process gap이 있을 때만 추가합니다.
* 각 skill page는 반드시 다음 구조를 사용합니다: 목적, 위치, 대상 [SOUL.md](http://SOUL.md)(role), 입력, 출력, 동작, 금지, Case coverage, required tests/evals.
* 각 skill page는 해당 skill을 사용하는 대상 [SOUL.md](http://SOUL.md)(role)을 반드시 명시합니다.
* `mobile-gatekeeper`는 deterministic hard gate입니다. LLM skill, hook, reviewer가 pass/fail을 대체하거나 재해석하지 않습니다.
* production submit은 human approval 전 자동 실행하지 않습니다.

## 외부 공식 skill 선별 설치

외부 공식 skill은 이 조직의 자체 제작 대상이 아니며, 아래 표는 신규 skill이 아니라 외부에서 배포되는 공식 skill의 선별 설치 기준이다. 설치 여부는 Case A bootstrap의 human-gated skill install 단계(`mobile-project-bootstrap-workflow`)에서 이 표를 기준으로 검토한다. 이 표에 없는 외부 skill의 임의 설치와 expo/skills 16종 전체 설치는 금지한다. 근거: 2026-06-08 외부 skill 생태계 조사(16후보, 신규 자체 제작 0건 판정).

| 외부 skill (출처: [github.com/expo/skills](http://github.com/expo/skills), MIT, README가 Claude Code/Cursor/Codex 지원 명시) | 주 사용 역할 | 설치 위치 |
| --- | --- | --- |
| upgrading-expo, eas-update-insights, expo-deployment, expo-cicd-workflows | QA/Release (주), Mobile Architect (EAS strategy 공동) | `new-mobile-app/.agents/skills/` |
| building-native-ui, expo-tailwind-setup, native-data-fetching | Mobile App Dev (주), Mobile Architect (참조) | `new-mobile-app/.agents/skills/` |

제외 9종: add-app-clip, expo-brownfield, expo-ui-jetpack-compose, expo-ui-swift-ui, expo-module, expo-observe, expo-api-routes, expo-dev-client, use-dom — 현 템플릿 스택(pnpm, Turborepo, Expo Router, NativeWind, Jest, zod) 및 MVP 범위와 불일치하여 설치 대상이 아니다.

## MVP 배치 매트릭스

| Skill | 위치 | 대상 [SOUL.md](http://SOUL.md)(role) | 기본 Case coverage |
| --- | --- | --- | --- |
| `mobile-prd-to-execution` | organization-runtime skill pack | Product/Planning | Case B |
| `mobile-design-handoff` | organization-runtime skill pack | Design; Mobile Architect와 Mobile App Dev는 reviewer | Case B 검토 전제, Case C, Case D |
| `mobile-api-contract` | new-mobile-app repo skill pack | Mobile Architect, Backend/API Integrator, Mobile App Dev | Case D, Case E |
| `mobile-qa-release` | new-mobile-app repo skill pack | QA/Release | Case C, D, E, F, G, H |
| `mobile-gatekeeper` | new-mobile-app repo skill pack | Gatekeeper(non-LLM); 전 LLM role은 gate 결과를 준수 | Cross-cutting required check |

## Case A\~H Skill Coverage Registry

| Case | Coverage 결정 | Skill / mode | 대상 [SOUL.md](http://SOUL.md)(role) | 근거 / 처리 방식 |
| --- | --- | --- | --- | --- |
| Case A. 신규 프로젝트 bootstrap | 신규 skill | `mobile-project-bootstrap-workflow` | Product/Planning, Mobile Architect, QA/Release, Mobile App Dev, 운영자(human) | 기존 `mobile-qa-release`는 Case A release layer를 self-bootstrap하지 않습니다. 01-7의 human bootstrap 단계와 01-3 정합성 조사 GAP-01\~05/GAP-16을 닫기 위한 process skill입니다. |
| Case B. PRD 접수와 Epic/Task 분해 | 기존 skill 유지 | `mobile-prd-to-execution` | Product/Planning; Design, Mobile Architect, Backend/API Integrator, QA/Release는 review | 이미 Case B Downstream입니다. 별도 Product/Planning role wrapper를 만들지 않습니다. |
| Case C. UI-only feature | 기존 skill mode 확장 | `mobile-design-handoff` Case C mode + `mobile-qa-release` evidence | Design, Mobile Architect, Mobile App Dev, QA/Release | 신규 `mobile-ui-only-feature-workflow`는 Design handoff와 중복됩니다. UI-only checklist를 `mobile-design-handoff`에 둡니다. |
| Case D. API-backed feature | 기존 skill mode 확장 | `mobile-api-contract` Case D reference-only checklist | Design, Mobile Architect, Backend/API Integrator, Mobile App Dev, QA/Release | API-backed feature 신규 skill은 `mobile-api-contract`와 중복될 위험이 있습니다. `mobile-api-contract`가 순서/owner/gate만 reference하고 다른 skill 실행 책임은 흡수하지 않습니다. |
| Case E. Backend/API 변경 중심 작업 | 기존 조합 유지 | `mobile-api-contract` + `mobile-backend-api-integrator-workflow` + `mobile-qa-release` | Backend/API Integrator, Mobile Architect, Mobile App Dev, QA/Release | 이미 Case D/E contract와 backend/API integrator wrapper, QA evidence skill로 커버됩니다. 신규 skill 없음. |
| Case F. QA 실패 또는 Gate 실패 | 기존 skill mode 확장 | `mobile-qa-release` Case F failure/rework mode | QA/Release, 실패 task owner, Mobile Architect, Product/Planning/human owner | failure report에 더해 failure reason classification, `rework_count`, cap stop, owner routing, Product/human decision handoff를 추가합니다. 01-3 정합성 조사 GAP-16을 닫습니다. |
| Case G. Preview/Internal release | 기존 skill mode 확장 | `mobile-qa-release` Case G mode | QA/Release, Product/Planning, Mobile Architect | EAS build, Maestro, evidence, release note에 Product/Planning scope confirmation과 Mobile Architect EAS strategy check를 추가합니다. |
| Case H. Production submit | 기존 skill mode 확장 | `mobile-qa-release` Case H mode | QA/Release, Product/Planning(human approval), Mobile Architect | production submit은 human approval 전 자동 실행하지 않습니다. store status, rollback/update plan, `build-and-submit.yml` 자동 트리거 금지를 checklist에 포함합니다. |
| Cross-cutting | 기존 deterministic gate | `mobile-gatekeeper` | Gatekeeper(non-LLM), 전 LLM role | 전 Case의 Done/evidence gate입니다. 어떤 workflow skill도 gatekeeper pass/fail을 대체하지 않습니다. |
| Cross-cutting | 기존 role 책임 보존 | Mobile Architect ADR/risk checklist | Mobile Architect | app-wide ADR/risk 기록은 Case A template deviation, Case D/E contract co-sign, Case G/H EAS strategy checklist에 남깁니다. |

## 선택 skill

아래 skill은 MVP 이후에 추가합니다.

| Skill | 추가 시점 | 이유 |
| --- | --- | --- |
| `mobile-sentry-observability` | Sentry 운영 활성화 시 | Confluence 템플릿에 Sentry init이 조건부 내장됨(DSN 미주입 시 비활성). DSN 발급·sourcemap 업로드 운영 활성화는 비용 때문에 MVP 이후 |
| `mobile-store-submit` | production release 반복 시 | 현재는 `mobile-qa-release` Case H mode로 governance를 수행합니다. 별도 store submit skill은 반복 운영 실측 후 판단합니다. |
| `mobile-performance-budget` | 성능 이슈가 실제로 생긴 후 | 초기에는 Maestro smoke와 app profiling으로 충분 |
| `mobile-design-regression` | 화면 수가 많아진 후 | 초기에는 Design handoff와 Maestro로 충분 |
| Maestro MCP server | agent가 Maestro를 MCP로 직접 구동할 운영 요구 발생 시 | 현재 QA/Release는 Maestro CLI 직접 실행으로 충분하다. cloud 계열 tool은 device cloud 기본 도입 금지 제약과의 정합 검토가 선행되어야 한다. |
| Atlassian Remote MCP Server | Jira/Confluence PM 통합 자동화 요구 발생 시 | 현 Jira/Confluence 접근 방식은 운영 플랫폼 레이어 소관이다. 정보 기록 목적의 후보 등재이며 현 시점 도입 근거 없음. |

## 하위 페이지 인덱스

MVP skill pages:

* mobile-prd-to-execution
* mobile-design-handoff
* mobile-api-contract
* mobile-qa-release
* mobile-gatekeeper

Role-specific / Case coverage runtime pages:

* Role-specific Codex Runtime
* Role-specific Codex Runtime / Skills / mobile-project-bootstrap-workflow
* Role-specific Codex Runtime / Skills / mobile-app-dev-workflow
* Role-specific Codex Runtime / Skills / mobile-backend-api-integrator-workflow

Product/Planning operational skill pages (under [SOUL.md](http://SOUL.md) Product/Planning):

* [Product Planning Operational Skills Summary](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374421079)
* [mobile-requirement-office-hours](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519364)
* [mobile-work-unit-planning-and-agent-sprint](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374650456)
* [mobile-planning-completeness-review](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519387)
