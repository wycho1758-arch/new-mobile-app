# Cross-Role Skill And Agent 구현 권고

작성일: 2026-06-13

## 요약

가장 먼저 해야 할 구현은 두 가지입니다.

1. pod-native `codex-role-workflow`
2. repo-local `mobile-architect-workflow`

그 다음 validator/eval을 추가하고, 필요한 경우 기존 skill과 reviewer를 보강합니다.

## 1. pod-native `codex-role-workflow` 추가

추가 위치:

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md
```

runtime shape:

```text
/workspace/skills/codex-role-workflow/SKILL.md
```

목적:

- `project-bootstrap` 이후 role pod가 실제 repo-local Codex skill을 선택하도록 돕습니다.
- `WM_ROLE` 또는 `/workspace/IDENTITY`로 role을 확인합니다.
- checked-out repo에서 `.agents/skills`와 `.codex/agents`를 확인합니다.
- role별 allowed skill, allowed agent, durable artifact stage를 매핑합니다.
- out-of-role work, missing SoT, human gate, failed-gate-risk, secret exposure에서 멈춥니다.

공통 Codex 운영 계약:

1. 모든 role action은 SoT 확인으로 시작합니다. 계획 전에는 `AGENTS.md`, `REPO_OPERATIONS.md`, role SOUL, 관련 work-unit artifact, repo-local skill/agent matrix를 읽습니다.
2. 계획 단계는 read-only입니다. 계획 중에는 파일을 수정하지 않고, 예측으로 사실을 채우지 않습니다.
3. 확인되지 않은 값은 unknown/blocked/needs owner confirmation으로 기록합니다.
4. 계획에는 role boundary, artifact path, 필요한 handoff input, 구체적인 plan packet, reviewer, final reviewer, external proof limit, human gate, verification command, expected diff scope를 포함합니다.
5. 계획은 실행 전에 read-only reviewer로 검토하고 사용자에게 보고합니다.
6. 계획이 승인된 뒤에만 role-owned 작업을 수행합니다.
7. 완료 후 최종 reviewer가 실제 산출물이 계획과 목적을 충족했는지 확인합니다.
8. 마지막에 `git diff`와 `git status --short`로 실제 변경이 승인된 방향과 일치하는지 확인하고 보고합니다.

최소 role matrix:

| Role | 사용할 skill | reviewer/researcher | artifact stage |
| --- | --- | --- | --- |
| Product/Planning | `po-*`, `wm-orchestrate`, `git-workflow` | `po-*`, `wm-docs-researcher` | `00-product-planning`, `07-pr` |
| Design | `design-*`, `wm-orchestrate`, `git-workflow` | `design-*`, `po-*` gate reviewers | `01-design`, `design-pub-html`, 선택된 `DESIGN.md` baseline, 동일 Stitch project, fork/drift evidence |
| Mobile Architect | `mobile-architect-workflow` 추가 후 사용 | `wm-*`, optional `mobile-architect-reviewer` | `02-architecture` |
| Mobile App Dev | `mobile-app-dev-workflow` | `wm-implementation-reviewer`, `wm-contract-reviewer` | `04-mobile-app` |
| Backend/API Integrator | `mobile-backend-api-integrator-workflow` | `wm-contract-reviewer` | `03-contract-api` |
| QA/Release | `e2e-test`, `qa-railway-workflow`, optional readiness workflow | `wm-gate-fix-advisor`, optional readiness reviewer | `05-qa-release` |

## 2. repo-local `mobile-architect-workflow` 추가

추가 위치:

```text
.agents/skills/mobile-architect-workflow/SKILL.md
```

필요한 이유:

Mobile Architect는 active SOUL role인데 전용 repo-local skill이 없습니다. 이 때문에 ADR, route/state impact, API contract co-sign, releaseability risk가 반복 가능한 Codex workflow로 정의되어 있지 않습니다.

필수 workflow:

1. 승인된 work unit 확인
2. architecture trigger 분류
3. SoT 읽기
4. `02-architecture/*` artifact 작성
5. reviewer/researcher routing
6. execution owner handoff
7. implementation/backend/release/human-gate 영역에서 멈춤

## 3. 기존 skill 보강

### Design Stitch skill

보강할 내용:

- 첫 단계에서 사용자 또는 Product/Planning이 `DESIGN.md`/`design.md` baseline을 승인
- continuation work는 승인된 fork reason이 없는 한 동일 Stitch project에서 확장
- manifest metadata: `design_system_baseline`, `design_md_source_path_or_url`, `design_md_hash_or_version`, `stitch_project_id_or_share_link`, `extends_existing_project`, `fork_reason`, `drift_check_result`, `design_reviewer_verdict_path`
- 승인 없는 token, theme, typography, spacing, component shape, brand tone, prompt/output 충돌은 drift stop condition
- missing baseline, mismatched Stitch project, unapproved drift, approved fork evidence에 대한 eval

### `mobile-app-dev-workflow`

보강할 내용:

- approved task requirement
- Design handoff requirement
- `packages/contracts` requirement
- `Codex Implementation Plan Packet`: work-unit id, route/screen/component, selected Design option, state matrix line, API contract/mock/fixture path, architecture note path, first test/eval/fixture, selector/testID impact, non-goals, stop conditions, verification commands, evidence path, plan reviewer path, final reviewer path
- tests-first
- `04-mobile-app/*`
- `status.json`
- branch/PR handoff
- final reviewer 전 Done 금지와 `git diff`/`git status --short` 완료 보고

### `mobile-backend-api-integrator-workflow`

보강할 내용:

- contract-only / fixture / bounded backend service 분류
- `Codex API Contract Plan Packet`: work-unit id, consuming mobile flow, endpoint/method/path, zod schema name, examples, auth/session/error mapping, mocks/fixtures ownership, compatibility assessment, migration/rollback/service evidence, verification commands, evidence path, plan reviewer path, final reviewer path
- `03-contract-api/*`
- migration note
- runtime smoke
- rollback note
- service evidence
- QA/Release handoff
- final reviewer 전 Done 금지와 `git diff`/`git status --short` 완료 보고

### QA/Release

둘 중 하나를 선택합니다.

- `qa-release-readiness-workflow` 추가
- 또는 `e2e-test`, `qa-railway-workflow` 보강 + reviewer 추가

release readiness를 자주 종합해야 한다면 새 workflow가 더 명확합니다.

### 외부 tool 및 prompt 기반 skill 보강

Stitch, EAS, Railway, mobile-mcp, Maestro, Figma 같은 외부 tool을 쓰는 role skill은 단순히 MCP나 CLI 이름만 적으면 부족합니다. skill은 다음을 포함해야 합니다.

- 공식 문서 또는 repo-approved workflow를 확인하는 절차
- 어떤 input/prompt/command로 요구사항을 만들지에 대한 template
- credential/readiness check와 실제 generation/deploy/test proof의 구분
- evidence output path와 reviewer output path
- 실패 시 owner routing
- human gate와 secret exposure stop condition

Design/Stitch는 특히 다음 prompt template 계열을 skill에 넣어야 합니다.

- initial screen generation prompt
- image prompt 또는 existing design iteration prompt
- refinement prompt
- handoff extraction prompt

이 prompt들은 Product/Planning requirement, Design state coverage, NativeWind/RN handoff 제약, accessibility intent, out-of-scope 금지를 포함해야 합니다.
또한 승인된 `DESIGN.md` baseline과 동일 Stitch project/project id/share link를 포함해야 하며, 승인 없는 fork나 design-system drift를 막아야 합니다. eval은 official-doc/source capture, prompt template completeness, missing P0/P1 stop, no HTML extraction before P1, missing baseline stop, mismatched Stitch project stop, unapproved drift stop, approved fork metadata를 포함해야 합니다.

## 4. custom agent 권고

필요 시 추가:

```text
.codex/agents/mobile-architect-reviewer.toml
```

검토 범위:

- ADR quality
- route/state impact
- runtime/dependency policy
- API co-sign
- releaseability risk

필요 시 추가:

```text
.codex/agents/qa-release-readiness-reviewer.toml
```

검토 범위:

- evidence ladder completeness
- `05-qa-release/*`와 canonical evidence link
- failed-check routing
- human-gate status
- release risk summary

## 5. validator/eval 권고

`scripts/validate-team-doc.mjs`가 확인해야 할 것:

- `codex-role-workflow` 존재
- pod-native README에 새 skill 등재
- 정확히 6개 SOUL role만 매핑
- Gatekeeper는 SOUL role이 아님
- `mobile-architect-workflow` 추가 후 matrix 반영
- pod-native path와 repo-local path 혼동 없음
- role별 allowed skill, agent, artifact stage 존재

eval 추가:

- Product/Planning ambiguous intake
- Design missing P0 stop
- Mobile Architect ADR routing
- Mobile App Dev missing Design handoff stop
- Backend/API UI request stop
- QA/Release failed-gate human approval stop

## 검증 명령 기준

실제 skill/agent 구현 이후에는 최소 다음 명령이 필요합니다.

```text
pnpm run validate:team-doc
pnpm run test:runtime
pnpm run test:local-harness
pnpm turbo run lint test
```

이번 분석 package 업데이트의 root PR readiness 기준은 다음입니다.

```text
pnpm run validate:evidence-hygiene
pnpm run test:runtime
pnpm turbo run lint test
```

이후 실제 구현에서 `.agents`, `.codex`, `evals`, hooks, runtime scripts, `mobile-app-dev-team/**` 또는 기타 local-harness trigger runtime path를 변경하면 `pnpm run test:local-harness`도 PR readiness gate에 포함해야 합니다.

## 구현 순서

1. failing validator/eval 먼저 추가
2. `codex-role-workflow` 추가
3. pod-native README 업데이트
4. `mobile-architect-workflow` eval 추가
5. `mobile-architect-workflow` 추가
6. skill/agent matrix 업데이트
7. optional reviewer/QA synthesis 결정
8. validation 실행
9. reviewer 실행
10. branch/PR 진행
