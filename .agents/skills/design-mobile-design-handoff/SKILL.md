---
name: design-mobile-design-handoff
description: Use when Design must convert an approved mobile plan, requirement, or PRD slice into a Stitch-backed implementation handoff. This repo-local Codex adapter maps mobile-design-handoff to design-* naming and must produce objective UI/UX framing, DESIGN.md decision handling, exactly two Stitch screen design options, HTML and image extraction, dated design-pub-html publication, state matrix, UX acceptance, and evidence without implementing app code.
---

# Design Mobile Design Handoff

Use this Design adapter after Product/Planning has approved the requirement or PRD slice and before Mobile App Dev starts UI implementation.

## Source Crosswalk

- Local Codex skill: `design-mobile-design-handoff`
- Design source skill: `mobile-design-handoff`
- Design source skill page: `1373765661`
- Design SOUL page: `1373765702`
- Codex practice page: `1374290207`

The `design-*` slug is the required repo-local Codex adapter name for Design-owned Stitch handoff work.

## Required Inputs

- Approved requirement, PRD slice, Story, or bounded work unit.
- Target route, platform, user goal, known backend/API dependency, non-goals, and human-gate flags.
- Current `DESIGN.md`, relevant Stitch link or Stitch project context, and expected evidence path.
- Requested publication date for `design-pub-html/<YYYY-MM-DD>/`; record the requested date separately from actual generation timestamp.
- Known implementation constraints for Expo Router, React Native primitives, NativeWind, semantic tokens, and stable testID needs.

## Workflow

1. Load the accepted SoT and separate facts, assumptions, unknowns, non-goals, and open decisions.
2. Request the DESIGN.md decision: keep the current `DESIGN.md` as the design-system SoT when approved; otherwise raise a design-system update decision before handoff.
3. Reframe the requirement objectively in UI/UX terms: user goal, task flow, information architecture, navigation impact, hierarchy, interaction model, accessibility, and measurable acceptance signal.
4. Choose the design artifact level. ASCII is only for early flow alignment; do not approve implementation from text-only design. Use Stitch for high-fidelity mobile design whenever layout, interaction, or visual hierarchy matters.
5. Explain the Stitch execution order to the user before running Stitch.
6. Produce exactly two Stitch screen design options, Option A and Option B. Do not stop at one option and do not create a third option without a new approved requirement.
7. Use current `DESIGN.md` plus the selected design reference. For mobile handoff, translate visual intent to NativeWind, React Native primitives, and semantic tokens. Use shadcn-style component semantics only for Stitch HTML or optional web-console artifacts, never as a React Native implementation dependency.
8. Compare both options against PRD acceptance, five-state completeness, accessibility, route/API impact, implementation complexity, and evidenceability.
9. Select exactly one design option for handoff, record why it was selected, and record why the alternate option was rejected or deferred.
10. Author or update the selected design in Stitch only. Confirm Stitch MCP availability with the pinned repo MCP config, or record a fallback reason when official ZIP export is used.
11. Extract both Stitch options as HTML using official ZIP `code.html` or Stitch MCP `fetch_screen_code`, and extract both option images through Stitch MCP `fetch_screen_image` when MCP is available.
12. Publish artifacts under project-root `design-pub-html/<YYYY-MM-DD>/`, including `option-a.html`, `option-a.png`, `option-b.html`, `option-b.png`, `manifest.json`, and `handoff.md`.
13. Build the handoff package: Stitch links, selected-option HTML, screen inventory, route impact, five-state matrix, accessibility notes, implementation constraints, UX acceptance criteria, evidence path, open decisions, and next responsible role.
14. Ask `design-reviewer` for read-only review before Mobile App Dev implementation starts when the handoff will drive code changes.

## Output

- Objective UI/UX requirement framing.
- DESIGN.md decision record: `KEEP_EXISTING_DESIGN_MD`, `UPDATE_DESIGN_MD_REQUIRED`, or `BLOCKED_BY_DESIGN_SYSTEM_DECISION`.
- Option comparison with exactly two options and selected-option rationale.
- Stitch handoff links, option HTML extraction from `code.html` or MCP fetch, and option image extraction from `fetch_screen_image`.
- Dated publication package under `design-pub-html/<YYYY-MM-DD>/`.
- Screen inventory, five-state matrix, accessibility notes, implementation constraints, UX acceptance criteria, evidence path, open decisions, and next responsible role.

## Forbidden

- Do not implement mobile UI, backend APIs, migrations, test flows, release operations, or app runtime changes.
- Do not use non-Stitch design authoring tools as canonical design output.
- Do not approve implementation from text-only design when layout, interaction, or hierarchy is unresolved.
- Do not expand PRD scope, add decorative work, or change acceptance criteria without Product/Planning approval.
- Do not expose tokens, API keys, credentials, `.env` values, or Google credentials in chat, files, evidence, or command output.
- Do not modify external platform/runtime repositories or external platform/runtime configuration.
- Do not create `po-*` Design aliases for this handoff path.

## Required Evals

- Positive: approved mobile requirement requiring Stitch handoff triggers this skill.
- Negative: Mobile App Dev implementation request does not trigger this skill.
- Negative: review-only design review request does not trigger this skill.
