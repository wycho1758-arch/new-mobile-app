# Codex Hook Source Basis Confluence Update Plan

Date: 2026-06-08
Status: Published to Confluence; post-publication validation complete

## Critical Instructions

After each stage:

1. Check off completed task checkboxes in this plan.
2. Record the Confluence page IDs, versions, and fetched timestamp used as SoT input.
3. Run the listed validation commands where applicable.
4. Save Codex headless review output under `.evidence/codex-runtime-stability/`.
5. Do not rewrite existing Confluence frozen audit bodies; append follow-up evidence only.
6. Do not update live Confluence pages until this plan is reviewed and approved.

## Objective

Update the Confluence Source Basis for the Expo/React Native Codex hook policy using:

- internal Confluence SoT under `mobile-app-dev-team` homepage `1373012374`.
- official OpenAI Codex documentation for hook schemas, approvals, sandboxing, and `codex exec` review evidence.
- official Expo/React Native documentation for Expo CNG/prebuild, EAS variable scopes, Expo public client values, development builds, TypeScript, Expo CLI package alignment, and React Native testing limits.

The result must identify exactly which Confluence pages should be updated, what each page owns, what should not be duplicated, and how `codex exec` xhigh review validates the update before publication.

## Verified Internal SoT Inputs

Fetched from `https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/overview?homepageId=1373012374` on 2026-06-08.

| Page | Page ID | Version | Role In This Plan |
| --- | --- | ---: | --- |
| `mobile-app-dev-team` | `1373012374` | 3 | Space homepage and SoT map. |
| `00-3. 산출물 표준` | `1373765641` | 2 | Domain-independent evidence/gate and AGENTS.md standards. |
| `00-4. 가설·결정 레지스트리` | `1373798401` | 3 | Decision registry; verify whether Stop continuation requires a decision clarification. |
| `01-6. 개발 지침 (root AGENTS.md 확장안)` | `1373634583` | 1 | Mobile repo development rules, TDD, routing, contracts, tests. |
| `01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안` | `1371963427` | 18 | Template repo SoT and runtime constraints. Do not duplicate hook details here unless template structure changes. |
| `01-9. 검증 근거·감사 기록` | `1373667446` | 5 | Evidence/audit repository; append source-basis update evidence only after publication. |
| `Role-specific Codex Runtime` | `1374289964` | 1 | Runtime boundary: `.agents/skills`, `.codex/agents`, `.codex/hooks`, generated-agent package separation. |
| `codex-cli-native-runtime-paths` | `1374355481` | 1 | Runtime path details for Codex native repo skills, agents, hooks, evals. |
| `Hooks` | `1374060648` | 1 | Hook index and top-level hook principles. Primary policy update target. |
| `mobile-pretool-policy-hook` | `1374290046` | 1 | PreToolUse page. Primary policy update target. |
| `mobile-posttool-evidence-reminder-hook` | `1374388296` | 1 | PostToolUse page. Primary policy update target. |
| `mobile-stop-gatekeeper-advisory-hook` | `1374355521` | 1 | Stop page. Needs careful advisory-vs-continuation clarification. |
| `mobile-subagent-context-hook` | `1374060708` | 1 | Existing page is not a match for the current SessionStart hook. Needs rename/new-page decision. |
| `hook-evaluation-and-ci-gate` | `1374355561` | 1 | Hook fixture, schema, and CI validation policy. Primary validation update target. |
| `Mobile Codex CLI 실무 지침서 / Practitioner Guide` | `1374519410` | 1 | Practitioner guidance: SoT-bound plans, reviewer gates, evidence before Done, hook/gate respect. |
| `2026-06-07 Mobile Local Harness 완료 및 운영 가이드` | `1374290184` | 1 | Local harness scope and `codex exec` read-only smoke boundary. |

## Verified Official Source Basis

These links were rechecked on 2026-06-08 and should be referenced from the Confluence Source Basis.

| Source | Link | Hook Policy Use |
| --- | --- | --- |
| Codex hooks | https://developers.openai.com/codex/hooks | Event/matcher/handler model; `PreToolUse`, `PostToolUse`, `PermissionRequest`, `Stop`; event-specific JSON output; `PreToolUse` is a guardrail, not a complete enforcement boundary. |
| Codex agent approvals and security | https://developers.openai.com/codex/agent-approvals-security | Official basis for pairing hook behavior with Codex sandbox and approval policy. Broader CI/release controls are internal SoT policy overlay, not an OpenAI-doc claim. |
| Codex permissions | https://developers.openai.com/codex/permissions | Official basis for `PermissionRequest` approval-boundary behavior and allow/deny/defer policy. |
| Codex non-interactive mode | https://developers.openai.com/codex/noninteractive | `codex exec` and `--output-last-message` are the required headless review evidence path. |
| Expo TypeScript | https://docs.expo.dev/guides/typescript/ | SessionStart should inject `.tsx` for JSX and `.ts` otherwise, without hardcoding app versions. |
| Expo CLI | https://docs.expo.dev/more/expo-cli/ | `expo install` aligns package versions; hook context should prefer Expo-aware install commands for Expo-managed native packages. |
| Expo CNG/prebuild | https://docs.expo.dev/workflow/continuous-native-generation/ | Expo prebuild generates native directories; clean native regeneration deletes and recreates native projects, so it requires explicit intent. |
| Expo environment variables | https://docs.expo.dev/guides/environment-variables/ | `EXPO_PUBLIC_` values are visible in compiled client apps; hook policy must treat them as public and block private-value exposure. |
| EAS environment variables | https://docs.expo.dev/eas/environment-variables/ | Official basis for development, preview, and production variable scopes. Release approval rules are internal SoT policy overlay, not an Expo-doc claim. |
| Expo development builds | https://docs.expo.dev/develop/development-builds/introduction/ | UserPromptSubmit should flag features that may not work in Expo Go and may require a development build/config plugin. |
| React Native testing overview | https://reactnative.dev/docs/testing-overview | Jest is the default RN test framework; JS/component tests do not prove native runtime behavior, so native/config changes need stronger evidence. |

## Internal Policy Overlay

These policies are derived from internal SoT, not directly from the official Source Basis links:

- CI, branch protection, deterministic `mobile-gatekeeper`, and evidence-based Done ownership come from `00-3. 산출물 표준`, `Mobile Codex CLI 실무 지침서`, and `Mobile Local Harness 운영 가이드`.
- Production EAS build/update/submit release approval comes from `01-8. 템플릿 repo 설계안`, `Role-specific Codex Runtime`, and the requested Expo/RN hook policy.
- Stop continuation is local evidence collection only; hard pass/fail remains `mobile-gatekeeper` and GitHub required checks.

## Current Drift Findings

- `Hooks` lists only four existing hook pages; the requested policy needs six Codex hook events: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, and `Stop`.
- `mobile-subagent-context-hook` describes `SubagentStart` or equivalent, but the current repo runtime uses a `SessionStart` context hook. This should not be silently treated as equivalent.
- `mobile-pretool-policy-hook` is too generic for Expo/RN/EAS: it does not explicitly cover production EAS commands, clean native regeneration, package-manager mixing, Expo public value exposure, or event-specific `PreToolUse` deny/context output.
- `mobile-posttool-evidence-reminder-hook` needs richer mobile check classification: lint/typecheck/Jest/expo doctor failures, config/native/contracts/Maestro/evidence path changes, and Bash side-effect limitations.
- `mobile-stop-gatekeeper-advisory-hook` currently says blocking mode is out of MVP scope. Official Codex Stop continuation can be used as a local continuation prompt, but internal DEC-016 rejects a Stop-hook hard gate. The update must preserve that distinction: Stop continuation may ask Codex to gather missing evidence, but hard pass/fail remains `mobile-gatekeeper` and GitHub required checks.
- `hook-evaluation-and-ci-gate` fixture tests are substring/advisory oriented and need exact JSON schema assertions per event.
- No existing Confluence page covers `UserPromptSubmit` or `PermissionRequest`; new child pages under `Hooks` are required unless the owner explicitly chooses a consolidated page.

## Page Update Ownership Map

| Target | Action | Why |
| --- | --- | --- |
| `Hooks` (`1374060648`) | Update existing page. | This is the top-level hook policy index. It should list all six hook events, link new pages, and state that hooks are context/guardrails, not hard release executors. |
| `hook-evaluation-and-ci-gate` (`1374355561`) | Update existing page. | This page owns fixture schema, static validation, reviewer criteria, and CI integration. It should require exact event-specific JSON assertions and xhigh headless review evidence. |
| `mobile-pretool-policy-hook` (`1374290046`) | Update existing page. | PreToolUse is the main pre-execution guardrail for EAS production, native regeneration, private file reads, package-manager mixing, and risky context injection. |
| `mobile-posttool-evidence-reminder-hook` (`1374388296`) | Update existing page. | PostToolUse owns after-the-fact failure/evidence classification and must state it cannot undo side effects. |
| `mobile-stop-gatekeeper-advisory-hook` (`1374355521`) | Update existing page with decision-safe wording. | Stop may request continuation for missing validation evidence, but must not be documented as replacing deterministic gatekeeper/CI. |
| `mobile-session-start-context-hook` | Create new child page or rename/supersede `mobile-subagent-context-hook`. | The current repo has SessionStart behavior, while the existing Confluence page describes subagent policy. Mixing them would hide drift. |
| `mobile-user-prompt-policy-hook` | Create new child page under `Hooks`. | UserPromptSubmit is needed for native capability, platform, Expo Go/development-build, and release-target context injection. |
| `mobile-permission-policy-hook` | Create new child page under `Hooks`. | PermissionRequest is needed for safe read/check auto-allow and high-risk deny/defer behavior at the approval boundary. |
| `codex-cli-native-runtime-paths` (`1374355481`) | Small update only if hook config layout changes. | Owns paths, not policy. Keep it narrow. |
| `Role-specific Codex Runtime` (`1374289964`) | Small summary update after hook page updates. | Owns runtime boundary and should point to updated Hook index without duplicating details. |
| `Mobile Codex CLI 실무 지침서` (`1374519410`) | Small guidance update after policy pages. | Owns practitioner workflow; should reference updated hook/reviewer/evidence flow. |
| `01-9. 검증 근거·감사 기록` (`1373667446`) | Append evidence addendum after publication. | This is the audit repository. Do not modify frozen input or original audit body. |
| `00-4. 가설·결정 레지스트리` (`1373798401`) | Update only if reviewer decides a DEC clarification is required. | Potential clarification: Stop continuation is local evidence collection, not a Stop-hook hard gate rejected by DEC-016. |
| `01-8. 템플릿 repo 설계안` (`1371963427`) | No direct hook-policy update by default. | It owns template repo shape and runtime constraints; hook policy belongs under Role-specific Codex Runtime/Hooks. |

## Stage 1: SoT Inventory And Drift Lock

Goal:

Freeze the page list, versions, official docs, and drift findings before drafting page updates.

Tasks:

- [x] Fetch `mobile-app-dev-team` homepage and descendants.
- [x] Fetch internal SoT pages listed in this plan.
- [x] Search Confluence for existing hook pages and `UserPromptSubmit`/`PermissionRequest`.
- [x] Recheck official OpenAI, Expo, and React Native documentation links.
- [x] Save a concise SoT inventory artifact under `.evidence/codex-runtime-stability/source-basis-sot-inventory.md`.
- [x] Run Codex headless review for this plan and save `.evidence/codex-runtime-stability/source-basis-update-plan-review.md`.

Review command:

```bash
/opt/homebrew/bin/codex exec --sandbox read-only -c model_reasoning_effort=\"xhigh\" \
  --output-last-message .evidence/codex-runtime-stability/source-basis-update-plan-review.md \
  "Review docs/plans/active/20260608-codex-hook-source-basis-confluence-update-plan.md against the fetched internal Confluence SoT and official Source Basis links. Check page ownership, advisory-vs-hard-gate wording, missing update targets, and whether the plan includes headless review evidence before live Confluence publication."
```

Quality gate:

```bash
pnpm run test:runtime
```

## Stage 2: Draft Confluence Update Content

Goal:

Prepare page-specific draft sections without publishing.

Tasks:

- [x] Draft `Hooks` update:
  - six-event hook matrix.
  - official Source Basis table.
  - guardrail vs deterministic gatekeeper boundary.
  - links to child hook pages.
- [x] Draft `hook-evaluation-and-ci-gate` update:
  - exact JSON output assertions for `PreToolUse`, `PermissionRequest`, event `additionalContext`, and `Stop` continuation.
  - `codex exec` xhigh review evidence requirement.
  - fixture categories for EAS/native/private-file/package-manager risks.
- [x] Draft `mobile-pretool-policy-hook` update:
  - production EAS deny/defer.
  - prebuild clean/native reset deny.
  - private file read denial.
  - package-manager mixing denial.
  - Expo export/public value context.
  - statement that `PreToolUse` is not a complete enforcement boundary.
- [x] Draft `mobile-posttool-evidence-reminder-hook` update:
  - lint/typecheck/Jest/expo doctor result summarization.
  - config/native/contracts/UI/test/evidence path classification.
  - Bash side-effect limitation.
- [x] Draft `mobile-stop-gatekeeper-advisory-hook` update:
  - local continuation for missing evidence.
  - no replacement of `mobile-gatekeeper`/GitHub required checks.
  - stop-hook active/infinite-loop guard.
- [x] Draft new child pages:
  - `mobile-session-start-context-hook`.
  - `mobile-user-prompt-policy-hook`.
  - `mobile-permission-policy-hook`.
- [x] Draft small pointer updates for `Role-specific Codex Runtime`, `codex-cli-native-runtime-paths`, and `Mobile Codex CLI 실무 지침서`.
- [x] Draft `01-9` evidence addendum template for post-publication audit.

Quality gate:

```bash
/opt/homebrew/bin/codex exec --sandbox read-only -c model_reasoning_effort=\"xhigh\" \
  --output-last-message .evidence/codex-runtime-stability/source-basis-draft-review.md \
  "Review the drafted Confluence Source Basis updates before publication. Check for duplicated SoT, wrong page ownership, missing official sources, and conflicts with DEC-016 or mobile-gatekeeper hard-gate ownership."
```

## Stage 3: Live Confluence Update

Goal:

Publish approved updates to the correct Confluence pages with minimal edits.

Tasks:

- [x] Re-fetch every target page immediately before update and compare page version to Stage 1.
- [x] If any page changed, pause that page and rebase the draft manually.
- [x] Update existing pages in this order:
  1. `Hooks`.
  2. `hook-evaluation-and-ci-gate`.
  3. `mobile-pretool-policy-hook`.
  4. `mobile-posttool-evidence-reminder-hook`.
  5. `mobile-stop-gatekeeper-advisory-hook`.
  6. small pointer pages.
- [x] Create or rename/supersede child pages for `SessionStart`, `UserPromptSubmit`, and `PermissionRequest`.
- [x] Add `01-9` evidence addendum only after all policy pages are published.
- [x] Update `00-4` only if reviewer explicitly requires DEC clarification.

Published page version inventory:

| Page | Page ID | Version After Update |
| --- | --- | ---: |
| `Hooks` | `1374060648` | 2 |
| `hook-evaluation-and-ci-gate` | `1374355561` | 2 |
| `mobile-pretool-policy-hook` | `1374290046` | 2 |
| `mobile-posttool-evidence-reminder-hook` | `1374388296` | 2 |
| `mobile-stop-gatekeeper-advisory-hook` | `1374355521` | 2 |
| `Role-specific Codex Runtime` | `1374289964` | 2 |
| `codex-cli-native-runtime-paths` | `1374355481` | 2 |
| `Mobile Codex CLI 실무 지침서` | `1374519410` | 2 |
| `mobile-session-start-context-hook` | `1376845825` | 1 |
| `mobile-user-prompt-policy-hook` | `1376878593` | 1 |
| `mobile-permission-policy-hook` | `1376911361` | 1 |

`00-4` was not updated because the published Stop wording preserved the existing decision boundary: Stop continuation is local evidence collection only, not a hard gate.

`01-9` parent page `1373667446` was not overwritten. Evidence was recorded as child page `2026-06-08 Codex Hook Source Basis Update Evidence` (`1376813059`), version 1.

Quality gate:

```bash
/opt/homebrew/bin/codex exec --sandbox read-only -c model_reasoning_effort=\"xhigh\" \
  --output-last-message .evidence/codex-runtime-stability/source-basis-published-review.md \
  "Review the published Confluence hook Source Basis update. Verify page versions, links, Source Basis coverage, internal SoT boundaries, and that Stop continuation is not documented as a hard gate."
```

Rollback:

- Use Confluence page history to restore the previous version for any page with incorrect ownership or unsupported policy.
- Do not rewrite `01-9` frozen audit sections; revert only the new addendum if needed.

## Stage 4: Repo Documentation Sync

Goal:

Keep local docs aligned with published Confluence SoT.

Tasks:

- [x] Update `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` with the final Confluence page links and versions.
- [x] Add/update local evidence references under `.evidence/codex-runtime-stability/`.
- [x] Update runtime plan docs only if the hook implementation roadmap changes.
- [x] Do not hardcode current Expo/RN/NativeWind versions into hook policy; detect them from repo files.

Quality gate:

```bash
pnpm run test:runtime
pnpm turbo run lint test
```

Build note:

- The root `package.json` currently has no `build` script. If a build script is added by another session before this stage, run it and capture output; otherwise record `no root build script`.

## Final Definition Of Done

- [x] All intended Confluence target pages are listed with page ID, version, and update action.
- [x] Official Source Basis links are present only on pages that own hook policy or validation evidence.
- [x] Internal SoT boundaries are preserved:
  - `Hooks` owns hook policy.
  - `hook-evaluation-and-ci-gate` owns fixtures/schema/review gates.
  - `01-9` owns audit evidence.
  - `01-8` remains template repo SoT, not hook-policy SoT.
  - `mobile-gatekeeper`/GitHub required checks remain hard pass/fail owners.
- [x] Codex headless review evidence exists for plan and published updates as stages are completed.
- [x] `pnpm run test:runtime` passes after local documentation changes.
- [x] `pnpm turbo run lint test` passes before final publication closeout.

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Confluence page changes between fetch and update | High | Re-fetch page version immediately before update and rebase manually. |
| Stop continuation conflicts with DEC-016 | High | Use wording that preserves DEC-016: local continuation for missing evidence is not a hard pass/fail gate. Ask reviewer whether DEC clarification is required. |
| Source Basis duplication across pages | Medium | Keep detailed official links on `Hooks`/`hook-evaluation-and-ci-gate`; pointer pages link back instead of copying. |
| Hook policy treated as a security boundary | High | Repeat that hooks are guardrails and must be paired with sandbox, approval policy, CI, EAS permissions, and branch protection. |
| Other session changes active runtime docs | Medium | Do not overwrite existing active plan/environment SoT files; create separate source-basis update plan and re-read before editing. |
