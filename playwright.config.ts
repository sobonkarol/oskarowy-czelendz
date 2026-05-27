import { defineConfig } from "@playwright/test"
import { defineBddConfig } from "playwright-bdd"

const testDir = defineBddConfig({
  features: "e2e/features/**/*.feature",
  steps: ["e2e/steps/**/*.ts", "e2e/fixtures.ts"],
})

export default defineConfig({
  testDir,
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [
        ["github"],
        [
          "@estruyf/github-actions-reporter",
          { title: "E2E Test Results", useDetails: true, showError: true },
        ],
      ]
    : "list",
  globalSetup: "./e2e/global.setup.ts",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    locale: "pl-PL",
    storageState: "e2e/.auth/user.json",
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
