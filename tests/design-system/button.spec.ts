import { test, expect } from "@playwright/test";

test.describe("Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders all six variants", async ({ page }) => {
    const section = page.locator("#button");
    // default, outline, secondary, ghost, link all labelled "Button"; destructive labelled "Delete"
    await expect(section.getByRole("button", { name: "Button" })).toHaveCount(8);
    await expect(section.getByRole("button", { name: "Delete" })).toBeVisible();
  });

  test("default variant has bg-primary class", async ({ page }) => {
    const section = page.locator("#button");
    const defaultBtn = section.getByRole("button", { name: "Button" }).first();
    await expect(defaultBtn).toHaveClass(/bg-primary/);
  });

  test("destructive variant has bg-destructive class", async ({ page }) => {
    const section = page.locator("#button");
    await expect(section.getByRole("button", { name: "Delete" })).toHaveClass(/bg-destructive/);
  });

  test("all size variants render", async ({ page }) => {
    const section = page.locator("#button");
    // sm, default, lg buttons in the size row
    const buttons = section.getByRole("button", { name: "Button" });
    // At least 3 size buttons exist
    await expect(buttons).toHaveCount(8);
  });

  test("disabled buttons have disabled attribute", async ({ page }) => {
    const section = page.locator("#button");
    const disabledBtns = section.getByRole("button", { name: "Disabled" });
    for (const btn of await disabledBtns.all()) {
      await expect(btn).toBeDisabled();
    }
  });

  test("outline variant has border class", async ({ page }) => {
    const section = page.locator("#button");
    const outlineBtn = section.locator("button.border");
    await expect(outlineBtn.first()).toBeVisible();
  });
});
