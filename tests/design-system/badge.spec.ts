import { test, expect } from "@playwright/test";

const VARIANTS = ["neutral", "primary", "success", "warning", "error"] as const;

test.describe("Badge", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders all five variants at md size", async ({ page }) => {
    const section = page.locator("#badge");
    for (const variant of VARIANTS) {
      // The badge label text matches the variant name
      await expect(section.locator("span").filter({ hasText: variant }).first()).toBeVisible();
    }
  });

  test("md size has py-1 padding class", async ({ page }) => {
    const section = page.locator("#badge");
    // First badge row is md size
    const firstBadge = section.locator("span.rounded-md").first();
    await expect(firstBadge).toHaveClass(/py-1/);
  });

  test("sm size has py-0.5 padding class", async ({ page }) => {
    const section = page.locator("#badge");
    // sm badges appear in the second row — get last set
    const smBadges = section.locator("span.rounded-md");
    const count = await smBadges.count();
    const lastBadge = smBadges.nth(count - 1);
    await expect(lastBadge).toHaveClass(/py-0\.5/);
  });

  test("success variant has success background class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator(".bg-success-100").first()).toBeVisible();
  });

  test("error variant has error background class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator(".bg-error-100").first()).toBeVisible();
  });

  test("warning variant has warning background class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator(".bg-warning-100").first()).toBeVisible();
  });

  test("primary variant has brand background class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator(".bg-brand-100").first()).toBeVisible();
  });

  test("renders 10 badges total (5 variants × 2 sizes)", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator("span.rounded-md")).toHaveCount(10);
  });
});
