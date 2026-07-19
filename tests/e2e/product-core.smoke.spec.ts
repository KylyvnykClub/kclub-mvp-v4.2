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

test('@smoke switches and persists the color theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/en');

  const header = page.locator('[data-section="header"]');
  const darkToggle = header.getByRole('button', { name: 'Use dark theme' });
  await expect(darkToggle).toBeEnabled();
  await darkToggle.click();

  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(header.getByRole('button', { name: 'Use light theme' })).toBeEnabled();

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);

  await header.getByRole('button', { name: 'Use light theme' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('@smoke selects and previews club offerings accessibly', async ({ page, isMobile }) => {
  await page.goto('/en');

  const offerings = page.locator('[data-section="offerings"]');
  await expect(offerings).toBeVisible();

  if (isMobile) {
    const secondTrigger = offerings.getByRole('button', { name: /Deal & partnership circles/ });
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
    await secondTrigger.click();
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      offerings.getByText('Small standing groups formed around a shared theme'),
    ).toBeVisible();
    return;
  }

  const tablist = offerings.getByRole('tablist');
  const firstTab = tablist.getByRole('tab', { name: /Curated introductions/ });
  const secondTab = tablist.getByRole('tab', { name: /Deal & partnership circles/ });
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  await secondTab.hover();
  await expect(tablist).toHaveAttribute('data-active', '1');
  await tablist.hover({ position: { x: 1, y: 1 } });
  await expect(tablist).toHaveAttribute('data-active', '0');
  await secondTab.click();
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');

  await secondTab.press('End');
  const lastTab = tablist.getByRole('tab', { name: /Long-term stewardship/ });
  await expect(lastTab).toHaveAttribute('aria-selected', 'true');
  await expect(lastTab).toBeFocused();
});
