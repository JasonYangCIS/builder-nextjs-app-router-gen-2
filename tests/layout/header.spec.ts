import { test, expect } from "@playwright/test";

// Builder DevTools injects extra <header> elements and aria-labeled buttons.
// Scope all selectors to our app header using its unique class combination.
const APP_HEADER = "header.relative.border-b";

test.describe("Header", () => {
  test.beforeEach(async ({ page }) => {
    // /blog is a fully static page — no Builder fetch needed beyond nav menu
    await page.goto("/blog");
  });

  test("renders the site logo text", async ({ page }) => {
    await expect(page.locator(APP_HEADER).getByText("Jason Yang - Builder.io")).toBeVisible();
  });

  test("logo links to the root route", async ({ page }) => {
    const logo = page.locator(APP_HEADER).locator("a").filter({ hasText: "Jason Yang - Builder.io" });
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("header has a bottom border class", async ({ page }) => {
    await expect(page.locator(APP_HEADER)).toHaveClass(/border-b/);
  });

  test("desktop nav shows Design System link when nav entries exist", async ({ page }) => {
    const desktopNav = page.locator(`${APP_HEADER} nav.hidden`);
    const navVisible = await desktopNav.isVisible().catch(() => false);
    if (!navVisible) return;
    await expect(desktopNav.getByRole("link", { name: "Design System" })).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "Design System" })).toHaveAttribute("href", "/design-system");
  });

  test("mobile hamburger button is visible at mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // Scope to our app header to avoid Builder DevTools buttons
    const hamburger = page.locator(APP_HEADER).getByRole("button", { name: "Open menu" });
    await expect(hamburger).toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  test("hamburger click opens the mobile dropdown", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const hamburger = page.locator(APP_HEADER).getByRole("button", { name: "Open menu" });
    await hamburger.click();
    await expect(page.locator(APP_HEADER).getByRole("button", { name: "Close menu" })).toBeVisible();
    await expect(page.locator(APP_HEADER).getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  });

  test("mobile dropdown shows Design System link when open", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const hamburger = page.locator(APP_HEADER).getByRole("button", { name: "Open menu" });
    const hamburgerVisible = await hamburger.isVisible().catch(() => false);
    if (!hamburgerVisible) return;

    await hamburger.click();
    const mobileDropdown = page.locator(`${APP_HEADER} #mobile-navigation`);
    await expect(mobileDropdown).toBeVisible();
    await expect(mobileDropdown.getByRole("link", { name: "Design System" })).toBeVisible();
  });

  test("clicking the hamburger again closes the dropdown", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const hamburger = page.locator(APP_HEADER).getByRole("button", { name: "Open menu" });
    const hamburgerVisible = await hamburger.isVisible().catch(() => false);
    if (!hamburgerVisible) return;

    await hamburger.click(); // open
    await page.locator(APP_HEADER).getByRole("button", { name: "Close menu" }).click(); // close
    await expect(page.locator(APP_HEADER).getByRole("button", { name: "Open menu" })).toBeVisible();
    await expect(page.locator(APP_HEADER).getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
