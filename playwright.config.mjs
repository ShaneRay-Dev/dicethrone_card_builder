import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  webServer: {
    command: 'node tests/server.mjs',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: true,
    timeout: 15_000
  }
});
