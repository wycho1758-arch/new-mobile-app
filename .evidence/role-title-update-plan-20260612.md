# Role Title Update Plan

Date: 2026-06-12
Mode: planning only
Scope: `mobile-app-dev-team/02-role-souls/` and directly linked team-doc role title references

## Objective

Make role documents easier for users to understand by consistently presenting human-readable role titles such as `Mobile App Developer`, `QA/Release Engineer`, and `Product Designer`, while preserving the existing runtime role identities used by skills, agents, fixtures, gates, handoffs, validators, and work-unit status files.

## Source Of Truth Inputs

- `AGENTS.md`: Codex runtime paths, evidence paths, and required runtime gates.
- `PROJECT_ENVIRONMENT.md`: root runtime gate requirements, including `test:runtime` and conditional `test:local-harness`.
- `mobile-app-dev-team/08-role-title-update-plan.md`: `Display Title` is the human-readable title; `Operating Role` is the runtime role value.
- `mobile-app-dev-team/02-role-souls/design-soul.md`: current `Display Title: Product Designer` and `Operating Role: Design`.
- `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md`: current `Display Title: Mobile App Developer` and `Operating Role: Mobile App Dev`.
- `mobile-app-dev-team/02-role-souls/qa-release-soul.md`: current `Display Title: QA/Release Engineer` and `Operating Role: QA/Release`.
- `scripts/validate-team-doc.mjs`: exact expected SOUL H1s and `Display Title` / `Operating Role` metadata.
- `scripts/lib/work-unit-machine.mjs`: exact stage owner role values.
- `.evidence/role-title-impact-review-20260612.md`: prior `wm-implementation-reviewer` impact review with `GO` verdict.

## Owner Role

Product/Planning owns the documentation update plan and scope containment. Runtime implementation, API contract, mobile UI, QA release execution, and external platform changes are out of scope.

## Non-Goals

- Do not rename `Operating Role` values.
- Do not rename SOUL H1s.
- Do not rename skill slugs, agent slugs, work-unit stages, `status.owner_role`, `handoff.next_role`, fixture role values, or reviewer JSON owner enums.
- Do not create a Gatekeeper SOUL.
- Do not update mobile app runtime code, API contracts, EAS, Railway, Stitch, or external platform repositories.

## Proposed Update Shape

1. Keep the metadata block in each role SOUL as the canonical title bridge:
   - `Display Title: <human-readable title>`
   - `Operating Role: <runtime role>`
   - `Authority Level: <role authority>`
2. If the SOUL body is changed, adjust only reader-facing identity text so it says the human title first and names the operating role second. Example pattern:
   - `You are the Mobile App Developer operating under the Mobile App Dev runtime role...`
   - `You are the Product Designer operating under the Design runtime role...`
   - `You are the QA/Release Engineer operating under the QA/Release runtime role...`
3. Keep cross-role references in tables and handoffs on `Operating Role` where they describe runtime routing or ownership.
4. Use `Display Title` where the text is explaining people-facing team composition, capability, or responsibilities.
5. Preserve all existing validator-required terms unless a validator update is intentionally made first.

## TDD / Validation Plan

1. Before any implementation edit, run or update the narrowest validator coverage:
   - Minimum: `pnpm run validate:team-doc`.
   - If the implementation changes validator expectations, update `scripts/validate-team-doc.mjs` first and confirm the pre-change failure or changed assertion target.
2. After implementation:
   - Run `pnpm run validate:team-doc`.
   - Run `pnpm run test:runtime` because `mobile-app-dev-team/` documentation is included in runtime gates.
   - Run `pnpm run test:local-harness` for any actual `mobile-app-dev-team/**` implementation diff, including display-title or body wording-only changes, because the quality gate condition includes that path.
   - If the implementation also changes runtime-facing role identity, fixture, agent, skill, script, or harness paths, treat it as a high-impact runtime migration and update the affected validator/fixture/harness coverage first.

## Expected Gate Impact

- Display-title/body wording-only update under `mobile-app-dev-team/**`: low semantic impact, but expected gates are `validate:team-doc`, `test:runtime`, and `test:local-harness`.
- Any change to `Operating Role`, SOUL H1, skill/agent slug, fixture role, status role, reviewer owner enum, or preflight identity: high impact runtime migration; requires validator, fixture, resolver, reviewer-envelope, preflight, and local-harness updates together.

## Review Requirement

Before implementation, this plan must receive read-only `wm-implementation-reviewer` review evidence. After implementation, actual diff and command output must receive final read-only reviewer evidence before Done.
