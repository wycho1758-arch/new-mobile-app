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
session id: 019eb114-9a02-7340-9c9f-c79f16db645e
--------
user
You are reviewer(xhigh) for a WonderMove $wm review-only task. Do not edit files. Do not inspect or print secrets. Do not delegate.

Re-review the corrected detailed applicability report only for the prior findings and overall split validity:
- .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md
Relevant SoT:
- .agents/skills/wm/SKILL.md
- team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
- /Users/tw.kim/.claude/plans/luminous-snacking-moler.md
- AGENTS.md
- PROJECT_ENVIRONMENT.md
- REPO_OPERATIONS.md
- .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md

User instructed to skip full test:runtime because another session is modifying that area. Narrow check just run by main agent: node scripts/validate-repo-operations.mjs exited 0.

Confirm whether the corrected report is now acceptable as a detailed applicability report. Return Korean findings and one machine-readable reviewer JSON envelope.
2026-06-10T10:29:39.578465Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when AuthRequired(AuthRequiredError { www_authenticate_header: "Bearer error=\"invalid_token\", error_description=\"Token has expired. Please re-authenticate to obtain a new token.\"" })
hook: SessionStart
hook: SessionStart Completed
codex
wm 스킬을 적용합니다. 요청 범위가 리뷰 전용이므로 파일은 읽기만 하고, 지정된 보고서와 SoT만 대조해 prior findings 재검증과 split validity 판단에 한정하겠습니다.
codex
먼저 보고서와 로컬 SoT를 읽어 근거를 확보하겠습니다. 외부 경로로 지정된 Claude plan 파일은 접근 가능 여부만 확인하고, 접근이 막히면 그 한계를 별도로 표시하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse
exec
/bin/zsh -lc 'wc -l .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "sed -n '1,240p' .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "sed -n '241,520p' .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     552 .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md

 succeeded in 0ms:
- Any documentation update must keep `PROJECT_ENVIRONMENT.md` synchronized with actual repo files.

Do not over-apply:

- Do not make Confluence or Atlassian online access a mandatory local gate.
- Do not treat generated or historical docs as stronger than root SoT.

### 8. PR7: Hardening For Stitch, mobile-mcp Pin Drift, And Evidence Hygiene

Applicable:

- Add status-only Design preflight checks for Stitch/ADC/project configuration.
- Add offline drift check for mobile-mcp pin consistency between `.codex/config.toml` and
  `PROJECT_ENVIRONMENT.md`.
- Add evidence hygiene validation for evidence directory naming, forbidden raw/log/temp paths,
  and secret-pattern scanning.
- Add planted-secret fixtures to prove the scanner fails safely.

Why this is applicable:

- `mobile-mcp` is required local visual QA/device automation, but must not be a required CI device gate.
- Evidence hygiene is currently largely policy text rather than broad file validation.
- Stitch failures should be found before a design role reaches execution time.

Required constraints:

- Do not add device/simulator execution to CI.
- Do not print credentials while checking ADC or project status.
- Existing evidence files that fail a new hygiene rule should be handled deliberately; do not delete
  them blindly.

Do not over-apply:

- Do not make mobile-mcp parallel or CI-required.
- Do not convert evidence hygiene into destructive cleanup.

### 9. README And Source Map Registration

Applicable:

- Keep the 13번 plan registered in `team-doc/mobile-app-dev-team/README.md`.
- Keep the crosswalk/source-map entry in `team-doc/mobile-app-dev-team/99-source-map.md`.

Why this is applicable:

- Managed team docs need discoverability.
- The plan is a current project improvement plan, not a historical source export.

Do not over-apply:

- Do not make `13-pod-organization-e2e-improvement-plan.md` a higher-priority policy SoT than
  `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, or `REPO_OPERATIONS.md`.

## Conditionally Applicable: Only After Human/Ops Approval

These items are valid requirements, but they must remain blocked until explicit human/ops approval
is recorded. They are not repo-only work.

### 1. OpenClaw Agent Image Build And Push

Conditionally applicable:

- Build `clawpod/agent-mobile` and `clawpod/agent-mobile:lite` images.
- Include pnpm pin alignment, cloud CLI support, Maestro cloud-upload support, watchman, and warm
  pnpm store layers as applicable.
- Keep Android SDK/adb/emulator excluded from the pod image unless the runtime capabilities change.

Required approval:

- Human/ops approval for image build/push.
- Platform owner execution, because image changes are outside this repo.

Do not do before approval:

- Do not build, push, or mutate platform images from this repo workflow.
- Do not present image requirements as already implemented.

### 2. Pod Creation And ConfigMap/Secret Provisioning

Conditionally applicable:

- Create role pods such as `wm-po`, `wm-design`, `wm-arch`, `wm-mobile-dev`, `wm-api`, and `wm-qa`.
- Provision ConfigMap content for role identity and pod-specific operating docs.
- Inject only the minimum required secrets per role.

Required approval:

- Human/ops approval for pod creation, cost, resource sizing, and identity separation.
- Secret issuance and injection by authorized operators.

Do not do before approval:

- Do not create pods.
- Do not inject or print secrets.
- Do not read full secret-bearing config contents.
- Do not treat pod specs in a document as live pod evidence.

### 3. GitHub Bot Accounts, Tokens, Branch Protection, And Required Checks

Conditionally applicable:

- Create role-specific bot identities if approved.
- Configure repository-scoped tokens with minimum privileges.
- Configure branch protection and required checks for quality gate and new validators.
- Configure release environment protection with human reviewer requirements.

Required approval:

- Human/ops approval and repository administrator action.

Do not do before approval:

- Do not change GitHub settings.
- Do not generate tokens.
- Do not claim branch protection is active from local validation alone.

### 4. Webhook Gateway And NATS Routing

Conditionally applicable:

- Add webhook rules for PR opened/synchronized with `next:<role>`, check failures, and PR merge events.
- Route signals to the correct role pod room.
- Keep GitHub as durable state and NATS as wake-up signal only.

Required approval:

- Platform/ops approval because webhook gateway configuration is external runtime state.

Do not do before approval:

- Do not configure or mutate external webhook routes.
- Do not make NATS or A2A messages authoritative state.
- Do not claim QA pod wake-up works until a live route is tested.

### 5. PR5 Live Native E2E Validation

Conditionally applicable:

- Run the live native validation path only after credentials, project ids, and GitHub integration
  are approved and injected.
- Run a single controlled proof, ingest the evidence, and record the result under the required
  evidence path.

Required approval:

- Human/ops approval for credential injection and live cloud usage.

Do not do before approval:

- Do not run auth checks or live validation commands.
- Do not use a live robot token before approval.
- Do not claim native E2E completion.
- Do not ignore the unresolved Maestro app id placeholder.

### 6. Multi-Pod Rollout Drill

Conditionally applicable:

- Run the final drill only after repo validators, platform pods, image, secrets, webhook routing,
  branch protection, and live evidence ingestion path are all ready.
- Test a synthetic feature request through planning, design, architecture/API, mobile dev, QA,
  Gatekeeper, and human release block.

Required approval:

- Human/ops approval for 6-pod creation, cost, live routing, and external runtime use.

Do not do before approval:

- Do not run the drill locally and call it multi-pod proof.
- Do not treat local harness, source review, or fixture tests as OrbStack/OpenClaw execution proof.

## Always Forbidden: Do Not Apply

These are not "later" items. They must not be applied because they conflict with repo policy,
human-gate policy, or the plan's corrected scope.

### 1. Production Release Submission Automation

Forbidden:

- Automating final production release submission.
- Allowing a pod, LLM, script, or Gatekeeper check to bypass human release approval.

Reason:

- The plan's explicit success condition is that release remains blocked without
  `human-approval.json`.
- Human release gate weakening contradicts the repo gate model.

### 2. Weakening Human Gates

Forbidden:

- Treating a missing human approval as non-blocking.
- Allowing an agent or role pod to approve its own blocker.
- Accepting failed-gate risk without human decision evidence.

Reason:

- Human gate records exist to preserve explicit accountability.
- Failed-gate risk acceptance is outside LLM authority.

### 3. Gatekeeper As LLM, Pod, Custom Agent, Or SOUL.md Owner

Forbidden:

- Creating a Gatekeeper LLM pod.
- Giving Gatekeeper a SOUL.md as an operating role.
- Letting a reviewer agent decide required-check pass/fail.

Reason:

- Gatekeeper is a deterministic required-check concept.
- `06-gatekeeper/` may record CI output, but it must not be an LLM decision stage.

### 4. RN Web Or Railway Evidence As Native Replacement

Forbidden:

- Treating RN Web Playwright evidence as native E2E evidence.
- Treating Railway/API smoke evidence as mobile native validation.

Reason:

- RN Web does not validate native modules, device permissions, native navigation/container behavior,
  native lifecycle, app signing, or store/release candidate behavior.
- Railway evidence validates backend/API reachability, not native mobile runtime.

### 5. Local Validation As External Runtime Proof

Forbidden:

- Claiming local harness proves actual OrbStack/OpenClaw pod execution.
- Claiming local validation proves GitHub branch protection, webhook gateway behavior, EAS live
  behavior, or external platform state.

Reason:

- Repo SoT explicitly limits local validation to repo-local rules.
- External runtime state requires external evidence from the approved environment.

### 6. Secret Or Token Exposure

Forbidden:

- Printing, committing, or reporting full token-bearing config.
- Recording token values in evidence.
- Expanding status-only checks into secret dumps.

Reason:

- Repo operations policy permits only redacted status, presence, file mode, and key-name summaries.

### 7. External Platform Mutation From This Repo Workflow

Forbidden:

- Modifying external platform/runtime repositories from this repo.
- Using this repo task to directly mutate k8s, image registry, webhook gateway, or external release
  settings without approval.

Reason:

- The plan's Part D is an annex for ops requirements, not an execution authorization.

## Current Gate Status

`pnpm run test:runtime` is skipped for this applicability report because the user stated that
another session is modifying the failing area. Therefore this report does not claim full runtime
gate pass or fail.

Observed narrow check:

- `node scripts/validate-repo-operations.mjs` should be treated as the narrow relevant check for
  the prior archive-term drift, not as a substitute for full `test:runtime`.

Not asserted:

- Full `pnpm run test:runtime` status.

 succeeded in 0ms:
# Pod Organization E2E Applicability Detailed Report

Date: 2026-06-10
Mode: `$wm` review-only applicability judgment
Primary plan: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
Session plan: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`

## SoT And Evidence Inputs

- Repo mandatory rules: `AGENTS.md`
- Runtime facts: `PROJECT_ENVIRONMENT.md`
- Repo operations policy: `REPO_OPERATIONS.md`
- Managed team-doc index and source map: `team-doc/mobile-app-dev-team/README.md`, `team-doc/mobile-app-dev-team/99-source-map.md`
- Primary plan under review: `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- Pod evidence: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`
- Session execution plan: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`

## Overall Judgment

The updated plan is applicable only as a repo-scoped, offline-first improvement roadmap.
It is not approval to operate external platform resources, inject secrets, change branch protection,
execute live cloud validation, or claim native E2E completion.

The prior blocking factual issue is resolved at the plan level: the pod problem is no longer
described as missing pnpm. It is correctly described as a pin mismatch between boram pod pnpm
`10.33.3` and repo SoT `pnpm@9.15.9`. The remaining pod gaps for cloud CLI, Maestro, adb,
emulator, Java, mobile-mcp, and KVM remain valid.

The current full runtime gate is intentionally not asserted in this report. The user instructed
to skip `test:runtime` because another session is concurrently modifying that area. This does not
make the updated applicability split invalid, but it does mean this report must not claim PR-ready
or runtime-gate green status.

## Immediately Applicable: Repo-Internal Offline Work

These items can be applied now only inside this repository and only with tests, fixtures,
validators, and documentation updates. They must not perform external platform operations or
credentialed online actions.

### 1. Fact Correction And Plan Registration

Applicable:

- Keep the factual correction that boram pod has pnpm `10.33.3`, while the repo SoT pin is
  `pnpm@9.15.9`.
- Keep the statement that canary parity is inferred only; direct checked-in evidence is boram.
- Keep the remaining absence findings for cloud CLI, Maestro, Android SDK, adb, emulator,
  Java, mobile-mcp, and KVM.
- Keep registration of the plan in `README.md` and `99-source-map.md`, because those files are
  the managed team-doc navigation layer.

Why this is applicable:

- The repo package manager pin is in `package.json`.
- The boram evidence records pnpm `10.33.3`.
- The primary plan marks itself as non-policy SoT and defers to root SoT on conflict.

Do not over-apply:

- Do not generalize boram evidence to all pods as proven fact unless each pod is directly measured.
- Do not rewrite the gap back to "pnpm missing."
- Do not treat this fact correction as proof that pod execution works.

### 2. PR1: Work-Unit Status Machine

Applicable:

- Add `docs/plans/work-units/<work-unit-id>/status.json` with a deterministic `wu-status/v1`
  schema.
- Add a shared state machine module and validator for stage state, legal transitions, retry count,
  reviewer envelope presence, handoff links, append-only events, and Gatekeeper invariants.
- Add local fixtures for valid and invalid work-unit states.
- Wire the validator into `test:runtime`, the quality gate workflow, and runtime documentation
  only after the tests/fixtures exist.

Why this is applicable:

- The plan identifies the lack of machine-readable work-unit state as the core autonomy gap.
- GitHub branch/commit/PR is already the durable handoff model for pod-isolated role agents.
- Deterministic status validation matches the non-LLM Gatekeeper model.

Required constraints:

- TDD/validator-first is mandatory.
- `06-gatekeeper` must remain a deterministic CI stage, not an LLM reviewer stage.
- A stage must not move to `done` without real artifacts, reviewer envelope where applicable,
  and a handoff reference.

Do not over-apply:

- Do not make `status.json` a substitute for human approval.
- Do not let an LLM decide gate pass/fail.
- Do not claim this proves pod orchestration; it only creates repo-local machine-readable state.

### 3. PR2: Human-Gate Decision Envelope

Applicable:

- Add a machine-readable human-gate decision schema such as `human-gate/v1`.
- Require fields such as gate id, category, decision, scope, human decider identity, decision
  reference, timestamp, residual risk, and evidence links.
- Enforce anti-self-approval: role names and agent names must not be valid human approvers.
- Require an approved decision file before a `blocked-human` stage can resume.

Why this is applicable:

- Current reviewer verdicts can say `NEEDS_HUMAN`, but the repo lacks a deterministic way to
  record and validate release from that blocked state.
- A machine-readable human decision record preserves the human gate while allowing deterministic
  pipeline resumption.

Required constraints:

- Human-gate authenticity is a policy-level GitHub identity anchor, not cryptographic proof.
- Failed-gate risk acceptance must remain a human decision.
- Release approval must remain blocking when `human-approval.json` is absent.

Do not over-apply:

- Do not let a role pod create its own approval.
- Do not treat a reviewer comment, chat message, or local note as approval unless it is captured
  in the approved schema and reference model.
- Do not weaken the release human gate for convenience.

### 4. PR3: Deterministic Next-Action Resolver And `wm-orchestrate`

Applicable:

- Add a pure resolver that reads `status.json` plus the filesystem and emits `next_actions[]`
  and `blocked[]`.
- Add a repo-local orchestration skill that executes only the current role's assigned action.
- Require the resolver to stop when the only next state is blocked by a missing human decision.
- Use advisory reviewer/fix helpers only after deterministic state says a retry or fix path is
  allowed.

Why this is applicable:

- The gap is not that each role lacks skills; the gap is "who acts next" and "what state allows it."
- A deterministic resolver preserves Gatekeeper philosophy and prevents ad hoc LLM routing.

Required constraints:

- The skill must not execute another role's stage.
- It must not modify reviewer envelopes or human approval records except to create pending
  requests where the schema allows that.
- It must not convert local chat state into durable state; durable state is committed repo state.

Do not over-apply:

- Do not add a seventh PM/orchestrator LLM pod for decision-making.
- Do not let NATS messages become the source of truth.
- Do not treat resolver dry-runs as proof that GitHub webhook routing works.

### 5. PR4: Repo-Side Pod Bootstrap Contract

Applicable:

- Extend `codex-preflight` for Linux pod mode.
- Add pnpm pin validation: repo expects `pnpm@9.15.9`; mismatch must fail.
- Add status-only checks for node major, git identity, GitHub CLI auth status, Chromium presence,
  MCP list status, role context fixture presence, and selected role capability flags.
- Add a pod-native skill source for role bootstrap under the managed team-doc OpenClaw skill
  source area.
- Add tests/fixtures for Linux pod preflight behavior and secret-output prevention.

Why this is applicable:

- The pod has pnpm, but at the wrong version for this repo.
- The plan's repair path is to align via corepack pinning and fail early on mismatch.
- Repo-side scripts and pod-native skill source can be authored and tested offline.

Required constraints:

- Output must be status-only for secret-derived capabilities.
- Local execution of `--pod` must skip or degrade gracefully when not in a pod.
- The bootstrap contract can define expected behavior, but cannot claim live pod success without
  actual pod evidence.

Do not over-apply:

- Do not inject tokens.
- Do not create or mutate pods.
- Do not read or print secret-bearing config contents.
- Do not treat local preflight fixtures as proof that the OpenClaw runtime accepts the skill.

### 6. PR5 Offline Portion: Native E2E Strategy And Evidence Ingest Design

Applicable now:

- Add the native E2E strategy document that defines the evidence ladder:
  L0 Jest, L1 RN Web Playwright, L2 cloud Maestro/native build evidence, L3 human device/mobile-mcp.
- Document why in-pod emulator is rejected: no KVM and no Android SDK/adb/emulator in boram evidence.
- Document that `.maestro/home.yml` currently has `appId: {{ANDROID_PACKAGE}}`, a generation-time
  placeholder that must be parameterized before L2 execution.
- Add an ingest script that works only from recorded fixture JSON in self-test mode.
- Add schema and validator rules that prevent `05-qa-release` completion when required evidence
  level is unmet unless a valid human waiver exists.
- Add guarded pod-native auth setup source files as documentation and offline scripts, with explicit
  "do not run before approval and token injection" language.

Why this is applicable:

- The repo already contains EAS profile and Maestro workflow definitions, but lacks safe robot auth
  setup and evidence ingestion.
- Offline fixture-based ingestion can be built without credentials or network.
- RN Web evidence is useful as L1 but is not native proof.

Required constraints:

- Network-free self-tests only.
- No live auth command.
- No native completion claim.
- No token value output.

Do not over-apply:

- Do not run live cloud validation before human/ops approval.
- Do not treat RN Web as replacement for native module, permission, navigation container, or release
  candidate validation.
- Do not leave the Maestro app id placeholder unresolved for any L2 claim.

### 7. PR6: SoT Drift Detection

Applicable:

- Replace the placeholder SoT refresh script with an offline snapshot/drift checker.
- Check documented pins against actual repo files: package manager, mobile package versions,
  lockfile overrides, MCP pin versions, quality-gate trigger paths, and runtime script wiring.
- Keep online refresh or Atlassian-backed refresh as a manual/non-blocking workflow, not a PR gate.

Why this is applicable:

- The plan depends on SoT fidelity.
- The current repo has known placeholder behavior for SoT refresh.
- Offline deterministic drift checks are suitable for CI.

Required constraints:

- CI must not depend on network or MCP authentication.
- A warning-only staleness check must not be mislabeled as a blocking proof of freshness.

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
hook: PreToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
exec
/bin/zsh -lc "sed -n '1,220p' team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
# Pod Organization E2E Improvement Plan

## 목적

이 문서는 boram-\* 샘플과 같은 OpenClaw cloud pod로 6역할 LLM 모바일 개발 조직을 구성하고,
그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
모바일 앱 개발 lifecycle을 **무인으로(E2E)** 수행할 수 있게 만들기 위한 상세 개선 계획이다.

- 문서 분류: 현재 프로젝트 기준 improvement plan (09-, 11-, 12- 계획 문서와 동일한 계층)
- 소유 역할: Product/Planning (계획), Mobile Architect (기술 검토), QA/Release (검증 경로)
- 이 문서는 정책 SoT가 아니다. 충돌 시 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`,
  `REPO_OPERATIONS.md`, `team-doc/mobile-app-dev-team/00-sot-and-principles.md`가 우선한다.

## 조사 방법과 근거 출처

이 계획은 다음 세 가지 검증된 조사에 기반한다.

1. **이 repo 전수 조사**: root 정책 문서, `.agents/skills`(11개), `.codex/agents`(13개),
   `.codex/hooks`(5개), `scripts/` validator 9종, `.github/workflows/quality-gate.yml`,
   `apps/mobile`, `apps/api`, `packages/contracts`, `infra/clawpod/`,
   `docs/plans/work-units/sample-role-handoff/`, `.evidence/` 구조.
2. **OpenClaw cloud 플랫폼 repo 조사** (외부 플랫폼 repo `openclaw-cloud`):
   admin API의 agent 생성 플로우(agent-orchestrator: ConfigMap/Secret/Service/StatefulSet 생성),
   pod entrypoint 14단계 초기화, NATS JetStream 메시징(`CHAT_MESSAGES.{roomId}`),
   A2A MCP 서버(:18789), webhook gateway(GitHub adapter 포함 10종), agent 이미지 구성.
3. **live 샘플 pod 실측** (OrbStack k8s, namespace `clawpod`, `boram-vf7sbm-agent-0`):
   OpenClaw 런타임 + `openai-codex/gpt-5.5` 모델, ConfigMap 주입된
   SOUL.md/AGENTS.md/TOOLS.md/IDENTITY.md, `/workspace/skills`(codex-cli-auth-setup 포함),
   Node 22/git/yarn/Chromium 존재. pnpm은 **10.33.3이 존재하나 repo SoT pin
   `pnpm@9.15.9`(`package.json`의 `packageManager`)와 불일치**하고,
   eas-cli/maestro/Android SDK/adb/emulator/Java/mobile-mcp는 부재, `/dev/kvm`도 없다 —
   checked-in 증거: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`.
   canary pod도 동일 구성으로 추정되나 repo에 직접 증거가 남아 있는 것은 boram이다.
   `~/.codex/auth.json` 존재(Secret `OPENAI_CODEX_AUTH_JSON` 주입).

---

## Part A. 현재 상태 진단

### A-1. 이미 동작이 검증된 것

| 영역 | 검증된 사실 | 근거 |
| --- | --- | --- |
| 역할 조직 | 6 LLM 역할 + 비-LLM Gatekeeper 모델, 역할별 SOUL.md 템플릿 | `01-team-composition.md`, `02-role-souls/` |
| Codex 런타임 | repo-local skill 11종, custom agent 13종(verdict reviewer + advisory researcher), hook 5종, MCP(mobile-mcp@0.0.58/serena@v1.5.3/stitch@1.3.2/expo) | `.agents/skills/`, `.codex/agents/`, `.codex/config.toml`, `PROJECT_ENVIRONMENT.md` Codex runtime 절 |
| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
| 핸드오프 | pod-isolated 역할 간 durable handoff는 GitHub branch/commit/PR + `docs/plans/work-units/<work-unit-id>/` 전용 | `10-github-artifact-workflow.md` |
| 수직 슬라이스 | home counter가 contracts import, NativeWind, Jest, RN Web Playwright, Maestro flow, EAS 프로파일 경로를 증명 | `apps/mobile/src/app/index.tsx`, `apps/mobile/.maestro/home.yml`, `apps/mobile/eas.json` |
| EAS 빌딩블록 | `e2e-test` 프로파일(credential-less Android APK + iOS simulator, `apps/mobile/eas.json:7`)과 cloud Maestro job(`apps/mobile/.eas/workflows/e2e-test-android.yml`의 `type: maestro`, `flow_path: ['.maestro/home.yml']`) 정의 존재 | 해당 파일 |
| Pod 플랫폼 | agent 1개 = ConfigMap + Secret + Service + StatefulSet(+ `/workspace` 10Gi PVC) 패턴, NATS 룸 구독, A2A, webhook gateway 라우팅 — live pod로 27시간+ 무중단 실측 | 플랫폼 repo + live pod 실측 |
| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |

### A-2. 검증된 갭 (개선 대상)

| # | 갭 | 근거 | 영향 |
| --- | --- | --- | --- |
| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
| G2 | **오케스트레이션 주체 없음**: skill 11종이 각 역할의 "어떻게"는 정의하지만 "지금 누가 무엇을"은 어디에도 없음 | `.agents/skills/` 전수 확인; `05-work-processes.md`는 산문 | 인간이 매 stage마다 다음 역할을 호출해야 함 |
| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
| G4 | **pod 부트스트랩 계약 부재**: `codex-preflight.mjs`가 macOS 전제 — codex 후보 경로가 `/opt/homebrew/bin/codex`, `/usr/local/bin/codex`(`scripts/codex-preflight.mjs:8`), arch 판정이 `sysctl -n hw.optional.arm64`(`scripts/codex-preflight.mjs:67`). Linux pod에서 결정적으로 실패. 역할 배정(어느 pod가 어느 역할인지) 규약도 없음 | 해당 파일 | 새 pod가 "나는 역할 X이고 준비됐다"를 스스로 증명할 수 없음 |
| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
| G7 | **Stitch 사전점검 부재**: stitch MCP는 Google Cloud ADC + 프로젝트 설정 필요(`PROJECT_ENVIRONMENT.md` MCP 절)인데 preflight가 검사하지 않음 → Design pod가 실행 실패 시점에야 발견 | `PROJECT_ENVIRONMENT.md` | Design stage 자율성 저하 |
| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs:236-250`이 team-doc 한정 secret 스캔은 수행) | 해당 파일 | 증거 무결성이 규율에만 의존 |
| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |

### A-3. 진단 요약

조직 설계·역할 계약·게이트·증거 규율은 성숙해 있으나, 그것을 **구동하는 결정적
(deterministic) 상태·해석기·부트스트랩 계층이 없다**. 즉 "역할이 일하는 방법"은 완성됐고
"조직이 스스로 도는 방법"이 미완성이다. 아래 개선은 전부 이 한 문장으로 수렴한다:
**committed repo 상태만으로 다음 액션이 계산되고, 어떤 pod든 그 계산 결과 중 자기 역할
몫만 실행하게 만든다.** 이는 `10-github-artifact-workflow.md`의 "shared storage 없음,
GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-LLM 결정적 검사"
원칙의 직접 연장이며, 새 인프라 발명이 아니라 기존 원칙의 기계화다.

---

## Part B. Repo 측 개선 (PR 슬라이스 7개, 의존성 순)

모든 PR은 repo 규칙을 따른다: TDD/validator-first(`AGENTS.md` Required rules),
신규 validator는 `package.json` script + `quality-gate.yml`의 스크립트 정규식 +
`PROJECT_ENVIRONMENT.md` CI 절에 **3중 배선**, 계획·증거는 `.evidence/`에 기록.

### PR1 (P0) — Work-unit 상태머신: `status.json`

- **WHY**: G1. pod-isolated 조직에서 유일한 durable 입력은 committed 파일이므로
  상태도 committed 파일이어야 한다. reviewer verdict가 이미 JSON envelope로 기계화되어
  있는 것(`codex-headless-review.mjs`)과 동일한 패턴을 stage 상태로 확장하는 것.
- **WHAT**:
  - `docs/plans/work-units/<work-unit-id>/status.json` (schema `wu-status/v1`)
  - `scripts/lib/work-unit-machine.mjs` — 상태 enum/전이표/병렬 그룹 공유 모듈
  - `scripts/validate-work-units.mjs` (+ `evals/local-harness/work-units/` fixture:
    valid 1, 불법 전이 1, envelope 누락 1, gatekeeper에 reviewer 지정 1)
  - `docs/plans/work-units/sample-role-handoff/status.json` 샘플 추가
  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
- **HOW** — 스키마 핵심:

```json
{
  "schema_version": "wu-status/v1",
  "work_unit": "<work-unit-id>",
  "stages": [
    {
      "id": "00-product-planning",
      "role": "product-planning",
      "state": "done",
      "attempts": 1,
      "max_attempts": 3,
      "required_artifacts": ["..."],
      "reviewer": { "agent": "po-planning-reviewer", "verdict": "GO",
                    "envelope_path": "00-product-planning/reviewer-envelope.json" },
      "handoff": { "branch": "wu/<id>/00-planning", "pr": "<pr-url>" }
    }
  ],
  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
                     "state": "pending", "decision_path": "..." } ],
  "evidence_ladder": { "required_level": "eas-maestro", "achieved_level": "rn-web" },
  "events": [ { "at": "<iso8601>", "actor": "<role>", "type": "stage-completed", "stage": "..." } ]
}
```

  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
  - 합법 전이: `pending→in-progress→review→done`; `review→gate-failed→in-progress`(attempts+1);
    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
  - `events`는 append-only — validator가 타임스탬프 단조 증가와 git base 대비 prefix 보존을 검사
  - validator 규칙: `done`은 산출물 실재 + reviewer envelope `GO` 재검증
    (`codex-headless-review.mjs`의 envelope validator 재사용) + handoff 링크 필수;
    `06-gatekeeper` stage는 role이 `gatekeeper-system`이어야 하고 reviewer agent 지정 금지
    (비-LLM 불변식); 선행 stage 미완료 시 `in-progress` 금지 — 단 `02-architecture`와
    `03-contract-api`는 `01-design`이 `review` 도달 후 병렬 허용(명시적 `parallel_groups` 상수)
- **수용 기준**: `--self-test` 통과(invalid fixture가 명명된 사유로 실패),
  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.

### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`

- **WHY**: G5. reviewer가 `NEEDS_HUMAN`을 낼 수는 있으나 해제 레코드가 없으면 자율
  파이프라인은 영구 정지한다. 승인을 기계 판독 가능 + 감사 가능하게 만들어야
  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
  `06-gates-and-evidence.md`에 규범 절 1개 추가.
- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
  `decision ∈ approved|rejected|deferred`, `scope`, `decided_by{name,contact,channel}`,
  `decision_reference`(GitHub comment/review URL — 신뢰 앵커), `decided_at`,
  `residual_risk[]`, `evidence_links[]`.
  - 결정적 anti-self-approval: `decided_by.name`이 역할명/agent명 목록과 일치하면 거부
  - `failed-gate-risk` 카테고리는 실패한 check 참조 필수
  - 한계 명시: 진위 보장은 GitHub 계정 신원에 앵커된 **정책 수준**이지 암호학적 증명이
    아니다. 온라인 시 orchestrator가 `gh api`로 작성자 확인 후 work-unit event에
    `verified: true | unverifiable-offline` 기록.
- **수용 기준**: fixture 4종(정상 / agent명 승인자 / 미정의 category / failed-gate-risk
  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.

### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill

- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
  결정된 액션의 *실행*만 담당한다.
- **WHAT**:
  - `scripts/work-unit-next.mjs`: `status.json` + 파일시스템 → 다음 액션 JSON 출력.
    `--apply-transition <stage> <state>`는 공유 모듈을 통해서만 상태를 기록(불법 전이는
    기록 시점에 거부 — validate 시점이 아니라).
  - `.agents/skills/wm-orchestrate/SKILL.md`: 어느 역할 pod든 실행하는 단일 진입 skill.
    절차 = pull → resolver 실행 → 자기 역할(`WM_ROLE`) 몫 필터 → 해당 역할 skill 호출 →
    reviewer를 `codex-headless-review.mjs`로 실행 → 전이 적용 → commit/push/PR 갱신.
  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
    수정 금지(pending 요청 생성만 허용), resolver가 `blocked`만 반환하면 정지·보고.
- **HOW** — resolver 출력 계약(요지): `next_actions[]`(stage, role, action ∈
  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
  run-deterministic-checks, skills[], reviewer_required, attempts_remaining)와
  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
  `04-skills-and-agents-matrix.md`를 따른다(00→po-planning-reviewer, 01→design-reviewer,
  02/03→wm-contract-reviewer, 04→wm-implementation-reviewer, 05→QA 증거 검사,
  06→결정적 검사만). 재시도 정책: `gate-failed` 시 `wm-gate-fix-advisor` advisory 첨부,
  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
- **수용 기준**: fixture로 8 stage 행복 경로, 02/03 병렬, 재시도, 재시도 소진 에스컬레이션,
  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
  sample work-unit 사본으로 stage 00 dry-run이 로컬에서 headless reviewer까지 완주.

### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약

- **WHY**: G4. live pod 실측상 pod에는 Node 22/git/Chromium이 있고
  `/workspace/skills/codex-cli-auth-setup`이 이미 동작 패턴으로 존재한다
  (`09-pod-native-openclaw-skill-plan.md`). 같은 패턴으로 "역할 부트스트랩"을 추가하고,
  macOS 전용인 preflight를 pod에서 동작하게 확장하면 된다.
- **WHAT**:
  - `scripts/codex-preflight.mjs`에 `--pod` 모드: codex 후보 경로에 `which codex` +
    `CODEX_BIN` env 추가, arch 판정을 `uname -m` 우선으로 교체(기존 macOS 경로 유지),
    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
    10.33.3 근거), git identity, `gh auth status`,
    Chromium 존재(`rn-web-capable`), `.codex/config.toml` 파싱 + `codex mcp list` 종료코드,
    역할 컨텍스트 fixture 존재. 출력에 `capabilities` 블록:
    `{ "rn_web_e2e": bool, "native_e2e_local": false, "eas_cloud": <EXPO_TOKEN 존재 여부 status-only> }`.
    auth token 값은 출력하지 않음(기존 codex-cli-auth-setup 가드 계승).
  - pod-native skill 소스 `09-pod-native-openclaw-skills/pod-role-bootstrap/`
    (`SKILL.md` + `scripts/pod-bootstrap.sh` + `references/report-template.md`):
    역할 해석(`WM_ROLE` env 우선, fallback `/workspace/IDENTITY` 1행, 불일치 시 hard fail) →
    repo clone(주입 토큰; `infra/clawpod/agent-runner.yaml`의 initContainer 패턴 재사용) →
    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
    `codex-preflight --pod --json` → 역할 skill 디렉토리
    실재 확인 → 보고서를 `/workspace/state/`에 기록.
  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
    codex-cli-auth-setup 검사 패턴 확장; shell script secret-출력 금지 regex 포함).
- **수용 기준**: preflight `--self-test`에 Linux형 fixture 추가 통과; 노트북에서
  `--pod`는 우아하게 skip; validate:team-doc이 skill 소스 누락/secret 출력 시 실패.

### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리

- **WHY**: G3. in-pod emulator는 **명시적으로 기각**한다 — KVM/중첩 가상화가 pod 런타임에
  없고(실측), 대규모 병렬은 `AGENTS.md:46`의 직렬화 원칙과도 충돌한다. 반면 이 repo에는
  이미 자율화 가능한 cloud 경로가 잠들어 있다: `eas.json`의 `e2e-test` 프로파일
  (credential-less Android APK + iOS simulator)과 `e2e-test-android.yml`의 cloud Maestro
  job. 빠진 것은 ① robot token 인증의 pod-native 표준화 ② 결과를 `.evidence/`로 끌어오는
  ingestion ③ "어느 수준의 증거가 언제 필수인가"의 규범이다.
- **WHAT**:
  - 신규 문서 `14-native-e2e-strategy.md` — 증거 사다리(evidence ladder) 규범:
    - L0 `jest`: 항상 (CI)
    - L1 `rn-web`: RN Web + Playwright, 모든 UI 작업 필수. pod 내 Chromium으로 실행 가능
      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)

hook: PostToolUse
hook: PostToolUse Completed
codex
보고서의 핵심 구조는 확인했습니다. 이제 라인 단위로 prior finding 관련 문구와 split 근거를 대조하고, 우선순위 SoT가 보고서의 제한 조건과 충돌하지 않는지 확인하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '521,580p' .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
- PR readiness.
- External platform or live pod readiness.

Impact:

- The updated applicability split remains valid as a plan judgment.
- The current workspace must not be reported as runtime-gate green unless full `test:runtime` is
  rerun after the concurrent session stabilizes.
- Implementation or PR-ready claims must wait until the applicable gates are rerun and recorded.

## Final Decision

Human-readable applicability decision: conditionally applicable for repo-internal offline work.

This is not a `$wm` machine reviewer verdict. The official reviewer envelope uses only
`GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`.

Allowed now:

- Repo-internal offline plan correction and PR1/PR2/PR3/PR4/PR6/PR7 plus PR5 offline work,
  provided each step follows TDD/validator-first and passes applicable local gates.

Blocked until approval:

- Part D platform work, live native E2E validation, credential issuance/injection, branch protection,
  webhook routing, pod rollout, and multi-pod drill.

Forbidden:

- Production release automation, human gate weakening, Gatekeeper LLM/pod modeling, RN Web as native
  replacement, local validation as external proof, secret exposure, and direct external platform
  mutation from this repo workflow.

hook: PostToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "''^(##|###)|pnpm|test:runtime|Current Gate|Conditionally Applicable|Always Forbidden|Native E2E|human-gate|Gatekeeper|mobile-mcp|OpenClaw|Local Validation|Secret|External Platform" .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc 'rg -n "pnpm|KVM|Android SDK|adb|emulator|Java|mobile-mcp|Maestro|eas-cli|boram|canary|policy SoT|human|Gatekeeper|test:runtime|PROJECT_ENVIRONMENT|REPO_OPERATIONS|external|native|E2E|Part D|PR[1-7]" team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
8:## SoT And Evidence Inputs
18:## Overall Judgment
25:described as missing pnpm. It is correctly described as a pin mismatch between boram pod pnpm
26:`10.33.3` and repo SoT `pnpm@9.15.9`. The remaining pod gaps for cloud CLI, Maestro, adb,
27:emulator, Java, mobile-mcp, and KVM remain valid.
30:to skip `test:runtime` because another session is concurrently modifying that area. This does not
34:## Immediately Applicable: Repo-Internal Offline Work
40:### 1. Fact Correction And Plan Registration
44:- Keep the factual correction that boram pod has pnpm `10.33.3`, while the repo SoT pin is
45:  `pnpm@9.15.9`.
48:  Java, mobile-mcp, and KVM.
55:- The boram evidence records pnpm `10.33.3`.
61:- Do not rewrite the gap back to "pnpm missing."
64:### 2. PR1: Work-Unit Status Machine
71:  reviewer envelope presence, handoff links, append-only events, and Gatekeeper invariants.
73:- Wire the validator into `test:runtime`, the quality gate workflow, and runtime documentation
80:- Deterministic status validation matches the non-LLM Gatekeeper model.
95:### 3. PR2: Human-Gate Decision Envelope
99:- Add a machine-readable human-gate decision schema such as `human-gate/v1`.
125:### 4. PR3: Deterministic Next-Action Resolver And `wm-orchestrate`
139:- A deterministic resolver preserves Gatekeeper philosophy and prevents ad hoc LLM routing.
154:### 5. PR4: Repo-Side Pod Bootstrap Contract
159:- Add pnpm pin validation: repo expects `pnpm@9.15.9`; mismatch must fail.
162:- Add a pod-native skill source for role bootstrap under the managed team-doc OpenClaw skill
168:- The pod has pnpm, but at the wrong version for this repo.
184:- Do not treat local preflight fixtures as proof that the OpenClaw runtime accepts the skill.
186:### 6. PR5 Offline Portion: Native E2E Strategy And Evidence Ingest Design
191:  L0 Jest, L1 RN Web Playwright, L2 cloud Maestro/native build evidence, L3 human device/mobile-mcp.
222:### 7. PR6: SoT Drift Detection
248:### 8. PR7: Hardening For Stitch, mobile-mcp Pin Drift, And Evidence Hygiene
253:- Add offline drift check for mobile-mcp pin consistency between `.codex/config.toml` and
261:- `mobile-mcp` is required local visual QA/device automation, but must not be a required CI device gate.
274:- Do not make mobile-mcp parallel or CI-required.
277:### 9. README And Source Map Registration
294:## Conditionally Applicable: Only After Human/Ops Approval
299:### 1. OpenClaw Agent Image Build And Push
304:- Include pnpm pin alignment, cloud CLI support, Maestro cloud-upload support, watchman, and warm
305:  pnpm store layers as applicable.
318:### 2. Pod Creation And ConfigMap/Secret Provisioning
329:- Secret issuance and injection by authorized operators.
338:### 3. GitHub Bot Accounts, Tokens, Branch Protection, And Required Checks
357:### 4. Webhook Gateway And NATS Routing
375:### 5. PR5 Live Native E2E Validation
395:### 6. Multi-Pod Rollout Drill
402:  Gatekeeper, and human release block.
411:- Do not treat local harness, source review, or fixture tests as OrbStack/OpenClaw execution proof.
413:## Always Forbidden: Do Not Apply
416:human-gate policy, or the plan's corrected scope.
418:### 1. Production Release Submission Automation
423:- Allowing a pod, LLM, script, or Gatekeeper check to bypass human release approval.
431:### 2. Weakening Human Gates
444:### 3. Gatekeeper As LLM, Pod, Custom Agent, Or SOUL.md Owner
448:- Creating a Gatekeeper LLM pod.
449:- Giving Gatekeeper a SOUL.md as an operating role.
454:- Gatekeeper is a deterministic required-check concept.
457:### 4. RN Web Or Railway Evidence As Native Replacement
470:### 5. Local Validation As External Runtime Proof
474:- Claiming local harness proves actual OrbStack/OpenClaw pod execution.
483:### 6. Secret Or Token Exposure
495:### 7. External Platform Mutation From This Repo Workflow
507:## Current Gate Status
509:`pnpm run test:runtime` is skipped for this applicability report because the user stated that
516:  the prior archive-term drift, not as a substitute for full `test:runtime`.
520:- Full `pnpm run test:runtime` status.
527:- The current workspace must not be reported as runtime-gate green unless full `test:runtime` is
531:## Final Decision
550:- Production release automation, human gate weakening, Gatekeeper LLM/pod modeling, RN Web as native

 succeeded in 0ms:
1:# Pod Organization E2E Improvement Plan
5:이 문서는 boram-\* 샘플과 같은 OpenClaw cloud pod로 6역할 LLM 모바일 개발 조직을 구성하고,
6:그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
7:모바일 앱 개발 lifecycle을 **무인으로(E2E)** 수행할 수 있게 만들기 위한 상세 개선 계획이다.
11:- 이 문서는 정책 SoT가 아니다. 충돌 시 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`,
12:  `REPO_OPERATIONS.md`, `team-doc/mobile-app-dev-team/00-sot-and-principles.md`가 우선한다.
26:3. **live 샘플 pod 실측** (OrbStack k8s, namespace `clawpod`, `boram-vf7sbm-agent-0`):
29:   Node 22/git/yarn/Chromium 존재. pnpm은 **10.33.3이 존재하나 repo SoT pin
30:   `pnpm@9.15.9`(`package.json`의 `packageManager`)와 불일치**하고,
31:   eas-cli/maestro/Android SDK/adb/emulator/Java/mobile-mcp는 부재, `/dev/kvm`도 없다 —
32:   checked-in 증거: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`.
33:   canary pod도 동일 구성으로 추정되나 repo에 직접 증거가 남아 있는 것은 boram이다.
44:| 역할 조직 | 6 LLM 역할 + 비-LLM Gatekeeper 모델, 역할별 SOUL.md 템플릿 | `01-team-composition.md`, `02-role-souls/` |
45:| Codex 런타임 | repo-local skill 11종, custom agent 13종(verdict reviewer + advisory researcher), hook 5종, MCP(mobile-mcp@0.0.58/serena@v1.5.3/stitch@1.3.2/expo) | `.agents/skills/`, `.codex/agents/`, `.codex/config.toml`, `PROJECT_ENVIRONMENT.md` Codex runtime 절 |
46:| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
48:| 수직 슬라이스 | home counter가 contracts import, NativeWind, Jest, RN Web Playwright, Maestro flow, EAS 프로파일 경로를 증명 | `apps/mobile/src/app/index.tsx`, `apps/mobile/.maestro/home.yml`, `apps/mobile/eas.json` |
49:| EAS 빌딩블록 | `e2e-test` 프로파일(credential-less Android APK + iOS simulator, `apps/mobile/eas.json:7`)과 cloud Maestro job(`apps/mobile/.eas/workflows/e2e-test-android.yml`의 `type: maestro`, `flow_path: ['.maestro/home.yml']`) 정의 존재 | 해당 파일 |
51:| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |
59:| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
61:| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
62:| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
63:| G7 | **Stitch 사전점검 부재**: stitch MCP는 Google Cloud ADC + 프로젝트 설정 필요(`PROJECT_ENVIRONMENT.md` MCP 절)인데 preflight가 검사하지 않음 → Design pod가 실행 실패 시점에야 발견 | `PROJECT_ENVIRONMENT.md` | Design stage 자율성 저하 |
65:| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |
74:GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-LLM 결정적 검사"
83:`PROJECT_ENVIRONMENT.md` CI 절에 **3중 배선**, 계획·증거는 `.evidence/`에 기록.
85:### PR1 (P0) — Work-unit 상태머신: `status.json`
96:  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
116:  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
123:  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
125:    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
133:  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.
135:### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`
139:  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
140:- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
141:  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
143:- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
153:  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.
155:### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill
157:- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
158:  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
167:  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
170:  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
172:  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
176:  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
178:  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
181:### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약
185:  (`09-pod-native-openclaw-skill-plan.md`). 같은 패턴으로 "역할 부트스트랩"을 추가하고,
190:    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
194:    `{ "rn_web_e2e": bool, "native_e2e_local": false, "eas_cloud": <EXPO_TOKEN 존재 여부 status-only> }`.
196:  - pod-native skill 소스 `09-pod-native-openclaw-skills/pod-role-bootstrap/`
200:    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
208:### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리
210:- **WHY**: G3. in-pod emulator는 **명시적으로 기각**한다 — KVM/중첩 가상화가 pod 런타임에
213:  (credential-less Android APK + iOS simulator)과 `e2e-test-android.yml`의 cloud Maestro
214:  job. 빠진 것은 ① robot token 인증의 pod-native 표준화 ② 결과를 `.evidence/`로 끌어오는
217:  - 신규 문서 `14-native-e2e-strategy.md` — 증거 사다리(evidence ladder) 규범:
220:      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
221:    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
223:    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
229:      (boram SoT check 증거 문서에 기록) — runtime env가 아니므로 L2 실행 전에 appId
231:  - pod-native skill `09-pod-native-openclaw-skills/eas-robot-auth-setup/`:
232:    `EXPO_TOKEN` 존재 status-only 확인, `npx eas-cli whoami` 종료코드, `EAS_PROJECT_ID`
234:  - `scripts/ingest-eas-evidence.mjs`: eas-cli JSON 출력(`eas build:view --json` 등, 버전
236:    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
238:  - `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(트리거 → 폴링 → ingest →
242:  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
244:- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
247:  native 검증 완료를 주장하지 않는다.
249:### PR6 (P1) — SoT refresh / drift 자동 검출
258:  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
259:    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
267:### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
274:  - mobile-mcp: `.codex/config.toml` 핀 vs `PROJECT_ENVIRONMENT.md` 표기 drift 검사
275:    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
276:  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
285:## Part C. Pod 조직 설계 (boram 패턴 재사용)
287:### C-1. 토폴로지 — 역할당 1 pod, 총 6 pod + CI Gatekeeper
294:| `wm-mobile-dev` | Mobile App Dev | agent-mobile **full** | **4 CPU / 8Gi** | Metro bundler + pnpm install + Chromium 동시 부하가 boram 기준(2C/4Gi) 초과 |
296:| `wm-qa` | QA/Release | agent-mobile **full** | **4 CPU / 8Gi** | Playwright 스크린샷 증거 + EAS/Maestro cloud 트리거 |
303:- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
304:  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
308:  미정의 역할을 신설하는 것이고, PR3의 resolver가 결정적이므로 조정 "판단"이 필요한 지점은
315:**ConfigMap** (`{AGENT_ID}-agent-config`, boram과 동일 메커니즘):
320:- `AGENTS.md`(pod용): boram 베이스 + **GitHub handoff protocol 절** 추가 — repo URL,
324:- `TOOLS.md`: boram 베이스(filesystem, playwright, memory, a2a, skill-store) + 역할 추가분
330:| 전체 6 pod | `OPENAI_CODEX_AUTH_JSON`(boram 검증 패턴), `GITHUB_TOKEN`(repo 한정 fine-grained; 역할별 bot 계정 분리 권장 — PR 리뷰/승인 귀속성) |
335:**`/workspace/skills`** (pod-native): 전 pod에 `codex-cli-auth-setup` +
336:`pod-role-bootstrap`(PR4); `wm-qa`에 `eas-robot-auth-setup`(PR5).
340:### C-3. 이미지/툴체인 요구 (요지 — 상세는 Part D annex)
344:- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
345:  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
346:  부트스트랩/preflight는 불일치 시 fail. eas-cli(전역), maestro CLI(**cloud 업로드
348:  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
349:- **명시적 제외**: Android SDK / adb / emulator 이미지 — KVM 부재로 사용 불가하며
350:  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
351:- `lite` 변형(po/arch/api용): base lite + pnpm + gh만
356:  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
357:- **NATS 팀 룸 = wake-up 신호**: 단일 팀 룸(boram의 룸 구독 메커니즘 재사용)에 구조화
368:### C-5. E2E 실행 트레이스와 단절점
380:   `EXPO_TOKEN`으로 EAS cloud build + cloud Maestro 트리거 → `ingest-eas-evidence.mjs` →
382:7. Gatekeeper(CI) → required check 결정적 판정 → `06-gatekeeper/`에 전사
383:8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단
389:| B1 | pnpm pin mismatch(pod 10.33.3 vs SoT 9.15.9) → frozen-lockfile 설치 신뢰 불가 | pod-role-bootstrap의 corepack pin + preflight mismatch fail (+이미지 핀 정렬) | PR4 + annex |
390:| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
393:| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
394:| B6 | EAS 트리거·ingest 실행 경로 부재 | PR5 | 이 repo |
395:| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
402:  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
403:  생성(PR3). "실패 게이트의 위험 수용"은 LLM 권한 밖(QA SOUL 금지 조항 준수).
405:  stale 코멘트 → webhook → `wm-po` wake. 결정적 계층(CI)에 두는 이유는 Gatekeeper 철학과
413:## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)
423:   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
432:5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
445:- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
446:  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
448:- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
450:  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
451:- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
452:  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
453:  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
460:| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
461:| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
463:| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
465:| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
466:| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
470:**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
475:합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:
480:- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)
483:`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.
488:  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
489:- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
491:  아니라 기록되는 human gate로 관리한다.
500:- production submit 자동화 또는 release human gate 약화

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "sed -n '1,260p' PROJECT_ENVIRONMENT.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "sed -n '220,520p' team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 5ms:
# Project Environment

Last updated: 2026-06-10

This file is the root source for the current project environment and runtime settings. Keep it in sync when changing package versions, Expo config, NativeWind config, Codex runtime files, CI gates, EAS workflows, required environment variables, or the Codex MCP/CLI setup guide at `docs/CODEX_MCP_ENVIRONMENT.md`.

## Workspace

- Package manager: `pnpm@9.15.9` from root `package.json`.
- Workspace packages: `apps/*` and `packages/*` from `pnpm-workspace.yaml`.
- Turbo tasks: `lint` and `test` from `turbo.json`.
- Required root gates:
  - `pnpm run test:runtime`
  - `pnpm turbo run lint test`
  - `pnpm run test:local-harness` for Codex runtime changes.

## Mobile Runtime

- App path: `apps/mobile`.
- Framework: Expo SDK 56 with Expo Router.
- Runtime versions:
  - `expo`: `~56.0.9`
  - `react`: `19.2.3`
  - `react-dom`: `19.2.3`
  - `react-native`: `0.85.3`
  - `react-native-web`: `^0.21.2`
  - `expo-router`: `~56.2.9`
  - `expo-dev-client`: `~56.0.19`
  - `expo-doctor`: `^1.19.9` as the `doctor` script dependency.
  - `@playwright/test`: `^1.60.0` as the browser E2E test runner.
- Expo config: `apps/mobile/app.config.ts`.
  - Dynamic values come from environment variables.
  - Neutral template fallback values exist only so local config evaluation can run without customer values.
  - Preview, production, and EAS build config fail if app display name, slug, scheme, API URL, iOS bundle identifier, or Android package are missing.
  - Customer and production builds must override app display name, slug, scheme, iOS bundle identifier, Android package, and API URL through environment variables.
  - `newArchEnabled` is `true`.
  - Plugin is `expo-router`.
  - `extra.apiUrl` reads `EXPO_PUBLIC_API_URL`.
  - `extra.eas.projectId` reads `EAS_PROJECT_ID`.
- Mobile scripts:
  - `pnpm --filter mobile start`
  - `pnpm --filter mobile ios`
  - `pnpm --filter mobile android`
  - `pnpm --filter mobile run doctor`
  - `pnpm --filter mobile lint`
  - `pnpm --filter mobile test`
  - `pnpm --filter mobile e2e`
  - `pnpm --filter mobile e2e:web`
  - `pnpm --filter mobile web`
- Node baseline:
  - CI uses Node 22.
  - Mobile TypeScript uses `@types/node` 22.x so code cannot type-check against newer Node-only APIs by accident.

## Mobile Web E2E

- Browser E2E path: `apps/mobile/e2e-web`.
- Browser E2E config: `apps/mobile/playwright.config.ts`.
- Browser install command: `pnpm --filter mobile exec playwright install chromium`.
- Browser E2E command: `pnpm --filter mobile e2e:web`.
- Repo QA skill: `$e2e-test` plans, resets, executes, and records E2E evidence. It is a Codex skill, not the EAS build profile or workflow label named `e2e-test`.
- RN Web E2E validates only RN Web/browser-reproducible UI, navigation, state, and business logic flows.
- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or other device/hardware features.
- RN Web release E2E requires a deployed backend API URL through public client config:
  - `EXPO_PUBLIC_API_URL=<deployed-api-url> pnpm --filter mobile e2e:web`
  - `EXPO_PUBLIC_API_URL` is compiled into the client app and is not private; never put bearer tokens, signing keys, passwords, or private endpoints in it.
  - The current Railway QA API URL verified for this workspace is `https://api-production-3d74.up.railway.app`.
  - Evidence: `.evidence/e2e-test/20260609-233244-rn-web-railway-api/`.
- Playwright launches Expo Web with deterministic public test config plus the caller-provided backend API URL:
  - `EAS_BUILD=false`
  - `EXPO_PUBLIC_APP_ENV=development`
  - `EXPO_PUBLIC_APP_DISPLAY_NAME=Mobile App Template`
  - `EXPO_PUBLIC_APP_SLUG=mobile-app-template`
  - `EXPO_PUBLIC_APP_SCHEME=mobileapptemplate`
  - `EXPO_PUBLIC_API_URL` from the command environment
  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER=com.template.mobile`
  - `EXPO_PUBLIC_ANDROID_PACKAGE=com.template.mobile`
- `EXPO_PUBLIC_*` values are public client configuration and must not contain tokens, bearer credentials, signing keys, passwords, or private service endpoints.
- Native completion remains separate:
  - Run Maestro and `mobile-mcp` visual QA when the required EAS account, simulator, emulator, or device is available.
  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.

## Mobile Styling

- Styling layer: NativeWind with React Native primitives and semantic design tokens.
- Current NativeWind package: `nativewind@5.0.0-preview.4`.
- NativeWind v5 is a pre-release package, so this repo pins the exact preview version.
- NativeWind v5 rollback criteria:
  - Roll back to the last passing NativeWind v4 / Tailwind CSS v3 baseline if SDK 56 compatibility checks, Metro bundling, Jest, native run smoke, or Maestro/mobile visual QA fail because of NativeWind v5 and cannot be fixed in the same PR.
  - Do not promote a production release with unresolved NativeWind v5 rendering, bundling, or native runtime defects.
- Tailwind/PostCSS:
  - `tailwindcss`: `^4.3.0`
  - `@tailwindcss/postcss`: `^4.3.0`
  - `postcss`: `^8.5.15`
  - `lightningcss`: `1.30.1`
  - root pnpm override pins `lightningcss` to `1.30.1`.
  - PostCSS config: `apps/mobile/postcss.config.mjs`
- NativeWind dependencies:
  - `react-native-css`: `^3.0.7`
  - `react-native-reanimated`: `4.3.1`
  - `react-native-worklets`: `0.8.3`
  - `react-native-safe-area-context`: `~5.7.0`
- NativeWind config files:
  - `apps/mobile/babel.config.js` uses `babel-preset-expo` for runtime builds and adds `react-native-css/babel` only when `api.env('test')` is true so Jest can exercise className translation outside Metro.
  - `apps/mobile/metro.config.js` wraps Expo Metro with `withNativewind(config, { input: './global.css' })`.
  - `apps/mobile/global.css` imports Tailwind theme/preflight/utilities and `nativewind/theme`; semantic colors are defined with `@theme`.
  - `apps/mobile/nativewind-env.d.ts` references `react-native-css/types`.
  - `apps/mobile/jest.after-env.js` imports `react-native-css/jest` through Jest `setupFilesAfterEnv`.
  - `apps/mobile/src/app/_layout.tsx` imports `../../global.css`.
  - There is no active `tailwind.config.js`; Tailwind CSS v4 configuration is CSS-first.

## Mobile Environment Variables

Public JS runtime variables are parsed by `apps/mobile/env.ts`; app config variables are read directly by `apps/mobile/app.config.ts`.

`EXPO_PUBLIC_*` values are compiled into the client app and are not private. Use them only for public client configuration, never for tokens, passwords, bearer credentials, signing keys, or private service endpoints. Customer-specific and production values still must be injected through environment management instead of being hardcoded in the repo.

- Public JS runtime variables:
  - `EXPO_PUBLIC_APP_ENV`: `development`, `preview`, or `production`; default `development`.
  - `EXPO_PUBLIC_APP_DISPLAY_NAME`: optional in the runtime parser, default is `Mobile App Template`; required explicitly by preview, production, and EAS build config.
  - `EXPO_PUBLIC_API_URL`: required URL.
- Public app config variables:
  - `EXPO_PUBLIC_APP_SLUG`: required by preview, production, and EAS build config.
  - `EXPO_PUBLIC_APP_SCHEME`: required by preview, production, and EAS build config.
  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: required.
  - `EXPO_PUBLIC_ANDROID_PACKAGE`: required.
- Non-public variables:
  - `EAS_PROJECT_ID`: optional UUID.
Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.

## EAS And Maestro

- EAS config: `apps/mobile/eas.json`.
  - `development`: development client, internal distribution, `development` channel, `development` EAS environment.
  - `preview`: internal distribution, `preview` channel, `preview` EAS environment.
  - `production`: `production` channel with auto increment and `production` EAS environment.
  - `e2e-test`: Android APK and iOS simulator settings without credentials, using the `preview` EAS environment.
- The EAS profile/workflow label `e2e-test` is distinct from the repo Codex skill `$e2e-test`.
- EAS workflows:
  - `apps/mobile/.eas/workflows/build-and-submit.yml`: production build jobs use the `production` EAS environment and set `EXPO_PUBLIC_APP_ENV=production`.
  - `apps/mobile/.eas/workflows/e2e-test-android.yml`: E2E build job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
  - `apps/mobile/.eas/workflows/ota-update.yml`: preview update job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
- Maestro flows: `apps/mobile/.maestro`.
- Native E2E command: `pnpm --filter mobile e2e`.
- Current stable testIDs:
  - `home-title`
  - `counter-value`
  - `counter-increment-button`
- Prefer Maestro `id` selectors over visible text.

## API Runtime

- API path: `apps/api`.
- Stack: Hono, Drizzle ORM, postgres, zod.
- Scripts:
  - `pnpm --filter @template/api dev`
  - `pnpm --filter @template/api build`
  - `pnpm --filter @template/api lint`
  - `pnpm --filter @template/api test`
- Environment variables from `apps/api/src/env.ts`:
  - `DATABASE_URL`: required URL.
  - `API_PORT`: integer, default `3000`.
  - `API_BEARER_TOKEN`: required secret.
- Import direction remains routes to services to db only.
- Shared API/domain schemas must come from `packages/contracts`.
- Current Railway QA deployment:
  - Project: `new-mobile-app`.
  - API service: `api`.
  - Postgres service: `Postgres`.
  - API URL: `https://api-production-3d74.up.railway.app`.
  - Latest verified API deployment id: `4c701f22-3ce9-40ef-a4bd-560252b773f3`.
  - `GET /livez` returns `{"status":"ok"}`.
  - `GET /readyz` returns `{"status":"ok"}`.
  - Railway runtime variables include `DATABASE_URL`, `API_BEARER_TOKEN`, `PORT=3000`, `API_PORT=3000`, `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`, and `RAILWAY_HEALTHCHECK_PATH=/readyz`.
  - Do not print or commit Railway secret values. `API_BEARER_TOKEN` was rotated after setup output exposed an earlier generated value.

## Contracts Package

- Package path: `packages/contracts`.
- Source entry: `./src/index.ts`.
- Peer dependency: `zod ^3.25.0 || ^4.0.0`.
- This package is the single source of truth for API request/response types and shared domain schemas.
- Runtime export: `./dist/index.js`, with TypeScript types sourced from `./src/index.ts`.
- Build command: `pnpm --filter @template/contracts build`.
- Test command: `pnpm --filter @template/contracts test`.
- API Docker builds must build `@template/contracts` before `@template/api` so deployed Node runtimes do not import TypeScript source from `node_modules`.

## Codex Runtime

- Installed Codex plugin marketplaces:
  - `expo-plugins`
    - source: `expo/skills`
    - ref: `main`
    - marketplace root: user-local Codex marketplace cache, not a repo-pinned path; do not commit a resolved absolute path.
- Installed Codex plugins:
  - `expo@expo-plugins`
    - version: `1.1.0`
    - status: installed and enabled
    - plugin root: user-local Codex plugin cache for `expo-plugins/expo/1.1.0`, not a repo-pinned path; do not commit a resolved absolute path.
    - use only for generic Expo, React Native, EAS, dev client, SDK upgrade, deployment, native UI, API route, and data fetching guidance.
    - repo skills remain authoritative for contracts, role boundaries, evidence, and QA gates.
- Repo skills: `.agents/skills/<skill-name>/SKILL.md`.
  - `$wm` plans must be SoT-grounded: material planning decisions cite or name verified SoT inputs, and missing or ambiguous SoT must be reported as unknown/blocked instead of being filled by predictions, assumptions, or expected behavior.
  - `$wm` implementation runs must not proceed past planning until applicable local SoT has been read and cited or named in the plan.
  - `$wm` pre-implementation plan review evidence and final actual-work review evidence are mandatory for non-trivial implementation runs.
  - `$wm` implementation runs require persisted read-only reviewer evidence for both the completed plan and the actual completed work, and final user reports must include material `git diff` change details.
  - The `$wm` headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.
  - `$e2e-test` is the repo QA skill for E2E test planning, tested-instance reset, planned execution, and objective evidence capture across RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks. It records evidence under `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` and does not implement fixes.
  - `$qa-railway-workflow` is the repo QA skill for Railway CLI install/login/project/service/database/variable/domain/deploy/status/log/health workflows, redacted Railway evidence, RN Web E2E API URL handoff, and `PROJECT_ENVIRONMENT.md` synchronization. It does not implement app, backend, contract, migration, or mobile UI fixes.
  - Product/Planning repo-local Codex adapters use required `po-*` slugs:
    - `po-requirement-office-hours` maps source skill `mobile-requirement-office-hours` page `1374519364`.
    - `po-work-unit-planning-and-agent-sprint` maps source skill `mobile-work-unit-planning-and-agent-sprint` page `1374650456`.
    - `po-prd-to-execution` maps source skill `mobile-prd-to-execution` page `1373634562`.
    - `po-planning-completeness-review` maps source skill `mobile-planning-completeness-review` page `1374519387`.
    - These are Product/Planning operational adapters, not a standalone `mobile-product-planning-workflow` role wrapper.
  - Design repo-local Codex adapters use required `design-*` slugs:
    - `design-mobile-design-handoff` maps source skill `mobile-design-handoff` page `1373765661`, Design SOUL page `1373765702`, and Design Codex practice page `1374290207`.
    - `design-stitch-mcp-operating-rules` defines reusable Stitch MCP execution rules for Design handoff work and maps the same Design source/practice pages.
    - These adapters require objective UI/UX framing, DESIGN.md decision handling, Product/Planning P0 scope/evidence approval before Stitch generation, exactly two Stitch visual design directions, Product/Planning P1 scope/evidence approval before HTML extraction, Option A/B HTML extraction via `code.html` or Stitch MCP fetch only after P1, Option A/B image extraction via Stitch MCP, dated `design-pub-html/<YYYY-MM-DD>/` publication, five-state matrix, UX acceptance criteria, and evidence.
    - P0/P1 Product/Planning approvals are scope/evidence approvals for PRD fit, non-goals, evidence readiness, and human-gate routing. They are not Design quality approvals and do not move selected-option ownership out of Design.
    - Before P1 approval, Design must not call or persist `fetch_screen_code`, official ZIP `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent HTML extraction metadata.
    - Stitch prompt generation must use prompt enhancement and current `DESIGN.md`; Gemini 3.1 Pro, Pro, or Thinking mode is requested best-effort when the Stitch surface exposes model or mode selection, with actual capability and limitations recorded in `manifest.json`.
- Custom agents: `.codex/agents/<agent-name>.toml`.
  - wm review routing uses dedicated read-only agents:
    - `wm-implementation-reviewer`
    - `wm-contract-reviewer`
    - `wm-docs-researcher`
    - `wm-gate-fix-advisor`
    - `po-planning-reviewer`
    - `po-scope-gate-reviewer`
    - `po-docs-researcher`
    - `design-reviewer`
    - `design-researcher`
  - legacy `mobile-*` agents remain available for other runtime/eval surfaces, but `$wm` reviewer routing and `scripts/codex-headless-review.mjs` allow only the dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` read-only agents listed above.
- Hooks: `.codex/hooks.json` and `.codex/hooks/*.mjs`.
- MCP config: `.codex/config.toml`.
- Codex MCP/CLI setup guide: `docs/CODEX_MCP_ENVIRONMENT.md`.
- Root Claude runtime artifacts are not part of the active Codex runtime:
  - `CLAUDE.md`
  - `.claude/`
  - `.claude-state/`
  - `scripts/validate-runtime-artifacts.mjs` rejects these root paths. Third-party files with the same names under ignored dependency directories are outside this policy.
- Required project MCP servers:
  - `mobile-mcp`
  - command: `npx`
  - args: `-y @mobilenext/mobile-mcp@0.0.58`
  - local visual QA/device automation is required for mobile UI/runtime checks when a simulator or device is available.
  - it is excluded from required CI gates.
  - simulator and device operations must be serialized, not parallelized.
  - `serena`
  - command: `uvx`
  - args: `-p 3.13 --from git+https://github.com/oraios/serena@v1.5.3 serena start-mcp-server --project-from-cwd --context=codex`
  - symbolic navigation MCP for symbol overview, symbol lookup, reference search, and bounded repo code navigation.
  - `stitch`
  - command: `npx`
  - args: `-y stitch-mcp@1.3.2`
  - design-authoring MCP for Google Stitch project/screen generation and export handoff.
  - it uses local Google Cloud Application Default Credentials through `gcloud auth application-default login`.
  - actual use requires a Google Cloud project with the Stitch MCP service enabled, plus `GOOGLE_CLOUD_PROJECT` or a `gcloud config set project` value.
  - no Stitch API key is stored in the repo, `.codex/config.toml`, `EXPO_PUBLIC_*`, docs, or evidence.
  - do not use `@latest`.

exec
/bin/zsh -lc "sed -n '1,220p' AGENTS.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
      컨테이너/release candidate 접촉 시 필수
    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
      submit 전 필수
    - stage 00에서 Product/Planning이 `status.json.evidence_ladder.required_level` 설정,
      `validate-work-units.mjs`가 `05-qa-release` 완료 전 `achieved_level >= required_level`
      또는 `failed-gate-risk` waiver 존재를 강제
    - `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder다
      (boram SoT check 증거 문서에 기록) — runtime env가 아니므로 L2 실행 전에 appId
      파라미터화/주입 방안을 이 문서에서 규정해야 한다
  - pod-native skill `09-pod-native-openclaw-skills/eas-robot-auth-setup/`:
    `EXPO_TOKEN` 존재 status-only 확인, `npx eas-cli whoami` 종료코드, `EAS_PROJECT_ID`
    링크 확인. 값 출력 절대 금지. token은 `infra/clawpod/secret.example.yaml` 패턴으로 주입.
  - `scripts/ingest-eas-evidence.mjs`: eas-cli JSON 출력(`eas build:view --json` 등, 버전
    핀 고정 — `@latest` 금지 정책 준수) → `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-eas-<slug>/result.json`
    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
    요약 블록 생성. URL query token redaction. 네트워크 없는 `--self-test`(녹화 fixture).
  - `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(트리거 → 폴링 → ingest →
    실패 분류).
  - iOS는 Android 경로 검증 후 후속(P2)으로 `e2e-test-ios.yml` 추가 — 본 계획 범위 외로 명시.
- **수용 기준 (오프라인 — 선행 실행 가능)**: ingest `--self-test` 통과(녹화 fixture, 네트워크 0)
  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
  `validate:team-doc` 통과.
- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
  `EAS_PROJECT_ID`/GitHub-EAS 연동을 승인·주입 → PR에서 `e2e-test-android.yml` 실행 →
  증거 ingest). 승인·주입 전에는 `eas whoami`를 포함한 어떤 EAS 명령도 실행하지 않으며,
  native 검증 완료를 주장하지 않는다.

### PR6 (P1) — SoT refresh / drift 자동 검출

- **WHY**: G6. 에이전트 조직은 문서를 SoT로 신뢰하므로 drift는 조용한 오작동의 최대
  원인이다. placeholder를 "수동 절차 + 자동 검출"의 명시적 정책으로 전환한다.
- **WHAT**:
  - `package.json:20`의 placeholder를 `node scripts/sot-snapshot-check.mjs`로 교체:
    `evals/local-harness/sot/snapshot.json` 스키마/page-ID 목록 일치 검증 + `refreshed_at`
    30일 초과 경고(경고만, CI 비차단). 실제 re-fetch는 Atlassian MCP 수동/에이전트 절차로
    `evals/local-harness/README.md`에 규범화(네트워크·MCP 인증이 CI-unsafe하므로).
  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
    /tailwind/playwright 버전(`apps/mobile/package.json`), lightningcss override,
    MCP 핀(`.codex/config.toml`), CI trigger 경로 목록(`quality-gate.yml` 정규식) 일치 검사.
    `--online` 모드(PR 게이트 제외): Railway QA API `/livez`·`/readyz` 응답 확인.
  - `.github/workflows/sot-drift.yml`: 주간 cron, `--online` + snapshot age 검사,
    drift 시 GitHub issue 생성/갱신(비차단 — PR 게이트는 오프라인·결정적 유지).
- **수용 기준**: 핀을 한 곳만 수정한 mutated fixture에서 실패; PR 게이트 네트워크 무의존.

### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생

- **WHY**: G7, G8. 모두 실패를 실행 시점에서 사전점검 시점으로 당기는 작업.
- **WHAT**:
  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
    status-only, 값 출력 금지.
  - mobile-mcp: `.codex/config.toml` 핀 vs `PROJECT_ENVIRONMENT.md` 표기 drift 검사
    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
    디렉토리명 `^\d{8}-\d{6}-[a-z0-9-]+$` 강제, 금지 경로(`local/`, `tmp/`, `raw/`, `*.log`)의
    커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
  비-design 역할 preflight는 Stitch 블록 skip.

---

## Part C. Pod 조직 설계 (boram 패턴 재사용)

### C-1. 토폴로지 — 역할당 1 pod, 총 6 pod + CI Gatekeeper

| Pod 이름(요청명) | Operating Role | 이미지 | 자원 | 비고 |
| --- | --- | --- | --- | --- |
| `wm-po` | Product/Planning | agent-mobile **lite** | 2 CPU / 4Gi | 문서/계획 중심, GUI 불필요 |
| `wm-design` | Design | agent-mobile **full** | 2 CPU / 4Gi | Stitch MCP + 시각 확인용 Chromium/noVNC |
| `wm-arch` | Mobile Architect | agent-mobile **lite** | 2 CPU / 4Gi | 리뷰/계약 co-sign 중심 |
| `wm-mobile-dev` | Mobile App Dev | agent-mobile **full** | **4 CPU / 8Gi** | Metro bundler + pnpm install + Chromium 동시 부하가 boram 기준(2C/4Gi) 초과 |
| `wm-api` | Backend/API Integrator | agent-mobile **lite** | 2 CPU / 4Gi | Hono/Drizzle + Railway 배포 |
| `wm-qa` | QA/Release | agent-mobile **full** | **4 CPU / 8Gi** | Playwright 스크린샷 증거 + EAS/Maestro cloud 트리거 |

근거와 결정:

- **1역할 1pod**: `10-github-artifact-workflow.md`가 역할 격리 + GitHub-only handoff를
  전제하고, reviewer agent 분리(`.codex/agents/*-reviewer.toml`)가 행위자 분리를 가정한다.
  플랫폼은 agent당 ConfigMap/Secret/StatefulSet을 이미 지원하므로(검증) 추가 인프라가 없다.
- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
  work-unit의 `06-gatekeeper/` 파일은 CI 결과의 *전사*다 — LLM이 pass/fail을 판단하지 않는다.
- **별도 PM/오케스트레이터 pod를 만들지 않는다**: Product/Planning이 SoT상 intake·routing·
  readiness 소유자(Authority Level: Executive / Delivery Lead)다. 7번째 LLM 조정자는 SOUL
  미정의 역할을 신설하는 것이고, PR3의 resolver가 결정적이므로 조정 "판단"이 필요한 지점은
  이미 `wm-po`의 권한 범위다.
- 비용 제약 시 `wm-po`+`wm-arch`(둘 다 문서/리뷰 중심)는 1 pod 2 IDENTITY로 축약 가능하나,
  1단계에서는 6 pod를 유지한다(라우팅 규칙 단순화 + 리뷰 행위자 분리).

### C-2. 프로비저닝 내용 (ConfigMap / Secret / skills)

**ConfigMap** (`{AGENT_ID}-agent-config`, boram과 동일 메커니즘):

- `SOUL.md`: `02-role-souls/<role>-soul.md` 그대로 (runtime template note 준수)
- `IDENTITY.md`: Display Title, Operating Role, 소유 stage(예: QA/Release →
  `05-qa-release/`), 상류/하류 역할, NATS 룸 규약
- `AGENTS.md`(pod용): boram 베이스 + **GitHub handoff protocol 절** 추가 — repo URL,
  `/workspace/repo`로 clone-on-demand, 브랜치 규약 `wu/<work-unit-id>/<stage>`,
  `docs/plans/work-units/<work-unit-id>/` 스키마 요약, 그리고 핵심 규칙
  "로컬 파일/채팅으로 핸드오프 금지 — push된 branch/PR + NATS 신호만 유효"
- `TOOLS.md`: boram 베이스(filesystem, playwright, memory, a2a, skill-store) + 역할 추가분

**Secret** (최소 권한 원칙):

| Pod | Secret 키 |
| --- | --- |
| 전체 6 pod | `OPENAI_CODEX_AUTH_JSON`(boram 검증 패턴), `GITHUB_TOKEN`(repo 한정 fine-grained; 역할별 bot 계정 분리 권장 — PR 리뷰/승인 귀속성) |
| `wm-qa`만 | `EXPO_TOKEN`(EAS robot, `infra/clawpod/secret.example.yaml` 패턴), Railway 헬스체크용 read 토큰 |
| `wm-api`만 | `RAILWAY_TOKEN`(배포) — `qa-railway-workflow`가 "배포는 API, 증거는 QA"로 분리되는 가장 깨끗한 구도 |
| `wm-design`만 | Stitch용 Google ADC |

**`/workspace/skills`** (pod-native): 전 pod에 `codex-cli-auth-setup` +
`pod-role-bootstrap`(PR4); `wm-qa`에 `eas-robot-auth-setup`(PR5).
repo-local `.agents/skills`/`.codex/agents`는 clone 후 자동 가용이므로 ConfigMap에
중복 탑재하지 않는다.

### C-3. 이미지/툴체인 요구 (요지 — 상세는 Part D annex)

`clawpod/agent-mobile` (base 이미지 파생):

- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
  부트스트랩/preflight는 불일치 시 fail. eas-cli(전역), maestro CLI(**cloud 업로드
  모드 전용** — 로컬 드라이버 불필요), watchman(장시간 `expo start --web` 세션의
  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
- **명시적 제외**: Android SDK / adb / emulator 이미지 — KVM 부재로 사용 불가하며
  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
- `lite` 변형(po/arch/api용): base lite + pnpm + gh만

### C-4. 조정(coordination) 모델 — "GitHub가 상태, NATS는 초인종"

- **GitHub = 유일한 durable handoff**: `10-github-artifact-workflow.md` SoT 그대로.
  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
- **NATS 팀 룸 = wake-up 신호**: 단일 팀 룸(boram의 룸 구독 메커니즘 재사용)에 구조화
  신호만: `HANDOFF work-unit=<id> stage=<stage> pr=<url> next=<role>`. 신호 유실은
  webhook 경로가 보완하므로 신뢰성 요구 없음.
- **A2A = 동기 Q&A 전용**: 예) dev pod가 api pod에 계약 필드 질의. pod AGENTS.md에 규칙
  명문화 — "A2A로 도달한 결정은 work-unit 디렉토리에 기록되어야만 유효". 플랫폼 한도
  (동시 sub-agent 4, 메시지 depth 5) 준수.
- **Webhook gateway 규칙 3종**(GitHub adapter, ops 설정):
  1. PR opened/synchronized + label `next:<role>` → 해당 역할 pod 룸으로 라우팅
  2. check_suite failure (`wu/*` 브랜치) → `wm-qa`(실패 분류 소유) + stage 소유 pod
  3. PR merged (`wu/*`) → `wm-po` (stage 전진/종결)

### C-5. E2E 실행 트레이스와 단절점

"고객이 기능 X를 요청"의 전체 경로:

1. 인입 → `wm-po` 룸 (webhook gateway generic adapter 또는 운영 채널) →
   `po-prd-to-execution` + `po-work-unit-planning-and-agent-sprint` → work-unit 생성,
   `status.json` 초기화, `evidence_ladder.required_level` 설정, PR(label `next:design`)
2. `wm-design` wake → `design-mobile-design-handoff`(+Stitch) → `01-design/` → review
3. `wm-arch` → `02-architecture/` + 계약 co-sign (02/03 병렬 그룹)
4. `wm-api` → `packages/contracts` + `apps/api` 구현 → Railway preview 배포 + smoke
5. `wm-mobile-dev` → `apps/mobile` 구현(TDD) → RN Web Playwright 자가 검증 → 코드 PR
6. `wm-qa` (PR webhook으로 wake) → in-pod Playwright RN Web 증거 →
   `EXPO_TOKEN`으로 EAS cloud build + cloud Maestro 트리거 → `ingest-eas-evidence.mjs` →
   `05-qa-release/` 완성
7. Gatekeeper(CI) → required check 결정적 판정 → `06-gatekeeper/`에 전사
8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단

**단절점 표** (오늘 이 트레이스가 끊기는 지점과 수선 위치):

| # | 단절점 | 수선 | 위치 |
| --- | --- | --- | --- |
| B1 | pnpm pin mismatch(pod 10.33.3 vs SoT 9.15.9) → frozen-lockfile 설치 신뢰 불가 | pod-role-bootstrap의 corepack pin + preflight mismatch fail (+이미지 핀 정렬) | PR4 + annex |
| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
| B3 | webhook 규칙 없음 → QA가 PR에 깨어나지 못함 | 규칙 3종 등록 | annex (ops 설정) |
| B4 | EXPO_TOKEN/Railway/ADC가 예시로만 존재 | Secret 실주입 런북 | ops |
| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
| B6 | EAS 트리거·ingest 실행 경로 부재 | PR5 | 이 repo |
| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
| B8 | 고객 인입 경로 미정의 | generic adapter → `wm-po` 룸 + 인입 포맷 문서 | annex + 이 repo 문서 |

### C-6. 장애/에스컬레이션 모델

- **게이트 실패 루프**: check failure webhook → `wm-qa` 실패 분류(`failure-classification.md`,
  소유 역할 지명) → NATS `HANDOFF ... next=<owner>` → 동일 `wu/*` 브랜치에서 수정 → 재검.
  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
  생성(PR3). "실패 게이트의 위험 수용"은 LLM 권한 밖(QA SOUL 금지 조항 준수).
- **정체 감지**: 이 repo의 scheduled workflow(cron)가 무활동 N시간 초과 `wu/*` PR에
  stale 코멘트 → webhook → `wm-po` wake. 결정적 계층(CI)에 두는 이유는 Gatekeeper 철학과
  동일 — 감지는 판단이 아니다.
- **인간 에스컬레이션**: webhook gateway의 메시징 adapter로 `ESCALATE` 태그 메시지를
  인간 채널로 fan-out. 트리거: production submit, 결제/PII/법무, failed-gate 위험 수용,
  재시도 소진, 해소 불가 blocker.

---

## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)

이 절은 **요구사항 명세**다. 플랫폼 repo 직접 수정은 이 repo의 정책 범위 밖이며
(`12-ref-organization-goal-plan.md` Out of scope 원칙과 동일), 플랫폼 운영자가 이 절만
읽고 구현 가능해야 한다. 이 절의 모든 항목(이미지 빌드/푸시, webhook 규칙, pod 생성,
Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
ops 요구사항 annex로만 유지한다.

1. **이미지 `clawpod/agent-mobile` (+`:lite`)**: C-3 명세. arm64(OrbStack)/amd64 동시 빌드.
   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
   headless로 동작하고 Playwright가 통과; `eas whoami`가 robot token으로 성공;
   base 대비 증가분 합리적 수준(<~1.5Gi).
2. **webhook gateway 규칙**: C-4의 3종. label 기반 라우팅이 rules engine에 없으면 라벨
   파싱 연산자 추가 필요(요구사항으로 전달).
3. **agent 생성 payload 6종**(admin API): 이름/모델/자원(C-1 표), ConfigMap 4파일(C-2),
   Secret 키 목록(값은 redacted) — 런북에 템플릿으로 기록.
4. **k8s Secret 실주입 런북**: `GITHUB_TOKEN`(역할별), `EXPO_TOKEN`(QA), `RAILWAY_TOKEN`(API),
   Google ADC(Design). 값 출력/커밋 금지 규칙 준수.
5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
   validator), release environment protection(인간 reviewer), 역할별 bot 계정.

---

## Part E. 실행 순서와 최종 검증 드릴

### E-0. 실행 범위 결정 (2026-06-10 scope review 반영)

scope review(`.evidence/reviews/pod-organization-e2e-improvement-plan-scope-review-20260610.md`,
`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
실행 범위를 다음과 같이 한정한다.

- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
  스크립트의 fixture self-test·스키마 설계)까지.
- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.

### E-1. 순서

| 단계 | 내용 | 차원 |
| --- | --- | --- |
| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
| 5 | 나머지 4 pod + webhook 규칙 (B3·B8) | ops |
| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
| 8 | 최종 드릴 | 전체 |

3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
live EAS 실증은 승인·토큰 주입 후로 분리한다.

### E-2. 최종 수용 기준 (드릴)

합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:

- 전 stage `status.json`이 합법 전이만으로 `done` 도달
- RN Web Playwright 증거(스크린샷 포함) + EAS build ID가 포함된 `eas-evidence` 산출
- 모든 required check green, `06-gatekeeper/`는 CI 전사만 포함
- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)

보조 드릴: ① 임의 pod kill 후 GitHub만으로 상태 복원 ② 고의 테스트 실패 → 3회 재시도 →
`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.

## 리스크와 한계 (명시)

- `status.json` 병합 충돌(02/03 병렬): append-only events + stage별 브랜치 규약으로 완화,
  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
- EAS robot token 발급·GitHub↔EAS 연동은 본질적으로 1회 인간 셋업이다 — 자동화 약속이
  아니라 기록되는 human gate로 관리한다.
- 로컬 harness가 pod 실행을 증명하지 않는다는 기존 한계(`AGENTS.md` Local harness scope)는
  유지된다 — pod 실측 검증은 E-1 3단계/8단계의 운영 드릴이 담당한다.

## Human Gates (이 계획 자체)

다음은 인간 승인 없이 진행하지 않는다:

- 플랫폼 repo 직접 수정(annex는 요구사항 전달까지만)
- production submit 자동화 또는 release human gate 약화
- 역할별 GitHub bot 계정/토큰 발급, EAS robot token 발급
- 6 pod 동시 생성에 따르는 비용 확정

 succeeded in 0ms:
# AGENTS.md

## OpenClaw And Codex Skill Routing

- Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` using skill-creator structure.
- Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml` for primary artifacts; required validators, evals, scripts, and evidence may still be added when the change needs them.

This repository is the mobile app template runtime for WonderMove mobile agents.
Repo-wide operating policy ownership is defined in `REPO_OPERATIONS.md`.

## Required Rules

- TDD required: write or update tests before implementation changes.
- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
- No direct push to `main`; use a branch and PR.
- Do not modify external platform/runtime repositories from this repository.
- RN UI uses NativeWind + React Native primitives + semantic design tokens; web-only shadcn/ui is N/A for React Native screens (apply shadcn/ui only to optional web console).

## Codex Runtime Paths

- Native Codex CLI repo skills: `.agents/skills/<skill-name>/SKILL.md`
- Native Codex CLI custom agents: `.codex/agents/<agent-name>.toml`
- Native Codex CLI hooks: `.codex/hooks.json` and `.codex/hooks/`
- Native Codex CLI MCP config: `.codex/config.toml`
- Runtime evals and evidence: `evals/{skills,agents,hooks,local-harness}/`
- Runtime stability evidence: `.evidence/`

## Repository Structure

Monorepo layout (top-level):

- `apps/mobile/` — Expo Router app (template core)
- `apps/api/` — optional Hono + Drizzle backend (include only when a new backend is required; see §15 01-8)
- `packages/contracts/` — shared zod schemas and TypeScript types (single SoT for all API contracts)
- `infra/clawpod/` — EAS Robot token k8s Secret and agent-runner Job examples
- `docs/` — SETUP.md, CREDENTIALS.md, design-references/ (awesome-design-md vendored)
- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
- `.agents/`, `.codex/`, `evals/`, `scripts/` — Codex runtime layer, maintained through the runtime gates below

## Expo / React Native Runtime Policy

- Current mobile baseline is Expo SDK 56 (`expo ~56.0.9`) with React Native 0.85, NativeWind v5 preview, Tailwind CSS v4, and `expo-dev-client`.
- Environment/runtime changes must keep `PROJECT_ENVIRONMENT.md` and the Confluence update document in sync with actual repo settings.
- Before a mobile environment change is considered done, verify mobile lint/test, `expo install --check`, native run smoke on iOS/Android when available, and Maestro smoke where available.
- Official Expo skills may be introduced in a separate verified step with `npx skills add expo/skills`. Official Expo skills should cover generic Expo/RN workflows; repo skills remain responsible for this project's contracts, role boundaries, evidence, and QA gates.
- `mobile-mcp` is the required local visual QA/device automation MCP. Pin its version in `.codex/config.toml`, do not use `@latest`, do not add it to required CI gates, and do not parallelize simulator/device operations.

## Mobile QA Selectors

- Mobile screens should expose stable kebab-case `testID` values for long-lived automated checks.
- Prefer Maestro `id` selectors over visible-text selectors.
- Update app code, Jest tests, and Maestro flows together when changing a selector.
- Current baseline examples: `home-title`, `counter-value`, `counter-increment-button`.

## Local Harness Scope

- `pnpm run test:local-harness` validates Codex CLI runtime structure, role boundaries, skill/agent/hook configuration, gatekeeper/evidence fixtures, and best-effort headless Codex smoke.
- It is not an app feature test suite and does not prove Jira, Confluence, GitHub branch protection, EAS build/submit, production submit, or external platform/runtime behavior.
- OpenClaw packaging paths such as `/workspace/skills`, `OPENCLAW_ROOT`, generated agent packages, and OpenClaw package result files are outside the active local harness scope.
- Dirty worktree state is not a local harness failure condition; runtime edits must remain locally verifiable while in progress.

## Build / Test / Lint Commands

```
# Install all workspace dependencies
pnpm install

# Run lint and test across all workspaces (apps/mobile, apps/api if present)
pnpm turbo run lint test

# Run codex runtime verification (validate / test:hooks)
pnpm run test:runtime

# Run full Codex local harness for runtime-related PRs
pnpm run test:local-harness

# Start mobile dev server
pnpm --filter mobile start

# Run api tests only (when apps/api is present)
pnpm --filter @template/api test
```

## Conventions & PR Expectations

- `packages/contracts` is the single SoT for all API request/response types and shared domain schemas. Never declare ad-hoc duplicates in app or api code.
- Database columns use snake_case; TypeScript variables and API fields use camelCase. Convert at the boundary.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`).
- All changes go through a branch + PR. The quality-gate workflow must pass before merge.
- Codex runtime changes under `.agents/`, `.codex/`, `evals/{skills,agents,hooks,local-harness}/`, or runtime scripts must pass the conditional local harness gate.

## Constraints (do-not)

- Do not push directly to `main`.
- Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
- Do not use shadcn/ui for React Native screens (NativeWind + RN primitives only; shadcn/ui applies only to optional `apps/console`).
- Do not modify external platform/runtime repositories from this repository.
- `apps/api` import direction: routes → services → db only. Reverse imports are forbidden.
- API request/response types must be defined exclusively in `packages/contracts`. Ad-hoc type declarations outside contracts are forbidden.
- Migrations must use non-interactive procedure only: `drizzle-kit generate` (schema diff, no DB connection needed) + programmatic `migrate()` (idempotent, history-table based). Interactive `migrate dev` or CLI-applied migrations are forbidden.

## Definition of Done / Verification

Before opening a PR, verify:

1. Workspace lint and tests pass: `pnpm turbo run lint test`
2. Codex runtime artifacts are intact: `pnpm run test:runtime`
3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
4. For mobile environment/runtime changes, verify `pnpm --filter mobile exec expo install --check`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`, `pnpm --filter mobile run doctor`, and `codex mcp list`
5. For mobile UI/runtime changes with an available simulator or device, run local `mobile-mcp` visual QA/device automation serially and record the result in PR evidence

Applicable commands must exit 0.

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
현재까지는 보고서가 “repo 내부 오프라인 적용 가능 / human-ops 승인 전 외부 실행 차단 / 항상 금지”로 잘 나뉘어 있습니다. 남은 확인은 pod 실측 증거와 운영 정책이 같은 결론을 지지하는지, 그리고 외부 plan 경로 접근 가능성입니다.
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
hook: PreToolUse
exec
/bin/zsh -lc "sed -n '1,260p' REPO_OPERATIONS.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
# Repo Operations

This document is the canonical root-owned operating policy for this repository.
It explains where repo-wide operating rules live and how validators enforce
them. It does not replace `AGENTS.md` as the mandatory agent instruction
entrypoint, and it does not replace `PROJECT_ENVIRONMENT.md` as the current
runtime facts document.

## Policy Ownership Map

| Path | Owner Role |
| --- | --- |
| `AGENTS.md` | Mandatory agent execution rules, constraints, runtime paths, and required gates. |
| `PROJECT_ENVIRONMENT.md` | Current runtime and environment facts. |
| `REPO_OPERATIONS.md` | Canonical repo-wide operating policy and policy ownership model. |
| `team-doc/mobile-app-dev-team/` | Team, role, process, reference, and migration documentation. |
| `team-doc/00-source/` | Immutable Confluence source/export evidence. |
| `team-doc/10-structured/` | Generated or structured reference layer, not current policy owner. |
| `TEAM_DOC_ARCHIVE_MANIFEST.json` | Root-owned archive metadata for historical team-doc source/reference corpus. |
| `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` | Root-owned archived content bundle for historical team-doc source/reference corpus. |
| `scripts/` | Executable validation and test tooling, not policy owner. |

When these documents conflict, use the narrowest authoritative owner:
`AGENTS.md` for agent instructions, `PROJECT_ENVIRONMENT.md` for runtime facts,
this file for repo-wide operating policy, and role/team docs for role-specific
process detail.

## Document Strata

- Root policy and runtime files are the current canonical layer for repo-wide
  operations.
- Team docs describe how roles, processes, evidence, and migrations work within
  the mobile app development team.
- `team-doc/00-source/` preserves source/export evidence and should not be
  rewritten as current operating policy.
- `team-doc/10-structured/` remains a generated/reference layer until a
  separately approved migration or archive plan changes that status.
- `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` are the
  root-owned archive metadata and root-owned archived content used for
  delete-ready validation after the historical corpus is captured.

Do not delete, rewrite, or migrate `team-doc/00-source/` or
`team-doc/10-structured/` only because scripts or documents reference them.
Classify each reference first as current invariant, source/export integrity,
generated/reference traceability, migration evidence, or accidental coupling.

## Source And Archive Rules

`team-doc/00-source/` is immutable source/export evidence by default. If it is
ever moved or archived, the change must preserve `pageId`, source version,
`fetchedAt`, `sourceUrl`, and an explicit archive/sourcePath strategy before
the original path is removed.

`team-doc/10-structured/` is generated/reference material by default. It may be
used as migration input, historical examples, or generated integrity evidence,
but it is not the canonical owner of current repo-wide policy. A migration plan
must classify each structured reference before moving, rewriting, archiving, or
dropping it.

After archive capture, `TEAM_DOC_ARCHIVE_MANIFEST.json` is the root-owned
archive metadata SoT and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` is the root-owned
archived content SoT for the historical `team-doc/00-source/`,
`team-doc/10-structured/`, and `team-doc/_meta/` corpus. The bundle is the
explicit archive/sourcePath strategy: restore by writing each JSONL entry's
`content` to its recorded `path`. Once the root archive files validate and a
temp-workspace deletion check passes, the legacy directories are delete-ready
from a repo validation perspective.

## OpenClaw And Codex Operational Boundaries

Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime
and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
Repo-local Codex skills and agents use `.agents/skills/<skill-name>/SKILL.md`
and `.codex/agents/<agent-name>.toml`.

### Codex-only Repo Work Policy

For OpenClaw pods operating on a Codex-managed repository, repository work must
be routed through Codex CLI. The pod-local AGENTS.md policy should stay
agent-neutral and describe `this agent`, `assistant`, or `the agent`, not a
specific personal name. Codex-managed paths are listed in
`/workspace/CODEX_MANAGED_PATHS.md`, and the repository checkout path for this
project is `/workspace/new-mobile-app/`. The default Codex hook wrapper is
`/workspace/codex-hooks/codex-run` when available.

Do not print or commit auth tokens, API keys, OAuth tokens, refresh tokens,
passwords, or full secret-bearing config contents. Reports must use redacted
status, presence, file mode, and key-name summaries only.

## Evidence Gates

Done requires linked evidence, not status-only prose. For runtime and docs
changes, run the applicable gates from `AGENTS.md` and keep command output with
exit status in evidence.

## Package Script Composition

Active runtime composition:

```text
pnpm run validate
pnpm run validate:repo-operations
pnpm run validate:team-doc
pnpm run test:hooks
```

`pnpm run test:runtime` must compose those active current team/runtime gate
checks. It must not include archive/reference corpus validation as a hidden
runtime requirement.

Archive/reference corpus validation is explicit:

```text
pnpm run validate:team-doc-archive
```

Run `validate:team-doc-archive` when changing, moving, archiving, regenerating,
or auditing `TEAM_DOC_ARCHIVE_MANIFEST.json`, `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`,
historical `team-doc/00-source/`, historical `team-doc/10-structured/`, `_meta`
source maps, or migration crosswalks. Do not treat that command as proof that
the legacy Confluence-shaped corpus is current team/runtime SoT.

Runtime path or harness changes must also run `pnpm run test:local-harness`
unless a source-backed blocker is reported.

Local validation and local harness evidence prove repo-local rules only. They do
not prove actual OrbStack/OpenClaw pod execution, Jira or Confluence behavior,
GitHub branch protection, EAS production submit, or external platform state.

## Validator Responsibility Model

Validators enforce documented policy; they are not the policy owner.

- `scripts/validate-repo-operations.mjs` validates root policy ownership,
  `AGENTS.md` linkage, package script composition, and selected cross-document
  operating-policy invariants.
- `scripts/validate-team-doc.mjs` validates current managed team docs,
  role/process documents, active repo-local skill and agent contracts, pod-native
  skill documentation, and current migration documents. It must not require
  `team-doc/00-source/` or `team-doc/10-structured/` as active current
  team/runtime inputs.
- `scripts/validate-team-doc-archive.mjs` validates archive/reference integrity
  from root archive files: `TEAM_DOC_ARCHIVE_MANIFEST.json` and
  `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`. It must preserve `_meta` source map,
  generated-reference shape, legacy Confluence-shaped corpus checks, and
  migration crosswalk traceability without requiring live
  `team-doc/00-source/` or `team-doc/10-structured/` directories.
- `scripts/generate-team-doc.mjs` is legacy Confluence-shaped corpus generation
  and migration tooling. It is not current team/runtime validation.
- Package scripts compose subvalidators explicitly. Do not rely on hidden
  coupling in a monolithic validator to preserve gate strength.

Future validator changes must keep required gates explicit in `package.json`
and must include reviewer evidence before removing or demoting an existing check.

hook: PostToolUse
exec
/bin/zsh -lc 'rg -n "test:runtime|validate-repo-operations|quality-gate|branch protection|Secret|token|external|human|Gatekeeper|mobile-mcp|OpenClaw|pod|main|release" REPO_OPERATIONS.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
36:- `team-doc/10-structured/` remains a generated/reference layer until a
69:## OpenClaw And Codex Operational Boundaries
71:Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime
72:and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
78:For OpenClaw pods operating on a Codex-managed repository, repository work must
79:be routed through Codex CLI. The pod-local AGENTS.md policy should stay
86:Do not print or commit auth tokens, API keys, OAuth tokens, refresh tokens,
107:`pnpm run test:runtime` must compose those active current team/runtime gate
127:not prove actual OrbStack/OpenClaw pod execution, Jira or Confluence behavior,
128:GitHub branch protection, EAS production submit, or external platform state.
134:- `scripts/validate-repo-operations.mjs` validates root policy ownership,
138:  role/process documents, active repo-local skill and agent contracts, pod-native

hook: PostToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,220p' .agents/skills/wm/SKILL.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
---
name: wm
description: Use only when explicitly invoked as $wm or /wm to run the WonderMove mobile repo workflow for scoped planning, tests-first implementation, read-only Codex review evidence, and branch/PR gate readiness in this repository. Do not use for generic Expo/RN advice, external runtime repository edits, or self-approval; route review-only requests to read-only custom agents.
---

# wm

Use this repo-local WonderMove workflow only when the user explicitly invokes `$wm` or `/wm`.

Review-only requests MUST route to the read-only custom agents without triggering write-side implementation.

## Operating Rules

- `$wm` / `/wm` MUST plan before non-trivial work: clarify scope, owner, affected paths, expected tests, evidence path, and gate impact before editing.
- `$wm` / `/wm` plans MUST use SoT-grounded planning: cite or name the verified Source of Truth inputs used for each material decision. If a required SoT cannot be read or verified, mark that part unknown or blocked; do not fill gaps with predictions, assumptions, or expected behavior.
- Stay read-only until the initial plan is established; proceed only when the user request calls for execution and required human gates are not blocking.
- Use Serena for symbolic navigation and bounded code lookup when it improves confidence. Use focused `rg` for repo search, and route review, research, or gate triage to the appropriate read-only custom agent.
- Follow TDD: write or update evals/tests/validator assertions before implementation changes.
- Keep changes inside this repository. Do not modify external platform/runtime repositories.
- Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
- Use `packages/contracts` as the single source of truth for shared API schemas and mobile-facing request/response types.
- Keep React Native UI on NativeWind, React Native primitives, and semantic design tokens.
- Preserve branch and PR workflow; do not push directly to `main`.

## Mandatory SoT And Review Gates

- Non-trivial implementation runs MUST NOT proceed past planning until the applicable local SoT has been read and cited or named in the plan.
- If applicable SoT is missing, unreadable, or ambiguous, mark the item unknown or blocked instead of proceeding from assumptions.
- Pre-implementation plan review evidence and final actual-work review evidence are mandatory for non-trivial implementation runs.
- The completed implementation plan must be reviewed by the appropriate read-only reviewer before implementation starts, unless the user explicitly requested planning-only and no repo edits will follow.
- The actual completed work must be reviewed by the appropriate read-only reviewer against the approved plan, git diff, command output, and evidence before Done.
- The headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.

## Workflow

1. Confirm the task is explicitly invoked with `$wm` or `/wm`.
2. For non-trivial work, produce a short SoT-grounded plan before implementation. Include scope, owner role, affected paths, expected tests, evidence path, gate impact, any human gate or handoff needed before execution, and the SoT sources used. A completed implementation plan must be reviewed by the appropriate read-only reviewer before implementation starts, unless the user explicitly requested planning-only and no repo edits will follow.
3. Identify the role boundary:
   - Mobile UI/runtime implementation: use `.agents/skills/mobile-app-dev-workflow/SKILL.md`.
   - Mobile-facing backend/API contract work: use `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`.
   - Review, docs research, or gate triage: call the relevant read-only custom agent.
4. Read the applicable local SoT before planning or editing: `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, and any relevant role `references/sot.md` file. Do not base plans on predictions, assumptions, or expected behavior when the SoT is missing or ambiguous.
5. Add or update the narrowest failing test, eval fixture, harness assertion, or validator check first.
6. Implement the smallest repo-scoped change that satisfies the test and respects ownership boundaries.
7. Run the applicable verification:
   - Runtime changes: `pnpm run test:runtime`.
   - Runtime path or harness changes: `pnpm run test:local-harness`.
   - Workspace code changes: `pnpm turbo run lint test`.
   - Mobile runtime changes: `pnpm --filter mobile exec expo install --check`, mobile lint/test/doctor, and local visual QA when a simulator or device is available.
8. After implementation and tests, actual completed work must be reviewed by the appropriate read-only reviewer against the approved plan, git diff, command output, and evidence before Done.
9. Record evidence under `.evidence/` or `evals/*/results/` for review, gate, harness, or QA proof. Persist plan-review and final-review evidence for every non-trivial implementation run.
10. Before the final user completion report, run `git diff` for the changed paths, check full `git status --short`, and include the material diff/change details in the completion report.

## Symbolic Navigation

Use Serena MCP for symbol overview, symbol lookup, reference search, and bounded code navigation. If Serena is unavailable, use focused `rg` and file reads, and record the degraded lookup path in evidence when it affects confidence.

## Read-Only Review Routing

Use `scripts/codex-headless-review.mjs` as one supported path for Codex headless high review evidence. The headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.

Allowed custom agents:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-gate-fix-advisor`
- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `po-docs-researcher`
- `design-reviewer`
- `design-researcher`

Reviewer/researcher outputs must include source references, must not edit files, and must not recursively delegate.

Verdict-producing reviewers (`wm-implementation-reviewer`, `wm-contract-reviewer`, `po-planning-reviewer`, `po-scope-gate-reviewer`, and `design-reviewer`) must return findings-first prose plus exactly one fenced machine-readable reviewer verdict JSON envelope at the end. The envelope uses `verdict` (`GO`, `NO_GO`, `NEEDS_HUMAN`, `BLOCKED`), `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`. `GO` is allowed only when there are no Critical/High/Medium findings and required checks are `PASS` or source-backed `NOT_APPLICABLE`; failed required checks are `NO_GO`, missing required checks are `BLOCKED`, and human-gate blockers are `NEEDS_HUMAN`.

Researcher/advisor agents remain advisory and must not be forced into the machine-readable reviewer verdict contract. Use `node scripts/codex-headless-review.mjs --json-envelope --agent <verdict-reviewer> --prompt <text-or-file> --out <path>` when a headless review must validate the envelope.

## Forbidden

- Using this workflow for generic Expo/RN questions that do not depend on this repo's SoT.
- Treating review-only prompts as write-side implementation work.
- Inventing API contracts outside `packages/contracts`.
- Treating hook reminders as the hard pass/fail gate.
- Accepting production, privacy, legal, payment, external messaging, or failed-gate risk without the required human gate.
- Writing `$wm` plans from predictions, assumptions, or expected behavior instead of verified SoT.
- Marking work done without command output, evidence path, or explicit blocked reason.

hook: PostToolUse
exec
/bin/zsh -lc "sed -n '1,220p' /Users/tw.kim/.claude/plans/luminous-snacking-moler.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "sed -n '1,260p' .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
# 실행 계획: 13번 개선 계획 fact 정정 + repo-side 개선(PR1~PR7) 오프라인 구현

**계획서 Path: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`** (보고 시 반드시 포함)

## Context

직전 사이클에서 `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`를 작성했고, 사용자 피드백 + repo에 커밋된 scope review 2건(`.evidence/reviews/pod-organization-e2e-improvement-plan-scope-review-20260610.md`, `...-rereview-20260610.md`, verdict **NO_GO**)이 다음을 요구한다:

1. **사실 정정 (HIGH, blocking)**: boram pod에 pnpm이 "없다"고 썼으나, checked-in 증거(`.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47`)는 **pnpm 10.33.3 존재**를 기록. repo SoT는 `pnpm@9.15.9`(package.json:5). 즉 문제는 "부재"가 아니라 **"pin mismatch"**. eas-cli/maestro/adb/emulator/Java/KVM 부재는 그대로 유효(같은 증거 49–53행). canary도 같은 버전으로 추정되나 직접 증거는 boram만 — 문서에 이렇게 기재.
2. **실행 범위 한정**: PR1·PR2·PR3·PR4·PR6·PR7 + PR5의 **오프라인 작업만** repo에서 실행 가능. Part D(이미지/웹훅/pod 생성/Secret/branch protection)는 ops 요구사항 annex로만 유지 — 실행 금지.
3. **금지 사항**: 토큰 발급/주입, live EAS 실행(`eas whoami` 포함), pod/이미지/웹훅 작업, production submit 자동화, release human gate 약화, Gatekeeper의 LLM화, RN Web 증거의 native 대체 취급, 로컬 검증의 pod 실행 증명 취급.

이번 실행의 산출물 = 문서 정정 1건 + repo 내부 구현 6묶음. 모든 단계는 외부 네트워크/자격증명 불필요(오프라인).

## 하드 가드레일 (전 단계 공통)

- 외부 플랫폼 repo·k8s·GitHub 설정 변경 없음. Secret/token 어떤 것도 발급·주입·출력하지 않음.
- `eas`/`railway`/`gh api` 등 인증 필요 명령 실행 금지. 모든 신규 스크립트는 `--self-test`(fixture 기반, 네트워크 0)로 검증.
- `human-approval.json` 부재 = release 차단은 불변식으로 validator에 인코딩.
- `06-gatekeeper` stage에 reviewer agent 지정 금지(비-LLM 불변식)를 validator에 인코딩.
- 신규 validator는 3중 배선: `package.json` scripts + `.github/workflows/quality-gate.yml`의 스크립트 정규식(line ~26) + `PROJECT_ENVIRONMENT.md` CI 절.
- team-doc 수정 시 "CTO" 단어 금지(validate-team-doc.mjs:1114-1124), secret 패턴 금지.
- validator-first(TDD): 각 phase에서 fixture/self-test를 먼저 작성.

## Phase 0 — 13번 문서 fact 정정 (선행, 단독 커밋)

`team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` 수정:

1. **조사 방법 3번** (live pod 실측 절): "모바일 툴체인 전무(pnpm/eas-cli/maestro/...)" → pnpm을 목록에서 제거하고 "pnpm 10.33.3 존재(repo pin 9.15.9와 **불일치**), eas-cli/maestro/Android SDK/adb/emulator/mobile-mcp 부재, /dev/kvm 부재" + 증거 경로 `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` 인용. canary는 동일 추정·직접 증거는 boram임을 명기.
2. **G9 갭 표**: "agent 이미지에 pnpm 없음 → pnpm install부터 실패" → "pnpm **pin mismatch**(pod 10.33.3 vs SoT 9.15.9) → corepack pin 활성화/검증 필요".
3. **C-3 이미지 요구**: "corepack enable + pnpm 9.15.9 핀" 표현을 "pnpm 핀 강제(현재 10.33.3 탑재 → 9.15.9로 corepack pin, 불일치 시 부트스트랩 fail)"로 정정.
4. **C-5 단절점 B1**: "pod에 pnpm 없음 → 5·6단계 시작 불가" → "pnpm 버전 불일치 → frozen-lockfile 설치 불안정. 수선: pod-role-bootstrap의 corepack pin + preflight mismatch fail".
5. **PR4 절**: pnpm 검사 문구를 "pnpm 9.15.9 pin 일치 검사 — mismatch 시 fail (boram 실측 10.33.3 근거)"로 보강.
6. **Part D 서두**: "이 절의 모든 항목은 인간/ops 승인 전 실행 금지"를 1문장 추가 (리뷰 finding 2·3 대응). Part E 표에 "3·5·6단계는 human/ops 승인 게이트 뒤"를 명시.
7. PR5 절에 추가 사실: `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder(위 증거 86행) — 오프라인 작업에 appId 파라미터화 방안 문서화 포함.

검증: `node scripts/validate-team-doc.mjs` + `pnpm run test:runtime`.

## Phase 1 — PR1: Work-unit 상태머신 (우선순위 1)

설계 상세는 13번 문서 Part B PR1 절을 따른다 (`wu-status/v1` 스키마, state enum 7종, 합법 전이표, 02/03 parallel_groups, append-only events).

생성/수정:
- `scripts/lib/work-unit-machine.mjs` — state enum, 전이표, stage 순서/병렬 그룹, 전이 적용 함수(불법 전이 throw). validator와 resolver가 공유.
- `scripts/validate-work-units.mjs` — `docs/plans/work-units/*/status.json` 검증: 스키마, stage id = 디렉토리 8종 일치, done 조건(산출물 실재 + reviewer envelope GO 재검증 + handoff 링크), gate-failed/attempts 규칙, gatekeeper 비-LLM 불변식, 선행 stage 규칙, secret 패턴 스캔. `--self-test` 모드.
  - reviewer envelope 재검증: `scripts/codex-headless-review.mjs`의 envelope 검증 로직 재사용(export 형태 확인 후 필요 시 공유 모듈로 추출 — 기존 `--self-test` 회귀 유지).
- fixtures: `evals/local-harness/work-units/`(valid / 불법 전이 / envelope 누락 / gatekeeper-with-reviewer 4종).
- `docs/plans/work-units/sample-role-handoff/status.json` 샘플 + 해당 README 갱신(필요 시).
- 3중 배선: `package.json`(`validate:work-units`를 `test:runtime` 체인에 추가), `quality-gate.yml` 정규식에 `validate-work-units` 추가, `PROJECT_ENVIRONMENT.md` CI 절 갱신.
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`에 status.json 규범 절 추가(스키마 요약 + 02/03 병합 책임은 Product/Planning 명기).

## Phase 2 — PR2: Human-gate 결정 envelope (`human-gate/v1`)

설계 상세는 13번 문서 PR2 절.

- 스키마 구현은 `scripts/lib/work-unit-machine.mjs`(또는 동급 lib)에 추가, 검증 규칙은 `validate-work-units.mjs`에 통합: category enum(`06-gates-and-evidence.md`의 human gate 카테고리와 일치 — 구현 시 해당 문서에서 정확한 카테고리 목록 추출), decision enum, **anti-self-approval**(decided_by.name이 역할명/agent명과 일치 시 fail), `failed-gate-risk`는 실패 check 참조 필수, `decision_reference`는 GitHub URL 또는 committed path 필수.
- `blocked-human` stage는 approved 결정 파일 존재 시에만 재개 가능 — 전이 규칙에 인코딩.
- fixtures 4종(정상/agent명 승인자/미정의 category/참조 누락).
- `06-gates-and-evidence.md`에 규범 절 추가 + 한계 명시(GitHub 신원 앵커, 정책 수준).
- sample work-unit에 human-gate 예시 파일 추가.

## Phase 3 — PR3: next-action resolver + `wm-orchestrate` skill

설계 상세는 13번 문서 PR3 절.

- `scripts/work-unit-next.mjs`: status.json + 파일시스템 → `next_actions[]`/`blocked[]` JSON (순수 함수, work-unit-machine.mjs 공유). stage→skill/reviewer 매핑은 `04-skills-and-agents-matrix.md` 기준 상수. `--role <slug>` 필터, `--apply-transition <stage> <state>`(공유 모듈 경유, 불법 전이 거부). 재시도: gate-failed 시 fix-findings + `wm-gate-fix-advisor` 첨부, attempts 소진 시 `request-human-gate`(failed-gate-risk pending 생성).
- `.agents/skills/wm-orchestrate/SKILL.md`: 절차(pull → resolver → **자기 WM_ROLE 몫만** → 역할 skill → headless reviewer → 전이 → commit/push) + 하드 규칙(타 역할 실행 금지, envelope/human-gate 파일 수정 금지 — pending 생성만, blocked-only 시 정지·보고). 기존 skill 문서 형식(`.agents/skills/wm/SKILL.md` 등) 준수.
- fixtures: 행복 경로(8 stage), 02/03 병렬, 재시도 루프, 소진 에스컬레이션, human-gate 차단/재개.
- skill 추가에 따른 등록: `04-skills-and-agents-matrix.md`, `PROJECT_ENVIRONMENT.md` Codex runtime 절(repo skills 목록), `validate-runtime-artifacts.mjs`가 skill 목록을 강제하는지 확인 후 필요 시 갱신.
- 로컬 dry-run: sample work-unit 사본으로 stage 00 resolver→transition 경로 검증(reviewer는 self-test 모드).

## Phase 4 — PR4: Pod 부트스트랩 계약 (Phase 1~3과 병렬 가능, Phase 0 이후)

설계 상세는 13번 문서 PR4 절. **pnpm 검사는 "pin 9.15.9 일치, mismatch 시 fail"** (Phase 0 정정 반영).

- `scripts/codex-preflight.mjs` 확장: `--pod` 모드 — codex 후보 경로에 `which codex`/`CODEX_BIN` 추가, arch 판정 `uname -m` 우선(macOS sysctl fallback 유지, 기존 동작 무회귀), node 22/pnpm pin/git identity/`gh auth status` 종료코드/Chromium 존재/`codex mcp list` 종료코드/역할 컨텍스트 fixture 존재 검사, `capabilities` 블록(`rn_web_e2e`, `native_e2e_local: false`, `eas_cloud`: EXPO_TOKEN **존재 여부만** status-only). 노트북에서는 `pod: skipped`.
- 기존 `--self-test`에 Linux형 fixture 추가(`evals/local-harness/preflight/` 기존 fixture 패턴 확인 후 동일 형식).
- pod-native skill 소스 `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/`(SKILL.md + scripts/pod-bootstrap.sh + references/report-template.md): 역할 해석(WM_ROLE env 우선 → `/workspace/IDENTITY` fallback, 불일치 hard fail) → clone → corepack pin pnpm 9.15.9 → `pnpm install --frozen-lockfile` → preflight → 보고. 기존 `codex-cli-auth-setup/` 구조·secret 비출력 가드 동일 적용.
- `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 등록(기존 codex-cli-auth-setup 검사 패턴 확장), `09-pod-native-openclaw-skills/README.md` 갱신.
- 주의: 로컬 검증은 pod 실행 증명이 아님을 SKILL.md와 13번 문서에 유지.

## Phase 5 — PR6 + PR7: 하드닝

설계 상세는 13번 문서 PR6/PR7 절.

PR6:
- `package.json:20` placeholder → `node scripts/sot-snapshot-check.mjs`(스냅샷 스키마/page-ID 목록 vs `evals/local-harness/README.md`, age 30일 경고 — 비차단). 수동 refresh 절차를 `evals/local-harness/README.md`에 규범화.
- `scripts/validate-project-environment.mjs`(오프라인, test:runtime 포함): PROJECT_ENVIRONMENT.md 핀 vs `package.json`/`apps/mobile/package.json`/lockfile override/`.codex/config.toml`(mobile-mcp·serena·stitch 핀)/`quality-gate.yml` trigger 정규식 일치. `--online`(Railway /livez·/readyz)은 구현하되 **PR 게이트·이번 실행에서 호출하지 않음**.
- `.github/workflows/sot-drift.yml`(주간 cron, 비차단, issue 생성) — 파일 추가만; 동작 증명은 하지 않음(로컬 검증 한계 준수).

PR7:
- preflight `--pod`에 design 역할 한정 Stitch 블록(ADC 파일/GOOGLE_CLOUD_PROJECT/핀 resolve — 전부 status-only, 실행·인증 시도 없음. 네트워크 필요한 resolve 검사는 fixture로 self-test).
- `scripts/validate-evidence-hygiene.mjs`: `.evidence/e2e-test/` 디렉토리명 패턴, 금지 경로 커밋 차단, `.evidence/`+`docs/plans/work-units/` secret 스캔 — `validate-team-doc.mjs:236-243` 패턴을 공유 모듈(`scripts/lib/secret-patterns.mjs`)로 추출해 양쪽에서 재사용(기존 validate-team-doc 무회귀). planted-secret fixture.
- 현재 트리에서 hygiene 검사가 실패하는 기존 파일이 있으면: 수정하지 않고 보고 후 allowlist 여부를 사용자에게 확인(기존 증거 파일은 불변 원칙).

## Phase 6 — PR5: 네이티브 E2E **오프라인 작업만**

설계 상세는 13번 문서 PR5 절. **금지: eas 명령 실행, EXPO_TOKEN 관련 모든 실행, live proof, native 완료 주장.**

- `team-doc/mobile-app-dev-team/14-native-e2e-strategy.md`: 증거 사다리 L0~L3 규범, required_level 설정·강제 규칙, in-pod emulator 기각 근거(KVM 부재 — boram 증거 인용), `appId: {{ANDROID_PACKAGE}}` placeholder 처리 방안(파라미터화 요구사항), live proof는 "EXPO_TOKEN/EAS_PROJECT_ID/GitHub-EAS 연동 인간 승인 후"로 명시적 보류 표기. README/99-source-map에 14번 등록.
- `scripts/ingest-eas-evidence.mjs`: 입력은 **녹화된 fixture JSON**(eas build:view/workflow run 형태) → `.evidence/e2e-test/<ts>-eas-<slug>/result.json` + `05-qa-release/` 요약 블록. URL token redaction. `--self-test`만으로 전체 검증(네트워크 0). eas-cli 버전 핀은 상수로만 기록.
- pod-native skill 소스 `eas-robot-auth-setup/`: SKILL.md/스크립트는 작성하되 "실행은 ops 승인 + token 주입 후" 가드 문구 포함, 검사 전부 status-only 설계.
- `validate-work-units.mjs`에 evidence_ladder 강제 규칙 추가(achieved < required && waiver 없음 → 05 done 차단).
- `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(실행 전제 조건: 토큰 주입 완료 명시).

## 단계별 공통 검증

각 Phase 종료 시:
1. 신규 스크립트 `--self-test` 전부 통과
2. `pnpm run test:runtime` (validate + repo-operations + team-doc + hooks)
3. `pnpm turbo run lint test`
4. `pnpm run test:local-harness` — `.agents/**`, `scripts/*validation*`, preflight 등 트리거 경로를 건드리므로 사실상 매 phase 필수
5. 세션 hook이 재생성한 루트 `CLAUDE.md`/`.claude`가 validate를 깨면 제거 후 재실행(이전 사이클에서 확인된 세션 아티팩트)

## 최종 보고 요건

- **계획서 Path 명시**: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`
- Phase별 산출 파일 목록 + 게이트 결과(명령·종료 상태)
- 실행하지 않은 것(금지 목록: pod/이미지/웹훅/토큰/live EAS/production submit)과 그 사유를 명시
- 후속 human/ops 승인 대기 항목 표(PR5 live proof, multi-pod rollout)

 succeeded in 0ms:
# Orbstack Boram Linux SoT Check

- Date: 2026-06-09
- Scope: check whether local Orbstack `boram-*` pod can be used for Linux/Android E2E verification.
- Result: Linux pod exists, but it is not currently an Android local E2E verification environment.

## Local Kubernetes Check

Current Kubernetes context:

```text
orbstack
```

Matching pod:

```text
clawpod/boram-vf7sbm-agent-0   2/2   Running
```

Pod containers:

```text
agent
ontology-bridge
```

Pod details:

- Namespace: `clawpod`
- Node: `orbstack`
- Pod IP: `192.168.194.120`
- Workload: `StatefulSet/boram-vf7sbm-agent`
- `agent` container image: `clawpod/agent:local`
- `ontology-bridge` container image: `clawpod-ontology-bridge:latest`
- `agent` mounts `/workspace` as RW PVC.
- `ontology-bridge` mounts `/workspace` as RO.

## Container Environment Check

`agent` container:

```text
Linux boram-vf7sbm-agent-0 ... aarch64 GNU/Linux
Ubuntu 24.04.4 LTS
node v22.22.2
pnpm 10.33.3
git version 2.43.0
no /dev/kvm
java: not found
adb: not found
emulator: not found
maestro: not found
```

`ontology-bridge` container:

```text
Linux boram-vf7sbm-agent-0 ... aarch64
Alpine Linux 3.23.3
node v22.22.1
no /dev/kvm
java: not found
adb: not found
emulator: not found
maestro: not found
```

Workspace check:

- `/workspace/projects` exists, but no checked-out `new-mobile-app` repo was found there.
- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.

## SoT Comparison

Repo SoT requires:

- Mobile lint/test, `expo install --check`, `expo doctor`, and `codex mcp list` for mobile runtime changes.
- Local `mobile-mcp` visual QA only when simulator/device is available.
- Maestro smoke only when a usable target and executable app id exist.
- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.

Existing repo evidence also says:

- Android/Ubuntu can cover Android QA only when Android SDK, platform tools, KVM, and device/emulator prerequisites are configured.
- The current Maestro flow still contains `appId: {{ANDROID_PACKAGE}}`, which is a project-generation placeholder, not a runtime env variable.

## Assessment

The Boram pod is usable as a general Linux execution container for limited tasks:

- shell commands
- Node 22 execution
- git operations
- possibly JS-only checks after the repo is cloned/copied and the correct pnpm version is selected

The Boram pod is not currently usable for Android local E2E:

1. No `/dev/kvm`.
2. CPU architecture is `aarch64`.
3. No Android SDK/platform tools.
4. No Android Emulator.
5. No Java 17.
6. No Maestro CLI.
7. No Android device/emulator target.
8. The current project repo is not mounted or cloned into `/workspace/projects`.
9. The repo Maestro `appId` is still a generation-time placeholder.

## Decision

Using the Boram pod does not solve the Android E2E blocker today.

It can become useful for:

- deterministic Linux checks after repo checkout,
- EAS cloud build/workflow orchestration if EAS auth and public client config are provided,
- agent-runner style tasks that do not require local Android emulator/device access.

It should not be treated as local Android E2E evidence unless the pod is redesigned to include:

- a checked-out repo workspace,
- Node/pnpm aligned to repo expectations,
- Java 17+,
- Android SDK/platform tools,
- Maestro CLI,
- a usable Android device path, such as USB device forwarding or a separate emulator host,
- executable Maestro app-id handling.

For emulator-based Android E2E, this pod also needs a real virtualization/device strategy. Merely being a Linux pod is not enough.

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
exec
/bin/zsh -lc "rg -n \"pnpm|maestro|Android SDK|adb|emulator|Java|mobile-mcp|KVM|canary|boram|secret|token|ANDROID_PACKAGE|packageManager|9\\.15\\.9|10\\.33\\.3\" .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
4:- Scope: check whether local Orbstack `boram-*` pod can be used for Linux/Android E2E verification.
18:clawpod/boram-vf7sbm-agent-0   2/2   Running
33:- Workload: `StatefulSet/boram-vf7sbm-agent`
44:Linux boram-vf7sbm-agent-0 ... aarch64 GNU/Linux
47:pnpm 10.33.3
51:adb: not found
52:emulator: not found
53:maestro: not found
59:Linux boram-vf7sbm-agent-0 ... aarch64
64:adb: not found
65:emulator: not found
66:maestro: not found
72:- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.
79:- Local `mobile-mcp` visual QA only when simulator/device is available.
81:- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.
85:- Android/Ubuntu can cover Android QA only when Android SDK, platform tools, KVM, and device/emulator prerequisites are configured.
86:- The current Maestro flow still contains `appId: {{ANDROID_PACKAGE}}`, which is a project-generation placeholder, not a runtime env variable.
95:- possibly JS-only checks after the repo is cloned/copied and the correct pnpm version is selected
101:3. No Android SDK/platform tools.
103:5. No Java 17.
105:7. No Android device/emulator target.
117:- agent-runner style tasks that do not require local Android emulator/device access.
122:- Node/pnpm aligned to repo expectations,
123:- Java 17+,
124:- Android SDK/platform tools,
126:- a usable Android device path, such as USB device forwarding or a separate emulator host,
129:For emulator-based Android E2E, this pod also needs a real virtualization/device strategy. Merely being a Linux pod is not enough.

hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
외부 Claude plan도 접근 가능했고, 내용은 보고서가 말하는 prior finding 정정 범위와 일치합니다. 마지막으로 보고서가 자체 주장한 등록/검증 관련 문구가 과장되지 않았는지 좁게 확인하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "pnpm|packageManager" package.json pnpm-lock.yaml' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc 'rg -n "13-pod-organization|pod organization|Pod Organization|13번|source-map|README" team-doc/mobile-app-dev-team/README.md team-doc/mobile-app-dev-team/99-source-map.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
package.json:5:  "packageManager": "pnpm@9.15.9",
package.json:9:  "pnpm": {
package.json:17:    "test:runtime": "pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run test:hooks",
package.json:19:    "test:local-harness": "pnpm run test:local-harness:preflight && pnpm run test:runtime && pnpm turbo run lint test && node scripts/test-local-harness.mjs --self-test --stage all && node scripts/test-local-harness.mjs --stage all",

 succeeded in 0ms:
team-doc/mobile-app-dev-team/README.md:26:| `13-pod-organization-e2e-improvement-plan.md` | Pod 조직(boram-* 패턴)으로 모바일 앱 E2E를 무인 수행하기 위한 개선 계획 |
team-doc/mobile-app-dev-team/README.md:28:| `99-source-map.md` | 근거 파일과 active/historical crosswalk |
team-doc/mobile-app-dev-team/99-source-map.md:14:| `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` | Improvement plan for running the team as OpenClaw cloud pods with autonomous mobile-app E2E |
team-doc/mobile-app-dev-team/99-source-map.md:16:| `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md` | File-by-file migration plan from historical `team-doc/10-structured/**` identifiers into `ref-organization/`; source content is validated through root archive files |

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'rg -n "validate:repo-operations|test:runtime|validate-repo-operations" package.json scripts/validate-repo-operations.mjs .github/workflows/quality-gate.yml' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
package.json:17:    "test:runtime": "pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run test:hooks",
package.json:19:    "test:local-harness": "pnpm run test:local-harness:preflight && pnpm run test:runtime && pnpm turbo run lint test && node scripts/test-local-harness.mjs --self-test --stage all && node scripts/test-local-harness.mjs --stage all",
package.json:23:    "validate:repo-operations": "node scripts/validate-repo-operations.mjs",
scripts/validate-repo-operations.mjs:56:  const expectedRuntime = 'pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run test:hooks';
scripts/validate-repo-operations.mjs:57:  if (scripts['test:runtime'] !== expectedRuntime) {
scripts/validate-repo-operations.mjs:58:    fail(`package.json test:runtime must keep active gates only: ${expectedRuntime}`);
scripts/validate-repo-operations.mjs:63:  if (scripts['test:runtime']?.includes('validate:team-doc-archive')) {
scripts/validate-repo-operations.mjs:64:    fail('package.json test:runtime must not include archive/reference validator');
.github/workflows/quality-gate.yml:17:      - run: pnpm run test:runtime

hook: PostToolUse
exec
/bin/zsh -lc 'rg -n "Prior|prior|BLOCK|finding|Decision|Final Decision|Residual|Caveat|Current Gate|Overall Judgment" .evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
18:## Overall Judgment
24:The prior blocking factual issue is resolved at the plan level: the pod problem is no longer
47:- Keep the remaining absence findings for cloud CLI, Maestro, Android SDK, adb, emulator,
95:### 3. PR2: Human-Gate Decision Envelope
291:- Do not make `13-pod-organization-e2e-improvement-plan.md` a higher-priority policy SoT than
507:## Current Gate Status
516:  the prior archive-term drift, not as a substitute for full `test:runtime`.
531:## Final Decision
536:`GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`.

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
재검토 범위에서 새 차단 이슈는 보이지 않습니다. 출처 라인 확인만 보강한 뒤, 한국어 findings와 단일 JSON envelope로 결론을 정리하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "Do not print|Evidence Gates|test:runtime must compose|Local validation and local harness evidence prove|validate-repo-operations|external platform state|OpenClaw pods" REPO_OPERATIONS.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc 'rg -n "Package manager|Required root gates|RN Web E2E validates|RN Web E2E does not validate|Native completion remains separate|mobile-mcp|EAS config|e2e-test|Do not hardcode|EXPO_PUBLIC|token|Required project MCP servers" PROJECT_ENVIRONMENT.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc 'rg -n "No hardcoding|Do not modify external|test:runtime|mobile-mcp|Local Harness Scope|does not prove|quality-gate|TDD required|Applicable commands" AGENTS.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
78:For OpenClaw pods operating on a Codex-managed repository, repository work must
86:Do not print or commit auth tokens, API keys, OAuth tokens, refresh tokens,
90:## Evidence Gates
126:Local validation and local harness evidence prove repo-local rules only. They do
128:GitHub branch protection, EAS production submit, or external platform state.
134:- `scripts/validate-repo-operations.mjs` validates root policy ownership,

 succeeded in 0ms:
13:- TDD required: write or update tests before implementation changes.
14:- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
16:- Do not modify external platform/runtime repositories from this repository.
37:- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
46:- `mobile-mcp` is the required local visual QA/device automation MCP. Pin its version in `.codex/config.toml`, do not use `@latest`, do not add it to required CI gates, and do not parallelize simulator/device operations.
55:## Local Harness Scope
58:- It is not an app feature test suite and does not prove Jira, Confluence, GitHub branch protection, EAS build/submit, production submit, or external platform/runtime behavior.
72:pnpm run test:runtime
89:- All changes go through a branch + PR. The quality-gate workflow must pass before merge.
97:- Do not modify external platform/runtime repositories from this repository.
107:2. Codex runtime artifacts are intact: `pnpm run test:runtime`
110:5. For mobile UI/runtime changes with an available simulator or device, run local `mobile-mcp` visual QA/device automation serially and record the result in PR evidence
112:Applicable commands must exit 0.

 succeeded in 0ms:
9:- Package manager: `pnpm@9.15.9` from root `package.json`.
12:- Required root gates:
38:  - `extra.apiUrl` reads `EXPO_PUBLIC_API_URL`.
60:- Repo QA skill: `$e2e-test` plans, resets, executes, and records E2E evidence. It is a Codex skill, not the EAS build profile or workflow label named `e2e-test`.
61:- RN Web E2E validates only RN Web/browser-reproducible UI, navigation, state, and business logic flows.
62:- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or other device/hardware features.
64:  - `EXPO_PUBLIC_API_URL=<deployed-api-url> pnpm --filter mobile e2e:web`
65:  - `EXPO_PUBLIC_API_URL` is compiled into the client app and is not private; never put bearer tokens, signing keys, passwords, or private endpoints in it.
67:  - Evidence: `.evidence/e2e-test/20260609-233244-rn-web-railway-api/`.
70:  - `EXPO_PUBLIC_APP_ENV=development`
71:  - `EXPO_PUBLIC_APP_DISPLAY_NAME=Mobile App Template`
72:  - `EXPO_PUBLIC_APP_SLUG=mobile-app-template`
73:  - `EXPO_PUBLIC_APP_SCHEME=mobileapptemplate`
74:  - `EXPO_PUBLIC_API_URL` from the command environment
75:  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER=com.template.mobile`
76:  - `EXPO_PUBLIC_ANDROID_PACKAGE=com.template.mobile`
77:- `EXPO_PUBLIC_*` values are public client configuration and must not contain tokens, bearer credentials, signing keys, passwords, or private service endpoints.
78:- Native completion remains separate:
79:  - Run Maestro and `mobile-mcp` visual QA when the required EAS account, simulator, emulator, or device is available.
80:  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.
84:- Styling layer: NativeWind with React Native primitives and semantic design tokens.
115:`EXPO_PUBLIC_*` values are compiled into the client app and are not private. Use them only for public client configuration, never for tokens, passwords, bearer credentials, signing keys, or private service endpoints. Customer-specific and production values still must be injected through environment management instead of being hardcoded in the repo.
118:  - `EXPO_PUBLIC_APP_ENV`: `development`, `preview`, or `production`; default `development`.
119:  - `EXPO_PUBLIC_APP_DISPLAY_NAME`: optional in the runtime parser, default is `Mobile App Template`; required explicitly by preview, production, and EAS build config.
120:  - `EXPO_PUBLIC_API_URL`: required URL.
122:  - `EXPO_PUBLIC_APP_SLUG`: required by preview, production, and EAS build config.
123:  - `EXPO_PUBLIC_APP_SCHEME`: required by preview, production, and EAS build config.
124:  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: required.
125:  - `EXPO_PUBLIC_ANDROID_PACKAGE`: required.
128:Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
132:- EAS config: `apps/mobile/eas.json`.
136:  - `e2e-test`: Android APK and iOS simulator settings without credentials, using the `preview` EAS environment.
137:- The EAS profile/workflow label `e2e-test` is distinct from the repo Codex skill `$e2e-test`.
139:  - `apps/mobile/.eas/workflows/build-and-submit.yml`: production build jobs use the `production` EAS environment and set `EXPO_PUBLIC_APP_ENV=production`.
140:  - `apps/mobile/.eas/workflows/e2e-test-android.yml`: E2E build job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
141:  - `apps/mobile/.eas/workflows/ota-update.yml`: preview update job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
207:  - `$e2e-test` is the repo QA skill for E2E test planning, tested-instance reset, planned execution, and objective evidence capture across RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks. It records evidence under `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` and does not implement fixes.
242:- Required project MCP servers:
243:  - `mobile-mcp`
245:  - args: `-y @mobilenext/mobile-mcp@0.0.58`
259:  - no Stitch API key is stored in the repo, `.codex/config.toml`, `EXPO_PUBLIC_*`, docs, or evidence.
266:  - this does not replace `mobile-mcp` for local visual QA/device automation.
291:- Does not run `mobile-mcp`; mobile device automation remains a local QA gate.

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'rg -n "사실 정정|실행 범위 한정|금지 사항|하드 가드레일|Phase 0|PR5|eas whoami|최종 보고 요건|test:runtime" /Users/tw.kim/.claude/plans/luminous-snacking-moler.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
9:1. **사실 정정 (HIGH, blocking)**: boram pod에 pnpm이 "없다"고 썼으나, checked-in 증거(`.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47`)는 **pnpm 10.33.3 존재**를 기록. repo SoT는 `pnpm@9.15.9`(package.json:5). 즉 문제는 "부재"가 아니라 **"pin mismatch"**. eas-cli/maestro/adb/emulator/Java/KVM 부재는 그대로 유효(같은 증거 49–53행). canary도 같은 버전으로 추정되나 직접 증거는 boram만 — 문서에 이렇게 기재.
10:2. **실행 범위 한정**: PR1·PR2·PR3·PR4·PR6·PR7 + PR5의 **오프라인 작업만** repo에서 실행 가능. Part D(이미지/웹훅/pod 생성/Secret/branch protection)는 ops 요구사항 annex로만 유지 — 실행 금지.
11:3. **금지 사항**: 토큰 발급/주입, live EAS 실행(`eas whoami` 포함), pod/이미지/웹훅 작업, production submit 자동화, release human gate 약화, Gatekeeper의 LLM화, RN Web 증거의 native 대체 취급, 로컬 검증의 pod 실행 증명 취급.
15:## 하드 가드레일 (전 단계 공통)
25:## Phase 0 — 13번 문서 fact 정정 (선행, 단독 커밋)
35:7. PR5 절에 추가 사실: `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder(위 증거 86행) — 오프라인 작업에 appId 파라미터화 방안 문서화 포함.
37:검증: `node scripts/validate-team-doc.mjs` + `pnpm run test:runtime`.
49:- 3중 배선: `package.json`(`validate:work-units`를 `test:runtime` 체인에 추가), `quality-gate.yml` 정규식에 `validate-work-units` 추가, `PROJECT_ENVIRONMENT.md` CI 절 갱신.
72:## Phase 4 — PR4: Pod 부트스트랩 계약 (Phase 1~3과 병렬 가능, Phase 0 이후)
74:설계 상세는 13번 문서 PR4 절. **pnpm 검사는 "pin 9.15.9 일치, mismatch 시 fail"** (Phase 0 정정 반영).
88:- `scripts/validate-project-environment.mjs`(오프라인, test:runtime 포함): PROJECT_ENVIRONMENT.md 핀 vs `package.json`/`apps/mobile/package.json`/lockfile override/`.codex/config.toml`(mobile-mcp·serena·stitch 핀)/`quality-gate.yml` trigger 정규식 일치. `--online`(Railway /livez·/readyz)은 구현하되 **PR 게이트·이번 실행에서 호출하지 않음**.
96:## Phase 6 — PR5: 네이티브 E2E **오프라인 작업만**
98:설계 상세는 13번 문서 PR5 절. **금지: eas 명령 실행, EXPO_TOKEN 관련 모든 실행, live proof, native 완료 주장.**
110:2. `pnpm run test:runtime` (validate + repo-operations + team-doc + hooks)
115:## 최종 보고 요건
120:- 후속 human/ops 승인 대기 항목 표(PR5 live proof, multi-pod rollout)

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
검토 결과: **수정된 상세 applicability report는 수용 가능(GO)** 입니다. 파일 수정은 하지 않았고, 위임도 하지 않았습니다.

**Findings**

- 차단됐던 사실 오류는 해소됨: 보고서는 “pnpm 부재”가 아니라 `boram` pod의 `pnpm 10.33.3`과 repo SoT `pnpm@9.15.9`의 **pin mismatch**로 정정했습니다. 이는 [보고서](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:24), [13번 계획](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:29), [boram 증거](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47)와 일치합니다.
- split validity도 타당함: repo 내부 오프라인 작업, human/ops 승인 후 작업, 항상 금지 항목을 분리한 구조가 [13번 계획 E-0](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:445), [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:16), [REPO_OPERATIONS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/REPO_OPERATIONS.md:126)와 충돌하지 않습니다.
- gate 주장도 과장되지 않음: 보고서는 `test:runtime` green이나 PR-ready를 주장하지 않고, 사용자 지시에 따른 skip과 narrow check 한계를 명시합니다. [보고서](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:507)
- 잔여 리스크는 문서 성격상 적절히 남아 있음: live native E2E, branch protection, webhook, pod rollout, credential injection은 승인 전 차단으로 남겨야 하며, 보고서도 그렇게 처리했습니다.

```json
{
  "verdict": "GO",
  "reviewer": "reviewer-xhigh",
  "mode": "wm-review-only-direct",
  "scope": ".evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md prior findings re-review and split validity",
  "findings": [],
  "checks_reviewed": [
    {
      "check": "prior_high_fact_correction_pnpm",
      "status": "PASS",
      "source": ".evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md, team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md"
    },
    {
      "check": "applicability_split_validity",
      "status": "PASS",
      "source": "AGENTS.md, PROJECT_ENVIRONMENT.md, REPO_OPERATIONS.md, team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md"
    },
    {
      "check": "session_plan_alignment",
      "status": "PASS",
      "source": "/Users/tw.kim/.claude/plans/luminous-snacking-moler.md"
    },
    {
      "check": "validate-repo-operations",
      "status": "PASS_REPORTED_BY_MAIN_AGENT",
      "source": "user-provided narrow check result: node scripts/validate-repo-operations.mjs exited 0"
    },
    {
      "check": "full_test_runtime",
      "status": "NOT_APPLICABLE_USER_DIRECTED_SKIP",
      "source": "user instructed to skip because another session is modifying that area"
    }
  ],
  "residual_risks": [
    "This GO accepts the report as a detailed applicability report only; it does not approve implementation, PR readiness, live pod readiness, or native E2E completion.",
    "Full pnpm run test:runtime remains unasserted and must be rerun after the concurrent runtime-area session stabilizes before claiming runtime-gate green."
  ],
  "next_action": "Accept the corrected detailed applicability report as the current scope/applicability judgment; keep implementation and external/live operations gated by the report's stated constraints."
}
```
hook: Stop
hook: Stop Completed
tokens used
69,567
검토 결과: **수정된 상세 applicability report는 수용 가능(GO)** 입니다. 파일 수정은 하지 않았고, 위임도 하지 않았습니다.

**Findings**

- 차단됐던 사실 오류는 해소됨: 보고서는 “pnpm 부재”가 아니라 `boram` pod의 `pnpm 10.33.3`과 repo SoT `pnpm@9.15.9`의 **pin mismatch**로 정정했습니다. 이는 [보고서](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:24), [13번 계획](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:29), [boram 증거](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47)와 일치합니다.
- split validity도 타당함: repo 내부 오프라인 작업, human/ops 승인 후 작업, 항상 금지 항목을 분리한 구조가 [13번 계획 E-0](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:445), [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:16), [REPO_OPERATIONS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/REPO_OPERATIONS.md:126)와 충돌하지 않습니다.
- gate 주장도 과장되지 않음: 보고서는 `test:runtime` green이나 PR-ready를 주장하지 않고, 사용자 지시에 따른 skip과 narrow check 한계를 명시합니다. [보고서](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md:507)
- 잔여 리스크는 문서 성격상 적절히 남아 있음: live native E2E, branch protection, webhook, pod rollout, credential injection은 승인 전 차단으로 남겨야 하며, 보고서도 그렇게 처리했습니다.

```json
{
  "verdict": "GO",
  "reviewer": "reviewer-xhigh",
  "mode": "wm-review-only-direct",
  "scope": ".evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md prior findings re-review and split validity",
  "findings": [],
  "checks_reviewed": [
    {
      "check": "prior_high_fact_correction_pnpm",
      "status": "PASS",
      "source": ".evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md, team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md"
    },
    {
      "check": "applicability_split_validity",
      "status": "PASS",
      "source": "AGENTS.md, PROJECT_ENVIRONMENT.md, REPO_OPERATIONS.md, team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md"
    },
    {
      "check": "session_plan_alignment",
      "status": "PASS",
      "source": "/Users/tw.kim/.claude/plans/luminous-snacking-moler.md"
    },
    {
      "check": "validate-repo-operations",
      "status": "PASS_REPORTED_BY_MAIN_AGENT",
      "source": "user-provided narrow check result: node scripts/validate-repo-operations.mjs exited 0"
    },
    {
      "check": "full_test_runtime",
      "status": "NOT_APPLICABLE_USER_DIRECTED_SKIP",
      "source": "user instructed to skip because another session is modifying that area"
    }
  ],
  "residual_risks": [
    "This GO accepts the report as a detailed applicability report only; it does not approve implementation, PR readiness, live pod readiness, or native E2E completion.",
    "Full pnpm run test:runtime remains unasserted and must be rerun after the concurrent runtime-area session stabilizes before claiming runtime-gate green."
  ],
  "next_action": "Accept the corrected detailed applicability report as the current scope/applicability judgment; keep implementation and external/live operations gated by the report's stated constraints."
}
```
