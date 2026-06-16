# Runtime Surface Classification 개선 보고서 v2

작성일: 2026-06-15

상태: v2 상세 개선 보고서

관련 문서:
- `mobile-app-dev-team/reports/runtime-surface-classification-improvement-report.md`
- `mobile-app-dev-team/reports/team-doc-validator-and-soul-runtime-explainer.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `scripts/validate-team-doc.mjs`

대상 범위:
- 기존 `22-runtime-surface-classification-improvement-report.md`의 개선점과 한계
- 사용자 정정 사항인 persona 기반 `/workspace/SOUL.md` 생성 모델
- `mobile-app-dev-team/**` validator의 실제 유효 범위
- pod-native runtime skill인 `/workspace/skills/<slug>/`와 repo source의 관계
- Codex CLI runtime인 `.agents/**`, `.codex/**`와 managed docs의 관계
- `test:local-harness`와 live pod runtime proof의 경계
- 다음 work unit에서 수정해야 할 문서, validator, CI/local harness policy

## 0. 요약

v2의 핵심은 v1보다 더 엄격하게 "누가 무엇을 실제로 읽는가"를 기준으로 runtime surface를 나누는 것이다.

v1은 `mobile-app-dev-team/**`를 runtime surface 기준으로 분류해야 한다는 큰 방향을 잡았다. 하지만 사용자가 제기한 핵심 질문, 즉 "pod agent가 실제로 쓰는 native-runtime skill이 `/workspace/skills/<skill-slug>/`라면 `mobile-app-dev-team/**` validator가 무슨 의미가 있느냐"에 대한 답이 충분히 날카롭지 않았다.

v2의 결론은 다음과 같다.

```text
mobile-app-dev-team/** validator
        |
        +-- live pod runtime enforcement? --------------> 아니다
        |
        +-- repo source authoring guard? ----------------> 맞다
        |
        +-- /workspace/skills sync 전 source guard? ------> 09 path에 한해 맞다
        |
        +-- /workspace/SOUL.md seed/source guard? --------> runtime-sources/role-souls에 한해 맞다
        |
        +-- Codex CLI skill/agent authoring guard? -------> .agents/.codex 연결부에 한해 맞다
```

따라서 `mobile-app-dev-team/**` validator를 유지할 수는 있다. 그러나 그 이유를 "pod agent가 runtime에서 이 문서를 직접 읽기 때문"이라고 설명하면 안 된다. 그 설명은 SoT 기준으로 틀리다.

정확한 설명은 다음이다.

```text
validator의 유효성:
  repo source가 runtime surface로 포장되기 전 깨지지 않게 막는다.
  role SOUL source가 persona와 결합되기 전 구조적으로 깨지지 않게 막는다.
  Codex가 repo 문서를 수정할 때 skill/agent/policy drift를 막는다.
  PR에서 source map, README, no-secret, no-overclaim 상태를 지킨다.

validator의 한계:
  live /workspace/SOUL.md를 증명하지 못한다.
  live /workspace/skills/<slug>/ 설치 상태를 증명하지 못한다.
  pod agent가 일반 governance 문서를 읽는다고 보장하지 못한다.
  local harness가 OpenClaw live pod behavior를 증명하지 못한다.
```

v2는 그래서 다음 수정 방향을 제안한다.

1. `mobile-app-dev-team/**`를 전부 같은 runtime 중요도로 보지 않는다.
2. path family를 `R1 runtime source`, `R2 seed/source input`, `R3 governance docs`, `C1 Codex runtime source`로 나눈다.
3. `runtime-sources/pod-native-openclaw-skills/**`는 `/workspace/skills`로 sync되는 source라 강하게 검증한다.
4. `runtime-sources/role-souls/**`는 사용자 지정 persona와 결합되어 `/workspace/SOUL.md`를 만드는 source material이라 검증한다.
5. 일반 governance docs는 live pod runtime enforcement가 아니라 authoring/PR guard로만 검증한다.
6. 실제 pod agent 행동 규칙은 일반 문서가 아니라 `/workspace/SOUL.md`, `/workspace/AGENTS.md`, `/workspace/skills/<slug>/SKILL.md`, 또는 Codex CLI runtime artifact로 승격해야 한다.

전체 관계를 한 장으로 보면 다음과 같다.

```text
                                      +-----------------------------+
                                      | user-selected persona       |
                                      +-----------------------------+
                                                    |
                                                    v
+------------------------------+       +-----------------------------+
| runtime-sources/role-souls/<role>.md      | ----> | /workspace/SOUL.md          |
| R2 seed/source input         |       | live pod identity file      |
+------------------------------+       +-----------------------------+

+------------------------------+       +-----------------------------+
| 09-pod-native-skills/<slug>/ | ----> | /workspace/skills/<slug>/   |
| R1 runtime source            | sync  | live pod-native skill       |
+------------------------------+       +-----------------------------+

+------------------------------+       +-----------------------------+
| .agents / .codex             | ----> | Codex CLI runtime           |
| C1 Codex runtime source      |       | repo-local workflow         |
+------------------------------+       +-----------------------------+

+------------------------------+       +-----------------------------+
| other mobile-app-dev-team md | -x->  | live pod runtime            |
| R3 governance docs           |       | 직접 영향 없음             |
+------------------------------+       +-----------------------------+
```

이 한계를 인정해야 다음 업데이트가 정확해진다.

## 1. v2의 목적

v1인 `22-runtime-surface-classification-improvement-report.md`는 runtime surface를 분류해야 한다는 방향을 잡았다. 그 방향 자체는 유효하다.

하지만 v1은 사용자가 실제로 묻고 있는 핵심 질문에 충분히 답하지 못했다.

핵심 질문은 다음이다.

```text
pod agent가 실제로 일할 때 읽는 것은 무엇인가?

답:
  /workspace/SOUL.md
  /workspace/AGENTS.md
  /workspace/skills/<skill-slug>/SKILL.md
  Codex CLI를 쓰는 경우 repo-local .agents/.codex

그렇다면:
  mobile-app-dev-team/** 안의 일반 문서와 validator는
  live pod agent 실행에 어떤 의미가 있는가?
```

v2는 이 질문에 정면으로 답하기 위해 작성한다.

결론부터 말하면:

1. `mobile-app-dev-team/**` validator는 live pod agent runtime을 직접 통제하지 않는다.
2. 특히 `runtime/pod process docs`, `evidence and governance docs`, `source map and registry` 같은 문서가 `/workspace/skills/<slug>/`로 sync되지 않는다면 pod agent는 그것을 native runtime skill로 읽지 않는다.
3. 따라서 그런 문서의 validator는 pod agent 실행 규칙이 아니라 repo authoring gate, PR gate, drift guard, source packaging guard에 가깝다.
4. pod agent 실행 품질에 영향을 주려면 해당 규칙은 `/workspace/SOUL.md`, `/workspace/AGENTS.md`, `/workspace/skills/<slug>/SKILL.md`, 또는 Codex CLI가 실제 사용하는 `.agents/**`와 `.codex/**`로 들어가야 한다.
5. 그러므로 `mobile-app-dev-team/**` 전체를 local harness 대상처럼 보는 현재 broad trigger는 과하다.
6. 다만 `mobile-app-dev-team/**` 전체 validator가 완전히 무의미한 것은 아니다. 유효한 범위는 "runtime source를 안전하게 만들고, sync 전 source drift를 막고, Codex가 repo 문서를 바꿀 때 역할/정책 일관성을 지키는 것"이다.

이 문서는 v1을 삭제하지 않는다. v1의 한계를 분명히 하고, 다음 수정 work unit에서 무엇을 어디로 옮겨야 실제 pod agent에 영향을 주는지 정리한다.

## 2. 사용자가 정정한 SOUL 생성 모델

v1은 `/workspace/SOUL.md`를 "pod 생성 시 수동 생성되고, `runtime-sources/role-souls/*.md`를 기준으로 한다"라고 요약했다.

이 표현은 너무 거칠다.

사용자가 의도한 더 정확한 모델은 다음이다.

```text
pod 생성 입력
  |
  +-- 사용자가 지정한 persona
  |
  +-- mobile-app-dev-team/runtime-sources/role-souls/<role>-soul.md
        |
        v
pod 생성 시 조립되는 runtime identity
        |
        v
/workspace/SOUL.md
```

즉 `/workspace/SOUL.md`는 단순히 role SOUL 문서를 복사한 결과물이 아니다.

더 정확하게는:

- 사용자가 지정한 persona가 있다.
- 그 persona는 role SOUL source와 결합된다.
- 결합 결과가 pod runtime identity file인 `/workspace/SOUL.md`가 된다.
- pod 생성 이후 live agent는 repo의 `runtime-sources/role-souls/*.md` 파일명이 아니라 `/workspace/SOUL.md`를 기준으로 자신의 역할을 확인한다.

현재 SoT도 live pod가 role source filename에 의존하면 안 된다고 말한다. `project-bootstrap`은 live pod에서 `/workspace/SOUL.md`를 읽고 canonical role slug를 선택한 뒤 `PROJECT_BOOTSTRAP_ROLE_SLUG`로 넘기는 모델을 갖는다.

따라서 v2의 정정은 다음이다.

```text
v1 표현:
  /workspace/SOUL.md는 role SOUL 문서에서 수동 생성된다.

v2 표현:
  /workspace/SOUL.md는 pod 생성 시 사용자가 지정한 persona와
  mobile-app-dev-team/runtime-sources/role-souls/의 role source 내용을 조합해 만들어지는
  live pod runtime identity file이다.
```

이 차이는 중요하다.

`runtime-sources/role-souls/*.md` validator는 `/workspace/SOUL.md`의 source material 품질을 검증할 수 있다. 그러나 이미 생성된 live pod의 `/workspace/SOUL.md` 내용이 실제로 그 persona 조합을 반영하는지는 repo validator가 증명하지 못한다.

이를 증명하려면 pod 생성 artifact나 pod 내부 evidence가 필요하다.

## 3. SoT 기준 runtime surface 판정

현재 repo SoT를 기준으로 runtime surface는 아래처럼 나뉜다.

```text
+--------------------------------------------------------------------------------+
| 실제 실행 surface                                                               |
+--------------------------+-----------------------------+-----------------------+
| surface                  | live path                   | 누가 읽는가           |
+--------------------------+-----------------------------+-----------------------+
| pod identity             | /workspace/SOUL.md          | OpenClaw pod agent    |
| pod instruction surface  | /workspace/AGENTS.md        | OpenClaw pod agent    |
| pod-native skill         | /workspace/skills/<slug>/   | OpenClaw pod agent    |
| repo-local Codex skill   | .agents/skills/<slug>/      | Codex CLI             |
| repo-local Codex agent   | .codex/agents/<agent>.toml  | Codex CLI             |
| repo hooks/config        | .codex/hooks, config.toml   | Codex CLI             |
+--------------------------+-----------------------------+-----------------------+
```

반면 `mobile-app-dev-team/**` 안의 많은 문서는 live path가 아니다.

```text
+--------------------------------------------------------------------------------+
| repo 문서/source surface                                                        |
+-----------------------------------------------+--------------------------------+
| repo path                                      | live pod 직접 실행 영향         |
+-----------------------------------------------+--------------------------------+
| mobile-app-dev-team/runtime-sources/role-souls/*.md        | pod 생성 전 source material     |
| mobile-app-dev-team/09-pod-native-*/<slug>/   | sync 후 /workspace/skills 영향  |
| mobile-app-dev-team/16-pod-environment-*.md   | 문서일 뿐, skill이 아니면 무영향 |
| mobile-app-dev-team/14/15/20 governance docs  | 문서일 뿐, skill이 아니면 무영향 |
| mobile-app-dev-team/source-map.md          | 문서 index, runtime 무영향       |
| mobile-app-dev-team/22*.md                    | 보고서, runtime 무영향           |
+-----------------------------------------------+--------------------------------+
```

핵심은 아래 한 줄이다.

```text
pod agent runtime에 영향을 주려면 /workspace/SOUL.md, /workspace/AGENTS.md,
/workspace/skills/<slug>/, 또는 Codex CLI runtime artifact에 도달해야 한다.
```

그 경로에 도달하지 않는 `mobile-app-dev-team/**` 문서는 live pod agent 동작을 직접 바꾸지 않는다.

## 4. v1 문서의 개선점

v1은 다음 점에서 유효했다.

### 4.1 source와 runtime snapshot 구분

v1은 `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`와 `/workspace/skills/<slug>/`를 구분했다.

이 구분은 SoT와 맞다.

```text
repo source
  mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/
        |
        | openclaw-pod-skills-sync
        v
runtime snapshot
  /workspace/skills/<slug>/
```

### 4.2 local validation과 live pod proof 구분

v1은 local validation이 live pod proof가 아니라고 설명했다.

이 역시 맞다.

```text
local validator PASS
  |
  v
"repo source가 일관됨"

local validator PASS
  |
  x
"live pod에 설치됨" 은 증명하지 못함
```

### 4.3 broad `mobile-app-dev-team/**` trigger 문제 제기

v1은 `mobile-app-dev-team/**` 전체를 local harness 대상으로 취급하는 것이 과할 수 있다고 지적했다.

이 방향도 맞다.

### 4.4 registry 필요성 제기

v1은 path family별 runtime surface registry를 만들자고 제안했다.

이 제안도 여전히 유효하다.

다만 v2에서는 registry의 목적을 더 좁힌다.

registry의 목적은 "모든 문서를 runtime처럼 보이게 만드는 것"이 아니다.

registry의 목적은 "이 문서가 live runtime에 직접 영향을 주는지, authoring guard인지, sync source인지, 단순 governance 문서인지"를 구분하는 것이다.

## 5. v1 문서의 한계

v1의 한계는 다음이다.

### 5.1 `/workspace/SOUL.md` 생성 모델이 단순했다

v1은 `/workspace/SOUL.md`를 role SOUL 문서 기반 수동 생성으로만 설명했다.

그러나 사용자의 모델은 더 정확히는:

```text
사용자 지정 persona + runtime-sources/role-souls role source -> /workspace/SOUL.md
```

이다.

따라서 v1은 persona dimension을 누락했다.

### 5.2 "문서 분류"와 "runtime 소비"를 충분히 분리하지 않았다

v1은 `runtime/pod process docs`, `evidence and governance docs`, `source map and registry` 같은 분류를 제안했다.

그러나 이 분류는 repo maintainer에게는 유용해도 pod agent runtime에는 자동으로 유효하지 않다.

아래가 정확한 판정이다.

```text
문서가 mobile-app-dev-team/** 안에 있음
        |
        v
runtime에 영향?
        |
        +-- /workspace/skills로 sync됨 ----------------> 영향 있음
        |
        +-- /workspace/SOUL.md 생성에 사용됨 ----------> pod 생성 시 영향 있음
        |
        +-- /workspace/AGENTS.md로 반영됨 --------------> 영향 있음
        |
        +-- Codex CLI skill/agent가 읽음 ---------------> Codex 작업에 영향 있음
        |
        +-- 그 외 일반 문서 ----------------------------> live pod agent 직접 영향 없음
```

v1은 이 마지막 줄을 충분히 강하게 말하지 않았다.

### 5.3 validator의 의미를 과대평가할 여지가 있었다

v1은 validator를 registry 기반으로 좁히자는 방향을 제안했다.

하지만 사용자의 핵심 질문은 더 날카롭다.

```text
pod agent가 native runtime skill로 일한다면,
mobile-app-dev-team/** validator가 pod agent 실행에 무슨 의미가 있는가?
```

v2의 답은:

```text
직접 실행 의미는 없다.
의미가 있다면 sync 전 source guard 또는 Codex authoring guard로서만 있다.
```

이다.

### 5.4 local harness의 역할을 더 강하게 제한해야 했다

v1은 local harness가 live pod proof가 아니라고 말했다.

하지만 v2에서는 더 강하게 말해야 한다.

```text
local harness는 pod agent runtime behavior를 증명하지 않는다.
local harness는 repo-local Codex runtime, validators, fixtures, hooks, scripts를 검증한다.
OpenClaw packaging path와 /workspace/skills live state는 local harness scope 밖이다.
```

이는 `AGENTS.md`의 local harness 설명과 맞다.

## 6. 사용자의 결론에 대한 SoT 기준 답변

사용자의 결론은 다음과 같다.

```text
pod Agents가 일해야 하는 핵심이 Native-runtime skill(/workspace/skills/<skill-slug>/)이라면,
hooks 등으로 전혀 영향을 받지 않으니 mobile-app-dev-team/** validator는 쓰임이 없다.
codex cli의 skills, agents만 이것에 영향을 받는다.
그렇다면 왜 mobile-app-dev-team/**을 validator 해야 하는가?
```

이 결론은 절반은 맞고, 절반은 범위를 나누어야 한다.

### 6.1 맞는 부분

다음은 맞다.

```text
일반 mobile-app-dev-team 문서
  |
  | sync되지 않음
  | /workspace/skills에 없음
  | /workspace/SOUL.md 생성에 쓰이지 않음
  | /workspace/AGENTS.md에 반영되지 않음
  v
live pod agent runtime에 직접 영향 없음
```

즉 `16-pod-environment-bootstrap.md`, `workflows/native-e2e-strategy.md`, `governance/human-ops-live-readiness-annex.md`, `governance/app-eas-ota-rollback-runbook.md`, `source-map.md`, `22*.md` 같은 문서는 그 자체로 pod-native skill이 아니다.

pod agent가 `/workspace/skills/<slug>/SKILL.md`만 실행한다면, 이 문서들은 runtime instruction으로 작동하지 않는다.

따라서 이 문서들의 validator를 "pod agent runtime enforcement"라고 부르면 틀리다.

### 6.2 범위를 나누어야 하는 부분

하지만 `mobile-app-dev-team/**` 전체가 무의미한 것은 아니다.

다음 path들은 runtime source 또는 runtime source의 source material이다.

```text
mobile-app-dev-team/runtime-sources/role-souls/*.md
  -> pod 생성 시 사용자 persona와 결합되어 /workspace/SOUL.md source가 됨

mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/
  -> openclaw-pod-skills-sync 후 /workspace/skills/<slug>/ runtime snapshot이 됨

mobile-app-dev-team/04-skills-and-agents-matrix.md
  -> repo-local Codex skill/agent mapping 문서이며 authoring consistency guard로 유효

mobile-app-dev-team/workflows/github-artifact-workflow.md
  -> pod-isolated GitHub handoff rule 문서이며 Codex/reviewer authoring guard로 유효
```

이 path들은 적어도 "source package 품질"을 검증할 필요가 있다.

### 6.3 최종 답변

따라서 질문에 대한 답은 다음이다.

```text
왜 mobile-app-dev-team/**을 validator 해야 하는가?

답:
  모든 파일을 같은 강도로 validator 해야 하는 것은 아니다.

  validator가 유효한 경우:
    - 파일이 /workspace/skills로 sync되는 source인 경우
    - 파일이 /workspace/SOUL.md 생성 source material인 경우
    - 파일이 Codex CLI skill/agent authoring과 직접 연결되는 경우
    - 파일이 PR gate에서 policy drift를 막는 SoT 문서인 경우
    - 파일에 secret-like 값이 들어가면 안 되는 경우

  validator가 runtime enforcement로는 무효한 경우:
    - 파일이 /workspace/skills에 들어가지 않는 일반 문서인 경우
    - 파일이 /workspace/SOUL.md 생성에 사용되지 않는 경우
    - 파일이 /workspace/AGENTS.md에 반영되지 않는 경우
    - pod-native skill이 그 파일을 읽지 않는 경우
```

즉 "validator를 없애야 한다"가 아니라 "validator의 의미와 scope를 나누어야 한다"가 정확하다.

## 7. validator의 유효 범위 재정의

현재 `validate-team-doc.mjs`는 많은 것을 검사한다.

이것을 한 덩어리로 보면 사용자 질문에 답하기 어렵다.

v2에서는 다음처럼 나눈다.

```text
validate-team-doc.mjs
|
+-- A. 항상 유효한 repo hygiene
|   |
|   +-- secret-like 값 방지
|   +-- required docs 존재 확인
|   +-- source map / README drift 방지
|
+-- B. runtime source guard
|   |
|   +-- runtime-sources/role-souls shape
|   +-- 09-pod-native skill SKILL.md shape
|   +-- sync script safety terms
|
+-- C. Codex authoring guard
|   |
|   +-- .agents skill matrix와 current docs 불일치 방지
|   +-- .codex agent/reviewer routing 문서 불일치 방지
|
+-- D. weak governance guard
    |
    +-- 일반 정책 문서의 표현/용어 drift 방지
    +-- 단, pod runtime enforcement라고 주장하면 안 됨
```

각 범위의 의미는 다르다.

| 범위 | validator 의미 | live pod runtime 영향 |
| --- | --- | --- |
| A. repo hygiene | repo 안전성 | 직접 영향 없음 |
| B. runtime source guard | sync/seed 전 source 품질 | sync 또는 pod 생성 후 영향 가능 |
| C. Codex authoring guard | Codex 작업 일관성 | Codex CLI 사용 시 영향 |
| D. weak governance guard | 사람/문서/PR 일관성 | 직접 영향 없음 |

따라서 future 개선은 `validate-team-doc.mjs`를 없애는 것이 아니라, output과 failure message가 이 네 범위를 구분하게 만드는 것이다.

## 8. local harness trigger 재정의

현재 `PROJECT_ENVIRONMENT.md`는 `mobile-app-dev-team/**` 변경 시 `test:local-harness`를 실행한다고 말한다.

이것은 안전하지만 과하다.

SoT 기준으로 local harness는 Codex CLI runtime structure, role boundaries, skill/agent/hook config, gatekeeper/evidence fixtures, headless Codex smoke를 검증한다. OpenClaw `/workspace/skills` live state는 scope 밖이다.

따라서 아래처럼 나눠야 한다.

```text
changed path
    |
    v
+-----------------------------------------------------+
| runtime relevance decision                          |
+-----------------------------------------------------+
    |
    +-- .agents/** ------------------------> test:local-harness required
    |
    +-- .codex/** -------------------------> test:local-harness required
    |
    +-- evals/** --------------------------> test:local-harness required
    |
    +-- scripts/runtime validators --------> test:local-harness required
    |
    +-- runtime-sources/pod-native-openclaw-skills/** --> test:runtime + source sync checks
    |                                        local harness only if Codex/harness
    |                                        fixtures are affected
    |
    +-- runtime-sources/role-souls/** ------------------> validate:team-doc + role-source check
    |                                        pod recreation evidence needed for live
    |
    +-- ordinary mobile-app-dev-team docs --> validate:team-doc only
                                             unless explicitly consumed by runtime
```

이 재정의는 gate를 약화하는 것이 아니다.

오히려 다음을 명확히 한다.

- Codex runtime 변경은 계속 강하게 검증한다.
- pod-native skill source는 sync target이므로 강하게 검증한다.
- 일반 governance 문서는 live runtime claim을 하지 않는다.
- 문서 변경만으로 pod behavior가 바뀐다고 착각하지 않는다.

## 9. `mobile-app-dev-team/**` 문서를 세 등급으로 나누기

v2는 `mobile-app-dev-team/**`를 아래 세 등급으로 나눈다.

```text
+--------------------------------------------------------------------------------+
| mobile-app-dev-team/** classification                                           |
+----------------------+------------------------------+--------------------------+
| 등급                 | 예시                         | validator 의미           |
+----------------------+------------------------------+--------------------------+
| R1 runtime source    | runtime-sources/pod-native-openclaw-skills | sync 전 source guard     |
| R2 seed/source input | runtime-sources/role-souls                 | pod 생성 source guard    |
| R3 governance docs   | 14,15,16,20,22,99 등          | authoring/PR guard       |
+----------------------+------------------------------+--------------------------+
```

### R1. runtime source

R1은 live pod에 직접 들어갈 수 있다.

```text
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/
        |
        v
openclaw-pod-skills-sync
        |
        v
/workspace/skills/<slug>/
```

R1 validator는 강한 의미가 있다.

하지만 그 의미도 "sync 전 source 품질"이지 "이미 sync된 live pod 상태"는 아니다.

### R2. seed/source input

R2는 pod 생성 시 사용자가 지정한 persona와 결합되는 source material이다.

```text
user persona
      +
runtime-sources/role-souls/<role>-soul.md
      |
      v
/workspace/SOUL.md
```

R2 validator는 role source 품질을 검증한다.

하지만 이미 존재하는 pod의 `/workspace/SOUL.md`가 최신 source를 반영했는지는 증명하지 않는다.

### R3. governance docs

R3는 일반 문서다.

```text
mobile-app-dev-team/workflows/native-e2e-strategy.md
mobile-app-dev-team/governance/human-ops-live-readiness-annex.md
mobile-app-dev-team/16-pod-environment-bootstrap.md
mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md
mobile-app-dev-team/22*.md
mobile-app-dev-team/source-map.md
```

R3 validator는 다음 용도로만 유효하다.

- 사람과 Codex가 repo 문서를 수정할 때 drift를 막는다.
- source map과 README가 stale해지는 것을 막는다.
- secret-like 값이 문서에 들어가지 않게 한다.
- live platform claim을 과장하지 않게 한다.

R3 validator는 pod agent native runtime을 바꾸지 않는다.

## 10. 무엇을 `/workspace/skills`로 승격해야 하는가

사용자가 원하는 것은 실제 능동적으로 일하는 pod runtime team이다.

그렇다면 핵심 규칙은 일반 문서에만 있으면 안 된다.

아래 질문으로 승격 여부를 판단한다.

```text
이 규칙이 pod agent가 작업 중 반드시 따라야 하는가?
        |
        +-- Yes
        |     |
        |     +-- pod-native skill에 넣는다.
        |     |   mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/SKILL.md
        |     |          |
        |     |          v
        |     |   /workspace/skills/<slug>/SKILL.md
        |     |
        |     +-- 또는 /workspace/AGENTS.md에 반영한다.
        |     |
        |     +-- Codex CLI 작업 규칙이면 .agents/.codex에 넣는다.
        |
        +-- No
              |
              +-- mobile-app-dev-team 일반 문서로 유지한다.
              +-- validate:team-doc는 authoring guard로만 적용한다.
```

즉 다음을 구분해야 한다.

| 규칙 종류 | 있어야 하는 곳 |
| --- | --- |
| pod setup 절차 | `runtime-sources/pod-native-openclaw-skills/project-bootstrap` |
| pod skill sync 절차 | `runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync` |
| role identity 선택 | `/workspace/SOUL.md`, `project-bootstrap`, `pod-role-bootstrap` |
| Codex repo workflow | `.agents/skills/*`, `.codex/agents/*`, `.codex/hooks*` |
| 사람/문서 governance | `mobile-app-dev-team/*.md` |
| PR/source map traceability | `README.md`, `source-map.md`, validators |

## 11. 기존 개선 폴더 구조에 대한 정정

v1은 다음 같은 묶음을 제안했다.

- `runtime/pod process docs`
- `evidence and governance docs`
- `source map and registry`

이 묶음은 repo 문서 구조상 의미가 있다.

하지만 pod agent runtime 의미는 없다.

정확히는 아래처럼 말해야 한다.

```text
문서 폴더 구조상 분류
  |
  v
maintainer 이해에 도움
  |
  x
pod agent runtime enforcement 아님
```

따라서 v2에서는 이 구조를 다음처럼 재정의한다.

```text
+-----------------------------+------------------------------------------+
| 문서 분류                   | runtime 판정                             |
+-----------------------------+------------------------------------------+
| runtime/pod process docs    | skill로 sync되지 않으면 설명 문서        |
| evidence/governance docs    | live evidence rule source가 아니라 guide |
| source map and registry     | repo authoring map, runtime input 아님   |
+-----------------------------+------------------------------------------+
```

이 문서를 pod agent가 따라야 한다면, 다음 중 하나가 필요하다.

1. 해당 규칙을 `runtime-sources/pod-native-openclaw-skills/<slug>/SKILL.md`로 옮긴다.
2. 해당 규칙을 `/workspace/AGENTS.md` 생성/갱신 규칙에 포함한다.
3. 해당 규칙을 Codex CLI가 읽는 `.agents/skills` 또는 `.codex/agents`로 옮긴다.
4. pod skill이 해당 repo 문서를 명시적으로 읽도록 만든다.

4번은 권장하지 않는다. live pod에서 repo 문서를 매번 읽게 만들면 runtime source와 docs source가 다시 섞인다.

권장 방향은 1번 또는 2번이다.

## 12. `mobile-app-dev-team/**` validator를 계속 유지할 이유

그럼에도 validator를 유지할 이유는 있다.

다만 이유를 정확히 써야 한다.

### 12.1 유지 이유 1: runtime source packaging guard

`runtime-sources/pod-native-openclaw-skills/**`는 `/workspace/skills`로 copy-sync된다.

따라서 이 source가 깨지면 다음 sync 때 pod runtime snapshot도 깨진다.

```text
bad source under 09
      |
      v
openclaw-pod-skills-sync
      |
      v
bad /workspace/skills snapshot
```

이 영역의 validator는 강하게 유지해야 한다.

### 12.2 유지 이유 2: role persona source guard

`runtime-sources/role-souls/**`는 `/workspace/SOUL.md` 생성 재료다.

사용자 지정 persona와 결합되기 전의 role source가 깨지면 pod identity 품질이 떨어진다.

```text
broken role source
      +
user persona
      |
      v
bad /workspace/SOUL.md candidate
```

이 영역의 validator도 유지해야 한다.

단, "현재 live pod SOUL이 유효하다"는 claim은 금지해야 한다.

### 12.3 유지 이유 3: Codex authoring guard

Codex CLI는 repo-local `.agents/**`, `.codex/**`, validators, scripts, evidence를 사용한다.

Codex가 `mobile-app-dev-team/**`를 수정할 때 role boundary, source map, skill matrix가 깨지면 이후 runtime source 작성 품질이 낮아진다.

따라서 authoring guard로 validator가 유효하다.

### 12.4 유지 이유 4: PR drift guard

이 repo는 branch/PR gate를 통해 변경을 관리한다.

validator는 아래 drift를 막는다.

- README에 없는 새 문서
- source map에 없는 active source
- historical source와 active source 혼동
- live platform proof를 local validation으로 과장하는 문구
- secret-like 값
- pod-native skill frontmatter/required phrase 누락

이건 live pod runtime enforcement가 아니라 PR/source 관리 기능이다.

## 13. `mobile-app-dev-team/**` validator를 줄여야 하는 이유

반대로 줄여야 하는 부분도 있다.

### 13.1 ordinary docs에 full local harness를 요구하는 것은 과하다

일반 문서가 pod runtime에 직접 들어가지 않는다면 full local harness는 과하다.

```text
22 보고서 문구 수정
      |
      v
pod runtime 변화 없음
      |
      v
full local harness는 signal 대비 비용이 큼
```

이 경우 `validate:team-doc`, `git diff --check`, reviewer 검토 정도가 더 정확하다.

### 13.2 문구 기반 validator는 runtime 품질을 보장하지 않는다

문서에 특정 표현이 있다고 해서 pod agent가 그 표현을 따른다는 보장은 없다.

따라서 문구 기반 validator는 다음으로 제한해야 한다.

- source map 필수 문구
- role boundary 필수 문구
- safety/no-secret 문구
- pod-native skill source shape

runtime behavior는 runtime skill script와 pod evidence로 검증해야 한다.

### 13.3 같은 규칙을 docs와 skill에 중복하면 drift가 생긴다

규칙이 문서에도 있고 skill에도 있으면 언젠가 어긋난다.

권장 원칙:

```text
runtime 행동 규칙 -> skill 또는 AGENTS에 둔다.
설명/배경/traceability -> mobile-app-dev-team docs에 둔다.
validator -> source와 runtime target의 연결이 깨졌는지만 본다.
```

## 14. 다음 수정의 설계 원칙

다음 work unit은 registry를 만들되, v1보다 더 엄격한 목적을 가져야 한다.

registry는 "문서 목록"이 아니다.

registry는 "runtime 소비 여부"를 판단하는 표다.

필수 필드:

```text
+------------------------+------------------------------------------------+
| field                  | meaning                                        |
+------------------------+------------------------------------------------+
| path_family            | repo path pattern                              |
| class                  | R1 runtime source / R2 seed input / R3 docs    |
| consumed_by_pod        | yes / no / only_after_sync / only_at_creation  |
| runtime_target         | /workspace path or none                        |
| codex_consumed         | yes / no                                       |
| validator_level        | strong / normal / hygiene-only                 |
| local_harness_policy   | required / conditional / not-required          |
| live_evidence_required | pod / external / none                          |
+------------------------+------------------------------------------------+
```

예시:

```text
+--------------------------------------+-------+------------------+----------------------+
| path_family                          | class | consumed_by_pod  | local_harness_policy |
+--------------------------------------+-------+------------------+----------------------+
| runtime-sources/pod-native-openclaw-skills/**     | R1    | only_after_sync  | conditional          |
| runtime-sources/role-souls/*.md                   | R2    | only_at_creation | not-required         |
| .agents/skills/**                    | C1    | no               | required             |
| .codex/agents/**                     | C1    | no               | required             |
| scripts/test-local-harness.mjs       | C2    | no               | required             |
| mobile-app-dev-team/22*.md           | R3    | no               | not-required         |
| mobile-app-dev-team/source-map.md | R3    | no               | not-required         |
+--------------------------------------+-------+------------------+----------------------+
```

여기서 중요한 것은 `09`도 무조건 local harness가 아니라는 점이다.

`09`는 pod-native runtime source이므로 강한 source validation이 필요하다. 그러나 local harness가 OpenClaw `/workspace/skills` live state를 증명하지 않는다면, local harness의 역할은 제한된다.

`09` 변경에 필요한 검증은 다음이 더 정확하다.

- `validate:team-doc`
- pod-native skill shape validation
- sync script self-test 또는 fixture
- 필요 시 local smoke with temporary `OPENCLAW_POD_SKILLS_ROOT`
- 실제 pod sync evidence는 별도

## 15. 권장 validator split

기존 `validate:team-doc` wrapper는 유지해도 된다.

하지만 내부 의미는 나눠야 한다.

```text
pnpm run validate:team-doc
        |
        +-- validate:team-doc:hygiene
        |     - secret-like scan
        |     - required docs exist
        |     - README/source-map basics
        |
        +-- validate:team-doc:role-source
        |     - runtime-sources/role-souls shape
        |     - persona composition contract terms
        |     - no claim of live /workspace/SOUL.md proof
        |
        +-- validate:team-doc:pod-skill-source
        |     - 09 skill frontmatter
        |     - SKILL.md runtime shape
        |     - sync target declaration
        |     - status-only/no-secret rules
        |
        +-- validate:team-doc:governance
              - source map
              - historical/current boundaries
              - reviewer/gate wording
```

그리고 각 failure에는 severity와 runtime relevance를 표시해야 한다.

예시:

```text
[R1/runtime-source] project-bootstrap missing /workspace/skills runtime shape
[R2/seed-input] product-planning-soul missing required identity heading
[R3/governance] README missing report index
[HYGIENE] probable secret-like value in managed docs
```

이렇게 해야 사용자가 "이 validator가 pod runtime에 무슨 의미가 있느냐"를 바로 알 수 있다.

## 16. 권장 CI/local harness 정책

현재는 `mobile-app-dev-team/**` 변경이 local harness trigger에 들어간다.

v2 권장안은 다음이다.

```text
+------------------------------------------+----------------------------+
| changed path                             | required gate              |
+------------------------------------------+----------------------------+
| .agents/**                               | test:runtime + local-harness |
| .codex/**                                | test:runtime + local-harness |
| evals/**                                 | test:runtime + local-harness |
| scripts/runtime or harness validators    | test:runtime + local-harness |
| runtime-sources/pod-native-openclaw-skills/**         | test:runtime + pod-source validation |
| runtime-sources/role-souls/**                         | validate:team-doc + reviewer |
| mobile-app-dev-team governance docs      | validate:team-doc + reviewer |
| README/source-map only                   | validate:team-doc + diff check |
+------------------------------------------+----------------------------+
```

단, 전환은 한 번에 하면 안 된다.

전환 순서:

1. registry를 만든다.
2. registry fixture를 만든다.
3. `validate-project-environment`가 registry와 CI trigger를 비교하게 한다.
4. `validate-team-doc`이 failure category를 표시하게 한다.
5. 이후 `.github/workflows/quality-gate.yml`의 broad `mobile-app-dev-team/**` trigger를 좁힌다.

## 17. pod agent에 실제 영향을 주는 수정 backlog

사용자의 목표가 "실제 능동적으로 일하는 pod runtime team"이라면 우선순위는 다음이다.

### P0. persona 기반 SOUL 생성 계약 문서화

대상:

- `mobile-app-dev-team/runtime-sources/role-souls/*.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- 필요 시 pod 생성 runbook 또는 external pod creation contract

필요 내용:

- `/workspace/SOUL.md`는 사용자가 지정한 persona와 role source의 조합 결과다.
- repo role source는 seed material이지 live file proof가 아니다.
- pod 생성 이후 source 변경은 live pod에 자동 반영되지 않는다.
- live pod refresh/recreate evidence가 필요하다.

### P0. runtime-consumed registry 작성

대상:

- `mobile-app-dev-team/23-runtime-surface-registry.md`

필요 내용:

- `consumed_by_pod`
- `runtime_target`
- `local_harness_policy`
- `validator_level`
- `live_evidence_required`

### P0. pod-native skill source에만 runtime claim 허용

대상:

- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**`
- `openclaw-pod-skills-sync`
- `project-bootstrap`
- `codex-role-workflow`

필요 내용:

- pod agent가 반드시 따라야 하는 규칙은 여기로 이동한다.
- 일반 docs에만 있는 규칙은 runtime claim으로 인정하지 않는다.

### P1. validator output 재구성

대상:

- `scripts/validate-team-doc.mjs`

필요 내용:

- R1/R2/R3 failure category
- live runtime proof claim 금지
- ordinary docs와 runtime source 구분

### P1. local harness trigger 축소

대상:

- `.github/workflows/quality-gate.yml`
- `PROJECT_ENVIRONMENT.md`
- `scripts/validate-project-environment.mjs`

필요 내용:

- registry 기반 trigger
- broad `mobile-app-dev-team/**` 제거 또는 conditional 전환
- `09`와 `.agents/.codex/evals/scripts`는 안전하게 유지

### P1. sync evidence 강화

대상:

- `openclaw-pod-skills-sync/scripts/sync-pod-skills.sh`
- sync report schema
- smoke fixture

필요 내용:

- source hash 또는 copied slug inventory
- runtime target inventory
- `/workspace/AGENTS.md` side-effect evidence
- local temp-root smoke와 live pod evidence 분리

## 18. v2 핵심 판단

v2의 핵심 판단은 다음이다.

```text
1. 사용자의 문제 제기는 타당하다.

2. pod agent native runtime이 /workspace/skills/<slug> 중심이라면,
   mobile-app-dev-team/** 일반 문서는 pod agent 실행에 직접 영향을 주지 않는다.

3. 따라서 mobile-app-dev-team/** validator를 "pod runtime enforcement"로
   설명하면 틀리다.

4. validator의 유효성은 다음으로 제한해야 한다.
   - runtime source packaging guard
   - persona/role source guard
   - Codex authoring guard
   - PR/source-map/hygiene guard

5. 실제 pod agent 행동을 바꾸려면 규칙을 native runtime surface로 옮겨야 한다.
   - /workspace/SOUL.md
   - /workspace/AGENTS.md
   - /workspace/skills/<slug>/SKILL.md
   - .agents/.codex when Codex CLI is the executor

6. next work unit은 registry를 만들되,
   "문서 분류표"가 아니라 "runtime 소비 여부와 gate policy 표"로 만들어야 한다.
```

마지막으로, 이 문서의 핵심 구조는 아래와 같다.

```text
repo docs
  |
  +-- R1: /workspace/skills로 sync됨 ---------> pod runtime 영향 가능
  |
  +-- R2: /workspace/SOUL.md 생성 source -----> pod 생성 시 영향 가능
  |
  +-- C1: .agents/.codex --------------------> Codex CLI runtime 영향
  |
  +-- R3: 일반 governance docs --------------> pod runtime 직접 영향 없음

validator
  |
  +-- R1/R2/C1 source guard로는 유효
  |
  +-- R3 runtime enforcement로는 무효
  |
  +-- PR/hygiene/traceability guard로는 유효
```

이 구분을 문서와 validator가 동시에 반영해야, `mobile-app-dev-team/**`가 실제 pod runtime team source로서 의미를 갖는 부분과 단순 관리 문서인 부분이 분리된다.

## 19. 원본 22 보고서 대비 업데이트 요약

v2는 원본 `22`의 방향을 버리지 않는다. 대신 원본의 부족한 부분을 더 엄격하게 보완한다.

| 항목 | 원본 22 | v2 업데이트 |
| --- | --- | --- |
| `/workspace/SOUL.md` 모델 | role SOUL source 기반 수동 생성 | 사용자 지정 persona + `runtime-sources/role-souls` source 조합 결과 |
| `mobile-app-dev-team/**` 의미 | runtime surface 분류 필요 | live pod 소비 여부 기준으로 R1/R2/R3/C1 재분류 |
| validator 의미 | registry-aware narrowing 필요 | live runtime enforcement가 아니라 source/authoring/PR guard로 제한 |
| local harness 의미 | broad trigger 과할 수 있음 | OpenClaw live runtime proof 아님을 더 강하게 제한 |
| 일반 governance docs | runtime/pod process docs 등으로 분류 | `/workspace/skills`로 승격되지 않으면 pod runtime 직접 영향 없음 |
| 다음 수정 방향 | registry 생성 | consumed-by-runtime registry + validator/category output + trigger 축소 |

업데이트 관계는 아래와 같다.

```text
원본 22
  |
  +-- "runtime surface registry가 필요하다"
  |
  v
v2
  |
  +-- "registry는 문서 분류표가 아니라 runtime 소비 여부 판정표여야 한다"
  |
  +-- "validator는 pod runtime enforcement가 아니라 source guard다"
  |
  +-- "일반 docs는 /workspace/skills로 승격되지 않으면 runtime 영향이 없다"
```

## 20. 상세 적용성 판정

다음 표는 사용자가 묻는 "이게 실제로 무슨 의미가 있느냐"에 대한 적용성 판정이다.

```text
+--------------------------------------------------------------------------------+
| 적용성 판정 기준                                                               |
+----------------------+---------------------+-----------------------------------+
| 판정                 | 의미                | 예시                              |
+----------------------+---------------------+-----------------------------------+
| 적용 가능            | 실제 source guard   | 09 skill source, 02 role souls     |
| 조건부 적용          | runtime 승격 필요   | governance rule -> SKILL.md 이동   |
| 적용 금지/오해 금지  | live proof 아님     | docs validator로 pod readiness 주장 |
+----------------------+---------------------+-----------------------------------+
```

### 20.1 즉시 적용 가능

다음은 즉시 적용 가능하다.

| 적용 항목 | 이유 | 필요한 검증 |
| --- | --- | --- |
| `runtime-sources/pod-native-openclaw-skills/**` source validation | `/workspace/skills/<slug>`로 sync되는 source | `validate:team-doc`, pod skill shape check, sync smoke |
| `runtime-sources/role-souls/**` source validation | persona와 결합되어 `/workspace/SOUL.md` 생성 material | role SOUL shape, canonical slug, no live-proof overclaim |
| README/source-map validation | active source traceability | `validate:team-doc` |
| secret-like scan | 모든 docs/source에 공통 | `validate:team-doc`, evidence hygiene |
| Codex skill/agent matrix validation | Codex CLI가 실제 사용하는 runtime source와 연결 | runtime artifact validation |

즉시 적용 가능한 영역은 source가 실제 runtime surface로 흘러갈 수 있는 곳이다.

```text
즉시 적용 가능
  |
  +-- source가 /workspace/skills로 sync된다.
  |
  +-- source가 /workspace/SOUL.md 생성에 쓰인다.
  |
  +-- source가 Codex CLI runtime에 쓰인다.
  |
  +-- source map/hygiene이 PR gate 품질을 지킨다.
```

### 20.2 조건부 적용

다음은 조건부 적용이다.

| 항목 | 조건 |
| --- | --- |
| governance 문서를 pod agent rule로 만들기 | 해당 규칙을 `runtime-sources/pod-native-openclaw-skills/<slug>/SKILL.md` 또는 `/workspace/AGENTS.md`로 옮겨야 함 |
| `16-pod-environment-bootstrap.md` 내용을 pod bootstrap rule로 만들기 | `project-bootstrap` skill이나 관련 script에 반영해야 함 |
| evidence policy를 pod agent 행동 규칙으로 만들기 | `codex-role-workflow`, `project-bootstrap`, role-specific pod skill에 반영해야 함 |
| source map/registry를 runtime decision에 쓰기 | pod skill 또는 Codex skill이 명시적으로 읽거나 generated artifact로 변환해야 함 |
| local harness trigger 축소 | registry fixture와 validator coverage를 먼저 추가해야 함 |

조건부 적용 흐름:

```text
일반 문서의 규칙
        |
        v
pod agent가 반드시 따라야 하는가?
        |
        +-- 아니오 ----------------------> docs에 유지, validate:team-doc만 적용
        |
        +-- 예 --------------------------> runtime surface로 승격 필요
                                                |
                                                +-- /workspace/skills source
                                                +-- /workspace/AGENTS.md
                                                +-- /workspace/SOUL.md 생성 계약
                                                +-- .agents/.codex
```

### 20.3 적용 금지 또는 오해 금지

다음은 금지하거나 명확히 오해를 막아야 한다.

| 금지/오해 항목 | 이유 |
| --- | --- |
| `validate:team-doc` PASS를 live pod readiness로 주장 | local repo validation일 뿐 `/workspace` 상태를 증명하지 않음 |
| `test:local-harness` PASS를 OpenClaw pod behavior proof로 주장 | local harness SoT 범위 밖 |
| 일반 governance docs를 pod-native skill처럼 취급 | `/workspace/skills/<slug>` runtime shape가 아님 |
| source map/registry만 만들고 runtime skill을 업데이트하지 않음 | pod agent는 해당 문서를 자동으로 읽지 않음 |
| persona 기반 `/workspace/SOUL.md` 생성 결과를 repo source만으로 증명 | pod 생성 artifact 또는 pod 내부 evidence 필요 |
| hooks가 pod-native OpenClaw agent를 직접 통제한다고 주장 | Codex CLI hooks surface와 OpenClaw pod-native skill surface가 다름 |

금지 관계:

```text
repo validator PASS
        |
        x
live pod ready

governance doc updated
        |
        x
pod agent behavior changed

local harness PASS
        |
        x
/workspace/skills installed
```

## 21. validator를 유지하는 경우의 문구 기준

앞으로 validator 설명 문구는 아래 표현을 사용해야 한다.

권장 표현:

```text
validate-team-doc validates repo-managed source documents and runtime-adjacent
source packages before they are consumed by pod creation, sync, Codex authoring,
or PR gates. It does not prove live pod runtime state.
```

한국어 설명:

```text
팀 문서 검증기는 repo-managed source와 runtime-adjacent source package를 검증한다.
이 검증은 pod 생성, /workspace/skills sync, Codex authoring, PR gate 이전의
source 품질을 지키기 위한 것이다. live pod runtime 상태를 증명하지 않는다.
```

금지 표현:

```text
validate-team-doc proves pod agents will follow these docs.
validate-team-doc proves /workspace/skills is installed.
validate-team-doc proves /workspace/SOUL.md is current.
mobile-app-dev-team governance docs are runtime skills.
```

문구 선택 기준은 아래와 같다.

```text
validator 설명 문구
        |
        +-- source 품질을 말하는가? ----------> 허용
        |
        +-- live /workspace 상태를 말하는가? -> pod evidence 없으면 금지
        |
        +-- Codex authoring guard인가? -------> 허용
        |
        +-- pod behavior enforcement인가? ----> runtime surface 없으면 금지
```

## 22. v2 기준 다음 문서 업데이트 계획

v2가 승인되면 다음 문서 업데이트는 아래 순서가 적절하다.

```text
Step 1
  |
  v
23-runtime-surface-registry.md 생성
  |
  v
Step 2
  |
  v
21 explainer에 v2 한계 반영
  |
  v
Step 3
  |
  v
16 pod bootstrap 문서의 SOUL 생성 설명 정정
  |
  v
Step 4
  |
  v
project-bootstrap SKILL.md에 persona + SOUL source boundary 명확화
  |
  v
Step 5
  |
  v
validate-team-doc output category 설계
  |
  v
Step 6
  |
  v
PROJECT_ENVIRONMENT / CI trigger 축소 계획 반영
```

각 단계의 산출물:

| 단계 | 산출물 | reviewer 관점 |
| --- | --- | --- |
| Step 1 | runtime-consumed registry | path family와 consumed_by_pod가 명확한가 |
| Step 2 | 21 explainer update | background와 decision authority가 분리되는가 |
| Step 3 | 16 bootstrap update | persona 기반 `/workspace/SOUL.md` 모델이 반영되는가 |
| Step 4 | pod skill update | pod agent가 실제로 읽는 surface에 규칙이 들어가는가 |
| Step 5 | validator update | failure category가 runtime relevance를 표시하는가 |
| Step 6 | CI/local harness update | broad trigger 축소가 gate 약화를 만들지 않는가 |

## 23. v2 기준 acceptance criteria

이 v2 보고서는 다음 기준을 만족해야 한다.

- 기존 `22` 문서를 삭제하지 않는다.
- v1의 개선점과 한계를 모두 명시한다.
- `/workspace/SOUL.md`를 사용자 지정 persona + `runtime-sources/role-souls` source 조합 결과로 설명한다.
- `mobile-app-dev-team/**` validator가 live pod runtime enforcement가 아님을 분명히 한다.
- 그래도 validator가 유지될 수 있는 범위를 source guard, persona source guard, Codex authoring guard, PR/hygiene guard로 나눈다.
- 일반 governance docs가 `/workspace/skills/<slug>`로 승격되지 않으면 pod agent runtime에 직접 영향이 없음을 명시한다.
- local harness가 OpenClaw live pod behavior proof가 아님을 명시한다.
- 다음 수정 work unit에서 무엇을 runtime surface로 옮겨야 하는지 제안한다.
- ASCII diagram을 사용해 source, runtime, validator, evidence boundary를 설명한다.
- Reviewer(xhigh) 검토에서 GO를 받아야 한다.

## 24. v2 최종 판단

v2의 최종 결론은 다음이다.

```text
+--------------------------------------------------------------------------------+
| Final Position                                                                  |
+--------------------------------------------------------------------------------+
| mobile-app-dev-team/** 전체를 runtime으로 보는 것은 부정확하다.                  |
| 하지만 mobile-app-dev-team/** 전체를 무의미하다고 보는 것도 부정확하다.          |
|                                                                                |
| 정확한 모델은 path family별 runtime 소비 여부를 나누는 것이다.                  |
+--------------------------------------------------------------------------------+
```

최종 모델:

```text
                         +------------------------------+
                         | mobile-app-dev-team/**       |
                         +------------------------------+
                                      |
              +-----------------------+-----------------------+
              |                       |                       |
              v                       v                       v
     +------------------+    +------------------+    +------------------+
     | R1 runtime source|    | R2 seed input    |    | R3 governance    |
     | 09 pod skills    |    | 02 role souls    |    | docs/reports/map |
     +------------------+    +------------------+    +------------------+
              |                       |                       |
              v                       v                       v
     +------------------+    +------------------+    +------------------+
     | /workspace/skills|    | /workspace/SOUL  |    | PR/source guard  |
     | after sync       |    | at pod creation  |    | no direct runtime|
     +------------------+    +------------------+    +------------------+
```

따라서 다음 문서/validator 업데이트의 목표는 `mobile-app-dev-team/**`를 모두 runtime처럼 보이게 하는 것이 아니다.

목표는 반대로, 실제 runtime에 소비되는 것과 소비되지 않는 것을 명확히 나누는 것이다.

그 구분이 생기면 사용자가 지적한 문제, 즉 "pod agent가 실제로 읽지 않는 문서를 왜 validator하느냐"에 대해 다음과 같이 답할 수 있다.

```text
validator는 pod agent runtime을 직접 통제하려고 존재하는 것이 아니다.
validator는 runtime으로 포장될 source와 Codex authoring source가 깨지지 않게 하는 guard다.
runtime에 직접 영향을 주려면 해당 규칙은 /workspace runtime surface로 승격되어야 한다.
```

이 답변을 기준으로 다음 work unit을 진행해야 한다.
