**Findings**

Medium: `team-doc/10-structured/05-repo-template/codex-runtime-layer.md` is still stale. It says `.codex/agents/*.toml` is `×4` and lists only legacy `mobile-*` agents, and says `.agents/skills` is `×2` with only `mobile-app-dev-workflow` and `mobile-backend-api-integrator-workflow` ([codex-runtime-layer.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/10-structured/05-repo-template/codex-runtime-layer.md:19)). That contradicts the active runtime docs that now include Product/Planning and Design routing, including `design-reviewer` and `design-researcher` ([PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:192), [wm/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/wm/SKILL.md:53)).

Medium: The validator only partially enforces exact publication artifact filenames for Design images. It requires exact `option-a.html`, `option-b.html`, `manifest.json`, and `handoff.md`, but image checks can pass on generic text like “Option A image” / “Option B image” instead of exact image filenames ([validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:302)). The skills also allow “equivalent image” / “another explicit Option A image format” ([design-mobile-design-handoff/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-mobile-design-handoff/SKILL.md:41), [design-stitch-mcp-operating-rules/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-stitch-mcp-operating-rules/SKILL.md:36)). If the approved requirement is exact artifact filenames, this remains a validator gap.

**Checks Passed**

Design uses `design-*` naming, not `po-*`, for Design-owned runtime paths ([PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:192), [design-mobile-design-handoff/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/design-mobile-design-handoff/SKILL.md:12)).

`PROJECT_ENVIRONMENT.md` documents the requested Stitch settings: source page `1373765661`, Design SOUL `1373765702`, practice page `1374290207`, exactly two options, HTML/image extraction, dated `design-pub-html/<YYYY-MM-DD>/`, `npx -y stitch-mcp@1.3.2`, ADC/project requirements, and no Stitch API key storage ([PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:193), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:226)).

`DESIGN.md` now points Stitch handoff output to `design-pub-html/<YYYY-MM-DD>/` with Option A/B HTML/images, `manifest.json`, and `handoff.md` ([DESIGN.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/DESIGN.md:55)).

`wm` and headless routing include `design-reviewer` and `design-researcher` ([wm/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/wm/SKILL.md:53), [codex-headless-review.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/codex-headless-review.mjs:7)).

**Verification**

`pnpm run test:hooks` passed: `Passed 40 hook fixture tests.`

I did not run `pnpm run validate` or `pnpm run test:runtime` because the package `validate` script performs an `rmSync('.claude-state')` cleanup before validation ([package.json](/Users/tw.kim/Documents/AGA/test/new-mobile-app/package.json:21)). I ran the read-only validator directly instead: `node scripts/validate-runtime-artifacts.mjs` fails only on root `CLAUDE.md` and `.claude`.

**Git State**

This is not only git state; the two content findings above remain. Separately, there are no staged files, but the worktree has many unstaged modifications and untracked files, including root `CLAUDE.md`, `.claude/`, and an untracked `.env` that I did not read.