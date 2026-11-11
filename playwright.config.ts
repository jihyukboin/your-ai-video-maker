import { defineConfig, devices } from '@playwright/test';

// Tests run against the user-managed server; there is intentionally no webServer command.
export default defineConfig({
  testDir: './test/e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3003',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      testMatch: /\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
