---
pageId: "1374290066"
sourceTitle: "Optional Subagents and LazyCodex Pattern Reuse"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374290066"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

## Decision

Do not install LazyCodex wholesale into the mobile MVP runtime. Reuse well-made patterns only after isolated research and fixture validation.

## Reasoning

* The current repository already contains heavy operator skills, reviewers, and hooks under `.codex`; wholesale installation would add overlapping orchestration.
* The mobile team target is a light, role-specific runtime with explicit skills, narrow custom agents, and small advisory hooks.
* LazyCodex-style patterns are useful as references for deep init, loop discipline, LSP/AST-grep assisted review, and skill evaluation, but each pattern must be reduced to the mobile SoT.

## Allowed Pattern Reuse

* Use deep init ideas to generate layered `AGENTS.md` only when the mobile repo structure exists.
* Use skill evaluation ideas such as positive/negative fixtures, variance checks, and regression examples.
* Use reviewer fan-out ideas only for focused read-only subagents.
* Use hook patterns only when they remain deterministic and fixture-testable.

## Disallowed For MVP

* Broad dev-executor or all-purpose programming agent as a default mobile team agent.
* Recursive subagent delegation.
* Hook sets that block common development without a documented stabilization period.
* Installing third-party workflow bundles directly into the repo without a scratch-repo diff and reviewer approval.

## Reviewer Criteria

Reviewer must reject any proposal that makes LazyCodex or any other third-party bundle the source of truth over the WonderMove Confluence pages and the mobile repo runtime path decision.