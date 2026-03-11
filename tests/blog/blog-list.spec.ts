import { test, expect } from "@playwright/test";

// These list pages connect to Builder — they render either articles or an empty state.
// Tests assert structure that is always present regardless of content.

test.describe("Blog list pages", () => {

  test.describe("Data Model (/blog-article)", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/blog-article");
    });

    test("renders the page heading", async ({ page }) => {
      await expect(page.getByRole("heading", { name: /Blog \(Data Model\)/ })).toBeVisible();
    });

    test("shows description text with 'Data model' mention", async ({ page }) => {
      await expect(page.getByText(/Data model/)).toBeVisible();
    });

    test("shows articles or empty-state message", async ({ page }) => {
      const articleList = page.locator("ul.grid");
      const emptyMsg = page.getByText("No articles yet.");
      const hasArticles = await articleList.isVisible();
      if (!hasArticles) {
        await expect(emptyMsg).toBeVisible();
      } else {
        await expect(articleList).toBeVisible();
      }
    });

    test("article cards link into /blog-article/[slug]", async ({ page }) => {
      const articleList = page.locator("ul.grid");
      const hasArticles = await articleList.isVisible().catch(() => false);
      if (!hasArticles) return;

      const firstCard = articleList.locator("a").first();
      const href = await firstCard.getAttribute("href");
      expect(href).toMatch(/^\/blog-article\/.+/);
    });
  });

  test.describe("Section Model (/blog-article-section)", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/blog-article-section");
    });

    test("renders the page heading", async ({ page }) => {
      await expect(page.getByRole("heading", { name: /Blog \(Section Model\)/ })).toBeVisible();
    });

    test("shows articles or empty-state message", async ({ page }) => {
      const articleList = page.locator("ul.grid");
      const hasArticles = await articleList.isVisible().catch(() => false);
      if (!hasArticles) {
        await expect(page.getByText("No articles yet.")).toBeVisible();
      } else {
        await expect(articleList).toBeVisible();
      }
    });

    test("article cards link into /blog-article-section/[slug]", async ({ page }) => {
      const articleList = page.locator("ul.grid");
      const hasArticles = await articleList.isVisible().catch(() => false);
      if (!hasArticles) return;

      const firstCard = articleList.locator("a").first();
      const href = await firstCard.getAttribute("href");
      expect(href).toMatch(/^\/blog-article-section\/.+/);
    });
  });

  test.describe("Hybrid Approach (/blog-article-template)", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/blog-article-template");
    });

    test("renders the page heading", async ({ page }) => {
      await expect(page.getByRole("heading", { name: /Blog \(Hybrid Approach\)/ })).toBeVisible();
    });

    test("shows articles or empty-state message", async ({ page }) => {
      const articleList = page.locator("ul.grid");
      const hasArticles = await articleList.isVisible().catch(() => false);
      if (!hasArticles) {
        await expect(page.getByText("No articles yet.")).toBeVisible();
      } else {
        await expect(articleList).toBeVisible();
      }
    });
  });
});
