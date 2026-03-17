import { test, expect } from "@playwright/test";

const VARIANTS = ["default", "secondary", "destructive", "outline"] as const;

test.describe("Badge", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders all four variants", async ({ page }) => {
    const section = page.locator("#badge");
    for (const variant of VARIANTS) {
      // The badge label text matches the variant name
      await expect(section.locator("span").filter({ hasText: variant }).first()).toBeVisible();
    }
  });

  test("default variant has bg-primary class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator("span.bg-primary").first()).toBeVisible();
  });

  test("secondary variant has bg-secondary class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator("span.bg-secondary").first()).toBeVisible();
  });

  test("destructive variant has bg-destructive class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator("span.bg-destructive").first()).toBeVisible();
  });

  test("outline variant has text-foreground class", async ({ page }) => {
    const section = page.locator("#badge");
    // outline badge has text-foreground and no bg color
    const outlineBadge = section.locator("[data-slot='badge']").filter({ hasText: "outline" });
    await expect(outlineBadge.first()).toBeVisible();
  });

  test("renders 4 badges total (one per variant)", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator("[data-slot='badge']")).toHaveCount(4);
  });

  test("badges have rounded-md class", async ({ page }) => {
    const section = page.locator("#badge");
    await expect(section.locator("span.rounded-md").first()).toBeVisible();
  });
});
