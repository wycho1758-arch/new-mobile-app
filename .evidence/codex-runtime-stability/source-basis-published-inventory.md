# Published Confluence Hook Source Basis Inventory

Date: 2026-06-08
Scope: Expo/React Native Codex hook Source Basis Confluence update.

## Publication Rule

Existing Confluence pages were updated in append-only style: original page text was kept at the top and a `2026-06-08` addendum was appended. The frozen audit parent page `01-9. 검증 근거·감사 기록` was not overwritten.

## Published Pages

| Page | Page ID | Version After Update | Action |
| --- | --- | ---: | --- |
| `Hooks` | `1374060648` | 2 | Added six-event hook matrix, official Source Basis, and internal policy overlay boundary. |
| `hook-evaluation-and-ci-gate` | `1374355561` | 2 | Added exact fixture/output assertion requirements and xhigh headless review evidence requirement. |
| `mobile-pretool-policy-hook` | `1374290046` | 2 | Added Expo/RN command risk policy for EAS production, clean native regeneration, private reads, package-manager mixing, and public client value context. |
| `mobile-posttool-evidence-reminder-hook` | `1374388296` | 2 | Added mobile result/path classification for lint, typecheck, Jest, expo doctor, config/native/contracts/evidence changes. |
| `mobile-stop-gatekeeper-advisory-hook` | `1374355521` | 2 | Added Stop continuation clarification while preserving advisory and non-hard-gate wording. |
| `Role-specific Codex Runtime` | `1374289964` | 2 | Added pointer to updated hook Source Basis without duplicating event policy. |
| `codex-cli-native-runtime-paths` | `1374355481` | 2 | Added pointer to hook event pages and evidence paths without changing path ownership. |
| `Mobile Codex CLI 실무 지침서 / Practitioner Guide` | `1374519410` | 2 | Added practitioner pointer to updated hook Source Basis and review evidence requirements. |
| `mobile-session-start-context-hook` | `1376845825` | 1 | New child page created before this inventory; covers `SessionStart`. |
| `mobile-user-prompt-policy-hook` | `1376878593` | 1 | New child page confirmed; covers `UserPromptSubmit`. |
| `mobile-permission-policy-hook` | `1376911361` | 1 | New child page created; covers `PermissionRequest`. |
| `2026-06-08 Codex Hook Source Basis Update Evidence` | `1376813059` | 1 | Child evidence page under `01-9`; parent audit page was not overwritten. |

## Hooks Child Coverage

`Hooks` (`1374060648`) now has child pages for:

- `SessionStart`: `mobile-session-start-context-hook` (`1376845825`)
- `UserPromptSubmit`: `mobile-user-prompt-policy-hook` (`1376878593`)
- `PreToolUse`: `mobile-pretool-policy-hook` (`1374290046`)
- `PermissionRequest`: `mobile-permission-policy-hook` (`1376911361`)
- `PostToolUse`: `mobile-posttool-evidence-reminder-hook` (`1374388296`)
- `Stop`: `mobile-stop-gatekeeper-advisory-hook` (`1374355521`)

`mobile-subagent-context-hook` (`1374060708`) remains a separate subagent-context page and is not treated as equivalent to `SessionStart`.

## Official Source Basis

- Codex hooks: https://developers.openai.com/codex/hooks
- Codex approvals and security: https://developers.openai.com/codex/agent-approvals-security
- Codex permissions: https://developers.openai.com/codex/permissions
- Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- Expo TypeScript: https://docs.expo.dev/guides/typescript/
- Expo CLI: https://docs.expo.dev/more/expo-cli/
- Expo CNG/prebuild: https://docs.expo.dev/workflow/continuous-native-generation/
- Expo environment variables: https://docs.expo.dev/guides/environment-variables/
- EAS environment variables: https://docs.expo.dev/eas/environment-variables/
- Expo development builds: https://docs.expo.dev/develop/development-builds/introduction/
- React Native testing overview: https://reactnative.dev/docs/testing-overview

## Internal Policy Overlay

- Production release approval, CI hard gates, and evidence-based Done rules are internal SoT policy, not official-document claims.
- `mobile-gatekeeper` and GitHub required checks remain hard pass/fail owners.
- Hooks are local advisory guardrails/context injection unless a reviewer-approved decision explicitly changes scope.
- Stop continuation is local evidence collection only and must not be documented as a hard release gate.

## Audit Evidence Page

The parent audit page `01-9. 검증 근거·감사 기록` (`1373667446`) remained at version 5 during the policy update. Follow-up evidence was recorded as child page `2026-06-08 Codex Hook Source Basis Update Evidence` (`1376813059`), version 1.

## Local Review Command

```bash
/opt/homebrew/bin/codex exec --sandbox read-only -c model_reasoning_effort="xhigh" \
  --output-last-message .evidence/codex-runtime-stability/source-basis-published-review.md \
  "Review .evidence/codex-runtime-stability/source-basis-published-inventory.md and docs/plans/active/20260608-codex-hook-source-basis-confluence-update-plan.md. Verify original-content preservation, six-event hook coverage, Source Basis coverage, internal policy overlay separation, and that Stop continuation is not documented as a hard gate."
```
