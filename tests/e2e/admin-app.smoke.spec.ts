import { expect, test } from '@playwright/test';

test('@smoke renders a non-indexable admin foundation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('KYLYVNYK CLUB Admin');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Admin application foundation is ready.',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
