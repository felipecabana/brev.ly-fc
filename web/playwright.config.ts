import { defineConfig, devices } from '@playwright/test'

const e2ePort = 5199
const e2eApiPort = 3334
const apiUrl = `http://localhost:${String(e2eApiPort)}`
const frontendUrl = `http://localhost:${String(e2ePort)}`

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.e2e-spec.ts',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: frontendUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../server',
      url: `${apiUrl}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...process.env,
        PORT: String(e2eApiPort),
        CORS_ORIGIN: frontendUrl,
      },
    },
    {
      command: `npm run dev -- --port ${String(e2ePort)} --strictPort`,
      url: frontendUrl,
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        ...process.env,
        VITE_FRONTEND_URL: frontendUrl,
        VITE_BACKEND_URL: apiUrl,
      },
    },
  ],
})
