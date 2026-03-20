# Localization Skills

Locale routing architecture, conventions, and gotchas for this repo.

---

## Architecture Overview

All user-facing pages live under `app/[locale]/`. Locale is always derived from route params, never from headers or cookies.

| Layer | File | Purpose |
|-------|------|---------|
| Proxy | `proxy.ts` | Rewrites unprefixed URLs to `/{DEFAULT_LOCALE}/...`, redirects canonical |
| Locale layout | `app/[locale]/layout.tsx` | Validates locale, sets `<html lang>`, renders Header/Footer |
| Locale utilities | `utils/locale.ts` | `buildLocalePath`, `stripLocalePrefix`, `getLocaleFromPath` |
| Config | `config.ts` | `locales.default` ("en-US"), `locales.supported` (array of `{ code, label }`) |
| LocaleSwitch | `components/LocaleSwitch/` | Client-side locale switcher, uses `router.push()` |

---

## Proxy (`proxy.ts`)

The Next.js 16 proxy (exported as `proxy`, not `middleware`) handles three cases:

| URL pattern | Action | Example |
|---|---|---|
| No locale prefix | Rewrite to `/{DEFAULT_LOCALE}/{path}` | `/about` → `/en-US/about` (invisible) |
| Default locale prefix | 301 redirect to strip it | `/en-US/about` → `/about` |
| Non-default locale prefix | Pass through | `/es-MX/about` stays as-is |

**Bypassed paths:** `/preview`, `/test`, `/api` — these live outside the `[locale]` segment.

**Matcher:** `/((?!_next|favicon\\.ico|.*\\..*).*)`

### Why this design?
- Default locale URLs stay clean (`/about`, not `/en-US/about`)
- Non-default locales are explicit in the URL (`/es-MX/about`)
- The `[locale]` route param is always populated (via rewrite for default, directly for others)
- ISR works naturally — each `{locale, slug}` combination is a unique cache entry
- `router.push()` works for locale switching — no full page reload needed

---

## Locale Utilities (`utils/locale.ts`)

### `buildLocalePath(locale, path)`
Constructs a locale-prefixed path. Omits prefix for the default locale.

```ts
buildLocalePath("en-US", "/about")  // → "/about"
buildLocalePath("es-MX", "/about")  // → "/es-MX/about"
buildLocalePath("es-MX", "/")       // → "/es-MX"
```

**Guards:**
- Skips absolute URLs (`https://...`, `//...`)
- Prevents double-prefixing (if path already starts with a supported locale)

### `stripLocalePrefix(pathname)`
Removes a supported locale prefix from a pathname.

```ts
stripLocalePrefix("/es-MX/about")  // → "/about"
stripLocalePrefix("/about")        // → "/about"
```

### `getLocaleFromPath(pathname)`
Extracts locale from pathname. Returns `DEFAULT_LOCALE` if none found. Safe for client components (`usePathname()`).

```ts
getLocaleFromPath("/es-MX/about")  // → "es-MX"
getLocaleFromPath("/about")        // → "en-US"
```

---

## Internal Links — CRITICAL

**Every internal link must preserve the active locale.** Use `buildLocalePath(locale, "/path")` in pages and components.

### In Server Components (pages under `[locale]`)
Read locale from route params:
```ts
const { locale } = await props.params;
<Link href={buildLocalePath(locale, "/blog-article")}>Articles</Link>
```

### In Client Components (shared layout)
Derive locale from `usePathname()`:
```ts
const pathname = usePathname();
const currentLocale = getLocaleFromPath(pathname);
<Link href={buildLocalePath(currentLocale, "/about")}>About</Link>
```

### Header logo
The Header is a Server Component that receives `locale` as a prop from the locale layout:
```tsx
// app/[locale]/layout.tsx
<Header locale={locale} />

// Header.tsx
const homeHref = buildLocalePath(locale ?? config.locales.default, "/");
<Link href={homeHref}>Logo</Link>
```

### NavItems
Already locale-aware — uses `getLocaleFromPath(pathname)` + `buildLocalePath` internally.

### BlogArticleList route prop
List pages pass a locale-prefixed route:
```ts
<BlogArticleList articles={items} route={buildLocalePath(locale, "/blog-article")} />
```

---

## generateStaticParams with Locales

Detail pages must generate params for **all** supported locales:

```ts
export async function generateStaticParams() {
  const entries = await fetchEntries({ model, apiKey: config.envs.builderApiKey, limit: 100 });
  const slugs = (entries ?? []).map(e => e.data?.slug).filter(Boolean);

  return SUPPORTED_LOCALE_CODES.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}
```

The locale layout also exports `generateStaticParams` returning all locale codes.

---

## LocaleSwitch Component

`components/LocaleSwitch/LocaleSwitch.tsx` — client component dropdown for switching locales.

- Derives current locale via `getLocaleFromPath(usePathname())`
- Navigates using `router.push()` (works because locale is a route segment)
- Updates `builder.options.locale` in query params if present (for preview route)
- Receives `locales` array as a prop (from `config.locales.supported`)

---

## Preview Route Locale

`app/preview/page.tsx` resolves locale from query params, not route params:

1. `builder.options.locale` — Builder's standard locale param (Builder sends `"Default"` for the default locale; only recognized if it matches a supported code)
2. `locale` — custom query param
3. `DEFAULT_LOCALE` — final fallback

The resolved locale is spread into `builderOptions` to override Builder's `"Default"` value.

---

## Key Gotchas

### `buildLocalePath` returns clean URLs for default locale
`buildLocalePath("en-US", "/about")` returns `/about`, not `/en-US/about`. The proxy handles the internal rewrite. This means default-locale links match the browser URL exactly.

### The proxy must skip non-locale routes
`/preview`, `/test`, and `/api` paths are excluded from locale rewriting. If you add a new top-level route outside `[locale]`, add it to `LOCALE_BYPASS_PREFIXES` in `proxy.ts`.

### Root layout is a passthrough
`app/layout.tsx` returns `{children}` only — no `<html>` or `<body>`. These are provided by `app/[locale]/layout.tsx`. Routes outside `[locale]` (preview, test) have their own layouts with `<html>` and `<body>`.

### `usePathname()` returns the browser URL, not the rewritten URL
After proxy rewrites `/about` → `/en-US/about`, `usePathname()` still returns `/about`. This is correct — `getLocaleFromPath("/about")` returns `DEFAULT_LOCALE`.

### Adding a new locale
1. Add `{ code: "fr-FR", label: "Français" }` to `config.locales.supported` in `config.ts`
2. That's it — the proxy, layout, and `generateStaticParams` all read from config dynamically
