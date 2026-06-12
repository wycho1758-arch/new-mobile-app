import { expect, test } from '@playwright/test';

test('home counter flow works on RN Web', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('home-title')).toBeVisible();
  await expect(page.getByTestId('counter-value')).toHaveText('Count: 0');

  await page.getByTestId('counter-increment-button').click();

  await expect(page.getByTestId('counter-value')).toHaveText('Count: 1');
});
