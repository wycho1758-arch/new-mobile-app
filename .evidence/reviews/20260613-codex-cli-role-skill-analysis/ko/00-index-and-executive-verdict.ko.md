# 역할별 Codex CLI Skill 분석 인덱스와 최종 결론

작성일: 2026-06-13
범위: `mobile-app-dev-team/**`, `.agents/skills/**`, `.codex/agents/**`

## 최종 결론

현재 상태는 **부분 충족(PARTIAL)** 입니다.

이미 갖춰진 기반은 강합니다.

- `mobile-app-dev-team/02-role-souls/` 아래 6개 active SOUL role이 있습니다.
- `.agents/skills/` 아래 repo-local Codex skill이 있습니다.
- `.codex/agents/` 아래 read-only custom agent가 있습니다.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/` 아래 pod-native setup/readiness skill이 있습니다.
- pod 간 handoff 기준인 `docs/plans/work-units/<work-unit-id>/` 구조가 있습니다.

하지만 아직 부족한 핵심은 **독립 pod에서 각 SOUL role이 자기 역할에 맞게 Codex CLI를 어떻게 써야 하는지 알려주는 role-aware 실행 skill**입니다.

현재 pod-native skill은 준비 상태를 확인합니다.

- Codex CLI 인증/설치 상태
- role pod bootstrap 상태
- repo checkout 상태
- Design의 Stitch/ADC 준비 상태
- QA/Release의 EAS robot auth 준비 상태

하지만 다음은 아직 충분히 설명하지 못합니다.

- 내가 Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release 중 어떤 role인지 확인한 뒤 어떤 `.agents/skills`를 써야 하는가
- 어떤 `.codex/agents` reviewer/researcher/advisor를 호출해야 하는가
- 어떤 `docs/plans/work-units/<work-unit-id>/` artifact를 써야 하는가
- 어떤 상황에서 다른 role, reviewer, human gate, deterministic Gatekeeper로 멈춰야 하는가
- pod 간 shared storage가 없을 때 GitHub branch/commit/PR로 어떻게 handoff해야 하는가

따라서 가장 먼저 추가해야 할 것은 아래 pod-native skill입니다.

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md
```

runtime shape:

```text
/workspace/skills/codex-role-workflow/SKILL.md
```

## 필수 Codex 운영 계약

모든 role skill, pod-native bridge, repo-local Codex skill은 다음 기본 프로세스를 명시해야 합니다.

1. 계획 전에 해당 role의 SoT를 먼저 읽습니다. 최소 기준은 `AGENTS.md`, `REPO_OPERATIONS.md`, role SOUL, 관련 work-unit artifact, repo-local skill/agent matrix입니다.
2. 계획 단계는 read-only입니다. 계획 중에는 예측으로 사실을 채우지 않고, 파일 수정도 하지 않습니다.
3. SoT로 확인되지 않는 내용은 `unknown`, `blocked`, `needs owner confirmation`으로 기록합니다. 추측을 계획의 근거로 쓰지 않습니다.
4. 계획은 role 소유권, out-of-role stop, human gate, external proof limit, evidence output, reviewer command/output path를 포함해야 합니다.
5. 계획은 실행 전에 read-only reviewer로 검토하고, reviewer 결과를 사용자에게 보고해야 합니다.
6. 계획 승인 후에만 해당 role의 작업을 실행합니다. 승인된 scope 밖의 구현, 외부 플랫폼 조작, human gate 우회는 하지 않습니다.
7. 작업 완료 후 최종 reviewer로 실제 산출물이 계획과 목적을 충족했는지 확인합니다.
8. 모든 수정이 끝나면 `git diff`와 `git status --short`로 실제 변경이 승인 방향과 일치하는지 확인합니다.
9. 최종 보고에는 변경 요약, reviewer verdict, 검증 명령 결과, diff/status 확인, 남은 risk를 포함합니다.

이 계약은 `codex-role-workflow`의 공통 section으로 들어가야 하고, role-specific repo-local skill은 이 공통 계약을 참조하면서 자기 role의 artifact, reviewer, stop condition을 더 구체화해야 합니다.

Design의 경우 선택된 `DESIGN.md` 또는 `design.md` baseline과 동일 Stitch 프로젝트는 work unit의 Design SoT입니다. 승인되지 않은 design-system drift, 승인 없는 Stitch project fork, baseline metadata 누락은 Mobile App Dev handoff를 막아야 합니다.

## 문서 목록

| 파일 | 목적 |
| --- | --- |
| `00-index-and-executive-verdict.md` | 전체 결론, role matrix, 우선순위 |
| `01-product-planning-codex-use-skill-analysis.md` | Product/Planning 상세 분석 |
| `02-design-codex-use-skill-analysis.md` | Design 상세 분석 |
| `03-mobile-architect-codex-use-skill-analysis.md` | Mobile Architect 상세 분석 |
| `04-mobile-app-dev-codex-use-skill-analysis.md` | Mobile App Dev 상세 분석 |
| `05-backend-api-integrator-codex-use-skill-analysis.md` | Backend/API Integrator 상세 분석 |
| `06-qa-release-codex-use-skill-analysis.md` | QA/Release 상세 분석 |
| `07-cross-role-skill-agent-implementation-recommendation.md` | 실제 skill/agent/validator/eval 구현 권고 |
| `08-reviewer-checklist-and-final-verdict.md` | reviewer 체크리스트와 최종 verdict |

한국어 버전은 같은 디렉터리의 `ko/` 아래에 있습니다.

## Role별 요약

| Role | 현재 상태 | 필요한 조치 |
| --- | --- | --- |
| Product/Planning | `po-*` skill과 reviewer가 충분함 | `codex-role-workflow`로 pod에서 `po-*` 선택과 planning artifact handoff를 강제 |
| Design | `design-*` skill과 `design-reviewer`가 충분함 | `codex-role-workflow`로 P0/P1, Stitch readiness, `01-design/*`, `design-pub-html/*` 연결. 추가로 사용자가 승인한 `DESIGN.md`/`design.md` baseline, 동일 Stitch 프로젝트 확장, manifest metadata, drift blocking을 명시해야 함 |
| Mobile Architect | 전용 repo-local skill 없음 | `mobile-architect-workflow` 추가가 필요하고, pod bridge도 필요 |
| Mobile App Dev | `mobile-app-dev-workflow` 있음 | pod bridge와 `04-mobile-app/*`, tests-first, reviewer handoff 보강 |
| Backend/API Integrator | `mobile-backend-api-integrator-workflow` 있음 | pod bridge와 `03-contract-api/*`, service evidence, rollback/migration path 보강 |
| QA/Release | `e2e-test`, `qa-railway-workflow` 있음 | pod bridge와 release-readiness synthesis skill/reviewer 필요 여부 판단 |

## 구현 우선순위

1. `codex-role-workflow` pod-native skill 추가
2. `mobile-architect-workflow` repo-local Codex skill 추가
3. Design Stitch skill에 `DESIGN.md` baseline 승인, 동일 Stitch 프로젝트 확장, manifest metadata, drift-blocking reviewer check 보강
4. `scripts/validate-team-doc.mjs`에 role mapping 검증 추가
5. `evals/skills/**`에 role별 smoke eval 추가
6. 기존 skill 보강
   - `mobile-app-dev-workflow`
   - `mobile-backend-api-integrator-workflow`
   - `e2e-test`
   - `qa-railway-workflow`
7. 필요 시 custom agent 추가
   - `mobile-architect-reviewer`
   - `qa-release-readiness-reviewer`

## 절대 하지 말아야 할 것

- Gatekeeper SOUL을 만들지 않습니다.
- repo-local Codex skill을 `09-pod-native-openclaw-skills/`에 넣지 않습니다.
- pod-native skill을 `.agents/skills/`에 넣지 않습니다.
- 기존 `po-*`, `design-*`, `wm-*`, QA skill을 중복 재작성하지 않습니다.
- local validation으로 live pod, EAS, Stitch, GitHub branch protection, mobile-mcp, Railway, Jira, Confluence, store submit이 증명됐다고 주장하지 않습니다.
