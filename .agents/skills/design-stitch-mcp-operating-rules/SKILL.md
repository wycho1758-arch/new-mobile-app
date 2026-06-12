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
4. Confirm the `DESIGN.md` decision before Stitch generation: `KEEP_EXISTING_DESIGN_MD`, `UPDATE_DESIGN_MD_REQUIRED`, or `BLOCKED_BY_DESIGN_SYSTEM_DECISION`.
5. Build the P0 Product/Planning approval packet before Stitch generation. Include artifact purpose and reason, exactly two proposed design directions, non-goals, expected artifact paths, requested date, DESIGN.md decision, and human-gate matrix.
6. Stop until Product/Planning records scope/evidence approval for the Design Stitch generation task. Valid P0 outcomes use existing Product/Planning readiness language: `READY_FOR_EXECUTION`, `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or `BLOCKED_BY_RUNTIME_CAPABILITY`. Product/Planning approves scope, non-goals, evidence readiness, and human-gate routing only; it does not approve Design quality or own the selected option.
7. Confirm Stitch MCP uses the pinned repo config, Google Application Default Credentials, and a project value without printing credentials, tokens, `.env`, or Google credential content.
8. Create or select a Stitch project and apply the design-system context from `DESIGN.md` and the selected reference.
9. Apply prompt enhancement before any Stitch generation: structure the prompt around platform, content, page/screen structure, information hierarchy, interactions, states, and UI/UX terminology; avoid duplicating DESIGN.md token values in generation prompts.
10. Prefer Gemini 3.1 Pro, Pro, or Thinking mode as a best-effort model/mode request when the Stitch UI, MCP surface, or tool schema exposes model selection. Record requested model/mode, exposed tool capability, actual returned model/mode when available, and any limitation in `manifest.json`.
11. Generate exactly two design directions, Option A and Option B. Each option must cover all approved screens and the five required states.
12. Before P1, fetch or save image/visual evidence only. Do not call or persist HTML extraction through Stitch MCP `fetch_screen_code`, official ZIP `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent screen metadata that stores HTML download paths.
13. Produce the P1 Product/Planning scope/evidence approval packet from actual generated visuals. Include image/design artifact summary, purpose and reason, PRD acceptance mapping, option comparison, Design-selected candidate and rationale, alternate rejection/defer reason, risk/open decision list, and human-gate matrix.
14. Stop until Product/Planning records P1 scope/evidence approval for HTML extraction with `READY_FOR_EXECUTION`. If the P1 decision is `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or `BLOCKED_BY_RUNTIME_CAPABILITY`, do not extract HTML.
15. After P1 approval only, fetch both options as HTML through Stitch MCP `fetch_screen_code` or official ZIP `code.html`.
16. Fetch both option images through Stitch MCP `fetch_screen_image` when MCP access is available.
17. Publish artifacts under project-root `design-pub-html/<YYYY-MM-DD>/`.
18. Produce `handoff.md` and `manifest.json`, then request `design-reviewer` read-only review.

## Artifact Contract

The publication folder must contain:

- `option-a.html`
- `option-a.png`
- `option-b.html`
- `option-b.png`
- `manifest.json`
- `handoff.md`

The manifest records requested date, actual generation timestamp, Stitch project id or share link when available, screen ids, selected option, source inputs, and artifact filenames. If the requested date differs from the current date, record both dates.

The manifest also records P0/P1 Product/Planning decision artifact paths, requested Stitch model/mode, actual model/mode when returned, model/mode selection capability, and any limitation when Gemini 3.1 Pro or Thinking mode cannot be selected through the available Stitch surface.

## Design Constraints

- Stitch is the canonical authoring tool.
- `DESIGN.md` is the design-system source of truth.
- Use shadcn-compatible component semantics for Stitch HTML artifacts when useful, but do not require shadcn/ui in React Native screens.
- Mobile implementation handoff must remain NativeWind, React Native primitives, semantic tokens, and stable testID oriented.
- Every screen must include default, loading, empty, error, and permission-denied states.
- Product/Planning approval is scope/evidence approval for PRD fit, non-goals, evidence readiness, and human-gate routing; Design remains responsible for design quality and design-reviewer evidence.
- Do not expand PRD scope, invent backend contracts, or add decorative work outside approved acceptance criteria.

## Forbidden

- Do not implement mobile UI, backend APIs, migrations, test flows, release operations, or app runtime changes.
- Do not use non-Stitch design authoring tools as canonical design output.
- Do not print or persist API keys, tokens, Google credentials, `.env` values, or credential file contents.
- Do not use `@latest` for Stitch MCP.
- Do not produce one option or three options for the same request.
- Do not run Stitch generation before P0 Product/Planning approval.
- Do not call or persist `fetch_screen_code`, `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent HTML extraction before P1 Product/Planning approval.
- Do not create `po-*` Design aliases for this handoff path.
- Do not modify external platform/runtime repositories or external platform/runtime configuration.

## Required Evals

- Positive: Stitch MCP design handoff request triggers this rule skill.
- Negative: mobile implementation request does not trigger this rule skill.
- Negative: review-only design review request does not trigger this rule skill.
