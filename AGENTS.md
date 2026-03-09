# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

Next.js App Router sandbox demonstrating [Builder.io Gen 2 SDK](https://www.builder.io/c/docs/developers) integration patterns alongside a custom design system.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · `@builder.io/sdk-react` v5.x

---

## Quick Start

```bash
# Required: Turbopack is incompatible with Builder Dev Tools
npm run dev -- --webpack
```

Environment variable required in `.env.local`:
```
NEXT_PUBLIC_BUILDER_API_KEY=your_key_here
```

---

## Directory Structure

```
app/                         # Next.js App Router pages
  [...page]/page.tsx         # Catch-all for Builder-managed page model
  page.tsx                   # Root "/" — also uses Builder page model
  blog/                      # Blog index pages (one per pattern)
  blog-article/[slug]/       # Data model article detail
  blog-article-section/[slug]/ # Section model article detail
  blog-article-template/[slug]/ # Hybrid model article detail
  design-system/             # Component showcase (Storybook-style)
  error.tsx / not-found.tsx

components/
  blog/                      # Blog-specific components (Hero, Header, Card, List, Body)
  builder/                   # RenderBuilderContent wrapper
  design-system/             # DS primitives (Button, Typography, Badge, Input, Card)
  layout/                    # Header (RSC + NavItems client), Footer
  Counter/                   # Example interactive component

docs/

  skills/
    builder-io.md            # Builder.io patterns, gotchas, model workflows
    design-system.md         # Design system conventions, tokens, WCAG rules

styles/
  tokens.css                 # Single source of truth: @theme tokens + gradient utilities

types/                       # Shared TypeScript interfaces (blog.types.ts, etc.)
utils/
  cn.ts                      # className joiner utility

config.ts                    # All model names + API key — never hardcode elsewhere
builder-registry.ts          # Custom component registration for Builder visual editor
```

---

## Key Conventions

### Config — never hardcode
All Builder model names and the API key live in `config.ts`:
```ts
config.envs.builderApiKey     // NEXT_PUBLIC_BUILDER_API_KEY
config.models.page            // "page"
config.models.blogArticle     // "blog-article"
// etc.
```

### Path alias
`@/` maps to the repo root. Always use `@/` for internal imports.

### RenderBuilderContent
Never use `<Content>` directly in pages. Always use the wrapper:
```ts
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
```

### Design system imports
Import from the barrel:
```ts
import { Button, Typography, Badge } from "@/components/design-system";
```

### cn() utility

`utils/cn.ts` — joins class names, filtering falsy values. **Not** `clsx` or `tailwind-merge` — it's a hand-rolled filter-and-join:

```ts
import { cn } from "@/utils/cn";

cn("base-class", isActive && "active", undefined, "other")
// → "base-class active other"
```

Use for conditional Tailwind class composition in components.

---

## Skills References

| Topic | File |
|-------|------|
| Builder.io patterns, models, gotchas | [`docs/skills/builder-io.md`](docs/skills/builder-io.md) |
| Design system tokens, components, WCAG | [`docs/skills/design-system.md`](docs/skills/design-system.md) |

---

## What NOT to Do

- Do not run `next dev` without `--webpack` — Turbopack breaks Builder Dev Tools
- Do not use `process.env.NEXT_PUBLIC_BUILDER_API_KEY` directly in pages — use `config.envs.builderApiKey`
- Do not use `<Content>` directly — always use `RenderBuilderContent`
- Do not add new model names as string literals — add them to `config.ts` first
- Do not use `dangerouslySetInnerHTML` on Builder HTML fields without DOMPurify sanitization
- Do not call `subscribeToEditor` without the `builder.preview` URL param guard (see builder-io skills)
