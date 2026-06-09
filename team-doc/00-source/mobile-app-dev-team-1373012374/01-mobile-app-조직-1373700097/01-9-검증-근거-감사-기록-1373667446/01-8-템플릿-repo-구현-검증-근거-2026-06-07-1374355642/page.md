---
pageId: "1374355642"
sourceTitle: "01-8 템플릿 repo 구현 검증 근거 (2026-06-07)"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355642"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | 01-8 설계안(SoT)을 구현한 템플릿 repo(`Wondermove-Inc/new-mobile-app`)의 DoD 대조표, 검증 증거, 게이트 기록, SoT 편차 판정을 보존한다. 규범 페이지가 아닌 근거 저장소다. |
| Upstream | 없음 (감사 기록) |
| Downstream | 01-8 (구현 현황·SoT 정정 v18+ 근거 참조), 01-7 (Phase 3 base 상태 기록 근거 참조) |
| 관련 DEC-ID | 해당 없음 (근거 원문 — SoT 정정 2건은 구현 검증으로 실증된 기술 제약의 명시화, DEC 신설 없음) |
| 출처 | 로컬 산출물: openclaw-cloud `.claude/plans/complete/2026-06-07/abundant-shimmying-bird.md` (실행 계획·Agent Execution Log), `/tmp/p3-dod-table.md` (DoD 대조표 원본), ultracode Workflow `wf_989a3871-699` 결과 (PHASE 3 4축 검증 + PHASE 4 + 게이트) |

## 1. 구현 대상과 범위

| 항목 | 값 |
| --- | --- |
| Repo | `Wondermove-Inc/new-mobile-app` (public) |
| Branch | `feat/mobile-app-template` (base: `origin/main` = 067ad4c) |
| 구현 완료일 | 2026-06-07 |
| git 상태 | 커밋 6건 로컬 보존, **push/PR 미수행** (운영자 별도 지시 시에만 진행) — 따라서 본 페이지는 GitHub 파일 직링크를 넣지 않으며, main merge 후 링크 추가 가능 |
| 보존 원칙 | 기존 codex runtime 레이어(`.codex/`, `.agents/`, `evals/`, `scripts/`)는 의미 변경 없이 보존 — 067ad4c..HEAD diff에서 해당 경로 변경 0건 |

커밋 목록 (오래된 순):

| 커밋 | 내용 |
| --- | --- |
| 432e60d | feat: pnpm/turbo 모노레포 base 전환 + contracts + 거버넌스 문서 (PHASE 1) |
| 23888f4 | docs(infra): clawpod agent-runner manifest + setup/credentials 문서 (PHASE 2C) |
| 27e0aa4 | feat(mobile): Expo 앱 골격 + NativeWind + jest TDD 샘플 + EAS 설정 (PHASE 2A) |
| 917a077 | feat(api): Hono backend 워크스페이스 + Drizzle + vitest TDD 샘플 + Dockerfile (PHASE 2B) |
| e132711 | fix(verify): app.config.ts inline process.env + nativewind tsconfig (검증 중 수정 — §5 편차 1 참조) |
| ebe6679 | docs(handoff): `SETUP.md` human-gate 체크리스트 + DoD 대조표 (PHASE 4) |

## 2. DoD 대조표 (01-8 §2 + §15.5, 총 17항목)

판정 기준: PASS = 산출물 존재 + 검증 결과로 입증 / HUMAN-GATE = EAS 클라우드·외부 서비스 연결(Expo 계정·`eas init`·Robot token·Store·Sentry 활성화) 선행 필요 / FAIL = 결손.

**요약: PASS 16 / HUMAN-GATE 1 / FAIL 0**

### 2.1 §2 핵심 DoD (13항목)

| DoD 항목 | 판정 | 근거 |
| --- | --- | --- |
| pnpm workspace + Turborepo 동작, `packages/contracts`가 `apps/mobile`에서 해석됨 | PASS | `pnpm install --frozen-lockfile` EXIT 0, `pnpm turbo run lint test --force` 4 tasks all successful. `index.tsx`가 `@template/contracts`에서 `COUNTER_INCREMENT` import |
| 홈 화면 카운터 샘플이 공유 상수 import하여 렌더링·동작 | PASS | mobile jest 1 test PASS ("renders configured title and increments the counter") |
| Jest 유닛 테스트(`home.test.tsx`) 통과 + `jest.setup.ts` 테스트 env 주입 | PASS | `src/app/__tests__/home.test.tsx` + `jest.setup.ts` 존재, jest PASS |
| RNTL v13+ 고정 — built-in matcher import만으로 등록 | PASS | `@testing-library/react-native: ^13.0.0`, `toHaveTextContent` 동작 확인 |
| NativeWind 동작 (`global.css`·token defaults·`tailwind.config.js`·withNativeWind·`nativewind-env.d.ts`) | PASS | 5종 전부 존재, Metro smoke에서 NativeWind 오류 0 |
| Maestro E2E(`home.yml`)가 EAS Workflows maestro job으로 통과 | **HUMAN-GATE** | `home.yml` + `e2e-test-android.yml`(maestro job 배선) 산출물 완비. 실통과는 EAS 클라우드 emulator 실행 필요 |
| `eas.json` 4 profile (development/preview/production/e2e-test) | PASS | 4 profile + submit.production 정의 확인 |
| `.eas/workflows` 3종 배선 (build-maestro / build-submit / update) | PASS | 3 yml 전부 job type 배선 확인 |
| `@sentry/react-native` init + sourcemap 절차 문서화 | PASS | `_layout.tsx` `Sentry.init`(enabled: Boolean(DSN)) no-op 가드 + `CREDENTIALS.md` 절차. 활성화 실행 자체는 human-gate 영역 |
| `EXPO_TOKEN` k8s Secret 예시 manifest | PASS | `infra/clawpod/secret.example.yaml` + `agent-runner.yaml`(envFrom secretRef) |
| `AGENTS.md` + `docs/SETUP.md` / `docs/CREDENTIALS.md` 완비 | PASS | 3개 문서 존재, 최소 목차 충족 (§12 필수 4항목 + api 제약 3항목 포함) |
| `DESIGN.md` + `docs/design-references/` vendored 사본(MIT LICENSE·NOTICE) (DEC-021) | PASS | LICENSE + NOTICE + vendored 사본 존재 |
| 하드코딩된 고객/앱 식별자 0건 (템플릿 변수 치환 가능) | PASS | `cloud.clawpod.app` / `ClawPod Mobile` / `@clawpod/api` 등 금지 식별자 0건. `{{...}}`/`${...}` placeholder는 템플릿 repo 의도적 잔존 |

(13번째 행 "(선택) apps/api 포함 시 §15 완료 기준 충족"은 아래 2.2 표 4항목 전부 PASS로 충족)

### 2.2 §15.5 apps/api 완료 기준 (4항목)

| DoD 항목 | 판정 | 근거 |
| --- | --- | --- |
| `counter-events.test.ts` red→green (vitest, turbo test 합류) | PASS | vitest 2 tests PASS (invalid 400 + 201 round-trip), turbo 합류 확인 |
| `migrate()` 멱등 (2회 연속 동일 결과) | PASS | 1회차 부팅 시 0000_bitter_komodo.sql 적용, 2회차 migrations count=1 유지·신규 0건 |
| `GET /livez`·`GET /readyz` 무인증 200 (readyz는 DB ping) | PASS | livez 200, readyz 200 (DB up) / 503 (DB down) 분기까지 확인 |
| `docker build -f apps/api/Dockerfile .` 성공 | PASS | image sha256:a0e4bc9a5cd1 산출. turbo prune → tsc → pnpm deploy 전 스테이지 성공 |

## 3. 검증 증거 (PHASE 3 통합 검증 — 4축 병렬)

| 검증 축 | 명령/방법 | 결과 |
| --- | --- | --- |
| install + lint/test | `pnpm install --frozen-lockfile`; `pnpm turbo run lint test --force` (캐시 우회) | EXIT 0; 4/4 tasks (mobile jest 1/1, api vitest 2/2, 양쪽 `tsc --noEmit` 0 err) |
| docker | compose up(postgres:16, 포트 5432 충돌 없음) → api 2회 부팅 → health 검사 → compose down -v → docker build | migrate 멱등, livez/readyz 200 + DB down 503, build 성공 |
| expo smoke | `CI=1 pnpm --filter mobile exec expo start --clear` 백그라운드 + 로그 폴링 | 약 5초 내 Metro 기동(`Waiting on http://localhost:8081`), NativeWind/`global.css` 오류 0, 프로세스·포트 정리 완료 |
| runtime 회귀 | `validate` / `test:hooks` / `package:openclaw-skills` / `test:openclaw` / `test:runtime` | 5 scripts 전부 EXIT 0 (2 skills, 4 agents, 4 hook events 검증) |
| 하드코딩 audit | 금지 식별자 grep (apps/·packages/·infra/) | 위반 0건 |

PHASE 3은 검증 전용으로 종료 — fix 커밋 0건 (e132711은 PHASE 2A 검증 중 수정으로 PHASE 3 이전).

## 4. 게이트 기록 (FULL cadence)

| 게이트 | 판정 | 요지 |
| --- | --- | --- |
| plan (#0) | ESCALATE → 정정 → 사용자 승인 | stale 전제(작업 base 브랜치) 정정 — `origin/main` = 067ad4c 기반으로 확정. SoT 18/18 매핑 확인 |
| PHASE 1 | LGTM | SoT byte-match, 기존 runtime scripts 회귀 0 |
| PHASE 2 (2A/2B/2C) | LGTM | Gap 5건 전부 SoT-ALLOWED 판정, security PASS |
| PHASE 3 | LGTM | reviewer가 체크리스트 8항목을 독립 재실행으로 입증 (docker image sha 동일 재현 포함). DoD 16/1/0 정확성 확인 |
| final | LGTM | 계획 Section 2 전 체크리스트 누락 0, Quality Gate 전 항목 충족, secret leak 스캔 0건 |

실행 이력: PHASE 1\~2C + P1/P2 게이트는 세션 2eeeecf3(2026-06-07 오전), PHASE 3\~4 + P3/final 게이트는 API 장애 중단 후 ultracode Workflow `wf_989a3871-699`(에이전트 9개)로 재개 완료.

## 5. SoT 편차 판정 (3건)

| # | 편차 | 판정 | 사유 |
| --- | --- | --- | --- |
| 1 | `apps/mobile/app.config.ts`가 SoT §6의 `import { Env } from './env'` 대신 `process.env.EXPO_PUBLIC_*` 직접 read (커밋 e132711) | SoT-ALLOWED → **본문 정정으로 승격** (01-8 v18) | `@expo/config`의 evalConfig(sucrase + require-from-string)가 root `"type":"module"` 모노레포에서 `require('./env')` TS 파일을 해석하지 못함 — `expo start` 실행으로 실증. 동일 `EXPO_PUBLIC_*` env 키를 사용해 `env.ts`(런타임 src/ 전용)와 단일 키 체계 유지, fallback default는 중립 식별자(`com.template.mobile`). 기능·보안·DoD 영향 없음 |
| 2 | `apps/api` 내부 상대 import에 `.js` 확장자 suffix (14곳, 예: `./db/client.js`) — SoT §15.3 코드블록은 확장자 생략 표기 | SoT-ALLOWED → **규약 주석으로 승격** (01-8 v18) | `tsconfig` `moduleResolution: NodeNext` ESM 필수 규약 — `.js` suffix 없이는 `tsc` 실패. 기계적 ESM 해석 디테일로 semantic 변화 없음 |
| 3 | `@sentry/react-native` 6.22.0 (expo \~53.0.27 기대 \~6.14.0), `typescript` 5.9.3 (기대 \~5.8.3) | advisory — SoT 위반 아님 | SoT가 이 둘을 핀하지 않으며 caret 범위 내 드리프트. 빌드·테스트 영향 0. 프로젝트 생성 시 `npx expo install --check` 권고 |

참고: Expo SDK 53(\~53.0.27) 채택은 SoT "SDK 52+ 현행 안정판" floor 이상으로 편차 아님.

## 6. 원본 산출물 위치

실행 계획·Agent Execution Log·게이트 상세는 운영자 로컬 openclaw-cloud `.claude/plans/complete/2026-06-07/abundant-shimmying-bird.md`가 원본이다. DoD 대조표 원본은 `/tmp/p3-dod-table.md`(휘발) 및 템플릿 repo `docs/SETUP.md` 말미 사본. 본 페이지는 그 보존본이며 수치·판정은 원본과 동일하다.