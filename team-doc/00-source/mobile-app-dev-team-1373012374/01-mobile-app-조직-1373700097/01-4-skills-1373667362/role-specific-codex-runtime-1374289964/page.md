---
pageId: "1374289964"
sourceTitle: "Role-specific Codex Runtime"
sourceVersion: "3"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374289964"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Mobile App 조직에서 Codex CLI 전용 skills, custom agents, hooks와 OpenClaw generated-agent skill package를 구분해 정의한다. |
| Upstream | 01-4. Skills, [SOUL.md](http://SOUL.md) Mobile App Dev, [SOUL.md](http://SOUL.md) Backend/API Integrator |
| Downstream | 하위 Runtime Path Decision, Skills, Agents, Hooks, Runtime Evaluation and CI Gate |
| 상태 | 계획 적용 초안 |

## 이 페이지의 역할

이 페이지는 기존 MVP 5개 skill을 대체하지 않는다. 기존 `mobile-prd-to-execution`, `mobile-design-handoff`, `mobile-api-contract`, `mobile-qa-release`, `mobile-gatekeeper`가 계속 SoT이다.

여기서는 역할별 thin wrapper skill, read-only/advisory custom agent, local advisory hook, generated-agent skill package 경로를 분리해서 정의한다.

## 핵심 경로 결정

* Codex CLI native repo skill: `new-mobile-app/.agents/skills/<skill-name>/SKILL.md`
* Codex CLI custom agent: `new-mobile-app/.codex/agents/<agent-name>.toml`
* Codex CLI hooks: `new-mobile-app/.codex/hooks.json` 및 `.codex/hooks/`
* OpenClaw generated-agent runtime skill install path: `/workspace/skills/<skill-slug>/SKILL.md`

## 강제 원칙

* `.codex/skills`는 신규 mobile repo의 기본 skill 위치가 아니다. Codex CLI repo skill은 `.agents/skills`를 사용한다.
* Boram 같은 OpenClaw generated-agent pod는 현재 `.agents/skills`를 로드하지 않고 `/workspace/skills`를 로드한다.
* hook은 local advisory guardrail이며, hard pass/fail은 `mobile-gatekeeper` deterministic script와 GitHub required check가 담당한다.
* custom agent는 read-only reviewer/research/advisor 중심으로 제한하고 MVP에서 broad dev-executor를 만들지 않는다.

## 하위 구조

* Runtime Path Decision
* Skills
* Agents
* Hooks
* Runtime Evaluation and CI Gate
* Optional Subagents and LazyCodex Pattern Reuse

---

# 2026-06-08 Hook Runtime Pointer Update

Original page ownership is unchanged. Detailed hook policy now lives under `Hooks` (`1374060648`) and `hook-evaluation-and-ci-gate` (`1374355561`).

Current hook policy coverage under `Hooks` (4 events):

* `SessionStart`: `mobile-session-start-context-hook` (`1376845825`)
* `PreToolUse`: `mobile-pretool-policy-hook` (`1374290046`)
* `PostToolUse`: `mobile-posttool-evidence-reminder-hook` (`1374388296`)
* `Stop`: `mobile-stop-gatekeeper-advisory-hook` (`1374355521`)

This page continues to own runtime boundary and path separation. It should not duplicate hook event rules, fixture schemas, or release approval policy.

---

# 2026-06-09 Hook Coverage Correction

`UserPromptSubmit`(`mobile-user-prompt-policy-hook`)와 `PermissionRequest`(`mobile-permission-policy-hook`) 두 훅은 **불필요로 판정되어 설계에서 제거**되었다. 프로젝트(SoT)와 결정론적 게이트 `scripts/validate-runtime-artifacts.mjs`는 위 4개 이벤트만 구현·강제한다. 위험 명령 차단은 `PreToolUse`가, hard pass/fail은 `mobile-gatekeeper`와 GitHub required check가 이미 담당하므로 두 훅은 안전상 추가 이득이 없다.