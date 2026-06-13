# Design Codex Use Skill Analysis

Date: 2026-06-13
Role: Design
SOUL: `mobile-app-dev-team/02-role-souls/design-soul.md`

## Role Identity And SoT Basis

Design is the Product Designer role. It turns approved mobile requirements into Stitch-backed implementation handoff artifacts while owning UX quality, state coverage, accessibility intent, and visual handoff quality.

SoT basis:

- `design-soul.md`: Design owns mobile UX handoff, Stitch output, two options, state matrix, NativeWind/RN implementation constraints, and P0/P1 packet preparation.
- `05-work-processes.md`: Design must confirm `DESIGN.md`, prepare P0, stop until P0 approval, generate exactly two Stitch options, prepare P1, stop until P1 approval, then extract/publish HTML/image artifacts.
- `10-github-artifact-workflow.md`: Design owns `01-design/*` and `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/`.
- `design-mobile-design-handoff/SKILL.md` and `design-stitch-mcp-operating-rules/SKILL.md`: active repo-local contracts for Design work.

## Current State

Usable repo-local Codex skills:

- `design-mobile-design-handoff`
- `design-stitch-mcp-operating-rules`
- `wm-orchestrate`
- `git-workflow`

Usable custom agents:

- `design-reviewer`
- `design-researcher`
- `po-planning-reviewer` for Product/Planning packet readiness, not design quality
- `po-scope-gate-reviewer` when design scope or human-gate risk appears

Pod-native setup dependencies:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`
- `stitch-adc-setup` before approved Stitch work

Durable artifacts:

- `docs/plans/work-units/<work-unit-id>/01-design/design-decision.md`
- `docs/plans/work-units/<work-unit-id>/01-design/p0-packet.md`
- `docs/plans/work-units/<work-unit-id>/01-design/p1-packet.md`
- `docs/plans/work-units/<work-unit-id>/01-design/option-comparison.md`
- `docs/plans/work-units/<work-unit-id>/01-design/state-matrix.md`
- `docs/plans/work-units/<work-unit-id>/01-design/ux-acceptance.md`
- `docs/plans/work-units/<work-unit-id>/01-design/handoff-index.md`
- `docs/plans/work-units/<work-unit-id>/01-design/reviewer.md`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-a.html`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-a.png`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-b.html`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-b.png`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/manifest.json`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/handoff.md`

Coverage verdict: **Partial but strong**.

Design has the strongest role-specific repo-local skill coverage. The missing piece is still pod-native role-work execution guidance that connects Design pod identity, Stitch readiness, allowed Design skills, reviewer routing, P0/P1 stops, artifact paths, and GitHub handoff.

## Stitch Official-Docs And Prompt Contract

Design should use Codex to produce a reviewed Stitch handoff process, not to improvise a visual design from memory.

Required default process for this role:

1. Stay read-only while checking the approved Product/Planning input, `DESIGN.md`, P0/P1 status, Design SOUL, and work-unit artifacts.
2. Produce a plan for the Design action before any Stitch prompt, MCP call, image export, HTML extraction, or publication write.
3. Send that plan to `design-reviewer` for handoff readiness or `design-researcher` when Stitch, `DESIGN.md`, official docs, or MCP capability is uncertain.
4. Report the reviewed plan before using Stitch.
5. After Design artifacts are produced, run final reviewer verification against the actual prompt, Stitch/MCP outputs, P0/P1 decisions, publication files, and handoff docs.
6. Run `git diff` for `01-design/*` and `design-pub-html/*` outputs plus `git status --short`, then report whether the diff matches the reviewed plan.

External-tool reinforcement needed:

- Before a Stitch MCP or Stitch prompt action, Design must verify current official Stitch documentation or route uncertainty to `design-researcher`.
- Current official sources to prefer include Google Stitch, Google Developers Blog, Google Codelab Stitch MCP design-to-code workflow, Google AI Developers Forum Stitch Prompt Guide, and Google's Stitch/DESIGN.md update posts.
- The skill must record which official sources were checked, what MCP capability was observed, and any limitation instead of assuming a tool can generate, list, fetch, export, or select a model.
- MCP usage is not enough by itself; the skill must include prompt templates and prompt-capture requirements.

Required Stitch prompt template:

```text
Design a mobile app screen set for <approved work-unit/story>.
Platform/route: <Expo Router route or mobile surface>.
User goal and task flow: <goal, entry point, success path>.
Screen inventory: <screen list and navigation relationship>.
States required for each screen: default, loading, empty, error, permission-denied.
Information hierarchy: <primary content, controls, secondary content>.
Interaction model: <input, validation, disabled/loading behavior, navigation>.
Accessibility intent: <labels, contrast, touch targets, reduced-motion notes>.
Design-system context: use current DESIGN.md and selected approved reference; do not invent token values.
Implementation constraints: React Native primitives, NativeWind, semantic tokens, stable testID needs, no backend/API invention.
Non-goals: <explicit exclusions from Product/Planning>.
Output: exactly two distinct design directions, Option A and Option B, for the approved screens only.
```

Required refinement prompt rule:

- Refine one screen or component at a time.
- Request one or two major changes per prompt.
- Use concrete UI/UX terms such as navigation bar, primary action, list row, empty state, form validation, card layout, or permission prompt.
- Save the exact prompt and resulting artifact reference in `manifest.json` or `handoff.md`.

### DESIGN.md Baseline And Same-Project Continuity Contract

Design work must treat the selected `DESIGN.md` or `design.md` as the design-system SoT for the work unit. The first Design step is not Stitch generation. The first step is to ask the user or Product/Planning to choose or approve the baseline design system:

- existing repo `DESIGN.md`;
- imported or generated Stitch `DESIGN.md`;
- `UPDATE_DESIGN_MD_REQUIRED`, which blocks Stitch generation until the design-system update is approved.

After the baseline is selected, the Design pod records it as the work-unit design-system baseline and must keep subsequent Stitch work inside that baseline. For continuation work, the same Stitch project, project id, or share link used by the approved design must be reused unless a reviewer-approved fork reason is recorded.

Official/public source basis checked for this package:

- Google Labs DESIGN.md post: `DESIGN.md` can carry design rules across Stitch projects so Stitch can reason about a brand or design system.
  - Source: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
- Google Codelab Stitch MCP design-to-code flow: Stitch work is project-based, includes project naming/listing checks through MCP, and can generate `DESIGN.md` from fetched design context.
  - Source: https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch
- Google AI Developers Forum Stitch Prompt Guide: good Stitch results depend on high-level framing followed by screen-by-screen, specific UI/UX refinement prompts.
  - Source: https://discuss.ai.google.dev/t/stitch-prompt-guide/83844

Design-system drift is a high-risk handoff issue, not cosmetic cleanup. Treat these as stop or reviewer-fail conditions:

- no selected `DESIGN.md` or `design.md` baseline;
- baseline `DESIGN.md` conflicts with the selected Stitch project;
- continuation work uses a different Stitch project without an approved fork reason;
- prompt contradicts the approved `DESIGN.md`;
- output styles are not traceable to the approved `DESIGN.md`;
- visual tokens, typography, spacing, component shape language, or brand tone change without an approved design-system update;
- manifest/handoff omits required baseline or drift metadata;
- `design-reviewer` flags drift or same-project continuity failure.

Required manifest or handoff metadata:

- `design_system_baseline`;
- `design_md_source_path_or_url`;
- `design_md_hash_or_version` when practical;
- `stitch_project_id_or_share_link`;
- `extends_existing_project: true|false`;
- `fork_reason`;
- `drift_check_result`;
- `design_reviewer_verdict_path`.

Required prompt field:

```text
Design-system baseline: extend the approved DESIGN.md and same Stitch project; do not change visual tokens, typography, spacing, component shape language, or brand tone unless the plan explicitly includes an approved design-system update.
```

Required eval or validator scenarios for future skill work:

- missing `DESIGN.md` baseline stops before Stitch generation;
- mismatched Stitch project stops unless an approved fork reason exists;
- unapproved token/theme drift stops handoff;
- approved fork path records fork reason and reviewer evidence.

## Required Role-Specific Codex CLI Process

1. Confirm pod readiness.
   - Use `project-bootstrap` report.
   - Confirm `stitch-adc-setup` status only when Stitch generation/export is in scope.
2. Confirm role identity.
   - Resolve Design from `WM_ROLE` or `/workspace/IDENTITY`.
   - Stop if role mismatch.
3. Confirm checked-out repo and SoT.
   - Read Design SOUL, `05-work-processes.md`, `06-gates-and-evidence.md`, `10-github-artifact-workflow.md`, current `DESIGN.md`, and approved Product/Planning packet.
4. Confirm approved input.
   - Design must start from an approved requirement, PRD slice, Story, or bounded work unit.
   - If P0 is missing, prepare P0 packet and stop for Product/Planning scope/evidence approval.
5. Select Codex skill.
   - Design handoff: `design-mobile-design-handoff`.
   - Stitch MCP execution rules: `design-stitch-mcp-operating-rules`.
   - Existing `status.json` next action: `wm-orchestrate`.
   - Branch/PR handoff: `git-workflow`.
6. Execute Design sequence.
   - Confirm `DESIGN.md` decision.
   - Prepare P0.
   - Stop until P0 approval.
   - Generate exactly two Stitch options.
   - Capture visual/image evidence only before P1.
   - Prepare P1.
   - Stop until P1 approval.
   - Extract and publish HTML/images after P1 only.
7. Write Design artifacts.
   - Write `01-design/*`.
   - Link exact `design-pub-html/<date>/<work-unit-id>/` package from `handoff-index.md`.
8. Call reviewer/researcher.
   - `design-reviewer` before Mobile App Dev implementation.
   - `design-researcher` for Stitch, `DESIGN.md`, or Design SoT uncertainty.
9. Handoff.
   - Commit Design artifacts and publication package.
   - Update status to the next role only after reviewer evidence exists.
10. Stop conditions.
   - Missing approved requirement.
   - Missing P0 before Stitch generation.
   - Missing P1 before HTML extraction.
   - Unresolved `DESIGN.md` decision.
   - Request requires app code, backend/API, migration, QA, release, or external platform config.
   - Credential or ADC content would be exposed.

## Current Problems

Missing process:

- Existing Design skills are strong but are repo-local. A fresh pod needs a pod-native bridge that tells it when to call those skills and how to verify setup status.

Missing pod-native bridge skill:

- Required. `codex-role-workflow` must map Design identity to `design-*` skills, `stitch-adc-setup`, P0/P1 stops, `01-design/*`, and `design-pub-html/*`.

Missing repo-local Codex skill:

- None required now. `design-mobile-design-handoff` and `design-stitch-mcp-operating-rules` cover the main Design workflow.

Skill reinforcement:

- Existing Design skills should be reinforced to require selected `DESIGN.md` baseline approval, same Stitch project continuation for follow-on work, current official-doc verification, Stitch prompt templates, exact prompt capture, MCP capability/limitation recording, manifest baseline metadata, drift check evidence, pod-isolated `status.json`, and `01-design/handoff-index.md`.

Missing custom reviewer/researcher/advisor:

- None required now. `design-reviewer` and `design-researcher` are role-specific and detailed.

Ambiguous handoff path:

- Low risk. Design handoff paths are defined, but the pod-native execution path does not yet force the sequence from P0 to Stitch to P1 to publication to GitHub handoff.

Overlap or role-boundary risk:

- Design must not implement app code, backend/API work, QA flows, or release operations. The pod bridge must preserve this stop condition.

External proof or human-gate risk:

- Stitch/ADC readiness is status-only; it does not prove Stitch generation/export. P0/P1 and human-gated external actions remain blocking decisions.

Validator/eval gap:

- Add eval proving the pod-native bridge maps Design to `design-*` skills and stops on missing P0/P1.
- Add validator requirement that `codex-role-workflow` lists `stitch-adc-setup` as Design-only readiness dependency.

## Skill/Agent Additions Or Reinforcement

Recommendation:

- Add/Update: Add pod-native `codex-role-workflow`.
- Artifact path: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
- Reason: Design pods need a runtime bridge from role identity to `design-*` skills, P0/P1 stop points, Stitch readiness, and durable artifacts.
- SoT basis: `design-soul.md`, `05-work-processes.md`, `10-github-artifact-workflow.md`, `design-mobile-design-handoff/SKILL.md`, `design-stitch-mcp-operating-rules/SKILL.md`.
- Used in process: approved requirement intake, Stitch readiness check, Design skill selection, P0/P1 enforcement, publication handoff.
- Required inputs: role identity, bootstrap report, Product/Planning packet, `DESIGN.md`, target work-unit id.
- Required outputs: selected Design skill, P0/P1 gate checklist, artifact checklist, reviewer requirement.
- Stop conditions: missing P0/P1, unresolved `DESIGN.md`, out-of-role implementation, credential exposure.
- Validation: evals for approved Design input, missing P0 stop, missing P1 stop, app-code request stop.
- Non-goals: do not run Stitch inside the bridge skill; do not replace Design repo-local skills.
- Codex process reinforcement: include read-only SoT planning before Stitch, plan reviewer, user report, final reviewer against actual prompts/artifacts, `git diff`, and `git status --short`.

Recommendation 2:

- Add/Update: Reinforce `design-mobile-design-handoff` and `design-stitch-mcp-operating-rules`.
- Artifact path: `.agents/skills/design-mobile-design-handoff/SKILL.md` and `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md`.
- Reason: external-tool workflows are fragile; the skills must say how to prompt Stitch and how to verify official capability, not only when to call MCP.
- SoT basis: Design SOUL, `DESIGN.md`, `05-work-processes.md`, official Stitch docs, Google Codelab Stitch MCP workflow, Google AI Developers Forum Stitch Prompt Guide.
- Used in process: P0 planning, Stitch prompt generation, refinement, P1 packet, HTML/image extraction, publication handoff.
- Required inputs: approved requirement, selected `DESIGN.md` baseline, same Stitch project id/share link or approved fork reason, official-doc check result, target route/platform, prompt template fields, P0/P1 decisions.
- Required outputs: exact prompt log, source references, MCP capability/limitation note, baseline manifest metadata, drift check result, Option A/B artifacts, state matrix, handoff reviewer evidence.
- Stop conditions: missing official-doc verification when capability is uncertain, missing P0/P1, unresolved `DESIGN.md`, missing baseline approval, unapproved Stitch project fork, unapproved design-system drift, credential exposure, app/backend implementation request.
- Validation: eval for official-doc/source capture, prompt template completeness, missing P0 stop, missing P1 stop, no HTML extraction before P1, missing baseline stop, mismatched Stitch project stop, and unapproved drift stop.
- Non-goals: do not turn Stitch output into React Native implementation inside Design.

## Role-Specific Acceptance Criteria

- Design pod can identify whether P0 or P1 is required before action.
- Design pod uses `stitch-adc-setup` only as status/readiness proof and never prints ADC content.
- Design pod invokes the correct `design-*` repo-local skill.
- Design pod records the selected `DESIGN.md` or `design.md` baseline before Stitch work.
- Continuation work reuses the same Stitch project unless an approved fork reason and reviewer evidence exist.
- Manifest/handoff records `design_system_baseline`, design source, Stitch project id/share link, extension/fork status, drift result, and reviewer verdict path.
- Unapproved design-system drift blocks handoff to Mobile App Dev.
- Design pod verifies official Stitch docs or records `design-researcher` uncertainty before external-tool work.
- Design pod captures the exact Stitch prompt, source references, MCP capability, and limitations.
- Design pod produces exactly two-option artifact requirements and five-state requirements.
- Design pod records `design-reviewer` as required before Mobile App Dev handoff.
- Design pod hands off committed `01-design/*` and linked `design-pub-html/*` artifacts only.
