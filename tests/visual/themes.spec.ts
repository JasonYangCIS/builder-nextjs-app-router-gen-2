/**
 * Visual regression tests for all three themes across desktop and mobile viewports.
 *
 * Run to generate baselines:  npm run test:visual:update
 * Run to compare:             npm run test:visual
 */
import { test, expect, Page } from "@playwright/test";

const THEMES = ["default", "dark", "ritual"] as const;
type Theme = (typeof THEMES)[number];

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 375, height: 812 },
] as const;

async function setTheme(page: Page, theme: Theme) {
  await page.evaluate((t) => {
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, theme);
  await page.waitForFunction(
    (t) => document.documentElement.getAttribute("data-theme") === t,
    theme,
  );
}

for (const viewport of VIEWPORTS) {
  for (const theme of THEMES) {
    test(`design-system page — ${theme} — ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/design-system");
      await setTheme(page, theme);

      await expect(page).toHaveScreenshot(
        `design-system-${theme}-${viewport.name}.png`,
        {
          fullPage: true,
          animations: "disabled",
          // Allow small pixel differences from antialiasing / font rendering
          maxDiffPixelRatio: 0.01,
        },
      );
    });
  }
}
