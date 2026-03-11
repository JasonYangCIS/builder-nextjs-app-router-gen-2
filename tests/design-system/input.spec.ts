import { test, expect } from "@playwright/test";

test.describe("Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
  });

  test("renders label associated with input via htmlFor", async ({ page }) => {
    const section = page.locator("#input");
    const label = section.getByText("Email address").first();
    await expect(label).toBeVisible();
    // clicking the label focuses the input
    await label.click();
    const input = section.getByLabel("Email address").first();
    await expect(input).toBeFocused();
  });

  test("renders placeholder text", async ({ page }) => {
    const section = page.locator("#input");
    await expect(section.getByPlaceholder("you@example.com")).toBeVisible();
  });

  test("accepts typed input", async ({ page }) => {
    const section = page.locator("#input");
    const input = section.getByPlaceholder("you@example.com");
    await input.fill("test@example.com");
    await expect(input).toHaveValue("test@example.com");
  });

  test("renders helper text below the input", async ({ page }) => {
    const section = page.locator("#input");
    await expect(
      section.getByText("Min 8 characters with one uppercase letter and number.")
    ).toBeVisible();
  });

  test("error state sets aria-invalid on the input", async ({ page }) => {
    const section = page.locator("#input");
    const errorInput = section.locator("input[aria-invalid='true']");
    await expect(errorInput).toBeVisible();
  });

  test("error text renders with role=alert", async ({ page }) => {
    const section = page.locator("#input");
    const alert = section.locator("[role='alert']");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("Please enter a valid email address.");
  });

  test("required input label shows asterisk", async ({ page }) => {
    const section = page.locator("#input");
    // The required label contains "Full name" + an asterisk span
    const requiredLabel = section.getByText("Full name", { exact: false });
    await expect(requiredLabel).toBeVisible();
    // The asterisk is a sibling span inside the label
    const asterisk = section.locator("label").filter({ hasText: "Full name" }).locator("span");
    await expect(asterisk).toContainText("*");
  });

  test("disabled input is not editable", async ({ page }) => {
    const section = page.locator("#input");
    const disabledInput = section.locator("input[disabled]");
    await expect(disabledInput).toBeDisabled();
    await expect(disabledInput).toHaveValue("jsmith");
  });

  test("password input masks its value", async ({ page }) => {
    const section = page.locator("#input");
    const pwInput = section.locator("input[type='password']");
    await expect(pwInput).toBeVisible();
  });
});
