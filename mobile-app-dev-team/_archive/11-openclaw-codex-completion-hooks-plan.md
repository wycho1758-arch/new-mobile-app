# OpenClaw Codex Completion Hooks 상세 계획

상태: 계획 및 xhigh reviewer 검토 대상
작성일: 2026-06-10
대상 경로: `mobile-app-dev-team/`

## 목적

`boram-*` OpenClaw agent가 nested Codex 작업 완료 메시지를 받을 수 있도록, boram pod에서 검증된 Codex completion hook v2 운영 지식을 현재 repo에 durable하게 남긴다.

이 계획은 최종 runbook 자체가 아니라, 아래 proposed future runbook/current SoT를 작성하고 README/source-map에 링크하기 위한 상세 실행 계획이다.

```text
mobile-app-dev-team/11-openclaw-codex-completion-hooks.md
```

## 핵심 판단

| 판단 | 결정 |
| --- | --- |
| 문서 위치 | `mobile-app-dev-team/11-openclaw-codex-completion-hooks.md`를 작성한 뒤 README/source-map에 링크해 새 current SoT/runbook으로 승격한다. |
| 계획서 위치 | 이 파일 `mobile-app-dev-team/11-openclaw-codex-completion-hooks-plan.md`에 실행 계획을 둔다. |
| OpenClaw skill 여부 | `/workspace/codex-hooks`는 `/workspace/skills/<slug>/SKILL.md` 형태의 skill이 아니므로 `09-pod-native-openclaw-skills/`에 넣지 않는다. |
| repo-local Codex artifact 여부 | `.agents/skills`, `.codex/agents`, `.codex/hooks`에 넣지 않는다. 해당 경로는 repo-local Codex runtime artifact용이다. |
| durable handoff | 다른 pod/agent가 소비해야 하는 task-specific 정보는 `docs/plans/work-units/<work-unit-id>/` artifact에서 runbook을 링크한다. |
| 검증 표현 | Boram pod는 실제 delivery를 검증했다. local repo/source validation만으로는 다른 agent의 실제 delivery를 보장하지 않는다. |

## SoT 근거

| 근거 | 이번 계획에서 사용하는 사실 |
| --- | --- |
| `AGENTS.md` | repo-local Codex skill/agent/hook 경로와 OpenClaw pod-native `/workspace/skills/<slug>/SKILL.md` 경로는 분리된다. local harness는 외부 platform/runtime behavior와 OpenClaw packaging을 증명하지 않는다. |
| `PROJECT_ENVIRONMENT.md` | `$wm` 작업은 SoT-grounded planning, reviewer evidence, runtime gate 영향을 기록해야 한다. |
| `mobile-app-dev-team/README.md` | `mobile-app-dev-team/`는 운영자가 읽고 유지할 current SoT 영역이다. |
| `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md` | 이 폴더는 `/workspace/skills/<slug>/SKILL.md` shape의 source-only pod-native OpenClaw skill 문서 영역이다. |
| `mobile-app-dev-team/10-github-artifact-workflow.md` | pod-isolated role agent handoff는 GitHub branch/commit/PR과 `docs/plans/work-units/<work-unit-id>/`를 사용한다. local repo validation은 실제 OrbStack/OpenClaw pod execution을 증명하지 않는다. |
| `mobile-app-dev-team/99-source-map.md` | active/historical/current source crosswalk를 유지해야 한다. |
| boram pod 관찰 | `clawpod/boram-vf7sbm-agent-0`, `agent` container, `/workspace/codex-hooks/*`, `/workspace/state/codex-completion-events-e2e/*`가 실제 관찰 source다. |

## Boram 검증 사실

### 관찰 위치

```text
namespace: clawpod
pod: boram-vf7sbm-agent-0
container: agent
workspace: /workspace
source: /workspace/codex-hooks/*
```

`ontology-bridge` container는 active hook source 근거로 사용하지 않는다.

### reusable source 목록

```text
/workspace/codex-hooks/codex-run
/workspace/codex-hooks/codex-completion-hook.js
/workspace/codex-hooks/lib/redact.js
/workspace/codex-hooks/lib/dedupe.js
/workspace/codex-hooks/lib/event-adapter.js
/workspace/codex-hooks/config.example.json
/workspace/codex-hooks/test-smoke.sh
/workspace/codex-hooks/README.md
/workspace/codex-hooks/AGENT-INTEGRATION-GUIDE.md
```

### actual delivery evidence

대표 evidence:

```text
/workspace/state/codex-completion-events-e2e/evidence/codex-20260610T043327Z-153122-11643.json
```

확인된 event record:

```text
schema_version: v2
request_id: manual-e2e-20260610T043327Z
task_title: Harmless nested Codex marker E2E
driver: openclawSystemEvent
adapter.ok: true
adapter.invoked: true
adapter.exitCode: 0
outcome: success
safe_to_notify_requester: true
duplicate: false
```

정확한 제한 문구:

```text
Boram pod에서는 실제 openclawSystemEvent delivery가 검증됐다.
다른 target agents는 각 agent pod/runtime에서 별도 E2E를 실행해 delivery evidence를 기록해야 한다.
local repo/source validation만으로는 실제 OpenClaw system event delivery를 보장하거나 증명하지 않는다.
```

## 작성 범위

### 1. 새 runbook 문서

아래 문서를 추가한다.

```text
mobile-app-dev-team/11-openclaw-codex-completion-hooks.md
```

필수 섹션:

1. 목적과 적용 범위
2. runtime shape 구분
3. Boram pod 검증 사실
4. v2 architecture
5. reusable source copy list
6. per-agent 설정값
7. per-task invocation contract
8. state/evidence layout
9. v1/v2 compatibility and rollback
10. dryRun smoke와 real `openclawSystemEvent` E2E 절차
11. security model
12. durable handoff 방법
13. local/source validation 한계
14. 운영 고도화 backlog

### 2. index 문서 업데이트

| 파일 | 변경 방향 |
| --- | --- |
| `mobile-app-dev-team/README.md` | 문서 구조에 `11-openclaw-codex-completion-hooks.md`와 이 계획서를 추가한다. |
| `mobile-app-dev-team/99-source-map.md` | `09-pod-native-openclaw-skills/`, `11-openclaw-codex-completion-hooks.md`, boram pod evidence source를 current source map에 추가한다. |
| `mobile-app-dev-team/04-skills-and-agents-matrix.md` | `/workspace/codex-hooks`가 OpenClaw skill이 아니라 hook source bundle이라는 경계를 짧게 명시한다. |
| `mobile-app-dev-team/06-gates-and-evidence.md` | 다른 agent 적용 시 per-agent E2E evidence가 필요하다는 규칙을 추가한다. |
| `mobile-app-dev-team/07-new-team-template-guide.md` | 새 team/agent bootstrap 시 hook source copy와 per-agent state dir 분리 절차를 링크한다. |
| `PROJECT_ENVIRONMENT.md` | `## Codex Runtime`에 OpenClaw Codex completion hook runbook 경로, `/workspace/codex-hooks` runtime shape, Boram-only delivery evidence, other-agent per-pod E2E requirement, local/source validation 한계를 추가한다. |
| `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` | `PROJECT_ENVIRONMENT.md` 동기화가 필요한지 검토하고, runtime SoT mirror로 유지되는 범위라면 동일한 요약을 반영한다. |

### 3. validator 업데이트

`scripts/validate-team-doc.mjs`를 먼저 보강한다.

검증 항목:

- `mobile-app-dev-team/11-openclaw-codex-completion-hooks.md` 존재
- `README.md`가 새 runbook을 링크
- `99-source-map.md`가 새 runbook과 `/workspace/codex-hooks`를 source로 기록
- `PROJECT_ENVIRONMENT.md`가 새 runbook 경로와 `/workspace/codex-hooks` runtime shape를 기록
- `PROJECT_ENVIRONMENT.md`가 Boram pod delivery 검증은 Boram 환경에 한정되고, 다른 agents는 per-agent pod/runtime E2E가 필요하며, local/source validation만으로 delivery를 보장하지 않는다고 기록
- runbook에 `/workspace/codex-hooks/codex-run`과 `/workspace/codex-hooks/codex-completion-hook.js` 명시
- runbook에 `CODEX_HOOK_STATE_DIR`, `CODEX_HOOK_DRIVER`, `CODEX_HOOK_SCHEMA_VERSION` 명시
- runbook에 `request_id`, `task_title`, `origin`, `flow_id`, `flow_step_id`, `room_id`, `risk_level`, `requires_review` 명시
- runbook에 `openclawSystemEvent`, `dryRun`, `v1`, `v2` 명시
- runbook에 `runs/`, `evidence/`, `indexes/by-request`, `indexes/latest`, `events.jsonl`, `dedupe.jsonl` 명시
- runbook에 `adapter.ok`, `adapter.invoked`, `safe_to_notify_requester`, `duplicate` 명시
- runbook에 정확한 제한 문구 포함: Boram pod 검증 완료, 다른 agents per-agent E2E 필요, local/source repo 단독 delivery 보장 불가
- runbook이 secret/auth file/env dump 출력 금지를 포함
- runbook이 `/workspace/codex-hooks`를 `/workspace/skills/<slug>/SKILL.md`로 잘못 분류하지 않음

## 최종 runbook 내용 설계

### Architecture

```text
codex-run wrapper
  -> parses hook identity flags before "--"
  -> runs nested codex with CODEX_HOOK_DISABLE=1
  -> captures redacted stdout/stderr and metadata
  -> invokes codex-completion-hook.js
     -> merges CLI/env/config/default values
     -> builds v1 or v2 completion message
     -> computes outcome/runbook guidance
     -> dedupes
     -> writes events, evidence, and v2 indexes
     -> sends through dryRun or openclawSystemEvent
```

### Per-agent values

```text
CODEX_HOOK_STATE_DIR=/target/workspace/state/codex-completion-events
CODEX_HOOK_DRIVER=dryRun|openclawSystemEvent
CODEX_HOOK_SCHEMA_VERSION=v1|v2
CODEX_HOOK_REQUESTER=<agent-or-user-id>
CODEX_HOOK_REQUESTER_NAME=<display-name>
```

다른 agent의 state directory는 복사하지 않는다.

### Per-task metadata

```text
--request-id <request id>
--task-title <human readable title>
--origin <room|direct|scheduler|workflow|manual>
--flow-id <workflow id>
--flow-step-id <workflow step id>
--room-id <room id>
--risk-level <low|medium|high>
--requires-review
```

이 값들은 `docs/plans/work-units/<work-unit-id>/` 표준 schema 자체의 필수 필드는 아니지만, 해당 work-unit의 관련 evidence record 또는 QA/Release artifact에 포함해야 한다.

### State/evidence layout

```text
state/codex-completion-events/
  runs/<run_id>/stdout.txt
  runs/<run_id>/stderr.txt
  runs/<run_id>/metadata.json
  runs/<run_id>/hook.stderr
  evidence/<run_id>.json
  indexes/by-request/<request_id>.json
  indexes/latest.json
  events.jsonl
  dedupe.jsonl
```

### Security

- auth 파일, token, credential file, identity key, env dump를 읽거나 출력하지 않는다.
- 원문 prompt/command는 저장하지 않고 `command_hash`만 저장한다.
- stdout/stderr는 durable write 전에 redaction한다.
- captured Codex output excerpt는 `untrusted`로 표시한다.
- nested Codex 실행에는 `CODEX_HOOK_DISABLE=1`을 넣어 recursive hook을 방지한다.
- state dir은 agent별 private directory로 운용한다.

## Durable handoff 기준

다른 `boram-*` 또는 role pod가 적용할 작업은 `docs/plans/work-units/<work-unit-id>/` 아래에 남긴다.

권장 artifact:

```text
docs/plans/work-units/<work-unit-id>/
  README.md
  00-product-planning/
    task-packet.md
    evidence-matrix.md
  05-qa-release/
    e2e-plan.md
    failure-classification.md
    release-risk-summary.md
  07-pr/
    pr-index.md
```

각 artifact는 `10-github-artifact-workflow.md`의 표준 필드를 포함해야 한다.

hook-specific metadata는 표준 필드와 별도로 evidence section에 기록한다.

```text
request_id
flow_id
flow_step_id
room_id
risk_level
requires_review
state_dir
driver
schema_version
evidence/<run_id>.json
indexes/by-request/<request_id>.json
```

## Guardrails

- `.agents/skills`에 새 skill을 만들지 않는다.
- `.codex/agents`, `.codex/config.toml`, `.codex/hooks`에 boram hook source를 넣지 않는다.
- `09-pod-native-openclaw-skills/`에는 `/workspace/skills/<slug>/SKILL.md` shape의 skill source만 둔다.
- `infra/clawpod/codex-hooks/` 같은 installable hook source 위치는 이번 계획의 후속 결정으로 남긴다. 문서 runbook이 runtime source distribution을 가장하면 안 된다.
- OpenClaw 외부 platform/runtime repository를 수정하지 않는다.
- `ontology-bridge` container를 active hook source 근거로 쓰지 않는다.
- Boram 검증을 다른 agent, EKS, production parity 검증으로 확대 해석하지 않는다.
- secret, token, API key, OAuth/refresh token, password, full auth config contents를 문서나 evidence에 쓰지 않는다.

## TDD 및 검증 계획

1. `scripts/validate-team-doc.mjs`에 새 runbook 검증을 먼저 추가한다.
2. validator가 실패하는 것을 확인한다.
3. `mobile-app-dev-team/11-openclaw-codex-completion-hooks.md`를 작성한다.
4. `README.md`, `99-source-map.md`, 관련 team-doc index를 업데이트한다.
5. `pnpm run validate:team-doc`를 실행한다.
6. runtime 문서/validator 변경 영향 확인을 위해 `pnpm run test:runtime`를 실행한다.
7. `docs/plans/**` 또는 runtime/harness 영향이 있으면 `pnpm run test:local-harness`를 실행한다.
8. 실제 OpenClaw delivery는 local repo gate로 증명하지 않는다. target agent별 pod E2E evidence가 별도 필요하다고 기록한다.

## Reviewer 검증 계획

계획서 reviewer:

```text
.evidence/reviews/openclaw-codex-completion-hooks-plan-xhigh-20260610.md
```

최종 구현 reviewer:

```text
.evidence/reviews/openclaw-codex-completion-hooks-final-xhigh-20260610.md
```

검토 기준:

- `11-openclaw-codex-completion-hooks.md`를 아직 존재하지 않는 current SoT로 과장하지 않는지
- proposed runbook 위치가 `09-pod-native-openclaw-skills/`, `.agents`, `.codex`보다 적절한지
- Boram pod 검증 범위를 Boram 환경으로만 제한하는지
- local/source repo 단독 delivery 보장 불가 문구가 들어가는지
- 다른 agents의 per-agent E2E requirement가 명확한지
- validator-first 순서를 지키는지
- secret-safe guardrail이 충분한지
- durable handoff가 `docs/plans/work-units/<work-unit-id>/` 표준 schema와 충돌하지 않는지

## 실행 순서

1. 이 상세 계획서를 xhigh reviewer로 검토한다.
2. blocker가 있으면 계획서를 수정하고 재검토한다.
3. 승인 후 validator를 먼저 업데이트한다.
4. 새 runbook, index 문서, `PROJECT_ENVIRONMENT.md` runtime 요약을 작성한다.
5. 검증 명령을 실행한다.
6. final xhigh reviewer가 diff, command output, evidence를 검토한다.
7. 최종 보고에는 변경 파일, 검증 결과, reviewer 결과, remaining risk를 포함한다.

## 완료 기준

- `mobile-app-dev-team/11-openclaw-codex-completion-hooks.md`가 작성되고 README/source-map에서 링크된다.
- `PROJECT_ENVIRONMENT.md`의 `## Codex Runtime`에 새 runbook 경로, Boram-only delivery evidence, other-agent per-pod E2E requirement, local/source validation 한계가 반영된다.
- `scripts/validate-team-doc.mjs`가 새 runbook의 핵심 경계와 검증 문구를 강제한다.
- `pnpm run validate:team-doc` 통과.
- `pnpm run test:runtime` 통과.
- 필요한 경우 `pnpm run test:local-harness` 통과 또는 명확한 blocked reason 기록.
- xhigh reviewer가 Critical/High blocker 없음으로 확인.
- final report가 Boram 검증 완료와 other-agent per-pod E2E 필요를 분리해 설명한다.
