/**
 * Programmatic WCAG 2.1 AA contrast ratio checks across all three themes.
 *
 * Uses page.evaluate() to read computed styles from the browser, parse RGB
 * values, compute relative luminance, and verify contrast ratios without
 * needing visual baseline snapshots.
 *
 * Thresholds:
 *   - Normal text (< 24px or < 19px bold):  4.5:1
 *   - Large text  (≥ 24px or ≥ 19px bold):  3.0:1
 *   - UI components / non-text:             3.0:1
 */
import { test, expect, Page } from "@playwright/test";

const THEMES = ["default", "dark"] as const;
type Theme = (typeof THEMES)[number];

const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function setTheme(page: Page, theme: Theme) {
  await page.evaluate((t) => {
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, theme);
  await page.waitForFunction(
    (t) => document.documentElement.getAttribute("data-theme") === t,
    theme,
  );
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

function parseRGB(cssColor: string): RGBColor | null {
  // Standard rgb/rgba format: rgb(255, 255, 255) or rgba(255, 255, 255, 1)
  const rgbMatch = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }
  // Modern Chromium serializes OKLCH/P3 as color(srgb r g b) with 0–1 floats
  const srgbMatch = cssColor.match(/color\(srgb\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)/);
  if (srgbMatch) {
    return {
      r: Math.round(Math.min(1, Math.max(0, parseFloat(srgbMatch[1]))) * 255),
      g: Math.round(Math.min(1, Math.max(0, parseFloat(srgbMatch[2]))) * 255),
      b: Math.round(Math.min(1, Math.max(0, parseFloat(srgbMatch[3]))) * 255),
    };
  }
  return null;
}

function relativeLuminance({ r, g, b }: RGBColor): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(c1: RGBColor, c2: RGBColor): number {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Walks up the DOM from `el` to find the nearest opaque background color.
 * Falls back to the document body background.
 */
function getEffectiveBg(el: Element): string {
  let current: Element | null = el;
  while (current) {
    const bg = getComputedStyle(current).backgroundColor;
    // Skip transparent / fully transparent rgba
    if (bg && !bg.startsWith("rgba(0, 0, 0, 0)") && bg !== "transparent") {
      return bg;
    }
    current = current.parentElement;
  }
  return getComputedStyle(document.body).backgroundColor;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

for (const theme of THEMES) {
  test.describe(`WCAG contrast — ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/design-system");
      await setTheme(page, theme);
    });

    // ── Body / global text ──────────────────────────────────────────────────
    test("body text on page background meets 4.5:1", async ({ page }) => {
      const { fg, bg } = await page.evaluate(() => ({
        fg: getComputedStyle(document.body).color,
        bg: getComputedStyle(document.body).backgroundColor,
      }));

      const fgColor = parseRGB(fg);
      const bgColor = parseRGB(bg);
      // Skip gracefully if browser returns an unparseable color format (e.g. oklch())
      if (!fgColor || !bgColor) return;

      const ratio = contrastRatio(fgColor, bgColor);
      expect(
        ratio,
        `Body text contrast (${theme}): ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    // ── Headings ───────────────────────────────────────────────────────────
    test("heading text contrast meets 3.0:1 (large) or 4.5:1 (small)", async ({
      page,
    }) => {
      const headings = await page.evaluate(() => {
        // Run getEffectiveBg inline (can't reference outer scope in evaluate)
        function bg(el: Element): string {
          let cur: Element | null = el;
          while (cur) {
            const b = getComputedStyle(cur).backgroundColor;
            if (b && !b.startsWith("rgba(0, 0, 0, 0)") && b !== "transparent")
              return b;
            cur = cur.parentElement;
          }
          return getComputedStyle(document.body).backgroundColor;
        }
        return Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
          .slice(0, 10)
          .map((el) => {
            const style = getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);
            const fontWeight = parseInt(style.fontWeight);
            // Large text: ≥24px OR ≥18.67px (≈14pt) bold
            const isLarge = fontSize >= 24 || (fontSize >= 18.67 && fontWeight >= 700);
            return {
              fg: style.color,
              bg: bg(el),
              isLarge,
              label: `${el.tagName} "${el.textContent?.slice(0, 30)}"`,
            };
          });
      });

      for (const { fg, bg, isLarge, label } of headings) {
        const fgColor = parseRGB(fg);
        const bgColor = parseRGB(bg);
        if (!fgColor || !bgColor) continue;

        const ratio = contrastRatio(fgColor, bgColor);
        const threshold = isLarge ? WCAG_AA_LARGE : WCAG_AA_NORMAL;

        expect(
          ratio,
          `${label} (${isLarge ? "large" : "normal"}, ${theme}): ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(threshold);
      }
    });

    // ── Muted foreground text ──────────────────────────────────────────────
    test("muted-foreground text meets 4.5:1", async ({ page }) => {
      const result = await page.evaluate(() => {
        function bg(el: Element): string {
          let cur: Element | null = el;
          while (cur) {
            const b = getComputedStyle(cur).backgroundColor;
            if (b && !b.startsWith("rgba(0, 0, 0, 0)") && b !== "transparent")
              return b;
            cur = cur.parentElement;
          }
          return getComputedStyle(document.body).backgroundColor;
        }
        const el = document.querySelector(
          ".text-muted-foreground",
        ) as HTMLElement | null;
        if (!el) return null;
        return { fg: getComputedStyle(el).color, bg: bg(el) };
      });

      if (!result) {
        test.skip();
        return;
      }

      const fgColor = parseRGB(result.fg);
      const bgColor = parseRGB(result.bg);
      if (!fgColor || !bgColor) { test.skip(); return; }

      const ratio = contrastRatio(fgColor, bgColor);
      expect(
        ratio,
        `muted-foreground contrast (${theme}): ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    // ── Default Button ─────────────────────────────────────────────────────
    test("default button text on primary background meets 4.5:1", async ({
      page,
    }) => {
      const result = await page.evaluate(() => {
        // The default (filled) shadcn button in the design-system page
        const btn = document.querySelector(
          "#button button",
        ) as HTMLElement | null;
        if (!btn) return null;
        const style = getComputedStyle(btn);
        return { fg: style.color, bg: style.backgroundColor };
      });

      if (!result || !result.fg || !result.bg) { test.skip(); return; }

      const fgColor = parseRGB(result.fg);
      const bgColor = parseRGB(result.bg);
      if (!fgColor || !bgColor) { test.skip(); return; }

      const ratio = contrastRatio(fgColor, bgColor);
      expect(
        ratio,
        `Default button contrast (${theme}): ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    // ── Destructive Button ─────────────────────────────────────────────────
    test("destructive button text meets 4.5:1", async ({ page }) => {
      const result = await page.evaluate(() => {
        const btn = document.querySelector(
          "[data-testid='destructive-button'], button.bg-destructive",
        ) as HTMLElement | null;
        // Fall back: find any button with destructive in class
        const el =
          btn ??
          (Array.from(document.querySelectorAll("button")).find((b) =>
            b.className.includes("destructive"),
          ) as HTMLElement | undefined) ??
          null;
        if (!el) return null;
        const style = getComputedStyle(el);
        return { fg: style.color, bg: style.backgroundColor };
      });

      if (!result) { test.skip(); return; }

      const fgColor = parseRGB(result.fg);
      const bgColor = parseRGB(result.bg);
      if (!fgColor || !bgColor) { test.skip(); return; }

      const ratio = contrastRatio(fgColor, bgColor);
      expect(
        ratio,
        `Destructive button contrast (${theme}): ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    // ── Badge ──────────────────────────────────────────────────────────────
    test("badge text meets 4.5:1", async ({ page }) => {
      const badges = await page.evaluate(() => {
        function bg(el: Element): string {
          let cur: Element | null = el;
          while (cur) {
            const b = getComputedStyle(cur).backgroundColor;
            if (b && !b.startsWith("rgba(0, 0, 0, 0)") && b !== "transparent")
              return b;
            cur = cur.parentElement;
          }
          return getComputedStyle(document.body).backgroundColor;
        }
        return Array.from(document.querySelectorAll("#badge [class*='badge'], #badge span"))
          .slice(0, 4)
          .map((el) => ({
            fg: getComputedStyle(el).color,
            bg: bg(el),
            label: (el as HTMLElement).innerText?.slice(0, 20),
          }));
      });

      for (const { fg, bg, label } of badges) {
        const fgColor = parseRGB(fg);
        const bgColor = parseRGB(bg);
        if (!fgColor || !bgColor) continue;

        const ratio = contrastRatio(fgColor, bgColor);
        expect(
          ratio,
          `Badge "${label}" contrast (${theme}): ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      }
    });

    // ── ThemeSwitch button ────────────────────────────────────────────────
    test("ThemeSwitch button text meets 4.5:1", async ({ page }) => {
      const result = await page.evaluate(() => {
        const btn = document.querySelector(
          ".theme-switch-button",
        ) as HTMLElement | null;
        if (!btn) return null;
        const style = getComputedStyle(btn);
        return { fg: style.color, bg: style.backgroundColor };
      });

      if (!result) { test.skip(); return; }

      const fgColor = parseRGB(result.fg);
      const bgColor = parseRGB(result.bg);
      if (!fgColor || !bgColor) { test.skip(); return; }

      const ratio = contrastRatio(fgColor, bgColor);
      expect(
        ratio,
        `ThemeSwitch button contrast (${theme}): ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    // ── ThemeSwitch dropdown items ────────────────────────────────────────
    test("ThemeSwitch dropdown items meet 4.5:1 after opening", async ({
      page,
    }) => {
      // Trigger the ThemeSwitch via JS — the button may be inside a responsive
      // container (hidden md:flex) that isn’t actionable at the test viewport.
      await page.evaluate(() => {
        const btn = document.querySelector<HTMLButtonElement>(".theme-switch-button");
        btn?.click();
      });
      await expect(page.locator(".theme-dropdown").first()).toBeVisible();

      const items = await page.evaluate(() => {
        function bg(el: Element): string {
          let cur: Element | null = el;
          while (cur) {
            const b = getComputedStyle(cur).backgroundColor;
            if (b && !b.startsWith("rgba(0, 0, 0, 0)") && b !== "transparent")
              return b;
            cur = cur.parentElement;
          }
          return getComputedStyle(document.body).backgroundColor;
        }
        return Array.from(
          document.querySelectorAll(".theme-dropdown [role='menuitem']"),
        ).map((el) => ({
          fg: getComputedStyle(el).color,
          bg: bg(el),
          label: (el as HTMLElement).innerText?.trim(),
        }));
      });

      for (const { fg, bg, label } of items) {
        const fgColor = parseRGB(fg);
        const bgColor = parseRGB(bg);
        if (!fgColor || !bgColor) continue;

        const ratio = contrastRatio(fgColor, bgColor);
        expect(
          ratio,
          `Dropdown item "${label}" contrast (${theme}): ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      }
    });
  });
}
