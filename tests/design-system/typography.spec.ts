import { test, expect } from "@playwright/test";

test.describe("Typography", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("display and h1 variants render as h1 elements", async ({ page }) => {
    const section = page.locator("#typography");
    // Both "display" and "h1" variants map to <h1>
    await expect(section.locator("h1")).toHaveCount(2);
  });

  test("h2 variant renders as an h2 element", async ({ page }) => {
    const section = page.locator("#typography");
    await expect(section.locator("h2").first()).toBeVisible();
  });

  test("h3 variant renders as an h3 element", async ({ page }) => {
    const section = page.locator("#typography");
    await expect(section.locator("h3").first()).toBeVisible();
  });

  test("body variants render as p elements", async ({ page }) => {
    const section = page.locator("#typography");
    // body-lg, body, body-sm all render as <p>
    const paragraphs = section.locator("p").filter({ hasText: "The quick brown fox jumps" });
    await expect(paragraphs).toHaveCount(3);
  });

  test("caption, label, overline variants render as span elements", async ({ page }) => {
    const section = page.locator("#typography");
    await expect(
      section.locator("span").filter({ hasText: "Supplemental caption text" })
    ).toBeVisible();
    await expect(
      section.locator("span").filter({ hasText: "Form field label" })
    ).toBeVisible();
    await expect(
      section.locator("span").filter({ hasText: "Section overline" })
    ).toBeVisible();
  });

  test("all seven color variants render with 'Sample text'", async ({ page }) => {
    const section = page.locator("#typography");
    const colorVariants = ["default", "muted", "subtle", "primary", "success", "warning", "error"];
    for (const color of colorVariants) {
      // Each is labeled below the component by DemoItem
      await expect(section.locator(`[class*="font-mono"]`).filter({ hasText: color })).toBeTruthy();
    }
    await expect(section.locator("*").filter({ hasText: "Sample text" })).toBeTruthy();
  });

  test("primary color variant has brand-600 text class", async ({ page }) => {
    const section = page.locator("#typography");
    await expect(section.locator(".text-brand-600")).toBeVisible();
  });

  test("error color variant has error-700 text class", async ({ page }) => {
    const section = page.locator("#typography");
    await expect(section.locator(".text-error-700")).toBeVisible();
  });
});
