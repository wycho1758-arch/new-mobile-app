---
pageId: "1373634583"
sourceTitle: "01-6. 개발 지침 (root AGENTS.md 확장안)"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634583"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | 생성된 agents가 mobile repo에서 코드를 작성할 때 따르는 클린 아키텍처/개발 지침과 root AGENTS.md 확장안을 정의한다. |
| Upstream | \[00\] 00-3 (AGENTS.md 6축 원칙·검증 루프), 01-1, 01-8 Repo 템플릿 설계안 |
| Downstream | 01-7 |
| 관련 DEC-ID | DEC-006, DEC-008, DEC-014, DEC-017 |
| 출처 | env-gap §5 (§5.1\~§5.6)·§7 권고 1·3 |

# 5. 클린 아키텍처 / 개발 지침 (신규 mobile repo)

이 절의 모든 규칙은 1차 출처(Expo 공식 문서, React Native 공식 문서, TanStack Query 공식 문서, eslint-plugin-boundaries)에서 직접 재검증했다. deep-research의 축 2 주장들이 검증 인프라 실패로 미검증 상태로 남았기 때문에, 미검증 주장을 인용하는 대신 지목된 1차 출처 6건을 본 검증에서 직접 fetch하여 확인했다(§7 한계 참조). 적용 위치는 신규 mobile repo의 root `AGENTS.md` 확장이며(Phase 3 조직 운영 레이어와 동일 시점), 템플릿 설계안 자체의 수정은 범위 밖이다.

## 5.1 디렉터리와 라우팅: app 디렉터리는 라우트 전용

Expo Router에서 모든 내비게이션 라우트는 `src/app` 디렉터리의 파일·하위 디렉터리로 정의된다 — 파일 시스템이 라우팅 구조의 단일 SoT다 \[7\]. 공식 문서는 "src/app 디렉터리는 라우트 정의 전용이며, components, hooks, utilities 같은 나머지 코드는 src/components, src/hooks, src/constants 같은 다른 디렉터리에 두라"고 명시한다 \[7\]. 표기 규칙도 공식 정의를 따른다: 대괄호(`[param]`)는 dynamic route, 괄호(`(group)`)는 URL에 영향 없는 route group, `_layout.tsx`는 페이지가 아니라 디렉터리 내 라우트들의 관계(stack/tab)를 정의하는 특수 파일이다 \[8\].

따라서 AGENTS.md에 들어갈 규칙은 다음과 같다.

```
## Routing & Directory Rules
- src/app/ contains ONLY route files (screens) and _layout.tsx files.
- Non-route code lives outside src/app: src/components, src/hooks, src/lib.
  (Create src/features/<name>/ only when the first real feature task needs it
   — do not scaffold empty feature directories in advance.)
- A route file is a thin entry: it composes feature code, it does not implement business logic.
- Use [param] for dynamic routes, (group) for URL-neutral grouping, _layout.tsx for navigators.
```

모노레포 레이아웃은 Expo 공식 가이드의 권고(apps/는 프로젝트, packages/는 공유 코드)와 일치하며 \[6\], pnpm은 Expo가 first-class로 지원하는 workspace 관리자다 \[6\]. SDK 52+에서 Metro는 모노레포를 자동 구성하지만(`expo/metro-config` 사용 시 수동 설정 불필요 \[6\]), NativeWind의 `withNativeWind` wrapper는 그와 별개의 필수 설정이므로 유지한다 — 이는 템플릿 설계안 §12가 이미 명시한 제약이다.

## 5.2 레이어 분리와 import 방향

스파게티 코드의 핵심 원인은 임의 방향의 import다. 템플릿이 이미 제공하는 구조(apps/mobile + packages/contracts) 위에서 **import 방향 단방향 원칙**을 규칙으로 두되, 전면적 feature/domain 디렉터리 구조를 초기 repo(홈 카운터 샘플 1개)에 선제 강제하지는 않는다 — 레이어 구조는 첫 실제 feature task부터 적용한다.

| 레이어 | 위치 | 책임 | import 가능 대상 |
| --- | --- | --- | --- |
| Route (화면 진입) | `apps/mobile/src/app/` | 화면 조립, 내비게이션 | feature, shared |
| Feature/Domain (첫 feature부터) | `apps/mobile/src/features/<name>/` | 비즈니스 로직, 화면 상태 | shared, contracts |
| Shared/Contracts | `apps/mobile/src/components|lib` 및 `packages/contracts` | 공용 UI primitive, 타입·zod schema | (최하층 — 상위 레이어 import 금지) |

`packages/contracts`는 타입과 런타임 검증(zod)의 단일 SoT다. 템플릿 설계안 §6이 이미 홈 카운터 샘플로 이 패턴(공유 상수·schema import)을 강제 검증하므로, 규칙은 그 확장이다: API request/response shape, 화면 간 공유 도메인 타입, 이벤트 schema는 contracts에만 정의하고 앱 코드에 중복 선언하지 않는다. 이는 운영계획 §3.1 #3(`mobile-api-contract`)의 contract 고정 원칙과 같은 축이다.

역방향 import(contracts→app, shared→feature, feature→route)는 금지한다. zod schema가 contracts의 SoT인 만큼, 화면별 ad-hoc 타입 선언이 늘어나는 순간이 스파게티의 시작점이기 때문이다.

## 5.3 상태관리 경계: 서버 상태와 클라이언트 상태의 분리

TanStack Query 공식 문서는 서버 상태가 클라이언트 상태와 근본적으로 다름을 명시한다 — 원격에 저장되고, 비동기 API가 필요하며, 소유권이 공유되어 내 모름 중에 변경될 수 있고, 방치하면 stale해진다 \[11\]. 이 분리 **원칙**만 규칙으로 두고, 특정 라이브러리를 전제하는 문구는 두지 않는다(도구 결정은 Case D 시점).

```
## State Rules
- Server data (API responses) is owned by the data-fetching layer. 
  Never copy server data into a client store.
- Client state (UI toggles, form drafts, local counters) stays in component state 
  or a small client store. Keep it minimal.
- All server data crossing the network boundary is validated with the zod schema 
  from packages/contracts at the fetch layer.
```

이 경계는 openclaw-cloud 자체의 검증된 컨벤션("React Query for server data, never duplicate server state in Zustand")과 동일한 원칙이라 조직 운영자 입장에서도 일관성이 있다. 서버 상태 라이브러리(TanStack Query 등)의 도입 여부·시점은 첫 API-backed feature(운영계획 Case D)가 생길 때 Mobile Architect가 결정한다 — 템플릿 기본 스택에 선제 추가하는 것은 오버스펙이다.

## 5.4 경계의 결정적 강제: ESLint boundaries

레이어 규칙을 문서로만 두면 LLM agent 수가 늘수록 침식된다. §4.3의 원칙(결정적 검사가 검증 루프를 닫는다 \[5\])을 아키텍처에 적용하는 가장 가벼운 수단은 ESLint다. `eslint-plugin-boundaries`는 element type(예: route/feature/shared)을 파일 패턴으로 정의하고 type 간 허용 의존 규칙을 선언하면 위반을 lint 에러로 결정적으로 잡는다 \[9\]. quality-gate(`pnpm turbo run lint`)가 이미 PR required check이므로 새 인프라 없이 merge 차단에 직결된다. 다만 도입 **시점**은 Phase 3 일괄이 아니라 `src/features/` **구조가 처음 생기는 feature task와 같은 PR**로 한다 — 카운터 샘플만 있는 초기 repo에는 강제할 경계 자체가 없어 선제 도입이 오버스펙이고, feature 구조와 동시 도입하면 사후 도입의 누적 위반 정리 비용도 발생하지 않는다. 그 전까지는 §5.1\~§5.3 규칙의 AGENTS.md 문서화로 충분하다.

## 5.5 테스트 전략: 빠른 테스트 다수 + critical path E2E 소수

React Native 공식 testing overview는 E2E 테스트가 작성에 더 오래 걸리고, 실행이 느리고, flaky하기 쉬움을 명시하며 "인증 flow, 핵심 기능, 결제 같은 vital part만 E2E로 덮고 non-vital part는 더 빠른 JS 테스트를 쓰라"고 권고한다 \[10\]. 템플릿 설계안의 구성(Jest+RNTL 유닛/컴포넌트 테스트 + Maestro smoke E2E)은 이 권고와 정확히 일치하므로, 규칙은 다음으로 충분하다.

```
## Testing Rules
- TDD: write the failing test first (red), then implement (green). 
- Every feature task ships with unit/component tests (Jest + RNTL).
- Maestro flows cover ONLY critical paths (auth, core flow, payment). 
  Do not add a Maestro flow per screen.
- A flaky or failed Maestro run is never reclassified as pass by an agent 
  (operating-plan rule; deterministic gate decides).
```

## 5.6 root AGENTS.md 확장안 (적용 위치 제안)

위 규칙들을 §4.1의 6개 축에 맞춰 root AGENTS.md에 통합하면 다음 구성이 된다(6축 정의는 \[00\] 00-3 산출물 표준 참조). 각 섹션은 간결한 outline 수준으로 유지하고(짧고 정확하게 \[1\]), 본 보고서 §5의 모든 산문을 옮겨 적지 않는다 — 템플릿 설계안·운영계획에 확정된 사실과 위 코드 블록 수준의 규칙만 담고, 세부 규칙은 dry run(운영계획 Phase 4)에서 실수가 관찰될 때 추가한다 \[1\].

| AGENTS.md 섹션 | 내용 출처 |
| --- | --- |
| Repo layout | 템플릿 설계안 §5 구조 요약 + §5.1 라우팅/디렉터리 규칙 |
| How to run / Build·test·lint | `pnpm install`, `pnpm turbo run lint test`, EAS 명령은 `apps/mobile`에서 (템플릿 설계안 §8·§9) |
| Conventions | §5.2 레이어/import 방향, §5.3 상태 경계, naming은 템플릿 기본 스택 따름 |
| Constraints / do-not | TDD·no hardcoding·no direct push·shadcn/ui N/A(템플릿 설계안 §12) + 역방향 import 금지 + 서버 상태 복제 금지 + secret 커밋 금지 |
| Done & verification | lint/test 통과 + gatekeeper self-check + evidence 작성 (운영계획 §3.1 #5 참조) |
