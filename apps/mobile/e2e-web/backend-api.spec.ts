import { expect, test } from '@playwright/test';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

test('deployed backend API is reachable for RN Web E2E', async ({ request }) => {
  test.skip(!apiUrl, 'EXPO_PUBLIC_API_URL not supplied; deployed backend API check is not part of this run');

  expect(apiUrl, 'EXPO_PUBLIC_API_URL must point to the deployed backend API').toBeTruthy();
  expect(apiUrl).not.toBe('https://example.invalid');

  const livez = await request.get(`${apiUrl}/livez`);
  expect(livez.ok()).toBe(true);
  expect(await livez.json()).toEqual({ status: 'ok' });

  const readyz = await request.get(`${apiUrl}/readyz`);
  expect(readyz.ok()).toBe(true);
  expect(await readyz.json()).toEqual({ status: 'ok' });
});
