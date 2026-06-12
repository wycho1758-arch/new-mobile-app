Reading additional input from stdin...
OpenAI Codex v0.137.0
--------
workdir: /Users/tw.kim/Documents/AGA/test/new-mobile-app
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019eb126-57f1-77e1-93ed-9456c9d6a47b
--------
user
You are reviewer(xhigh) for a review-only planning/report task in /Users/tw.kim/Documents/AGA/test/new-mobile-app. Do not edit files. Do not inspect or print secrets. Do not delegate.

Question to review: Based on the latest NO_GO caused by one remaining stale PR7 line citation, is the correct conclusion that progressive/staged progress is still possible? If so, what improves for the current project direction after proceeding correctly?

Use these source files:
- team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
- .evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md
- .evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md
- .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md
- AGENTS.md
- PROJECT_ENVIRONMENT.md
- REPO_OPERATIONS.md
- team-doc/mobile-app-dev-team/06-gates-and-evidence.md
- .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md
- /Users/tw.kim/.claude/plans/luminous-snacking-moler.md

Draft conclusion to validate:
1. Yes, staged progress is possible, but only in this order: first fix the remaining PR7 stale line citation and rerun narrow validate-team-doc; then after concurrent runtime edits stabilize, run and record full test:runtime re-baseline; only then start repo-internal offline PR1/PR2/PR3/PR4/PR6/PR7 and PR5 offline work under TDD/validator-first.
2. Nothing in the latest review permits implementation/PR-ready/live readiness/native completion today.
3. Human/ops items remain blocked: Part D platform work, image/pod/webhook/secret/token/branch protection/release env, PR5 live native E2E, multi-pod rollout.
4. Always forbidden items remain: production submit automation, release human gate weakening, Gatekeeper LLM/pod/SOUL modeling, RN Web/Railway/local validation as native or external proof, secret exposure, direct external platform mutation.
5. Directional improvements if done correctly: converts the mobile-agent template from prose/process to deterministic repo-operable workflow; creates machine-readable work-unit state and human gate records; makes role handoff durable through GitHub state; prevents ad hoc LLM routing by adding deterministic resolver; aligns pod bootstrap with repo pnpm pin and fail-fast checks; separates RN Web, native E2E, and human-device evidence to avoid false claims; adds SoT drift/evidence hygiene/preflight checks; keeps external platform work as ops annex rather than uncontrolled repo action.

Return Korean findings first and one machine-readable JSON envelope with verdict GO, NO_GO, NEEDS_HUMAN, or BLOCKED.
2026-06-10T10:49:02.323626Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when AuthRequired(AuthRequiredError { www_authenticate_header: "Bearer error=\"invalid_token\", error_description=\"Token has expired. Please re-authenticate to obtain a new token.\"" })
hook: SessionStart
hook: SessionStart Completed
codex
검토 전용으로 진행하겠습니다. 지정된 문서의 관련 섹션과 라인 근거만 확인하고, 파일 수정이나 외부 위임은 하지 않겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "NO_GO|PR7|stale|validate-team-doc|test:runtime|PR1|PR2|PR3|PR4|PR5|PR6|Part D|platform|production|Gatekeeper|RN Web|Railway|secret|branch protection|release|machine-readable|work-unit|resolver|pnpm|native|human|ops|GO|NEEDS_HUMAN|BLOCKED" /Users/tw.kim/.claude/plans/luminous-snacking-moler.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc 'rg -n "TDD|required|No hardcoding|direct push|external platform|Expo|NativeWind|Mobile QA|test:runtime|test:local-harness|Definition of Done|secret|branch|PR|native|human|Gatekeeper|RN Web|Railway" AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md team-doc/mobile-app-dev-team/06-gates-and-evidence.md .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
1:# 검토 계획: applicability 판정문(GO) 교차 검증 결과 반영
10:- 1차 xhigh: `...-xhigh-review-20260610.md` (verdict NO_GO — stale gate status, CONDITIONAL_GO 오인 위험 지적)
11:- 정정 후 xhigh 재검토: `...-xhigh-rereview-20260610.md` (verdict **GO**, findings 0건, residual risk 2건 — envelope 직접 확인)
16:`AGENTS.md`, `REPO_OPERATIONS.md`, `06-gates-and-evidence.md`와 정합하고, pnpm pin
17:mismatch 정정이 boram 증거(`orbstack-boram-linux-sot-check.md:47`)와 일치하며, GO의
18:효력 범위 한정(구현 승인·PR-ready·live readiness·native 완료 아님)도 정확하다.
22:1. **(실측 확인됨) 13번 계획서의 stale 라인 인용**: 동시 세션이 `validate-team-doc.mjs`를
23:   대규모 수정(+536/-163)하여, 13번 문서 G8이 인용하는 `validate-team-doc.mjs:236-250`
24:   (team-doc secret 스캔)이 현재 **81행**으로 이동, CTO 규칙도 1114→**966행**으로 이동.
25:   1차 xhigh가 NO_GO 사유로 삼았던 것과 같은 종류의 stale reference가 13번 문서에 재발생.
26:2. **게이트 re-baseline이 구현 착수의 명시적 전제 조건**: 판정문은 test:runtime skip을
27:   기록만 했으나, PR1 수용 기준이 test:runtime green을 요구하므로 "동시 세션 안정화 →
28:   전체 게이트 재실행·기록"을 PR1 착수 전 선행 단계로 격상해야 함.
36:1. **13번 계획서 stale 인용 1건 정정**: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
37:   G8의 `validate-team-doc.mjs:236-250` → 라인 번호 제거, "validate-team-doc.mjs의
38:   team-doc 한정 secret 패턴 스캔(현재 구현 기준 `secretPatterns`)" 동작 기준 표현으로 교체
43:3. **좁은 검증만 실행**: `node scripts/validate-team-doc.mjs` 1회(13번 문서 수정 정합 확인).
44:   전체 `test:runtime`은 사용자 skip 지시(동시 세션 수정 중) 유지 — 실행하지 않고
46:4. **보고**: 판정 수용 + 보완점 3건 + 다음 단계(게이트 re-baseline 후 PR1 착수 가능)를
51:- PR1~PR7 구현 착수(별도 승인 대기), 전체 test:runtime 실행(사용자 skip 지시 유지),
52:  Part D ops/플랫폼 작업, 토큰/라이브 EAS, `validate-team-doc.mjs` 등 동시 세션 작업

 succeeded in 0ms:
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:8:| Codex runtime artifact | `pnpm run test:runtime` |
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:9:| Runtime path/local harness | `pnpm run test:local-harness` |
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:12:| RN Web E2E | Playwright command output and `.evidence/e2e-test/...` artifacts |
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:16:## Release Gatekeeper (System)
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:18:- Release Gatekeeper (System) is the display title for the non-LLM deterministic Gatekeeper.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:20:- It cannot replace human approval or accept failed-gate risk.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:21:- It only consumes required evidence and returns deterministic pass/fail.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:29:- Screenshots/logs are required for visual or runtime failures when available.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:35:- Durable GitHub handoff means a downstream pod consumes a branch/commit/PR or merged repo artifact, not another pod local workspace.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:37:- Canonical evidence remains in workflow-owned paths such as `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`, mobile-mcp records, Railway evidence, EAS evidence, or human approval records.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:40:## Railway Boundary
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:42:`qa-railway-workflow` can prove Railway CLI setup, service/database/domain/deploy status, health endpoints, and RN Web E2E against a deployed API URL.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:49:- Maestro native automation.
team-doc/mobile-app-dev-team/06-gates-and-evidence.md:55:Stop for recorded human decision when work involves:
AGENTS.md:5:- Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` using skill-creator structure.
AGENTS.md:6:- Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml` for primary artifacts; required validators, evals, scripts, and evidence may still be added when the change needs them.
AGENTS.md:13:- TDD required: write or update tests before implementation changes.
AGENTS.md:14:- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
AGENTS.md:15:- No direct push to `main`; use a branch and PR.
AGENTS.md:16:- Do not modify external platform/runtime repositories from this repository.
AGENTS.md:17:- RN UI uses NativeWind + React Native primitives + semantic design tokens; web-only shadcn/ui is N/A for React Native screens (apply shadcn/ui only to optional web console).
AGENTS.md:32:- `apps/mobile/` — Expo Router app (template core)
AGENTS.md:33:- `apps/api/` — optional Hono + Drizzle backend (include only when a new backend is required; see §15 01-8)
AGENTS.md:37:- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
AGENTS.md:40:## Expo / React Native Runtime Policy
AGENTS.md:42:- Current mobile baseline is Expo SDK 56 (`expo ~56.0.9`) with React Native 0.85, NativeWind v5 preview, Tailwind CSS v4, and `expo-dev-client`.
AGENTS.md:43:- Environment/runtime changes must keep `PROJECT_ENVIRONMENT.md` and the Confluence update document in sync with actual repo settings.
AGENTS.md:44:- Before a mobile environment change is considered done, verify mobile lint/test, `expo install --check`, native run smoke on iOS/Android when available, and Maestro smoke where available.
AGENTS.md:45:- Official Expo skills may be introduced in a separate verified step with `npx skills add expo/skills`. Official Expo skills should cover generic Expo/RN workflows; repo skills remain responsible for this project's contracts, role boundaries, evidence, and QA gates.
AGENTS.md:46:- `mobile-mcp` is the required local visual QA/device automation MCP. Pin its version in `.codex/config.toml`, do not use `@latest`, do not add it to required CI gates, and do not parallelize simulator/device operations.
AGENTS.md:48:## Mobile QA Selectors
AGENTS.md:57:- `pnpm run test:local-harness` validates Codex CLI runtime structure, role boundaries, skill/agent/hook configuration, gatekeeper/evidence fixtures, and best-effort headless Codex smoke.
AGENTS.md:58:- It is not an app feature test suite and does not prove Jira, Confluence, GitHub branch protection, EAS build/submit, production submit, or external platform/runtime behavior.
AGENTS.md:72:pnpm run test:runtime
AGENTS.md:74:# Run full Codex local harness for runtime-related PRs
AGENTS.md:75:pnpm run test:local-harness
AGENTS.md:84:## Conventions & PR Expectations
AGENTS.md:89:- All changes go through a branch + PR. The quality-gate workflow must pass before merge.
AGENTS.md:96:- Do not use shadcn/ui for React Native screens (NativeWind + RN primitives only; shadcn/ui applies only to optional `apps/console`).
AGENTS.md:97:- Do not modify external platform/runtime repositories from this repository.
AGENTS.md:102:## Definition of Done / Verification
AGENTS.md:104:Before opening a PR, verify:
AGENTS.md:107:2. Codex runtime artifacts are intact: `pnpm run test:runtime`
AGENTS.md:108:3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
AGENTS.md:110:5. For mobile UI/runtime changes with an available simulator or device, run local `mobile-mcp` visual QA/device automation serially and record the result in PR evidence
REPO_OPERATIONS.md:6:entrypoint, and it does not replace `PROJECT_ENVIRONMENT.md` as the current
REPO_OPERATIONS.md:13:| `AGENTS.md` | Mandatory agent execution rules, constraints, runtime paths, and required gates. |
REPO_OPERATIONS.md:14:| `PROJECT_ENVIRONMENT.md` | Current runtime and environment facts. |
REPO_OPERATIONS.md:24:`AGENTS.md` for agent instructions, `PROJECT_ENVIRONMENT.md` for runtime facts,
REPO_OPERATIONS.md:71:Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime
REPO_OPERATIONS.md:72:and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
REPO_OPERATIONS.md:87:passwords, or full secret-bearing config contents. Reports must use redacted
REPO_OPERATIONS.md:107:`pnpm run test:runtime` must compose those active current team/runtime gate
REPO_OPERATIONS.md:123:Runtime path or harness changes must also run `pnpm run test:local-harness`
REPO_OPERATIONS.md:128:GitHub branch protection, EAS production submit, or external platform state.
REPO_OPERATIONS.md:138:  role/process documents, active repo-local skill and agent contracts, pod-native
REPO_OPERATIONS.md:153:Future validator changes must keep required gates explicit in `package.json`
PROJECT_ENVIRONMENT.md:5:This file is the root source for the current project environment and runtime settings. Keep it in sync when changing package versions, Expo config, NativeWind config, Codex runtime files, CI gates, EAS workflows, required environment variables, or the Codex MCP/CLI setup guide at `docs/CODEX_MCP_ENVIRONMENT.md`.
PROJECT_ENVIRONMENT.md:13:  - `pnpm run test:runtime`
PROJECT_ENVIRONMENT.md:15:  - `pnpm run test:local-harness` for Codex runtime changes.
PROJECT_ENVIRONMENT.md:20:- Framework: Expo SDK 56 with Expo Router.
PROJECT_ENVIRONMENT.md:25:  - `react-native`: `0.85.3`
PROJECT_ENVIRONMENT.md:26:  - `react-native-web`: `^0.21.2`
PROJECT_ENVIRONMENT.md:31:- Expo config: `apps/mobile/app.config.ts`.
PROJECT_ENVIRONMENT.md:39:  - `extra.eas.projectId` reads `EAS_PROJECT_ID`.
PROJECT_ENVIRONMENT.md:61:- RN Web E2E validates only RN Web/browser-reproducible UI, navigation, state, and business logic flows.
PROJECT_ENVIRONMENT.md:62:- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or other device/hardware features.
PROJECT_ENVIRONMENT.md:63:- RN Web release E2E requires a deployed backend API URL through public client config:
PROJECT_ENVIRONMENT.md:66:  - The current Railway QA API URL verified for this workspace is `https://api-production-3d74.up.railway.app`.
PROJECT_ENVIRONMENT.md:68:- Playwright launches Expo Web with deterministic public test config plus the caller-provided backend API URL:
PROJECT_ENVIRONMENT.md:79:  - Run Maestro and `mobile-mcp` visual QA when the required EAS account, simulator, emulator, or device is available.
PROJECT_ENVIRONMENT.md:80:  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.
PROJECT_ENVIRONMENT.md:84:- Styling layer: NativeWind with React Native primitives and semantic design tokens.
PROJECT_ENVIRONMENT.md:85:- Current NativeWind package: `nativewind@5.0.0-preview.4`.
PROJECT_ENVIRONMENT.md:86:- NativeWind v5 is a pre-release package, so this repo pins the exact preview version.
PROJECT_ENVIRONMENT.md:87:- NativeWind v5 rollback criteria:
PROJECT_ENVIRONMENT.md:88:  - Roll back to the last passing NativeWind v4 / Tailwind CSS v3 baseline if SDK 56 compatibility checks, Metro bundling, Jest, native run smoke, or Maestro/mobile visual QA fail because of NativeWind v5 and cannot be fixed in the same PR.
PROJECT_ENVIRONMENT.md:89:  - Do not promote a production release with unresolved NativeWind v5 rendering, bundling, or native runtime defects.
PROJECT_ENVIRONMENT.md:97:- NativeWind dependencies:
PROJECT_ENVIRONMENT.md:98:  - `react-native-css`: `^3.0.7`
PROJECT_ENVIRONMENT.md:99:  - `react-native-reanimated`: `4.3.1`
PROJECT_ENVIRONMENT.md:100:  - `react-native-worklets`: `0.8.3`
PROJECT_ENVIRONMENT.md:101:  - `react-native-safe-area-context`: `~5.7.0`
PROJECT_ENVIRONMENT.md:102:- NativeWind config files:
PROJECT_ENVIRONMENT.md:103:  - `apps/mobile/babel.config.js` uses `babel-preset-expo` for runtime builds and adds `react-native-css/babel` only when `api.env('test')` is true so Jest can exercise className translation outside Metro.
PROJECT_ENVIRONMENT.md:104:  - `apps/mobile/metro.config.js` wraps Expo Metro with `withNativewind(config, { input: './global.css' })`.
PROJECT_ENVIRONMENT.md:105:  - `apps/mobile/global.css` imports Tailwind theme/preflight/utilities and `nativewind/theme`; semantic colors are defined with `@theme`.
PROJECT_ENVIRONMENT.md:106:  - `apps/mobile/nativewind-env.d.ts` references `react-native-css/types`.
PROJECT_ENVIRONMENT.md:107:  - `apps/mobile/jest.after-env.js` imports `react-native-css/jest` through Jest `setupFilesAfterEnv`.
PROJECT_ENVIRONMENT.md:119:  - `EXPO_PUBLIC_APP_DISPLAY_NAME`: optional in the runtime parser, default is `Mobile App Template`; required explicitly by preview, production, and EAS build config.
PROJECT_ENVIRONMENT.md:120:  - `EXPO_PUBLIC_API_URL`: required URL.
PROJECT_ENVIRONMENT.md:122:  - `EXPO_PUBLIC_APP_SLUG`: required by preview, production, and EAS build config.
PROJECT_ENVIRONMENT.md:123:  - `EXPO_PUBLIC_APP_SCHEME`: required by preview, production, and EAS build config.
PROJECT_ENVIRONMENT.md:124:  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: required.
PROJECT_ENVIRONMENT.md:125:  - `EXPO_PUBLIC_ANDROID_PACKAGE`: required.
PROJECT_ENVIRONMENT.md:127:  - `EAS_PROJECT_ID`: optional UUID.
PROJECT_ENVIRONMENT.md:160:  - `DATABASE_URL`: required URL.
PROJECT_ENVIRONMENT.md:162:  - `API_BEARER_TOKEN`: required secret.
PROJECT_ENVIRONMENT.md:165:- Current Railway QA deployment:
PROJECT_ENVIRONMENT.md:173:  - Railway runtime variables include `DATABASE_URL`, `API_BEARER_TOKEN`, `PORT=3000`, `API_PORT=3000`, `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`, and `RAILWAY_HEALTHCHECK_PATH=/readyz`.
PROJECT_ENVIRONMENT.md:174:  - Do not print or commit Railway secret values. `API_BEARER_TOKEN` was rotated after setup output exposed an earlier generated value.
PROJECT_ENVIRONMENT.md:199:    - use only for generic Expo, React Native, EAS, dev client, SDK upgrade, deployment, native UI, API route, and data fetching guidance.
PROJECT_ENVIRONMENT.md:207:  - `$e2e-test` is the repo QA skill for E2E test planning, tested-instance reset, planned execution, and objective evidence capture across RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks. It records evidence under `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` and does not implement fixes.
PROJECT_ENVIRONMENT.md:208:  - `$qa-railway-workflow` is the repo QA skill for Railway CLI install/login/project/service/database/variable/domain/deploy/status/log/health workflows, redacted Railway evidence, RN Web E2E API URL handoff, and `PROJECT_ENVIRONMENT.md` synchronization. It does not implement app, backend, contract, migration, or mobile UI fixes.
PROJECT_ENVIRONMENT.md:209:  - Product/Planning repo-local Codex adapters use required `po-*` slugs:
PROJECT_ENVIRONMENT.md:215:  - Design repo-local Codex adapters use required `design-*` slugs:
PROJECT_ENVIRONMENT.md:219:    - P0/P1 Product/Planning approvals are scope/evidence approvals for PRD fit, non-goals, evidence readiness, and human-gate routing. They are not Design quality approvals and do not move selected-option ownership out of Design.
PROJECT_ENVIRONMENT.md:246:  - local visual QA/device automation is required for mobile UI/runtime checks when a simulator or device is available.
PROJECT_ENVIRONMENT.md:247:  - it is excluded from required CI gates.
PROJECT_ENVIRONMENT.md:258:  - actual use requires a Google Cloud project with the Stitch MCP service enabled, plus `GOOGLE_CLOUD_PROJECT` or a `gcloud config set project` value.
PROJECT_ENVIRONMENT.md:265:  - authentication: run `codex mcp login expo` when the target Codex session reports Expo MCP is not logged in, then verify with `codex mcp list`; auth display can be session-specific.
PROJECT_ENVIRONMENT.md:275:    - the reviewer JSON envelope contains `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`; `GO` requires no Critical/High/Medium findings and required checks `PASS` or source-backed `NOT_APPLICABLE`, failed required checks map to `NO_GO`, missing required checks map to `BLOCKED`, and human-gate blockers map to `NEEDS_HUMAN`.
PROJECT_ENVIRONMENT.md:289:  - `pnpm run test:runtime`
PROJECT_ENVIRONMENT.md:292:- Runs `pnpm run test:local-harness` when these paths change:
PROJECT_ENVIRONMENT.md:298:  - `PROJECT_ENVIRONMENT.md`
PROJECT_ENVIRONMENT.md:308:- Do not add secrets, customer-specific identifiers, or production API URLs to the repo.

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'pwd && rg -n "NO_GO|PR7|stale|validate-team-doc|test:runtime|PR1|PR2|PR3|PR4|PR5|PR6|Part D|platform|production|Gatekeeper|RN Web|Railway|secret|branch protection|release|machine-readable|work-unit|resolver|pnpm|native|human|ops|GO|NEEDS_HUMAN|BLOCKED" team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
/Users/tw.kim/Documents/AGA/test/new-mobile-app
6:그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
21:   `docs/plans/work-units/sample-role-handoff/`, `.evidence/` 구조.
29:   Node 22/git/yarn/Chromium 존재. pnpm은 **10.33.3이 존재하나 repo SoT pin
30:   `pnpm@9.15.9`(`package.json`의 `packageManager`)와 불일치**하고,
44:| 역할 조직 | 6 LLM 역할 + 비-LLM Gatekeeper 모델, 역할별 SOUL.md 템플릿 | `01-team-composition.md`, `02-role-souls/` |
46:| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
47:| 핸드오프 | pod-isolated 역할 간 durable handoff는 GitHub branch/commit/PR + `docs/plans/work-units/<work-unit-id>/` 전용 | `10-github-artifact-workflow.md` |
48:| 수직 슬라이스 | home counter가 contracts import, NativeWind, Jest, RN Web Playwright, Maestro flow, EAS 프로파일 경로를 증명 | `apps/mobile/src/app/index.tsx`, `apps/mobile/.maestro/home.yml`, `apps/mobile/eas.json` |
51:| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |
57:| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
59:| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
61:| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
62:| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
64:| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 — `secretPatterns` 구현 — 은 수행됨. 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음) | 해당 파일 | 증거 무결성이 규율에만 의존 |
65:| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |
74:GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-LLM 결정적 검사"
85:### PR1 (P0) — Work-unit 상태머신: `status.json`
91:  - `docs/plans/work-units/<work-unit-id>/status.json` (schema `wu-status/v1`)
92:  - `scripts/lib/work-unit-machine.mjs` — 상태 enum/전이표/병렬 그룹 공유 모듈
93:  - `scripts/validate-work-units.mjs` (+ `evals/local-harness/work-units/` fixture:
95:  - `docs/plans/work-units/sample-role-handoff/status.json` 샘플 추가
96:  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
102:  "work_unit": "<work-unit-id>",
111:      "reviewer": { "agent": "po-planning-reviewer", "verdict": "GO",
116:  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
123:  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
125:    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
127:  - validator 규칙: `done`은 산출물 실재 + reviewer envelope `GO` 재검증
133:  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.
135:### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`
137:- **WHY**: G5. reviewer가 `NEEDS_HUMAN`을 낼 수는 있으나 해제 레코드가 없으면 자율
139:  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
140:- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
141:  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
143:- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
150:    아니다. 온라인 시 orchestrator가 `gh api`로 작성자 확인 후 work-unit event에
153:  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.
155:### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill
157:- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
158:  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
161:  - `scripts/work-unit-next.mjs`: `status.json` + 파일시스템 → 다음 액션 JSON 출력.
165:    절차 = pull → resolver 실행 → 자기 역할(`WM_ROLE`) 몫 필터 → 해당 역할 skill 호출 →
167:  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
168:    수정 금지(pending 요청 생성만 허용), resolver가 `blocked`만 반환하면 정지·보고.
169:- **HOW** — resolver 출력 계약(요지): `next_actions[]`(stage, role, action ∈
170:  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
172:  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
176:  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
178:  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
179:  sample work-unit 사본으로 stage 00 dry-run이 로컬에서 headless reviewer까지 완주.
181:### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약
185:  (`09-pod-native-openclaw-skill-plan.md`). 같은 패턴으로 "역할 부트스트랩"을 추가하고,
190:    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
194:    `{ "rn_web_e2e": bool, "native_e2e_local": false, "eas_cloud": <EXPO_TOKEN 존재 여부 status-only> }`.
196:  - pod-native skill 소스 `09-pod-native-openclaw-skills/pod-role-bootstrap/`
200:    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
203:  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
204:    codex-cli-auth-setup 검사 패턴 확장; shell script secret-출력 금지 regex 포함).
206:  `--pod`는 우아하게 skip; validate:team-doc이 skill 소스 누락/secret 출력 시 실패.
208:### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리
214:  job. 빠진 것은 ① robot token 인증의 pod-native 표준화 ② 결과를 `.evidence/`로 끌어오는
217:  - 신규 문서 `14-native-e2e-strategy.md` — 증거 사다리(evidence ladder) 규범:
219:    - L1 `rn-web`: RN Web + Playwright, 모든 UI 작업 필수. pod 내 Chromium으로 실행 가능
220:      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
221:    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
222:      컨테이너/release candidate 접촉 시 필수
223:    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
226:      `validate-work-units.mjs`가 `05-qa-release` 완료 전 `achieved_level >= required_level`
231:  - pod-native skill `09-pod-native-openclaw-skills/eas-robot-auth-setup/`:
233:    링크 확인. 값 출력 절대 금지. token은 `infra/clawpod/secret.example.yaml` 패턴으로 주입.
236:    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
238:  - `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(트리거 → 폴링 → ingest →
242:  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
244:- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
247:  native 검증 완료를 주장하지 않는다.
249:### PR6 (P1) — SoT refresh / drift 자동 검출
258:  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
259:    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
262:    `--online` 모드(PR 게이트 제외): Railway QA API `/livez`·`/readyz` 응답 확인.
267:### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
271:  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
272:    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
275:    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
276:  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
278:    커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
279:    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
280:- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
287:### C-1. 토폴로지 — 역할당 1 pod, 총 6 pod + CI Gatekeeper
294:| `wm-mobile-dev` | Mobile App Dev | agent-mobile **full** | **4 CPU / 8Gi** | Metro bundler + pnpm install + Chromium 동시 부하가 boram 기준(2C/4Gi) 초과 |
295:| `wm-api` | Backend/API Integrator | agent-mobile **lite** | 2 CPU / 4Gi | Hono/Drizzle + Railway 배포 |
303:- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
304:  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
305:  work-unit의 `06-gatekeeper/` 파일은 CI 결과의 *전사*다 — LLM이 pass/fail을 판단하지 않는다.
308:  미정의 역할을 신설하는 것이고, PR3의 resolver가 결정적이므로 조정 "판단"이 필요한 지점은
319:  `05-qa-release/`), 상류/하류 역할, NATS 룸 규약
321:  `/workspace/repo`로 clone-on-demand, 브랜치 규약 `wu/<work-unit-id>/<stage>`,
322:  `docs/plans/work-units/<work-unit-id>/` 스키마 요약, 그리고 핵심 규칙
331:| `wm-qa`만 | `EXPO_TOKEN`(EAS robot, `infra/clawpod/secret.example.yaml` 패턴), Railway 헬스체크용 read 토큰 |
335:**`/workspace/skills`** (pod-native): 전 pod에 `codex-cli-auth-setup` +
336:`pod-role-bootstrap`(PR4); `wm-qa`에 `eas-robot-auth-setup`(PR5).
340:### C-3. 이미지/툴체인 요구 (요지 — 상세는 Part D annex)
344:- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
345:  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
348:  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
350:  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
351:- `lite` 변형(po/arch/api용): base lite + pnpm + gh만
356:  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
358:  신호만: `HANDOFF work-unit=<id> stage=<stage> pr=<url> next=<role>`. 신호 유실은
361:  명문화 — "A2A로 도달한 결정은 work-unit 디렉토리에 기록되어야만 유효". 플랫폼 한도
363:- **Webhook gateway 규칙 3종**(GitHub adapter, ops 설정):
373:   `po-prd-to-execution` + `po-work-unit-planning-and-agent-sprint` → work-unit 생성,
377:4. `wm-api` → `packages/contracts` + `apps/api` 구현 → Railway preview 배포 + smoke
378:5. `wm-mobile-dev` → `apps/mobile` 구현(TDD) → RN Web Playwright 자가 검증 → 코드 PR
379:6. `wm-qa` (PR webhook으로 wake) → in-pod Playwright RN Web 증거 →
381:   `05-qa-release/` 완성
382:7. Gatekeeper(CI) → required check 결정적 판정 → `06-gatekeeper/`에 전사
383:8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단
389:| B1 | pnpm pin mismatch(pod 10.33.3 vs SoT 9.15.9) → frozen-lockfile 설치 신뢰 불가 | pod-role-bootstrap의 corepack pin + preflight mismatch fail (+이미지 핀 정렬) | PR4 + annex |
390:| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
391:| B3 | webhook 규칙 없음 → QA가 PR에 깨어나지 못함 | 규칙 3종 등록 | annex (ops 설정) |
392:| B4 | EXPO_TOKEN/Railway/ADC가 예시로만 존재 | Secret 실주입 런북 | ops |
393:| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
394:| B6 | EAS 트리거·ingest 실행 경로 부재 | PR5 | 이 repo |
395:| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
402:  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
403:  생성(PR3). "실패 게이트의 위험 수용"은 LLM 권한 밖(QA SOUL 금지 조항 준수).
405:  stale 코멘트 → webhook → `wm-po` wake. 결정적 계층(CI)에 두는 이유는 Gatekeeper 철학과
408:  인간 채널로 fan-out. 트리거: production submit, 결제/PII/법무, failed-gate 위험 수용,
413:## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)
418:Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
419:**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
420:ops 요구사항 annex로만 유지한다.
423:   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
432:5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
433:   validator), release environment protection(인간 reviewer), 역할별 bot 계정.
442:`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
447:(1차 xhigh NO_GO → 정정 → 재검토 `...-xhigh-rereview-20260610.md` verdict **GO**).
448:이 GO는 "상세 적용성 보고서가 SoT 기준으로 수용 가능하다"는 의미로 한정되며,
449:구현 승인·PR-ready·live pod readiness·native E2E 완료 승인이 아니다. 적용성 판정 시점에
450:전체 `test:runtime`은 사용자 지시로 skip되었으므로(동시 세션이 해당 영역 수정 중),
451:**PR1 착수 전에 동시 세션 안정화 후 전체 게이트를 재실행·기록(re-baseline)하는 것이
454:- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
455:  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
457:- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
458:  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
459:  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
460:- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
461:  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
462:  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
463:  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.
469:| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
470:| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
471:| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
472:| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
473:| 5 | 나머지 4 pod + webhook 규칙 (B3·B8) | ops |
474:| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
475:| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
478:3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
479:**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
484:합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:
487:- RN Web Playwright 증거(스크린샷 포함) + EAS build ID가 포함된 `eas-evidence` 산출
489:- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)
492:`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.
497:  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
498:- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
500:  아니라 기록되는 human gate로 관리한다.
509:- production submit 자동화 또는 release human gate 약화

hook: PostToolUse
exec
/bin/zsh -lc 'rg -n "NO_GO|PR7|stale|validate-team-doc|test:runtime|PR1|PR2|PR3|PR4|PR5|PR6|Part D|platform|production|Gatekeeper|RN Web|Railway|secret|branch protection|release|machine-readable|work-unit|resolver|pnpm|native|human|ops|GO|NEEDS_HUMAN|BLOCKED" .evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md .evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:10:- First xhigh review: `.evidence/reviews/pod-organization-e2e-applicability-detailed-xhigh-review-20260610.md` (verdict NO_GO)
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:11:- Post-correction xhigh re-review: `.evidence/reviews/pod-organization-e2e-applicability-detailed-xhigh-rereview-20260610.md` (verdict GO, findings: none, residual risks: 2 — envelope verified directly)
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:21:   external-runtime limits, `REPO_OPERATIONS.md` policy ownership, and the human-gate
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:23:2. The pnpm fact correction (pin mismatch: boram pod pnpm `10.33.3` vs repo SoT
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:24:   `pnpm@9.15.9`; canary inferred only) matches the checked-in boram evidence and the
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:26:3. The GO scope limitation is correctly stated: it accepts the applicability report only;
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:27:   it is not implementation approval, PR readiness, live pod readiness, or native E2E
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:30:   records the user-directed `test:runtime` skip and the narrow
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:38:   substantially rewrote `scripts/validate-team-doc.mjs` (working-tree diff at
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:40:   `validate-team-doc.mjs:236-250` for the team-doc secret scan; that implementation now
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:41:   starts near line 81 (`secretPatterns`). This is the same class of stale-reference
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:45:   records the `test:runtime` skip as context. Because PR1's acceptance criteria require
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:46:   `pnpm run test:runtime` green, the skip must become a blocking precondition: after the
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:47:   concurrent runtime-area session stabilizes, run and record the full gate before PR1
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:55:- Repo-internal offline work only (PR1, PR2, PR3, PR4, PR6, PR7, PR5 offline portion),
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:57:- Blocked until human/ops approval: Part D platform work (image build/push, pod creation,
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:58:  ConfigMap/Secret provisioning, bot accounts/tokens, branch protection, release
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:59:  environment protection, webhook/NATS routing), PR5 live native E2E, multi-pod drill.
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:60:- Always forbidden: production release submission automation, weakening human gates,
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:61:  Gatekeeper as LLM/pod/custom agent/SOUL.md owner, RN Web or Railway evidence as native
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:62:  replacement, local validation as external runtime proof, secret/token exposure, direct
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:63:  external platform mutation from this repo workflow.
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:67:- `node scripts/validate-team-doc.mjs` after the G8/E-0 plan-document updates
.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:68:  (result recorded in the session report; full `test:runtime` intentionally not run per
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:21:It is not approval to operate external platform resources, inject secrets, change branch protection,
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:22:execute live cloud validation, or claim native E2E completion.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:25:described as missing pnpm. It is correctly described as a pin mismatch between boram pod pnpm
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:26:`10.33.3` and repo SoT `pnpm@9.15.9`. The remaining pod gaps for cloud CLI, Maestro, adb,
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:30:to skip `test:runtime` because another session is concurrently modifying that area. This does not
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:37:validators, and documentation updates. They must not perform external platform operations or
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:44:- Keep the factual correction that boram pod has pnpm `10.33.3`, while the repo SoT pin is
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:45:  `pnpm@9.15.9`.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:55:- The boram evidence records pnpm `10.33.3`.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:61:- Do not rewrite the gap back to "pnpm missing."
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:64:### 2. PR1: Work-Unit Status Machine
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:68:- Add `docs/plans/work-units/<work-unit-id>/status.json` with a deterministic `wu-status/v1`
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:71:  reviewer envelope presence, handoff links, append-only events, and Gatekeeper invariants.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:72:- Add local fixtures for valid and invalid work-unit states.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:73:- Wire the validator into `test:runtime`, the quality gate workflow, and runtime documentation
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:78:- The plan identifies the lack of machine-readable work-unit state as the core autonomy gap.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:80:- Deterministic status validation matches the non-LLM Gatekeeper model.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:91:- Do not make `status.json` a substitute for human approval.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:93:- Do not claim this proves pod orchestration; it only creates repo-local machine-readable state.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:95:### 3. PR2: Human-Gate Decision Envelope
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:99:- Add a machine-readable human-gate decision schema such as `human-gate/v1`.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:100:- Require fields such as gate id, category, decision, scope, human decider identity, decision
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:102:- Enforce anti-self-approval: role names and agent names must not be valid human approvers.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:103:- Require an approved decision file before a `blocked-human` stage can resume.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:107:- Current reviewer verdicts can say `NEEDS_HUMAN`, but the repo lacks a deterministic way to
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:108:  record and validate release from that blocked state.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:109:- A machine-readable human decision record preserves the human gate while allowing deterministic
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:115:- Failed-gate risk acceptance must remain a human decision.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:116:- Release approval must remain blocking when `human-approval.json` is absent.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:123:- Do not weaken the release human gate for convenience.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:125:### 4. PR3: Deterministic Next-Action Resolver And `wm-orchestrate`
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:129:- Add a pure resolver that reads `status.json` plus the filesystem and emits `next_actions[]`
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:132:- Require the resolver to stop when the only next state is blocked by a missing human decision.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:139:- A deterministic resolver preserves Gatekeeper philosophy and prevents ad hoc LLM routing.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:144:- It must not modify reviewer envelopes or human approval records except to create pending
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:152:- Do not treat resolver dry-runs as proof that GitHub webhook routing works.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:154:### 5. PR4: Repo-Side Pod Bootstrap Contract
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:159:- Add pnpm pin validation: repo expects `pnpm@9.15.9`; mismatch must fail.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:162:- Add a pod-native skill source for role bootstrap under the managed team-doc OpenClaw skill
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:164:- Add tests/fixtures for Linux pod preflight behavior and secret-output prevention.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:168:- The pod has pnpm, but at the wrong version for this repo.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:170:- Repo-side scripts and pod-native skill source can be authored and tested offline.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:174:- Output must be status-only for secret-derived capabilities.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:183:- Do not read or print secret-bearing config contents.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:186:### 6. PR5 Offline Portion: Native E2E Strategy And Evidence Ingest Design
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:190:- Add the native E2E strategy document that defines the evidence ladder:
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:191:  L0 Jest, L1 RN Web Playwright, L2 cloud Maestro/native build evidence, L3 human device/mobile-mcp.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:196:- Add schema and validator rules that prevent `05-qa-release` completion when required evidence
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:197:  level is unmet unless a valid human waiver exists.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:198:- Add guarded pod-native auth setup source files as documentation and offline scripts, with explicit
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:206:- RN Web evidence is useful as L1 but is not native proof.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:212:- No native completion claim.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:217:- Do not run live cloud validation before human/ops approval.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:218:- Do not treat RN Web as replacement for native module, permission, navigation container, or release
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:222:### 7. PR6: SoT Drift Detection
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:240:- A warning-only staleness check must not be mislabeled as a blocking proof of freshness.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:248:### 8. PR7: Hardening For Stitch, mobile-mcp Pin Drift, And Evidence Hygiene
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:256:  and secret-pattern scanning.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:257:- Add planted-secret fixtures to prove the scanner fails safely.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:296:These items are valid requirements, but they must remain blocked until explicit human/ops approval
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:304:- Include pnpm pin alignment, cloud CLI support, Maestro cloud-upload support, watchman, and warm
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:305:  pnpm store layers as applicable.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:310:- Human/ops approval for image build/push.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:315:- Do not build, push, or mutate platform images from this repo workflow.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:324:- Inject only the minimum required secrets per role.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:328:- Human/ops approval for pod creation, cost, resource sizing, and identity separation.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:334:- Do not inject or print secrets.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:335:- Do not read full secret-bearing config contents.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:344:- Configure branch protection and required checks for quality gate and new validators.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:345:- Configure release environment protection with human reviewer requirements.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:349:- Human/ops approval and repository administrator action.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:355:- Do not claim branch protection is active from local validation alone.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:367:- Platform/ops approval because webhook gateway configuration is external runtime state.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:375:### 5. PR5 Live Native E2E Validation
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:379:- Run the live native validation path only after credentials, project ids, and GitHub integration
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:386:- Human/ops approval for credential injection and live cloud usage.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:392:- Do not claim native E2E completion.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:399:- Run the final drill only after repo validators, platform pods, image, secrets, webhook routing,
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:400:  branch protection, and live evidence ingestion path are all ready.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:402:  Gatekeeper, and human release block.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:406:- Human/ops approval for 6-pod creation, cost, live routing, and external runtime use.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:416:human-gate policy, or the plan's corrected scope.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:422:- Automating final production release submission.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:423:- Allowing a pod, LLM, script, or Gatekeeper check to bypass human release approval.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:427:- The plan's explicit success condition is that release remains blocked without
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:428:  `human-approval.json`.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:429:- Human release gate weakening contradicts the repo gate model.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:435:- Treating a missing human approval as non-blocking.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:437:- Accepting failed-gate risk without human decision evidence.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:444:### 3. Gatekeeper As LLM, Pod, Custom Agent, Or SOUL.md Owner
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:448:- Creating a Gatekeeper LLM pod.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:449:- Giving Gatekeeper a SOUL.md as an operating role.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:454:- Gatekeeper is a deterministic required-check concept.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:457:### 4. RN Web Or Railway Evidence As Native Replacement
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:461:- Treating RN Web Playwright evidence as native E2E evidence.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:462:- Treating Railway/API smoke evidence as mobile native validation.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:466:- RN Web does not validate native modules, device permissions, native navigation/container behavior,
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:467:  native lifecycle, app signing, or store/release candidate behavior.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:468:- Railway evidence validates backend/API reachability, not native mobile runtime.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:475:- Claiming local validation proves GitHub branch protection, webhook gateway behavior, EAS live
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:476:  behavior, or external platform state.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:489:- Expanding status-only checks into secret dumps.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:499:- Modifying external platform/runtime repositories from this repo.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:500:- Using this repo task to directly mutate k8s, image registry, webhook gateway, or external release
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:505:- The plan's Part D is an annex for ops requirements, not an execution authorization.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:509:`pnpm run test:runtime` is skipped for this applicability report because the user stated that
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:516:  the prior archive-term drift, not as a substitute for full `test:runtime`.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:520:- Full `pnpm run test:runtime` status.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:522:- External platform or live pod readiness.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:527:- The current workspace must not be reported as runtime-gate green unless full `test:runtime` is
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:536:`GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`.
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:540:- Repo-internal offline plan correction and PR1/PR2/PR3/PR4/PR6/PR7 plus PR5 offline work,
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:545:- Part D platform work, live native E2E validation, credential issuance/injection, branch protection,
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:550:- Production release automation, human gate weakening, Gatekeeper LLM/pod modeling, RN Web as native
.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:551:  replacement, local validation as external proof, secret exposure, and direct external platform
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:14:You are reviewer(xhigh) for a review-only task in /Users/tw.kim/Documents/AGA/test/new-mobile-app. Do not edit files. Do not inspect or print secrets. Do not delegate.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:16:User asks whether the latest updates are acceptable and what scope can proceed. Full test:runtime must be skipped per user instruction because another session is modifying that area. Main-agent narrow validation just run: node scripts/validate-team-doc.mjs exited 0 with "Validated current team-doc managed docs."
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:29:1. G8 row in 13 plan now uses behavior-based citation and no line number for validate-team-doc secretPatterns.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:30:2. E-0 records applicability GO scope limitation and says PR1 requires full gate re-baseline after concurrent session stabilizes.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:33:5. However, 13 plan still has another stale-looking line citation at PR7: line 279 says secret pattern scan uses `validate-team-doc.mjs:236-243`; current script has secretPatterns around line 81.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:36:- Are latest updates acceptable as-is, or does the remaining PR7 stale line citation block acceptance?
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:37:- What scope can proceed now, what is blocked until re-baseline, what needs human/ops approval, and what is forbidden?
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:38:Return Korean findings first and one machine-readable JSON envelope with verdict GO, NO_GO, NEEDS_HUMAN, or BLOCKED.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:43:검토 전용으로 진행하겠습니다. 먼저 지정된 SoT 문서와 증거 파일에서 관련 조항, 결론, stale citation 위치만 읽고, 파일 수정이나 재귀 위임은 하지 않겠습니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:49:/bin/zsh -lc 'rg -n "secretPatterns|validate-team-doc" scripts/validate-team-doc.mjs' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:51:/bin/zsh -lc 'rg -n "PR7|PR1|G8|E-0|validate-team-doc|secretPatterns|applicability|GO|NO_GO|NEEDS_HUMAN|BLOCKED|re-baseline|rebaseline|approval|forbidden|forbid|OrbStack|mobile-mcp|test:runtime|local harness|human|ops|scope" team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md .evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md /Users/tw.kim/.claude/plans/luminous-snacking-moler.md AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md team-doc/mobile-app-dev-team/06-gates-and-evidence.md .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:53:81:const secretPatterns = [
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:54:92:  for (const pattern of secretPatterns) {
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:57:team-doc/mobile-app-dev-team/06-gates-and-evidence.md:8:| Codex runtime artifact | `pnpm run test:runtime` |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:58:team-doc/mobile-app-dev-team/06-gates-and-evidence.md:9:| Runtime path/local harness | `pnpm run test:local-harness` |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:61:team-doc/mobile-app-dev-team/06-gates-and-evidence.md:14:| Production submit | Human approval record plus release evidence |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:62:team-doc/mobile-app-dev-team/06-gates-and-evidence.md:20:- It cannot replace human approval or accept failed-gate risk.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:63:team-doc/mobile-app-dev-team/06-gates-and-evidence.md:37:- Canonical evidence remains in workflow-owned paths such as `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`, mobile-mcp records, Railway evidence, EAS evidence, or human approval records.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:65:team-doc/mobile-app-dev-team/06-gates-and-evidence.md:51:- Full production release approval.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:66:team-doc/mobile-app-dev-team/06-gates-and-evidence.md:55:Stop for recorded human decision when work involves:
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:68:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:1:# 검토 계획: applicability 판정문(GO) 교차 검증 결과 반영
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:71:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:10:- 1차 xhigh: `...-xhigh-review-20260610.md` (verdict NO_GO — stale gate status, CONDITIONAL_GO 오인 위험 지적)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:72:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:11:- 정정 후 xhigh 재검토: `...-xhigh-rereview-20260610.md` (verdict **GO**, findings 0건, residual risk 2건 — envelope 직접 확인)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:74:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:17:mismatch 정정이 boram 증거(`orbstack-boram-linux-sot-check.md:47`)와 일치하며, GO의
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:75:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:22:1. **(실측 확인됨) 13번 계획서의 stale 라인 인용**: 동시 세션이 `validate-team-doc.mjs`를
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:76:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:23:   대규모 수정(+536/-163)하여, 13번 문서 G8이 인용하는 `validate-team-doc.mjs:236-250`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:77:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:25:   1차 xhigh가 NO_GO 사유로 삼았던 것과 같은 종류의 stale reference가 13번 문서에 재발생.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:78:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:26:2. **게이트 re-baseline이 구현 착수의 명시적 전제 조건**: 판정문은 test:runtime skip을
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:79:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:27:   기록만 했으나, PR1 수용 기준이 test:runtime green을 요구하므로 "동시 세션 안정화 →
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:80:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:28:   전체 게이트 재실행·기록"을 PR1 착수 전 선행 단계로 격상해야 함.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:81:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:37:   G8의 `validate-team-doc.mjs:236-250` → 라인 번호 제거, "validate-team-doc.mjs의
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:82:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:38:   team-doc 한정 secret 패턴 스캔(현재 구현 기준 `secretPatterns`)" 동작 기준 표현으로 교체
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:84:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:43:3. **좁은 검증만 실행**: `node scripts/validate-team-doc.mjs` 1회(13번 문서 수정 정합 확인).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:85:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:44:   전체 `test:runtime`은 사용자 skip 지시(동시 세션 수정 중) 유지 — 실행하지 않고
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:86:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:46:4. **보고**: 판정 수용 + 보완점 3건 + 다음 단계(게이트 re-baseline 후 PR1 착수 가능)를
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:87:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:51:- PR1~PR7 구현 착수(별도 승인 대기), 전체 test:runtime 실행(사용자 skip 지시 유지),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:88:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:52:  Part D ops/플랫폼 작업, 토큰/라이브 EAS, `validate-team-doc.mjs` 등 동시 세션 작업
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:89:AGENTS.md:37:- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:93:AGENTS.md:72:pnpm run test:runtime
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:99:AGENTS.md:107:2. Codex runtime artifacts are intact: `pnpm run test:runtime`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:100:AGENTS.md:108:3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:104:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:10:- First xhigh review: `.evidence/reviews/pod-organization-e2e-applicability-detailed-xhigh-review-20260610.md` (verdict NO_GO)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:105:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:11:- Post-correction xhigh re-review: `.evidence/reviews/pod-organization-e2e-applicability-detailed-xhigh-rereview-20260610.md` (verdict GO, findings: none, residual risks: 2 — envelope verified directly)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:108:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:21:   external-runtime limits, `REPO_OPERATIONS.md` policy ownership, and the human-gate
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:109:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:26:3. The GO scope limitation is correctly stated: it accepts the applicability report only;
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:110:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:27:   it is not implementation approval, PR readiness, live pod readiness, or native E2E
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:111:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:30:   records the user-directed `test:runtime` skip and the narrow
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:112:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:38:   substantially rewrote `scripts/validate-team-doc.mjs` (working-tree diff at
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:114:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:40:   `validate-team-doc.mjs:236-250` for the team-doc secret scan; that implementation now
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:115:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:41:   starts near line 81 (`secretPatterns`). This is the same class of stale-reference
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:118:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:45:   records the `test:runtime` skip as context. Because PR1's acceptance criteria require
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:119:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:46:   `pnpm run test:runtime` green, the skip must become a blocking precondition: after the
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:120:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:47:   concurrent runtime-area session stabilizes, run and record the full gate before PR1
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:123:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:55:- Repo-internal offline work only (PR1, PR2, PR3, PR4, PR6, PR7, PR5 offline portion),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:125:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:57:- Blocked until human/ops approval: Part D platform work (image build/push, pod creation,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:126:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:60:- Always forbidden: production release submission automation, weakening human gates,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:127:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:67:- `node scripts/validate-team-doc.mjs` after the G8/E-0 plan-document updates
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:128:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:68:  (result recorded in the session report; full `test:runtime` intentionally not run per
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:130:REPO_OPERATIONS.md:107:`pnpm run test:runtime` must compose those active current team/runtime gate
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:133:REPO_OPERATIONS.md:137:- `scripts/validate-team-doc.mjs` validates current managed team docs,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:134:REPO_OPERATIONS.md:142:- `scripts/validate-team-doc-archive.mjs` validates archive/reference integrity
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:135:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:6:그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:139:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:46:| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:140:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:57:| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:141:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:59:| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:142:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:61:| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:143:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:64:| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 — `secretPatterns` 구현 — 은 수행됨. 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음) | 해당 파일 | 증거 무결성이 규율에만 의존 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:144:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:85:### PR1 (P0) — Work-unit 상태머신: `status.json`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:145:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:96:  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:146:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:111:      "reviewer": { "agent": "po-planning-reviewer", "verdict": "GO",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:147:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:116:  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:148:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:123:  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:149:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:125:    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:150:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:127:  - validator 규칙: `done`은 산출물 실재 + reviewer envelope `GO` 재검증
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:151:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:133:  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:152:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:135:### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:153:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:137:- **WHY**: G5. reviewer가 `NEEDS_HUMAN`을 낼 수는 있으나 해제 레코드가 없으면 자율
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:154:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:139:  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:155:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:140:- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:156:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:141:  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:157:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:143:- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:160:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:153:  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:161:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:157:- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:162:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:167:  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:163:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:170:  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:164:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:172:  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:165:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:176:  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:166:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:178:  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:167:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:181:### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:168:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:203:  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:169:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:223:    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:170:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:244:- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:171:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:258:  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:172:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:267:### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:174:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:271:  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:175:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:272:    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:177:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:276:  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:178:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279:    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:179:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:304:  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:180:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:356:  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:181:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:363:- **Webhook gateway 규칙 3종**(GitHub adapter, ops 설정):
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:182:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:383:8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:183:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:390:| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:184:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:391:| B3 | webhook 규칙 없음 → QA가 PR에 깨어나지 못함 | 규칙 3종 등록 | annex (ops 설정) |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:185:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:392:| B4 | EXPO_TOKEN/Railway/ADC가 예시로만 존재 | Secret 실주입 런북 | ops |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:186:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:393:| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:187:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:395:| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:188:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:402:  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:190:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:419:**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:191:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:420:ops 요구사항 annex로만 유지한다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:193:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:432:5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:196:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:442:`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:198:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:447:(1차 xhigh NO_GO → 정정 → 재검토 `...-xhigh-rereview-20260610.md` verdict **GO**).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:199:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:448:이 GO는 "상세 적용성 보고서가 SoT 기준으로 수용 가능하다"는 의미로 한정되며,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:200:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:450:전체 `test:runtime`은 사용자 지시로 skip되었으므로(동시 세션이 해당 영역 수정 중),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:201:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:451:**PR1 착수 전에 동시 세션 안정화 후 전체 게이트를 재실행·기록(re-baseline)하는 것이
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:202:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:454:- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:203:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:455:  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:204:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:457:- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:205:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:460:- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:206:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:463:  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:207:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:469:| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:208:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:471:| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:209:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:472:| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:210:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:473:| 5 | 나머지 4 pod + webhook 규칙 (B3·B8) | ops |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:211:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:474:| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:212:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:475:| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:213:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:478:3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:214:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:479:**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:215:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:484:합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:216:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:489:- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:217:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:492:`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:218:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:497:  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:219:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:498:- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:220:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:500:  아니라 기록되는 human gate로 관리한다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:222:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:509:- production submit 자동화 또는 release human gate 약화
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:223:PROJECT_ENVIRONMENT.md:13:  - `pnpm run test:runtime`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:225:PROJECT_ENVIRONMENT.md:80:  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:226:PROJECT_ENVIRONMENT.md:207:  - `$e2e-test` is the repo QA skill for E2E test planning, tested-instance reset, planned execution, and objective evidence capture across RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks. It records evidence under `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` and does not implement fixes.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:228:PROJECT_ENVIRONMENT.md:219:    - P0/P1 Product/Planning approvals are scope/evidence approvals for PRD fit, non-goals, evidence readiness, and human-gate routing. They are not Design quality approvals and do not move selected-option ownership out of Design.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:233:PROJECT_ENVIRONMENT.md:258:  - actual use requires a Google Cloud project with the Stitch MCP service enabled, plus `GOOGLE_CLOUD_PROJECT` or a `gcloud config set project` value.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:236:PROJECT_ENVIRONMENT.md:275:    - the reviewer JSON envelope contains `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`; `GO` requires no Critical/High/Medium findings and required checks `PASS` or source-backed `NOT_APPLICABLE`, failed required checks map to `NO_GO`, missing required checks map to `BLOCKED`, and human-gate blockers map to `NEEDS_HUMAN`.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:237:PROJECT_ENVIRONMENT.md:289:  - `pnpm run test:runtime`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:253: M scripts/validate-team-doc.mjs
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:270: D "team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-\354\241\260\354\247\201-1373700097/01-4-skills-1373667362/mobile-qa-release-1373667404.md"
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:293: D "team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-\354\241\260\354\247\201-1373700097/01-5-soul-md-\355\205\234\355\224\214\353\246\277-1373700138/soul-md-product-planning-1373798422/mobile-work-unit-planning-and-agent-sprint-1374650456.md"
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:296: D "team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-\354\241\260\354\247\201-1373700097/01-5-soul-md-\355\205\234\355\224\214\353\246\277-1373700138/soul-md-qa-release-1373700201.md"
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:297: D "team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-\354\241\260\354\247\201-1373700097/01-5-soul-md-\355\205\234\355\224\214\353\246\277-1373700138/soul-md-qa-release-1373700201/qa-release-codex-cli-\354\213\244\353\254\264-\354\247\200\354\271\250-1374453910.md"
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:313: D "team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-\354\241\260\354\247\201-1373700097/01-9-\352\262\200\354\246\235-\352\267\274\352\261\260-\352\260\220\354\202\254-\352\270\260\353\241\235-1373667446/2026-06-07-stage-3-role-qa-release-1374421058.md"
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:337: D team-doc/10-structured/02-workflows/case-g-preview-release.md
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:338: D team-doc/10-structured/02-workflows/case-h-production-submit.md
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:420:?? scripts/validate-team-doc-archive.mjs
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:428:현재 확인된 핵심은 G8과 E-0 보정은 SoT 방향과 맞지만, PR7 구현 항목에 `validate-team-doc.mjs:236-243` 라인 인용이 아직 남아 있다는 점입니다. 이 인용은 현재 스크립트의 `secretPatterns` 위치와 맞지 않아, “as-is 수용” 판단에는 직접 영향을 줍니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:442:   442	`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:447:   447	(1차 xhigh NO_GO → 정정 → 재검토 `...-xhigh-rereview-20260610.md` verdict **GO**).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:448:   448	이 GO는 "상세 적용성 보고서가 SoT 기준으로 수용 가능하다"는 의미로 한정되며,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:449:   449	구현 승인·PR-ready·live pod readiness·native E2E 완료 승인이 아니다. 적용성 판정 시점에
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:450:   450	전체 `test:runtime`은 사용자 지시로 skip되었으므로(동시 세션이 해당 영역 수정 중),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:451:   451	**PR1 착수 전에 동시 세션 안정화 후 전체 게이트를 재실행·기록(re-baseline)하는 것이
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:454:   454	- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:455:   455	  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:457:   457	- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:458:   458	  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:459:   459	  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:460:   460	- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:461:   461	  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:462:   462	  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:463:   463	  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:474:    57	| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:476:    59	| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:478:    61	| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:479:    62	| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:481:    64	| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 — `secretPatterns` 구현 — 은 수행됨. 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음) | 해당 파일 | 증거 무결성이 규율에만 의존 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:482:    65	| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:488:   267	### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:492:   271	  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:493:   272	    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:496:   275	    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:497:   276	  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:499:   278	    커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:500:   279	    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:501:   280	- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:517:    21	   external-runtime limits, `REPO_OPERATIONS.md` policy ownership, and the human-gate
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:519:    23	2. The pnpm fact correction (pin mismatch: boram pod pnpm `10.33.3` vs repo SoT
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:520:    24	   `pnpm@9.15.9`; canary inferred only) matches the checked-in boram evidence and the
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:522:    26	3. The GO scope limitation is correctly stated: it accepts the applicability report only;
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:523:    27	   it is not implementation approval, PR readiness, live pod readiness, or native E2E
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:526:    30	   records the user-directed `test:runtime` skip and the narrow
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:534:    38	   substantially rewrote `scripts/validate-team-doc.mjs` (working-tree diff at
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:536:    40	   `validate-team-doc.mjs:236-250` for the team-doc secret scan; that implementation now
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:537:    41	   starts near line 81 (`secretPatterns`). This is the same class of stale-reference
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:541:    45	   records the `test:runtime` skip as context. Because PR1's acceptance criteria require
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:542:    46	   `pnpm run test:runtime` green, the skip must become a blocking precondition: after the
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:543:    47	   concurrent runtime-area session stabilizes, run and record the full gate before PR1
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:551:    55	- Repo-internal offline work only (PR1, PR2, PR3, PR4, PR6, PR7, PR5 offline portion),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:553:    57	- Blocked until human/ops approval: Part D platform work (image build/push, pod creation,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:554:    58	  ConfigMap/Secret provisioning, bot accounts/tokens, branch protection, release
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:555:    59	  environment protection, webhook/NATS routing), PR5 live native E2E, multi-pod drill.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:556:    60	- Always forbidden: production release submission automation, weakening human gates,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:557:    61	  Gatekeeper as LLM/pod/custom agent/SOUL.md owner, RN Web or Railway evidence as native
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:558:    62	  replacement, local validation as external runtime proof, secret/token exposure, direct
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:559:    63	  external platform mutation from this repo workflow.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:563:    67	- `node scripts/validate-team-doc.mjs` after the G8/E-0 plan-document updates
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:564:    68	  (result recorded in the session report; full `test:runtime` intentionally not run per
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:570:이어지는 확인은 범위 분류입니다. SoT 쪽에서는 런타임 게이트, human gate, mobile-mcp/네이티브 QA, 외부 플랫폼 증거 한계를 대조하고 있습니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:592:    80	  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:597:    37	- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:604:    44	- Before a mobile environment change is considered done, verify mobile lint/test, `expo install --check`, native run smoke on iOS/Android when available, and Maestro smoke where available.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:623:     7	| Workspace code | `pnpm turbo run lint test` |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:624:     8	| Codex runtime artifact | `pnpm run test:runtime` |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:625:     9	| Runtime path/local harness | `pnpm run test:local-harness` |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:628:    12	| RN Web E2E | Playwright command output and `.evidence/e2e-test/...` artifacts |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:630:    14	| Production submit | Human approval record plus release evidence |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:632:    16	## Release Gatekeeper (System)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:634:    18	- Release Gatekeeper (System) is the display title for the non-LLM deterministic Gatekeeper.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:636:    20	- It cannot replace human approval or accept failed-gate risk.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:650:    34	- Pod-isolated role agents must use `docs/plans/work-units/<work-unit-id>/` as the committed durable GitHub handoff root.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:653:    37	- Canonical evidence remains in workflow-owned paths such as `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`, mobile-mcp records, Railway evidence, EAS evidence, or human approval records.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:656:    40	## Railway Boundary
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:658:    42	`qa-railway-workflow` can prove Railway CLI setup, service/database/domain/deploy status, health endpoints, and RN Web E2E against a deployed API URL.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:665:    49	- Maestro native automation.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:667:    51	- Full production release approval.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:671:    55	Stop for recorded human decision when work involves:
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:689:   106	1. Workspace lint and tests pass: `pnpm turbo run lint test`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:690:   107	2. Codex runtime artifacts are intact: `pnpm run test:runtime`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:691:   108	3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:692:   109	4. For mobile environment/runtime changes, verify `pnpm --filter mobile exec expo install --check`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`, `pnpm --filter mobile run doctor`, and `codex mcp list`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:717:    47	pnpm 10.33.3
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:742:    72	- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:751:    81	- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:777:   258	  - actual use requires a Google Cloud project with the Stitch MCP service enabled, plus `GOOGLE_CLOUD_PROJECT` or a `gcloud config set project` value.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:792:   273	    - optional machine-readable reviewer verdict validation: `node scripts/codex-headless-review.mjs --json-envelope --agent <verdict-reviewer> --prompt <text-or-file> --out <path>`.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:794:   275	    - the reviewer JSON envelope contains `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`; `GO` requires no Critical/High/Medium findings and required checks `PASS` or source-backed `NOT_APPLICABLE`, failed required checks map to `NO_GO`, missing required checks map to `BLOCKED`, and human-gate blockers map to `NEEDS_HUMAN`.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:808:   289	  - `pnpm run test:runtime`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:809:   290	  - `pnpm turbo run lint test`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:817:   101	pnpm run validate
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:818:   102	pnpm run validate:repo-operations
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:819:   103	pnpm run validate:team-doc
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:820:   104	pnpm run test:hooks
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:823:   107	`pnpm run test:runtime` must compose those active current team/runtime gate
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:830:   114	pnpm run validate:team-doc-archive
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:839:   123	Runtime path or harness changes must also run `pnpm run test:local-harness`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:844:   128	GitHub branch protection, EAS production submit, or external platform state.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:853:   137	- `scripts/validate-team-doc.mjs` validates current managed team docs,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:854:   138	  role/process documents, active repo-local skill and agent contracts, pod-native
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:858:   142	- `scripts/validate-team-doc-archive.mjs` validates archive/reference integrity
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:876:    22	1. **(실측 확인됨) 13번 계획서의 stale 라인 인용**: 동시 세션이 `validate-team-doc.mjs`를
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:877:    23	   대규모 수정(+536/-163)하여, 13번 문서 G8이 인용하는 `validate-team-doc.mjs:236-250`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:878:    24	   (team-doc secret 스캔)이 현재 **81행**으로 이동, CTO 규칙도 1114→**966행**으로 이동.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:879:    25	   1차 xhigh가 NO_GO 사유로 삼았던 것과 같은 종류의 stale reference가 13번 문서에 재발생.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:880:    26	2. **게이트 re-baseline이 구현 착수의 명시적 전제 조건**: 판정문은 test:runtime skip을
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:881:    27	   기록만 했으나, PR1 수용 기준이 test:runtime green을 요구하므로 "동시 세션 안정화 →
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:882:    28	   전체 게이트 재실행·기록"을 PR1 착수 전 선행 단계로 격상해야 함.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:890:    36	1. **13번 계획서 stale 인용 1건 정정**: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:891:    37	   G8의 `validate-team-doc.mjs:236-250` → 라인 번호 제거, "validate-team-doc.mjs의
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:892:    38	   team-doc 한정 secret 패턴 스캔(현재 구현 기준 `secretPatterns`)" 동작 기준 표현으로 교체
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:897:    43	3. **좁은 검증만 실행**: `node scripts/validate-team-doc.mjs` 1회(13번 문서 수정 정합 확인).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:898:    44	   전체 `test:runtime`은 사용자 skip 지시(동시 세션 수정 중) 유지 — 실행하지 않고
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:900:    46	4. **보고**: 판정 수용 + 보완점 3건 + 다음 단계(게이트 re-baseline 후 PR1 착수 가능)를
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:905:    51	- PR1~PR7 구현 착수(별도 승인 대기), 전체 test:runtime 실행(사용자 skip 지시 유지),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:906:    52	  Part D ops/플랫폼 작업, 토큰/라이브 EAS, `validate-team-doc.mjs` 등 동시 세션 작업
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:912:한 가지 구분이 필요합니다. 교차검증 증거의 “G8 stale 인용 수정” 기록은 사실이지만, 활성 계획서의 PR7 항목에는 같은 스크립트 라인 번호 인용이 별도로 남아 있어 “모든 stale reference가 해소됨”으로 볼 수는 없습니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:920:/bin/zsh -lc "rg -n \"validate-team-doc\\.mjs:[0-9]|236-243|236-250|secretPatterns\" scripts/validate-team-doc.mjs" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:922:/bin/zsh -lc 'rg -n "re-baseline|test:runtime|PR1|PR7|즉시 실행 가능|human/ops|항상 금지|forbidden|Blocked|blocked|승인" team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md .evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md /Users/tw.kim/.claude/plans/luminous-snacking-moler.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:924:81:const secretPatterns = [
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:925:92:  for (const pattern of secretPatterns) {
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:928:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:18:효력 범위 한정(구현 승인·PR-ready·live readiness·native 완료 아님)도 정확하다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:929:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:26:2. **게이트 re-baseline이 구현 착수의 명시적 전제 조건**: 판정문은 test:runtime skip을
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:930:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:27:   기록만 했으나, PR1 수용 기준이 test:runtime green을 요구하므로 "동시 세션 안정화 →
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:931:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:28:   전체 게이트 재실행·기록"을 PR1 착수 전 선행 단계로 격상해야 함.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:933:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:44:   전체 `test:runtime`은 사용자 skip 지시(동시 세션 수정 중) 유지 — 실행하지 않고
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:934:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:46:4. **보고**: 판정 수용 + 보완점 3건 + 다음 단계(게이트 re-baseline 후 PR1 착수 가능)를
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:935:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:51:- PR1~PR7 구현 착수(별도 승인 대기), 전체 test:runtime 실행(사용자 skip 지시 유지),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:937:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:30:   records the user-directed `test:runtime` skip and the narrow
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:939:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:45:   records the `test:runtime` skip as context. Because PR1's acceptance criteria require
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:940:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:46:   `pnpm run test:runtime` green, the skip must become a blocking precondition: after the
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:941:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:47:   concurrent runtime-area session stabilizes, run and record the full gate before PR1
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:943:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:55:- Repo-internal offline work only (PR1, PR2, PR3, PR4, PR6, PR7, PR5 offline portion),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:945:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:57:- Blocked until human/ops approval: Part D platform work (image build/push, pod creation,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:946:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:60:- Always forbidden: production release submission automation, weakening human gates,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:947:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:68:  (result recorded in the session report; full `test:runtime` intentionally not run per
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:948:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:46:| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:949:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:61:| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:950:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:85:### PR1 (P0) — Work-unit 상태머신: `status.json`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:951:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:96:  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:952:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:123:  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:953:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:125:    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:954:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:133:  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:956:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:139:  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:957:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:141:  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:959:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:153:  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:960:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:157:- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:961:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:168:    수정 금지(pending 요청 생성만 허용), resolver가 `blocked`만 반환하면 정지·보고.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:962:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:172:  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:963:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:181:### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:964:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:244:- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:967:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:258:  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:968:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:267:### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:969:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:276:  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:970:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:304:  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:972:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:356:  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:973:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:383:8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:974:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:393:| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:975:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:402:  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:976:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:419:**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:977:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:432:5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:978:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:449:구현 승인·PR-ready·live pod readiness·native E2E 완료 승인이 아니다. 적용성 판정 시점에
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:979:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:450:전체 `test:runtime`은 사용자 지시로 skip되었으므로(동시 세션이 해당 영역 수정 중),
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:980:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:451:**PR1 착수 전에 동시 세션 안정화 후 전체 게이트를 재실행·기록(re-baseline)하는 것이
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:981:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:454:- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:982:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:455:  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:983:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:457:- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:984:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:460:- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:985:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:469:| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:986:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:475:| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:987:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:479:**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:989:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:497:  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:995:/bin/zsh -lc "rg -n \"validate-team-doc\\.mjs:[0-9]|236-243|236-250|secretPatterns\" team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md .evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md /Users/tw.kim/.claude/plans/luminous-snacking-moler.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:997:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:40:   `validate-team-doc.mjs:236-250` for the team-doc secret scan; that implementation now
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:998:.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md:41:   starts near line 81 (`secretPatterns`). This is the same class of stale-reference
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:999:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:23:   대규모 수정(+536/-163)하여, 13번 문서 G8이 인용하는 `validate-team-doc.mjs:236-250`
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1000:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:37:   G8의 `validate-team-doc.mjs:236-250` → 라인 번호 제거, "validate-team-doc.mjs의
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1001:/Users/tw.kim/.claude/plans/luminous-snacking-moler.md:38:   team-doc 한정 secret 패턴 스캔(현재 구현 기준 `secretPatterns`)" 동작 기준 표현으로 교체
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1002:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:64:| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 — `secretPatterns` 구현 — 은 수행됨. 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음) | 해당 파일 | 증거 무결성이 규율에만 의존 |
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1003:team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279:    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1010:범위 분류상으로는 “문서 fact 정정”만 즉시 가능하고, PR1 구현 착수는 E-0 자체가 re-baseline을 선행 조건으로 올렸습니다. 따라서 PR7 stale citation을 고친 뒤에도 PR1~ 구현은 전체 게이트 재실행·기록 전에는 진행 대상으로 보지 않는 것이 맞습니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1024:   242	  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1026:   244	- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1029:   247	  native 검증 완료를 주장하지 않는다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1034:   418	Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1035:   419	**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1036:   420	ops 요구사항 annex로만 유지한다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1039:   423	   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1048:   432	5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1049:   433	   validator), release environment protection(인간 reviewer), 역할별 bot 계정.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1061:   509	- production submit 자동화 또는 release human gate 약화
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1070:- **Medium / acceptance blocker**: 최신 업데이트는 as-is 수용 불가입니다. [13-pod-organization-e2e-improvement-plan.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279) PR7에 `validate-team-doc.mjs:236-243` stale line citation이 남아 있습니다. 현재 `secretPatterns`는 [validate-team-doc.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc.mjs:81) 기준으로 이동했고, G8만 behavior-based citation으로 수정되어 있습니다. 이전 xhigh에서 같은 종류의 stale reference를 blocking으로 본 만큼, 이 잔여 PR7 인용도 acceptance를 막습니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1073:- 지금 진행 가능: PR7 stale citation 문서 정정, 이후 `node scripts/validate-team-doc.mjs` 좁은 검증.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1074:- re-baseline 전 차단: PR1~PR7 구현 착수, PR5 offline 구현 착수. E-0의 PR1 전제대로 동시 세션 안정화 후 전체 `pnpm run test:runtime` 재실행·기록이 먼저 필요합니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1075:- human/ops 승인 필요: Part D 플랫폼 작업, image build/push, pod 생성, webhook routing, Secret/token 주입, branch protection, release environment protection, PR5 live EAS/native 실증, multi-pod drill.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1076:- 항상 금지: production submit 자동화, release human gate 약화, Gatekeeper를 LLM/pod/custom agent/SOUL 소유자로 모델링, RN Web/Railway/local validation을 native 또는 외부 runtime 증거로 대체하는 주장.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1080:  "verdict": "NO_GO",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1089:      "title": "PR7 still contains stale validate-team-doc.mjs line citation",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1090:      "impact": "Blocks as-is acceptance because the active plan still points implementers to obsolete line numbers for the secret pattern scan.",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1091:      "required_fix": "Replace the PR7 line-number citation with a behavior-based/module-based reference, then rerun node scripts/validate-team-doc.mjs."
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1096:      "check": "node scripts/validate-team-doc.mjs",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1101:      "check": "pnpm run test:runtime",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1106:  "next_action": "Fix the remaining PR7 stale citation and rerun narrow validation; after concurrent runtime work stabilizes, run and record full test:runtime before implementation scope proceeds."
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1114:- **Medium / acceptance blocker**: 최신 업데이트는 as-is 수용 불가입니다. [13-pod-organization-e2e-improvement-plan.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279) PR7에 `validate-team-doc.mjs:236-243` stale line citation이 남아 있습니다. 현재 `secretPatterns`는 [validate-team-doc.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc.mjs:81) 기준으로 이동했고, G8만 behavior-based citation으로 수정되어 있습니다. 이전 xhigh에서 같은 종류의 stale reference를 blocking으로 본 만큼, 이 잔여 PR7 인용도 acceptance를 막습니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1117:- 지금 진행 가능: PR7 stale citation 문서 정정, 이후 `node scripts/validate-team-doc.mjs` 좁은 검증.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1118:- re-baseline 전 차단: PR1~PR7 구현 착수, PR5 offline 구현 착수. E-0의 PR1 전제대로 동시 세션 안정화 후 전체 `pnpm run test:runtime` 재실행·기록이 먼저 필요합니다.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1119:- human/ops 승인 필요: Part D 플랫폼 작업, image build/push, pod 생성, webhook routing, Secret/token 주입, branch protection, release environment protection, PR5 live EAS/native 실증, multi-pod drill.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1120:- 항상 금지: production submit 자동화, release human gate 약화, Gatekeeper를 LLM/pod/custom agent/SOUL 소유자로 모델링, RN Web/Railway/local validation을 native 또는 외부 runtime 증거로 대체하는 주장.
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1124:  "verdict": "NO_GO",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1133:      "title": "PR7 still contains stale validate-team-doc.mjs line citation",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1134:      "impact": "Blocks as-is acceptance because the active plan still points implementers to obsolete line numbers for the secret pattern scan.",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1135:      "required_fix": "Replace the PR7 line-number citation with a behavior-based/module-based reference, then rerun node scripts/validate-team-doc.mjs."
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1140:      "check": "node scripts/validate-team-doc.mjs",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1145:      "check": "pnpm run test:runtime",
.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1150:  "next_action": "Fix the remaining PR7 stale citation and rerun narrow validation; after concurrent runtime work stabilizes, run and record full test:runtime before implementation scope proceeds."

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
핵심은 최신 xhigh 결과가 “현재 문서 as-is는 NO_GO”와 “순서를 지키면 단계적 진행은 가능”을 동시에 말하는지입니다. 지금은 그 두 조건을 문서 라인별로 맞춰 보고 있습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba .evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md | sed -n '1060,1152p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "nl -ba .evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md | sed -n '1,70p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "nl -ba team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md | sed -n '50,70p;85,135p;135,180p;181,207p;208,249p;250,281p;300,305p;340,356p;413,433p;442,463p;469,480p;484,489p;497,510p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
  1060	   508	- 플랫폼 repo 직접 수정(annex는 요구사항 전달까지만)
  1061	   509	- production submit 자동화 또는 release human gate 약화
  1062	   510	- 역할별 GitHub bot 계정/토큰 발급, EAS robot token 발급
  1063
  1064	hook: PostToolUse
  1065	hook: PostToolUse Completed
  1066	hook: PostToolUse Completed
  1067	hook: PostToolUse Completed
  1068	codex
  1069	**Findings**
  1070	- **Medium / acceptance blocker**: 최신 업데이트는 as-is 수용 불가입니다. [13-pod-organization-e2e-improvement-plan.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279) PR7에 `validate-team-doc.mjs:236-243` stale line citation이 남아 있습니다. 현재 `secretPatterns`는 [validate-team-doc.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc.mjs:81) 기준으로 이동했고, G8만 behavior-based citation으로 수정되어 있습니다. 이전 xhigh에서 같은 종류의 stale reference를 blocking으로 본 만큼, 이 잔여 PR7 인용도 acceptance를 막습니다.
  1071
  1072	**Scope**
  1073	- 지금 진행 가능: PR7 stale citation 문서 정정, 이후 `node scripts/validate-team-doc.mjs` 좁은 검증.
  1074	- re-baseline 전 차단: PR1~PR7 구현 착수, PR5 offline 구현 착수. E-0의 PR1 전제대로 동시 세션 안정화 후 전체 `pnpm run test:runtime` 재실행·기록이 먼저 필요합니다.
  1075	- human/ops 승인 필요: Part D 플랫폼 작업, image build/push, pod 생성, webhook routing, Secret/token 주입, branch protection, release environment protection, PR5 live EAS/native 실증, multi-pod drill.
  1076	- 항상 금지: production submit 자동화, release human gate 약화, Gatekeeper를 LLM/pod/custom agent/SOUL 소유자로 모델링, RN Web/Railway/local validation을 native 또는 외부 runtime 증거로 대체하는 주장.
  1077
  1078	```json
  1079	{
  1080	  "verdict": "NO_GO",
  1081	  "reviewer": "reviewer(xhigh)",
  1082	  "mode": "review-only",
  1083	  "scope": "latest pod organization E2E applicability updates",
  1084	  "findings": [
  1085	    {
  1086	      "severity": "Medium",
  1087	      "file": "team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md",
  1088	      "line": 279,
  1089	      "title": "PR7 still contains stale validate-team-doc.mjs line citation",
  1090	      "impact": "Blocks as-is acceptance because the active plan still points implementers to obsolete line numbers for the secret pattern scan.",
  1091	      "required_fix": "Replace the PR7 line-number citation with a behavior-based/module-based reference, then rerun node scripts/validate-team-doc.mjs."
  1092	    }
  1093	  ],
  1094	  "checks_reviewed": [
  1095	    {
  1096	      "check": "node scripts/validate-team-doc.mjs",
  1097	      "status": "PASS",
  1098	      "source": "main-agent reported exit 0"
  1099	    },
  1100	    {
  1101	      "check": "pnpm run test:runtime",
  1102	      "status": "SKIPPED",
  1103	      "reason": "User instructed skip because another session is modifying that area"
  1104	    }
  1105	  ],
  1106	  "next_action": "Fix the remaining PR7 stale citation and rerun narrow validation; after concurrent runtime work stabilizes, run and record full test:runtime before implementation scope proceeds."
  1107	}
  1108	```
  1109	hook: Stop
  1110	hook: Stop Completed
  1111	tokens used
  1112	103,878
  1113	**Findings**
  1114	- **Medium / acceptance blocker**: 최신 업데이트는 as-is 수용 불가입니다. [13-pod-organization-e2e-improvement-plan.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279) PR7에 `validate-team-doc.mjs:236-243` stale line citation이 남아 있습니다. 현재 `secretPatterns`는 [validate-team-doc.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc.mjs:81) 기준으로 이동했고, G8만 behavior-based citation으로 수정되어 있습니다. 이전 xhigh에서 같은 종류의 stale reference를 blocking으로 본 만큼, 이 잔여 PR7 인용도 acceptance를 막습니다.
  1115
  1116	**Scope**
  1117	- 지금 진행 가능: PR7 stale citation 문서 정정, 이후 `node scripts/validate-team-doc.mjs` 좁은 검증.
  1118	- re-baseline 전 차단: PR1~PR7 구현 착수, PR5 offline 구현 착수. E-0의 PR1 전제대로 동시 세션 안정화 후 전체 `pnpm run test:runtime` 재실행·기록이 먼저 필요합니다.
  1119	- human/ops 승인 필요: Part D 플랫폼 작업, image build/push, pod 생성, webhook routing, Secret/token 주입, branch protection, release environment protection, PR5 live EAS/native 실증, multi-pod drill.
  1120	- 항상 금지: production submit 자동화, release human gate 약화, Gatekeeper를 LLM/pod/custom agent/SOUL 소유자로 모델링, RN Web/Railway/local validation을 native 또는 외부 runtime 증거로 대체하는 주장.
  1121
  1122	```json
  1123	{
  1124	  "verdict": "NO_GO",
  1125	  "reviewer": "reviewer(xhigh)",
  1126	  "mode": "review-only",
  1127	  "scope": "latest pod organization E2E applicability updates",
  1128	  "findings": [
  1129	    {
  1130	      "severity": "Medium",
  1131	      "file": "team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md",
  1132	      "line": 279,
  1133	      "title": "PR7 still contains stale validate-team-doc.mjs line citation",
  1134	      "impact": "Blocks as-is acceptance because the active plan still points implementers to obsolete line numbers for the secret pattern scan.",
  1135	      "required_fix": "Replace the PR7 line-number citation with a behavior-based/module-based reference, then rerun node scripts/validate-team-doc.mjs."
  1136	    }
  1137	  ],
  1138	  "checks_reviewed": [
  1139	    {
  1140	      "check": "node scripts/validate-team-doc.mjs",
  1141	      "status": "PASS",
  1142	      "source": "main-agent reported exit 0"
  1143	    },
  1144	    {
  1145	      "check": "pnpm run test:runtime",
  1146	      "status": "SKIPPED",
  1147	      "reason": "User instructed skip because another session is modifying that area"
  1148	    }
  1149	  ],
  1150	  "next_action": "Fix the remaining PR7 stale citation and rerun narrow validation; after concurrent runtime work stabilizes, run and record full test:runtime before implementation scope proceeds."
  1151	}
  1152	```

 succeeded in 0ms:
     1	# Pod Organization E2E Applicability Cross-Check
     2
     3	Date: 2026-06-10
     4	Mode: independent cross-check of the detailed applicability judgment chain
     5	Session plan: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`
     6
     7	## Inputs Cross-Checked
     8
     9	- Detailed report: `.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md` (552 lines, read in full)
    10	- First xhigh review: `.evidence/reviews/pod-organization-e2e-applicability-detailed-xhigh-review-20260610.md` (verdict NO_GO)
    11	- Post-correction xhigh re-review: `.evidence/reviews/pod-organization-e2e-applicability-detailed-xhigh-rereview-20260610.md` (verdict GO, findings: none, residual risks: 2 — envelope verified directly)
    12	- Primary plan: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
    13	- Pod evidence: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`
    14	- Repo SoT: `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `package.json`
    15
    16	## Cross-Check Result: ACCEPTED, with three supplements
    17
    18	The applicability judgment is accepted as written. Specifically verified:
    19
    20	1. The immediate/conditional/forbidden split matches the primary plan E-0, `AGENTS.md`
    21	   external-runtime limits, `REPO_OPERATIONS.md` policy ownership, and the human-gate
    22	   categories in `06-gates-and-evidence.md`.
    23	2. The pnpm fact correction (pin mismatch: boram pod pnpm `10.33.3` vs repo SoT
    24	   `pnpm@9.15.9`; canary inferred only) matches the checked-in boram evidence and the
    25	   corrected primary plan text.
    26	3. The GO scope limitation is correctly stated: it accepts the applicability report only;
    27	   it is not implementation approval, PR readiness, live pod readiness, or native E2E
    28	   completion.
    29	4. The gate-status handling is honest: the report does not claim runtime-gate green and
    30	   records the user-directed `test:runtime` skip and the narrow
    31	   `validate-repo-operations.mjs` check as non-substitutes.
    32
    33	No factual error was found in the judgment chain or in the operator summary of it.
    34
    35	## Supplements (feedback on the feedback)
    36
    37	1. **Stale line citation found and fixed in the primary plan.** A concurrent session
    38	   substantially rewrote `scripts/validate-team-doc.mjs` (working-tree diff at
    39	   cross-check time: +536/-163). The primary plan's G8 row cited
    40	   `validate-team-doc.mjs:236-250` for the team-doc secret scan; that implementation now
    41	   starts near line 81 (`secretPatterns`). This is the same class of stale-reference
    42	   defect that the first xhigh review treated as blocking. The G8 row was corrected to a
    43	   behavior-based citation (no line numbers) in this cross-check cycle.
    44	2. **Gate re-baseline elevated to an explicit precondition.** The applicability report
    45	   records the `test:runtime` skip as context. Because PR1's acceptance criteria require
    46	   `pnpm run test:runtime` green, the skip must become a blocking precondition: after the
    47	   concurrent runtime-area session stabilizes, run and record the full gate before PR1
    48	   implementation starts. This precondition was added to the primary plan E-0.
    49	3. **Session plan re-baselined.** The prior session execution plan still described the
    50	   already-completed fact-correction phase as pending; it was replaced so the corrections
    51	   are not re-applied.
    52
    53	## Constraints Carried Forward Unchanged
    54
    55	- Repo-internal offline work only (PR1, PR2, PR3, PR4, PR6, PR7, PR5 offline portion),
    56	  validator-first, after gate re-baseline.
    57	- Blocked until human/ops approval: Part D platform work (image build/push, pod creation,
    58	  ConfigMap/Secret provisioning, bot accounts/tokens, branch protection, release
    59	  environment protection, webhook/NATS routing), PR5 live native E2E, multi-pod drill.
    60	- Always forbidden: production release submission automation, weakening human gates,
    61	  Gatekeeper as LLM/pod/custom agent/SOUL.md owner, RN Web or Railway evidence as native
    62	  replacement, local validation as external runtime proof, secret/token exposure, direct
    63	  external platform mutation from this repo workflow.
    64
    65	## Narrow Validation Run In This Cycle
    66
    67	- `node scripts/validate-team-doc.mjs` after the G8/E-0 plan-document updates
    68	  (result recorded in the session report; full `test:runtime` intentionally not run per
    69	  the standing user instruction while the concurrent session modifies that area).

 succeeded in 0ms:
    50	| Pod 플랫폼 | agent 1개 = ConfigMap + Secret + Service + StatefulSet(+ `/workspace` 10Gi PVC) 패턴, NATS 룸 구독, A2A, webhook gateway 라우팅 — live pod로 27시간+ 무중단 실측 | 플랫폼 repo + live pod 실측 |
    51	| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |
    52
    53	### A-2. 검증된 갭 (개선 대상)
    54
    55	| # | 갭 | 근거 | 영향 |
    56	| --- | --- | --- | --- |
    57	| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
    58	| G2 | **오케스트레이션 주체 없음**: skill 11종이 각 역할의 "어떻게"는 정의하지만 "지금 누가 무엇을"은 어디에도 없음 | `.agents/skills/` 전수 확인; `05-work-processes.md`는 산문 | 인간이 매 stage마다 다음 역할을 호출해야 함 |
    59	| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
    60	| G4 | **pod 부트스트랩 계약 부재**: `codex-preflight.mjs`가 macOS 전제 — codex 후보 경로가 `/opt/homebrew/bin/codex`, `/usr/local/bin/codex`(`scripts/codex-preflight.mjs:8`), arch 판정이 `sysctl -n hw.optional.arm64`(`scripts/codex-preflight.mjs:67`). Linux pod에서 결정적으로 실패. 역할 배정(어느 pod가 어느 역할인지) 규약도 없음 | 해당 파일 | 새 pod가 "나는 역할 X이고 준비됐다"를 스스로 증명할 수 없음 |
    61	| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
    62	| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
    63	| G7 | **Stitch 사전점검 부재**: stitch MCP는 Google Cloud ADC + 프로젝트 설정 필요(`PROJECT_ENVIRONMENT.md` MCP 절)인데 preflight가 검사하지 않음 → Design pod가 실행 실패 시점에야 발견 | `PROJECT_ENVIRONMENT.md` | Design stage 자율성 저하 |
    64	| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 — `secretPatterns` 구현 — 은 수행됨. 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음) | 해당 파일 | 증거 무결성이 규율에만 의존 |
    65	| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |
    66
    67	### A-3. 진단 요약
    68
    69	조직 설계·역할 계약·게이트·증거 규율은 성숙해 있으나, 그것을 **구동하는 결정적
    70	(deterministic) 상태·해석기·부트스트랩 계층이 없다**. 즉 "역할이 일하는 방법"은 완성됐고
    85	### PR1 (P0) — Work-unit 상태머신: `status.json`
    86
    87	- **WHY**: G1. pod-isolated 조직에서 유일한 durable 입력은 committed 파일이므로
    88	  상태도 committed 파일이어야 한다. reviewer verdict가 이미 JSON envelope로 기계화되어
    89	  있는 것(`codex-headless-review.mjs`)과 동일한 패턴을 stage 상태로 확장하는 것.
    90	- **WHAT**:
    91	  - `docs/plans/work-units/<work-unit-id>/status.json` (schema `wu-status/v1`)
    92	  - `scripts/lib/work-unit-machine.mjs` — 상태 enum/전이표/병렬 그룹 공유 모듈
    93	  - `scripts/validate-work-units.mjs` (+ `evals/local-harness/work-units/` fixture:
    94	    valid 1, 불법 전이 1, envelope 누락 1, gatekeeper에 reviewer 지정 1)
    95	  - `docs/plans/work-units/sample-role-handoff/status.json` 샘플 추가
    96	  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
    97	- **HOW** — 스키마 핵심:
    98
    99	```json
   100	{
   101	  "schema_version": "wu-status/v1",
   102	  "work_unit": "<work-unit-id>",
   103	  "stages": [
   104	    {
   105	      "id": "00-product-planning",
   106	      "role": "product-planning",
   107	      "state": "done",
   108	      "attempts": 1,
   109	      "max_attempts": 3,
   110	      "required_artifacts": ["..."],
   111	      "reviewer": { "agent": "po-planning-reviewer", "verdict": "GO",
   112	                    "envelope_path": "00-product-planning/reviewer-envelope.json" },
   113	      "handoff": { "branch": "wu/<id>/00-planning", "pr": "<pr-url>" }
   114	    }
   115	  ],
   116	  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
   117	                     "state": "pending", "decision_path": "..." } ],
   118	  "evidence_ladder": { "required_level": "eas-maestro", "achieved_level": "rn-web" },
   119	  "events": [ { "at": "<iso8601>", "actor": "<role>", "type": "stage-completed", "stage": "..." } ]
   120	}
   121	```
   122
   123	  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
   124	  - 합법 전이: `pending→in-progress→review→done`; `review→gate-failed→in-progress`(attempts+1);
   125	    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
   126	  - `events`는 append-only — validator가 타임스탬프 단조 증가와 git base 대비 prefix 보존을 검사
   127	  - validator 규칙: `done`은 산출물 실재 + reviewer envelope `GO` 재검증
   128	    (`codex-headless-review.mjs`의 envelope validator 재사용) + handoff 링크 필수;
   129	    `06-gatekeeper` stage는 role이 `gatekeeper-system`이어야 하고 reviewer agent 지정 금지
   130	    (비-LLM 불변식); 선행 stage 미완료 시 `in-progress` 금지 — 단 `02-architecture`와
   131	    `03-contract-api`는 `01-design`이 `review` 도달 후 병렬 허용(명시적 `parallel_groups` 상수)
   132	- **수용 기준**: `--self-test` 통과(invalid fixture가 명명된 사유로 실패),
   133	  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.
   134
   135	### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`
   135	### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`
   136
   137	- **WHY**: G5. reviewer가 `NEEDS_HUMAN`을 낼 수는 있으나 해제 레코드가 없으면 자율
   138	  파이프라인은 영구 정지한다. 승인을 기계 판독 가능 + 감사 가능하게 만들어야
   139	  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
   140	- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
   141	  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
   142	  `06-gates-and-evidence.md`에 규범 절 1개 추가.
   143	- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
   144	  `decision ∈ approved|rejected|deferred`, `scope`, `decided_by{name,contact,channel}`,
   145	  `decision_reference`(GitHub comment/review URL — 신뢰 앵커), `decided_at`,
   146	  `residual_risk[]`, `evidence_links[]`.
   147	  - 결정적 anti-self-approval: `decided_by.name`이 역할명/agent명 목록과 일치하면 거부
   148	  - `failed-gate-risk` 카테고리는 실패한 check 참조 필수
   149	  - 한계 명시: 진위 보장은 GitHub 계정 신원에 앵커된 **정책 수준**이지 암호학적 증명이
   150	    아니다. 온라인 시 orchestrator가 `gh api`로 작성자 확인 후 work-unit event에
   151	    `verified: true | unverifiable-offline` 기록.
   152	- **수용 기준**: fixture 4종(정상 / agent명 승인자 / 미정의 category / failed-gate-risk
   153	  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.
   154
   155	### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill
   156
   157	- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
   158	  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
   159	  결정된 액션의 *실행*만 담당한다.
   160	- **WHAT**:
   161	  - `scripts/work-unit-next.mjs`: `status.json` + 파일시스템 → 다음 액션 JSON 출력.
   162	    `--apply-transition <stage> <state>`는 공유 모듈을 통해서만 상태를 기록(불법 전이는
   163	    기록 시점에 거부 — validate 시점이 아니라).
   164	  - `.agents/skills/wm-orchestrate/SKILL.md`: 어느 역할 pod든 실행하는 단일 진입 skill.
   165	    절차 = pull → resolver 실행 → 자기 역할(`WM_ROLE`) 몫 필터 → 해당 역할 skill 호출 →
   166	    reviewer를 `codex-headless-review.mjs`로 실행 → 전이 적용 → commit/push/PR 갱신.
   167	  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
   168	    수정 금지(pending 요청 생성만 허용), resolver가 `blocked`만 반환하면 정지·보고.
   169	- **HOW** — resolver 출력 계약(요지): `next_actions[]`(stage, role, action ∈
   170	  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
   171	  run-deterministic-checks, skills[], reviewer_required, attempts_remaining)와
   172	  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
   173	  `04-skills-and-agents-matrix.md`를 따른다(00→po-planning-reviewer, 01→design-reviewer,
   174	  02/03→wm-contract-reviewer, 04→wm-implementation-reviewer, 05→QA 증거 검사,
   175	  06→결정적 검사만). 재시도 정책: `gate-failed` 시 `wm-gate-fix-advisor` advisory 첨부,
   176	  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
   177	- **수용 기준**: fixture로 8 stage 행복 경로, 02/03 병렬, 재시도, 재시도 소진 에스컬레이션,
   178	  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
   179	  sample work-unit 사본으로 stage 00 dry-run이 로컬에서 headless reviewer까지 완주.
   180
   181	### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약
   182
   183	- **WHY**: G4. live pod 실측상 pod에는 Node 22/git/Chromium이 있고
   184	  `/workspace/skills/codex-cli-auth-setup`이 이미 동작 패턴으로 존재한다
   185	  (`09-pod-native-openclaw-skill-plan.md`). 같은 패턴으로 "역할 부트스트랩"을 추가하고,
   186	  macOS 전용인 preflight를 pod에서 동작하게 확장하면 된다.
   187	- **WHAT**:
   188	  - `scripts/codex-preflight.mjs`에 `--pod` 모드: codex 후보 경로에 `which codex` +
   189	    `CODEX_BIN` env 추가, arch 판정을 `uname -m` 우선으로 교체(기존 macOS 경로 유지),
   190	    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
   191	    10.33.3 근거), git identity, `gh auth status`,
   192	    Chromium 존재(`rn-web-capable`), `.codex/config.toml` 파싱 + `codex mcp list` 종료코드,
   193	    역할 컨텍스트 fixture 존재. 출력에 `capabilities` 블록:
   194	    `{ "rn_web_e2e": bool, "native_e2e_local": false, "eas_cloud": <EXPO_TOKEN 존재 여부 status-only> }`.
   195	    auth token 값은 출력하지 않음(기존 codex-cli-auth-setup 가드 계승).
   196	  - pod-native skill 소스 `09-pod-native-openclaw-skills/pod-role-bootstrap/`
   197	    (`SKILL.md` + `scripts/pod-bootstrap.sh` + `references/report-template.md`):
   198	    역할 해석(`WM_ROLE` env 우선, fallback `/workspace/IDENTITY` 1행, 불일치 시 hard fail) →
   199	    repo clone(주입 토큰; `infra/clawpod/agent-runner.yaml`의 initContainer 패턴 재사용) →
   200	    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
   201	    `codex-preflight --pod --json` → 역할 skill 디렉토리
   202	    실재 확인 → 보고서를 `/workspace/state/`에 기록.
   203	  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
   204	    codex-cli-auth-setup 검사 패턴 확장; shell script secret-출력 금지 regex 포함).
   205	- **수용 기준**: preflight `--self-test`에 Linux형 fixture 추가 통과; 노트북에서
   206	  `--pod`는 우아하게 skip; validate:team-doc이 skill 소스 누락/secret 출력 시 실패.
   207
   208	### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리
   209
   210	- **WHY**: G3. in-pod emulator는 **명시적으로 기각**한다 — KVM/중첩 가상화가 pod 런타임에
   211	  없고(실측), 대규모 병렬은 `AGENTS.md:46`의 직렬화 원칙과도 충돌한다. 반면 이 repo에는
   212	  이미 자율화 가능한 cloud 경로가 잠들어 있다: `eas.json`의 `e2e-test` 프로파일
   213	  (credential-less Android APK + iOS simulator)과 `e2e-test-android.yml`의 cloud Maestro
   214	  job. 빠진 것은 ① robot token 인증의 pod-native 표준화 ② 결과를 `.evidence/`로 끌어오는
   215	  ingestion ③ "어느 수준의 증거가 언제 필수인가"의 규범이다.
   216	- **WHAT**:
   217	  - 신규 문서 `14-native-e2e-strategy.md` — 증거 사다리(evidence ladder) 규범:
   218	    - L0 `jest`: 항상 (CI)
   219	    - L1 `rn-web`: RN Web + Playwright, 모든 UI 작업 필수. pod 내 Chromium으로 실행 가능
   220	      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
   221	    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
   222	      컨테이너/release candidate 접촉 시 필수
   223	    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
   224	      submit 전 필수
   225	    - stage 00에서 Product/Planning이 `status.json.evidence_ladder.required_level` 설정,
   226	      `validate-work-units.mjs`가 `05-qa-release` 완료 전 `achieved_level >= required_level`
   227	      또는 `failed-gate-risk` waiver 존재를 강제
   228	    - `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder다
   229	      (boram SoT check 증거 문서에 기록) — runtime env가 아니므로 L2 실행 전에 appId
   230	      파라미터화/주입 방안을 이 문서에서 규정해야 한다
   231	  - pod-native skill `09-pod-native-openclaw-skills/eas-robot-auth-setup/`:
   232	    `EXPO_TOKEN` 존재 status-only 확인, `npx eas-cli whoami` 종료코드, `EAS_PROJECT_ID`
   233	    링크 확인. 값 출력 절대 금지. token은 `infra/clawpod/secret.example.yaml` 패턴으로 주입.
   234	  - `scripts/ingest-eas-evidence.mjs`: eas-cli JSON 출력(`eas build:view --json` 등, 버전
   235	    핀 고정 — `@latest` 금지 정책 준수) → `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-eas-<slug>/result.json`
   236	    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
   237	    요약 블록 생성. URL query token redaction. 네트워크 없는 `--self-test`(녹화 fixture).
   238	  - `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(트리거 → 폴링 → ingest →
   239	    실패 분류).
   240	  - iOS는 Android 경로 검증 후 후속(P2)으로 `e2e-test-ios.yml` 추가 — 본 계획 범위 외로 명시.
   241	- **수용 기준 (오프라인 — 선행 실행 가능)**: ingest `--self-test` 통과(녹화 fixture, 네트워크 0)
   242	  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
   243	  `validate:team-doc` 통과.
   244	- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
   245	  `EAS_PROJECT_ID`/GitHub-EAS 연동을 승인·주입 → PR에서 `e2e-test-android.yml` 실행 →
   246	  증거 ingest). 승인·주입 전에는 `eas whoami`를 포함한 어떤 EAS 명령도 실행하지 않으며,
   247	  native 검증 완료를 주장하지 않는다.
   248
   249	### PR6 (P1) — SoT refresh / drift 자동 검출
   250
   251	- **WHY**: G6. 에이전트 조직은 문서를 SoT로 신뢰하므로 drift는 조용한 오작동의 최대
   252	  원인이다. placeholder를 "수동 절차 + 자동 검출"의 명시적 정책으로 전환한다.
   253	- **WHAT**:
   254	  - `package.json:20`의 placeholder를 `node scripts/sot-snapshot-check.mjs`로 교체:
   255	    `evals/local-harness/sot/snapshot.json` 스키마/page-ID 목록 일치 검증 + `refreshed_at`
   256	    30일 초과 경고(경고만, CI 비차단). 실제 re-fetch는 Atlassian MCP 수동/에이전트 절차로
   257	    `evals/local-harness/README.md`에 규범화(네트워크·MCP 인증이 CI-unsafe하므로).
   258	  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
   259	    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
   260	    /tailwind/playwright 버전(`apps/mobile/package.json`), lightningcss override,
   261	    MCP 핀(`.codex/config.toml`), CI trigger 경로 목록(`quality-gate.yml` 정규식) 일치 검사.
   262	    `--online` 모드(PR 게이트 제외): Railway QA API `/livez`·`/readyz` 응답 확인.
   263	  - `.github/workflows/sot-drift.yml`: 주간 cron, `--online` + snapshot age 검사,
   264	    drift 시 GitHub issue 생성/갱신(비차단 — PR 게이트는 오프라인·결정적 유지).
   265	- **수용 기준**: 핀을 한 곳만 수정한 mutated fixture에서 실패; PR 게이트 네트워크 무의존.
   266
   267	### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
   268
   269	- **WHY**: G7, G8. 모두 실패를 실행 시점에서 사전점검 시점으로 당기는 작업.
   270	- **WHAT**:
   271	  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
   272	    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
   273	    status-only, 값 출력 금지.
   274	  - mobile-mcp: `.codex/config.toml` 핀 vs `PROJECT_ENVIRONMENT.md` 표기 drift 검사
   275	    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
   276	  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
   277	    디렉토리명 `^\d{8}-\d{6}-[a-z0-9-]+$` 강제, 금지 경로(`local/`, `tmp/`, `raw/`, `*.log`)의
   278	    커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
   279	    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
   280	- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
   281	  비-design 역할 preflight는 Stitch 블록 skip.
   300	- **1역할 1pod**: `10-github-artifact-workflow.md`가 역할 격리 + GitHub-only handoff를
   301	  전제하고, reviewer agent 분리(`.codex/agents/*-reviewer.toml`)가 행위자 분리를 가정한다.
   302	  플랫폼은 agent당 ConfigMap/Secret/StatefulSet을 이미 지원하므로(검증) 추가 인프라가 없다.
   303	- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
   304	  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
   305	  work-unit의 `06-gatekeeper/` 파일은 CI 결과의 *전사*다 — LLM이 pass/fail을 판단하지 않는다.
   340	### C-3. 이미지/툴체인 요구 (요지 — 상세는 Part D annex)
   341
   342	`clawpod/agent-mobile` (base 이미지 파생):
   343
   344	- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
   345	  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
   346	  부트스트랩/preflight는 불일치 시 fail. eas-cli(전역), maestro CLI(**cloud 업로드
   347	  모드 전용** — 로컬 드라이버 불필요), watchman(장시간 `expo start --web` 세션의
   348	  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
   349	- **명시적 제외**: Android SDK / adb / emulator 이미지 — KVM 부재로 사용 불가하며
   350	  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
   351	- `lite` 변형(po/arch/api용): base lite + pnpm + gh만
   352
   353	### C-4. 조정(coordination) 모델 — "GitHub가 상태, NATS는 초인종"
   354
   355	- **GitHub = 유일한 durable handoff**: `10-github-artifact-workflow.md` SoT 그대로.
   356	  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
   413	## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)
   414
   415	이 절은 **요구사항 명세**다. 플랫폼 repo 직접 수정은 이 repo의 정책 범위 밖이며
   416	(`12-ref-organization-goal-plan.md` Out of scope 원칙과 동일), 플랫폼 운영자가 이 절만
   417	읽고 구현 가능해야 한다. 이 절의 모든 항목(이미지 빌드/푸시, webhook 규칙, pod 생성,
   418	Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
   419	**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
   420	ops 요구사항 annex로만 유지한다.
   421
   422	1. **이미지 `clawpod/agent-mobile` (+`:lite`)**: C-3 명세. arm64(OrbStack)/amd64 동시 빌드.
   423	   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
   424	   headless로 동작하고 Playwright가 통과; `eas whoami`가 robot token으로 성공;
   425	   base 대비 증가분 합리적 수준(<~1.5Gi).
   426	2. **webhook gateway 규칙**: C-4의 3종. label 기반 라우팅이 rules engine에 없으면 라벨
   427	   파싱 연산자 추가 필요(요구사항으로 전달).
   428	3. **agent 생성 payload 6종**(admin API): 이름/모델/자원(C-1 표), ConfigMap 4파일(C-2),
   429	   Secret 키 목록(값은 redacted) — 런북에 템플릿으로 기록.
   430	4. **k8s Secret 실주입 런북**: `GITHUB_TOKEN`(역할별), `EXPO_TOKEN`(QA), `RAILWAY_TOKEN`(API),
   431	   Google ADC(Design). 값 출력/커밋 금지 규칙 준수.
   432	5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
   433	   validator), release environment protection(인간 reviewer), 역할별 bot 계정.
   442	`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
   443	실행 범위를 다음과 같이 한정한다.
   444
   445	이후 상세 적용성 판정이 완료되었다:
   446	`.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md`
   447	(1차 xhigh NO_GO → 정정 → 재검토 `...-xhigh-rereview-20260610.md` verdict **GO**).
   448	이 GO는 "상세 적용성 보고서가 SoT 기준으로 수용 가능하다"는 의미로 한정되며,
   449	구현 승인·PR-ready·live pod readiness·native E2E 완료 승인이 아니다. 적용성 판정 시점에
   450	전체 `test:runtime`은 사용자 지시로 skip되었으므로(동시 세션이 해당 영역 수정 중),
   451	**PR1 착수 전에 동시 세션 안정화 후 전체 게이트를 재실행·기록(re-baseline)하는 것이
   452	선행 조건이다.**
   453
   454	- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
   455	  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
   456	  스크립트의 fixture self-test·스키마 설계)까지.
   457	- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
   458	  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
   459	  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
   460	- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
   461	  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
   462	  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
   463	  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.
   469	| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
   470	| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
   471	| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
   472	| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
   473	| 5 | 나머지 4 pod + webhook 규칙 (B3·B8) | ops |
   474	| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
   475	| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
   476	| 8 | 최종 드릴 | 전체 |
   477
   478	3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
   479	**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
   480	live EAS 실증은 승인·토큰 주입 후로 분리한다.
   484	합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:
   485
   486	- 전 stage `status.json`이 합법 전이만으로 `done` 도달
   487	- RN Web Playwright 증거(스크린샷 포함) + EAS build ID가 포함된 `eas-evidence` 산출
   488	- 모든 required check green, `06-gatekeeper/`는 CI 전사만 포함
   489	- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)
   497	  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
   498	- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
   499	- EAS robot token 발급·GitHub↔EAS 연동은 본질적으로 1회 인간 셋업이다 — 자동화 약속이
   500	  아니라 기록되는 human gate로 관리한다.
   501	- 로컬 harness가 pod 실행을 증명하지 않는다는 기존 한계(`AGENTS.md` Local harness scope)는
   502	  유지된다 — pod 실측 검증은 E-1 3단계/8단계의 운영 드릴이 담당한다.
   503
   504	## Human Gates (이 계획 자체)
   505
   506	다음은 인간 승인 없이 진행하지 않는다:
   507
   508	- 플랫폼 repo 직접 수정(annex는 요구사항 전달까지만)
   509	- production submit 자동화 또는 release human gate 약화
   510	- 역할별 GitHub bot 계정/토큰 발급, EAS robot token 발급

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "nl -ba .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md | sed -n '1,45p;64,93p;95,123p;125,153p;154,184p;186,219p;222,243p;248,260p;296,315p;318,335p;341,356p;363,376p;375,392p;399,406p;416,437p;444,468p;475,505p;509,521p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Pod Organization E2E Applicability Detailed Report
     2
     3	Date: 2026-06-10
     4	Mode: `$wm` review-only applicability judgment
     5	Primary plan: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
     6	Session plan: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`
     7
     8	## SoT And Evidence Inputs
     9
    10	- Repo mandatory rules: `AGENTS.md`
    11	- Runtime facts: `PROJECT_ENVIRONMENT.md`
    12	- Repo operations policy: `REPO_OPERATIONS.md`
    13	- Managed team-doc index and source map: `team-doc/mobile-app-dev-team/README.md`, `team-doc/mobile-app-dev-team/99-source-map.md`
    14	- Primary plan under review: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
    15	- Pod evidence: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`
    16	- Session execution plan: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`
    17
    18	## Overall Judgment
    19
    20	The updated plan is applicable only as a repo-scoped, offline-first improvement roadmap.
    21	It is not approval to operate external platform resources, inject secrets, change branch protection,
    22	execute live cloud validation, or claim native E2E completion.
    23
    24	The prior blocking factual issue is resolved at the plan level: the pod problem is no longer
    25	described as missing pnpm. It is correctly described as a pin mismatch between boram pod pnpm
    26	`10.33.3` and repo SoT `pnpm@9.15.9`. The remaining pod gaps for cloud CLI, Maestro, adb,
    27	emulator, Java, mobile-mcp, and KVM remain valid.
    28
    29	The current full runtime gate is intentionally not asserted in this report. The user instructed
    30	to skip `test:runtime` because another session is concurrently modifying that area. This does not
    31	make the updated applicability split invalid, but it does mean this report must not claim PR-ready
    32	or runtime-gate green status.
    33
    34	## Immediately Applicable: Repo-Internal Offline Work
    35
    36	These items can be applied now only inside this repository and only with tests, fixtures,
    37	validators, and documentation updates. They must not perform external platform operations or
    38	credentialed online actions.
    39
    40	### 1. Fact Correction And Plan Registration
    41
    42	Applicable:
    43
    44	- Keep the factual correction that boram pod has pnpm `10.33.3`, while the repo SoT pin is
    45	  `pnpm@9.15.9`.
    64	### 2. PR1: Work-Unit Status Machine
    65
    66	Applicable:
    67
    68	- Add `docs/plans/work-units/<work-unit-id>/status.json` with a deterministic `wu-status/v1`
    69	  schema.
    70	- Add a shared state machine module and validator for stage state, legal transitions, retry count,
    71	  reviewer envelope presence, handoff links, append-only events, and Gatekeeper invariants.
    72	- Add local fixtures for valid and invalid work-unit states.
    73	- Wire the validator into `test:runtime`, the quality gate workflow, and runtime documentation
    74	  only after the tests/fixtures exist.
    75
    76	Why this is applicable:
    77
    78	- The plan identifies the lack of machine-readable work-unit state as the core autonomy gap.
    79	- GitHub branch/commit/PR is already the durable handoff model for pod-isolated role agents.
    80	- Deterministic status validation matches the non-LLM Gatekeeper model.
    81
    82	Required constraints:
    83
    84	- TDD/validator-first is mandatory.
    85	- `06-gatekeeper` must remain a deterministic CI stage, not an LLM reviewer stage.
    86	- A stage must not move to `done` without real artifacts, reviewer envelope where applicable,
    87	  and a handoff reference.
    88
    89	Do not over-apply:
    90
    91	- Do not make `status.json` a substitute for human approval.
    92	- Do not let an LLM decide gate pass/fail.
    93	- Do not claim this proves pod orchestration; it only creates repo-local machine-readable state.
    95	### 3. PR2: Human-Gate Decision Envelope
    96
    97	Applicable:
    98
    99	- Add a machine-readable human-gate decision schema such as `human-gate/v1`.
   100	- Require fields such as gate id, category, decision, scope, human decider identity, decision
   101	  reference, timestamp, residual risk, and evidence links.
   102	- Enforce anti-self-approval: role names and agent names must not be valid human approvers.
   103	- Require an approved decision file before a `blocked-human` stage can resume.
   104
   105	Why this is applicable:
   106
   107	- Current reviewer verdicts can say `NEEDS_HUMAN`, but the repo lacks a deterministic way to
   108	  record and validate release from that blocked state.
   109	- A machine-readable human decision record preserves the human gate while allowing deterministic
   110	  pipeline resumption.
   111
   112	Required constraints:
   113
   114	- Human-gate authenticity is a policy-level GitHub identity anchor, not cryptographic proof.
   115	- Failed-gate risk acceptance must remain a human decision.
   116	- Release approval must remain blocking when `human-approval.json` is absent.
   117
   118	Do not over-apply:
   119
   120	- Do not let a role pod create its own approval.
   121	- Do not treat a reviewer comment, chat message, or local note as approval unless it is captured
   122	  in the approved schema and reference model.
   123	- Do not weaken the release human gate for convenience.
   125	### 4. PR3: Deterministic Next-Action Resolver And `wm-orchestrate`
   126
   127	Applicable:
   128
   129	- Add a pure resolver that reads `status.json` plus the filesystem and emits `next_actions[]`
   130	  and `blocked[]`.
   131	- Add a repo-local orchestration skill that executes only the current role's assigned action.
   132	- Require the resolver to stop when the only next state is blocked by a missing human decision.
   133	- Use advisory reviewer/fix helpers only after deterministic state says a retry or fix path is
   134	  allowed.
   135
   136	Why this is applicable:
   137
   138	- The gap is not that each role lacks skills; the gap is "who acts next" and "what state allows it."
   139	- A deterministic resolver preserves Gatekeeper philosophy and prevents ad hoc LLM routing.
   140
   141	Required constraints:
   142
   143	- The skill must not execute another role's stage.
   144	- It must not modify reviewer envelopes or human approval records except to create pending
   145	  requests where the schema allows that.
   146	- It must not convert local chat state into durable state; durable state is committed repo state.
   147
   148	Do not over-apply:
   149
   150	- Do not add a seventh PM/orchestrator LLM pod for decision-making.
   151	- Do not let NATS messages become the source of truth.
   152	- Do not treat resolver dry-runs as proof that GitHub webhook routing works.
   153
   154	### 5. PR4: Repo-Side Pod Bootstrap Contract
   155
   156	Applicable:
   157
   158	- Extend `codex-preflight` for Linux pod mode.
   159	- Add pnpm pin validation: repo expects `pnpm@9.15.9`; mismatch must fail.
   160	- Add status-only checks for node major, git identity, GitHub CLI auth status, Chromium presence,
   161	  MCP list status, role context fixture presence, and selected role capability flags.
   162	- Add a pod-native skill source for role bootstrap under the managed team-doc OpenClaw skill
   163	  source area.
   164	- Add tests/fixtures for Linux pod preflight behavior and secret-output prevention.
   165
   166	Why this is applicable:
   167
   168	- The pod has pnpm, but at the wrong version for this repo.
   169	- The plan's repair path is to align via corepack pinning and fail early on mismatch.
   170	- Repo-side scripts and pod-native skill source can be authored and tested offline.
   171
   172	Required constraints:
   173
   174	- Output must be status-only for secret-derived capabilities.
   175	- Local execution of `--pod` must skip or degrade gracefully when not in a pod.
   176	- The bootstrap contract can define expected behavior, but cannot claim live pod success without
   177	  actual pod evidence.
   178
   179	Do not over-apply:
   180
   181	- Do not inject tokens.
   182	- Do not create or mutate pods.
   183	- Do not read or print secret-bearing config contents.
   184	- Do not treat local preflight fixtures as proof that the OpenClaw runtime accepts the skill.
   186	### 6. PR5 Offline Portion: Native E2E Strategy And Evidence Ingest Design
   187
   188	Applicable now:
   189
   190	- Add the native E2E strategy document that defines the evidence ladder:
   191	  L0 Jest, L1 RN Web Playwright, L2 cloud Maestro/native build evidence, L3 human device/mobile-mcp.
   192	- Document why in-pod emulator is rejected: no KVM and no Android SDK/adb/emulator in boram evidence.
   193	- Document that `.maestro/home.yml` currently has `appId: {{ANDROID_PACKAGE}}`, a generation-time
   194	  placeholder that must be parameterized before L2 execution.
   195	- Add an ingest script that works only from recorded fixture JSON in self-test mode.
   196	- Add schema and validator rules that prevent `05-qa-release` completion when required evidence
   197	  level is unmet unless a valid human waiver exists.
   198	- Add guarded pod-native auth setup source files as documentation and offline scripts, with explicit
   199	  "do not run before approval and token injection" language.
   200
   201	Why this is applicable:
   202
   203	- The repo already contains EAS profile and Maestro workflow definitions, but lacks safe robot auth
   204	  setup and evidence ingestion.
   205	- Offline fixture-based ingestion can be built without credentials or network.
   206	- RN Web evidence is useful as L1 but is not native proof.
   207
   208	Required constraints:
   209
   210	- Network-free self-tests only.
   211	- No live auth command.
   212	- No native completion claim.
   213	- No token value output.
   214
   215	Do not over-apply:
   216
   217	- Do not run live cloud validation before human/ops approval.
   218	- Do not treat RN Web as replacement for native module, permission, navigation container, or release
   219	  candidate validation.
   222	### 7. PR6: SoT Drift Detection
   223
   224	Applicable:
   225
   226	- Replace the placeholder SoT refresh script with an offline snapshot/drift checker.
   227	- Check documented pins against actual repo files: package manager, mobile package versions,
   228	  lockfile overrides, MCP pin versions, quality-gate trigger paths, and runtime script wiring.
   229	- Keep online refresh or Atlassian-backed refresh as a manual/non-blocking workflow, not a PR gate.
   230
   231	Why this is applicable:
   232
   233	- The plan depends on SoT fidelity.
   234	- The current repo has known placeholder behavior for SoT refresh.
   235	- Offline deterministic drift checks are suitable for CI.
   236
   237	Required constraints:
   238
   239	- CI must not depend on network or MCP authentication.
   240	- A warning-only staleness check must not be mislabeled as a blocking proof of freshness.
   241	- Any documentation update must keep `PROJECT_ENVIRONMENT.md` synchronized with actual repo files.
   242
   243	Do not over-apply:
   248	### 8. PR7: Hardening For Stitch, mobile-mcp Pin Drift, And Evidence Hygiene
   249
   250	Applicable:
   251
   252	- Add status-only Design preflight checks for Stitch/ADC/project configuration.
   253	- Add offline drift check for mobile-mcp pin consistency between `.codex/config.toml` and
   254	  `PROJECT_ENVIRONMENT.md`.
   255	- Add evidence hygiene validation for evidence directory naming, forbidden raw/log/temp paths,
   256	  and secret-pattern scanning.
   257	- Add planted-secret fixtures to prove the scanner fails safely.
   258
   259	Why this is applicable:
   260
   296	These items are valid requirements, but they must remain blocked until explicit human/ops approval
   297	is recorded. They are not repo-only work.
   298
   299	### 1. OpenClaw Agent Image Build And Push
   300
   301	Conditionally applicable:
   302
   303	- Build `clawpod/agent-mobile` and `clawpod/agent-mobile:lite` images.
   304	- Include pnpm pin alignment, cloud CLI support, Maestro cloud-upload support, watchman, and warm
   305	  pnpm store layers as applicable.
   306	- Keep Android SDK/adb/emulator excluded from the pod image unless the runtime capabilities change.
   307
   308	Required approval:
   309
   310	- Human/ops approval for image build/push.
   311	- Platform owner execution, because image changes are outside this repo.
   312
   313	Do not do before approval:
   314
   315	- Do not build, push, or mutate platform images from this repo workflow.
   318	### 2. Pod Creation And ConfigMap/Secret Provisioning
   319
   320	Conditionally applicable:
   321
   322	- Create role pods such as `wm-po`, `wm-design`, `wm-arch`, `wm-mobile-dev`, `wm-api`, and `wm-qa`.
   323	- Provision ConfigMap content for role identity and pod-specific operating docs.
   324	- Inject only the minimum required secrets per role.
   325
   326	Required approval:
   327
   328	- Human/ops approval for pod creation, cost, resource sizing, and identity separation.
   329	- Secret issuance and injection by authorized operators.
   330
   331	Do not do before approval:
   332
   333	- Do not create pods.
   334	- Do not inject or print secrets.
   335	- Do not read full secret-bearing config contents.
   341
   342	- Create role-specific bot identities if approved.
   343	- Configure repository-scoped tokens with minimum privileges.
   344	- Configure branch protection and required checks for quality gate and new validators.
   345	- Configure release environment protection with human reviewer requirements.
   346
   347	Required approval:
   348
   349	- Human/ops approval and repository administrator action.
   350
   351	Do not do before approval:
   352
   353	- Do not change GitHub settings.
   354	- Do not generate tokens.
   355	- Do not claim branch protection is active from local validation alone.
   356
   363	- Keep GitHub as durable state and NATS as wake-up signal only.
   364
   365	Required approval:
   366
   367	- Platform/ops approval because webhook gateway configuration is external runtime state.
   368
   369	Do not do before approval:
   370
   371	- Do not configure or mutate external webhook routes.
   372	- Do not make NATS or A2A messages authoritative state.
   373	- Do not claim QA pod wake-up works until a live route is tested.
   374
   375	### 5. PR5 Live Native E2E Validation
   375	### 5. PR5 Live Native E2E Validation
   376
   376
   377	Conditionally applicable:
   378
   379	- Run the live native validation path only after credentials, project ids, and GitHub integration
   380	  are approved and injected.
   381	- Run a single controlled proof, ingest the evidence, and record the result under the required
   382	  evidence path.
   383
   384	Required approval:
   385
   386	- Human/ops approval for credential injection and live cloud usage.
   387
   388	Do not do before approval:
   389
   390	- Do not run auth checks or live validation commands.
   391	- Do not use a live robot token before approval.
   392	- Do not claim native E2E completion.
   399	- Run the final drill only after repo validators, platform pods, image, secrets, webhook routing,
   400	  branch protection, and live evidence ingestion path are all ready.
   401	- Test a synthetic feature request through planning, design, architecture/API, mobile dev, QA,
   402	  Gatekeeper, and human release block.
   403
   404	Required approval:
   405
   406	- Human/ops approval for 6-pod creation, cost, live routing, and external runtime use.
   416	human-gate policy, or the plan's corrected scope.
   417
   418	### 1. Production Release Submission Automation
   419
   420	Forbidden:
   421
   422	- Automating final production release submission.
   423	- Allowing a pod, LLM, script, or Gatekeeper check to bypass human release approval.
   424
   425	Reason:
   426
   427	- The plan's explicit success condition is that release remains blocked without
   428	  `human-approval.json`.
   429	- Human release gate weakening contradicts the repo gate model.
   430
   431	### 2. Weakening Human Gates
   432
   433	Forbidden:
   434
   435	- Treating a missing human approval as non-blocking.
   436	- Allowing an agent or role pod to approve its own blocker.
   437	- Accepting failed-gate risk without human decision evidence.
   444	### 3. Gatekeeper As LLM, Pod, Custom Agent, Or SOUL.md Owner
   445
   446	Forbidden:
   447
   448	- Creating a Gatekeeper LLM pod.
   449	- Giving Gatekeeper a SOUL.md as an operating role.
   450	- Letting a reviewer agent decide required-check pass/fail.
   451
   452	Reason:
   453
   454	- Gatekeeper is a deterministic required-check concept.
   455	- `06-gatekeeper/` may record CI output, but it must not be an LLM decision stage.
   456
   457	### 4. RN Web Or Railway Evidence As Native Replacement
   458
   459	Forbidden:
   460
   461	- Treating RN Web Playwright evidence as native E2E evidence.
   462	- Treating Railway/API smoke evidence as mobile native validation.
   463
   464	Reason:
   465
   466	- RN Web does not validate native modules, device permissions, native navigation/container behavior,
   467	  native lifecycle, app signing, or store/release candidate behavior.
   468	- Railway evidence validates backend/API reachability, not native mobile runtime.
   475	- Claiming local validation proves GitHub branch protection, webhook gateway behavior, EAS live
   476	  behavior, or external platform state.
   477
   478	Reason:
   479
   480	- Repo SoT explicitly limits local validation to repo-local rules.
   481	- External runtime state requires external evidence from the approved environment.
   482
   483	### 6. Secret Or Token Exposure
   484
   485	Forbidden:
   486
   487	- Printing, committing, or reporting full token-bearing config.
   488	- Recording token values in evidence.
   489	- Expanding status-only checks into secret dumps.
   490
   491	Reason:
   492
   493	- Repo operations policy permits only redacted status, presence, file mode, and key-name summaries.
   494
   495	### 7. External Platform Mutation From This Repo Workflow
   496
   497	Forbidden:
   498
   499	- Modifying external platform/runtime repositories from this repo.
   500	- Using this repo task to directly mutate k8s, image registry, webhook gateway, or external release
   501	  settings without approval.
   502
   503	Reason:
   504
   505	- The plan's Part D is an annex for ops requirements, not an execution authorization.
   509	`pnpm run test:runtime` is skipped for this applicability report because the user stated that
   510	another session is modifying the failing area. Therefore this report does not claim full runtime
   511	gate pass or fail.
   512
   513	Observed narrow check:
   514
   515	- `node scripts/validate-repo-operations.mjs` should be treated as the narrow relevant check for
   516	  the prior archive-term drift, not as a substitute for full `test:runtime`.
   517
   518	Not asserted:
   519
   520	- Full `pnpm run test:runtime` status.
   521	- PR readiness.

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
문서 흐름상, “NO_GO”는 현재 산출물 수용 여부에 대한 판정이고 “staged progress”는 그 NO_GO를 해소한 뒤의 허용 경로입니다. 둘을 섞어서 즉시 구현 가능하다고 읽으면 안 되는 구조입니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba REPO_OPERATIONS.md | sed -n '10,24p;71,72p;87,88p;107,128p;153,154p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
    10
    11	| Path | Owner Role |
    12	| --- | --- |
    13	| `AGENTS.md` | Mandatory agent execution rules, constraints, runtime paths, and required gates. |
    14	| `PROJECT_ENVIRONMENT.md` | Current runtime and environment facts. |
    15	| `REPO_OPERATIONS.md` | Canonical repo-wide operating policy and policy ownership model. |
    16	| `team-doc/mobile-app-dev-team/` | Team, role, process, reference, and migration documentation. |
    17	| `team-doc/00-source/` | Immutable Confluence source/export evidence. |
    18	| `team-doc/10-structured/` | Generated or structured reference layer, not current policy owner. |
    19	| `TEAM_DOC_ARCHIVE_MANIFEST.json` | Root-owned archive metadata for historical team-doc source/reference corpus. |
    20	| `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` | Root-owned archived content bundle for historical team-doc source/reference corpus. |
    21	| `scripts/` | Executable validation and test tooling, not policy owner. |
    22
    23	When these documents conflict, use the narrowest authoritative owner:
    24	`AGENTS.md` for agent instructions, `PROJECT_ENVIRONMENT.md` for runtime facts,
    71	Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime
    72	and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
    87	passwords, or full secret-bearing config contents. Reports must use redacted
    88	status, presence, file mode, and key-name summaries only.
   107	`pnpm run test:runtime` must compose those active current team/runtime gate
   108	checks. It must not include archive/reference corpus validation as a hidden
   109	runtime requirement.
   110
   111	Archive/reference corpus validation is explicit:
   112
   113	```text
   114	pnpm run validate:team-doc-archive
   115	```
   116
   117	Run `validate:team-doc-archive` when changing, moving, archiving, regenerating,
   118	or auditing `TEAM_DOC_ARCHIVE_MANIFEST.json`, `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`,
   119	historical `team-doc/00-source/`, historical `team-doc/10-structured/`, `_meta`
   120	source maps, or migration crosswalks. Do not treat that command as proof that
   121	the legacy Confluence-shaped corpus is current team/runtime SoT.
   122
   123	Runtime path or harness changes must also run `pnpm run test:local-harness`
   124	unless a source-backed blocker is reported.
   125
   126	Local validation and local harness evidence prove repo-local rules only. They do
   127	not prove actual OrbStack/OpenClaw pod execution, Jira or Confluence behavior,
   128	GitHub branch protection, EAS production submit, or external platform state.
   153	Future validator changes must keep required gates explicit in `package.json`
   154	and must include reviewer evidence before removing or demoting an existing check.

hook: PostToolUse
exec
/bin/zsh -lc "nl -ba PROJECT_ENVIRONMENT.md | sed -n '13,15p;61,80p;119,127p;160,174p;246,247p;275,276p;289,292p;308,308p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "nl -ba team-doc/mobile-app-dev-team/06-gates-and-evidence.md | sed -n '8,21p;35,42p;49,55p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
    13	  - `pnpm run test:runtime`
    14	  - `pnpm turbo run lint test`
    15	  - `pnpm run test:local-harness` for Codex runtime changes.
    61	- RN Web E2E validates only RN Web/browser-reproducible UI, navigation, state, and business logic flows.
    62	- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or other device/hardware features.
    63	- RN Web release E2E requires a deployed backend API URL through public client config:
    64	  - `EXPO_PUBLIC_API_URL=<deployed-api-url> pnpm --filter mobile e2e:web`
    65	  - `EXPO_PUBLIC_API_URL` is compiled into the client app and is not private; never put bearer tokens, signing keys, passwords, or private endpoints in it.
    66	  - The current Railway QA API URL verified for this workspace is `https://api-production-3d74.up.railway.app`.
    67	  - Evidence: `.evidence/e2e-test/20260609-233244-rn-web-railway-api/`.
    68	- Playwright launches Expo Web with deterministic public test config plus the caller-provided backend API URL:
    69	  - `EAS_BUILD=false`
    70	  - `EXPO_PUBLIC_APP_ENV=development`
    71	  - `EXPO_PUBLIC_APP_DISPLAY_NAME=Mobile App Template`
    72	  - `EXPO_PUBLIC_APP_SLUG=mobile-app-template`
    73	  - `EXPO_PUBLIC_APP_SCHEME=mobileapptemplate`
    74	  - `EXPO_PUBLIC_API_URL` from the command environment
    75	  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER=com.template.mobile`
    76	  - `EXPO_PUBLIC_ANDROID_PACKAGE=com.template.mobile`
    77	- `EXPO_PUBLIC_*` values are public client configuration and must not contain tokens, bearer credentials, signing keys, passwords, or private service endpoints.
    78	- Native completion remains separate:
    79	  - Run Maestro and `mobile-mcp` visual QA when the required EAS account, simulator, emulator, or device is available.
    80	  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.
   119	  - `EXPO_PUBLIC_APP_DISPLAY_NAME`: optional in the runtime parser, default is `Mobile App Template`; required explicitly by preview, production, and EAS build config.
   120	  - `EXPO_PUBLIC_API_URL`: required URL.
   121	- Public app config variables:
   122	  - `EXPO_PUBLIC_APP_SLUG`: required by preview, production, and EAS build config.
   123	  - `EXPO_PUBLIC_APP_SCHEME`: required by preview, production, and EAS build config.
   124	  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: required.
   125	  - `EXPO_PUBLIC_ANDROID_PACKAGE`: required.
   126	- Non-public variables:
   127	  - `EAS_PROJECT_ID`: optional UUID.
   160	  - `DATABASE_URL`: required URL.
   161	  - `API_PORT`: integer, default `3000`.
   162	  - `API_BEARER_TOKEN`: required secret.
   163	- Import direction remains routes to services to db only.
   164	- Shared API/domain schemas must come from `packages/contracts`.
   165	- Current Railway QA deployment:
   166	  - Project: `new-mobile-app`.
   167	  - API service: `api`.
   168	  - Postgres service: `Postgres`.
   169	  - API URL: `https://api-production-3d74.up.railway.app`.
   170	  - Latest verified API deployment id: `4c701f22-3ce9-40ef-a4bd-560252b773f3`.
   171	  - `GET /livez` returns `{"status":"ok"}`.
   172	  - `GET /readyz` returns `{"status":"ok"}`.
   173	  - Railway runtime variables include `DATABASE_URL`, `API_BEARER_TOKEN`, `PORT=3000`, `API_PORT=3000`, `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`, and `RAILWAY_HEALTHCHECK_PATH=/readyz`.
   174	  - Do not print or commit Railway secret values. `API_BEARER_TOKEN` was rotated after setup output exposed an earlier generated value.
   246	  - local visual QA/device automation is required for mobile UI/runtime checks when a simulator or device is available.
   247	  - it is excluded from required CI gates.
   275	    - the reviewer JSON envelope contains `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`; `GO` requires no Critical/High/Medium findings and required checks `PASS` or source-backed `NOT_APPLICABLE`, failed required checks map to `NO_GO`, missing required checks map to `BLOCKED`, and human-gate blockers map to `NEEDS_HUMAN`.
   276	    - researcher/advisor agents are advisory and are not valid `--json-envelope` targets.
   289	  - `pnpm run test:runtime`
   290	  - `pnpm turbo run lint test`
   291	- Does not run `mobile-mcp`; mobile device automation remains a local QA gate.
   292	- Runs `pnpm run test:local-harness` when these paths change:
   308	- Do not add secrets, customer-specific identifiers, or production API URLs to the repo.

 succeeded in 0ms:
     8	| Codex runtime artifact | `pnpm run test:runtime` |
     9	| Runtime path/local harness | `pnpm run test:local-harness` |
    10	| Mobile environment/runtime | `expo install --check`, mobile lint/test/doctor, `codex mcp list` |
    11	| Mobile UI/runtime with available device | Serial `mobile-mcp` visual QA/device automation |
    12	| RN Web E2E | Playwright command output and `.evidence/e2e-test/...` artifacts |
    13	| Native E2E | Maestro/mobile-mcp evidence when simulator/device is available |
    14	| Production submit | Human approval record plus release evidence |
    15
    16	## Release Gatekeeper (System)
    17
    18	- Release Gatekeeper (System) is the display title for the non-LLM deterministic Gatekeeper.
    19	- It is not a person, custom agent, LLM role, or SOUL.md owner.
    20	- It cannot replace human approval or accept failed-gate risk.
    21	- It only consumes required evidence and returns deterministic pass/fail.
    35	- Durable GitHub handoff means a downstream pod consumes a branch/commit/PR or merged repo artifact, not another pod local workspace.
    36	- Work-unit QA files are summaries and indexes. They must link canonical evidence instead of replacing it.
    37	- Canonical evidence remains in workflow-owned paths such as `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`, mobile-mcp records, Railway evidence, EAS evidence, or human approval records.
    38	- `.evidence/local/`, `.evidence/tmp/`, `.evidence/**/*.log`, and `.evidence/**/raw/` are not durable handoff channels.
    39
    40	## Railway Boundary
    41
    42	`qa-railway-workflow` can prove Railway CLI setup, service/database/domain/deploy status, health endpoints, and RN Web E2E against a deployed API URL.
    49	- Maestro native automation.
    50	- Store submission readiness.
    51	- Full production release approval.
    52
    53	## Human Gates
    54
    55	Stop for recorded human decision when work involves:

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "nl -ba AGENTS.md | sed -n '10,18p;37,46p;57,58p;89,90p;102,110p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
    10
    11	## Required Rules
    12
    13	- TDD required: write or update tests before implementation changes.
    14	- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
    15	- No direct push to `main`; use a branch and PR.
    16	- Do not modify external platform/runtime repositories from this repository.
    17	- RN UI uses NativeWind + React Native primitives + semantic design tokens; web-only shadcn/ui is N/A for React Native screens (apply shadcn/ui only to optional web console).
    18
    37	- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
    38	- `.agents/`, `.codex/`, `evals/`, `scripts/` — Codex runtime layer, maintained through the runtime gates below
    39
    40	## Expo / React Native Runtime Policy
    41
    42	- Current mobile baseline is Expo SDK 56 (`expo ~56.0.9`) with React Native 0.85, NativeWind v5 preview, Tailwind CSS v4, and `expo-dev-client`.
    43	- Environment/runtime changes must keep `PROJECT_ENVIRONMENT.md` and the Confluence update document in sync with actual repo settings.
    44	- Before a mobile environment change is considered done, verify mobile lint/test, `expo install --check`, native run smoke on iOS/Android when available, and Maestro smoke where available.
    45	- Official Expo skills may be introduced in a separate verified step with `npx skills add expo/skills`. Official Expo skills should cover generic Expo/RN workflows; repo skills remain responsible for this project's contracts, role boundaries, evidence, and QA gates.
    46	- `mobile-mcp` is the required local visual QA/device automation MCP. Pin its version in `.codex/config.toml`, do not use `@latest`, do not add it to required CI gates, and do not parallelize simulator/device operations.
    57	- `pnpm run test:local-harness` validates Codex CLI runtime structure, role boundaries, skill/agent/hook configuration, gatekeeper/evidence fixtures, and best-effort headless Codex smoke.
    58	- It is not an app feature test suite and does not prove Jira, Confluence, GitHub branch protection, EAS build/submit, production submit, or external platform/runtime behavior.
    89	- All changes go through a branch + PR. The quality-gate workflow must pass before merge.
    90	- Codex runtime changes under `.agents/`, `.codex/`, `evals/{skills,agents,hooks,local-harness}/`, or runtime scripts must pass the conditional local harness gate.
   102	## Definition of Done / Verification
   103
   104	Before opening a PR, verify:
   105
   106	1. Workspace lint and tests pass: `pnpm turbo run lint test`
   107	2. Codex runtime artifacts are intact: `pnpm run test:runtime`
   108	3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
   109	4. For mobile environment/runtime changes, verify `pnpm --filter mobile exec expo install --check`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`, `pnpm --filter mobile run doctor`, and `codex mcp list`
   110	5. For mobile UI/runtime changes with an available simulator or device, run local `mobile-mcp` visual QA/device automation serially and record the result in PR evidence

exec
/bin/zsh -lc "nl -ba .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md | sed -n '1,90p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Orbstack Boram Linux SoT Check
     2
     3	- Date: 2026-06-09
     4	- Scope: check whether local Orbstack `boram-*` pod can be used for Linux/Android E2E verification.
     5	- Result: Linux pod exists, but it is not currently an Android local E2E verification environment.
     6
     7	## Local Kubernetes Check
     8
     9	Current Kubernetes context:
    10
    11	```text
    12	orbstack
    13	```
    14
    15	Matching pod:
    16
    17	```text
    18	clawpod/boram-vf7sbm-agent-0   2/2   Running
    19	```
    20
    21	Pod containers:
    22
    23	```text
    24	agent
    25	ontology-bridge
    26	```
    27
    28	Pod details:
    29
    30	- Namespace: `clawpod`
    31	- Node: `orbstack`
    32	- Pod IP: `192.168.194.120`
    33	- Workload: `StatefulSet/boram-vf7sbm-agent`
    34	- `agent` container image: `clawpod/agent:local`
    35	- `ontology-bridge` container image: `clawpod-ontology-bridge:latest`
    36	- `agent` mounts `/workspace` as RW PVC.
    37	- `ontology-bridge` mounts `/workspace` as RO.
    38
    39	## Container Environment Check
    40
    41	`agent` container:
    42
    43	```text
    44	Linux boram-vf7sbm-agent-0 ... aarch64 GNU/Linux
    45	Ubuntu 24.04.4 LTS
    46	node v22.22.2
    47	pnpm 10.33.3
    48	git version 2.43.0
    49	no /dev/kvm
    50	java: not found
    51	adb: not found
    52	emulator: not found
    53	maestro: not found
    54	```
    55
    56	`ontology-bridge` container:
    57
    58	```text
    59	Linux boram-vf7sbm-agent-0 ... aarch64
    60	Alpine Linux 3.23.3
    61	node v22.22.1
    62	no /dev/kvm
    63	java: not found
    64	adb: not found
    65	emulator: not found
    66	maestro: not found
    67	```
    68
    69	Workspace check:
    70
    71	- `/workspace/projects` exists, but no checked-out `new-mobile-app` repo was found there.
    72	- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.
    73
    74	## SoT Comparison
    75
    76	Repo SoT requires:
    77
    78	- Mobile lint/test, `expo install --check`, `expo doctor`, and `codex mcp list` for mobile runtime changes.
    79	- Local `mobile-mcp` visual QA only when simulator/device is available.
    80	- Maestro smoke only when a usable target and executable app id exist.
    81	- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.
    82
    83	Existing repo evidence also says:
    84
    85	- Android/Ubuntu can cover Android QA only when Android SDK, platform tools, KVM, and device/emulator prerequisites are configured.
    86	- The current Maestro flow still contains `appId: {{ANDROID_PACKAGE}}`, which is a project-generation placeholder, not a runtime env variable.
    87
    88	## Assessment
    89
    90	The Boram pod is usable as a general Linux execution container for limited tasks:

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "nl -ba /Users/tw.kim/.claude/plans/luminous-snacking-moler.md | sed -n '1,55p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# 검토 계획: applicability 판정문(GO) 교차 검증 결과 반영
     2
     3	**계획서 Path: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`**
     4
     5	## Context
     6
     7	사용자가 제시한 applicability 판정 체계 3건을 전문 교차 검증했다:
     8
     9	- 판정문: `.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md` (552행 전문 확인)
    10	- 1차 xhigh: `...-xhigh-review-20260610.md` (verdict NO_GO — stale gate status, CONDITIONAL_GO 오인 위험 지적)
    11	- 정정 후 xhigh 재검토: `...-xhigh-rereview-20260610.md` (verdict **GO**, findings 0건, residual risk 2건 — envelope 직접 확인)
    12
    13	## 교차 검증 판단 (냉철 평가)
    14
    15	**판정문은 수용 가능하다.** 즉시 적용/조건부/금지의 3분할이 13번 계획서 E-0,
    16	`AGENTS.md`, `REPO_OPERATIONS.md`, `06-gates-and-evidence.md`와 정합하고, pnpm pin
    17	mismatch 정정이 boram 증거(`orbstack-boram-linux-sot-check.md:47`)와 일치하며, GO의
    18	효력 범위 한정(구현 승인·PR-ready·live readiness·native 완료 아님)도 정확하다.
    19
    20	단, 교차 검증에서 **판정문이 다루지 못한 보완점 3건**을 확인했다:
    21
    22	1. **(실측 확인됨) 13번 계획서의 stale 라인 인용**: 동시 세션이 `validate-team-doc.mjs`를
    23	   대규모 수정(+536/-163)하여, 13번 문서 G8이 인용하는 `validate-team-doc.mjs:236-250`
    24	   (team-doc secret 스캔)이 현재 **81행**으로 이동, CTO 규칙도 1114→**966행**으로 이동.
    25	   1차 xhigh가 NO_GO 사유로 삼았던 것과 같은 종류의 stale reference가 13번 문서에 재발생.
    26	2. **게이트 re-baseline이 구현 착수의 명시적 전제 조건**: 판정문은 test:runtime skip을
    27	   기록만 했으나, PR1 수용 기준이 test:runtime green을 요구하므로 "동시 세션 안정화 →
    28	   전체 게이트 재실행·기록"을 PR1 착수 전 선행 단계로 격상해야 함.
    29	3. **세션 plan 재기준선**: 이전 세션 plan의 Phase 0(13번 fact 정정)은 이미 완료됨 —
    30	   재적용 방지를 위해 본 파일로 대체.
    31
    32	판정문 자체의 오류는 발견하지 못함. 사용자 피드백 요약과 판정문 원문도 불일치 없음.
    33
    34	## 실행 (승인 후, 최소 변경)
    35
    36	1. **13번 계획서 stale 인용 1건 정정**: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
    37	   G8의 `validate-team-doc.mjs:236-250` → 라인 번호 제거, "validate-team-doc.mjs의
    38	   team-doc 한정 secret 패턴 스캔(현재 구현 기준 `secretPatterns`)" 동작 기준 표현으로 교체
    39	   (향후 라인 이동에 면역). 다른 소스/스크립트는 일절 수정하지 않음.
    40	2. **교차 검증 피드백 기록**: `.evidence/reviews/pod-organization-e2e-applicability-crosscheck-20260610.md`
    41	   신규 작성 — 위 판단(수용 + 보완점 3건)을 근거 경로와 함께 기록. 구현/외부/라이브
    42	   작업은 판정문 제약 그대로 차단 유지 명시.
    43	3. **좁은 검증만 실행**: `node scripts/validate-team-doc.mjs` 1회(13번 문서 수정 정합 확인).
    44	   전체 `test:runtime`은 사용자 skip 지시(동시 세션 수정 중) 유지 — 실행하지 않고
    45	   "재기준선 필요"로 보고에 명시.
    46	4. **보고**: 판정 수용 + 보완점 3건 + 다음 단계(게이트 re-baseline 후 PR1 착수 가능)를
    47	   계획서 Path와 함께 보고.
    48
    49	## 하지 않는 것
    50
    51	- PR1~PR7 구현 착수(별도 승인 대기), 전체 test:runtime 실행(사용자 skip 지시 유지),
    52	  Part D ops/플랫폼 작업, 토큰/라이브 EAS, `validate-team-doc.mjs` 등 동시 세션 작업
    53	  영역의 소스 수정.

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
**Findings**

- 결론 검증 결과는 **GO**입니다. 단, 이 GO는 “draft conclusion이 맞다”는 의미이지, 현재 계획서 as-is 수용이나 구현 승인 의미가 아닙니다.
- 최신 xhigh는 여전히 [PR7 stale line citation](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279) 때문에 **NO_GO**이며, 다음 행동을 “PR7 stale citation 수정 → `node scripts/validate-team-doc.mjs` → 동시 runtime 편집 안정화 후 `pnpm run test:runtime` 재기준선 기록”으로 제한합니다. 근거: [latest xhigh](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1070), [scope](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1073).
- 따라서 staged progress는 가능합니다. 하지만 PR1~PR7/PR5 offline 착수는 re-baseline 전에는 막혀 있고, TDD/validator-first는 [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:13) 및 runtime gate 요구와 맞물립니다.
- 구현/PR-ready/live readiness/native completion은 오늘 허용되지 않습니다. 상세 보고서도 “repo-scoped offline-first roadmap”일 뿐 live cloud/native 완료 승인이 아니라고 명시합니다: [detailed report](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:20).
- human/ops 차단과 금지 항목도 draft와 일치합니다. Part D는 승인 전 실행 금지이고 [plan](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:417), Gatekeeper는 비-LLM deterministic system입니다: [gates](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/06-gates-and-evidence.md:18).
- 방향성 개선도 타당합니다: work-unit 상태, human-gate envelope, deterministic resolver, pod bootstrap pin 정렬, evidence ladder, SoT/evidence hygiene가 현재 “문서/프로세스”를 repo-operable workflow로 바꾸는 축입니다. 특히 pnpm mismatch와 native E2E 한계는 boram 증거와 일치합니다: [boram evidence](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47).

```json
{
  "verdict": "GO",
  "reviewer": "reviewer(xhigh)",
  "mode": "review-only",
  "scope": "validate staged-progress conclusion after latest PR7 stale-citation NO_GO",
  "conclusion": "The draft conclusion is correct: staged progress remains possible only after fixing the remaining PR7 stale citation, rerunning narrow validate-team-doc, then recording a full test:runtime re-baseline after concurrent runtime edits stabilize.",
  "current_state": {
    "as_is_plan_acceptance": "NO_GO",
    "reason": "One remaining stale PR7 validate-team-doc.mjs line citation",
    "implementation_or_pr_ready_today": false,
    "live_readiness_or_native_completion_today": false
  },
  "allowed_next_order": [
    "Fix PR7 stale line citation in the plan",
    "Rerun node scripts/validate-team-doc.mjs",
    "Wait for concurrent runtime edits to stabilize",
    "Run and record pnpm run test:runtime re-baseline",
    "Then start repo-internal offline PR1/PR2/PR3/PR4/PR6/PR7 and PR5 offline work under TDD/validator-first"
  ],
  "blocked_until_human_ops": [
    "Part D platform work",
    "image build/push",
    "pod creation",
    "webhook routing",
    "Secret/token provisioning",
    "branch protection",
    "release environment protection",
    "PR5 live native E2E",
    "multi-pod rollout"
  ],
  "always_forbidden": [
    "production submit automation",
    "release human-gate weakening",
    "Gatekeeper modeled as LLM/pod/SOUL owner",
    "RN Web/Railway/local validation claimed as native or external proof",
    "secret exposure",
    "direct external platform mutation from this repo workflow"
  ],
  "directional_improvements": [
    "deterministic repo-operable workflow instead of prose-only process",
    "machine-readable work-unit state and human-gate records",
    "durable GitHub handoff state",
    "deterministic next-action resolver instead of ad hoc LLM routing",
    "pod bootstrap aligned to repo pnpm pin with fail-fast checks",
    "clear separation of RN Web, native E2E, and human-device evidence",
    "SoT drift, evidence hygiene, and preflight checks",
    "external platform work retained as ops annex rather than uncontrolled repo action"
  ]
}
```
hook: Stop
hook: Stop Completed
tokens used
66,857
**Findings**

- 결론 검증 결과는 **GO**입니다. 단, 이 GO는 “draft conclusion이 맞다”는 의미이지, 현재 계획서 as-is 수용이나 구현 승인 의미가 아닙니다.
- 최신 xhigh는 여전히 [PR7 stale line citation](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279) 때문에 **NO_GO**이며, 다음 행동을 “PR7 stale citation 수정 → `node scripts/validate-team-doc.mjs` → 동시 runtime 편집 안정화 후 `pnpm run test:runtime` 재기준선 기록”으로 제한합니다. 근거: [latest xhigh](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1070), [scope](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-crosscheck-latest-xhigh-20260610.md:1073).
- 따라서 staged progress는 가능합니다. 하지만 PR1~PR7/PR5 offline 착수는 re-baseline 전에는 막혀 있고, TDD/validator-first는 [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:13) 및 runtime gate 요구와 맞물립니다.
- 구현/PR-ready/live readiness/native completion은 오늘 허용되지 않습니다. 상세 보고서도 “repo-scoped offline-first roadmap”일 뿐 live cloud/native 완료 승인이 아니라고 명시합니다: [detailed report](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:20).
- human/ops 차단과 금지 항목도 draft와 일치합니다. Part D는 승인 전 실행 금지이고 [plan](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:417), Gatekeeper는 비-LLM deterministic system입니다: [gates](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/06-gates-and-evidence.md:18).
- 방향성 개선도 타당합니다: work-unit 상태, human-gate envelope, deterministic resolver, pod bootstrap pin 정렬, evidence ladder, SoT/evidence hygiene가 현재 “문서/프로세스”를 repo-operable workflow로 바꾸는 축입니다. 특히 pnpm mismatch와 native E2E 한계는 boram 증거와 일치합니다: [boram evidence](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47).

```json
{
  "verdict": "GO",
  "reviewer": "reviewer(xhigh)",
  "mode": "review-only",
  "scope": "validate staged-progress conclusion after latest PR7 stale-citation NO_GO",
  "conclusion": "The draft conclusion is correct: staged progress remains possible only after fixing the remaining PR7 stale citation, rerunning narrow validate-team-doc, then recording a full test:runtime re-baseline after concurrent runtime edits stabilize.",
  "current_state": {
    "as_is_plan_acceptance": "NO_GO",
    "reason": "One remaining stale PR7 validate-team-doc.mjs line citation",
    "implementation_or_pr_ready_today": false,
    "live_readiness_or_native_completion_today": false
  },
  "allowed_next_order": [
    "Fix PR7 stale line citation in the plan",
    "Rerun node scripts/validate-team-doc.mjs",
    "Wait for concurrent runtime edits to stabilize",
    "Run and record pnpm run test:runtime re-baseline",
    "Then start repo-internal offline PR1/PR2/PR3/PR4/PR6/PR7 and PR5 offline work under TDD/validator-first"
  ],
  "blocked_until_human_ops": [
    "Part D platform work",
    "image build/push",
    "pod creation",
    "webhook routing",
    "Secret/token provisioning",
    "branch protection",
    "release environment protection",
    "PR5 live native E2E",
    "multi-pod rollout"
  ],
  "always_forbidden": [
    "production submit automation",
    "release human-gate weakening",
    "Gatekeeper modeled as LLM/pod/SOUL owner",
    "RN Web/Railway/local validation claimed as native or external proof",
    "secret exposure",
    "direct external platform mutation from this repo workflow"
  ],
  "directional_improvements": [
    "deterministic repo-operable workflow instead of prose-only process",
    "machine-readable work-unit state and human-gate records",
    "durable GitHub handoff state",
    "deterministic next-action resolver instead of ad hoc LLM routing",
    "pod bootstrap aligned to repo pnpm pin with fail-fast checks",
    "clear separation of RN Web, native E2E, and human-device evidence",
    "SoT drift, evidence hygiene, and preflight checks",
    "external platform work retained as ops annex rather than uncontrolled repo action"
  ]
}
```
