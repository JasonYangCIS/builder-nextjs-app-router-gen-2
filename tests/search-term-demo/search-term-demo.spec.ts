import { test, expect } from "@playwright/test";

test.describe("Search Term Demo (/search-term-demo)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search-term-demo");
  });

  test("renders the page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Search Term Demo" })).toBeVisible();
  });

  test("renders the search form", async ({ page }) => {
    await expect(page.getByLabel("Search term")).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("renders the SDK implementation code example", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "SDK implementation" })).toBeVisible();
    await expect(page.locator("pre code")).toContainText("fetchEntries");
    await expect(page.locator("pre code")).toContainText("data.searchTerms");
  });

  test("searching shows a result or a no-results message", async ({ page }) => {
    await page.getByLabel("Search term").fill("this-term-should-not-exist-anywhere");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(
      page.getByText(/No pages found with a searchTerms match/)
    ).toBeVisible({ timeout: 15000 });
  });
});
