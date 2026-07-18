import { defineConfig, devices } from '@playwright/test';

const productCoreUrl = 'http://localhost:3000';
const adminAppUrl = 'http://localhost:3001';

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  outputDir: 'test-results/playwright',
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  retries: process.env.CI ? 2 : 0,
  testDir: 'tests/e2e',
  timeout: 30_000,
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm --filter @kclub/product-core dev',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: productCoreUrl,
    },
    {
      command: 'pnpm --filter @kclub/admin-app dev',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: adminAppUrl,
    },
  ],
  workers: process.env.CI ? 2 : undefined,
  projects: [
    {
      name: 'product-core-desktop',
      testMatch: 'product-core.smoke.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: productCoreUrl },
    },
    {
      name: 'product-core-mobile',
      testMatch: 'product-core.smoke.spec.ts',
      use: { ...devices['iPhone 13'], baseURL: productCoreUrl },
    },
    {
      name: 'admin-app-desktop',
      testMatch: 'admin-app.smoke.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: adminAppUrl },
    },
    {
      name: 'admin-app-mobile',
      testMatch: 'admin-app.smoke.spec.ts',
      use: { ...devices['iPhone 13'], baseURL: adminAppUrl },
    },
  ],
});
