**Findings**

1. **Blocker: `design-*` naming is not implementation-ready under current repo SoT.** Current runtime policy says Design repo-local Codex adapters use required `po-*` slugs, specifically `po-mobile-design-handoff`, and `$wm` review routing allows `po-design-reviewer`/`po-design-researcher`, not `design-*`. The validator also hardcodes required `po-*` skill/agent names. Adding `design-*` skills/agents without an explicit SoT decision would create runtime drift.
Sources: [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:189), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:192), [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:13), [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:257), [.agents/skills/wm/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/wm/SKILL.md:53).

2. **High: “shadcn basis every time” conflicts with React Native screen policy.** Repo policy says RN UI uses NativeWind, React Native primitives, and semantic tokens; shadcn/ui is only for optional web console use. The Stitch MCP operating-rules skill should say “use DESIGN.md, selected design reference, NativeWind/RN primitives, and semantic tokens for mobile; shadcn only when `apps/console` is in scope.”
Sources: [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:11), [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:90), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:78), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:272), [DESIGN.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/DESIGN.md:12).

3. **High: “exactly two options” is a new rule that conflicts with existing artifacts and must be applied tests-first.** Current handoff skill, reviewer, eval, validator, environment doc, and active Stitch plan all still allow `1-2` or `1 to 3` options. The change is valid only if treated as the latest approved requirement and updated consistently before implementation.
Sources: [.agents/skills/po-mobile-design-handoff/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/po-mobile-design-handoff/SKILL.md:32), [.codex/agents/po-design-reviewer.toml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/agents/po-design-reviewer.toml:15), [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:272), [evals/skills/po-mobile-design-handoff/positive.prompt.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/evals/skills/po-mobile-design-handoff/positive.prompt.md:1), [docs/plans/active/20260609-stitch-mcp-activation-plan.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/plans/active/20260609-stitch-mcp-activation-plan.md:104).

4. **High: requested publication artifacts are not evidenced yet.** The review request asks for working-result images and HTML under `design-pub-html/2020-06-09/`, but read-only file listing found no files under `design-pub-html/`. The active Stitch plan also says generation smoke is pending Google Cloud ADC/project setup, so the plan must not claim generated output until Stitch fetch/export succeeds and artifacts are present.
Sources: [docs/plans/active/20260609-stitch-mcp-activation-plan.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/plans/active/20260609-stitch-mcp-activation-plan.md:4), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:222), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:226).

5. **Medium: output-folder date semantics need to be explicit.** The requested folder is `design-pub-html/2020-06-09/`, while the current date is 2026-06-09 Asia/Seoul. The manifest should record `requestedDate: "2020-06-09"` separately from `generatedAt`, so later reviewers do not treat the folder as today’s dated output.

6. **Medium: missing eval/validator coverage for the new runtime behavior.** Current validator checks Stitch MCP pinning and `1-2` design options, but not exactly two options, option A/B artifact publication, `manifest`/handoff presence, image evidence, or `design-pub-html/<YYYY-MM-DD>/` structure.
Sources: [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:175), [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:272), [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:7), [.agents/skills/wm/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/wm/SKILL.md:34).

**Recommended Direction**

Keep `po-*` unless a human SoT update explicitly approves `design-*`.

Recommended skill/agent list:
- Update `.agents/skills/po-mobile-design-handoff` to require exactly two options and A/B artifact publication.
- Add `.agents/skills/po-stitch-mcp-operating-rules` only if the rules must be reusable outside handoff; otherwise keep them inside `po-mobile-design-handoff`.
- Update `.codex/agents/po-design-reviewer` instead of adding a new reviewer.
- Keep `.codex/agents/po-design-researcher` for Stitch/DESIGN.md uncertainty.

Required tests/evals before implementation:
- Update validator checks for exactly two options and Stitch artifact rules.
- Add evals for single-option and three-option rejection.
- Add eval coverage for `design-pub-html/<YYYY-MM-DD>/` manifest, A/B HTML, A/B images, and handoff evidence.
- Run `pnpm run test:runtime`; run `pnpm run test:local-harness` for `.agents`, `.codex`, `evals`, scripts, or environment-doc changes.