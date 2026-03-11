import { test, expect } from "@playwright/test";

test.describe("Counter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders with default count of 99", async ({ page }) => {
    const section = page.locator("#counter");
    const count = section.locator("span").filter({ hasText: "99" }).first();
    await expect(count).toBeVisible();
  });

  test("increment button increases count by 1", async ({ page }) => {
    const section = page.locator("#counter");
    const countDisplay = section.locator(".tabular-nums").first();

    await expect(countDisplay).toHaveText("99");
    await section.getByRole("button", { name: "Increment" }).first().click();
    await expect(countDisplay).toHaveText("100");
  });

  test("decrement button decreases count by 1", async ({ page }) => {
    const section = page.locator("#counter");
    const countDisplay = section.locator(".tabular-nums").first();

    await expect(countDisplay).toHaveText("99");
    await section.getByRole("button", { name: "Decrement" }).first().click();
    await expect(countDisplay).toHaveText("98");
  });

  test("multiple increments accumulate correctly", async ({ page }) => {
    const section = page.locator("#counter");
    const incrementBtn = section.getByRole("button", { name: "Increment" }).first();
    const countDisplay = section.locator(".tabular-nums").first();

    await incrementBtn.click();
    await incrementBtn.click();
    await incrementBtn.click();
    await expect(countDisplay).toHaveText("102");
  });

  test("increment and decrement together return to original value", async ({ page }) => {
    const section = page.locator("#counter");
    const countDisplay = section.locator(".tabular-nums").first();

    await section.getByRole("button", { name: "Increment" }).first().click();
    await section.getByRole("button", { name: "Decrement" }).first().click();
    await expect(countDisplay).toHaveText("99");
  });

  test("renders with initialCount=0", async ({ page }) => {
    const section = page.locator("#counter");
    // Each counter's count display uses tabular-nums — nth(1) is the second counter
    const countSpans = section.locator(".tabular-nums");
    await expect(countSpans.nth(1)).toHaveText("0");
  });

  test("renders with initialCount=10", async ({ page }) => {
    const section = page.locator("#counter");
    const countSpans = section.locator(".tabular-nums");
    await expect(countSpans.nth(2)).toHaveText("10");
  });

  test("uses secondary sm buttons internally", async ({ page }) => {
    const section = page.locator("#counter");
    // Decrement and Increment buttons in first counter use secondary variant (border-zinc-300)
    const decrementBtn = section.getByRole("button", { name: "Decrement" }).first();
    const incrementBtn = section.getByRole("button", { name: "Increment" }).first();
    await expect(decrementBtn).toHaveClass(/border-zinc-300/);
    await expect(incrementBtn).toHaveClass(/border-zinc-300/);
    // sm size has rounded-md class
    await expect(decrementBtn).toHaveClass(/rounded-md/);
  });
});
