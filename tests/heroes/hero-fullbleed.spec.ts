import { test, expect } from "@playwright/test";

// Tests run against the static fixture page at /test/heroes
test.describe("HeroFullBleed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/heroes");
    // Builder DevTools injects <builder-dev-tools-overview> which intercepts pointer events.
    await page.addStyleTag({
      content: "builder-dev-tools-overview { pointer-events: none !important; }",
    });
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  test("renders headline as h1", async ({ page }) => {
    const section = page.locator("#fullbleed-full");
    await expect(section.getByRole("heading", { level: 1, name: "Full Bleed Headline" })).toBeVisible();
  });

  test("renders copy paragraph", async ({ page }) => {
    const section = page.locator("#fullbleed-full");
    await expect(section.getByText("Full bleed copy text.")).toBeVisible();
  });

  test("renders CTA as a link containing a button", async ({ page }) => {
    const section = page.locator("#fullbleed-full");
    const cta = section.getByRole("link", { name: "Full Bleed CTA" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/fullbleed");
  });

  test("renders a dark overlay element with aria-hidden", async ({ page }) => {
    const section = page.locator("#fullbleed-full");
    const overlay = section.locator(".hero-fullbleed__overlay");
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute("aria-hidden", "true");
  });

  test("renders background image when image prop is provided", async ({ page }) => {
    const section = page.locator("#fullbleed-full");
    const img = section.locator(".hero-fullbleed__image");
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("alt", "Test background image");
  });

  test("renders placeholder gradient when no image is provided", async ({ page }) => {
    const section = page.locator("#fullbleed-minimal");
    await expect(section.locator(".hero-fullbleed__placeholder")).toBeVisible();
    await expect(section.locator(".hero-fullbleed__image")).toHaveCount(0);
  });

  // ── Text alignment ─────────────────────────────────────────────────────────

  test("applies center alignment class by default", async ({ page }) => {
    const content = page.locator("#fullbleed-full .hero-fullbleed__content");
    await expect(content).toHaveClass(/items-center/);
    await expect(content).toHaveClass(/text-center/);
  });

  test("applies left alignment class when textAlign is left", async ({ page }) => {
    const content = page.locator("#fullbleed-left .hero-fullbleed__content");
    await expect(content).toHaveClass(/items-start/);
    await expect(content).toHaveClass(/text-left/);
  });

  // ── Conditional rendering ──────────────────────────────────────────────────

  test("hides CTA when ctaLabel is absent", async ({ page }) => {
    const section = page.locator("#fullbleed-minimal");
    await expect(section.locator(".hero-fullbleed__cta")).toHaveCount(0);
  });

  // ── Null safety ────────────────────────────────────────────────────────────

  test("renders without errors when all props are null", async ({ page }) => {
    const section = page.locator("#fullbleed-null");
    // Section itself should be visible (component renders even with all nulls)
    await expect(section.locator(".hero-fullbleed")).toBeVisible();
    // No h1, no copy, no CTA
    await expect(section.locator("h1")).toHaveCount(0);
    await expect(section.locator(".hero-fullbleed__copy")).toHaveCount(0);
    await expect(section.locator(".hero-fullbleed__cta")).toHaveCount(0);
    // Placeholder shown instead of image
    await expect(section.locator(".hero-fullbleed__placeholder")).toBeVisible();
  });

  test("defaults to center alignment when textAlign is null", async ({ page }) => {
    const content = page.locator("#fullbleed-null .hero-fullbleed__content");
    await expect(content).toHaveClass(/items-center/);
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  test("section element is a landmark", async ({ page }) => {
    await expect(page.locator("#fullbleed-full section")).toBeVisible();
  });

  test("headline has WCAG text-shadow for image contrast", async ({ page }) => {
    const headline = page.locator("#fullbleed-full .hero-fullbleed__headline");
    const shadow = await headline.evaluate(
      (el) => getComputedStyle(el).textShadow,
    );
    expect(shadow).not.toBe("none");
    expect(shadow).not.toBe("");
  });
});
