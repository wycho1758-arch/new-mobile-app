# Runtime Surface Structure Goal Plan

작성일: 2026-06-15

상태: 계획서 초안. Reviewer(xhigh) 최종 검토 후 승인 상태를 이 문서와
보고에 반영한다.

소유 역할: Product/Planning with Codex runtime operations

실행 모드: `$wm` SoT-grounded goal plan. 후속 구현은 반드시 tests/evals
first, checkpoint reviewer, final reviewer를 거친다.

관련 보고서:

- `mobile-app-dev-team/reports/runtime-surface-classification-improvement-report.md`
- `mobile-app-dev-team/reports/runtime-surface-classification-improvement-report-v2.md`
- `mobile-app-dev-team/reports/team-doc-validator-and-soul-runtime-explainer.md`

## 0. Goal Skill Contract

이 문서는 단순 제안서가 아니라 후속 실행자가 그대로 사용할 수 있는
goal-plan contract로 작성한다.

```text
goal name:
  runtime-surface-structure-realignment

goal purpose:
  mobile-app-dev-team/** 문서 구조와 validator/harness 범위를
  실제 runtime 소비 표면 기준으로 재정렬한다.

entry command:
  $wm runtime-surface-structure-realignment 실행

allowed executor:
  현재 repo-scoped Codex run

required reviewer:
  wm-implementation-reviewer

required mode:
  tests/evals first
  checkpoint reviewer
  final reviewer

hard stop:
  reviewer NO_GO
  required gate FAIL
  human-gate required
  live pod/external runtime proof를 local validation으로 대체하려는 경우
```

Goal state machine:

```text
draft
  |
  v
reviewed-plan
  |
  v
checkpoint-0-red-fixtures
  |
  v
checkpoint-1-validator-split
  |
  v
checkpoint-2-structure-rename
  |
  v
checkpoint-3-harness-narrowing
  |
  v
checkpoint-4-doc-index-and-crosswalk
  |
  v
final-review
  |
  v
done
```

각 상태는 다음 상태로 자동 이동하지 않는다. 각 checkpoint는 diff, command
output, evidence path, remaining risk, reviewer verdict를 요구한다.

## 1. 목표

이 계획의 목표는 v2 보고서의 결론을 실제 변경 가능한 작업 단위로 바꾸는
것이다.

핵심 목표는 세 가지다.

1. `mobile-app-dev-team/**`를 실제 runtime 소비 표면 기준으로 다시 구조화한다.
2. 숫자 prefix 중심의 파일명과 폴더명을 structure 중심 이름으로 바꾸는
   rename 계획을 만든다.
3. validator/check harness를 "실제로 활용 가능한 문서와 runtime source" 중심으로
   재정의한다.

이 계획은 지금 바로 rename을 수행하지 않는다. 이유는 현재 validator와
runtime source 경로가 숫자 prefix path를 강하게 참조하기 때문이다. 후속
구현은 먼저 failing fixture와 rename-aware validator를 만든 뒤, 단계적으로
path를 이동해야 한다.

```text
잘못된 순서:

  rename 먼저
      |
      v
  validate-team-doc 대량 실패
      |
      v
  어떤 실패가 의도된 실패인지 알 수 없음

올바른 순서:

  RED fixture
      |
      v
  validator split / path registry
      |
      v
  rename
      |
      v
  crosswalk 검증
      |
      v
  harness trigger 축소
```

## 2. SoT 입력

| SoT | 이 계획에서 쓰는 결정 |
| --- | --- |
| `AGENTS.md` | `/workspace/skills/<slug>/SKILL.md`, `/workspace/SOUL.md`, `.agents/skills`, `.codex/agents`, runtime gate와 TDD 요구사항 |
| `PROJECT_ENVIRONMENT.md` | `test:runtime`, conditional `test:local-harness`, Codex runtime path, live platform proof boundary |
| `REPO_OPERATIONS.md` | validator responsibility model, package script composition, OpenClaw/Codex boundary, local validation 한계 |
| `mobile-app-dev-team/reports/runtime-surface-classification-improvement-report-v2.md` | `mobile-app-dev-team/**` validator의 실제 유효 범위와 live pod runtime 한계 |
| `mobile-app-dev-team/reports/team-doc-validator-and-soul-runtime-explainer.md` | team-doc validator와 SOUL source 관계 |
| `mobile-app-dev-team/09-pod-native-openclaw-skills/openclaw-pod-skills-sync/SKILL.md` | repo-authored pod-native skill source가 `/workspace/skills`로 copy-sync되는 bridge |
| `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md` | `/workspace/SOUL.md`에서 canonical role slug를 유도하고 `/workspace/skills`를 사용한다는 runtime 기준 |
| `scripts/validate-team-doc.mjs` | 현재 숫자 path와 managed-doc term check가 강하게 결합된 validator 현황 |
| `scripts/test-local-harness.mjs` | local harness가 Codex runtime 구조와 fixture를 검증하지만 live OpenClaw packaging을 증명하지 않는 현황 |
| `package.json` | active gate composition: `test:runtime`, `validate:team-doc`, `test:local-harness` |

## 3. 핵심 결론

v2 보고서의 결론을 실행 계획으로 바꾸면 다음이 된다.

```text
mobile-app-dev-team/**
  |
  +-- runtime source로 승격되는가?
  |      |
  |      +-- yes: strong validator + smoke/eval 필요
  |      |
  |      +-- no: governance/index/provenance validation만 필요
  |
  +-- live pod가 직접 읽는가?
  |      |
  |      +-- yes: /workspace surface proof 필요
  |      |
  |      +-- no: local doc validator로 runtime claim 금지
  |
  +-- Codex CLI가 직접 쓰는가?
         |
         +-- yes: .agents/.codex/evals/hooks validation 필요
         |
         +-- no: README/source-map/secret/crosswalk 정도만 필요
```

따라서 후속 변경의 결론은 다음이다.

- `mobile-app-dev-team/**` 전체를 동일한 runtime validator 대상으로 보지 않는다.
- 실제 활용 가능한 문서는 "runtime으로 승격되는 source"와 "현재 workflow를
  결정하는 current operational doc"으로 좁힌다.
- 보고서, 과거 계획, reference-only 문서는 runtime gate가 아니라 index,
  source-map, no-secret, stale-claim 방지 대상으로 낮춘다.
- local harness는 Codex runtime과 deterministic fixture를 검증하고,
  `/workspace/skills` live installation proof라고 주장하지 않는다.
- OpenClaw pod-native skill proof가 필요하면 별도 pod-side evidence를 만든다.

## 4. 현재 문제

현재 구조의 문제는 파일 수가 많은 것이 아니다. 문제는 숫자 prefix와
validator check가 문서의 실제 역할을 숨긴다는 점이다.

현재 top-level은 다음처럼 보인다.

```text
mobile-app-dev-team/
  00-sot-and-principles.md
  01-team-composition.md
  02-role-souls/
  03-role-capability-matrix.md
  04-skills-and-agents-matrix.md
  05-work-processes.md
  06-gates-and-evidence.md
  07-new-team-template-guide.md
  09-pod-native-openclaw-skills/
  10-github-artifact-workflow.md
  14-native-e2e-strategy.md
  15-human-ops-live-readiness-annex.md
  16-pod-environment-bootstrap.md
  17-orbstack-pod-config-values.md
  19-entry-case-routing.md
  20-app-eas-ota-rollback-runbook.md
  21-team-doc-validator-and-soul-runtime-explainer.md
  22-runtime-surface-classification-improvement-report.md
  22-runtime-surface-classification-improvement-report-v2.md
  99-source-map.md
```

이 구조는 연대기나 작성 순서는 보여주지만, 다음 질문에 바로 답하지 못한다.

- pod runtime으로 승격되는 source는 어디인가?
- Codex CLI runtime source는 어디인가?
- current workflow를 실제로 결정하는 문서는 어디인가?
- 보고서/계획/참고 문서는 어디까지 validator 대상인가?
- `99-source-map.md`가 왜 가장 마지막 번호인지, 실제 중요도는 어떤지?

문제의 핵심 그림:

```text
번호 prefix
   |
   v
작성 순서처럼 보임
   |
   v
runtime 중요도처럼 오해됨
   |
   v
validator가 넓은 문서 존재/문구 확인으로 커짐
   |
   v
live pod 실행 proof와 repo-local authoring guard가 섞임
```

## 5. 목표 구조

후속 구현에서 목표로 삼을 구조는 다음이다.

```text
mobile-app-dev-team/
  README.md
  source-map.md

  governance/
    sot-and-principles.md
    gates-and-evidence.md
    human-ops-live-readiness-annex.md
    app-eas-ota-rollback-runbook.md

  organization/
    team-composition.md
    role-capability-matrix.md
    new-team-template-guide.md

  runtime-sources/
    role-souls/
      product-planning-soul.md
      design-soul.md
      mobile-architect-soul.md
      mobile-app-dev-soul.md
      backend-api-integrator-soul.md
      qa-release-soul.md
    codex-skill-agent-matrix.md
    pod-environment-bootstrap.md
    orbstack-pod-config-values.md
    pod-native-openclaw-skills/
      <slug>/SKILL.md

  workflows/
    work-processes.md
    github-artifact-workflow.md
    native-e2e-strategy.md
    entry-case-routing.md

  reports/
    team-doc-validator-and-soul-runtime-explainer.md
    runtime-surface-classification-improvement-report.md
    runtime-surface-classification-improvement-report-v2.md
    runtime-surface-structure-goal-plan.md

  ref-organization/
    orientation-and-sot/
    organization-model/
    runtime-surfaces/
    role-contracts-and-capabilities/
    workflows-and-handoffs/
    skills-agents-and-tools/
    gates-evidence-and-audit/
    repo-template-and-runtime/
    new-organization-template/
    source-map-and-migration/

  _archive/
    completed-plans/
    historical-inspections/
    preconsolidation/
```

이 구조의 의도:

```text
governance/       운영 정책과 gate 설명
organization/     팀/역할 모델
runtime-sources/  runtime으로 승격될 수 있는 source material
workflows/        실제 작업 흐름과 handoff
reports/          분석/개선 보고서, 실행 source 아님
ref-organization/ 재사용 가능한 template/reference
_archive/         완료/대체/역사 자료
source-map.md     전체 source/crosswalk index
```

## 6. Rename Crosswalk

이 표는 후속 구현에서 적용할 rename의 기준이다. 실제 구현은 한 번에 하지
않고 checkpoint별로 나눈다.

### 6.1 Top-level current docs

| 현재 path | 목표 path | surface class | validator 강도 |
| --- | --- | --- | --- |
| `00-sot-and-principles.md` | `governance/sot-and-principles.md` | current governance | medium |
| `01-team-composition.md` | `organization/team-composition.md` | current organization | medium |
| `02-role-souls/` | `runtime-sources/role-souls/` | SOUL seed/source input | strong |
| `03-role-capability-matrix.md` | `organization/role-capability-matrix.md` | role boundary | medium |
| `04-skills-and-agents-matrix.md` | `runtime-sources/codex-skill-agent-matrix.md` | Codex runtime source map | strong |
| `05-work-processes.md` | `workflows/work-processes.md` | current workflow | medium |
| `06-gates-and-evidence.md` | `governance/gates-and-evidence.md` | gate/evidence governance | medium |
| `07-new-team-template-guide.md` | `organization/new-team-template-guide.md` | template guide | low/medium |
| `09-pod-native-openclaw-skills/` | `runtime-sources/pod-native-openclaw-skills/` | pod-native runtime source | strong |
| `10-github-artifact-workflow.md` | `workflows/github-artifact-workflow.md` | durable handoff workflow | medium |
| `14-native-e2e-strategy.md` | `workflows/native-e2e-strategy.md` | QA evidence workflow | medium |
| `15-human-ops-live-readiness-annex.md` | `governance/human-ops-live-readiness-annex.md` | human/ops gate annex | medium |
| `16-pod-environment-bootstrap.md` | `runtime-sources/pod-environment-bootstrap.md` | pod bootstrap source docs | strong |
| `17-orbstack-pod-config-values.md` | `runtime-sources/orbstack-pod-config-values.md` | pod config value handoff | medium |
| `19-entry-case-routing.md` | `workflows/entry-case-routing.md` | role routing workflow | strong/medium |
| `20-app-eas-ota-rollback-runbook.md` | `governance/app-eas-ota-rollback-runbook.md` | rollback/human gate | medium |
| `21-team-doc-validator-and-soul-runtime-explainer.md` | `reports/team-doc-validator-and-soul-runtime-explainer.md` | report/explainer | low |
| `22-runtime-surface-classification-improvement-report.md` | `reports/runtime-surface-classification-improvement-report.md` | report | low |
| `22-runtime-surface-classification-improvement-report-v2.md` | `reports/runtime-surface-classification-improvement-report-v2.md` | report | low |
| `runtime-surface-structure-goal-plan.md` | `reports/runtime-surface-structure-goal-plan.md` | report/goal plan | low |
| `99-source-map.md` | `source-map.md` | index/crosswalk SoT | strong for index, not runtime proof |

### 6.2 Ref organization subfolders

| 현재 path | 목표 path | 이유 |
| --- | --- | --- |
| `ref-organization/00-orientation-and-sot/` | `ref-organization/orientation-and-sot/` | 숫자 제거, 의미 유지 |
| `ref-organization/01-organization-model/` | `ref-organization/organization-model/` | 숫자 제거 |
| `ref-organization/02-runtime-surfaces/` | `ref-organization/runtime-surfaces/` | 숫자 제거 |
| `ref-organization/03-role-contracts-and-capabilities/` | `ref-organization/role-contracts-and-capabilities/` | 숫자 제거 |
| `ref-organization/04-workflows-and-handoffs/` | `ref-organization/workflows-and-handoffs/` | 숫자 제거 |
| `ref-organization/05-skills-agents-and-tools/` | `ref-organization/skills-agents-and-tools/` | 숫자 제거 |
| `ref-organization/06-gates-evidence-and-audit/` | `ref-organization/gates-evidence-and-audit/` | 숫자 제거 |
| `ref-organization/07-repo-template-and-runtime/` | `ref-organization/repo-template-and-runtime/` | 숫자 제거 |
| `ref-organization/08-new-organization-template/` | `ref-organization/new-organization-template/` | 숫자 제거 |
| `ref-organization/99-source-map-and-migration/` | `ref-organization/source-map-and-migration/` | `99` 제거, crosswalk 역할 명시 |

### 6.3 Archive subfolders

| 현재 path | 목표 path | 이유 |
| --- | --- | --- |
| `_archive/08-role-title-update-plan.md` | `_archive/completed-plans/role-title-update-plan.md` | 완료 계획 분류 |
| `_archive/09-pod-native-openclaw-skill-plan.md` | `_archive/completed-plans/pod-native-openclaw-skill-plan.md` | 완료 계획 분류 |
| `_archive/11-openclaw-codex-completion-hooks-plan.md` | `_archive/completed-plans/openclaw-codex-completion-hooks-plan.md` | 완료 계획 분류 |
| `_archive/12-ref-organization-goal-plan.md` | `_archive/completed-plans/ref-organization-goal-plan.md` | 완료 계획 분류 |
| `_archive/13-pod-organization-e2e-improvement-plan.md` | `_archive/completed-plans/pod-organization-e2e-improvement-plan.md` | 완료 계획 분류 |
| `_archive/18-orbstack-pod-config-setup-runbook-plan.md` | `_archive/completed-plans/orbstack-pod-config-setup-runbook-plan.md` | 완료 계획 분류 |
| `_archive/20260609-structure-inspection-sot.md` | `_archive/historical-inspections/20260609-structure-inspection-sot.md` | 감사/inspection 분류 |
| `_archive/orbstack-pod-operator-input-request.md` | `_archive/completed-plans/orbstack-pod-operator-input-request.md` | 완료/대체 자료 분류 |
| `_archive/ref-organization-preconsolidation-20260612/` | `_archive/preconsolidation/ref-organization-20260612/` | preconsolidation 묶음 |

## 7. `99-source-map` 결정

`99-source-map.md`는 숫자를 제거하는 방향이 기본안이다.

```text
현재:
  99-source-map.md

목표:
  source-map.md
```

이유:

- source map은 낮은 중요도의 appendix가 아니다.
- 현재 구조에서는 전체 path authority와 crosswalk를 제공한다.
- 숫자 `99`는 "마지막 참고자료"처럼 보이지만 실제로는 구조 변경의 핵심
  SoT이다.
- 숫자 ordering을 쓰지 않는 목표 구조에서는 `source-map.md`가 가장 명확하다.

fallback안:

```text
만약 후속 reviewer가 숫자 prefix를 반드시 유지해야 한다고 판단하면:
  00-source-map.md
```

하지만 이 fallback은 임시안이다. 최종 목표는 숫자 제거다.

## 8. Validator 재정의

현재 `scripts/validate-team-doc.mjs`는 너무 많은 책임을 가진다.

현재 상태:

```text
validate-team-doc.mjs
  |
  +-- managed docs existence
  +-- role SOUL heading validation
  +-- pod-native skill docs validation
  +-- ref-organization structure validation
  +-- source-map/crosswalk validation
  +-- no-secret scan
  +-- runtime spec term checks
  +-- archived plan crosswalk checks
```

목표 상태:

```text
scripts/
  validate-team-doc.mjs
      = composition wrapper

  validate-team-doc-structure.mjs
      = allowed folders, path registry, no numeric drift, source-map links

  validate-runtime-sources.mjs
      = role-souls, pod-native skills, codex skill/agent matrix

  validate-workflow-docs.mjs
      = workflow docs with current process invariants

  validate-governance-docs.mjs
      = gates, evidence, human-gate, rollback invariants

  validate-reference-docs.mjs
      = ref-organization and archive crosswalk
```

Package script 목표:

```json
{
  "validate:team-doc": "node scripts/validate-team-doc.mjs",
  "validate:team-doc:structure": "node scripts/validate-team-doc-structure.mjs",
  "validate:runtime-sources": "node scripts/validate-runtime-sources.mjs",
  "validate:workflow-docs": "node scripts/validate-workflow-docs.mjs",
  "validate:governance-docs": "node scripts/validate-governance-docs.mjs",
  "validate:reference-docs": "node scripts/validate-reference-docs.mjs"
}
```

`validate:team-doc` wrapper는 위 validator들을 명시적으로 호출한다. 중요한 점은
monolithic validator를 단순히 쪼개는 것이 아니라, surface별 fail message와
gate 의미를 다르게 만드는 것이다.

## 9. Harness 재정의

`test:local-harness`는 유지한다. 하지만 의미를 바꿔 말해야 한다.

유지되는 의미:

```text
Codex CLI runtime structure
role boundary fixture
custom agent contract
hook config
deterministic work-unit behavior
local headless smoke
```

제거해야 할 암시:

```text
/workspace/skills live installation proof
actual OpenClaw pod execution proof
live /workspace/SOUL.md content proof
external platform readiness proof
```

후속 변경에서 해야 할 일:

- `evals/local-harness/README.md`에 v2 결론을 반영한다.
- `scripts/test-local-harness.mjs`의 stage 이름과 failure message가 live pod proof처럼 보이지 않게 한다.
- OpenClaw packaging proof는 local harness가 아니라 별도 optional pod-side report로 분리한다.
- `test:local-harness` trigger는 `.agents/**`, `.codex/**`, `evals/local-harness/**`,
  runtime scripts 변경일 때만 required로 둔다.
- `mobile-app-dev-team/reports/**`만 바뀐 경우에는 `validate:team-doc`,
  `validate:evidence-hygiene`, `git diff --check`가 기본이며 local harness는
  source-backed not-applicable이 가능해야 한다.

## 10. 실제 활용 가능한 문서 정의

이 계획에서 "실제 활용 가능한 문서"는 다음 중 하나를 만족해야 한다.

```text
1. live runtime surface로 생성/복사/동기화되는 source
2. Codex CLI runtime artifact와 직접 매핑되는 source
3. current workflow/gate/handoff 판단에 쓰이는 operational doc
4. validator가 실제로 검사하는 source map/crosswalk
```

분류:

| class | 의미 | 예시 | validator |
| --- | --- | --- | --- |
| R1 | pod-native runtime source | `runtime-sources/pod-native-openclaw-skills/<slug>/` | strong |
| R2 | SOUL seed/source input | `runtime-sources/role-souls/*.md` | strong |
| C1 | Codex runtime source map | `runtime-sources/codex-skill-agent-matrix.md`, `.agents/**`, `.codex/**` | strong |
| W1 | current workflow | `workflows/entry-case-routing.md` | medium/strong |
| G1 | governance/gate | `governance/gates-and-evidence.md` | medium |
| I1 | index/crosswalk | `source-map.md` | strong as index |
| P1 | reports/plans | `reports/*.md` | low |
| H1 | archive/reference | `_archive/**`, `ref-organization/**` | low/medium |

validator 강도는 다음처럼 해석한다.

```text
strong:
  누락/불일치가 runtime source 또는 routing 계약을 깨뜨릴 수 있음

medium:
  workflow/gate 설명 drift를 막지만 live runtime을 직접 증명하지 않음

low:
  no-secret, source-map, stale-overclaim 방지 중심
```

## 11. Checkpoint Plan

### Checkpoint 0. Plan Approval

목적:

- 이 계획서가 v2 보고서와 사용자의 의도에 맞는지 승인받는다.

작업:

- 이 goal plan 문서를 작성한다.
- README와 source-map에 계획서 path를 색인한다.
- `validate:team-doc`, `test:runtime`, diff check를 실행한다.
- Reviewer(xhigh)로 최종 검토한다.

Exit criteria:

- Reviewer verdict `GO`.
- 계획서가 path rename, validator split, harness boundary를 모두 다룬다.
- 실제 rename은 아직 수행하지 않는다.

### Checkpoint 1. RED fixtures and structure registry

목적:

- rename 전에 실패해야 할 규칙을 먼저 만든다.

후속 변경 대상:

- `evals/team-doc-structure/fixtures/`
- `scripts/validate-team-doc-structure.mjs`
- `scripts/validate-team-doc.mjs`
- `package.json`

RED fixture:

```text
invalid:
  - top-level 숫자 prefix 신규 추가
  - source-map 누락
  - runtime source가 reports/ 아래 존재
  - pod-native skill source가 runtime-sources 밖에만 존재
  - archived completed plan이 top-level current doc으로 남아 있음

valid:
  - 목표 구조 registry
  - source-map crosswalk
  - legacy compatibility window
```

Gate:

- 새 RED fixture가 기존 구조에서 의도한 실패를 보이거나, legacy window가
  명시된 상태로 통과해야 한다.
- Reviewer가 "rename 전에 validator가 실패 의미를 설명한다"고 확인해야 한다.

### Checkpoint 2. Validator split

목적:

- `validate-team-doc.mjs`를 surface별 validator wrapper로 바꾼다.

후속 변경 대상:

- `scripts/validate-team-doc.mjs`
- `scripts/validate-team-doc-structure.mjs`
- `scripts/validate-runtime-sources.mjs`
- `scripts/validate-workflow-docs.mjs`
- `scripts/validate-governance-docs.mjs`
- `scripts/validate-reference-docs.mjs`
- `package.json`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`

원칙:

- 기존 gate strength를 제거하지 않는다.
- check를 제거할 때는 "live runtime proof가 아니므로 demote" 같은 이유와
  reviewer evidence가 필요하다.
- pod-native skill, role SOUL, Codex skill/agent matrix 검증은 약화하지 않는다.

Gate:

- `node --check scripts/*.mjs`
- `pnpm run validate:team-doc`
- `pnpm run test:runtime`
- Reviewer checkpoint GO

### Checkpoint 3. Structure rename

목적:

- 숫자 prefix 중심 path를 structure 중심 path로 이동한다.

후속 변경 대상:

- `mobile-app-dev-team/**`
- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `scripts/**`
- `evals/**`
- `.agents/skills/**` 중 path 참조가 있는 문서
- `.codex/agents/**` 중 path 참조가 있는 문서
- `docs/plans/work-units/**` 중 current path를 인용하는 durable docs

주의:

- `runtime-sources/pod-native-openclaw-skills/` rename은 가장 위험한 변경이다.
- `openclaw-pod-skills-sync`가 새 path를 source root로 쓰도록 바뀌기 전에는
  기존 `09-pod-native-openclaw-skills/`를 제거하면 안 된다.
- compatibility window 동안에는 old path와 new path 중 하나를 canonical로
  정하고 source-map에 명시한다.

권장 순서:

```text
3-A: reports/ 이동
3-B: governance/organization/workflows/ 이동
3-C: ref-organization/ 숫자 제거
3-D: archive/ 재분류
3-E: role-souls/ 이동
3-F: pod-native-openclaw-skills/ 이동
```

`3-E`와 `3-F`는 runtime source이므로 반드시 별도 reviewer checkpoint가 필요하다.

Gate:

- `pnpm run validate:team-doc`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `bash evals/skills/openclaw-pod-skills-sync-smoke.sh`
- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
- Reviewer checkpoint GO

### Checkpoint 4. Harness narrowing

목적:

- local harness가 실제로 검증하는 것만 required gate로 남긴다.

후속 변경 대상:

- `evals/local-harness/README.md`
- `scripts/test-local-harness.mjs`
- `.github/workflows/quality-gate.yml`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `package.json`

변경 방향:

```text
runtime scripts / .agents / .codex / evals/local-harness 변경:
  test:local-harness required

mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills 변경:
  targeted pod-native smoke + test:runtime required
  local harness는 변경 내용이 Codex runtime에 닿는 경우만 required

mobile-app-dev-team/reports 변경:
  validate:team-doc + evidence hygiene + diff check
  local harness not-applicable 가능

mobile-app-dev-team/ref-organization 변경:
  validate:reference-docs + validate:team-doc
  local harness not-applicable 가능
```

Gate:

- project-environment fixtures update
- quality-gate workflow path detection fixture update
- `pnpm run validate:project-environment`
- `pnpm run test:runtime`
- Reviewer checkpoint GO

### Checkpoint 5. Source map and crosswalk finalization

목적:

- `source-map.md`가 모든 old-to-new path와 runtime class를 설명하게 한다.

후속 변경 대상:

- `mobile-app-dev-team/source-map.md`
- `mobile-app-dev-team/README.md`
- `mobile-app-dev-team/ref-organization/source-map-and-migration/README.md`
- `TEAM_DOC_ARCHIVE_MANIFEST.json` / `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`는
  historical archive source를 바꿀 때만 포함한다.

필수 section:

```text
Current Repo Sources
Runtime Surface Classes
Old-To-New Rename Crosswalk
Validator Responsibility Crosswalk
Harness Applicability Crosswalk
Historical/Archive Crosswalk
External Proof Boundary
```

Gate:

- source-map validator
- archive validator if archive paths changed
- `pnpm run test:runtime`
- Reviewer final GO

## 12. Required Tests And Commands

Checkpoint별 최소 명령:

| Checkpoint | Required commands |
| --- | --- |
| 0 | `pnpm run validate:team-doc`, `pnpm run test:runtime`, `git diff --check && git diff --cached --check` |
| 1 | `node --check scripts/validate-team-doc-structure.mjs`, targeted fixture command, `pnpm run validate:team-doc` |
| 2 | `node --check scripts/*.mjs`, `pnpm run validate:team-doc`, `pnpm run test:runtime` |
| 3 | `pnpm run validate:team-doc`, `pnpm run test:runtime`, `pnpm run test:local-harness`, targeted pod-native smoke |
| 4 | `pnpm run validate:project-environment`, `pnpm run test:runtime`, conditional `pnpm run test:local-harness` |
| 5 | `pnpm run test:runtime`, `pnpm run validate:team-doc-archive` if archive paths changed, final reviewer |

Full final verification:

```sh
pnpm run validate:team-doc
pnpm run validate:repo-operations
pnpm run validate:project-environment
pnpm run validate:evidence-hygiene
pnpm run test:runtime
pnpm run test:local-harness
git diff --check
```

`pnpm turbo run lint test`는 executable workspace code가 바뀌지 않으면
not-applicable로 둘 수 있다. 하지만 package script나 repo-wide gate를 바꾸는
checkpoint에서는 reviewer가 요구할 수 있다.

## 13. Human Gate And External Boundary

이 계획은 repo-local docs/scripts/harness 변경 계획이다.

필요 없는 human gate:

- 단순 문서 구조 rename
- repo-local validator split
- local harness trigger 문구 정리
- source-map crosswalk 업데이트

필요할 수 있는 human gate:

- live `/workspace/SOUL.md` 생성 방식 자체 변경
- live OpenClaw pod image, pod template, `/workspace/AGENTS.md` 배포 방식 변경
- external platform/runtime repository 변경
- Confluence live publish/update
- GitHub branch protection required-check policy 변경

명확한 금지:

```text
local validator PASS
  != live pod runtime proof

local harness PASS
  != /workspace/skills 설치 proof

source-map updated
  != external platform state updated
```

## 14. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| `09-pod-native-openclaw-skills` rename으로 skill sync 깨짐 | High | compatibility window, smoke first, reviewer checkpoint |
| `02-role-souls` rename으로 `/workspace/SOUL.md` seed 설명 drift | High | role-souls validator 유지, project-bootstrap docs update |
| monolithic validator split 중 gate 약화 | Medium | 기존 term checks를 surface별로 이동하고 coverage fixture 추가 |
| source-map rename으로 cross-reference 누락 | Medium | old-to-new crosswalk validator |
| local harness demotion이 gate 약화로 보임 | Medium | applicability matrix와 reviewer evidence로 not-applicable 조건 명시 |
| reports 이동 후 과거 evidence 링크 깨짐 | Low/Medium | source-map old path crosswalk와 archive note 유지 |

## 15. Done Criteria

후속 구현이 완료되려면 다음을 만족해야 한다.

- 숫자 prefix 기반 current top-level docs가 structure-based path로 이동되어야 한다.
- `99-source-map.md`는 `source-map.md` 또는 reviewer-approved 중요도 기반 이름으로 바뀌어야 한다.
- `validate-team-doc.mjs`는 surface별 validator composition wrapper가 되어야 한다.
- runtime source 검증은 유지 또는 강화되어야 한다.
- reports/reference docs는 live runtime proof로 과장되지 않아야 한다.
- local harness applicability가 명시되어야 한다.
- README와 source-map이 old-to-new path를 설명해야 한다.
- 모든 applicable gates가 PASS여야 한다.
- Reviewer(xhigh) final GO가 있어야 한다.

## 16. Reviewer Plan

Checkpoint 0 reviewer question:

```text
이 goal plan이 v2 보고서의 결론을 후속 구현 가능한 구조/validator/harness
변경 계획으로 충분히 바꾸었는가?

특히:
  - 숫자 prefix 제거/rename 계획이 충분한가?
  - 99-source-map 처리 방향이 명확한가?
  - validator와 local harness의 실제 유효 범위가 SoT 기준으로 맞는가?
  - runtime source path rename의 위험과 gate가 충분한가?
  - 후속 구현이 tests/evals first로 진행 가능하게 되어 있는가?
```

Reviewer evidence:

```text
.evidence/reviews/20260615-runtime-surface-structure-goal-plan-xhigh.md
```

## 17. 현재 계획의 제한

이 문서는 계획서다. 현재 turn에서는 다음을 하지 않는다.

- `mobile-app-dev-team/**` 실제 rename
- `scripts/validate-team-doc.mjs` split implementation
- `package.json` gate 변경
- `.github/workflows/quality-gate.yml` 변경
- live `/workspace/skills` 또는 `/workspace/SOUL.md` 확인
- Confluence publish/update
- external OpenClaw platform/runtime repository 변경

이 제한은 의도적이다. rename과 validator split은 대규모 blast radius가 있으므로
후속 구현에서 RED fixture와 checkpoint reviewer를 먼저 통과해야 한다.

## 18. 결론

이 계획의 결론은 단순한 문서 정리가 아니다.

```text
v2 보고서
  |
  v
runtime surface 기준 분류
  |
  v
structure 기반 path rename
  |
  v
surface별 validator split
  |
  v
local harness applicability 축소
  |
  v
실제 활용 가능한 문서와 runtime source만 강하게 검증
```

따라서 후속 구현의 방향은 다음 한 문장으로 요약된다.

`mobile-app-dev-team/**`를 숫자 순서 문서 묶음에서 runtime-source,
workflow, governance, report, reference archive로 분리하고, validator와 harness를
그 분류에 맞게 다시 작성한다.
