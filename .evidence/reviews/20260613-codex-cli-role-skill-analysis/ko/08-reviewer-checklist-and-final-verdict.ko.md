# Reviewer 체크리스트와 최종 판정

작성일: 2026-06-13

## Reviewer가 확인해야 할 것

- 6개 SOUL role이 모두 포함됐는가
  - Product/Planning
  - Design
  - Mobile Architect
  - Mobile App Dev
  - Backend/API Integrator
  - QA/Release
- Gatekeeper를 SOUL role로 만들지 않았는가
- pod-native skill path와 repo-local Codex path를 섞지 않았는가
  - pod-native source: `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/SKILL.md`
  - pod runtime: `/workspace/skills/<slug>/SKILL.md`
  - repo-local skill: `.agents/skills/<skill-name>/SKILL.md`
  - custom agent: `.codex/agents/<agent-name>.toml`
- 각 role 문서가 아래 구조를 갖는가
  - current state
  - required role-specific Codex CLI process
  - current problems
  - skill/agent additions or reinforcement
  - role-specific acceptance criteria
- 각 role 문서가 공통 Codex 운영 계약을 포함하거나 참조하는가
  - SoT 기반 read-only 계획
  - 계획 중 예측 금지와 수정 금지
  - 계획 reviewer 검토 후 사용자 보고
  - 승인 후 실행
  - 완료 후 최종 reviewer 검토
  - `git diff`와 `git status --short` 확인 후 보고
- Mobile Architect gap을 명확히 지적했는가
- QA/Release readiness synthesis를 조건부 권고로 다뤘는가
- human gate, secret safety, external proof limit를 지켰는가
- handoff가 pod-local state가 아니라 GitHub branch/commit/PR 또는 `docs/plans/work-units/<work-unit-id>/` 기준인가
- Stitch 같은 외부 tool 사용 role이 공식 문서 확인, MCP/CLI readiness와 실제 proof의 차이, prompt/command template, evidence path를 명시하는가
- Design/Stitch 보강이 Product/Planning requirement, two-option generation, five-state coverage, P0/P1 gate, NativeWind/RN handoff 제약을 포함하는가
- Design/Stitch 보강이 선택된 `DESIGN.md`/`design.md` baseline, 동일 Stitch project 연속성, project id/share link, manifest metadata, drift check, 승인된 fork evidence를 증명하는가
- Design reviewer는 baseline 없음, same-project evidence 없음, 승인 없는 fork, manifest metadata 누락, `DESIGN.md`와 prompt/output 충돌, 승인 없는 design-system drift를 `NO_GO`로 처리하는가
- Mobile App Dev는 완전한 `Codex Implementation Plan Packet`을 포함하고, final reviewer가 실제 diff/commands/evidence/`04-mobile-app/*`를 확인하기 전 완료 보고를 막는가
- Backend/API는 완전한 `Codex API Contract Plan Packet`을 포함하고, final reviewer가 실제 diff/commands/evidence/`packages/contracts`/duplicate type 금지/`03-contract-api/*`를 확인하기 전 완료 보고를 막는가
- reviewer가 missing SoT를 추측으로 통과시키지 않고 unknown/blocked로 기록하도록 요구하는가

## 추가 reviewer 질문

1. 이 role 문서는 Codex가 작업 전 어떤 SoT를 읽어야 하는지 충분히 구체적인가?
2. 계획 단계에서 수정 금지와 예측 금지를 명확히 강제하는가?
3. 계획 reviewer와 최종 reviewer가 서로 다른 시점의 gate로 명확히 분리되어 있는가?
4. 외부 tool을 쓰는 경우 공식 문서 근거와 실제 실행 prompt/command가 포함되어 있는가?
5. role이 자기 소유가 아닌 구현, 승인, release, human-risk 결정을 멈추도록 되어 있는가?
6. 완료 후 `git diff`/`git status --short` 확인과 사용자 보고가 acceptance criteria에 들어있는가?
7. Design은 승인된 `DESIGN.md` baseline과 동일 Stitch project를 기준으로 drift를 막는가?
8. Mobile App Dev와 Backend/API는 독립 pod가 추측 없이 실행 또는 소비할 수 있는 plan packet을 갖는가?

## 최종 판정

현재 repo는 독립 pod에서 role별 Codex CLI 작업을 완전하게 수행하기에는 **아직 불완전합니다**.

충분한 것:

- Codex CLI setup readiness
- role identity bootstrap
- Design Stitch readiness check
- QA/Release EAS readiness check
- Product, Design, Mobile App Dev, Backend/API, QA surface별 기존 repo-local skill
- 다수의 read-only reviewer/researcher

부족한 것:

- SOUL role identity에서 repo-local Codex skill/agent 사용으로 이어지는 pod-native bridge
- Mobile Architect 전용 repo-local workflow
- 모든 role에 대해 `docs/plans/work-units/<work-unit-id>/`로 연결되는 명시적 실행 path
- 여러 evidence surface를 종합하는 QA/Release readiness workflow 또는 reviewer

필수 다음 작업:

1. `codex-role-workflow` pod-native skill 추가
2. `mobile-architect-workflow` repo-local skill 추가
3. validator/eval 추가
4. 공통 Codex 운영 계약을 `codex-role-workflow`와 role-specific repo-local skill에 반영
5. Design Stitch skill에 공식 문서 기준, prompt template, 선택된 `DESIGN.md` baseline, 동일 Stitch project 연속성, manifest metadata, drift blocking을 반영
6. Mobile App Dev와 Backend/API skill에 concrete plan packet, plan reviewer, final reviewer, role artifact, diff/status, 조기 완료 보고 금지를 반영
7. 필요 시 architecture/release-readiness reviewer 추가

## 이 분석이 증명하지 않는 것

이 문서는 다음을 증명하지 않습니다.

- live OpenClaw/OrbStack pod 실행
- GitHub branch protection 또는 PR auto-merge
- EAS, Maestro, mobile-mcp, Stitch, Railway, Jira, Confluence, app store 동작
- 미래 구현이 runtime gates를 통과한다는 것

이 항목들은 별도 구현, 검증, reviewer evidence, 필요한 경우 human-approved live evidence가 필요합니다.
