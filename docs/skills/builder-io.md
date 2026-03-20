# Builder.io Skills

Patterns and gotchas for working with `@builder.io/sdk-react` (Gen 2) in this repo.

---

## Core SDK Functions

| Function | Purpose |
|----------|---------|
| `fetchOneEntry({ model, apiKey, query?, options? })` | Fetch a single entry — detail pages, root route |
| `fetchEntries({ model, apiKey, limit?, fields? })` | Fetch multiple entries — lists, nav menus, static params |
| `isEditing()` | True only in Builder visual editor (edit mode) |
| `isPreviewing()` | True in editor AND preview mode |
| `getBuilderSearchParams(searchParams)` | Converts Next.js searchParams to Builder options — detail pages only |
| `subscribeToEditor({ model, apiKey, callback })` | Live-updates nav/data in client components |

---

## Route Patterns

All pages live under `app/[locale]/`. Locale is always read from route params, never from headers. See `docs/skills/localization.md` for the full locale architecture.

### Catch-all (Builder page model)
```ts
// app/[locale]/[...page]/page.tsx
export default async function Page(props: {
  params: Promise<{ locale: string; page: string[] }>;
}) {
  const { locale, page } = await props.params;
  const urlPath = "/" + (page?.join("/") || "");

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: config.models.page,
    userAttributes: { urlPath, locale },
    locale,
  });
  if (!content && !isEditing() && !isPreviewing()) return notFound();
  return <RenderBuilderContent content={content} model={config.models.page} locale={locale} />;
}
```

### Root route — required
`app/[locale]/[...page]` does **not** match `/`. `app/[locale]/page.tsx` must also use Builder:
```ts
// app/[locale]/page.tsx
const { locale } = await props.params;
const content = await fetchOneEntry({
  apiKey: config.envs.builderApiKey,
  model: config.models.page,
  userAttributes: { urlPath: "/", locale },
  locale,
});
```

### List page
```ts
// app/[locale]/blog-article/page.tsx
const { locale } = await props.params;
const entries = await fetchEntries({ model, apiKey: config.envs.builderApiKey, limit: 100 });
export const revalidate = 5;
// Pass locale-prefixed route to list component:
<BlogArticleList articles={items} route={buildLocalePath(locale, "/blog-article")} />
```

### Detail page (slug-based)
```ts
// app/[locale]/blog-article/[slug]/page.tsx
export async function generateStaticParams() {
  const entries = await fetchEntries({ model, apiKey: config.envs.builderApiKey, limit: 100 });
  const slugs = (entries ?? []).map(e => e.data?.slug).filter(Boolean);
  // Generate for ALL supported locales
  return SUPPORTED_LOCALE_CODES.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}

const { locale, slug } = await props.params;
const content = await fetchOneEntry({
  model,
  apiKey: config.envs.builderApiKey,
  userAttributes: { locale },
  query: { "data.slug": slug },
  locale,
});
if (!content && !isEditing() && !isPreviewing()) return notFound();
```

---

## Three Blog Patterns

| Pattern | Builder model type | Body source | What code renders |
|---|---|---|---|
| Data model | Data | `data.content` (HTML field) | Hero + Header + `BlogArticleBody` + `<Content>` |
| Section model | Section | Builder visual blocks | Hero + Header + `<Content>` only |
| Hybrid | Section + Data | Data bindings in template | `<Content data={{ article }}/>` |

### Hybrid fetch pattern
```ts
const articleContent  = await fetchOneEntry({ model: config.models.blogArticle, query: { "data.slug": slug } });
const articleTemplate = await fetchOneEntry({ model: config.models.blogArticleTemplate });

return (
  <RenderBuilderContent
    content={articleTemplate}
    model={config.models.blogArticleTemplate}
    data={{ article: articleContent }}
  />
);
```

---

## Adding a New Model

1. **`config.ts`** — add `myModel: "my-model"` to `models`
2. **`types/mymodel.types.ts`** — define interface (use `string | null` for optional fields)
3. **Create route** — follow patterns above
4. **`builder-registry.ts`** — add `RegisteredComponent` entry if the model uses custom components

---

## Key Gotchas

### subscribeToEditor model guard — REQUIRED
`subscribeToEditor` fires whenever `isPreviewing()` is true, including when editing a completely different model. Without a guard, it causes "Model Name Mismatch Detected".

```ts
// Always guard subscribeToEditor:
if (!isPreviewing()) return;
const params = new URLSearchParams(window.location.search);
const previewModel = params.get("builder.preview");
if (previewModel && previewModel !== config.models.headerNavMenu) return;
const unsubscribe = subscribeToEditor({ model, apiKey, callback });
```

### notFound() guard
Always check both `isEditing()` and `isPreviewing()` before calling `notFound()`:
```ts
if (!content && !isEditing() && !isPreviewing()) return notFound();
```
Builder renders pages inside an iframe — `notFound()` in edit mode will break the editor.

### getBuilderSearchParams — preview route only
`getBuilderSearchParams` converts Next.js `searchParams` into Builder SDK options, forwarding params like `builder.preview`, `builder.overrides.*`, and `builder.cachebust` that Builder injects during visual editing. **Only used in `app/preview/page.tsx`** — production routes do not use `searchParams` at all (keeping them statically generatable with ISR).

### revalidate
Set `export const revalidate = 5` on all Builder-connected pages for near-real-time publish updates.

---

## Custom Component Registration

All custom components are registered in `builder-registry.ts` as `RegisteredComponent[]` and consumed by `RenderBuilderContent`.

### File structure

Each Builder-registered component lives in its own folder and splits concerns across four files (see `components/HeroSplit/` as the canonical example):

```
components/MyComponent/
  MyComponent.tsx          # Component implementation + re-exports types
  MyComponent.types.ts     # TypeScript interfaces only
  MyComponent.module.scss  # CSS Modules — use CSS custom properties for theming
  MyComponent.builder.ts   # RegisteredComponent config — named export
```

### `.builder.ts` pattern

```ts
// MyComponent.builder.ts
import type { RegisteredComponent } from "@builder.io/sdk-react";
import MyComponent from "./MyComponent";

export const myComponentConfig: RegisteredComponent = {
  component: MyComponent,
  name: "My Component",           // Display name in Builder UI
  canHaveChildren: true,          // set true for container components
  inputs: [
    { name: "label", type: "string", defaultValue: "Hello", required: true },
    { name: "variant", type: "string", enum: ["a", "b"], defaultValue: "a" },
    { name: "disabled", type: "boolean", defaultValue: false },
  ],
};
```

Then import and spread into `builder-registry.ts`:

```ts
import { myComponentConfig } from "@/components/MyComponent/MyComponent.builder";
// add myComponentConfig to the CUSTOM_COMPONENTS array
```

Input types: `"string"`, `"longText"`, `"number"`, `"boolean"`, `"color"`, `"file"`, `"reference"`, `"url"`.

---

## Header Pattern (RSC + client hybrid)

- `Header.tsx` — async RSC, fetches nav entries via `fetchEntries`, passes to `NavItems`
- `NavItems.tsx` — client component (`"use client"`), receives initial entries as props, subscribes to live updates via `subscribeToEditor`

This pattern avoids making the entire header a client component while still supporting live editing of nav items.

---

## RenderBuilderContent Render Logic

`components/builder/RenderBuilderContent.tsx` is a `"use client"` wrapper. Its render condition:

```ts
if (content || isPreviewing()) {
  return (
    <Content
      key={`${content?.id ?? "empty"}-${locale ?? "default"}`}
      content={content}
      apiKey={...}
      model={model}
      customComponents={CUSTOM_COMPONENTS}
      locale={locale}
      {...(data && { data })}
    />
  );
}
return <DefaultErrorPage statusCode={404} />;  // from next/error
```

Key implications:
- **`isPreviewing()` gates rendering, not `isEditing()`** — content can be `null` in preview mode and it still renders `<Content>` (Builder handles it in the iframe)
- **Page-level `notFound()`** runs before this component is reached in normal 404 flow — the `DefaultErrorPage` fallback is a safety net, not the primary 404 path
- **`data` prop** — only spread when truthy: `{...(data && { data })}`. Pass for Hybrid pattern only.
- **`locale` prop** — always pass locale. The `key` includes locale to force remount when locale changes, ensuring Builder re-initializes with localized content.
- **`key` prop** — `${content?.id}-${locale}` forces React to unmount/remount `<Content>` when content or locale changes, preventing stale state.

---

## TypeScript Type Conventions

Types for Builder data fields live in `types/`. Convention:

```ts
// types/mymodel.types.ts
export interface MyModel {
  slug: string;           // required — used as identifier
  title?: string | null;  // optional string fields: always string | null (never string | undefined)
  image?: string | null;  // Builder may return null for empty fields
}

// Extension for detail pages that add extra fields:
export interface MyModelWithContent extends MyModel {
  content?: string | null;  // e.g. HTML body
}
```

Rules:
- `slug` is always `string` (required, used for routing/queries)
- All other fields from Builder data: `string | null` for optional, not `string | undefined`
- Extend the base interface for detail-page variants rather than duplicating

Access from a Builder entry: `entry.data?.slug`, `entry.data?.title`

---

## HTML Safety

Always sanitize HTML strings from Builder data fields with DOMPurify before `dangerouslySetInnerHTML` — not just in `BlogArticleBody`, but in any component that renders a Builder HTML field.

---

## Cloudinary Plugin

The Cloudinary plugin adds a `cloudinaryImageEditor` input type to Builder. It runs inside Builder's visual editor — no npm package needed in the Next.js app.

**Setup (Builder admin):** Settings → Plugins → Add Plugin → `@builder.io/plugin-cloudinary` → configure Cloud Name + API Key.

**Usage in components:** Use `type: "cloudinaryImageEditor"` on a Builder input. The plugin returns `{ url, width, height }`. See `components/CloudinaryImage/` for the reference implementation.

**Next.js config:** `res.cloudinary.com` is added to `images.remotePatterns` in `next.config.ts` for `next/image` optimization.

---

## Builder DevTools — Playwright gotcha

Builder DevTools injects extra `<header>`, `<footer>`, and `<button>` elements that break Playwright's strict-mode locators. DevTools is automatically disabled during `npm test` via the `PLAYWRIGHT_TEST=true` env flag.

See `docs/skills/testing.md` for selector scoping patterns, gotchas, and the full test conventions.

---

## Builder Rules

Builder's AI reads two types of rule files to generate code consistently:

### `.builderrules` (root file)
A single file at the project root. Edit it via the cog icon in Builder's prompt window, or directly in your editor. Builder's AI reads it every session — rules provide the persistent context that AI lacks between sessions.

### `.builder/rules/*.mdc` (scoped rules)
Granular rules in `.mdc` files under `.builder/rules/`. Support metadata header:
```markdown
---
description: Component structure
globs: components/**
alwaysApply: false
---
```
- `alwaysApply: true` — always loaded; `false` — AI decides contextually based on globs
- Files closer to the current working directory take precedence over parent directories
- Builder will **never** modify your rule files

### Rules best practices
- Keep each file under 500 lines — split large rules into composable files
- Be specific and actionable — write rules like clear internal docs
- Avoid conflicts between rule files
- Reference concrete examples or existing files where possible

---

## Dedicated Preview Route

All Builder models use `app/preview/page.tsx` as their preview URL. This route is `force-dynamic` and lives outside the `[locale]` segment (it has its own minimal layout).

**Preview URL patterns (set in Builder admin → Model settings → Preview URL):**

```
page model:               /preview?model=page&urlPath={entry.data.url}
blog-article:             /preview?model=blog-article&slug={entry.data.slug}
blog-article-section:     /preview?model=blog-article-section&slug={entry.data.slug}
blog-article-template:    /preview?model=blog-article-template&slug={entry.data.slug}
```

**Locale in preview:** Resolved from `builder.options.locale` query param (set by Builder's locale switcher), then `locale` custom param, then `DEFAULT_LOCALE`. The preview route overrides `builderOptions.locale` with the resolved value to prevent Builder's `"Default"` string from conflicting.

**Key design decisions:**
- Production routes never consume `searchParams` / `getBuilderSearchParams` — this keeps them ISR-compatible
- The preview route handles all models via dispatch (page, blogArticle, blogArticleSection, blogArticleTemplate, generic fallback for symbols)
- The proxy skips `/preview` paths entirely — no locale rewriting needed

---

## Dynamic Preview URL (Builder admin setup)

For section model entries to open at the correct URL in the Builder dashboard:

1. Enable **Settings → Advanced Settings → Editor → Advanced Preview URL Logic**
2. Set a dynamic preview URL on the model:

```js
if (contentModel.isLive) {
  return `https://yoursite.com/blog-article-section/${content.data.slug}`;
}
return `https://yoursite.com/blog-article-section/__builder_editing__`;
```

For local dev replace with `http://localhost:3000/...`.
