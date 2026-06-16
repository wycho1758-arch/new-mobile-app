# 구조 점검 보고서 — SoT 기준: 프로젝트 = 정답, Confluence = 정정 대상

> Archived: current runtime facts and validation policy now live in
> `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, and the active validators under
> `scripts/`. Keep this file as historical inspection evidence only.

- 작성일: 2026-06-09
- 대상: `new-mobile-app` (branch `feat/mobile-app-template`)
- 점검 도구: serena MCP(활성화 확인) + read-only 점검(Read/Bash/Confluence fetch)

## 1. 기준(SoT) 정의
사용자 지시: **"현재 Confluence 설계가 잘못되었으니 해당 프로젝트를 기준으로 점검하라."**

따라서 본 보고서의 SoT는 **실제 프로젝트**다:
- 코드 + `PROJECT_ENVIRONMENT.md`(런타임 환경 root 소스)
- `scripts/validate-runtime-artifacts.mjs`(결정론적 구조 게이트)

Confluence 페이지(`Role-specific Codex Runtime` 1374289964, `01-4. Skills` 1373667362,
`[01] Mobile App 조직` 1373700097)는 **프로젝트에 대조해 검증**하며, 어긋나는 곳은
**Confluence가 결함**으로 판정한다.

## 2. 점검 방법 (read-only)
- Confluence SoT 3개 페이지 fetch: 1374289964 / 1373667362 / 1373700097.
- 결정론적 게이트 실행: `node scripts/validate-runtime-artifacts.mjs` → **exit 0(통과)**.
  - 현재 결과 로그: `Validated 3 skills, 8 agents, and 4 hook events.`
- 런타임 디렉터리 구조, `.gitignore`, git status(마이그레이션 상태) 대조.

## 3. 핵심 결론
**프로젝트의 결정론적 구조 게이트는 통과한다.** 강제되는 구조(`.agents/skills`,
`.codex/agents`, `.codex/hooks.json` 4-event, eval fixtures)는 모두 정상.
미해결 항목은 두 부류:
- **A. Confluence 설계가 프로젝트와 어긋남** → A1은 정정 완료, A2는 잔여 정정 대상.
- **B. 프로젝트 내부 위생** → 일부 정리 완료, 잔여 항목은 백로그.

---

## A. Confluence ↔ 프로젝트 불일치 (Confluence가 결함)

### A1. 훅 이벤트 수: Confluence 6개 vs 프로젝트 4개 — 핵심 [해결됨 2026-06-09]
- **프로젝트(SoT)**: `.codex/hooks.json`은 4개 이벤트만 배선 —
  `SessionStart` / `PreToolUse` / `PostToolUse` / `Stop`.
  `scripts/validate-runtime-artifacts.mjs:57`이 정확히 이 4개를 강제.
- **Confluence(결함)**: `Role-specific Codex Runtime`의 2026-06-08 업데이트가 **6개**를 문서화 —
  위 4개 + `UserPromptSubmit`(1376878593) + `PermissionRequest`(1376911361).
- **판정**: 프로젝트 MVP 범위는 4-event. Confluence가 미구현 2개를 SoT처럼 기재 → 과잉 명세.
- **조치 완료(2026-06-09)**: 사용자 판정(두 훅 모두 불필요)에 따라 Confluence 6개 페이지를 정정 —
  - 본체 2개(1376878593, 1376911361): 제목 `[제거됨 2026-06-09]` + 본문을 제거 공지로 교체.
  - 참조 4개: `Role-specific Codex Runtime`(1374289964), `Hooks`(1374060648),
    `hook-evaluation-and-ci-gate`(1374355561), `Practitioner Guide`(1374519410) —
    6-event → 4-event로 정정하고 두 훅 행/목록 제거 + 2026-06-09 correction 노트 추가.
  - 보존: 날짜 박힌 Evidence 페이지 `2026-06-08 Codex Hook Source Basis Update Evidence`(1376813059)는
    과거 기록이라 수정하지 않음.
  - 프로젝트 코드는 변경 없음(이미 4-event).
- **근거**: `PermissionRequest` deny 경계는 `PreToolUse`(`mobile-pretool-policy.mjs:17-37`)가 이미 차단,
  `UserPromptSubmit` advisory는 skill/SOUL + PreToolUse `EXPO_PUBLIC_` 경고가 이미 커버.

### A2. SessionStart 훅 이름 불일치
- **프로젝트(SoT)**: `.codex/hooks/mobile-subagent-context.mjs` (hooks.json SessionStart 배선).
- **Confluence(결함)**: 동일 훅을 `mobile-session-start-context-hook`(1376845825)으로 명명.
- **조치(보류)**: Confluence 명칭을 실제 파일명에 맞춰 정정.

### A3. (참고) Skills 배치는 불일치 아님
- Confluence `01-4`는 MVP 5 + bootstrap + 역할 wrapper를 나열하나, **repo skill pack vs
  organization-runtime skill pack 분리**를 명시. 프로젝트 `.agents/skills`의 2개
  (`mobile-app-dev-workflow`, `mobile-backend-api-integrator-workflow`)는 repo pack에 해당하며
  게이트 요건(`skills >= 2`)도 충족 → **정상, 정정 불필요.**

---

## B. 프로젝트 내부 구조 위생

### B1. OpenClaw 제거 잔존물
- 프로젝트 결정: `PROJECT_ENVIRONMENT.md` "Current Non-Scope" + `AGENTS.md:53` —
  OpenClaw 패키징 스크립트/결과 복원 금지. (게이트/CI에 잔여 참조 없음 확인.)
- 잔존물:
  - `evals/openclaw/results/generated-agent-skill-packages/` — summary.md 삭제 후 남은 **빈 고아 디렉터리 3개**.
  - `.generated/openclaw-skill-packages/{mobile-app-dev-workflow,mobile-backend-api-integrator-workflow}/references/sot.md`
    — **untracked·gitignored 잔여 2개**(`.gitignore:2`로 무시, 커밋 위험 없음, 로컬 cruft).
- 조치(백로그): 빈 `evals/openclaw` 트리 및 `.generated/openclaw-skill-packages` 로컬 제거.

### B2. SoT가 참조하는 런타임 파일이 git untracked
- `PROJECT_ENVIRONMENT.md`/검증기가 요구하지만 미추적:
  `.codex/config.toml`, `PROJECT_ENVIRONMENT.md`, `scripts/clean-tree-guard.mjs`,
  `scripts/codex-preflight.mjs`, `scripts/test-local-harness.mjs`, `evals/local-harness/`,
  신규 eval fixtures(`evals/hooks/fixtures/*`, `*review-only-negative.prompt.md`,
  `*generic-expo-negative.prompt.md`), `apps/mobile/postcss.config.mjs`,
  `apps/mobile/jest.after-env.js`, `docs/confluence/`, `docs/plans/`.
- 의미: 추적 트리가 자체 SoT를 아직 완전히 반영하지 못함. 조치(백로그): 의도된 파일 커밋.

### B3. 로컬 Claude 상태 파일 정리
- 조치 완료(2026-06-09): `CLAUDE.md`, `.claude/`, `.claude-state/`는 active Codex runtime 범위가 아니므로
  root 경로에서 제거했고 `scripts/validate-runtime-artifacts.mjs`가 재유입을 차단한다.
  `node_modules` 같은 ignored dependency 경로의 동명 파일은 정책 범위 밖이다.

---

## 4. 백로그 우선순위 (후속 턴)
| 항목 | 유형 | 영향 | 권장 |
| --- | --- | --- | --- |
| A1 훅 6 vs 4 | Confluence 정정 | 설계 문서 신뢰성 | 완료(2026-06-09) |
| A2 훅 명칭 | Confluence 정정 | 낮음 | 보류 |
| B1 OpenClaw 잔존물 | repo 정리 | 낮음(고아/ignored) | 정리 우선 |
| B2 untracked 런타임 | repo 커밋 | 중(SoT 정합) | 의도 확인 후 커밋 |
| B3 root Claude artifact | repo 위생 | 중(오커밋 위험) | 완료(제거 및 validator 차단) |

## 5. 검증
- `node scripts/validate-runtime-artifacts.mjs` → exit 0(통과) 확인.
- 2026-06-09 현재 `pnpm run test:runtime`, `pnpm run test:local-harness` 통과 확인.
- 본 보고서 발행 당시 경로: `docs/plans/20260609-structure-inspection-sot.md`.
  현재 아카이브 경로: `mobile-app-dev-team/_archive/historical-inspections/20260609-structure-inspection-sot.md`.
- (후속, 본 보고서 범위 아님) 백로그 실행 시 `pnpm run test:runtime`,
  `pnpm run test:local-harness` green 유지.
