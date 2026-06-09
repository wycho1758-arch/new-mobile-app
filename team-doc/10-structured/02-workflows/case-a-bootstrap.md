---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case A. 신규 프로젝트 bootstrap"
---

# Case A. 신규 프로젝트 bootstrap

Create a new mobile repo from the Confluence-designed monorepo template, then add the org operating layers (gatekeeper, evidence, repo-scoped skills, PR template) on top to produce a runnable repo.

## Participants

- Product/Planning
- Mobile Architect
- QA/Release
- Mobile App Dev
- Operator (human) — work outside the agent operating surface, such as repo creation and registering required checks

## Procedure

1. Product/Planning fixes the repo purpose and initial scope/non-goals and records them in the scope decision log. The operator (human) creates the new mobile repo and fills in the template variables from design doc §3 (APP_DISPLAY_NAME, APP_SLUG, IOS_BUNDLE_IDENTIFIER, ANDROID_PACKAGE, API_URL, etc.). GitHub org/account and EAS owner are 01-8 §11 decisions; agents have no repo admin rights.
2. Mobile Architect approves the template defaults (pnpm + Turborepo + Expo Router + NativeWind + Jest + zod) and only decides changes where an exception is required.
3. The new repo's operating layer ships `apps/mobile/eas.json`, `apps/mobile/.eas/workflows`, `apps/mobile/.maestro` (template-provided), plus the gatekeeper layer (repo-root GitHub workflow + script) and the `.evidence/` convention (including its README) — these are 01-7 Phase 3 outputs. QA/Release confirms EAS/Maestro workflows run and a smoke flow exists.
4. Mobile App Dev verifies the initial app shell (template home-counter sample + `packages/contracts` import) runs.
5. `mobile-gatekeeper` inspects the initial PR.

## Completion criteria

- pnpm workspace + Turborepo work, and `packages/contracts` resolves from `apps/mobile`
- Expo app builds locally and in CI
- EAS preview workflow exists
- Maestro smoke flow exists
- GitHub required check exists (registered by the operator — repo admin)
- `.evidence/README.md` exists
- An architecture decision note (ADR-style, recording the deviation rationale) exists for any template-exception decision
- A recorded Mobile Architect / QA-Release agreement on the EAS profile strategy (preview/internal/production) exists

## Source

- Page ID: 1373667425
- Source heading: Case A. 신규 프로젝트 bootstrap
- Source version: 2
