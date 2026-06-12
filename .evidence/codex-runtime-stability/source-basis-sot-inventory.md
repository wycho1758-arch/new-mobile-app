# Source Basis SoT Inventory

Date: 2026-06-08
Scope: Codex hook Source Basis Confluence update plan.

## Internal Confluence Inputs

Homepage:

- `mobile-app-dev-team`, page `1373012374`, version 3.

Primary update targets:

- `Hooks`, page `1374060648`, version 1.
- `hook-evaluation-and-ci-gate`, page `1374355561`, version 1.
- `mobile-pretool-policy-hook`, page `1374290046`, version 1.
- `mobile-posttool-evidence-reminder-hook`, page `1374388296`, version 1.
- `mobile-stop-gatekeeper-advisory-hook`, page `1374355521`, version 1.

New or rename/supersede candidates:

- `mobile-session-start-context-hook`.
- `mobile-user-prompt-policy-hook`.
- `mobile-permission-policy-hook`.
- Existing `mobile-subagent-context-hook`, page `1374060708`, version 1, is not equivalent to SessionStart.

Boundary pages:

- `00-3. 산출물 표준`, page `1373765641`, version 2.
- `00-4. 가설·결정 레지스트리`, page `1373798401`, version 3.
- `01-6. 개발 지침`, page `1373634583`, version 1.
- `01-8. 템플릿 repo 설계안`, page `1371963427`, version 18.
- `01-9. 검증 근거·감사 기록`, page `1373667446`, version 5.
- `Role-specific Codex Runtime`, page `1374289964`, version 1.
- `codex-cli-native-runtime-paths`, page `1374355481`, version 1.
- `Mobile Codex CLI 실무 지침서`, page `1374519410`, version 1.
- `Mobile Local Harness 운영 가이드`, page `1374290184`, version 1.

## Official Source Inputs

- OpenAI Codex hooks: https://developers.openai.com/codex/hooks
- OpenAI Codex approvals and security: https://developers.openai.com/codex/agent-approvals-security
- OpenAI Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- Expo TypeScript: https://docs.expo.dev/guides/typescript/
- Expo CLI: https://docs.expo.dev/more/expo-cli/
- Expo CNG/prebuild: https://docs.expo.dev/workflow/continuous-native-generation/
- Expo client-side variables: https://docs.expo.dev/guides/environment-variables/
- EAS variable scopes: https://docs.expo.dev/eas/environment-variables/
- Expo development builds: https://docs.expo.dev/develop/development-builds/introduction/
- React Native testing overview: https://reactnative.dev/docs/testing-overview

## Drift Summary

- Existing Confluence hook tree covers four pages, while the target policy needs six hook events.
- `UserPromptSubmit` and `PermissionRequest` have no current hook pages.
- The existing subagent page does not cover the repo's SessionStart context behavior.
- Stop continuation must be documented as local evidence collection, not as a deterministic hard gate.
- Detailed hook Source Basis should live under `Hooks` and `hook-evaluation-and-ci-gate`; `01-9` should only receive audit evidence after publication.
