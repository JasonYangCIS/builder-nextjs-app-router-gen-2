import { test, expect } from "@playwright/test";

// Builder DevTools injects its own <footer> elements — scope to our app footer by class.
const APP_FOOTER = "footer.mt-16";

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("renders a footer element", async ({ page }) => {
    await expect(page.locator(APP_FOOTER)).toBeVisible();
  });

  test("shows copyright text with current year", async ({ page }) => {
    const year = new Date().getFullYear().toString();
    await expect(page.locator(APP_FOOTER)).toContainText(year);
  });

  test("shows the site name in copyright", async ({ page }) => {
    await expect(page.locator(APP_FOOTER)).toContainText("My Builder Sandbox");
  });

  test("shows 'All rights reserved' text", async ({ page }) => {
    await expect(page.locator(APP_FOOTER)).toContainText("All rights reserved");
  });

  test("has a top border", async ({ page }) => {
    await expect(page.locator(APP_FOOTER)).toHaveClass(/border-t/);
  });

  test("footer is present on every main page", async ({ page }) => {
    for (const path of ["/blog", "/design-system", "/blog-article", "/blog-article-section"]) {
      // Use domcontentloaded — faster than "load" since SSR pages render footer in HTML before scripts run
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator(APP_FOOTER)).toBeVisible();
    }
  });
});
