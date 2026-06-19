# Mobile App Dev Team

이 폴더는 현재 `new-mobile-app` 프로젝트 기준의 관리용 팀 문서이다.
이 폴더의 범위는 team/role/process/reference 문서이며, repo-wide operating
policy의 소유자는 root의 `REPO_OPERATIONS.md`이다.

`team-doc/00-source/`와 `team-doc/10-structured/`는 historical path identifier이다.
Confluence 원본 export, 구조화 참조, `_meta` 감사 기록은 root
`TEAM_DOC_ARCHIVE_MANIFEST.json`와 `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` 기준으로
검증한다. 이 폴더는 실제 운영자가 읽고 유지할 current SoT이다.

## Pod Role Runtime Entrypoint

Actual OpenClaw role pods must not treat this README as a standalone execution
runbook. For pod runtime work, use this required entry chain after clone or
pull:

```text
openclaw-pod-skills-sync -> project-bootstrap -> matching role runtime specification -> codex-role-workflow
```

- `openclaw-pod-skills-sync` copy-syncs the repo-authored pod-native skill source
  from `runtime-sources/pod-native-openclaw-skills/` into the runtime snapshot
  at `/workspace/skills/<slug>/SKILL.md`.
- `project-bootstrap` is the standard readiness entry point. If project-bootstrap is blocked, role work is forbidden.
- After bootstrap is ready, read only the matching role runtime specification,
  then apply `/workspace/skills/codex-role-workflow/SKILL.md` to resolve the
  allowed repo-local Codex skill, reviewer, durable artifact stage, stop
  conditions, and next action.
- Pod-isolated role handoff must use GitHub branch/commit/PR artifacts under
  `docs/plans/work-units/<work-unit-id>/`. Each role artifact must include a
  PRD acceptance line or explicit non-goal reference before downstream
  execution.
- `human-gate/v1` is required for production-submit, payment-money-movement,
  pii-privacy, external-messaging, legal-compliance, business-budget-owner,
  irreversible-scope-tradeoff, and failed-gate-risk decisions. Gatekeeper, reviewer, pod, or LLM role cannot replace human approval.

## 문서 구조

| 파일 | 역할 |
| --- | --- |
| `governance/sot-and-principles.md` | 현재 SoT, 관리 원칙, 금지 사항 |
| `organization/team-composition.md` | 팀 구성과 책임 경계 |
| `runtime-sources/role-souls/` | 6개 LLM 실무자별 SOUL.md 초안 |
| `organization/role-capability-matrix.md` | 역할별 능력, 산출물, 금지 범위 |
| `runtime-sources/codex-skill-agent-matrix.md` | 현재 `.agents/skills`와 `.codex/agents` 매핑 |
| `workflows/Product_Planning_WORKFLOW.md` | 실제 작업 프로세스 |
| `governance/gates-and-evidence.md` | 게이트, 검증, evidence 규칙 |
| `organization/new-team-template-guide.md` | 다른 개발팀 생성 시 재사용 절차 |
| `workflows/github-artifact-workflow.md` | pod-isolated role agent의 GitHub PR 산출물 handoff 규칙 |
| `workflows/native-e2e-strategy.md` | RN Web, EAS/Maestro, human-device/mobile-mcp 증거 사다리와 native 증거 경계 |
| `governance/human-ops-live-readiness-annex.md` | human/ops 승인 뒤에만 가능한 live readiness 작업의 승인·증거·금지 claim annex |
| `runtime-sources/pod-environment-bootstrap.md` | fresh OpenClaw role pod의 `/workspace/projects/Wondermove-Inc/new-mobile-app` zero-to-ready 부트스트랩 순서와 OrbStack pod 설정값 체크리스트 |
| `runtime-sources/orbstack-pod-config-values.md` | 현재 repo SoT에서 확인 가능한 OrbStack role pod 설정 실제값과 owner/operator가 추가 제공해야 하는 누락값 목록 |
| `workflows/entry-case-routing.md` | 진입 케이스 라우팅 taxonomy(공통 intake, SoT 명명 입력 분류, 보고서 파생 C1~C5, 확장 E1~E16)와 Design 관련성/not-applicable(P-1)·동시 work-unit 우선순위(P-2)·긴급 hotfix expedited-but-gated(P-3) 거버넌스 |
| `governance/app-eas-ota-rollback-runbook.md` | 앱/EAS Update(OTA)/store 롤백 ownership·decision·gate·evidence 런북(P-4 거버넌스, 15-annex 롤백 규칙 기반) |
| `reports/team-doc-validator-and-soul-runtime-explainer.md` | 팀 문서 검증기와 role SOUL 문서의 repo-local 검증 범위, pod runtime 관계, local harness 경계 설명 |
| `reports/runtime-surface-classification-improvement-report.md` | 사용자 목표 운영 모델 기준 runtime surface 분류, validator/CI/local-harness 재구성 필요 수정 보고서 |
| `reports/runtime-surface-classification-improvement-report-v2.md` | pod-native runtime 소비 여부 기준으로 22 보고서의 한계와 validator 유효 범위를 재정의한 v2 보고서 |
| `reports/runtime-surface-structure-goal-plan.md` | v2 결론을 구조 기반 rename, validator split, local harness 범위 재정의로 실행하기 위한 goal plan |
| `ref-organization/` | Reference organization 재사용 가이드와 current-project example |
| `source-map.md` | 근거 파일과 active/historical crosswalk |

## 완료/대체된 계획

| Archived plan | Current replacement |
| --- | --- |
| `_archive/completed-plans/ref-organization-goal-plan.md` | `ref-organization/` consolidated section READMEs and `source-map.md` |
| `_archive/completed-plans/pod-organization-e2e-improvement-plan.md` | Repo-local/offline portions are implemented in runtime validators, pod-native skills, `workflows/native-e2e-strategy.md`, `governance/human-ops-live-readiness-annex.md`, and `runtime-sources/pod-environment-bootstrap.md`; live pod/EAS/Maestro/human approval remains evidence-gated. |
| `_archive/historical-inspections/20260609-structure-inspection-sot.md` | `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, and active validators under `scripts/` |
| `_archive/completed-plans/orbstack-pod-config-setup-runbook-plan.md` | `runtime-sources/pod-environment-bootstrap.md` and `runtime-sources/orbstack-pod-config-values.md` |
| `_archive/completed-plans/orbstack-pod-operator-input-request.md` | `runtime-sources/orbstack-pod-config-values.md` |

## 운영 원칙

- 현재 repo 기준 사실은 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `.agents/skills`, `.codex/agents`를 우선한다.
- historical corpus 감사와 migration traceability는 root archive 파일
  `TEAM_DOC_ARCHIVE_MANIFEST.json`와 `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`을 우선한다.
- OpenClaw pod-native skill source는 `runtime-sources/pod-native-openclaw-skills/`에서 관리한다.
- Pod-isolated role agent 산출물은 `workflows/github-artifact-workflow.md`에 따라 GitHub branch/commit/PR과 `docs/plans/work-units/<work-unit-id>/`로 handoff한다.
- Gatekeeper는 non-LLM deterministic required check이다. Gatekeeper SOUL.md는 만들지 않는다.
- Reference organization 문서는 `ref-organization/`에서 관리하며, future team 재사용 가이드와 current-project example을 분리한다.
