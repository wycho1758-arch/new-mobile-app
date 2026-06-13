# SoT And Principles

## Source Of Truth 우선순위

1. `AGENTS.md`
   - repo 규칙, runtime path, PR gate, 금지 사항, Definition of Done.
2. `PROJECT_ENVIRONMENT.md`
   - Expo/RN/API/Codex runtime의 현재 버전과 실제 운영 상태.
3. `.agents/skills/<skill-name>/SKILL.md`
   - 현재 repo-local skill의 실제 contract.
4. `.codex/agents/<agent-name>.toml`
   - 현재 custom agent의 read-only/reviewer/researcher contract.
5. `mobile-app-dev-team/`
   - 현재 관리되는 team/role/process/reference 문서.
6. `TEAM_DOC_ARCHIVE_MANIFEST.json` + `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`
   - historical `team-doc/00-source/`, `team-doc/10-structured/`, `_meta`
     corpus의 root-owned archive metadata와 archived content.

## 기본 원칙

- 현재 팀은 mobile app template runtime을 운영하는 실무팀이다.
- 모든 구현은 TDD 기준으로 진행한다. 구현 변경 전 테스트, eval, validator, fixture 중 가장 좁은 검증을 먼저 둔다.
- customer app name, bundle ID, API URL, token, credential은 hardcode하지 않는다.
- 외부 platform/runtime repository는 이 repo에서 수정하지 않는다.
- React Native UI는 NativeWind, React Native primitives, semantic design token을 사용한다.
- API request/response/domain schema는 `packages/contracts`가 단일 SoT이다.
- 변경은 branch + PR + required checks를 전제로 한다.

## 문서 관리 원칙

- `mobile-app-dev-team/`는 current managed docs이다.
- `team-doc/00-source/`와 `team-doc/10-structured/`는 historical path
  identifiers이며, 삭제 가능 상태 검증은 root의
  `TEAM_DOC_ARCHIVE_MANIFEST.json`와 `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`을 기준으로
  한다.
- historical skill 이름은 `99-source-map.md`에서만 crosswalk로 다룬다.
- active repo skill은 실제 `.agents/skills/<slug>/SKILL.md`가 있는 것만 인정한다.
- `.clode/agents`는 현재 repo runtime path가 아니다. 실제 custom agent path는 `.codex/agents`이다.
- 용어 정의(`skill`/`agent`/`AGENTS.md` 단일 개념, `.agents/` vs `.codex/agents/`
  디렉터리 함정)의 canonical source는 `REPO_OPERATIONS.md`의 "Skill, Agent, And
  AGENTS.md Terminology" 섹션이다.
- Pending reconciliation (tracked follow-up): 위 `.clode/agents` 줄은 (1) 오타
  `.clode` → `.claude`, (2) Codex 런타임 범위 한정이라는 점을 명시 reconcile해야 한다.
  공식 Claude Code 경로 `.claude/agents/<name>.md`·`.claude/skills/<name>/SKILL.md`는
  Claude 런타임 표준이며, canonical 정의는 `REPO_OPERATIONS.md` 용어 섹션을 따른다.
  이 줄의 claim 자체 수정은 명시적 reconcile 결정 후 별도 변경에서 처리한다.
