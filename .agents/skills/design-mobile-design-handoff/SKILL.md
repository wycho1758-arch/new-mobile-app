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
- Product/Planning decision records for P0 and P1 when the workflow has already passed either gate.

## Workflow

1. Load the accepted SoT and separate facts, assumptions, unknowns, non-goals, and open decisions.
2. Request the DESIGN.md decision before Stitch generation: `KEEP_EXISTING_DESIGN_MD`, `UPDATE_DESIGN_MD_REQUIRED`, or `BLOCKED_BY_DESIGN_SYSTEM_DECISION`. If the design system must change, block generation until the update decision is approved.
3. Reframe the requirement objectively in UI/UX terms: user goal, task flow, information architecture, navigation impact, hierarchy, interaction model, accessibility, and measurable acceptance signal.
4. Choose the design artifact level. ASCII is only for early flow alignment; do not approve implementation from text-only design. Use Stitch for high-fidelity mobile design whenever layout, interaction, or visual hierarchy matters.
5. Create the P0 Product/Planning approval packet before Stitch generation. It must explain the target requirement, why image and design artifacts are needed, what design decisions exactly two directions will explore, non-goals, expected evidence paths, requested date, DESIGN.md decision, and human-gate matrix.
6. Stop until Product/Planning records scope/evidence approval for the Design Stitch generation task. Valid P0 outcomes use existing Product/Planning readiness language: `READY_FOR_EXECUTION`, `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or `BLOCKED_BY_RUNTIME_CAPABILITY`. Product/Planning approves scope, non-goals, evidence readiness, and human-gate routing only; Design still owns design quality.
7. Explain the Stitch execution order to the user before running Stitch.
8. Enhance the Stitch prompt before any Stitch tool call. Use structure, content, platform, information architecture, interaction states, and professional UI/UX terms; keep visual tokens in `DESIGN.md` instead of duplicating theme values in generation prompts.
9. Produce exactly two Stitch design directions, Option A and Option B. Each option must cover all approved screens and default, loading, empty, error, and permission-denied states. Do not stop at one option and do not create a third option without a new approved requirement.
10. Use current `DESIGN.md` plus the selected design reference. For mobile handoff, translate visual intent to NativeWind, React Native primitives, and semantic tokens. Use shadcn-style component semantics only for Stitch HTML or optional web-console artifacts, never as a React Native implementation dependency.
11. Prefer Gemini 3.1 Pro, Pro, or Thinking mode as a best-effort Stitch model/mode request when the Stitch UI, MCP surface, or tool schema exposes model selection. If model selection is unavailable, record the requested model/mode, exposed tool capability, actual returned model/mode when available, and limitation in `manifest.json`.
12. After P0, fetch or save visual/image evidence only. Before P1, do not call or persist HTML extraction through `fetch_screen_code`, official ZIP `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent screen metadata that stores HTML download paths.
13. Compare both visual options against PRD acceptance, five-state completeness, accessibility, route/API impact, implementation complexity, and evidenceability.
14. Create the P1 Product/Planning scope/evidence approval packet after generated visuals and before HTML extraction. It must include actual image/design artifact summary, artifact purpose and reason, PRD acceptance mapping, option comparison, Design-selected candidate and rationale, alternate rejection/defer reason, risks, open decisions, and human-gate matrix.
15. Stop until Product/Planning records P1 scope/evidence approval for the HTML extraction task with `READY_FOR_EXECUTION`. If Product/Planning returns `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or `BLOCKED_BY_RUNTIME_CAPABILITY`, do not extract HTML.
16. After P1 approval only, extract both Stitch options as HTML using official ZIP `code.html` or Stitch MCP `fetch_screen_code`, and extract both option images through Stitch MCP `fetch_screen_image` when MCP is available.
17. Publish artifacts under project-root `design-pub-html/<YYYY-MM-DD>/`, including `option-a.html`, `option-a.png`, `option-b.html`, `option-b.png`, `manifest.json`, and `handoff.md`.
18. Build the handoff package: P0/P1 decision links, Stitch links, selected-option HTML, screen inventory, route impact, five-state matrix, accessibility notes, implementation constraints, UX acceptance criteria, evidence path, open decisions, and next responsible role.
19. Ask `design-reviewer` for read-only review before Mobile App Dev implementation starts when the handoff will drive code changes.

## Output

- Objective UI/UX requirement framing.
- DESIGN.md decision record: `KEEP_EXISTING_DESIGN_MD`, `UPDATE_DESIGN_MD_REQUIRED`, or `BLOCKED_BY_DESIGN_SYSTEM_DECISION`.
- P0 Product/Planning scope/evidence approval packet and decision before Stitch generation.
- P1 Product/Planning scope/evidence approval packet and decision before HTML extraction.
- Option comparison with exactly two options and selected-option rationale.
- Stitch handoff links, option HTML extraction from `code.html` or MCP fetch, and option image extraction from `fetch_screen_image`.
- Dated publication package under `design-pub-html/<YYYY-MM-DD>/`.
- Screen inventory, five-state matrix, accessibility notes, implementation constraints, UX acceptance criteria, evidence path, open decisions, and next responsible role.

## Forbidden

- Do not implement mobile UI, backend APIs, migrations, test flows, release operations, or app runtime changes.
- Do not use non-Stitch design authoring tools as canonical design output.
- Do not approve implementation from text-only design when layout, interaction, or hierarchy is unresolved.
- Do not expand PRD scope, add decorative work, or change acceptance criteria without Product/Planning approval.
- Do not ask Product/Planning to approve Design quality or own the selected design option; it approves scope/evidence readiness and human-gate routing only.
- Do not run Stitch generation before P0 Product/Planning approval.
- Do not fetch, persist, or publish HTML before P1 Product/Planning approval, including `fetch_screen_code`, `code.html`, SDK `getHtml`, or `htmlCode.downloadUrl`.
- Do not expose tokens, API keys, credentials, `.env` values, or Google credentials in chat, files, evidence, or command output.
- Do not modify external platform/runtime repositories or external platform/runtime configuration.
- Do not create `po-*` Design aliases for this handoff path.

## Required Evals

- Positive: approved mobile requirement requiring Stitch handoff triggers this skill.
- Negative: Mobile App Dev implementation request does not trigger this skill.
- Negative: review-only design review request does not trigger this skill.
