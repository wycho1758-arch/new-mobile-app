# Role → Rules Index

Maps this repo's operating roles (`mobile-app-dev-team/02-role-souls/`) to the curated rule sets in
this library. This index is part of the independent `/best-practices` skill — it does not reference
or depend on any other skill. Roles not listed below have no code-rule scope.

Stack: Expo React Native + TypeScript + NativeWind. Shared API types live in `packages/contracts`.

---

## mobile-app-dev (Mobile App Developer)

Owns Expo Router screens, RN primitives, NativeWind UI, app state, tests, selectors.

- **TypeScript:** `ts-types-*`, `ts-error-*`, `ts-async-*`, `ts-anti-*`
- **React (RN applicable):** `react-components-*`, `react-effects-*`, `react-rerender-*`, `react-state-*`, `react-async-*`
- **JS performance:** `react-js-*` (index-maps, set-lookups, early-exit, property-access, tosorted)
- **Testing:** `test-infrastructure`
- Consume shared request/response types from `packages/contracts`; do not redeclare API shapes.

## backend-api-integrator (Backend/API Engineer)

Owns mobile-facing API contracts in `packages/contracts`, auth/session, error mapping, mocks/fixtures.

- **TypeScript:** `ts-types-*`, `ts-error-*`, `ts-async-*`, `ts-anti-*`
- **Validation:** `ts-validation-zod-schema`
- **Backend:** `backend-patterns`
- **Code organization:** `ts-org-*`
- **Testing:** `test-infrastructure`

## mobile-architect (Mobile Architect / Technical Lead)

Owns module boundaries, route/state impact, runtime policy, ADR/risk notes.

- **Code organization / boundaries:** `ts-org-barrel-exports`, `ts-org-path-aliases`, `ts-org-strict-mode`, `ts-org-interface-vs-type`
- **Composition:** `react-components-composition`, `react-components-discriminated-unions`
- **Strict typing:** `ts-types-*`, `ts-anti-*`
- **Testing:** `test-infrastructure`

## qa-release (QA/Release Engineer)

Owns objective test/release evidence (RN Web Playwright, Maestro, mobile-mcp, EAS).

- **Testing:** `test-infrastructure`
- Reference any rule above when triaging a defect to its owning role.

---

## Not code-rule scoped

- **design (Product Designer):** UX / Stitch handoff. Use design-specific guidance, not these code rules.
- **product-planning (CPO / Product Delivery Lead):** requirement clarification, work-unit sizing,
  task decomposition. No code-rule scope.

## Excluded from this repo (curation)

`react-server-*` (RSC), `react-bundle-*` (web bundle), `react-js-passive-events` (DOM), and
`ts-nextjs-api-route-typing` (Next.js) were removed — not applicable to Expo React Native. Go,
Python, and Rust rule sets are not part of this stack and were not imported.
