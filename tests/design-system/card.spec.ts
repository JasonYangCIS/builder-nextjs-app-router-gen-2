import { test, expect } from "@playwright/test";

test.describe("Card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders children content", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.getByText("Card title").first()).toBeVisible();
    await expect(section.getByText("Supporting text content.").first()).toBeVisible();
  });

  test("shadow=none has no shadow class", async ({ page }) => {
    const section = page.locator("#card");
    const noShadowCard = section.locator(".rounded-xl").first();
    await expect(noShadowCard).not.toHaveClass(/shadow-sm/);
    await expect(noShadowCard).not.toHaveClass(/shadow-md/);
  });

  test("shadow=sm applies shadow-sm class", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.locator(".shadow-sm").first()).toBeVisible();
  });

  test("shadow=md applies shadow-md class", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.locator(".shadow-md").first()).toBeVisible();
  });

  test("shadow=lg applies shadow-lg class", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.locator(".shadow-lg").first()).toBeVisible();
  });

  test("padding=none card has no padding class", async ({ page }) => {
    const section = page.locator("#card");
    // The padding demo row uses border-dashed cards — first one is padding=none
    const paddingCards = section.locator(".border-dashed");
    const noneCard = paddingCards.first();
    await expect(noneCard).toBeVisible();
    await expect(noneCard).not.toHaveClass(/p-4/);
    await expect(noneCard).not.toHaveClass(/p-6/);
  });

  test("padding=md applies p-6 class", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.locator(".p-6").first()).toBeVisible();
  });

  test("borderless card renders content without a border ring", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.getByText("Floating card")).toBeVisible();
    await expect(section.getByText("No border, elevated with shadow.")).toBeVisible();
    // borderless=true means no ring-1 class — shadow-md is applied instead
    await expect(section.locator(".shadow-md").filter({ hasText: "Floating card" })).toBeVisible();
  });
});
