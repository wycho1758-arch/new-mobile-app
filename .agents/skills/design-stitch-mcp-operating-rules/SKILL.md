---
name: design-stitch-mcp-operating-rules
description: Use when Design work will run Stitch MCP or define Stitch handoff rules. This design-* skill enforces the Design SOUL Stitch-only contract, DESIGN.md decision handling, exactly two screen design options, Stitch HTML and image extraction, dated design-pub-html publication, shadcn-compatible HTML semantics for Stitch artifacts, mobile NativeWind/RN handoff constraints, and reviewer evidence without implementing app code.
---

# Design Stitch MCP Operating Rules

Use this skill with `design-mobile-design-handoff` whenever Stitch MCP is used to turn a plan into concrete screen design and HTML.

## Source Crosswalk

- Local Codex skill: `design-stitch-mcp-operating-rules`
- Design source skill: `mobile-design-handoff`
- Design source skill page: `1373765661`
- Design SOUL page: `1373765702`
- Codex practice page: `1374290207`

## Required Sequence

1. Explain the execution order to the user before running Stitch.
2. Load the approved plan or requirement, current `DESIGN.md`, selected design reference, target route, platform, non-goals, and requested publication date.
3. Reframe the request objectively in UI/UX terms: user goal, task flow, information architecture, hierarchy, interaction model, accessibility, and measurable acceptance signal.
4. Confirm the `DESIGN.md` decision: keep current `DESIGN.md`, require update, or block on design-system approval.
5. Confirm Stitch MCP uses the pinned repo config, Google Application Default Credentials, and a project value without printing credentials, tokens, `.env`, or Google credential content.
6. Create or select a Stitch project and apply the design-system context from `DESIGN.md` and the selected reference.
7. Generate exactly two screen design options, Option A and Option B.
8. Fetch both options as HTML through Stitch MCP `fetch_screen_code` or official ZIP `code.html`.
9. Fetch both option images through Stitch MCP `fetch_screen_image` when MCP access is available.
10. Publish artifacts under project-root `design-pub-html/<YYYY-MM-DD>/`.
11. Produce `handoff.md` and `manifest.json`, then request `design-reviewer` read-only review.

## Artifact Contract

The publication folder must contain:

- `option-a.html`
- `option-a.png`
- `option-b.html`
- `option-b.png`
- `manifest.json`
- `handoff.md`

The manifest records requested date, actual generation timestamp, Stitch project id or share link when available, screen ids, selected option, source inputs, and artifact filenames. If the requested date differs from the current date, record both dates.

## Design Constraints

- Stitch is the canonical authoring tool.
- `DESIGN.md` is the design-system source of truth.
- Use shadcn-compatible component semantics for Stitch HTML artifacts when useful, but do not require shadcn/ui in React Native screens.
- Mobile implementation handoff must remain NativeWind, React Native primitives, semantic tokens, and stable testID oriented.
- Every screen must include default, loading, empty, error, and permission-denied states.
- Do not expand PRD scope, invent backend contracts, or add decorative work outside approved acceptance criteria.

## Forbidden

- Do not implement mobile UI, backend APIs, migrations, test flows, release operations, or app runtime changes.
- Do not use non-Stitch design authoring tools as canonical design output.
- Do not print or persist API keys, tokens, Google credentials, `.env` values, or credential file contents.
- Do not use `@latest` for Stitch MCP.
- Do not produce one option or three options for the same request.
- Do not create `po-*` Design aliases for this handoff path.
- Do not modify external platform/runtime repositories or external platform/runtime configuration.

## Required Evals

- Positive: Stitch MCP design handoff request triggers this rule skill.
- Negative: mobile implementation request does not trigger this rule skill.
- Negative: review-only design review request does not trigger this rule skill.
