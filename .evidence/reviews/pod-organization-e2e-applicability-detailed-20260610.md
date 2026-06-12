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
