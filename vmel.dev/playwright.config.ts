import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45000,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: process.env.QA_BASE_URL || 'http://127.0.0.1:4173', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: process.env.QA_BASE_URL ? undefined : { command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run preview -- --port 4173`, url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
