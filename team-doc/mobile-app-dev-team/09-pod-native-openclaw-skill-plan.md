# Pod-Native OpenClaw Skill 작성 계획

## 목적

`team-doc/mobile-app-dev-team/` 아래에 OpenClaw pod가 기본으로 읽는 `/workspace/skills/<slug>/SKILL.md` 형식의 skill 문서를 별도로 정리한다.

이번 작업은 `.agents/skills`, `.codex/agents`, `.codex/config.toml` 같은 Codex CLI repo-local 런타임을 만들거나 수정하지 않는다. 대상은 OpenClaw agent pod의 pod-native skill 문서화와, 그 경계를 `AGENTS.md` 최상단에 짧게 명시하는 것이다.

## SoT 근거

| 근거 | 이번 계획에서 사용하는 사실 |
| --- | --- |
| `AGENTS.md` | repo-local Codex CLI 경로와 `/workspace/skills`의 local harness 범위 밖 경계를 구분해야 한다. |
| `team-doc/mobile-app-dev-team/README.md` | 현재 운영 문서는 `.agents/.codex` 중심이며, OpenClaw skill deferred 문구를 실제 pod 기준으로 교체해야 한다. |
| `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md` | repo-local skill/agent 매트릭스와 pod-native OpenClaw skill 매트릭스를 분리해야 한다. |
| `team-doc/mobile-app-dev-team/99-source-map.md` | repo source와 pod 관찰 source를 분리해서 출처를 남겨야 한다. |
| `team-doc/00-source/.../role-specific-codex-runtime-1374289964.md` | Boram-like pod는 `.agents/skills`가 아니라 `/workspace/skills`를 사용한다. |
| `team-doc/00-source/.../runtime-path-decision-1374289985.md` | Codex native repo runtime과 OpenClaw generated-agent runtime은 별도 경로로 관리한다. |
| 사용자 제공 `codex-cli-auth-setup` 원문 | Codex CLI 설치/Auth/precheck/doctor/무승인 smoke는 SOUL이 아니라 pod-native OpenClaw skill로 둔다. |
| boram pod 관찰 사실 | in-scope runtime은 `agent` container이며 `/workspace/skills/codex-cli-auth-setup/SKILL.md`가 존재한다. `ontology-bridge`, `canary-pp`는 근거로 쓰지 않는다. |

## 작성 범위

### 1. 새 skill 문서 폴더

아래 폴더를 `team-doc/mobile-app-dev-team/` 안에 새로 만든다.

```text
team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/
  README.md
  codex-cli-auth-setup/
    SKILL.md
    scripts/
      codex-cli-precheck.sh
    references/
      report-template.md
```

이 폴더는 `/workspace/skills/`로 배포되거나 생성될 pod-native OpenClaw skill의 관리용 source이다. 실제 의미 경로는 다음과 같이 기록한다.

```text
/workspace/skills/codex-cli-auth-setup/SKILL.md
```

### 2. 이번에 생성할 skill

이번 작업에서 실제 작성 대상은 `codex-cli-auth-setup` 하나로 제한한다.

| Skill | Pod-native runtime path | 역할 |
| --- | --- | --- |
| `codex-cli-auth-setup` | `/workspace/skills/codex-cli-auth-setup/SKILL.md` | OpenClaw agent pod에서 Codex CLI 설치 상태, Auth 상태, doctor, precheck, 무승인 smoke 실행 가능 여부를 secret-safe 방식으로 확인한다. |

`cli-anything`, `desktop`, `tasks` 같은 관찰된 다른 pod skill은 이번 작업에서 새로 정의하지 않는다. 원문/운영 정책이 확정되지 않았기 때문이다.

### 3. `AGENTS.md` 최상단 추가 방향

`AGENTS.md`의 `# AGENTS.md` 바로 아래에 짧은 섹션을 추가한다.

추가할 핵심 의미는 다음 수준으로 제한한다.

- OpenClaw pod-native skill의 실제 runtime path는 `/workspace/skills/<slug>/SKILL.md`이다.
- 이 repo의 관리 문서 source는 `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`에 둔다.
- OpenClaw agent가 Codex CLI를 사용할 때 필요한 설치/Auth/precheck/runbook은 SOUL.md가 아니라 pod-native OpenClaw skill에서 다룬다.
- 이 경로는 `.agents/skills` 또는 `.codex/agents`와 다르며, 이번 작업에서는 `.agents`, `.codex` artifact를 만들지 않는다.

## 문서 업데이트 방향

| 파일 | 변경 방향 |
| --- | --- |
| `AGENTS.md` | 최상단에 OpenClaw pod-native skill path와 관리 source path를 짧게 추가한다. |
| `team-doc/mobile-app-dev-team/README.md` | 문서 구조에 `09-pod-native-openclaw-skills/`를 추가하고, “OpenClaw skill deferred” 문구를 현재 방침으로 교체한다. |
| `team-doc/mobile-app-dev-team/00-sot-and-principles.md` | `.agents/.codex`와 `/workspace/skills`의 경계를 명확히 한다. |
| `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md` | repo-local skill/agent와 pod-native OpenClaw skill을 별도 섹션으로 분리한다. |
| `team-doc/mobile-app-dev-team/06-gates-and-evidence.md` | Codex CLI Auth/precheck/doctor/무승인 smoke evidence 규칙을 secret-safe로 추가한다. |
| `team-doc/mobile-app-dev-team/07-new-team-template-guide.md` | 다른 팀을 만들 때 pod-native skill을 별도 폴더로 관리하는 절차를 추가한다. |
| `team-doc/mobile-app-dev-team/99-source-map.md` | boram pod 관찰 source와 제외 source(`ontology-bridge`, `canary-pp`)를 명확히 기록한다. |

## SOUL.md 반영 기준

이번 작업에서는 역할별 `SOUL.md`에 Codex CLI 설치, Auth, command, precheck 상세 절차를 넣지 않는다.

SOUL.md에 남길 수 있는 것은 필요할 경우 다음 정도의 라우팅 문장뿐이다.

```text
Codex CLI 설치/Auth/precheck가 필요한 경우 pod-native OpenClaw skill `codex-cli-auth-setup`을 사용한다.
```

다만 이번 작업의 1차 범위에서는 SOUL.md를 수정하지 않는 것을 기본값으로 한다. 사용자가 별도로 승인하면 이후 role별 routing 수준만 검토한다.

## Guardrails

- `.agents/skills`에 새 skill을 만들지 않는다.
- `.codex/agents`, `.codex/config.toml`, `.codex/hooks`를 수정하지 않는다.
- OpenClaw 외부 runtime repo를 수정하지 않는다.
- `ontology-bridge` container를 근거로 쓰지 않는다.
- `canary-pp`를 근거로 쓰지 않는다.
- secret, token, API key, OAuth/refresh token, password, full auth config contents를 문서나 evidence에 쓰지 않는다.
- `--dangerously-bypass-approvals-and-sandbox` 플래그는 유지한다. 단, 명시 요청 또는 통제된 harmless smoke에서만 사용하도록 skill safety rule에 남긴다.
- 버전 정보는 “관찰값”으로만 기록하고 production 보장값으로 쓰지 않는다.

## 테스트/검증 계획

TDD 원칙에 따라 문서 본문 업데이트 전에 validator를 먼저 보강한다.

1. `scripts/validate-team-doc.mjs`에 pod-native OpenClaw skill 검증을 추가한다.
2. validator가 다음을 확인하게 한다.
   - `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/README.md` 존재
   - `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md` 존재
   - `scripts/codex-cli-precheck.sh`와 `references/report-template.md` 존재
   - 문서에 `/workspace/skills/codex-cli-auth-setup/SKILL.md`가 명시됨
   - `codex-cli-auth-setup`이 repo-local `.agents/skills`가 아니라 pod-native OpenClaw skill로 설명됨
   - 무승인 실행 플래그가 제거되지 않고, safety guardrail과 함께 설명됨
   - `codex-cli-precheck.sh`가 auth/token 값을 출력하지 않고 redacted/status-only 출력만 하도록 작성됨
   - `codex-cli-precheck.sh`가 full auth config 내용을 출력하지 않고 auth file 존재 여부, mode, size, key name 수준만 보고하도록 작성됨
   - `references/report-template.md`가 token/key/secret 값 기록을 금지하고 status-only 보고 형식을 유지함
   - `ontology-bridge`와 `canary-pp`가 active runtime 근거로 기록되지 않음
3. 문서와 skill source를 작성한다.
4. `pnpm run validate:team-doc`를 실행한다.
5. runtime 문서/validator 변경 영향 확인을 위해 `pnpm run test:runtime`를 실행한다.
6. `AGENTS.md`가 변경 대상이므로 `pnpm run test:local-harness`를 필수로 실행한다.
7. `test:local-harness`가 환경 문제로 실행 불가하면 “blocked”로 기록하고, 이 gate가 `/workspace/skills` 실제 pod 동작을 증명하지 않는다는 점도 evidence에 명시한다.

## Reviewer 검증 계획

작업 전 계획 reviewer:

```text
.evidence/reviews/pod-native-openclaw-skill-plan-xhigh-20260610.md
```

검토 기준:

- 이번 계획이 only pod-native OpenClaw skill 범위인지
- `.agents`, `.codex` artifact 생성을 배제하는지
- Codex CLI 사용법이 SOUL.md가 아니라 `/workspace/skills/<slug>/SKILL.md`로 가는지
- 무승인 실행 플래그를 유지하면서 secret-safe guardrail을 두는지
- `ontology-bridge`, `canary-pp`를 근거에서 제외하는지
- validator-first 작업 순서가 `$wm` TDD 원칙과 맞는지

## 실행 순서

1. 이 계획서를 reviewer(xhigh)로 검토한다.
2. reviewer 지적이 있으면 계획서를 수정하고 재검토한다.
3. 승인 후 `scripts/validate-team-doc.mjs`를 먼저 업데이트한다.
4. `09-pod-native-openclaw-skills/` 폴더와 `codex-cli-auth-setup` skill source를 작성한다.
5. 관련 managed docs와 `AGENTS.md` 최상단 섹션을 업데이트한다.
6. 검증 명령을 실행하고 evidence를 남긴다.
7. 최종 diff와 reviewer 검토 결과를 보고한다.
