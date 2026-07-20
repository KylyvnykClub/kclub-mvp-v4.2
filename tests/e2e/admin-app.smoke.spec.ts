import { expect, test } from '@playwright/test';

test('@smoke redirects guests to the non-indexable staff sign-in', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('KYLYVNYK CLUB Admin');
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Staff sign in');
  await expect(page.getByLabel('Phone')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
