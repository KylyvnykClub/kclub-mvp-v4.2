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

test('@smoke renders the localized About composition and shared shell', async ({ page }) => {
  await page.goto('/en/about');

  await expect(page).toHaveTitle(/About the club/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Leading with integrity and purpose.',
  );
  await expect(page.locator('[data-section="header"]')).toHaveCount(1);
  await expect(page.locator('[data-section="footer"]')).toHaveCount(1);

  const expectedSections = [
    'about-hero',
    'about-story',
    'about-mission',
    'about-offerings',
    'about-values',
    'about-trust',
    'contact',
  ];
  await expect(page.locator('main > section')).toHaveCount(expectedSections.length);
  expect(
    await page
      .locator('main > section')
      .evaluateAll((sections) => sections.map((section) => section.getAttribute('data-section'))),
  ).toEqual(expectedSections);
  await expect(page.locator('[data-section="about-trust"]')).not.toContainText('Our Team');
  await expect(page.locator('a[href*="#team"]')).toHaveCount(0);
  await expect(page.locator('[data-section="faq"]')).toHaveCount(0);

  const trust = page.locator('[data-section="about-trust"]');
  const firstSignal = trust.getByRole('button', { name: /The Long View/ });
  const secondSignal = trust.getByRole('button', { name: /European Founders Guild/ });
  await expect(
    page.locator('[data-section="header"]').getByRole('button', { name: 'Use dark theme' }),
  ).toBeEnabled();
  await expect(firstSignal).toHaveAttribute('aria-pressed', 'true');
  await secondSignal.click();
  await expect(secondSignal).toHaveAttribute('aria-pressed', 'true');
  await expect(trust.getByText('A guild placeholder representing')).toBeVisible();
  await secondSignal.press('End');
  await expect(trust.getByRole('button', { name: /Guild of Stewards/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  const dimensions = await page.evaluate(() => ({
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

  await page.getByRole('link', { name: 'Русский' }).click();
  await expect(page).toHaveURL(/\/ru\/about$/);
});

test('@smoke serves About metadata for every locale', async ({ request }) => {
  for (const locale of ['en', 'ru', 'uk']) {
    const response = await request.get(`/${locale}/about`);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toContain(`<link rel="canonical" href="https://kylyvnyk.club/${locale}/about"`);
    expect(html).toContain('hrefLang="en"');
    expect(html).toContain('hrefLang="ru"');
    expect(html).toContain('hrefLang="uk"');
  }
});

test('@smoke respects reduced motion on About', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/about');

  const trustImage = page.locator('.kc-about-trust-image[data-state="active"]');
  await expect(trustImage).toHaveCSS('transition-duration', '0s');
});

test('@smoke switches and persists the color theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/en');

  const header = page.locator('[data-section="header"]');
  const darkToggle = header.getByRole('button', { name: 'Use dark theme' });
  await expect(darkToggle).toBeEnabled();
  await darkToggle.click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(header.getByRole('button', { name: 'Use light theme' })).toBeEnabled();

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await header.getByRole('button', { name: 'Use light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('@smoke selects and previews club offerings accessibly', async ({ page, isMobile }) => {
  await page.goto('/en');

  const offerings = page.locator('[data-section="offerings"]');
  await expect(offerings).toBeVisible();
  await expect(
    page.locator('[data-section="header"]').getByRole('button', { name: 'Use dark theme' }),
  ).toBeEnabled();

  if (isMobile) {
    const secondTrigger = offerings.getByRole('button', { name: /Deal & partnership circles/ });
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
    await secondTrigger.click();
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      offerings
        .locator('.kc-offerings-accordion-content')
        .getByText('Small standing groups formed around a shared theme'),
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

test('@smoke navigates the membership process with emphasized steps', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en');

  const process = page.locator('[data-section="steps"]');
  const navigation = process.locator('.kc-process-navigation');
  const firstStep = navigation.getByRole('button', { name: /Submit an application/ });
  const secondStep = navigation.getByRole('button', { name: /Complete the review/ });

  await expect(process).toBeVisible();
  await expect(
    page.locator('[data-section="header"]').getByRole('button', { name: 'Use dark theme' }),
  ).toBeEnabled();
  await expect(firstStep).toHaveAttribute('aria-current', 'step');
  await secondStep.click();
  await expect(secondStep).toHaveAttribute('aria-current', 'step');
  await expect(process.getByRole('heading', { level: 3 })).toHaveText('Complete the review');
  await expect(process.locator('.kc-process-image-layer[data-state="active"] img')).toHaveAttribute(
    'src',
    /content_2/,
  );

  await secondStep.press('End');
  const lastStep = navigation.getByRole('button', { name: /Sustain the relationship/ });
  await expect(lastStep).toHaveAttribute('aria-current', 'step');
  await expect(lastStep).toBeFocused();

  const expectedHeight = isMobile ? 96 : 128;
  await expect(lastStep).toHaveCSS('height', `${expectedHeight}px`);

  const viewportFit = await process.evaluate((section) => {
    const stage = section.querySelector<HTMLElement>('.kc-process-stage');
    return {
      sectionHeight: section.getBoundingClientRect().height,
      stageHeight: stage?.getBoundingClientRect().height ?? 0,
      viewportHeight: window.innerHeight,
    };
  });
  expect(viewportFit.sectionHeight).toBeLessThanOrEqual(viewportFit.viewportHeight);
  expect(viewportFit.stageHeight).toBeLessThanOrEqual(viewportFit.viewportHeight * 0.35);

  if (isMobile) {
    const dimensions = await page.evaluate(() => {
      const processNavigation = document.querySelector<HTMLElement>('.kc-process-navigation');
      return {
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        navigationClientWidth: processNavigation?.clientWidth ?? 0,
        navigationScrollWidth: processNavigation?.scrollWidth ?? 0,
      };
    });

    expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
    expect(dimensions.navigationScrollWidth).toBeGreaterThan(dimensions.navigationClientWidth);
  }
});
