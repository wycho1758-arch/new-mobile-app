**Findings**

None for the requested design-runtime content areas.

**Verification Summary**

Verified source alignment against current files:

- Design adapters use `design-*` names and map source pages: [.agents/skills/design-mobile-design-handoff/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-mobile-design-handoff/SKILL.md:12), [.agents/skills/design-stitch-mcp-operating-rules/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-stitch-mcp-operating-rules/SKILL.md:12).
- Exact two options, Option A/B HTML/images, `manifest.json`, and `handoff.md` are required: [.agents/skills/design-mobile-design-handoff/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-mobile-design-handoff/SKILL.md:35), [.agents/skills/design-stitch-mcp-operating-rules/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-stitch-mcp-operating-rules/SKILL.md:34).
- Exact image filenames `option-a.png` and `option-b.png` are present in both design contracts and validator coverage: [.agents/skills/design-mobile-design-handoff/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-mobile-design-handoff/SKILL.md:41), [.agents/skills/design-stitch-mcp-operating-rules/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-stitch-mcp-operating-rules/SKILL.md:37), [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:304).
- `DESIGN.md` now points publication to project-root `design-pub-html/<YYYY-MM-DD>/`: [DESIGN.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/DESIGN.md:55).
- Stitch MCP is pinned and documented with ADC/project setup, no repo API key storage, and no `@latest`: [.codex/config.toml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/config.toml:10), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:226).
- `$wm` and headless review routing include `wm-*`, `po-*`, and `design-*` read-only agents: [.agents/skills/wm/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/wm/SKILL.md:49), [scripts/codex-headless-review.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-headless-review.mjs:7).
- shadcn/RN policy is correctly constrained: Stitch HTML may use shadcn-compatible semantics, while RN handoff remains NativeWind, RN primitives, semantic tokens, and stable testIDs: [.agents/skills/design-mobile-design-handoff/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-mobile-design-handoff/SKILL.md:36), [.agents/skills/design-stitch-mcp-operating-rules/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-stitch-mcp-operating-rules/SKILL.md:49), [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:11).

Separate note: direct read-only validator run `node scripts/validate-runtime-artifacts.mjs` fails only because root `CLAUDE.md` and `.claude/` are present. They are untracked. I did not run `pnpm run validate` because that script removes `.claude-state`, which is mutating.