---
docType: "reference"
sourcePageId: "1373667362"
sourceTitle: "01-4. Skills"
sourceVersion: "4"
sourceHeading: "External official skill selection policy"
---

# External official skill selection policy

External official skills are not authored by this organization; the table below sets the
selective-install criteria for officially distributed skills, not for new in-house skills.

## Scope and gate

- Install decisions are reviewed against this table during the human-gated skill-install
  step of Case A bootstrap (`mobile-project-bootstrap-workflow`).
- Arbitrary installation of any external skill not listed here is prohibited.
- Installing all 16 skills from `expo/skills` wholesale is prohibited.
- Basis: the 2026-06-08 external skill ecosystem survey (16 candidates; verdict of zero new
  in-house skills required).

## Approved external skills

Source: `github.com/expo/skills` (MIT licensed; README declares Claude Code / Cursor / Codex
support). Install location for all approved skills: `new-mobile-app/.agents/skills/`.

| External skill | Primary owning role |
| --- | --- |
| upgrading-expo, eas-update-insights, expo-deployment, expo-cicd-workflows | QA/Release (primary); Mobile Architect (co-owns EAS strategy) |
| building-native-ui, expo-tailwind-setup, native-data-fetching | Mobile App Dev (primary); Mobile Architect (reference) |

## Excluded skills (9)

Excluded as out of scope: add-app-clip, expo-brownfield, expo-ui-jetpack-compose,
expo-ui-swift-ui, expo-module, expo-observe, expo-api-routes, expo-dev-client, use-dom.
These do not fit the current template stack (pnpm, Turborepo, Expo Router, NativeWind, Jest,
zod) or the MVP scope, so they are not install targets.

## Source

- Page ID: 1373667362
- Source heading: External official skill selection policy
- Source version: 4
