# SOUL Skill Mapping Review Request

Review this read-only mapping for the current repository.

Task: Verify which currently installed repo-local Codex skills under `.agents/skills/<skill-name>/SKILL.md` are actually related to each listed SOUL role's own work. Distinguish installed repo-local skills from documented/planned organization-runtime or repo-pack skills that are present only in `team-doc`.

Source files to inspect:
- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `.agents/skills/wm/SKILL.md`
- `.agents/skills/mobile-app-dev-workflow/SKILL.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
- `team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362.md`
- `team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964/skills-1374290005.md`
- The six SOUL files listed by the user under `team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-5-soul-md-템플릿-1373700138/`.

Draft mapping to verify:
- Backend/API Integrator: `mobile-backend-api-integrator-workflow` is an installed repo-local skill related to its own backend/API contract work. `wm` is available only when explicitly invoked as `$wm` or `/wm`, not as a normal SOUL role skill. `mobile-api-contract` is documented as a repo skill pack skill but is not currently installed under `.agents/skills`.
- Design: no installed repo-local role skill directly related to Design's own work. `mobile-design-handoff` is documented as organization-runtime, not installed under `.agents/skills`. `wm` is explicit-invocation only.
- Mobile App Dev: `mobile-app-dev-workflow` is an installed repo-local skill related to its own Expo React Native implementation work. `mobile-api-contract` is documented as a repo skill pack skill consumed by this role, but is not currently installed under `.agents/skills`. `wm` is explicit-invocation only.
- Mobile Architect: no installed repo-local skill solely for its own architecture work. It is reviewer/co-owner for contract/design/release concerns in the docs, but `mobile-api-contract` is not currently installed under `.agents/skills`. `wm` is explicit-invocation only.
- Product/Planning: no installed repo-local role skill directly related to Product/Planning's own work. `mobile-prd-to-execution` is documented as organization-runtime, not installed under `.agents/skills`. `wm` is explicit-invocation only.
- QA/Release: no installed repo-local role skill directly related to QA/Release's own work. `mobile-qa-release` and `mobile-gatekeeper` are documented as repo skill pack/deterministic gate, but are not currently installed under `.agents/skills`. `wm` is explicit-invocation only.

Review requirements:
- Operate read-only.
- Include source references for all findings.
- Call out any false positive, false negative, or ambiguity in the draft mapping.
- Do not recursively delegate.
