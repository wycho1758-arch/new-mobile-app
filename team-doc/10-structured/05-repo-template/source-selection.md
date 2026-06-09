---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Source selection matrix"
---

# Source selection matrix

Records which upstream projects or official docs inform the template, and exactly what is selectively pulled from each.

No single upstream satisfies all three requirements at once (Agent-oriented monorepo + mobile CI/E2E + Robot-token execution). The baseline is therefore a composition: a t3-turbo-style monorepo skeleton with obytes/Expo mobile tooling transplanted into `apps/mobile`.

| Source | Role | What is selectively pulled | Notes |
| --- | --- | --- | --- |
| **t3-oss/create-t3-turbo** | Monorepo BASE | Turborepo skeleton, pnpm workspace, packages/apps layout, shared-type layer pattern | Weak on mobile CI/E2E — needs obytes/Expo patterns transplanted in |
| **obytes/react-native-template-obytes** | `apps/mobile` skeleton | Expo Router, NativeWind, env (Zod), Jest (jest-expo preset), EAS profiles, Maestro structure | Reference baseline for the RN app skeleton |
| **Expo official EAS Workflows + Maestro docs** | Cloud E2E pattern | `.eas/workflows/*.yml`, build→maestro, e2e-test profile | `.eas` must sit at the same level as `eas.json` |
| **Expo official monorepo docs** | Monorepo resolution baseline | SDK 52+ automatic Metro config, pnpm workspace, pnpm isolated-dependency caveats | Manual Metro resolver is a fallback only |
| **NativeWind official install docs** | RN semantic-token styling | `global.css`, Tailwind preset, Babel preset, `withNativeWind`, type declaration | Required when NativeWind is used |
| **React Native Testing Library docs** | Jest matchers | Built-in matchers such as `toHaveTextContent` | Pin v13+ — auto-registers on import (no separate setup) |
| **Expo/Sentry official docs** | Crash/sourcemap | `@sentry/react-native`, `SENTRY_AUTH_TOKEN`, EAS Build/Update sourcemap upload | EAS Update needs a separate sourcemap upload step |
| **Expo Programmatic Access docs** | Agent authentication | Robot user, access token, `EXPO_TOKEN` env auth | Token injected via Secret only |
| **VoltAgent/awesome-design-md** | `DESIGN.md` reference curation (vendored) | Per-brand `DESIGN.md` examples — copy lives in `docs/design-references/`, informs the root `DESIGN.md` | MIT — must retain upstream LICENSE and attribution notice (DEC-021) |
| **infinitered/ignite** | Reference only | Generator, Reactotron, i18n concepts | Not merged directly |

## Source

- Page ID: 1371963427
- Source heading: Source selection matrix
- Source version: 20
