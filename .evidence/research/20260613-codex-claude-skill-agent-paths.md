# Research Evidence — Official Codex / Claude Code skill & agent paths

- Date: 2026-06-13
- Method: deep-research harness (fan-out web search → fetch → 3-vote adversarial verify → synthesize)
- Run id: `wf_3cdd313a-0d2`
- Stats: 5 angles, 13 primary sources fetched, 55 claims extracted, 25 verified, 20 confirmed, 5 killed
- Purpose: source-back the path definitions used in `REPO_OPERATIONS.md` →
  "Skill, Agent, And AGENTS.md Terminology". Repo SoT (`AGENTS.md`,
  `PROJECT_ENVIRONMENT.md`) remains the binding authority; this file records the
  external official-doc alignment.

## Verified claims (all unanimous 3-0, confidence high)

| # | Claim | Verdict | Primary sources |
|---|-------|---------|-----------------|
| 1 | Codex CLI **skill** = `.agents/skills/<name>/SKILL.md` (scopes: `$REPO_ROOT`, `$CWD`, `$HOME/.agents/skills`, system `/etc/codex/skills`) | CONFIRMED 3-0 | developers.openai.com/codex/skills ; developers.openai.com/codex/subagents ; developers.openai.com/codex/concepts/customization ; github.com/openai/codex/blob/main/docs/skills.md |
| 2 | Codex CLI **custom agent** = `.codex/agents/<name>.toml` (project) or `~/.codex/agents/` (personal); identity = internal `name` field, filename conventional | CONFIRMED 3-0 | developers.openai.com/codex/subagents ; simonwillison.net/2026/Mar/16/codex-subagents/ ; github.com/openai/codex/issues/18823 ; github.com/openai/codex/issues/15250 |
| 3 | Claude Code **skill** = `.claude/skills/<skill-name>/SKILL.md` (project); personal `~/.claude/skills/`; plugin `<plugin>/skills/` | CONFIRMED 3-0 | code.claude.com/docs/en/skills ; github.com/anthropics/skills ; platform.claude.com/docs/en/agents-and-tools/agent-skills |
| 4 | NUANCE — asymmetric split: `.agents/` holds skills (SKILL.md) vs `.codex/agents/` holds custom agents (.toml); same official subagents page references both; misrouting bug exists | CONFIRMED 3-0 | developers.openai.com/codex/subagents ; developers.openai.com/codex/skills ; github.com/openai/codex/issues/18823 |
| 5 | NUANCE — `AGENTS.md` is a DISTINCT third concept: plain custom-instructions standard read before work (precedence `~/.codex` → git root → cwd; `AGENTS.override.md`; 32 KiB cap) | CONFIRMED 3-0 | developers.openai.com/codex/guides/agents-md ; agents.md |

## Refuted / killed claims
- "Codex skills live at `.codex/skills/` or `~/.codex/skills/`" — REFUTED (0 occurrences of
  `.codex/skills` in official docs; only system `/etc/codex/skills`). Source of error: 3rd-party SEO blog (agensi.io).
- Several "official AGENTS.md page does not document skill/agent paths" claims — refuted; those
  paths are documented on the dedicated /codex/skills and /codex/subagents pages, not the AGENTS.md guide page.

## Caveats (recorded, not definitive overreach)
- `.agents/skills` and `.codex/agents` are documented default scan paths; config exposes a
  user-configurable skill `path` and per-agent `config_file`, so they are defaults, not immutable.
- Codex skills/subagents are a fast-moving 2025–2026 feature; docs current as of the research date.
- Repo-side alignment: definitions match repo SoT exactly — `AGENTS.md:21-22`,
  `PROJECT_ENVIRONMENT.md:218`, `REPO_OPERATIONS.md:78-81`.
