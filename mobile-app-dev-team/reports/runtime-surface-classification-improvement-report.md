# Runtime Surface Classification 개선 보고서

작성일: 2026-06-15

상태: 개선 보고서

대상 범위:
- `mobile-app-dev-team/**` 현재 관리 문서
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**` pod-native OpenClaw skill source
- `.agents/**`, `.codex/**`, `evals/**`, `scripts/**` repo-local Codex runtime 계층
- CI path filter와 local harness trigger 정책
- `scripts/validate-team-doc.mjs`의 책임 범위
- pod runtime evidence와 repo-local validation의 경계

## 1. 요약

이번 검토의 핵심 결론은 간단하다.

현재 repo에는 사용자가 원하는 pod runtime 기반 mobile app dev team을 만들기 위한 재료가 대부분 존재한다. 그러나 이 재료들이 하나의 분류 체계로 정리되어 있지 않다. 그래서 `mobile-app-dev-team/**`가 문서인지, runtime source인지, live pod에 설치되는 결과물인지, local harness 대상인지가 매번 문맥으로 해석되고 있다.

이 문제는 단순 문구 수정으로 해결되지 않는다. `mobile-app-dev-team/**` 아래의 path family를 runtime surface 기준으로 분류하고, 그 분류를 validator, CI, local harness, evidence 규칙이 같이 사용하도록 만들어야 한다.

현재 `21-team-doc-validator-and-soul-runtime-explainer.md`는 유용한 설명 문서다. 하지만 사용자가 원한 것은 "team-doc validator가 왜 필요한가"에 대한 설명만이 아니라, 실제 runtime 팀 구조를 만들기 위해 어떤 문서와 검증 구조를 바꾸어야 하는지에 대한 구조 개선 검토다.

이 보고서는 사용자가 제시한 내용을 "맞는지 틀린지 판정"하는 문서가 아니다. 사용자가 원하는 운영 모델을 목표 상태로 놓고, 현재 repo가 그 목표 상태를 제대로 지지하려면 무엇을 바꾸어야 하는지 정리한 개선 보고서다.

## 2. 사용자가 요구한 목표 운영 모델

사용자가 제시한 방향은 다음과 같이 정리된다.

1. `/workspace/SOUL.md`는 pod가 생성될 때 수동으로 만들어진다.
2. 그 수동 생성의 기준 문서는 현재 repo의 role SOUL 문서다.
3. 예시는 `mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md` 같은 파일이다.
4. live seed injection으로 매번 자동 주입되는 구조를 목표로 하지 않는다.
5. pod runtime에서 즉시 사용 가능한 skill은 `/workspace/skills/<slug>/` 형태다.
6. 실제 repo 작업의 기본 표면은 Codex CLI다.
7. Codex CLI는 `.agents/skills/<skill-name>/SKILL.md`와 `.codex/agents/<agent-name>.toml`을 사용한다.
8. pod는 clone 또는 pull 이후 `openclaw-pod-skills-sync`를 먼저 실행한다.
9. 이 sync는 `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`를 `/workspace/skills/<slug>/`로 copy 또는 overwrite한다.
10. 이 sync 과정에서 pod runtime의 `/workspace/AGENTS.md` surface도 갱신된다.
11. `mobile-app-dev-team/**`는 단순 reference 문서 묶음이 아니다.
12. 이 폴더는 조직, workflow, runtime skill, role boundary를 설계해서 실제 능동적으로 일하는 mobile app dev team을 만들기 위한 source다.

목표 상태를 그림으로 보면 다음과 같다.

```text
                         +--------------------------------------+
                         | 사용자가 원하는 목표 상태            |
                         +--------------------------------------+
                                         |
                                         v
+----------------------+     +-----------------------+     +----------------------+
| current repo source  | --> | pod bootstrap / sync  | --> | live pod runtime     |
+----------------------+     +-----------------------+     +----------------------+
| role SOUL docs       |     | manual SOUL creation  |     | /workspace/SOUL.md   |
| 09 pod skills source |     | openclaw sync         |     | /workspace/skills/*  |
| .agents skills       |     | project-bootstrap     |     | /workspace/AGENTS.md |
| .codex agents        |     | evidence report       |     | active work surface  |
+----------------------+     +-----------------------+     +----------------------+
```

현재 문제는 왼쪽 source와 오른쪽 runtime이 문서상으로는 여러 곳에 흩어져 있고, 중간 bridge의 증거 경계가 한 곳에 정리되어 있지 않다는 점이다.

## 3. 이 보고서에서 사용한 SoT

이번 검토는 아래 repo-local SoT를 기준으로 한다.

| SoT | 이번 보고서에서의 용도 |
| --- | --- |
| `AGENTS.md` | OpenClaw/Codex routing, runtime path, clone/pull 후 sync 규칙, local harness scope, PR gate |
| `PROJECT_ENVIRONMENT.md` | 현재 runtime fact, MCP, pod bootstrap, CI/local harness trigger 관련 사실 |
| `REPO_OPERATIONS.md` | repo-wide policy ownership, OpenClaw/Codex boundary, validator responsibility |
| `.agents/skills/*/SKILL.md` | repo-local Codex skill 계약 |
| `.codex/agents/*.toml` | repo-local custom agent/reviewer 계약 |
| `mobile-app-dev-team/governance/sot-and-principles.md` | managed team doc의 source 우선순위와 관리 원칙 |
| `mobile-app-dev-team/README.md` | current team doc index |
| `mobile-app-dev-team/source-map.md` | active/historical source map |
| `mobile-app-dev-team/ref-organization/runtime-surfaces/README.md` | runtime surface vocabulary |
| `mobile-app-dev-team/ref-organization/gates-evidence-and-audit/README.md` | gate/evidence vocabulary |
| `mobile-app-dev-team/ref-organization/new-organization-template/README.md` | 새 조직 생성 전 runtime surface 분리 원칙 |
| `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md` | pod-native OpenClaw skill source matrix |
| `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md` | `/workspace/skills` copy-sync 책임 |
| `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh` | 실제 copy/overwrite 동작 |
| `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md` | pod bootstrap과 `/workspace/SOUL.md` identity handling |
| `.github/workflows/quality-gate.yml` | 현재 CI trigger와 local harness 조건 |
| `package.json` | `test:runtime`, `test:local-harness` 구성 |
| `scripts/validate-team-doc.mjs` | 현재 team doc validation 책임 |
| `scripts/validate-project-environment.mjs` | CI/environment drift validation |
| `scripts/validate-repo-operations.mjs` | repo operations policy validation |
| `scripts/test-local-harness.mjs` | local harness 구현 범위 |

## 4. 현재 구조의 핵심 문제

현재 구조의 문제는 "문서가 틀렸다"가 아니다. 문제는 분류 기준이 명시적인 machine-readable 또는 최소한 table-driven authority로 존재하지 않는다는 점이다.

현재 해석 흐름은 대략 아래처럼 된다.

```text
                    +-----------------------------+
                    | mobile-app-dev-team/** 변경 |
                    +-----------------------------+
                                  |
                                  v
              +---------------------------------------+
              | 이 변경이 단순 문서인가? runtime인가? |
              +---------------------------------------+
                  |                         |
                  | 문맥으로 추정            | 문맥으로 추정
                  v                         v
       +--------------------+     +-----------------------------+
       | validate-team-doc  |     | local harness / CI trigger  |
       +--------------------+     +-----------------------------+
                  |                         |
                  v                         v
       +--------------------+     +-----------------------------+
       | 용어/shape 검사    |     | runtime gate처럼 취급 가능 |
       +--------------------+     +-----------------------------+
```

이 방식은 다음 문제를 만든다.

- 같은 `mobile-app-dev-team/**` 변경이라도 어떤 것은 reference 문서이고, 어떤 것은 pod runtime skill source다.
- 모든 team doc 변경이 local harness 대상처럼 보일 수 있다.
- 반대로 실제 runtime-affecting source가 일반 문서처럼 약하게 취급될 위험도 있다.
- `/workspace/**`에 실제 설치되었는지 여부와 repo source가 올바른지 여부가 섞인다.
- `validate-team-doc.mjs`가 managed doc validator인지 runtime source validator인지 책임이 넓어진다.
- reviewer가 사용자의 목표 운영 모델을 구조 개선 대상으로 보지 않고 사실 검증 대상으로 오해할 수 있다.

따라서 필요한 것은 새로운 설명 문서 하나가 아니라, runtime surface classification authority다.

## 5. 필요한 분류 체계

목표 구조는 다음과 같이 나뉘어야 한다.

```text
+--------------------------------------------------------------------------------+
| Runtime Surface Classification                                                  |
+-------------------------------+----------------------+-------------------------+
| surface                       | repo source          | runtime/evidence target |
+-------------------------------+----------------------+-------------------------+
| managed organization docs     | mobile-app-dev-team  | repo docs only          |
| role SOUL source material     | runtime-sources/role-souls/*.md   | /workspace/SOUL.md      |
| pod-native skill source       | 09-pod-native-*      | /workspace/skills/*     |
| repo-local Codex skills       | .agents/skills/*     | Codex CLI skill runtime |
| repo-local Codex agents       | .codex/agents/*.toml | Codex CLI agent runtime |
| validators / scripts          | scripts/*.mjs        | local verification      |
| harness fixtures              | evals/**             | local harness evidence  |
| live platform proof           | external systems     | human/external evidence |
+-------------------------------+----------------------+-------------------------+
```

각 surface는 아래 네 가지를 가져야 한다.

1. source path
2. runtime target
3. validator owner
4. evidence boundary

이 네 가지가 없으면 어떤 문서가 어떤 gate를 유발해야 하는지 계속 추정하게 된다.

## 6. 권장 runtime surface registry

새 registry는 별도 파일로 두는 것을 권장한다.

권장 경로:

```text
mobile-app-dev-team/23-runtime-surface-registry.md
```

또는 machine-readable validation을 우선한다면:

```text
mobile-app-dev-team/runtime-surface-registry.json
mobile-app-dev-team/runtime-surface-registry.schema.json
```

초기에는 Markdown table로 시작하고, validator가 필요해지면 JSON 또는 YAML로 분리하는 방식이 현실적이다.

권장 registry shape:

```text
+--------------------+-------------------------------+
| field              | meaning                       |
+--------------------+-------------------------------+
| path_family        | repo-local path pattern       |
| category           | docs / runtime_source / eval  |
| runtime_surface    | none / codex / openclaw / pod |
| runtime_target     | installed or live target path |
| validation_owner   | script or gate owner          |
| harness_policy     | none / runtime / full         |
| evidence_boundary  | local / pod / external        |
| reviewer_owner     | reviewer role                 |
+--------------------+-------------------------------+
```

예시:

```text
+----------------------------------------------+----------------------+-----------------------------+
| path_family                                  | category             | harness_policy              |
+----------------------------------------------+----------------------+-----------------------------+
| mobile-app-dev-team/governance/sot-and-principles.md | managed_doc          | none or doc-validation-only |
| mobile-app-dev-team/runtime-sources/role-souls/*.md       | role_soul_source     | runtime-doc-boundary        |
| mobile-app-dev-team/09-pod-native-*/*        | pod_skill_source     | runtime                     |
| .agents/skills/*/SKILL.md                    | codex_skill_source   | runtime                     |
| .codex/agents/*.toml                         | codex_agent_source   | runtime                     |
| scripts/validate-*.mjs                       | validator            | runtime                     |
| evals/local-harness/**                       | harness_fixture      | runtime                     |
+----------------------------------------------+----------------------+-----------------------------+
```

## 7. `/workspace/SOUL.md`에 대한 정리

사용자 의도에 따르면 `/workspace/SOUL.md`는 live pod 내부의 runtime identity file이다.

repo의 role SOUL 문서는 그 파일의 source material이다.

이 관계는 다음과 같이 문서화되어야 한다.

```text
repo source                                           live pod runtime
-----------                                           ----------------

mobile-app-dev-team/runtime-sources/role-souls/*.md
        |
        | 수동 생성 기준
        v
+---------------------------+
| pod 생성 시 operator/flow |
+---------------------------+
        |
        | manual creation
        v
/workspace/SOUL.md
```

중요한 점:

- repo validation은 `runtime-sources/role-souls/*.md`의 구조와 role boundary를 검증할 수 있다.
- repo validation은 live pod의 `/workspace/SOUL.md`가 실제로 생성되었음을 증명하지 않는다.
- live pod 생성 여부는 pod 내부 evidence가 있어야 한다.
- `project-bootstrap`은 이 구분을 명확히 설명해야 한다.
- `21` 문서도 이 구분을 background로 설명하되, 최종 의사결정은 future registry가 담당해야 한다.

필요 수정 대상:

- `mobile-app-dev-team/runtime-sources/role-souls/*.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/reports/team-doc-validator-and-soul-runtime-explainer.md`
- future `23-runtime-surface-registry.md`

## 8. `/workspace/skills/<slug>/`와 `runtime-sources/pod-native-openclaw-skills`의 관계

사용자 의도에 따르면 pod runtime에서 즉시 실행되는 skill은 `/workspace/skills/<slug>/`다.

repo의 `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`는 그 runtime skill의 source다.

이 관계는 copy/overwrite bridge로 이해해야 한다.

```text
repo checkout
-----------

mobile-app-dev-team/
  runtime-sources/pod-native-openclaw-skills/
    openclaw-pod-skills-sync/
      SKILL.md
      scripts/sync-pod-skills.sh
    project-bootstrap/
      SKILL.md
    <slug>/
      SKILL.md

             |
             | openclaw-pod-skills-sync
             | copy / overwrite
             v

pod runtime
-----------

/workspace/
  skills/
    openclaw-pod-skills-sync/
      SKILL.md
    project-bootstrap/
      SKILL.md
    <slug>/
      SKILL.md
  AGENTS.md
  SOUL.md
```

이 bridge는 registry에서 별도 surface로 다뤄야 한다.

권장 category:

```text
source_to_runtime_bridge
```

필요 필드:

- source authority: `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**`
- runtime target: `/workspace/skills/<slug>/`
- runtime instruction side effect: `/workspace/AGENTS.md`
- sync mode: copy/overwrite
- local proof: source shape validation
- pod proof: sync report 또는 pod 내부 file inventory

## 9. Codex CLI surface와 OpenClaw pod surface 구분

사용자 의도에서 중요한 점은 기본 작업 surface가 Codex CLI라는 것이다.

즉, repo-local 작업은 주로 다음을 사용한다.

```text
.agents/skills/<skill-name>/SKILL.md
.codex/agents/<agent-name>.toml
.codex/hooks.json
.codex/hooks/*
.codex/config.toml
evals/**
scripts/**
```

OpenClaw pod-native skill은 다음 계층이다.

```text
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/SKILL.md
        |
        v
/workspace/skills/<slug>/SKILL.md
```

이 둘을 하나의 "skill"이라는 단어로만 부르면 구조가 흐려진다.

구분 그림:

```text
                         +---------------------------+
                         | repo-local work default   |
                         +---------------------------+
                                      |
                                      v
       +----------------------+   +----------------------+
       | .agents/skills/*     |   | .codex/agents/*.toml |
       | Codex skill source   |   | Codex agent source   |
       +----------------------+   +----------------------+

                         +---------------------------+
                         | pod-native runtime bridge |
                         +---------------------------+
                                      |
                                      v
       +----------------------+   +----------------------+
       | 09-pod-native-*      |-->| /workspace/skills/*  |
       | OpenClaw source      |   | live pod runtime     |
       +----------------------+   +----------------------+
```

필요한 수정:

- `04-skills-and-agents-matrix.md`는 Codex skill, Codex agent, OpenClaw pod-native skill을 같은 표에서 구분해야 한다.
- `runtime-sources/pod-native-openclaw-skills/README.md`는 source/runtime target/evidence boundary를 명시해야 한다.
- `AGENTS.md`의 현재 원칙은 맞지만, future registry가 이 원칙의 분류 authority가 되도록 연결해야 한다.
- reviewer prompt와 local harness fixture도 이 구분을 사용해야 한다.

## 10. `mobile-app-dev-team/**`의 의미 재정의

`mobile-app-dev-team/**`는 단순 reference folder가 아니다.

그러나 모든 파일이 동일한 runtime 영향도를 갖는 것도 아니다.

따라서 다음처럼 내부 등급을 나누어야 한다.

```text
mobile-app-dev-team/
|
+-- managed team docs
|   |
|   +-- 00-sot-and-principles.md
|   +-- 01-team-composition.md
|   +-- 03-role-capability-matrix.md
|   +-- 05-work-processes.md
|   +-- 06-gates-and-evidence.md
|
+-- role identity source
|   |
|   +-- runtime-sources/role-souls/*.md
|
+-- pod-native runtime source
|   |
|   +-- runtime-sources/pod-native-openclaw-skills/<slug>/SKILL.md
|   +-- runtime-sources/pod-native-openclaw-skills/<slug>/scripts/*
|
+-- runtime/pod process docs
|   |
|   +-- 16-pod-environment-bootstrap.md
|   +-- 17-orbstack-pod-config-values.md
|
+-- evidence and governance docs
|   |
|   +-- 14-native-e2e-strategy.md
|   +-- 15-human-ops-live-readiness-annex.md
|   +-- 20-app-eas-ota-rollback-runbook.md
|
+-- source map and registry
    |
    +-- source-map.md
    +-- 22-runtime-surface-classification-improvement-report.md
    +-- future 23-runtime-surface-registry.md
```

이렇게 나누면 다음 질문에 답할 수 있다.

- 이 path는 runtime source인가?
- 이 path는 local harness를 반드시 요구하는가?
- 이 path는 live pod evidence를 요구하는가?
- 이 path는 managed docs validator만으로 충분한가?
- 이 path의 변경은 어떤 reviewer가 봐야 하는가?

## 11. `scripts/validate-team-doc.mjs`의 현재 문제와 개선 방향

현재 validator는 managed doc 일관성에 필요한 일을 하고 있다. 하지만 future 구조에서는 책임을 좁혀야 한다.

현재 느낌:

```text
validate-team-doc.mjs
|
+-- managed docs index check
+-- source map check
+-- role SOUL shape check
+-- skill/agent cross-reference check
+-- pod-native skill source implication
+-- exact wording / policy phrase check
```

권장 구조:

```text
validate:team-doc
|
+-- validate-managed-docs
|   |
|   +-- README index
|   +-- 99-source-map crosswalk
|   +-- no secret / no active-historical confusion
|
+-- validate-role-soul-source
|   |
|   +-- role names
|   +-- heading shape
|   +-- role boundary
|   +-- manual /workspace/SOUL.md source semantics
|
+-- validate-runtime-surface-registry
|   |
|   +-- every path family has category
|   +-- category has harness policy
|   +-- category has evidence boundary
|
+-- validate-pod-native-skill-source
    |
    +-- SKILL.md shape
    +-- scripts allowed path
    +-- sync/runtime target declaration
```

즉, wrapper script 이름은 유지해도 된다.

```text
pnpm run validate:team-doc
```

하지만 내부 책임은 registry 기반으로 나누는 것이 좋다.

필요한 수정:

- `scripts/validate-team-doc.mjs`를 registry-aware하게 변경한다.
- exact prose에 과도하게 의존하지 않는다.
- role SOUL 문서는 live runtime proof가 아니라 source material로 검증한다.
- pod-native skill source는 `09` path category에 한정해 runtime-source rule을 적용한다.
- local harness가 필요한 path를 validator 문맥으로 추정하지 않고 registry에서 읽는다.

## 12. local harness와 CI trigger 재구성

현재 문제는 `mobile-app-dev-team/**`가 너무 넓게 runtime 변경처럼 취급될 가능성이 있다는 점이다.

목표는 local harness를 약화하는 것이 아니다. 목표는 정확하게 적용하는 것이다.

```text
나쁜 방향:

mobile-app-dev-team/** 변경
        |
        v
무조건 local harness

좋은 방향:

changed path
        |
        v
+-----------------------------+
| runtime-surface registry    |
+-----------------------------+
        |
        +-- managed_doc ----------------> validate:team-doc
        |
        +-- role_soul_source -----------> validate:team-doc + runtime boundary check
        |
        +-- pod_skill_source -----------> test:runtime + test:local-harness
        |
        +-- codex_skill_or_agent -------> test:runtime + test:local-harness
        |
        +-- validator_or_harness -------> test:runtime + test:local-harness
```

필요 수정 대상:

- `.github/workflows/quality-gate.yml`
- `PROJECT_ENVIRONMENT.md`
- `scripts/validate-project-environment.mjs`
- `scripts/test-local-harness.mjs`
- future registry fixture

주의점:

- `runtime-sources/pod-native-openclaw-skills/**`는 runtime source이므로 local harness 대상이어야 한다.
- `.agents/**`, `.codex/**`, `evals/**`, `scripts/**`는 계속 runtime 대상이어야 한다.
- ordinary team planning docs는 registry가 허용할 때 local harness가 아니라 managed doc validation으로 충분할 수 있다.
- CI trigger를 좁히기 전에는 반드시 fixture를 먼저 추가해야 한다.

## 13. pod runtime evidence 경계

repo-local validation과 live pod proof를 분리해야 한다.

```text
+-----------------------------+        +-----------------------------+
| repo-local validation       |        | live pod proof              |
+-----------------------------+        +-----------------------------+
| source file exists          |        | /workspace file exists      |
| source shape valid          |        | sync report generated       |
| registry category valid     |        | pod inventory matches       |
| no secret in repo docs      |        | runtime command succeeded   |
| local harness passes        |        | external platform confirms  |
+-----------------------------+        +-----------------------------+
              |                                      |
              | does not prove                       | proves live state only
              v                                      v
       "repo source is ready"                 "pod runtime is ready"
```

이 구분이 없으면 문서가 live pod 준비 상태를 과장할 수 있다.

따라서 다음 문구 원칙이 필요하다.

- "repo source validates"는 local validation claim이다.
- "`/workspace/skills`에 설치됨"은 pod evidence claim이다.
- "`/workspace/SOUL.md`가 존재함"은 pod evidence claim이다.
- "Confluence/Jira/GitHub/EAS state confirmed"는 external platform evidence claim이다.
- local harness는 OpenClaw live runtime을 증명하지 않는다.

## 14. 수정이 필요한 상세 항목

### P0. runtime surface registry 생성

대상:

```text
mobile-app-dev-team/23-runtime-surface-registry.md
```

필요 내용:

- path family별 category
- runtime target
- validation owner
- harness policy
- evidence boundary
- reviewer owner

완료 기준:

- `mobile-app-dev-team/**`의 주요 path family가 모두 분류된다.
- `runtime-sources/pod-native-openclaw-skills/**`가 pod runtime source로 분류된다.
- `runtime-sources/role-souls/*.md`가 `/workspace/SOUL.md`의 manual source material로 분류된다.
- managed doc과 runtime source가 분리된다.

### P0. `21` 문서의 위치 재정의

대상:

```text
mobile-app-dev-team/reports/team-doc-validator-and-soul-runtime-explainer.md
```

필요 내용:

- `21`은 background explainer로 남긴다.
- 최종 action surface는 future registry가 담당한다고 명시한다.
- 사용자의 목표 운영 모델을 fact dispute로 다루지 않는다고 명시한다.

완료 기준:

- reviewer가 `21`만으로 구조 개선이 끝났다고 판단하지 않는다.
- `21`과 `22`와 future `23`의 역할이 분리된다.

### P0. role SOUL 문서 의미 정리

대상:

```text
mobile-app-dev-team/runtime-sources/role-souls/*.md
mobile-app-dev-team/16-pod-environment-bootstrap.md
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md
```

필요 내용:

- role SOUL 문서는 manual source material이다.
- `/workspace/SOUL.md`는 live pod runtime file이다.
- local repo validation은 live pod file creation을 증명하지 않는다.
- pod evidence가 필요한 조건을 문서화한다.

완료 기준:

- live seed injection이 없다는 목표 모델과 충돌하지 않는다.
- pod 생성 시 수동 SOUL 생성 모델을 분명히 지원한다.

### P0. `validate-team-doc` 책임 축소

대상:

```text
scripts/validate-team-doc.mjs
```

필요 내용:

- managed doc validation과 runtime source validation을 registry 기준으로 분리한다.
- exact phrase validation을 줄이고 structured category validation을 늘린다.
- role SOUL은 runtime proof가 아니라 source shape로 검증한다.

완료 기준:

- validator가 문서의 실제 policy를 검증한다.
- validator가 live pod runtime proof를 암시하지 않는다.
- pod-native skill source rule은 `09` category에만 적용된다.

### P1. CI/local harness trigger narrowing

대상:

```text
.github/workflows/quality-gate.yml
PROJECT_ENVIRONMENT.md
scripts/validate-project-environment.mjs
scripts/test-local-harness.mjs
```

필요 내용:

- broad `mobile-app-dev-team/**` trigger를 registry 기반으로 재검토한다.
- runtime-affecting path는 계속 local harness를 요구한다.
- managed-doc-only path는 필요 시 `validate:team-doc` 중심으로 처리한다.
- trigger 변경 전에 fixture를 먼저 추가한다.

완료 기준:

- runtime gate가 약해지지 않는다.
- ordinary docs change가 runtime implementation proof처럼 과장되지 않는다.

### P1. test/fixture 추가

대상 후보:

```text
evals/local-harness/**
scripts/* --self-test fixtures
future registry validation fixtures
```

필요 test case:

- runtime-affecting path는 local harness trigger가 유지된다.
- managed-doc-only path는 registry에 따라 local harness가 생략될 수 있다.
- registry에 없는 `mobile-app-dev-team/**` path는 실패한다.
- live pod proof claim이 pod evidence 없이 작성되면 실패한다.
- `runtime-sources/pod-native-openclaw-skills/**`는 pod runtime source로 유지된다.

완료 기준:

- CI/validator 변경 전에 failing fixture가 먼저 존재한다.
- broad trigger 회귀가 local에서 잡힌다.

### P1. index와 source map 업데이트

대상:

```text
mobile-app-dev-team/README.md
mobile-app-dev-team/source-map.md
REPO_OPERATIONS.md
```

필요 내용:

- `22` 보고서와 future `23` registry를 index한다.
- registry가 authoritative해지면 policy ownership map에 포함한다.
- source map은 active current source와 historical reference를 분리한다.

완료 기준:

- maintainer가 runtime surface decision authority를 쉽게 찾을 수 있다.
- validator가 policy를 발명하지 않고 registry를 소비한다.

## 15. 구현 순서 제안

권장 순서는 다음과 같다.

```text
Step 1
  |
  v
22 보고서를 개선 방향으로 승인
  |
  v
Step 2
  |
  v
23 runtime surface registry 작성
  |
  v
Step 3
  |
  v
registry validation fixture 추가
  |
  v
Step 4
  |
  v
validate-team-doc registry-aware 변경
  |
  v
Step 5
  |
  v
CI/local harness trigger 재구성
  |
  v
Step 6
  |
  v
README / source map / REPO_OPERATIONS 동기화
  |
  v
Step 7
  |
  v
Reviewer(xhigh) + runtime/local-harness 검증
```

이 순서를 지키는 이유는 CI trigger나 validator를 먼저 바꾸면 구조 authority 없이 gate 동작만 바뀌기 때문이다. 먼저 registry를 만들고, 그 registry를 test fixture와 validator가 사용하게 만든 뒤, 마지막에 CI/local harness trigger를 좁혀야 한다.

## 16. reviewer가 다음 work unit에서 확인해야 할 항목

다음 구현 work unit의 review checklist는 아래와 같다.

```text
+-----+--------------------------------------------------------------+
| no. | reviewer check                                               |
+-----+--------------------------------------------------------------+
| 01  | 사용자의 목표 운영 모델을 fact-check 대상이 아니라 target으로 보는가 |
| 02  | /workspace/SOUL.md와 runtime-sources/role-souls source가 분리되는가           |
| 03  | /workspace/skills와 09-pod-native source가 분리되는가            |
| 04  | .agents/skills와 .codex/agents가 OpenClaw skill과 구분되는가     |
| 05  | Codex CLI가 기본 repo-local work substrate로 유지되는가          |
| 06  | openclaw-pod-skills-sync copy/overwrite bridge가 명시되는가      |
| 07  | /workspace/AGENTS.md side effect가 pod evidence로 분리되는가     |
| 08  | validate-team-doc가 registry-aware하게 좁혀지는가                |
| 09  | CI/local harness가 runtime-affecting path를 놓치지 않는가        |
| 10  | managed-doc-only path가 runtime proof처럼 과장되지 않는가        |
| 11  | 변경 전에 test/fixture가 추가되는가                              |
| 12  | README와 99-source-map이 동기화되는가                            |
| 13  | live external platform claim을 local validation으로 대체하지 않는가 |
+-----+--------------------------------------------------------------+
```

## 17. 리스크와 대응

| 리스크 | 영향 | 대응 |
| --- | --- | --- |
| registry가 stale해짐 | validator와 CI가 다시 추정 기반이 됨 | registry completeness check 추가 |
| CI trigger를 너무 좁힘 | runtime-affecting 변경이 local harness를 우회 | runtime source category는 반드시 harness 대상 유지 |
| validator가 문구 기반으로 남음 | 작은 표현 변경이 gate 실패를 유발 | structured field validation으로 이동 |
| live pod claim이 local proof로 둔갑 | 실제 pod 준비 상태를 과장 | pod evidence boundary를 registry에 포함 |
| `mobile-app-dev-team/**` 전체가 reference로 오해됨 | active team runtime 설계 목적이 약해짐 | managed doc과 runtime source를 모두 분류 |
| `09` source와 `/workspace/skills`가 혼동됨 | 설치 상태와 source 상태가 섞임 | copy/overwrite bridge를 별도 category로 분리 |

## 18. 이 보고서가 하지 않는 일

이 보고서는 다음을 하지 않는다.

- CI 동작을 직접 변경하지 않는다.
- validator script를 직접 변경하지 않는다.
- pod-native skill source를 직접 변경하지 않는다.
- role SOUL 내용을 직접 변경하지 않는다.
- live pod runtime state를 증명하지 않는다.
- `/workspace/SOUL.md`가 실제 생성되었다고 주장하지 않는다.
- `/workspace/skills/<slug>/`가 실제 설치되었다고 주장하지 않는다.
- Confluence/Jira/GitHub/EAS 같은 외부 플랫폼 상태를 증명하지 않는다.
- app code 또는 API contract를 변경하지 않는다.

## 19. 이 보고서의 완료 기준

이 보고서는 다음 기준을 만족해야 한다.

- 한국어 보고서 형태로 작성되어 있다.
- 물리적 라인 번호를 맞추기 위한 filler가 없다.
- 이해를 돕기 위한 ASCII diagram을 포함한다.
- 사용자의 목표 운영 모델을 구조 개선 target으로 다룬다.
- SoT 기반으로 현재 repo의 부족한 구조를 설명한다.
- source docs, runtime source, runtime snapshot, evidence boundary를 분리한다.
- `validate-team-doc`의 future narrowing 필요성을 설명한다.
- CI/local harness trigger 재구성 필요성을 설명한다.
- 다음 work unit에서 실제 수정할 path와 순서를 제안한다.
- Reviewer(xhigh)로 최종 확인을 받아야 한다.

## 20. 최종 판단

사용자가 제시한 방향은 현재 repo의 목표 운영 모델로 삼기에 적절하다.

핵심 개선점은 사용자의 사실을 다시 검증하는 것이 아니다. 핵심은 repo가 그 목표 모델을 안정적으로 표현하고 검증하도록 구조를 바꾸는 것이다.

따라서 다음 실제 수정 work unit의 첫 번째 산출물은 runtime surface registry여야 한다. 그 registry가 생긴 뒤에 validator, CI/local harness, pod evidence 문서, README/source-map을 순서대로 맞춰야 한다.

최종 구조는 아래와 같아야 한다.

```text
                 +------------------------------------+
                 | runtime surface registry           |
                 | path family -> category -> policy  |
                 +------------------------------------+
                       |             |             |
                       v             v             v
          +----------------+  +--------------+  +----------------+
          | validators     |  | CI / harness |  | reviewer gates |
          +----------------+  +--------------+  +----------------+
                       |             |             |
                       v             v             v
          +------------------------------------------------------+
          | repo source is validated without overclaiming live pod |
          +------------------------------------------------------+
                                      |
                                      v
          +------------------------------------------------------+
          | pod runtime readiness is proven only with pod evidence |
          +------------------------------------------------------+
```

이 구조가 만들어지면 `mobile-app-dev-team/**`는 단순 reference 묶음이 아니라, 실제 능동적으로 일하는 mobile app dev team을 만드는 source로 유지된다. 동시에 각 path가 어떤 runtime surface에 속하는지 분명해져서 validator와 local harness가 과하거나 부족하게 동작하는 문제를 줄일 수 있다.
