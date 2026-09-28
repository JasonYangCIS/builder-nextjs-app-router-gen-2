import { test, expect } from "@playwright/test";

test.describe("Search Term Demo (/search-term-demo)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search-term-demo");
  });

  test("renders the page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Search Term Demo" })).toBeVisible();
  });

  test("renders the query form controls", async ({ page }) => {
    await expect(page.getByLabel("Search terms")).toBeVisible();
    await expect(page.getByRole("button", { name: "Run query" })).toBeVisible();
  });

  test("renders the request shape code panel", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Request shape" })).toBeVisible();
    await expect(page.locator("pre code")).toContainText("fetchEntries");
    await expect(page.locator("pre code")).toContainText("data.searchTerms");
  });

  test("searching a real term returns a match or a no-results message", async ({ page }) => {
    await page.getByLabel("Search terms").fill("cheese");
    await page.getByRole("button", { name: "Run query" }).click();

    await expect(
      page.getByText(/No entries matched|matching entr(y|ies)/)
    ).toBeVisible({ timeout: 15000 });
  });

  test("searching a term with no matches shows the no-results message", async ({ page }) => {
    await page.getByLabel("Search terms").fill("this-term-should-not-exist-anywhere");
    await page.getByRole("button", { name: "Run query" }).click();

    await expect(page.getByText("No entries matched")).toBeVisible({ timeout: 15000 });
  });
});
