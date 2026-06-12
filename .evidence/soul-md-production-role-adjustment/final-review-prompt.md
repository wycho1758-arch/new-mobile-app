Review the completed soul-md production role adjustment. Operate read-only and do not edit files.

User request:
- Apply the "minimal required adjustments" to actual soul-md files.
- Review with Reviewer and report.
- No over-spec. Focus on production-level service development by LLM main agents using A2A/computer-use.

Changed paths to inspect:
- scripts/validate-team-doc.mjs
- team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-5-soul-md-템플릿-1373700138/soul-md-backend-api-integrator-1373700180.md
- team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-5-soul-md-템플릿-1373700138/soul-md-qa-release-1373700201.md
- team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-5-soul-md-템플릿-1373700138/soul-md-product-planning-1373798422/mobile-planning-completeness-review-1374519387.md
- team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-5-soul-md-템플릿-1373700138/soul-md-product-planning-1373798422/mobile-work-unit-planning-and-agent-sprint-1374650456.md
- team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-5-soul-md-템플릿-1373700138/soul-md-mobile-architect-1373667383/mobile-architect-codex-cli-실무-지침-1374519454.md

Implementation summary:
- Added team-doc validator assertions so required role-boundary terms must remain present.
- Backend/API Integrator is now also Backend/API Service Owner for approved backend implementation, DB schema/migration, deployment config, runtime smoke, rollback note, and service evidence.
- QA/Release now verifies backend smoke and release-readiness evidence for API-backed releases, but explicitly does not implement backend service, own DB migrations, or operate deployment runtime.
- Product/Planning docs now state Security/Privacy is a conditional reviewer/gate, not a standing implementation agent.
- Mobile Architect practice doc now explicitly says the role is trigger-based.
- No new human/mobile developer role was added.
- No new SRE/DevOps/platform team was added.

Verification run:
- `node scripts/validate-team-doc.mjs` passed:
  `Validated team-doc: 71 source files, 32 structured files.`
- `pnpm run test:hooks` passed:
  `Passed 40 hook fixture tests.`
- `pnpm run test:runtime` failed before hooks because of pre-existing root Claude runtime artifacts:
  `root Claude runtime artifact must not be present: CLAUDE.md`
  `root Claude runtime artifact must not be present: .claude`
- `node scripts/validate-runtime-artifacts.mjs` reports the same pre-existing blockers.

Review questions:
- Do the changes satisfy the user's minimal adjustment request without over-spec?
- Does Backend/API now own production backend service delivery clearly enough?
- Does QA/Release remain a verifier/gate rather than backend implementation/deploy owner?
- Is Security/Privacy correctly conditional?
- Is Mobile Architect correctly trigger-based?
- Are the validator assertions appropriate and not too broad?
- Are there any findings that should block reporting this as complete, given the known unrelated runtime artifact blockers?
