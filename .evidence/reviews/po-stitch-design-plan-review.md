**Findings**

Critical: none.

High: `po-mobile-design-handoff` cannot be added as a native repo skill under the current local harness without tests-first allowlist work. `scripts/test-local-harness.mjs` rejects any `.agents/skills/*` directory not present in `snapshot.skillTaxonomy.allowedNativeDevSkills`, which currently only allows `wm`, `mobile-app-dev-workflow`, and `mobile-backend-api-integrator-workflow` (`scripts/test-local-harness.mjs:167`, `scripts/test-local-harness.mjs:181`, `evals/local-harness/sot/snapshot.json:205`). The plan should add/update harness fixtures and snapshot expectations before adding `.agents/skills/po-mobile-design-handoff/SKILL.md`. It should also explicitly avoid `mobile-design-workflow`, because the harness says standalone role-wrapper skills such as `mobile-design-workflow` are out of scope (`evals/local-harness/README.md:25`).

High: `po-design-reviewer` and `po-design-researcher` will not work through the existing headless review path unless the allowlist and validator are updated. `scripts/codex-headless-review.mjs` currently allows only the four `wm-*` agents and exits on unsupported names (`scripts/codex-headless-review.mjs:7`, `scripts/codex-headless-review.mjs:56`). `PROJECT_ENVIRONMENT.md` also documents that `$wm` reviewer routing and the helper allow only `wm-*` agents (`PROJECT_ENVIRONMENT.md:156`, `PROJECT_ENVIRONMENT.md:162`). If these `po-*` agents are implemented, update the helper, `scripts/validate-runtime-artifacts.mjs`, and agent eval evidence in the same change.

Medium: The Design SoT still points to legacy/non-`po-*` skill names, so a `po-*` plan needs an explicit SoT migration step. The Design SOUL names `mobile-design-handoff` as the skill in use (`team-doc/.../soul-md-design-1373765702.md:82`, `team-doc/.../soul-md-design-1373765702.md:219`), while the child Codex guidance links `mobile-design-codex-practice` (`team-doc/.../design-codex-cli-실무-지침-1374290207.md:14`, `team-doc/.../design-codex-cli-실무-지침-1374290207.md:31`). That conflicts with the review constraint that new skill/agent names must be `po-*`.

Medium: The active Stitch plan’s verification section is sufficient for MCP activation, but not for adding native design skills/agents. Repo policy requires tests/evals before implementation changes (`AGENTS.md:7`, `.agents/skills/wm/SKILL.md:18`, `.agents/skills/wm/SKILL.md:34`), and runtime changes must pass runtime/local-harness gates (`AGENTS.md:84`, `PROJECT_ENVIRONMENT.md:12`). A design-runtime implementation plan should name the exact failing eval/validator/harness assertions before adding the new skill and agents.

Low: The current Stitch MCP registration itself is aligned with the pinning and secret-free requirement. `.codex/config.toml` uses `npx -y stitch-mcp@1.3.2` (`.codex/config.toml:10`), `PROJECT_ENVIRONMENT.md` documents ADC/project setup and forbids repo-stored Stitch keys (`PROJECT_ENVIRONMENT.md:181`, `PROJECT_ENVIRONMENT.md:187`, `PROJECT_ENVIRONMENT.md:188`), and the validator rejects `@latest`, API key patterns, and `EXPO_PUBLIC_STITCH` config (`scripts/validate-runtime-artifacts.mjs:148`, `scripts/validate-runtime-artifacts.mjs:153`).

Low: Current PR readiness remains blocked until runtime gates are green. Existing evidence says `pnpm run test:runtime` and `pnpm run test:local-harness` are blocked by root `CLAUDE.md`/`.claude/` artifacts (`.evidence/stitch-mcp-activation-plan/summary.md:41`, `.evidence/stitch-mcp-activation-plan/summary.md:45`). That blocker is not Stitch-specific, but it prevents claiming runtime gate readiness until rerun cleanly.

**Review Verdict**

Proceed with the proposed direction only if it is scoped as:

- Add `po-mobile-design-handoff` as a narrow Stitch-backed design handoff skill, not `mobile-design-workflow`.
- Add `po-design-reviewer` and `po-design-researcher` as read-only custom agents with source-citation and no-recursive-delegation rules.
- Update validator, local harness snapshot/evals, and headless allowlists tests-first.
- Keep `stitch-mcp@1.3.2` pinned and credential-free in repo files.
- Record gate evidence after the root runtime artifact blocker is resolved.

No API contract drift was found in this planning review; no source edits were performed.