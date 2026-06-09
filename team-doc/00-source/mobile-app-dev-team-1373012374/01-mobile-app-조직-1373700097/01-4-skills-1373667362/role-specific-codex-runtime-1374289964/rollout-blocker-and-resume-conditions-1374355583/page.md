---
pageId: "1374355583"
sourceTitle: "Rollout Blocker and Resume Conditions"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355583"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

## Current Reviewer Decision

Native Codex CLI runtime files and OpenClaw generated-agent packages must not be created in `openclaw-cloud` as a substitute for the mobile template repository.

## Evidence

* Local workspace search did not find a `new-mobile-app` repository.
* The current repository remote is `Wondermove-Inc/openclaw-cloud`, which is the operator/control-plane repository.
* Confluence `01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안` defines the template repository source of truth, but does not specify a cloneable repository URL.
* GitHub organization lookup found mobile-related repositories, but no canonical `new-mobile-app` repository selected by the SoT.

## Resume Conditions

* Provide or create the target mobile template repository URL.
* Confirm whether the target repository is a new repo or an existing candidate such as a proof-of-concept repo.
* Clone or open that repository as the active workspace.
* Before implementation, re-run reviewer on the target path decision: native Codex skills in `.agents/skills`, custom agents in `.codex/agents`, hooks in `.codex/hooks.json` and `.codex/hooks/`, OpenClaw generated-agent packages targeting `/workspace/skills`.

## Next Implementation Steps After Resume

1. Create native Codex CLI skill folders and SKILL.md files under `.agents/skills`.
2. Create custom agent TOML files under `.codex/agents`.
3. Create hook config and scripts under `.codex/hooks.json` and `.codex/hooks/`.
4. Create eval fixtures under `evals/{skills,agents,hooks}`.
5. Create OpenClaw generated-agent skill packages and package/install tests for `/workspace/skills/<slug>`.
6. Run static validation, behavior evals, hook fixture tests, and reviewer before PR.

## Reviewer Criteria

Any proposal to apply the mobile runtime artifacts to `openclaw-cloud` before the mobile template repository exists is a HIGH issue because it violates the documented runtime path decision.