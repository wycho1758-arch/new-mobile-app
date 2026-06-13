---
name: best-practices
type: reference
description: "이 repo(Expo React Native + TypeScript) 스택에 큐레이션된 코딩 베스트 프랙티스 규칙 라이브러리. TypeScript, React(RN 적용분), 백엔드/계약, 테스트 인프라 규칙을 역할별로 직접 조회합니다. 사용 시점: (1) 구현 전 해당 역할의 코딩 규칙을 확인할 때, (2) 리뷰에서 규칙 근거를 인용할 때, (3) 리팩토링 방향을 규칙으로 뒷받침할 때. /best-practices [role|topic] 으로 호출."
user-invocable: true
argument-hint: "[role: mobile-app-dev | backend-api-integrator | mobile-architect | qa-release] 또는 [topic: ts | react | backend | test]"
allowed-tools:
  - Read
  - Grep
  - Glob
---

# best-practices

이 repo(Expo React Native + TypeScript + NativeWind) 스택에 **큐레이션된** 코딩 규칙 라이브러리입니다.

> **독립 호출형 leaf 스킬.** 이 스킬은 다른 스킬에 의해 참조되는 종속 라이브러리가 아니라,
> 사용자/에이전트가 `/best-practices`로 **직접 조회**하는 자기완결 지식 스킬입니다. 어떤 스킬도
> 이 스킬을 `ref`로 묶지 않으며, 이 스킬도 다른 스킬/`.agents` SoT/executor를 참조하지 않습니다.
> read-only이며 코드를 수정하지 않습니다.

## 사용법

```
/best-practices                         # 전체 인덱스 + 역할별 매핑 안내
/best-practices mobile-app-dev          # 해당 역할에 적용되는 규칙 묶음
/best-practices ts                      # TypeScript 규칙 전체
/best-practices react                   # React(RN 적용분) 규칙 전체
```

조회 절차: 역할/토픽을 받으면 `rules/_role-index.md`에서 적용 규칙 목록을 찾아, 해당
`rules/<rule>.md` 파일을 Read로 열어 근거와 함께 제시합니다.

## 스택 큐레이션 (이 repo 적용 범위)

원본(openclaw-cloud) 라이브러리에서 **이 repo 스택에 해당하는 규칙만** 유지하고, 비해당 규칙은
제외했습니다.

- **유지:** TypeScript(`ts-*`), React 중 RN 적용분(`react-async/components/effects/rerender/state/js-*`),
  백엔드 패턴(`backend-patterns`), 테스트 인프라(`test-infrastructure`).
- **제외(파일 미포함):** Go·Python·Rust 전체(스택 아님), 웹 전용 React(`react-server-*` 서버
  컴포넌트, `react-bundle-*` 웹 번들), DOM 전용(`react-js-passive-events`), Next.js
  (`ts-nextjs-api-route-typing`). Expo RN에는 비해당입니다.

## 역할별 활용 인덱스

본 repo 6개 운영 역할 중 코딩 규칙이 적용되는 역할 매핑입니다. 상세는
[`rules/_role-index.md`](rules/_role-index.md).

| 역할 | 적용 규칙군 |
| --- | --- |
| **mobile-app-dev** | `ts-*`, `react-components/effects/rerender/state`, `react-js-*`(perf), `test-infrastructure` |
| **backend-api-integrator** | `ts-types/error/async`, `ts-validation-zod-schema`, `backend-patterns`, `test-infrastructure` |
| **mobile-architect** | `ts-org-*`(barrel/path-aliases/strict), `react-components-composition`, 모듈 경계, `test-infrastructure` |
| **qa-release** | `test-infrastructure` 중심 |
| design · product-planning | 코드 규칙 비해당 (각각 UX/계획 영역) |

## Rules

### 공통
- `_sections.md` - 규칙 섹션 정의
- `_template.md` - 규칙 작성 템플릿
- `_role-index.md` - 역할 → 규칙 매핑 (이 repo용 신규)

### TypeScript (`ts-*`)
- **에러 처리**: class-hierarchies, custom-types, result-pattern, try-catch
- **비동기**: all-settled, avoid-callbacks, batch-processing, error-handling, retry-pattern
- **타입 시스템**: avoid-any, const-assertions, generic-constraints, intersection, keyof-typeof, type-guards, union-narrowing
- **코드 구조**: barrel-exports, interface-vs-type, path-aliases, strict-mode
- **검증**: zod-schema
- **안티패턴**: empty-interfaces, ignore-errors, type-assertion

### React (RN 적용분, `react-*`)
- **비동기**: defer-await, dependencies, parallel, promise-all, suspense-boundaries
- **컴포넌트**: composition, conditional-render, discriminated-unions, typescript
- **이펙트**: cleanup, custom-hooks, dependencies, race-condition
- **리렌더링 최적화**: avoid-inline-objects, functional-setstate, lazy-init, memo, transitions, usecallback, usememo
- **상태 관리**: context, derived, local, reducer
- **JS 최적화**: early-exit, index-maps, property-access, set-lookups, tosorted

### 백엔드 / 계약
- `backend-patterns` - 백엔드 서비스 패턴

### 테스트
- `test-infrastructure` - 테스트 인프라 규칙
