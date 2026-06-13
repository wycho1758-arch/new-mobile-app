# QA/Release Codex 사용 Skill 분석

Role: QA/Release
SOUL: `mobile-app-dev-team/02-role-souls/qa-release-soul.md`

## 역할 기준

QA/Release는 QA evidence와 release evidence를 계획하고 실행하고 기록합니다. RN Web, native simulator/device, EAS, Railway, mobile-mcp, manual human-gate evidence를 구분합니다.

QA/Release는 app/backend/API/design fix를 구현하지 않고, failed gate를 pass로 바꾸지 않으며, production이나 failed-gate-risk를 대신 승인하지 않습니다.

## 현재 상태

사용 가능한 repo-local Codex skill:

- `e2e-test`
- `qa-railway-workflow`
- `wm-orchestrate`
- `git-workflow`

사용 가능한 custom agent:

- `wm-gate-fix-advisor`
- `wm-docs-researcher`
- legacy `mobile-gate-fix-advisor`, `mobile-docs-researcher`는 현재 SoT가 허용하는 경우만 사용

pod-native setup skill:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`
- `eas-robot-auth-setup`

주요 durable artifact:

- `docs/plans/work-units/<work-unit-id>/05-qa-release/e2e-plan.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/reset-record.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/rn-web-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/native-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/mobile-mcp-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/railway-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/eas-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/failure-classification.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/release-risk-summary.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/human-approval.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/human-approval.json`

canonical evidence:

- `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`
- mobile-mcp evidence
- EAS evidence ingest
- Railway evidence
- human-gate decision files

판정: **부분 충족**입니다. E2E와 Railway skill은 있지만, release readiness synthesis가 여러 표면에 흩어져 있습니다.

## Role-specific Codex 운영 보강

QA/Release pod에서 Codex는 어떤 evidence surface를 검증하는지 먼저 계획해야 합니다.

1. SoT를 read-only로 확인합니다. Product/Planning acceptance criteria, Design handoff, app/API implementation evidence, release candidate, QA SOUL을 읽습니다.
2. 계획 단계에서는 테스트, 배포, release operation을 실행하지 않습니다.
3. evidence level을 L0/L1/L2/L3/Railway/EAS/manual human gate로 분류합니다.
4. 계획에는 reset 절차, 실행 명령, 필요한 credential readiness check, evidence output path, failure classification owner, reviewer output path를 포함합니다.
5. EAS, Railway, mobile-mcp, Maestro, Stitch 등 외부 tool을 쓰는 경우 공식 문서 또는 repo-approved workflow 기준을 확인하고, 실제 command/prompt/runbook을 계획에 포함합니다.
6. 계획은 QA/release reviewer가 추가되기 전까지 `wm-gate-fix-advisor`, `wm-docs-researcher`, 필요한 owner reviewer를 조합해 검토하고 사용자에게 보고합니다.
7. 계획 승인 후에만 test/deploy/evidence capture를 실행합니다.
8. 작업 완료 후 최종 reviewer가 evidence completeness, failed gate routing, human approval status, release risk summary를 확인합니다.
9. `git diff`와 `git status --short`로 `05-qa-release/*`와 canonical evidence link가 승인된 방향과 일치하는지 확인하고 보고합니다.

외부 tool runbook은 최소한 아래 구조를 가져야 합니다.

```text
Tool:
Official/reference source:
Credential/readiness check:
Command or prompt to run:
Expected evidence:
Failure classification owner:
Human gate condition:
What this evidence proves:
What this evidence does not prove:
```

## 필요한 Codex CLI 프로세스

1. pod readiness를 확인합니다.
2. role이 QA/Release인지 확인합니다.
3. 승인된 flow 또는 release candidate인지 확인합니다.
4. 필요한 evidence level을 확인합니다.
5. target surface를 분류합니다.
   - L0 Jest/unit/component/contract
   - L1 RN Web/Playwright
   - L2 EAS/Maestro native
   - L3 human-device/mobile-mcp
   - Railway/deployed API
   - manual human gate
6. EAS/Maestro가 필요하면 `eas-robot-auth-setup` status를 확인합니다.
7. 실행 표면에 따라 `e2e-test` 또는 `qa-railway-workflow`를 사용합니다.
8. test plan, reset, command output, screenshots/logs, summary를 기록합니다.
9. `05-qa-release/*`는 canonical evidence를 link하는 summary/index로 씁니다.
10. 실패를 owner별로 분류합니다.
11. production submit이나 failed-gate-risk는 human gate 없이는 진행하지 않습니다.

## 현재 문제점

Missing process:

- fresh QA/Release pod가 evidence surface를 분류하고 적절한 skill을 선택하는 bridge가 없습니다.

Missing pod-native bridge skill:

- 필요합니다. `codex-role-workflow`가 QA/Release identity, evidence surface, `e2e-test`, `qa-railway-workflow`, `eas-robot-auth-setup`, `05-qa-release/*`를 연결해야 합니다.

Missing repo-local Codex skill:

- `qa-release-readiness-workflow`가 필요할 수 있습니다.
- `e2e-test`와 `qa-railway-workflow`는 실행 표면에는 강하지만, final release readiness synthesis 전체를 소유하지는 않습니다.

Missing custom reviewer/researcher/advisor:

- `qa-release-readiness-reviewer`가 필요할 수 있습니다.
- `wm-gate-fix-advisor`는 failure triage에 가깝고 final readiness review는 별도 rubric이 필요할 수 있습니다.

Ambiguous handoff path:

- `05-qa-release/*`가 canonical evidence를 link해야 하지만, 여러 evidence surface를 하나의 readiness로 종합하는 workflow가 없습니다.

Overlap or role-boundary risk:

- QA/Release가 fix를 구현하거나 failed gate를 pass로 바꾸면 안 됩니다.

External proof or human-gate risk:

- RN Web, Railway, EAS, Maestro, mobile-mcp는 서로 다른 것을 증명합니다. production submit과 failed-gate-risk는 human gate입니다.

Validator/eval gap:

- RN Web/native/EAS/Railway 분류 eval이 필요합니다.
- QA가 fix 구현 요청을 거부하는 eval이 필요합니다.
- failed-gate-risk human gate 요구 eval이 필요합니다.

## 추가/보강 권고

필수 추가:

- `codex-role-workflow`

검토 필요:

- `.agents/skills/qa-release-readiness-workflow/SKILL.md`
- `.codex/agents/qa-release-readiness-reviewer.toml`

이 선택지는 release readiness를 자주 종합해야 하면 필요합니다. 단순 surface별 QA만 한다면 기존 `e2e-test`, `qa-railway-workflow` 보강으로도 충분할 수 있습니다.

## 완료 기준

- QA/Release pod가 target surface를 먼저 분류합니다.
- EAS/Maestro 전에는 `eas-robot-auth-setup` status를 확인합니다.
- 계획은 실행 전에 reviewer로 검토됩니다.
- command output과 exit status가 기록됩니다.
- `05-qa-release/*`가 canonical evidence를 link합니다.
- 실패는 owner별로 route됩니다.
- 최종 reviewer가 evidence completeness와 release risk를 확인합니다.
- `git diff`와 `git status --short` 확인 결과가 보고됩니다.
- production submit과 failed-gate-risk는 human gate 없이는 진행하지 않습니다.
