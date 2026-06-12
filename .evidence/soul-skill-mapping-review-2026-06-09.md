Direct answer: the draft mapping is accurate. I found no clear false positives or false negatives for “currently installed repo-local Codex skills under `.agents/skills/<skill-name>/SKILL.md`.”

Installed repo-local skills are only:

- `wm`
- `mobile-app-dev-workflow`
- `mobile-backend-api-integrator-workflow`

The repo defines native Codex repo skills at `.agents/skills/<skill-name>/SKILL.md`, and the current filesystem listing only contains those three `SKILL.md` files. The broader `mobile-prd-to-execution`, `mobile-design-handoff`, `mobile-api-contract`, `mobile-qa-release`, and `mobile-gatekeeper` names are documented in team-doc skill-pack/runtime docs, but are not currently installed under `.agents/skills`.

Findings by role:

- Backend/API Integrator: correct. `mobile-backend-api-integrator-workflow` is installed and directly matches Backend/API contract, schemas, mocks, fixtures, auth/session, and integration risk work. `mobile-api-contract` is documented as repo skill-pack work but not installed locally.
- Design: correct. No installed repo-local Design-owned skill. `mobile-design-handoff` is documented as organization-runtime, not installed.
- Mobile App Dev: correct. `mobile-app-dev-workflow` is installed and directly matches Expo React Native implementation work. `mobile-api-contract` is consumed by the role in docs, but is not installed locally.
- Mobile Architect: correct with one nuance. No installed repo-local architecture-only skill exists. Docs make Architect a co-owner/reviewer for API contracts and release/design concerns, but that maps to documented pack skills, not installed `.agents/skills`.
- Product/Planning: correct. No installed repo-local Product/Planning-owned skill. `mobile-prd-to-execution` is organization-runtime/documented.
- QA/Release: correct. No installed repo-local QA/Release-owned skill. `mobile-qa-release` and `mobile-gatekeeper` are documented as repo skill-pack/deterministic gate entries, but not installed locally.

Ambiguity to preserve in wording: `mobile-api-contract`, `mobile-qa-release`, and `mobile-gatekeeper` are documented as “new-mobile-app repo skill pack” items, so they are repo-scoped in the planning docs, but they are not currently installed native Codex repo-local skills under `.agents/skills`.

Key sources:

- [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:13) defines repo skill path.
- [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:153) confirms repo skills live under `.agents/skills`.
- [.agents/skills/wm/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/wm/SKILL.md:1) says `wm` is explicit `$wm` or `/wm` only.
- [.agents/skills/mobile-app-dev-workflow/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/mobile-app-dev-workflow/SKILL.md:1) defines the installed Mobile App Dev workflow skill.
- [.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md:1) defines the installed Backend/API workflow skill.
- [01-4 Skills](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362.md:22) distinguishes organization-runtime vs new-mobile-app repo skill packs.
- [01-4 Skills matrix](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362.md:60) lists the documented MVP skill-pack entries.
- [Role-specific Skills](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964/skills-1374290005.md:70) documents the two role wrappers.

Version/date assumptions: local docs are current to `PROJECT_ENVIRONMENT.md` “Last updated: 2026-06-09” and team-doc files fetched at `2026-06-09T03:41:15.000Z`. No files were modified.