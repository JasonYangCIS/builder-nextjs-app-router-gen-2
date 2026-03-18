import { test, expect } from "@playwright/test";

// Tests run against the static fixture page at /test/heroes
test.describe("HeroCentered", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/heroes");
    await page.addStyleTag({
      content: "builder-dev-tools-overview { pointer-events: none !important; }",
    });
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  test("renders headline as h1", async ({ page }) => {
    const section = page.locator("#centered-full");
    await expect(section.getByRole("heading", { level: 1, name: "Centered Headline" })).toBeVisible();
  });

  test("renders copy paragraph", async ({ page }) => {
    const section = page.locator("#centered-full");
    await expect(section.getByText("Centered copy text.")).toBeVisible();
  });

  test("renders primary CTA as a link", async ({ page }) => {
    const section = page.locator("#centered-full");
    const cta = section.getByRole("link", { name: "Centered CTA" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/centered");
  });

  test("renders secondary CTA when both label and URL are provided", async ({ page }) => {
    const section = page.locator("#centered-full");
    const secondary = section.getByRole("link", { name: /Secondary/ });
    await expect(secondary).toBeVisible();
    await expect(secondary).toHaveAttribute("href", "/secondary");
  });

  test("renders image frame regardless of whether image is provided", async ({ page }) => {
    // Image frame always present (shows placeholder when no image)
    await expect(page.locator("#centered-full [data-testid='hero-centered-image-frame']")).toBeVisible();
    await expect(page.locator("#centered-minimal [data-testid='hero-centered-image-frame']")).toBeVisible();
  });

  test("renders image when image prop is provided", async ({ page }) => {
    const section = page.locator("#centered-full");
    const img = section.locator("img");
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("alt", "Centered test image");
  });

  test("renders placeholder when no image is provided", async ({ page }) => {
    const section = page.locator("#centered-minimal");
    await expect(section.locator("[data-testid='hero-centered-image-placeholder']")).toBeVisible();
    await expect(section.locator("img")).toHaveCount(0);
  });

  // ── Badge ──────────────────────────────────────────────────────────────────

  test("renders badge when badgeLabel is provided", async ({ page }) => {
    const section = page.locator("#centered-full");
    const badge = section.locator("[data-testid='hero-centered-badge-wrapper']");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("New");
  });

  test("hides badge when badgeLabel is absent", async ({ page }) => {
    const section = page.locator("#centered-minimal");
    await expect(section.locator("[data-testid='hero-centered-badge-wrapper']")).toHaveCount(0);
  });

  // ── Image position ─────────────────────────────────────────────────────────

  test("image frame appears after text block when imagePosition is below", async ({ page }) => {
    const inner = page.locator("#centered-full [data-testid='hero-centered-inner']");
    const children = inner.locator(":scope > *");
    // text-block is first, image-frame is second
    await expect(children.nth(0)).toHaveAttribute("data-testid", "hero-centered-text-block");
    await expect(children.nth(1)).toHaveAttribute("data-testid", "hero-centered-image-frame");
  });

  test("image frame appears before text block when imagePosition is above", async ({ page }) => {
    const inner = page.locator("#centered-above [data-testid='hero-centered-inner']");
    const children = inner.locator(":scope > *");
    // image-frame is first, text-block is second
    await expect(children.nth(0)).toHaveAttribute("data-testid", "hero-centered-image-frame");
    await expect(children.nth(1)).toHaveAttribute("data-testid", "hero-centered-text-block");
  });

  // ── Conditional rendering ──────────────────────────────────────────────────

  test("hides secondary CTA when secondaryCtaUrl is absent", async ({ page }) => {
    const section = page.locator("#centered-minimal");
    await expect(section.locator("[data-testid='hero-centered-actions'] a")).toHaveCount(1);
  });

  test("hides primary CTA when ctaUrl is absent", async ({ page }) => {
    const section = page.locator("#centered-null");
    await expect(section.locator("[data-testid='hero-centered-actions'] a")).toHaveCount(0);
  });

  // ── Null safety ────────────────────────────────────────────────────────────

  test("renders without errors when all props are null", async ({ page }) => {
    const section = page.locator("#centered-null");
    await expect(section.locator("[data-testid='hero-centered']")).toBeVisible();
    await expect(section.locator("h1")).toHaveCount(0);
    await expect(section.locator("[data-testid='hero-centered-copy']")).toHaveCount(0);
    await expect(section.locator("[data-testid='hero-centered-badge-wrapper']")).toHaveCount(0);
    await expect(section.locator("[data-testid='hero-centered-actions'] a")).toHaveCount(0);
    // Image frame still renders with placeholder
    await expect(section.locator("[data-testid='hero-centered-image-frame']")).toBeVisible();
    await expect(section.locator("[data-testid='hero-centered-image-placeholder']")).toBeVisible();
  });

  test("defaults to image-below layout when imagePosition is null", async ({ page }) => {
    const inner = page.locator("#centered-null [data-testid='hero-centered-inner']");
    const children = inner.locator(":scope > *");
    // text-block is first (below = text before image)
    await expect(children.nth(0)).toHaveAttribute("data-testid", "hero-centered-text-block");
    await expect(children.nth(1)).toHaveAttribute("data-testid", "hero-centered-image-frame");
  });

  // ── Layout ─────────────────────────────────────────────────────────────────

  test("text block is centered", async ({ page }) => {
    const textBlock = page.locator("#centered-full [data-testid='hero-centered-text-block']");
    // Centering is applied via the SCSS module, not a Tailwind class
    const textAlign = await textBlock.evaluate(
      (el) => getComputedStyle(el).textAlign,
    );
    expect(textAlign).toBe("center");
  });
});
