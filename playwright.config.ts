import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120000,
    env: {
      DATABASE_URL: 'postgresql://remix_user:remix_password@localhost:5432/remix_db',
      NODE_ENV: 'test',
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || 'babybabylog',
      AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    },
  },
}); 