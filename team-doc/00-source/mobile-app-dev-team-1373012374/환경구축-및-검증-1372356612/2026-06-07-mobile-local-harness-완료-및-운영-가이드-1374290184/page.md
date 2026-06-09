---
pageId: "1374290184"
sourceTitle: "2026-06-07 Mobile Local Harness 완료 및 운영 가이드"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374290184"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Mobile Local Harness 완료 및 운영 가이드

> **상태:** Local harness 구현 및 최종 검증 완료    
> **Final reviewer(xhigh):** LGTM / critical 0 / warning 0 / info 3    
> info 3건은 non-blocker입니다.

## 1. 목적

이 문서는 `docs/plans/active/20260607-mobile-local-unit-harness-validation-plan.md`를 기준으로 구현된 `new-mobile-app` local harness의 완료 상태, 검증 방법, 운영 경계, 반복 실행 절차를 설명합니다.

목표는 `openclaw-cloud`가 실제 pod/agent를 생성하기 전 단계에서, Confluence SoT 기준 role/workflow/skill/runtime 구성이 local에서 가능한 범위까지 유효한지 확인하는 것입니다.

## 2. 결론

| 항목 | 결과 |
| --- | --- |
| Local harness 구현 | DONE |
| 통합 검증 | PASS: `pnpm run test:local-harness` |
| 기존 runtime 검증 | PASS: `pnpm run test:runtime` |
| lint/test | PASS: `pnpm turbo run lint test` |
| reviewer(xhigh) | LGTM / critical 0 / warning 0 / info 3 |
| openclaw-cloud source/runtime 변경 | NONE |

## 3. 전체 흐름

```plaintext
Confluence SoT
  |
  |  live snapshot at implementation time
  v
new-mobile-app/evals/local-harness/sot/snapshot.json
  |
  +-- Product/Planning fixtures
  |     PRD -> Case A~H routing -> role task/evidence/human gate
  |
  +-- Role fixtures
  |     6 LLM roles only; no CTO; Gatekeeper has no SOUL.md
  |
  +-- Structure checks
  |     .agents/skills, .codex/agents, hooks, forbidden runtime role checks
  |
  +-- Gatekeeper deterministic checks
  |     evidence, approver_not_author, rework predicate wiring
  |
  +-- Codex headless smoke
  |     read-only sandbox; advisory only
  |
  +-- OpenClaw package simulation
        temp /workspace/skills/<slug>/SKILL.md shape only; NOT pod runtime
```

## 4. Repo 구조

```plaintext
new-mobile-app/
|
+-- evals/local-harness/
|   +-- README.md
|   +-- sot/
|   |   +-- snapshot.json
|   +-- product-planning/
|   +-- roles/
|   +-- gatekeeper/
|   +-- codex-smoke/
|   +-- openclaw-package/
|   +-- results/
|       +-- summary.md
|       +-- preflight.json
|       +-- product-planning.json
|       +-- structure.json
|       +-- roles.json
|       +-- codex-smoke.json
|       +-- gatekeeper.json
|       +-- openclaw-package.json
|
+-- scripts/
|   +-- clean-tree-guard.mjs
|   +-- codex-preflight.mjs
|   +-- test-local-harness.mjs
|
+-- package.json
```

## 5. 실행 명령

반복 검증 시 환경 변수를 명시하고 실행합니다.

```shell
export MOBILE_APP_ROOT=/Users/tw.kim/Documents/AGA/test/new-mobile-app
export OPENCLAW_ROOT=/Users/tw.kim/Documents/AGA/test/openclaw-cloud

cd "$MOBILE_APP_ROOT"
pnpm run test:local-harness
pnpm run test:runtime
pnpm turbo run lint test
```

## 6. 통합 검증에서 확인하는 항목

```plaintext
pnpm run test:local-harness
  |
  +-- clean-tree-guard self-test
  +-- clean-tree-guard actual before check
  +-- codex-preflight self-test
  +-- codex-preflight actual probe
  |     /opt/homebrew/bin/codex accepted
  |     /usr/local/bin/codex rejected on arm64 host due x86_64 arch
  |
  +-- test:runtime
  |     +-- validate runtime artifacts
  |     +-- test hooks
  |     +-- test openclaw package simulation
  |
  +-- pnpm turbo run lint test
  |
  +-- test-local-harness self-test
  |
  +-- local harness stages
  |     +-- product-planning
  |     +-- structure
  |     +-- roles
  |     +-- codex-smoke advisory
  |     +-- gatekeeper
  |     +-- openclaw-package
  |     +-- summary
  |
  +-- clean-tree-guard actual after check
```

## 7. SoT 기준으로 검증한 역할

| Role | Local harness에서의 검증 방식 |
| --- | --- |
| Product/Planning | PRD fixture, Case A/B routing, evidence/human-gate matrix |
| Design | Role context fixture, Case responsibility, boundary assertion |
| Mobile Architect | Role context fixture, architecture/risk/deviation boundary assertion |
| Mobile App Dev | Role fixture + native skill reference + read-only Codex advisory smoke |
| Backend/API Integrator | Role fixture + native skill reference + read-only Codex advisory smoke |
| QA/Release | Role fixture + QA/release evidence and failure classification boundary |
| Gatekeeper | Non-LLM deterministic predicate only. [SOUL.md](http://SOUL.md) role fixture 없음 |

## 8. Case A\~H 검증 레벨

| Case | Local proof level |
| --- | --- |
| Case A | local fixture verified |
| Case B | local fixture verified |
| Case C | local fixture verified |
| Case D | local fixture verified |
| Case E | local fixture verified |
| Case F | local verified |
| Case G | local fixture verified |
| Case H | deferred integration |
| Cross-cutting | local verified |

Proof level 범례:

* `local fixture verified`: fixture/정적 구조 중심 검증
* `local verified`: deterministic harness stage 실행 검증
* `deferred integration`: local 범위 밖으로 실제 integration 단계에서 확인 필요

## 9. 이 harness가 증명하는 것

* 조직 모델은 6 LLM roles + 1 non-LLM Gatekeeper 기준으로 구성되어 있다.
* CTO/local-orchestrator/Gatekeeper [SOUL.md](http://SOUL.md) runtime role이 추가되지 않았음을 검증한다.
* Product/Planning은 coordinator fixture 역할만 수행하며 code/openclaw-cloud 수정 owner가 아니다.
* native Codex skills는 `.agents/skills`, custom agents는 `.codex/agents`, hooks는 `.codex/hooks` 기준이다.
* Gatekeeper는 deterministic evidence predicate로만 검증된다.
* Codex headless smoke는 `--sandbox read-only`로만 수행되고 advisory 결과로만 취급된다.
* OpenClaw package simulation은 temp 경로에서 `/workspace/skills/<slug>/SKILL.md` shape를 검증한다.

## 10. 이 harness가 증명하지 않는 것

아래 항목은 local harness 범위 밖입니다. 완료 보고나 운영 판단에서 pod/runtime parity로 해석하면 안 됩니다.

* openclaw-cloud agent 생성 API 동작
* generated-agent pod가 실제 `/workspace/skills`를 로드하는 동작
* Jira/Confluence/Tasks 실제 side effect
* GitHub branch protection 또는 required check 등록
* EAS secret injection, EAS cloud build/submit
* production submit 자동화 또는 human approval 대체

## 11. 운영 시 해석 기준

```plaintext
PASS 해석
  |
  +-- local/offline snapshot 기준 구성 유효성 OK
  +-- fixture, structure, deterministic predicate OK
  +-- Codex CLI read-only smoke 가능
  +-- package layout simulation OK

PASS 아님
  |
  +-- real pod runtime parity 증명 아님
  +-- live Confluence drift 자동 검출 아님
  +-- external system side effect 검증 아님
```

## 12. SoT snapshot 운영

`test:local-harness`는 offline snapshot 기준으로 검증합니다.

| 항목 | 값 |
| --- | --- |
| snapshot path | `evals/local-harness/sot/snapshot.json` |
| fetchedAt | `2026-06-07T05:20:15Z` |
| staleness | fresh |
| live refresh command | `test:local-harness:sot-refresh`는 현재 NOT IMPLEMENTED 안내 placeholder |

Source pages / versions:

```plaintext
1373765682 v1  01-2. 조직 구성과 역할
1373667425 v2  01-3. Workflows — Case A~H
1373667362 v2  01-4. Skills
1374289964 v1  Role-specific Codex Runtime
1374290005 v4  Role-specific Codex Runtime / Skills
1374421001 v1  mobile-project-bootstrap-workflow
1373798443 v4  mobile-gatekeeper
1373700222 v4  01-7. 진행 계획과 상태
1373798422 v2  SOUL.md — Product/Planning
1373765702 v5  SOUL.md — Design
1373667383 v4  SOUL.md — Mobile Architect
1373700159 v3  SOUL.md — Mobile App Dev
1373700180 v2  SOUL.md — Backend/API Integrator
1373700201 v4  SOUL.md — QA/Release
```

Confluence live drift 확인이 필요하면 Atlassian MCP로 page ID/version을 다시 조회하고 snapshot을 갱신해야 합니다. routine local 검증은 live Confluence를 자동 호출하지 않습니다.

## 13. 실패 시 triage 순서

```plaintext
test:local-harness FAIL
  |
  +-- preflight failure?
  |     +-- check MOBILE_APP_ROOT / OPENCLAW_ROOT
  |     +-- check codex binary arch and version
  |
  +-- structure failure?
  |     +-- check forbidden CTO/local-orchestrator/Gatekeeper SOUL.md runtime role
  |     +-- check unexpected .agents/skills slug
  |
  +-- roles failure?
  |     +-- compare role fixture with sot/snapshot.json
  |     +-- verify exactly 6 LLM roles
  |
  +-- gatekeeper failure?
  |     +-- inspect evidence fixture failure reason
  |     +-- do not reinterpret pass/fail in prompt
  |
  +-- openclaw-package failure?
        +-- check generated package has SKILL.md
        +-- confirm temp simulation boundary, not real /workspace/skills
```

## 14. 최종 reviewer 결과

| Gate | Result |
| --- | --- |
| Final reviewer(xhigh) | LGTM |
| critical | 0 |
| warning | 0 |
| info | 3 |

남은 info는 blocker가 아닙니다. 주요 내용은 `sot-refresh`가 수동 안내 placeholder라는 점, package simulation temp prefix 측정 의존성, Codex smoke command 기록의 prompt inline 표현 차이입니다.

## 15. 관련 경로

* Plan: `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/docs/plans/active/20260607-mobile-local-unit-harness-validation-plan.md`
* Harness repo: `/Users/tw.kim/Documents/AGA/test/new-mobile-app`
* Summary: `/Users/tw.kim/Documents/AGA/test/new-mobile-app/evals/local-harness/results/summary.md`
* Preflight: `/Users/tw.kim/Documents/AGA/test/new-mobile-app/evals/local-harness/results/preflight.json`
