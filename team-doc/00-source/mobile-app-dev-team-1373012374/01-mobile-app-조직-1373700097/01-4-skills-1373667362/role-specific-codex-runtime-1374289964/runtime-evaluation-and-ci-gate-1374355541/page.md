---
pageId: "1374355541"
sourceTitle: "Runtime Evaluation and CI Gate"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355541"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

## Purpose

This section defines the mandatory validation gate before any mobile dedicated skill, custom agent, hook, or OpenClaw generated-agent skill package is committed or distributed.

## Gate Principle

* Every skill, agent, and hook must have fixture-based tests before repo inclusion.
* Reviewer must check path ownership, runtime compatibility, and blast radius before merge.
* Native Codex CLI runtime and OpenClaw generated-agent pod runtime are tested separately.

## Required Gate Matrix

| Surface | Path | Minimum gate |
| --- | --- | --- |
| Codex skill | `.agents/skills/<slug>/SKILL.md` | Skill metadata validation, positive/negative task evals, prompt-injection fixture, source citation check. |
| Codex custom agent | `.codex/agents/<agent>.toml` | TOML parse, required field check, read-only boundary eval, max-depth and skill allowlist check. |
| Codex hook | `.codex/hooks.json`, `.codex/hooks/*` | JSON/schema parse, event fixture tests, malformed input test, advisory/blocking behavior review. |
| OpenClaw generated-agent skill | `/workspace/skills/<slug>/SKILL.md` in pod | Package extraction test, path traversal rejection, SKILL.md presence, install-status and notification evidence. |

## Reviewer Requirement

Reviewer verdict must be PASS or PASS_WITH_ADVISORY with no HIGH unresolved issue. Any path confusion between `.agents/skills`, `.codex/skills`, and `/workspace/skills` is a HIGH issue.