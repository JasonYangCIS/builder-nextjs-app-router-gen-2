import { test, expect } from "@playwright/test";

// Tests run against the static fixture page at /test/blog-components
// which renders every blog component with known, deterministic data.

test.describe("BlogArticleHero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/blog-components");
  });

  test("renders an img element inside the hero", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator("img")).toBeVisible();
  });

  test("img has the correct alt text", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator("img")).toHaveAttribute("alt", "Test hero image");
  });

  test("renders a dark gradient overlay with aria-hidden", async ({ page }) => {
    const hero = page.locator("#hero");
    const overlay = hero.locator("[aria-hidden]").first();
    await expect(overlay).toHaveClass(/from-brand-950/);
  });
});

test.describe("BlogArticleHeader", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/blog-components");
  });

  test("renders the title as an h1", async ({ page }) => {
    const section = page.locator("#header-full");
    await expect(section.getByRole("heading", { level: 1, name: "Test Article Title" })).toBeVisible();
  });

  test("renders the blurb as a paragraph", async ({ page }) => {
    const section = page.locator("#header-full");
    await expect(section.getByText("A test article blurb.")).toBeVisible();
  });

  test("renders the date in a <time> element with dateTime attribute", async ({ page }) => {
    const section = page.locator("#header-full");
    const time = section.locator("time");
    await expect(time).toBeVisible();
    await expect(time).toHaveAttribute("dateTime", "2024-01-15T00:00:00.000Z");
    // Formatted text is locale/timezone-dependent — just assert it's non-empty
    const text = await time.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("renders nothing when all props are null", async ({ page }) => {
    const section = page.locator("#header-empty");
    await expect(section.locator("h1")).toHaveCount(0);
    await expect(section.locator("time")).toHaveCount(0);
  });
});

test.describe("BlogArticleBody", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/blog-components");
  });

  test("renders HTML content inside a prose section", async ({ page }) => {
    const section = page.locator("#body-normal");
    await expect(section.locator(".prose")).toBeVisible();
  });

  test("renders paragraph content", async ({ page }) => {
    const section = page.locator("#body-normal");
    await expect(section.getByText("Test paragraph content.")).toBeVisible();
  });

  test("renders heading inside HTML content", async ({ page }) => {
    const section = page.locator("#body-normal");
    await expect(section.getByRole("heading", { name: "Section Heading" })).toBeVisible();
  });

  test("renders anchor tags inside HTML content", async ({ page }) => {
    const section = page.locator("#body-normal");
    await expect(section.locator("a[href='/safe']")).toBeVisible();
  });

  test("strips script tags from HTML (XSS protection)", async ({ page }) => {
    const section = page.locator("#body-xss");
    // Safe text renders
    await expect(section.getByText("Safe text")).toBeVisible();
    // Script was stripped — the global should not be set
    const xssSet = await page.evaluate(() => (window as unknown as Record<string, unknown>).__xssTest);
    expect(xssSet).toBeUndefined();
    // No <script> tags in DOM
    await expect(section.locator("script")).toHaveCount(0);
  });

  test("strips onerror attributes from img tags (XSS protection)", async ({ page }) => {
    const section = page.locator("#body-xss");
    const img = section.locator("img");
    if (await img.count() > 0) {
      await expect(img).not.toHaveAttribute("onerror");
    }
  });
});

test.describe("BlogArticleCard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/blog-components");
  });

  test("renders as an <li> with an accessible link", async ({ page }) => {
    const section = page.locator("#card-full");
    const link = section.getByRole("link", { name: /Read article: Test Article Title/ });
    await expect(link).toBeVisible();
  });

  test("link href points to the correct route and slug", async ({ page }) => {
    const section = page.locator("#card-full");
    const link = section.getByRole("link");
    await expect(link).toHaveAttribute("href", "/blog-article/test-article");
  });

  test("renders the article title", async ({ page }) => {
    const section = page.locator("#card-full");
    await expect(section.getByRole("heading", { name: "Test Article Title" })).toBeVisible();
  });

  test("renders the article blurb", async ({ page }) => {
    const section = page.locator("#card-full");
    await expect(section.getByText("A test article blurb for Playwright tests.")).toBeVisible();
  });

  test("renders the formatted date in a <time> element", async ({ page }) => {
    const section = page.locator("#card-full");
    const time = section.locator("time");
    await expect(time).toBeVisible();
    await expect(time).toHaveAttribute("dateTime", "2024-01-15T00:00:00.000Z");
    // Formatted text is locale/timezone-dependent — just assert it's non-empty
    const text = await time.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("renders the category as a Badge", async ({ page }) => {
    const section = page.locator("#card-full");
    await expect(section.locator("span").filter({ hasText: "Technology" })).toBeVisible();
  });

  test("renders a placeholder div when image is null", async ({ page }) => {
    const section = page.locator("#card-no-image");
    // No img tag — placeholder div is rendered instead
    await expect(section.locator("img")).toHaveCount(0);
    await expect(section.locator("[aria-hidden='true']")).toBeVisible();
  });

  test("falls back to 'Untitled' when title is null", async ({ page }) => {
    const section = page.locator("#card-minimal");
    await expect(section.getByRole("heading", { name: "Untitled" })).toBeVisible();
  });

  test("link aria-label falls back for untitled article", async ({ page }) => {
    const section = page.locator("#card-minimal");
    const link = section.getByRole("link");
    await expect(link).toHaveAttribute("aria-label", "Read article");
  });

  test("does not render date or category when null", async ({ page }) => {
    // #card-minimal has title=null, blurb=null, date=null, image=null, category=null
    const section = page.locator("#card-minimal");
    await expect(section.locator("time")).toHaveCount(0);
    // No category badge — neutral badge uses bg-zinc-100 with text; placeholder div is aria-hidden
    await expect(section.locator("span.rounded-md")).toHaveCount(0);
  });

  test("has focus-visible ring for keyboard navigation", async ({ page }) => {
    const section = page.locator("#card-full");
    await expect(section.getByRole("link")).toHaveClass(/focus-visible:ring-2/);
  });
});

test.describe("BlogArticleList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/blog-components");
  });

  test("renders a <ul> grid", async ({ page }) => {
    const section = page.locator("#list");
    await expect(section.locator("ul.grid")).toBeVisible();
  });

  test("renders the correct number of article cards", async ({ page }) => {
    const section = page.locator("#list");
    // 3 articles passed — 3 <li> elements
    await expect(section.locator("li")).toHaveCount(3);
  });

  test("each card links to the correct route prefix", async ({ page }) => {
    const section = page.locator("#list");
    const links = section.getByRole("link");
    for (const link of await links.all()) {
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\/blog-article\/.+/);
    }
  });
});
