# Skill Evaluation Evidence

Command:

```sh
pnpm run validate
```

Result:

- PASS: 3 native Codex skills validated under `.agents/skills`.
- PASS: each `SKILL.md` has YAML frontmatter, matching `name`, non-empty `description`, and stays under 500 lines.
- PASS: positive, ownership-negative, and review-only-negative prompt fixtures exist for the role workflow skills and `wm`.
- PASS: generic Expo negative fixture exists for `mobile-app-dev-workflow`.
- PASS: positive fixtures explicitly trigger the matching skill; negative fixtures do not.
- PASS: `wm` excludes legacy fallback paths, uses Codex headless high read-only review routing, and records Serena MCP as the symbolic navigation runtime.
- PASS: `wm` dedicated read-only agents added under `.codex/agents/wm-*.toml`, and wm reviewer routing now uses those agents instead of legacy `mobile-*` reviewers.
- PASS: `wm-*` agent instructions are scoped to this repo's Codex-only read-only TOML agent contract without legacy runtime provenance wording.
- PASS: runtime validator now enforces pinned `mobile-mcp` registration alongside Serena.

Validated artifacts:

- `.agents/skills/wm/SKILL.md`
- `.codex/agents/wm-implementation-reviewer.toml`
- `.codex/agents/wm-contract-reviewer.toml`
- `.codex/agents/wm-docs-researcher.toml`
- `.codex/agents/wm-gate-fix-advisor.toml`
- `.evidence/wm-agent-source-comparison.md`
- `.evidence/wm-additional-runtime-fixes.md`
- `.agents/skills/mobile-app-dev-workflow/SKILL.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
