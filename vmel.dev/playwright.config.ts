import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: process.env.QA_BASE_URL || 'http://127.0.0.1:4173', browserName: 'chromium' },
  webServer: process.env.QA_BASE_URL ? undefined : { command: 'npm.cmd run preview -- --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
});
