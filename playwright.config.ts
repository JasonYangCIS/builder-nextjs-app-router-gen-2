import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.test to set PLAYWRIGHT_TEST=true
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  testDir: "./tests",
  snapshotDir: "./tests/__snapshots__",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev:test",
    url: "http://localhost:3000",
    // Reuse the running dev server locally and in cloud dev environments.
    // In GitHub Actions (the only CI provider this project uses), GITHUB_ACTIONS=true
    // and each run gets a fresh VM, so we always start a clean server there.
    reuseExistingServer: !process.env.GITHUB_ACTIONS,
    timeout: 120_000,
  },
});
