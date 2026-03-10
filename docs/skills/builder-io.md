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

### Catch-all (Builder page model)
```ts
// app/[...page]/page.tsx
const urlPath = "/" + ((await props?.params)?.page?.join("/") || "");
const content = await fetchOneEntry({
  model: config.models.page,
  apiKey: config.envs.builderApiKey,
  userAttributes: { urlPath },
  options: getBuilderSearchParams(searchParams),
});
if (!content && !isEditing() && !isPreviewing()) return notFound();
return <RenderBuilderContent content={content} model={config.models.page} />;
```

### Root route — required
`app/[...page]` does **not** match `/`. `app/page.tsx` must also use Builder:
```ts
const content = await fetchOneEntry({
  model: config.models.page,
  apiKey: config.envs.builderApiKey,
  userAttributes: { urlPath: "/" },
  options: getBuilderSearchParams(searchParams),
});
```

### List page
```ts
const entries = await fetchEntries({ model, apiKey: config.envs.builderApiKey, limit: 100 });
export const revalidate = 5;
```

### Detail page (slug-based)
```ts
export async function generateStaticParams() {
  const entries = await fetchEntries({ model, apiKey: config.envs.builderApiKey, limit: 100 });
  return (entries ?? []).map(e => ({ slug: e.data?.slug })).filter(p => p.slug);
}

const content = await fetchOneEntry({
  model,
  apiKey: config.envs.builderApiKey,
  options: getBuilderSearchParams(searchParams),  // only on detail pages
  query: { "data.slug": slug },
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

### getBuilderSearchParams — detail pages only
`getBuilderSearchParams` converts Next.js `searchParams` into Builder SDK options, forwarding params like `builder.preview`, `builder.overrides.*`, and `builder.cachebust` that Builder injects during visual editing. Only pass it on detail/slug pages where live preview needs these URL params — not on list/index pages.

### revalidate
Set `export const revalidate = 5` on all Builder-connected pages for near-real-time publish updates.

---

## Custom Component Registration

All custom components are registered in `builder-registry.ts` as `RegisteredComponent[]` and consumed by `RenderBuilderContent`.

```ts
{
  component: MyComponent,
  name: "My Component",           // Display name in Builder UI
  canHaveChildren: true,          // set true for container components
  inputs: [
    { name: "label", type: "string", defaultValue: "Hello", required: true },
    { name: "variant", type: "string", enum: ["a", "b"], defaultValue: "a" },
    { name: "disabled", type: "boolean", defaultValue: false },
  ],
}
```

Input types: `"string"`, `"longText"`, `"number"`, `"boolean"`, `"color"`, `"file"`, `"reference"`.

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
  return <Content content={content} apiKey={...} model={model} customComponents={CUSTOM_COMPONENTS} {...(data && { data })} />;
}
return <DefaultErrorPage statusCode={404} />;  // from next/error
```

Key implications:
- **`isPreviewing()` gates rendering, not `isEditing()`** — content can be `null` in preview mode and it still renders `<Content>` (Builder handles it in the iframe)
- **Page-level `notFound()`** runs before this component is reached in normal 404 flow — the `DefaultErrorPage` fallback is a safety net, not the primary 404 path
- **`data` prop** — only spread when truthy: `{...(data && { data })}`. Pass for Hybrid pattern only.

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

## Builder Rules

Builder's AI reads two types of rule files to generate code consistently:

### `.builderrules` (root file)
A single file at the project root. Edit it via the cog icon in Builder's prompt window, or directly in your editor. Builder's AI reads it every session — rules provide the persistent context that AI lacks between sessions.

### `.builder/rules/*.mdc` (scoped rules)
Granular rules in `.mdc` files under `.builder/rules/`. Support metadata header:
```markdown
---
description: Component structure
globs: src/components/**
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
