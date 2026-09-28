import { test, expect } from "@playwright/test";

test.describe("Targeting + Search Metadata demo (/search-term-demo)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search-term-demo");
  });

  test("renders the page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Targeting + Search Metadata" })).toBeVisible();
  });

  test("renders the query form controls", async ({ page }) => {
    await expect(page.getByLabel("Search terms")).toBeVisible();
    await expect(page.getByLabel("Locale (userAttributes)")).toBeVisible();
    await expect(page.getByLabel("Customer tier (userAttributes)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Run query" })).toBeVisible();
  });

  test("renders the request shape code panel", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Request shape" })).toBeVisible();
    await expect(page.locator("pre code")).toContainText("userAttributes");
    await expect(page.locator("pre code")).toContainText("data.searchTerms");
  });

  test("matches only the entry satisfying both targeting and search terms", async ({ page }) => {
    await page.getByLabel("Search terms").fill("cheese");
    await page.getByLabel("Locale (userAttributes)").selectOption("en-US");
    await page.getByLabel("Customer tier (userAttributes)").selectOption("wholesale");
    await page.getByRole("button", { name: "Run query" }).click();

    await expect(page.getByText("1 of 3 sample entries matched")).toBeVisible();
    await expect(page.getByText("Wholesale Dairy Bundle (US)")).toBeVisible();
  });

  test("changing locale with the same search term excludes the entry", async ({ page }) => {
    await page.getByLabel("Search terms").fill("cheese");
    await page.getByLabel("Locale (userAttributes)").selectOption("en-US");
    await page.getByLabel("Customer tier (userAttributes)").selectOption("retail");
    await page.getByRole("button", { name: "Run query" }).click();

    await expect(page.getByText("0 of 3 sample entries matched")).toBeVisible();
  });
});
