**Findings**

Critical: None.

High: Assigning `CTO` to Product/Planning would conflict with current authority boundaries. Product/Planning owns intake, scope, readiness, non-goals, evidence expectations, and handoff routing, but explicitly must not implement app/backend/design/release work or approve Design quality. See `team-doc/mobile-app-dev-team/02-role-souls/product-planning-soul.md:5`, `:7-10`, `:76-78`, `:90-97`. Mobile Architect owns route/state impact, module boundaries, runtime policy, template deviations, API contract co-review, releaseability risk, and technical coordination. See `team-doc/mobile-app-dev-team/02-role-souls/mobile-architect-soul.md:5`, `:7-10`, `:18-28`, `:75-77`.

High: `CTO` must not become a runtime role, agent, or fixture under current SoT. The local harness states the six LLM roles are fixed and that `CTO` is not a mobile organization runtime role. See `evals/local-harness/README.md:7-10`, `evals/local-harness/sot/snapshot.json:107-122`. The harness also rejects CTO agent files and CTO role fixtures in `scripts/test-local-harness.mjs:190-194`, `:271-275`.

Medium: The “receives user instructions and communicates downward” argument describes Product/Planning’s intake/coordinator role, not CTO authority. Work process says Product/Planning receives the request and runs planning/readiness steps, but implementation and technical decisions are routed to role owners. See `team-doc/mobile-app-dev-team/05-work-processes.md:3-10`, `:33-40`. Team composition says Product/Planning owns scope/readiness, while Mobile Architect owns architecture coherence and must not absorb implementation/backend ownership. See `team-doc/mobile-app-dev-team/01-team-composition.md:24-31`.

Medium: The active skills matrix supports Product/Planning as Product/Planning/PO, not CTO. `po-*` skills are mapped to Product/Planning for clarification, work-unit sizing, PRD decomposition, and readiness review. See `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md:7-18`. Mobile Architect currently has no dedicated repo-local skill, but its SOUL still defines technical authority and routing. See `team-doc/mobile-app-dev-team/02-role-souls/mobile-architect-soul.md:47-52`.

Low: There is already a draft title plan that recommends keeping operating roles stable while adding human-readable position titles. That draft maps `CTO / Mobile Technical Lead` to `Mobile Architect` and `Product Manager / Product Owner` to `Product/Planning`. See `team-doc/mobile-app-dev-team/08-role-title-update-plan.md:35-45`, `:47-68`, `:202-211`. Because the file is marked “검토용 초안,” it supports the recommendation but should not override higher-priority SoT without approval. See `team-doc/mobile-app-dev-team/08-role-title-update-plan.md:3`.

**Recommendation**

Do not make Product/Planning the CTO. Map Product/Planning to `Product Manager / Product Owner`, or possibly `CPO-like` only as a human-readable product/executive coordinator title if you want executive wording. Keep technical CTO-style naming with `Mobile Architect`, preferably as `Mobile Technical Lead` or `CTO / Mobile Technical Lead`.

Use this split:

| Human-readable title | Operating Role | Boundary |
| --- | --- | --- |
| Product Manager / Product Owner | Product/Planning | Scope, requirements, readiness, evidence, human-gate routing |
| CTO / Mobile Technical Lead | Mobile Architect | Architecture coherence, runtime/dependency risk, route/state/API technical coordination |

Implementation later should preserve operating role names unless you intentionally update the runtime contracts. Required evidence if files change: add/update the narrowest validator/eval first, likely `scripts/validate-team-doc.mjs` and local harness fixtures if role-title structure changes; then update `team-doc/mobile-app-dev-team/*`; run `pnpm run validate:team-doc`, `pnpm run test:runtime`, and `pnpm run test:local-harness` for runtime/doc contract changes. If only docs change, mobile-mcp/visual QA is not applicable.