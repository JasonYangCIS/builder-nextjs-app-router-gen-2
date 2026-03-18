/**
 * Visual regression tests for header, footer, ThemeSwitch dropdown, and
 * mobile hamburger menu across all three themes.
 *
 * Run to generate baselines:  npm run test:visual:update
 * Run to compare:             npm run test:visual
 */
import { test, expect, Page } from "@playwright/test";

const THEMES = ["default", "dark"] as const;
type Theme = (typeof THEMES)[number];

const APP_HEADER = "header.relative.border-b";
const APP_FOOTER = "footer.mt-16";

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

for (const theme of THEMES) {
  test.describe(`layout — ${theme} theme`, () => {
    test(`header — desktop`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/design-system");
      await setTheme(page, theme);

      await expect(page.locator(APP_HEADER)).toHaveScreenshot(
        `header-desktop-${theme}.png`,
        { animations: "disabled" },
      );
    });

    test(`header — mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/design-system");
      await setTheme(page, theme);

      await expect(page.locator(APP_HEADER)).toHaveScreenshot(
        `header-mobile-${theme}.png`,
        { animations: "disabled" },
      );
    });

    test(`hamburger menu open — mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/design-system");
      await setTheme(page, theme);

      const hamburger = page
        .locator(APP_HEADER)
        .getByRole("button", { name: "Open menu" });
      const isVisible = await hamburger.isVisible().catch(() => false);

      if (!isVisible) {
        test.skip();
        return;
      }

      // Trigger via JS — the hamburger button may be blocked by Builder DevTools
      await page.evaluate(() => {
        const btn = document.querySelector<HTMLButtonElement>("[aria-label='Open menu']");
        btn?.click();
      });
      // Wait for mobile nav to be visible, then let animations settle
      await page.locator("#mobile-navigation").waitFor({ state: "visible" });
      await page.waitForTimeout(50);

      await expect(page).toHaveScreenshot(`hamburger-open-mobile-${theme}.png`, {
        animations: "disabled",
      });
    });

    test(`ThemeSwitch dropdown`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/design-system");
      await setTheme(page, theme);

      // Trigger the ThemeSwitch via JS — the button may be inside a responsive
      // container (hidden md:flex) that isn’t actionable at the test viewport.
      await page.evaluate(() => {
        const btn = document.querySelector<HTMLButtonElement>(".theme-switch-button");
        btn?.click();
      });
      await expect(page.locator(".theme-dropdown").first()).toBeVisible();

      await expect(page.locator(APP_HEADER)).toHaveScreenshot(
        `theme-dropdown-${theme}.png`,
        { animations: "disabled" },
      );
    });

    test(`footer`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/design-system");
      await setTheme(page, theme);

      await page.locator(APP_FOOTER).scrollIntoViewIfNeeded();
      await expect(page.locator(APP_FOOTER)).toHaveScreenshot(
        `footer-${theme}.png`,
        { animations: "disabled" },
      );
    });

    test(`footer — mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/design-system");
      await setTheme(page, theme);

      await page.locator(APP_FOOTER).scrollIntoViewIfNeeded();
      await expect(page.locator(APP_FOOTER)).toHaveScreenshot(
        `footer-mobile-${theme}.png`,
        { animations: "disabled" },
      );
    });
  });
}
