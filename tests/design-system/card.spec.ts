import { test, expect } from "@playwright/test";

test.describe("Card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders card with title and description via composition", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.getByText("Card Title").first()).toBeVisible();
    await expect(section.getByText("Card description goes here.").first()).toBeVisible();
  });

  test("renders card content area", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.getByText("Main content area.").first()).toBeVisible();
  });

  test("renders card footer with action button", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.getByRole("button", { name: "Action" })).toBeVisible();
  });

  test("card has shadow-sm class by default", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.locator(".shadow-sm").first()).toBeVisible();
  });

  test("card has rounded-xl class", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.locator(".rounded-xl").first()).toBeVisible();
  });

  test("renders minimal card variant", async ({ page }) => {
    const section = page.locator("#card");
    await expect(section.getByText("Simple card")).toBeVisible();
    await expect(section.getByText("Just a box with border and shadow.")).toBeVisible();
  });

  test("card has border class", async ({ page }) => {
    const section = page.locator("#card");
    const card = section.locator("[data-slot='card']").first();
    await expect(card).toHaveClass(/border/);
  });
});
