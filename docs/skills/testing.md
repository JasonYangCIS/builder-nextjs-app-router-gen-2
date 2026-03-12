# Testing Skills

Playwright E2E test setup, conventions, and gotchas for this repo.

---

## Setup

| Item | Detail |
|------|--------|
| Runner | `@playwright/test` |
| Browser | Chromium only (headless shell) |
| Config | `playwright.config.ts` — `baseURL: http://localhost:3000` |
| Web server | Auto-starts `npm run dev` (webpack); reuses existing server in dev |

```bash
npm test            # headless, all tests
npm run test:ui     # Playwright UI mode (step-through, time-travel)
npm run test:debug  # attach debugger
```

---

## Test File Map

```
tests/
├── design-system/
│   ├── button.spec.ts       # Button variants, sizes, loading/disabled, ARIA
│   ├── typography.spec.ts   # Variant → HTML element mapping, color classes
│   ├── badge.spec.ts        # Variants, sizes, semantic color classes
│   ├── input.spec.ts        # Label, typing, error/aria-invalid, required, disabled
│   └── card.spec.ts         # Shadow/padding variants, children, borderless
├── blog/
│   ├── blog-components.spec.ts  # All blog components via fixture page
│   ├── blog-index.spec.ts       # /blog static page
│   └── blog-list.spec.ts        # /blog-article, /blog-article-section, /blog-article-template
├── layout/
│   ├── header.spec.ts       # Logo, desktop nav, mobile hamburger toggle
│   └── footer.spec.ts       # Copyright, year, site name, border
└── counter.spec.ts          # Increment, decrement, initialCount prop
```

---

## Fixture Pages

Two pages exist solely as Playwright test harnesses. They are **not linked from the app**.

### `app/design-system/page.tsx` — `/design-system`
The Storybook-style showcase page. Tests for Button, Typography, Badge, Input, Card, and Counter all run against this page. All component variants and states are pre-rendered here.

### `app/test/blog-components/page.tsx` — `/test/blog-components`
A static fixture page that renders all blog components (`BlogArticleHero`, `BlogArticleHeader`, `BlogArticleBody`, `BlogArticleCard`, `BlogArticleList`) with hardcoded mock data. Sections are identified by `id` attributes (`#hero`, `#header-full`, `#body-normal`, `#card-full`, `#list`, etc.).

**Adding a new fixture section:**
1. Add a new `<section id="my-section">` in `app/test/blog-components/page.tsx`
2. Use self-contained mock data — no external fetch, no Builder dependency

---

## Conventions

### Scope selectors to fixture sections
Always scope locators to the component's section `id` to avoid cross-section collisions:
```ts
const section = page.locator("#card-full");
await expect(section.getByRole("link")).toHaveAttribute("href", "/blog-article/test-article");
```

### Handle Builder-dependent pages defensively
List pages (`/blog-article`, etc.) connect to Builder — they may have articles or not. Check before asserting:
```ts
const hasArticles = await page.locator("ul.grid").isVisible().catch(() => false);
if (!hasArticles) {
  await expect(page.getByText("No articles yet.")).toBeVisible();
}
```

### Date assertions are timezone-sensitive
`toLocaleDateString("en-US")` produces different output depending on the server's timezone. Do **not** assert exact formatted strings for dates. Instead, check the `dateTime` attribute and that text is non-empty:
```ts
await expect(section.locator("time")).toHaveAttribute("dateTime", "2024-01-15T00:00:00.000Z");
const text = await section.locator("time").textContent();
expect(text?.trim().length).toBeGreaterThan(0);
```

---

## Gotchas

### Builder DevTools — Automatically Disabled During Tests

**IMPORTANT:** Builder DevTools is automatically disabled when running Playwright tests to prevent pointer event interception and element conflicts.

**How it works:**
- `playwright.config.ts` sets `PLAYWRIGHT_TEST=true` environment variable
- `next.config.ts` conditionally skips `BuilderDevTools()` wrapper when this flag is detected
- Tests run against a clean app without the DevTools overlay

**Why this matters:**
- DevTools injects `<builder-dev-tools-overview>` which intercepts clicks
- DevTools adds extra `<header>`, `<footer>`, and buttons that conflict with selectors
- Without this flag, interactive tests (clicks, typing) will timeout

**Testing locally:**
```bash
npm test           # DevTools disabled automatically
npm run dev        # DevTools enabled for normal development
```

**Always scope to the app's element using a unique class** (defensive practice):

```ts
// Header — scoped by its unique class combination
const APP_HEADER = "header.relative.border-b";
page.locator(APP_HEADER).getByText("Logo");

// Footer — scoped by its unique class
const APP_FOOTER = "footer.mt-16";
page.locator(APP_FOOTER).toContainText("2025");

// Hamburger button — use getByRole scoped to APP_HEADER
page.locator(APP_HEADER).getByRole("button", { name: "Open menu" });
// NOT: page.locator("header button[aria-label]") — matches DevTools buttons too
```

### NavItems returns null when Builder nav entries are empty
`Header` → `NavItems` returns `null` when no nav entries are fetched from Builder. This means the hamburger button and "Design System" link will not exist. Guard mobile nav tests:
```ts
const hamburgerVisible = await page.locator(APP_HEADER).getByRole("button", { name: "Open menu" }).isVisible().catch(() => false);
if (!hamburgerVisible) return;
```

### next/image with external URLs logs 404 warnings — not a test failure
The fixture page uses a fake `cdn.builder.io` image URL. Next.js logs `upstream image response failed 404` but the `<img>` element is still rendered in the DOM. Tests that check `img` existence or `alt` attribute will pass. Tests that assert the image visually loaded will not work.
