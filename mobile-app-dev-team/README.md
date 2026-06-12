# Mobile App Dev Team

이 폴더는 현재 `new-mobile-app` 프로젝트 기준의 관리용 팀 문서이다.
이 폴더의 범위는 team/role/process/reference 문서이며, repo-wide operating
policy의 소유자는 root의 `REPO_OPERATIONS.md`이다.

`team-doc/00-source/`와 `team-doc/10-structured/`는 historical path identifier이다.
Confluence 원본 export, 구조화 참조, `_meta` 감사 기록은 root
`TEAM_DOC_ARCHIVE_MANIFEST.json`와 `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` 기준으로
검증한다. 이 폴더는 실제 운영자가 읽고 유지할 current SoT이다.

## 문서 구조

| 파일 | 역할 |
| --- | --- |
| `00-sot-and-principles.md` | 현재 SoT, 관리 원칙, 금지 사항 |
| `01-team-composition.md` | 팀 구성과 책임 경계 |
| `02-role-souls/` | 6개 LLM 실무자별 SOUL.md 초안 |
| `03-role-capability-matrix.md` | 역할별 능력, 산출물, 금지 범위 |
| `04-skills-and-agents-matrix.md` | 현재 `.agents/skills`와 `.codex/agents` 매핑 |
| `05-work-processes.md` | 실제 작업 프로세스 |
| `06-gates-and-evidence.md` | 게이트, 검증, evidence 규칙 |
| `07-new-team-template-guide.md` | 다른 개발팀 생성 시 재사용 절차 |
| `10-github-artifact-workflow.md` | pod-isolated role agent의 GitHub PR 산출물 handoff 규칙 |
| `12-ref-organization-goal-plan.md` | Reference organization 구성 goal/checkpoint 계획 |
| `13-pod-organization-e2e-improvement-plan.md` | Pod 조직(boram-* 패턴)으로 모바일 앱 E2E를 무인 수행하기 위한 개선 계획 |
| `14-native-e2e-strategy.md` | RN Web, EAS/Maestro, human-device/mobile-mcp 증거 사다리와 native 증거 경계 |
| `15-human-ops-live-readiness-annex.md` | human/ops 승인 뒤에만 가능한 live readiness 작업의 승인·증거·금지 claim annex |
| `16-pod-environment-bootstrap.md` | fresh OpenClaw role pod의 `/workspace/projects/Wondermove-Inc/new-mobile-app` zero-to-ready 부트스트랩 순서와 OrbStack pod 설정값 체크리스트 |
| `17-orbstack-pod-config-values.md` | 현재 repo SoT에서 확인 가능한 OrbStack role pod 설정 실제값과 owner/operator가 추가 제공해야 하는 누락값 목록 |
| `18-orbstack-pod-config-setup-runbook-plan.md` | 누락 설정값을 수집·적용하기 위한 공식 문서 URL 포함 owner/operator runbook 계획 |
| `ref-organization/` | Reference organization 재사용 가이드와 current-project example |
| `99-source-map.md` | 근거 파일과 active/historical crosswalk |

## 운영 원칙

- 현재 repo 기준 사실은 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `.agents/skills`, `.codex/agents`를 우선한다.
- historical corpus 감사와 migration traceability는 root archive 파일
  `TEAM_DOC_ARCHIVE_MANIFEST.json`와 `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`을 우선한다.
- OpenClaw pod-native skill source는 `09-pod-native-openclaw-skills/`에서 관리한다.
- Pod-isolated role agent 산출물은 `10-github-artifact-workflow.md`에 따라 GitHub branch/commit/PR과 `docs/plans/work-units/<work-unit-id>/`로 handoff한다.
- Gatekeeper는 non-LLM deterministic required check이다. Gatekeeper SOUL.md는 만들지 않는다.
- Reference organization 문서는 `ref-organization/`에서 관리하며, future team 재사용 가이드와 current-project example을 분리한다.
