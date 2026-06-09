---
pageId: "1374060648"
sourceTitle: "Hooks"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374060648"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Codex CLI project-local advisory hooks를 정의한다. |
| 경로 | `new-mobile-app/.codex/hooks.json`, `new-mobile-app/.codex/hooks/` |

## 원칙

* hooks는 local advisory guardrail이다.
* hard pass/fail은 `mobile-gatekeeper` deterministic script와 GitHub required check가 담당한다.
* hook script는 작고 deterministic해야 하며 직접 테스트한다.
* hook은 `mobile-gatekeeper` predicate를 복제하지 않는다.
* project-local hooks는 Codex trust review 대상이다.

## 하위 hook

* `mobile-pretool-policy-hook`
* `mobile-posttool-evidence-reminder-hook`
* `mobile-stop-gatekeeper-advisory-hook`
* `mobile-subagent-context-hook`

---

# 2026-06-08 Expo/RN Hook Source Basis Update

This section preserves the original page text above and adds the current Source Basis for React Native/Expo Codex hook policy.

## Updated Scope

Hooks remain a local advisory guardrail and context-injection layer. They are not a complete security boundary and must not replace deterministic `mobile-gatekeeper`, GitHub required checks, branch protection, EAS permissions, or human release approval.

For the Expo React Native template runtime, the hook tree covers four Codex hook events:

| Event | Page | Primary Role |
| --- | --- | --- |
| `SessionStart` | `mobile-session-start-context-hook` (`1376845825`) | Inject repo context: Expo/RN stack, package manager, routing, scripts, native boundary, EAS/public value cautions. |
| `PreToolUse` | `mobile-pretool-policy-hook` (`1374290046`) | Block or warn before risky commands/edits: production EAS, clean native regeneration, private file/value reads, package-manager mixing. |
| `PostToolUse` | `mobile-posttool-evidence-reminder-hook` (`1374388296`) | Summarize failed checks and changed-surface evidence needs after a tool result. |
| `Stop` | `mobile-stop-gatekeeper-advisory-hook` (`1374355521`) | Ask for missing local evidence before final response while preserving external hard-gate ownership. |

`mobile-subagent-context-hook` remains a separate subagent-context page and must not be treated as equivalent to `SessionStart`.

## Source Basis

| Source | Link | Use In This Hook Policy |
| --- | --- | --- |
| Codex hooks | [https://developers.openai.com/codex/hooks](https://developers.openai.com/codex/hooks) | Hook event/matcher/handler model and event-specific outputs. |
| Codex agent approvals and security | [https://developers.openai.com/codex/agent-approvals-security](https://developers.openai.com/codex/agent-approvals-security) | Pair hooks with approvals/sandboxing instead of treating hooks as a security boundary. |
| Codex permissions | [https://developers.openai.com/codex/permissions](https://developers.openai.com/codex/permissions) | Codex approval/permission model background. (No dedicated `PermissionRequest` hook in MVP — see 2026-06-09 correction.) |
| Codex non-interactive mode | [https://developers.openai.com/codex/noninteractive](https://developers.openai.com/codex/noninteractive) | `codex exec --sandbox read-only --output-last-message` evidence for xhigh review. |
| Expo TypeScript | [https://docs.expo.dev/guides/typescript/](https://docs.expo.dev/guides/typescript/) | SessionStart context for `.tsx` when JSX is present and `.ts` otherwise. |
| Expo CLI | [https://docs.expo.dev/more/expo-cli/](https://docs.expo.dev/more/expo-cli/) | Prefer Expo-aware install commands for Expo-managed packages. |
| Expo CNG/prebuild | [https://docs.expo.dev/workflow/continuous-native-generation/](https://docs.expo.dev/workflow/continuous-native-generation/) | Native folders can be generated from config; clean regeneration is a high-risk boundary. |
| Expo environment variables | [https://docs.expo.dev/guides/environment-variables/](https://docs.expo.dev/guides/environment-variables/) | `EXPO_PUBLIC_` values are client-visible and must not contain private values. |
| EAS environment variables | [https://docs.expo.dev/eas/environment-variables/](https://docs.expo.dev/eas/environment-variables/) | Separate development, preview, and production EAS variable scopes. |
| Expo development builds | [https://docs.expo.dev/develop/development-builds/introduction/](https://docs.expo.dev/develop/development-builds/introduction/) | Native capabilities may require a development build rather than Expo Go. |
| React Native testing overview | [https://reactnative.dev/docs/testing-overview](https://reactnative.dev/docs/testing-overview) | Jest/JS tests are necessary but do not prove native runtime behavior. |

## Internal Policy Overlay

The official documents above justify hook mechanics and Expo/RN technical boundaries. These internal rules come from the mobile SoT and remain separate from official-document claims:

* production EAS build/update/submit requires explicit release intent and should not be auto-run by Codex hooks.
* hard pass/fail belongs to `mobile-gatekeeper` and GitHub required checks.
* hook scripts must stay small, deterministic, directly fixture-tested, and reviewed through Codex trust review.
* Stop continuation may request missing evidence collection, but it is not a release gate and must not be documented as replacing `mobile-gatekeeper`.

---

# 2026-06-09 Hook Set Correction

`UserPromptSubmit`(`mobile-user-prompt-policy-hook`)와 `PermissionRequest`(`mobile-permission-policy-hook`)를 **불필요로 판정해 설계에서 제거**했다. 따라서 hook 이벤트는 6개가 아니라 위 4개(`SessionStart`, `PreToolUse`, `PostToolUse`, `Stop`)다.

* `PermissionRequest` deny 경계는 이미 `PreToolUse`(`mobile-pretool-policy-hook`)가 결정론적으로 차단하므로 안전상 추가 이득이 없고, auto-allow는 DX 편의일 뿐이며 두 곳 deny 목록 드리프트 위험만 만든다.
* `UserPromptSubmit`의 advisory 컨텍스트는 각 skill / 역할 `SOUL.md`와 `PreToolUse`의 `EXPO_PUBLIC_` 경고가 이미 커버한다.
* 프로젝트(SoT)와 `scripts/validate-runtime-artifacts.mjs`도 위 4개 이벤트만 구현·강제한다.
