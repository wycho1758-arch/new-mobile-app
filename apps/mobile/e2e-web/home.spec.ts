import { expect, test } from '@playwright/test';

test('participant shell exposes social login and DUPR gate on RN Web', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('home-title')).toHaveText('PickleHub Participant APP');
  await expect(page.getByTestId('social-login-button')).toBeVisible();
  await expect(page.getByText('Email/password login is not available in this slice.')).toBeVisible();

  await expect(page.getByTestId('dupr-gate-status')).toContainText('DUPR ID required');
  await expect(page.getByTestId('application-blocker')).toContainText('DUPR_PROFILE_REQUIRED');
  await expect(page.getByTestId('application-cta')).toContainText('Application blocked until DUPR is added');

  await expect(page.getByText(/Admin Web/i)).toHaveCount(0);
  await expect(page.getByTestId('support-copy')).toContainText('1:1 inquiry');
  await expect(page.getByTestId('support-copy')).toContainText('Participant self-cancel/refund is not available');

  await expect(page.getByTestId('mock-tournament-card')).toContainText('PickleHub Sandbox Open');

  await page.getByTestId('social-login-button').click();
  await expect(page.getByTestId('session-actor')).toContainText('actor_sandbox_social_001');

  await page.getByTestId('dupr-input').fill('dupr-777');
  await page.getByTestId('save-dupr-button').click();
  await expect(page.getByTestId('saved-dupr')).toContainText('DUPR-777');
  await expect(page.getByTestId('dupr-gate-status')).toContainText('Application readiness unlocked');

  await page.getByTestId('application-cta').click();
  await expect(page.getByTestId('application-submitted')).toContainText('Mock application submitted');
});
