Direct answer: the plan is acceptable with one verification adjustment.

Keep the scope to:

- `scripts/validate-team-doc.mjs`
- `team-doc/.../soul-md-mobile-architect-1373667383.md`

The TDD order is correct: add the narrow `requireDocTerms(...)` assertion first, run `node scripts/validate-team-doc.mjs` and confirm it fails, then update the Mobile Architect SOUL.md and rerun.

Required wording guardrail: phrase “code vulnerability review” as app-side architecture/security-risk review, not as owning the Security/Privacy gate. The SOUL already assigns Mobile Architect architecture, API boundary, template-default, PR review, risk-list, and human escalation duties, while explicitly not replacing Backend/API Integrator, QA/Release, Product/Planning, or human gates.

Recommended verification change:

- Always run `node scripts/validate-team-doc.mjs`.
- Run `pnpm run test:runtime` if the change is treated as runtime validation work.
- Consider `pnpm run test:local-harness` only if the implementer classifies the `scripts/` validator change as a Codex runtime script change under AGENTS.md, or if `.agents/`, `.codex/`, or `evals/` paths are touched.

Sources checked:

- `AGENTS.md:7`, `AGENTS.md:31-32`, `AGENTS.md:80-84`, `AGENTS.md:96-106`
- `PROJECT_ENVIRONMENT.md:12-15`, `PROJECT_ENVIRONMENT.md:173-196`, `PROJECT_ENVIRONMENT.md:229-235`
- `.agents/skills/wm/SKILL.md:14-18`, `.agents/skills/wm/SKILL.md:27-43`, `.agents/skills/wm/SKILL.md:65-75`
- `scripts/validate-team-doc.mjs:204-255`
- Mobile Architect SOUL: `team-doc/.../soul-md-mobile-architect-1373667383.md:55-77`, `:89-103`, `:125-154`, `:171-177`
- 01-8 methodology: `team-doc/.../01-8-...md:824-838`
- 01-6 rules: `team-doc/.../01-6-...md`, sections 5.1-5.6

Version/date assumptions: local SoT files are fetched/updated on 2026-06-09. No external docs were needed.

Uncertainty: `test:runtime` currently does not call `validate-team-doc.mjs`; package scripts show it runs `validate-runtime-artifacts` and hook tests. So `node scripts/validate-team-doc.mjs` is the decisive check for this plan’s new assertion.