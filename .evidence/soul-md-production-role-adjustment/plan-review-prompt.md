Review this implementation plan before any soul-md role document implementation begins.

User request:
- Apply the previously reported "minimal required adjustments" to the actual soul-md files.
- Then inspect with Reviewer and report.
- Do not over-spec. Focus on LLM main agents using A2A/computer-use to build production-level mobile app services.

Verified Source of Truth:
- AGENTS.md: TDD required; do not hardcode secrets; packages/contracts is the API schema SoT; apps/api is optional Hono + Drizzle backend; migrations use drizzle-kit generate plus programmatic migrate; no direct main push.
- PROJECT_ENVIRONMENT.md: apps/api exists as Hono/Drizzle/postgres/zod; API runtime has database URL, port, and bearer auth secret env requirements; team uses wm read-only reviewer evidence.
- .agents/skills/mobile-backend-api-integrator-workflow/references/sot.md: Backend/API Integrator SOUL.md is page 1373700180.
- .agents/skills/mobile-app-dev-workflow/references/sot.md: Mobile App Dev SOUL.md is page 1373700159.
- Existing soul-md docs: Mobile App Dev already implements Expo RN features from approved tasks/contracts; Backend/API Integrator currently owns contracts/auth/session/data shape/error mapping/mocks/backend PR; QA/Release owns Maestro/EAS/evidence/release gates; Security/Privacy appears in planning review matrix but has no standalone soul-md; Mobile Architect is trigger-based for architecture/API/EAS impact.

Planned changes:
1. Add narrow validator assertions to scripts/validate-team-doc.mjs before document edits:
   - Backend/API Integrator doc must explicitly include Backend/API Service Owner and production backend service ownership terms: backend implementation, DB schema/migration, deployment/runtime smoke, rollback note, service evidence.
   - QA/Release doc must explicitly stay verifier/gate owner and must not be backend implementer/deploy owner.
   - Planning completeness/work-unit docs must keep Security/Privacy as a conditional reviewer/gate, not an always-on main implementation agent.
   - Mobile Architect practice doc must keep trigger-based participation.
2. Update soul-md-backend-api-integrator-1373700180.md minimally:
   - Reframe as Backend/API Integrator and service owner.
   - Add backend implementation, DB schema/migration, deployment config, runtime smoke, rollback note, service evidence, and apps/api/contracts boundaries.
   - Keep Mobile App Dev separation and no optional infrastructure/secrets.
3. Update soul-md-qa-release-1373700201.md minimally:
   - Add backend smoke/release-readiness evidence verification.
   - Explicitly state QA/Release does not implement backend service, own DB migrations, or operate deployment runtime.
4. Update Product/Planning review/planning docs minimally:
   - State Security/Privacy is conditional reviewer/gate for auth/PII/payment/permissions/policy-sensitive work, not a standing implementation agent.
   - Preserve "include only relevant roles" and no speculative role expansion.
5. Update Mobile Architect practice only if needed to reinforce trigger-based participation.

Expected verification:
- node scripts/validate-team-doc.mjs
- pnpm run test:runtime if the changed validator should remain compatible with runtime validation

Evidence:
- Persist plan review at .evidence/soul-md-production-role-adjustment/plan-review.md
- Persist final review at .evidence/soul-md-production-role-adjustment/final-review.md

Review questions:
- Is this plan consistent with the SoT and the user's no-over-spec constraint?
- Does it correctly avoid adding a new human/mobile developer role?
- Does it put production backend delivery ownership in Backend/API rather than QA/Release?
- Does it keep Security/Privacy conditional and Mobile Architect trigger-based?
- Are the planned tests/evidence sufficient for a docs/runtime-boundary change?
