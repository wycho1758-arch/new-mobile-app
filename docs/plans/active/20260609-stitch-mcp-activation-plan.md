# Stitch MCP Activation Plan

Date: 2026-06-09
Status: pinned stdio Stitch MCP activated; Stitch generation smoke pending Google Cloud ADC/project setup
Owner role: Design agent for Stitch design workflow; Codex runtime owner for MCP registration and validation

## Scope

This plan covers enabling Stitch MCP for the current repository workflow:

1. Receive PRD and requirements.
2. Generate a first mock or wireframe in Stitch.
3. Get human approval for the wireframe direction.
4. Send the approved direction plus `DESIGN.md` constraints to Stitch.
5. Generate exactly two visual design options.
6. Get human approval for the selected design.
7. Export HTML and design evidence for implementation handoff.

Runtime activation has been applied with the pinned stdio adapter. `$wm` required planning and review before activation, and the current worktree still contains unrelated pre-existing changes.

## Current State

- `.codex/config.toml` registers `mobile-mcp`, `serena`, and `stitch`.
- `PROJECT_ENVIRONMENT.md` lists required project MCP servers including `stitch`.
- `scripts/validate-runtime-artifacts.mjs` validates the pinned `stitch-mcp@1.3.2` registration.
- `DESIGN.md` already declares Google Stitch as the sole authoring tool and requires Stitch export or Stitch MCP fetch for design artifacts.
- `docs/SETUP.md` lists Google Stitch access and Design agent ownership as a Human owner prerequisite.
- There are two Codex binaries on PATH. `/usr/local/bin/codex` fails in this session without output, while `/opt/homebrew/bin/codex` reports `codex-cli 0.137.0`.
- `/opt/homebrew/bin/codex mcp list` is used for MCP inventory because `/usr/local/bin/codex` fails in this session without output.

## External Source Basis

- Official Stitch docs are located under `https://stitch.withgoogle.com/docs/mcp/`, but the fetched pages did not expose readable text in this session.
- `npm view stitch-mcp` reports `stitch-mcp@1.3.2` as a local stdio MCP adapter package with tarball integrity `sha512-SlRjWAQGrJ3X1J/kP38wUP+Q3V+aIYKx8zAM5hNQdJvyYmsIKGcOTqJWZOnXaHX/7hvgwOTGlF6B/frPnoWYAA==`.
- The `stitch-mcp@1.3.2` README and source use Google Cloud Application Default Credentials, `GOOGLE_CLOUD_PROJECT`/`GCLOUD_PROJECT` or `gcloud config get-value project`, and bearer-token calls to `https://stitch.googleapis.com/mcp`.
- The adapter exposes tools for project and screen management, design generation, screen retrieval, and export/download helpers for HTML/code and screenshots.

## Proposed Activation Approach

Activated approach:

```toml
[mcp_servers.stitch]
command = "npx"
args = ["-y", "stitch-mcp@1.3.2"]
```

This avoids committing API keys and matches the current Codex CLI support surface. `/opt/homebrew/bin/codex mcp add --help` supports streamable HTTP URL plus bearer token env var, but no custom `X-Goog-Api-Key` header option was verified.

## API Key Storage

The chosen adapter does not require a Stitch API key. Do not store Stitch credentials or project-private values in:

- Git-tracked files.
- `.codex/config.toml` as a literal value.
- `PROJECT_ENVIRONMENT.md`, docs, evidence, or chat logs.
- `EXPO_PUBLIC_*` variables, because those are compiled into client code.
- Mobile app config, contracts, or API code.
- Local `.env*` files for this workflow, unless a future PR first adds explicit ignore rules, hook fixtures, and validator coverage for that storage mode.

Recommended local test handling:

- Human owner prepares a Google Cloud project with Stitch MCP service enabled:
  - `gcloud beta services mcp enable stitch.googleapis.com --project=<project-id>`
  - `gcloud auth application-default login`
  - `gcloud auth application-default set-quota-project <project-id>`
  - `export GOOGLE_CLOUD_PROJECT=<project-id>` or `gcloud config set project <project-id>`
- Evidence records whether prerequisites were present, never credential values.
- Rotate or revoke local credentials after shared demos, failed security checks, or accidental exposure.
- Codex may update docs that describe required secrets, but must not read or print secret files or secret values.

## Prompt Review

Use a two-stage prompt flow so Stitch does not jump from requirements directly to final UI.

### Stage 1 Wireframe Prompt

```text
Use Stitch to create a low-fidelity mobile wireframe only.

Input:
- PRD:
  {{PRD_TEXT}}
- Requirements:
  {{REQUIREMENTS_TEXT}}
- Target platform: Expo React Native mobile app.
- Device: MOBILE.

Constraints:
- Produce structure, information hierarchy, screen flow, and interaction states only.
- Do not finalize brand colors, illustration style, or polished visual treatment.
- Use neutral template branding; do not invent customer names, bundle IDs, URLs, tokens, or credentials.
- Include expected screens, primary actions, empty/loading/error states, and approval questions.

Output:
- One wireframe direction.
- Screen list and rationale.
- Open questions that block final design.
```

### Stage 2 Design Options Prompt

```text
Use Stitch to create exactly two polished mobile design options based on the approved wireframe.

Input:
- Approved wireframe summary:
  {{APPROVED_WIREFRAME_SUMMARY}}
- DESIGN.md:
  {{DESIGN_MD_CONTENT}}
- PRD acceptance criteria:
  {{ACCEPTANCE_CRITERIA}}

Constraints:
- Follow DESIGN.md as the design system source of truth.
- Keep output suitable for Expo React Native implementation with NativeWind, React Native primitives, and semantic tokens.
- Do not use web-only shadcn/ui assumptions for native screens.
- Preserve stable testID planning for long-lived automated checks.
- Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
- Prefer accessible contrast, clear touch targets, and mobile-first layout density.

Output:
- Exactly two design options.
- Screenshot/export references per option.
- HTML and image artifacts per option under `design-pub-html/<YYYY-MM-DD>/`.
- Token changes needed in DESIGN.md and apps/mobile/global.css.
- Implementation notes and risks.
```

### Stage 3 Export Prompt

```text
Export the approved Stitch design for implementation handoff.

Input:
- Approved design option:
  {{APPROVED_OPTION_ID}}
- Required artifacts: HTML, screenshot, and any available design metadata.

Output:
- HTML export download reference.
- Screenshot download reference.
- Figma export reference if available.
- Summary of semantic tokens and screen states.
- Any implementation caveats for Expo React Native.
```

## Tests And Verification

After approval, implementation should follow tests-first runtime changes:

1. Add or update validator assertions in `scripts/validate-runtime-artifacts.mjs` to require the approved `stitch` MCP registration shape.
   - Accept remote HTTP only when the header references `STITCH_API_KEY` without a literal key value.
   - Accept a local adapter only when pinned to an exact reviewed version.
   - Reject `@latest`, literal Google/Stitch API key patterns, `EXPO_PUBLIC_STITCH*`, and checked-in secret placeholders that invite committing real values.
2. Add or update the narrowest runtime eval/result evidence for Stitch MCP activation.
3. Update `.codex/config.toml` with the verified Stitch MCP config.
4. Update `PROJECT_ENVIRONMENT.md` so the MCP inventory and required secret handling are accurate.
5. Update `team-doc/10-structured/05-repo-template/codex-runtime-layer.md` as the local Confluence-derived corpus. Do not update `docs/CREDENTIALS.md` or live Confluence for this change.
6. Run `pnpm run test:runtime`.
7. Run `pnpm run test:local-harness`, because `.codex`, runtime scripts, `PROJECT_ENVIRONMENT.md`, `docs/CREDENTIALS.md`, or `docs/plans` changes affect the local harness gate.
8. Restart or reload Codex MCP, then run `/opt/homebrew/bin/codex mcp list` or fix PATH so `codex` resolves to the working binary.
9. If `codex mcp list` still fails after PATH/reload correction, record the exact command and failure as blocked evidence; do not mark activation complete.
10. If Google Cloud ADC and project setup are present, perform a minimal Stitch smoke test in a throwaway project or read-only listing call, then record evidence without exposing project-private content or credentials.

## Gate Impact

- Runtime artifact gate: affected if `.codex/config.toml` or `scripts/validate-runtime-artifacts.mjs` changes.
- Local harness gate: affected by `.codex/**`, runtime scripts, `PROJECT_ENVIRONMENT.md`, `docs/CREDENTIALS.md`, and `docs/plans/**`.
- Mobile app lint/test gates: not expected unless exported design is implemented in `apps/mobile`.
- Mobile visual QA: required later only when exported designs are implemented in the app and a simulator/device is available.

## Approval Needed

Before implementation, confirm:

1. Whether actual Stitch generation should create a new throwaway project or use an existing Stitch project.
2. Whether the human owner has completed Google Cloud ADC and project setup for smoke testing.
