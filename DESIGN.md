# DESIGN.md

> **Owner**: Design agent
> **Authoring tool**: Google Stitch (sole authoring tool — DEC-021). All design work originates from Stitch export (ZIP `code.html` or Stitch MCP fetch). No other design tools produce canonical output for this repo.
> **Sync rule**: When a project design system is finalized, update the semantic tokens in this file AND the corresponding CSS variable values in `apps/mobile/global.css` together in the same PR. These two files are a single source of truth — never update one without the other.
> **Reference**: `docs/design-references/` contains a vendored copy of awesome-design-md for DESIGN.md authoring examples (MIT, see LICENSE and NOTICE).

---

## Design System

This file is the design system Source of Truth for the mobile app template. It defines the semantic design tokens used across `apps/mobile` (NativeWind + CSS variables) and, when present, `apps/console` (shadcn/ui).

This is a template repository. No customer brand values are hardcoded here. Token values below are neutral defaults that must be replaced at project scaffolding time when a customer design system is confirmed.

### Semantic Tokens

The following tokens are defined as CSS custom properties in `apps/mobile/global.css` under `:root`, then exposed to Tailwind CSS v4 through the CSS-first `@theme` block. Values use HSL channel notation compatible with Tailwind CSS / NativeWind.

| Token | CSS Variable | Default Value (HSL channels) | Meaning |
|-------|-------------|------------------------------|---------|
| Background | `--background` | `0 0% 100%` | Page / screen background |
| Foreground | `--foreground` | `222 47% 11%` | Primary text color |
| Primary | `--primary` | `221 83% 53%` | Primary action / brand color |
| Primary Foreground | `--primary-foreground` | `210 40% 98%` | Text on primary background |

Usage in Tailwind CSS v4 / NativeWind:

```css
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
}
```

Apply via className: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`.

### Updating Tokens

When a project design system is confirmed:

1. Replace the HSL values in this table with the confirmed brand values.
2. Update the corresponding `--variable` values and `@theme` mappings in `apps/mobile/global.css` to match.
3. If `apps/console` is included, update the shadcn/ui CSS variable block in the console's `globals.css` to match.
4. Commit all three files in the same PR.

Do not update one without the others. Drift between `DESIGN.md` and `global.css` is a defect.

---

## Authoring Guide

Design artifacts for this project are produced exclusively with Google Stitch. The handoff procedure is:

1. Export the Stitch design as a ZIP containing `code.html`, or fetch via Stitch MCP.
2. Extract semantic token values from the export and update this file + `apps/mobile/global.css`.
3. Publish Stitch handoff artifacts under project-root `design-pub-html/<YYYY-MM-DD>/` with Option A/B HTML, Option A/B images, `manifest.json`, and `handoff.md`.

For DESIGN.md format examples and brand-specific reference implementations, see `docs/design-references/` (vendored awesome-design-md, MIT).
