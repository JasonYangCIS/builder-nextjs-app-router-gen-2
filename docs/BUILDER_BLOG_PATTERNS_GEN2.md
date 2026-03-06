# Builder Blog Patterns: Gen 1 → Gen 2 Mapping

This doc maps the [Builder drag-and-drop blog guide](https://www.builder.io/blog/builder-drag-drop-blog#section-model) (Gen 1 / `@builder.io/react`) to the Gen 2 SDK (`@builder.io/sdk-react`).

## API mapping

| Gen 1 | Gen 2 |
|-------|--------|
| `builder.get('model', { query })` | `fetchOneEntry({ model, apiKey, query })` |
| `builder.getAll('model', { options, fields })` | `fetchEntries({ model, apiKey, limit })` |
| `useIsPreviewing()` (hook) | `isPreviewing()` (function, works in RSC) |
| `BuilderContent` with render prop `(data, loading, fullContent) => ...` | Use `content?.data` for `data`; render your template in code; use `<Content content={content} model={model} />` to render blocks and enable live editing |
| `BuilderComponent model="x" content={fullContent}` | `<Content content={content} model={model} />` |
| `BuilderComponent content={template} data={{ article: fullContent }}` | `<Content content={template} model={model} data={{ article: content }} />` |

Gen 2’s `<Content>` from `@builder.io/sdk-react` supports an optional **`data`** prop, so Section and Hybrid patterns work the same way.

---

## 1. Data model approach

- **Builder:** Data model (e.g. `blog-article`) with fields: title, slug, image, date, content (HTML), blurb, author.
- **Code:** Fetch one entry by slug, render a fixed template from `content.data` (title, blurb, hero, body from `data.content`, etc.). No drag-and-drop body.

**Gen 2 pattern:**

```tsx
const content = await fetchOneEntry({
  model: "blog-article",
  apiKey: config.envs.builderApiKey,
  query: { "data.slug": slug },
});

const data = content?.data;

return (
  <>
    <BlogArticleHero image={data?.image} />
    <BlogArticleHeader title={data?.title} blurb={data?.blurb} date={data?.date} />
    {data?.content && <BlogArticleBody htmlContent={data.content} />}
    <RenderBuilderContent content={content} model="blog-article" />
  </>
);
```

Use `content.data` in your template. Use `<Content>` (or `RenderBuilderContent`) with that same `content` so Builder can live-edit and preview; if the model is data-only, the rendered blocks may be minimal.

---

## 2. Section model approach

- **Builder:** Section model (e.g. `blog-article`) with fields for metadata (title, slug, image, date, blurb, author) and **no** “content” field. The article body is built in the visual editor (blocks/sections).
- **Code:** Fetch the section entry. Render hero/header from `content.data` in code; render the rest (the visual body) with a single `<Content>`.

**Gen 2 pattern:**

```tsx
const content = await fetchOneEntry({
  model: "blog-article",
  apiKey: config.envs.builderApiKey,
  query: { "data.slug": slug },
});

const data = content?.data;

return (
  <>
    <BlogArticleHero image={data?.image} />
    <BlogArticleHeader title={data?.title} blurb={data?.blurb} date={data?.date} />
    <RenderBuilderContent content={content} model="blog-article" />
  </>
);
```

Here, `<Content content={content} model="blog-article" />` renders the drag-and-drop sections authored in Builder. Do **not** render a `BlogArticleBody` from `data.content`; the Section model has no content field—the body is entirely visual blocks.

### Supporting the Builder admin (visual editor)

For the Section model to work in the Builder.io dashboard (editing, live preview, “View Current Draft”), do the following.

#### 1. Set a Preview URL on the Section model

In [Builder.io](https://builder.io) → **Models** → your Section model (e.g. `blog-article-section`) → **Preview URL**:

- **Simple (all entries use the same URL):** e.g. `https://yoursite.com/blog-article-section` or `http://localhost:3000/blog-article-section`.
- **Per-article (recommended):** use a **Dynamic Preview URL** so each entry opens at its own slug.

#### 2. Dynamic Preview URL (per-article + drafts)

So that opening an article in the admin loads the right URL (and drafts don’t 404):

1. In the model, click the **`< >`** icon next to the Preview URL field (requires **Settings → Advanced Settings → Editor → Advanced Preview URL Logic** to be ON).
2. Use logic like this (replace with your base URL and path):

```js
// When the entry is published, preview at its real URL.
if (contentModel.isLive) {
  return `https://yoursite.com/blog-article-section/${content.data.slug}`;
}
// When editing a draft, use a placeholder path your app handles.
return `https://yoursite.com/blog-article-section/__builder_editing__`;
```

For local dev, use `http://localhost:3000/blog-article-section/...` instead of `https://yoursite.com/...`.

#### 3. What the app must do (already in place)

- **Don’t 404 when Builder is editing/previewing:** the page uses `isEditing()` and `isPreviewing()` and only calls `notFound()` when there’s no content and we’re not in the editor (so the Builder iframe always gets a 200).
- **Render when `content` is null:** when the URL is `.../__builder_editing__` or a new draft, `content` can be null; the page still renders the layout and `<Content content={content} model={...} />`. With `content={null}`, the Gen 2 SDK still renders inside the editor so authors can build the section.
- **Optional:** In Builder, **Developer Options** (e.g. Cmd+Ctrl+a) → **Override preview URL host** can set the host to `http://localhost:3000` so all previews hit your local app.

References: [Preview URL](https://www.builder.io/c/docs/guides/preview-url), [Dynamic Preview URLs](https://www.builder.io/c/docs/dynamic-preview-urls).

---

## 3. Hybrid approach

- **Builder:** (1) Data model `blog-article` (metadata + optional content). (2) Section model `blog-article-template` with a “Preview Article” reference; template binds to article data.
- **Code:** Fetch the article by slug and **one** template. Render the template with `<Content>` and pass the full article as `data`, so the template can bind to it.

**Gen 2 pattern:**

```tsx
const articleContent = await fetchOneEntry({
  model: "blog-article",
  apiKey: config.envs.builderApiKey,
  query: { "data.slug": slug },
});

const articleTemplate = await fetchOneEntry({
  model: "blog-article-template",
  apiKey: config.envs.builderApiKey,
});

return (
  <RenderBuilderContent
    content={articleTemplate}
    model="blog-article-template"
    data={{ article: articleContent }}
  />
);
```

In the template, bindings use the passed `data` (e.g. `article.data.title`, `article.data.image`). Your `RenderBuilderContent` (or `<Content>`) must forward the `data` prop for this to work.

---

## Summary

- **Data model:** Fetch entry → render from `content.data` in code → use `<Content content={content} model={model} />` for preview/live editing.
- **Section model:** Same fetch → render metadata from `content.data` → use `<Content content={content} model={model} />` for the visual body (no HTML content field).
- **Hybrid:** Fetch article + template → render with `<Content content={template} model={templateModel} data={{ article: articleContent }} />`.

Gen 2 uses `fetchOneEntry` / `fetchEntries` instead of `builder.get` / `builder.getAll`, and a single `<Content>` component (with optional `data`) instead of `BuilderContent` + `BuilderComponent`.
