---
pageId: "1374289985"
sourceTitle: "Runtime Path Decision"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374289985"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Codex CLI native runtime과 OpenClaw generated-agent runtime의 skill/agent/hook 경로를 분리한다. |
| Upstream | Role-specific Codex Runtime |
| Downstream | codex-cli-native-runtime-paths, openclaw-generated-agent-runtime-paths, boram-pod-runtime-evidence |

## 결론

두 런타임을 같은 경로로 취급하지 않는다. Codex CLI native repo skill은 `.agents/skills`를 사용한다. Codex CLI custom agents/hooks는 `.codex` 아래에 둔다. OpenClaw generated-agent pod에 설치되는 skill은 현재 `/workspace/skills`를 사용한다.

## 분류 규칙

| Artifact | Codex CLI Native | OpenClaw Generated Agent |
| --- | --- | --- |
| Skill | `.agents/skills/<name>/SKILL.md` | `/workspace/skills/<slug>/SKILL.md` |
| Custom agent/subagent | `.codex/agents/<name>.toml` | MVP 기본 대상 아님 |
| Hook | `.codex/hooks.json`, `.codex/hooks/` | MVP 기본 대상 아님 |

## Reviewer gate

각 runtime artifact는 구현 전에 target runtime을 명시해야 한다. 둘 다 지원하는 경우 packaging/sync contract와 양쪽 test evidence가 필요하다.