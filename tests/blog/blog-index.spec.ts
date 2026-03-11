import { test, expect } from "@playwright/test";

test.describe("Blog index (/blog)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("renders the page heading 'Blog'", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Blog", exact: true })).toBeVisible();
  });

  test("renders the subtitle", async ({ page }) => {
    await expect(page.getByText("Choose a blog pattern to browse articles.")).toBeVisible();
  });

  test("shows all three blog pattern cards", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Data Model" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Section Model" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hybrid Approach" })).toBeVisible();
  });

  test("each card shows 'View articles →' CTA", async ({ page }) => {
    await expect(page.getByText("View articles →")).toHaveCount(3);
  });

  test("Data Model card links to /blog-article", async ({ page }) => {
    await expect(page.locator("a[href='/blog-article']")).toBeVisible();
  });

  test("Section Model card links to /blog-article-section", async ({ page }) => {
    await expect(page.locator("a[href='/blog-article-section']")).toBeVisible();
  });

  test("Hybrid Approach card links to /blog-article-template", async ({ page }) => {
    await expect(page.locator("a[href='/blog-article-template']")).toBeVisible();
  });

  test("cards have focus ring styles for keyboard accessibility", async ({ page }) => {
    const cards = page.locator("ul a[href^='/blog-article']");
    await expect(cards.first()).toHaveClass(/focus-visible:ring-2/);
  });

  test("Data Model card contains its description", async ({ page }) => {
    await expect(
      page.getByText("A blog purely in code, populated by a Data model.")
    ).toBeVisible();
  });
});
