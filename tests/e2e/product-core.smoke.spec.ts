import { expect, test } from '@playwright/test';

test('@smoke renders the localized public home page', async ({ page }) => {
  await page.goto('/en');

  await expect(page).toHaveTitle(/KYLYVNYK CLUB/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Trusted connections');
  await expect(page.locator('[data-section="hero"]')).toBeVisible();
  await expect(page.locator('[data-section="faq"]')).toBeVisible();
  await expect(page.locator('[data-section="contact"]')).toBeVisible();
  await expect(page.locator('[data-section="footer"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Українська' })).toBeVisible();
});

test('@smoke redirects the bare route to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
});
