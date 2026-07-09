import { expect, test } from '@playwright/test';

test('login-first screen exposes social login before DUPR gated participant flow on RN Web', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('login-artboard')).toBeVisible();
  await expect(page.getByTestId('login-logo')).toContainText('Hagpickle');
  await expect(page.getByTestId('login-subtitle')).toContainText('대회일정을 편리하게 모아 보는 플랫폼');
  await expect(page.getByTestId('kakao-login-button')).toContainText('카카오로 계속하기');
  await expect(page.getByTestId('apple-login-button')).toContainText('Apple로 계속하기');
  await expect(page.getByTestId('login-consent-copy')).toContainText('계속하시면 자동으로 회원가입이 진행돼요');
  await expect(page.getByTestId('application-cta')).toHaveCount(0);
  await expect(page.getByText(/Admin Web/i)).toHaveCount(0);

  await page.getByTestId('kakao-login-button').click();
  await expect(page.getByTestId('session-actor')).toContainText('actor_sandbox_social_001');

  await expect(page.getByTestId('dupr-gate-status')).toContainText('DUPR ID required');
  await expect(page.getByTestId('application-blocker')).toContainText('DUPR_PROFILE_REQUIRED');
  await expect(page.getByTestId('application-cta')).toContainText('Application blocked until DUPR is added');
  await expect(page.getByTestId('support-copy')).toContainText('1:1 inquiry');
  await expect(page.getByTestId('support-copy')).toContainText('Participant self-cancel/refund is not available');
  await expect(page.getByTestId('mock-tournament-card')).toContainText('PickleHub Sandbox Open');

  await page.getByTestId('dupr-input').fill('dupr-777');
  await page.getByTestId('save-dupr-button').click();
  await expect(page.getByTestId('saved-dupr')).toContainText('DUPR-777');
  await expect(page.getByTestId('dupr-gate-status')).toContainText('Application readiness unlocked');

  await page.getByTestId('application-cta').click();
  await expect(page.getByTestId('application-submitted')).toContainText('Mock application submitted');
});
