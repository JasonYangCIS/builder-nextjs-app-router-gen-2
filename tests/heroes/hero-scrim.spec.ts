import { test, expect } from "@playwright/test";

// Tests run against the static fixture page at /test/heroes
test.describe("HeroScrim", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/heroes");
    // Builder DevTools injects <builder-dev-tools-overview> which intercepts pointer events.
    await page.addStyleTag({
      content: "builder-dev-tools-overview { pointer-events: none !important; }",
    });
  });

  test("renders headline as h1", async ({ page }) => {
    const section = page.locator("#scrim-full");
    await expect(section.getByRole("heading", { level: 1, name: "Find your place in the wild." })).toBeVisible();
  });

  test("renders copy paragraph", async ({ page }) => {
    const section = page.locator("#scrim-full");
    await expect(section.getByText("A secluded forest cabin")).toBeVisible();
  });

  test("renders brand lockup", async ({ page }) => {
    const section = page.locator("#scrim-full");
    await expect(section.locator("[data-testid='hero-scrim-brand']")).toContainText("Wilder House");
  });

  test("renders CTA as a link", async ({ page }) => {
    const section = page.locator("#scrim-full");
    const cta = section.locator("[data-testid='hero-scrim-cta']");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/explore");
  });

  test("renders a scrim overlay element with aria-hidden", async ({ page }) => {
    const section = page.locator("#scrim-full");
    const overlay = section.locator("[data-testid='hero-scrim-overlay']");
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute("aria-hidden", "true");
  });

  test("renders background image when image prop is provided", async ({ page }) => {
    const section = page.locator("#scrim-full");
    const img = section.locator("img");
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("alt", "Cabin in a forest landscape");
  });

  test("renders placeholder gradient when no image is provided", async ({ page }) => {
    const section = page.locator("#scrim-minimal");
    await expect(section.locator("[data-testid='hero-scrim-placeholder']")).toBeVisible();
    await expect(section.locator("img")).toHaveCount(0);
  });

  test("hides brand and CTA when not provided", async ({ page }) => {
    const section = page.locator("#scrim-minimal");
    await expect(section.locator("[data-testid='hero-scrim-brand']")).toHaveCount(0);
    await expect(section.locator("[data-testid='hero-scrim-cta']")).toHaveCount(0);
  });

  test("renders without errors when all props are null", async ({ page }) => {
    const section = page.locator("#scrim-null");
    await expect(section.locator("[data-testid='hero-scrim']")).toBeVisible();
    await expect(section.locator("h1")).toHaveCount(0);
    await expect(section.locator("[data-testid='hero-scrim-copy']")).toHaveCount(0);
    await expect(section.locator("[data-testid='hero-scrim-cta']")).toHaveCount(0);
    await expect(section.locator("[data-testid='hero-scrim-placeholder']")).toBeVisible();
  });

  test("section element is a landmark", async ({ page }) => {
    await expect(page.locator("#scrim-full section")).toBeVisible();
  });
});
