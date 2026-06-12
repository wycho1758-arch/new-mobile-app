# Mobile Web Native Constraints Summary

Date: 2026-06-09

## Outcome

ReactJS mobile web can remain the MVP direction, but push notifications and similar native integrations must be split into a separate capability track.

Recommended path:

1. Build the React web MVP and local/browser tests first.
2. Add Web Push/PWA support as phases 8-10.
3. Add a native-shell decision gate before promising native push parity.

## Practical Answer

For push notifications:

- Web Push can cover many MVP notification needs.
- iOS/iPadOS requires Home Screen web app behavior for Web Push and user-action-based permission.
- Real push delivery cannot be fully proven by local tests; it needs real browser/device smoke evidence.
- If product requirements include native APNs/FCM registration, silent/background processing, notification categories/actions, or app-store distribution, add a native shell such as Capacitor or keep/reuse Expo/RN.

## Reviewer

Reviewer: `wm-docs-researcher`

Evidence:

- Report: `.evidence/mobile-web-native-constraints/report.md`
- Review: `.evidence/mobile-web-native-constraints/reviewer.md`

Reviewer result:

- Main decision is sound.
- No major factual contradiction found.
- Clarifications requested and reflected:
  - FCM Web wording should use current Firebase terminology and provider-neutral registration handles.
  - HTTPS/security constraints and CSRF/session protection must be explicit.
  - `pnpm --filter web` gates must be confirmed against actual `apps/web/package.json` naming or replaced with path filters.

## Plan Impact

Add to the detailed migration plan after browser MVP smoke:

- Phase 8: Web Push capability probe.
- Phase 9: Web Push registration.
- Phase 10: real browser/device delivery smoke.
- Phase 11: native shell decision gate.

Do not block the initial React web MVP on native push. Do block any claim of mobile push support until real device evidence exists.

## Verification Status

This task changed evidence files only:

- `.evidence/mobile-web-native-constraints/report.md`
- `.evidence/mobile-web-native-constraints/reviewer.md`
- `.evidence/mobile-web-native-constraints/summary.md`

Source app/runtime code was not changed.
