Direct answer: the report’s main decision is sound. Keep React web for the MVP, treat push as a separate capability track, and avoid promising native push parity until real-device delivery is proven.

I would make three clarifications before treating it as PR-ready research:

1. **FCM Web wording should use current Firebase terminology.** Firebase’s current web guide emphasizes VAPID, `firebase-messaging-sw.js`, `register()`, Firebase Installation ID, and notes deprecated registration-token APIs. If FCM Web is selected, the contract should store a provider-neutral registration handle, not assume the UI owns a raw provider token shape. Source: Firebase Web FCM docs.
2. **Add HTTPS/security constraints.** FCM Web requires HTTPS because it depends on Service Workers, and MDN warns PushSubscription endpoints are sensitive capability URLs. Registration endpoints should include CSRF/session protections.
3. **Treat `pnpm --filter web` as unverified.** The target repo `/Users/tw.kim/Documents/AGA/test/mobile-web-app` is outside the readable workspace here, so the exact package name and gates need confirmation before using those commands as evidence gates.

No major factual contradiction found. WebKit/MDN support the Web Push capability ladder; Android, Capacitor, and Expo docs support the native-shell fallback logic.

Sources checked:
- WebKit iOS/iPadOS Home Screen Web Push: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- MDN Push API and Service Worker subscription model: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- Firebase Web FCM setup, VAPID, service worker, FID/register flow: https://firebase.google.com/docs/cloud-messaging/web/get-started
- Android 13+ `POST_NOTIFICATIONS`: https://developer.android.com/develop/ui/compose/notifications/notification-permission
- Capacitor native push plugin: https://capacitorjs.com/docs/apis/push-notifications
- Expo Push Service overview: https://docs.expo.dev/push-notifications/overview/
- Repo contract/test constraints: [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:80), [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:96), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:20)

Version assumptions: current date 2026-06-09; source repo baseline is Expo SDK 56 / RN 0.85 from local docs. Remaining uncertainty is target web repo package naming and chosen push provider.

Recommended next repo action: update the report with the FCM/FID clarification, explicit HTTPS/security constraints, and a note that Phase 8-10 gates must be aligned to the actual `mobile-web-app` workspace package names.