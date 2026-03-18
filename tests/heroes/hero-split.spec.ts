import { test, expect } from "@playwright/test";

// Tests run against the static fixture page at /test/heroes
test.describe("HeroSplit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/heroes");
    await page.addStyleTag({
      content: "builder-dev-tools-overview { pointer-events: none !important; }",
    });
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  test("renders headline as h1", async ({ page }) => {
    const section = page.locator("#split-right");
    await expect(section.getByRole("heading", { level: 1, name: "Split Right Headline" })).toBeVisible();
  });

  test("renders copy paragraph", async ({ page }) => {
    const section = page.locator("#split-right");
    await expect(section.getByText("Split right copy text.")).toBeVisible();
  });

  test("renders primary CTA as a link", async ({ page }) => {
    const section = page.locator("#split-right");
    const cta = section.getByRole("link", { name: "Primary CTA" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/primary");
  });

  test("renders secondary CTA when both label and URL are provided", async ({ page }) => {
    const section = page.locator("#split-right");
    const secondary = section.getByRole("link", { name: "Secondary CTA" });
    await expect(secondary).toBeVisible();
    await expect(secondary).toHaveAttribute("href", "/secondary");
  });

  test("renders image when image prop is provided", async ({ page }) => {
    const section = page.locator("#split-right");
    const img = section.locator(".hero-split__image");
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("alt", "Split test image");
  });

  // ── Image position ─────────────────────────────────────────────────────────

  test("applies image-right class when imagePosition is right", async ({ page }) => {
    const section = page.locator("#split-right section");
    await expect(section).toHaveClass(/hero-split--image-right/);
  });

  test("applies image-left class when imagePosition is left", async ({ page }) => {
    const section = page.locator("#split-left section");
    await expect(section).toHaveClass(/hero-split--image-left/);
  });

  // ── Placeholder ────────────────────────────────────────────────────────────

  test("renders placeholder when no image is provided", async ({ page }) => {
    const section = page.locator("#split-minimal");
    await expect(section.locator(".hero-split__image-placeholder")).toBeVisible();
    await expect(section.locator(".hero-split__image")).toHaveCount(0);
  });

  // ── Conditional rendering ──────────────────────────────────────────────────

  test("hides secondary CTA when secondaryCtaUrl is absent", async ({ page }) => {
    const section = page.locator("#split-minimal");
    // Only one CTA link should exist
    await expect(section.locator(".hero-split__actions a")).toHaveCount(1);
  });

  test("hides primary CTA when ctaUrl is absent", async ({ page }) => {
    const section = page.locator("#split-null");
    await expect(section.locator(".hero-split__actions a")).toHaveCount(0);
  });

  // ── Null safety ────────────────────────────────────────────────────────────

  test("renders without errors when all props are null", async ({ page }) => {
    const section = page.locator("#split-null");
    await expect(section.locator(".hero-split")).toBeVisible();
    await expect(section.locator("h1")).toHaveCount(0);
    await expect(section.locator(".hero-split__copy")).toHaveCount(0);
    await expect(section.locator(".hero-split__actions a")).toHaveCount(0);
    // Placeholder visible (no image URL)
    await expect(section.locator(".hero-split__image-placeholder")).toBeVisible();
  });

  test("defaults to image-right layout when imagePosition is null", async ({ page }) => {
    const section = page.locator("#split-null section");
    await expect(section).toHaveClass(/hero-split--image-right/);
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  test("image wrapper is aria-hidden when no imageAlt provided", async ({ page }) => {
    const wrapper = page.locator("#split-minimal .hero-split__image-wrapper");
    await expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  test("image wrapper does not have aria-hidden when imageAlt is provided", async ({ page }) => {
    const wrapper = page.locator("#split-right .hero-split__image-wrapper");
    // aria-hidden should be absent (undefined → not rendered as attribute)
    await expect(wrapper).not.toHaveAttribute("aria-hidden", "true");
  });
});
