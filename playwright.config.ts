import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the production build (npm run build + vite preview).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // e2e/reporter.ts: writes tests.json, read by Under the hood, Tests
  reporter: [[process.env.CI ? 'github' : 'list'], ['./e2e/reporter.ts']],
  use: {
    baseURL: 'http://localhost:4173',
    // skips the boot screen; boot.spec.ts turns motion back on to test it
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }, testIgnore: /mobile\.spec/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /mobile\.spec/ },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
