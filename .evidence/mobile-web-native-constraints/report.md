# Mobile Web Native Integration Constraints Report

Date: 2026-06-09
Scope: ReactJS mobile web app plan for `/Users/tw.kim/Documents/AGA/test/mobile-web-app`
Source repo: `/Users/tw.kim/Documents/AGA/test/new-mobile-app`
Mode: research/report only; no implementation

## Direct Answer

ReactJS mobile web can reduce emulator dependency for MVP UI, but it does not remove native-platform constraints. Push notifications should be handled as a capability ladder:

1. MVP web path: implement standards-based Web Push/PWA notifications.
2. Native fallback path: introduce a native shell only when product requirements exceed Web Push limits.
3. Backend abstraction: keep notification registration and delivery provider details behind an API contract so the UI can remain React web while the delivery mechanism can change.

Recommended decision: keep the ReactJS web migration, but add a dedicated `notifications` phase after the browser MVP. Do not promise full native push parity in Phase 0-6 of the web migration plan.

## What Web Can Cover

Web Push supports server-initiated messages to opted-in web app instances through a Service Worker. MDN documents that the Push API can receive server-pushed messages even when the app is not in the foreground, and that an active Service Worker subscribes through `PushManager.subscribe()`.

For Android/desktop browsers, Web Push is a normal PWA capability. For iOS/iPadOS, WebKit added Web Push for Home Screen web apps in iOS/iPadOS 16.4. The iOS-specific constraints are material:

- The user must add the web app to the Home Screen for the iOS web-app behavior.
- The app needs a manifest configured for web-app display behavior.
- Permission must be requested from direct user interaction.
- Once configured, iOS Web Push uses APNs behind the web push service, but it is still a web capability, not native app registration.

Firebase Cloud Messaging can be used for web push delivery. Firebase's web guide requires VAPID keys and a `firebase-messaging-sw.js` Service Worker file at the domain root before registering for web messaging.

If FCM Web is selected, use current Firebase terminology and avoid binding UI contracts to a raw provider-specific shape. Firebase's current web guide centers on VAPID, `firebase-messaging-sw.js`, `register()`, and Firebase Installation ID. The app contract should store a provider-neutral registration handle and metadata, while provider-specific identifiers stay inside the notification adapter/server boundary.

## What Web Does Not Fully Cover

Pure React web does not give the same capability surface as a native iOS/Android app:

- It cannot use native push APIs directly through React DOM.
- It cannot guarantee iOS push unless the app is installed to Home Screen and permission is granted from user action.
- It cannot cover every native notification variant such as silent/background processing, notification categories/actions, platform-specific channels, or foreground presentation behavior with the same control as native.
- It cannot replace device-specific validation. Browser tests can validate UI and Web Push setup, but final push delivery must be tested on real browsers/devices or a native shell when used.

Android native push also has platform rules. Android 13+ requires `POST_NOTIFICATIONS` runtime permission for non-exempt notifications. If a native shell is introduced, that permission flow must be designed and tested.

Web Push also has security constraints:

- production push requires HTTPS because Service Workers and Push subscriptions depend on secure browser contexts;
- Push subscription endpoints are sensitive capability URLs and must not be exposed casually;
- registration endpoints must use session/auth checks and CSRF protection;
- browser-delivered public config and public push keys are not private values.

## Architecture Recommendation

Add a notification boundary that is platform-neutral from the UI:

```text
React UI
  -> NotificationPreference component
  -> notification client adapter
  -> POST /notification-registrations
  -> server stores registration by user/device/channel
  -> delivery adapter: Web Push / FCM Web / Expo Push / APNs-FCM native
```

Suggested shared contract types in `packages/contracts`:

- `notificationChannel`: `web-push`, `native-ios`, `native-android`
- `notificationRegistrationRequest`
- `notificationRegistrationRecord`
- `notificationPermissionState`: `unsupported`, `prompt`, `granted`, `denied`
- `notificationTestRequest`

The React web app should never infer provider payload shape in UI code. Registration and delivery payloads should stay in `packages/contracts` and backend adapters.

## Phased Plan Update

### Phase 8: Web Push Capability Probe

Goal: identify whether the current browser can support Web Push and guide the user through setup.

RED tasks:

- Add tests for `getNotificationCapability()`:
  - unsupported when Service Worker, Push API, or Notification API is missing.
  - supported when browser APIs exist.
  - iOS Home Screen requirement is represented as a user-facing setup state.

GREEN tasks:

- Add `apps/web/src/notifications/capability.ts`.
- Add a small opt-in UI surface after sign-in or equivalent user action.
- Keep labels generic and customer-neutral.

Gate:

- `pnpm --filter web test`
- `pnpm --filter web lint`
- Confirm `apps/web/package.json` is named `web`, or replace filter commands with path filters such as `pnpm --filter ./apps/web ...`.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-8-web-push-capability.md`

### Phase 9: Web Push Registration

Goal: register a web push subscription without binding UI to one delivery provider.

RED tasks:

- Add tests for subscription lifecycle:
  - permission denied does not call registration endpoint.
  - granted permission posts a registration request.
  - expired/changed subscription can be refreshed.

GREEN tasks:

- Add Service Worker registration.
- Add `notification-registrations` contract schema.
- Add backend endpoint or mocked endpoint for registration.
- If using FCM Web, add VAPID public key handling and `firebase-messaging-sw.js`.

Gate:

- `pnpm --filter web test`
- `pnpm --filter web build`
- mocked registration integration test passes.
- Confirm `apps/web/package.json` is named `web`, or replace filter commands with path filters such as `pnpm --filter ./apps/web ...`.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-9-web-push-registration.md`

### Phase 10: Delivery Smoke On Real Browsers

Goal: prove real notification delivery beyond local UI tests.

RED tasks:

- Add a manual/e2e checklist because browser automation cannot fully prove real push delivery across platforms.
- Add backend/provider test route for a safe test notification.

GREEN tasks:

- Run Android Chrome PWA push smoke.
- Run iOS/iPadOS Home Screen web app push smoke on iOS/iPadOS 16.4+.
- Capture permission state, browser/version, device OS, and provider result.

Gate:

- Web unit/build gates pass.
- At least one Android browser and one iOS Home Screen web app test result recorded before claiming mobile push support.
- Confirm target repo package names before using `pnpm --filter web ...` as evidence.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-10-push-delivery-smoke.md`

### Phase 11: Native Shell Decision Gate

Goal: decide whether Web Push is enough or a native shell is required.

Escalate to native if any of these are required:

- native APNs/FCM registration independent of Home Screen install;
- silent/background processing;
- reliable notification handling when the app process is killed;
- native notification categories/actions;
- platform-specific notification channels beyond web control;
- App Store / Play Store distribution requirement;
- other native APIs such as exact alarms, deep native integrations, background location, or secure hardware-backed flows.

Native options:

- Keep Expo/RN for native-only product surface and keep React web for browser MVP.
- Add Capacitor to the React web app as a native shell. Capacitor has an official Push Notifications plugin that provides access to native push, requires iOS Push Notifications capability, and uses FCM SDK on Android.
- Revisit Expo if the existing `new-mobile-app` runtime becomes the preferred native shell. Expo Push Service abstracts FCM/APNs but requires native build/runtime setup.

Gate:

- Product owner approves native capability requirement.
- Native build/test plan exists.
- Real device QA is required; local browser-only tests are no longer sufficient.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-11-native-shell-decision.md`

## Test Strategy

Local testable:

- capability detection logic;
- permission state transitions with mocks;
- Service Worker registration branch;
- contract validation;
- backend registration endpoint behavior;
- UI opt-in flows;
- Playwright checks for PWA manifest and installability signals where browser supports them.

Not fully local/browser-only:

- actual push delivery;
- iOS Home Screen install behavior;
- notification display on lock screen / notification center;
- native notification channels;
- native background/silent behavior;
- App Store / Play Store distributed behavior.

## Impact On Existing Detailed Plan

Add phases 8-11 after browser MVP smoke. Do not block Phase 0-6 on push. Treat push as its own capability track because it depends on provider setup, browser support, real device behavior, and potentially native shell choice.

For MVP:

- Build and test React web UI locally.
- Implement notification capability detection and opt-in UX only if needed.
- Use Web Push as first implementation path.
- Keep a native-shell decision gate before promising native push parity.

## Sources

- WebKit: Web Push for Home Screen web apps on iOS/iPadOS 16.4, direct user interaction, APNs-backed Web Push, manifest/Home Screen requirements. https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- MDN: Push API, Service Worker subscription and background push handling. https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- Firebase: FCM Web setup, VAPID, notification permission, `firebase-messaging-sw.js`. https://firebase.google.com/docs/cloud-messaging/web/get-started
- Apple Developer: User Notifications and APNs remote notification model. https://developer.apple.com/documentation/usernotifications
- Android Developers: Android 13+ `POST_NOTIFICATIONS` runtime permission. https://developer.android.com/develop/ui/compose/notifications/notification-permission
- Capacitor: native push plugin requirements and Android/iOS notes. https://capacitorjs.com/docs/apis/push-notifications
- Expo: Expo Push Service abstracts FCM/APNs for Expo native apps. https://docs.expo.dev/push-notifications/overview/
