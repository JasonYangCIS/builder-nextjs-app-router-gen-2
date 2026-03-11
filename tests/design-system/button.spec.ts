import { test, expect } from "@playwright/test";

test.describe("Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders all four variants", async ({ page }) => {
    const section = page.locator("#button");
    // primary, secondary, ghost all labelled "Button"; destructive labelled "Delete"
    await expect(section.getByRole("button", { name: "Button" })).toHaveCount(6);
    await expect(section.getByRole("button", { name: "Delete" })).toBeVisible();
  });

  test("primary variant has brand-600 background class", async ({ page }) => {
    const section = page.locator("#button");
    const primary = section.getByRole("button", { name: "Button" }).first();
    await expect(primary).toHaveClass(/bg-brand-600/);
  });

  test("destructive variant has error-600 background class", async ({ page }) => {
    const section = page.locator("#button");
    await expect(section.getByRole("button", { name: "Delete" })).toHaveClass(/bg-error-600/);
  });

  test("sm size uses rounded-md, md and lg use rounded-lg", async ({ page }) => {
    const section = page.locator("#button");
    // Only the sm button uses rounded-md; all others use rounded-lg
    await expect(section.locator("button.rounded-md")).toHaveCount(1);
    // lg size uses text-base; confirm at least one exists
    await expect(section.locator("button.text-base")).toHaveCount(1);
  });

  test("loading button is disabled and aria-busy", async ({ page }) => {
    const section = page.locator("#button");
    const btn = section.getByRole("button", { name: "Saving…" });
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute("aria-busy", "true");
    await expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  test("loading button renders a spinner SVG", async ({ page }) => {
    const section = page.locator("#button");
    const btn = section.getByRole("button", { name: "Saving…" });
    await expect(btn.locator("svg")).toBeVisible();
  });

  test("disabled buttons have disabled attribute", async ({ page }) => {
    const section = page.locator("#button");
    const disabledBtns = section.getByRole("button", { name: "Disabled" });
    for (const btn of await disabledBtns.all()) {
      await expect(btn).toBeDisabled();
      await expect(btn).toHaveAttribute("aria-disabled", "true");
    }
  });

  test("sm size has rounded-md class, md/lg have rounded-lg", async ({ page }) => {
    const section = page.locator("#button");
    const buttons = section.getByRole("button", { name: "Button" });
    // First three "Button" buttons are variants (primary, secondary, ghost) — md size
    // Next three are sizes: sm, md, lg
    const smBtn = buttons.nth(3);
    const mdBtn = buttons.nth(4);
    await expect(smBtn).toHaveClass(/rounded-md/);
    await expect(mdBtn).toHaveClass(/rounded-lg/);
  });
});
