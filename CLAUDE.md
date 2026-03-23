# Claude Code — Project Instructions

Next.js App Router sandbox demonstrating [Builder.io Gen 2 SDK](https://www.builder.io/c/docs/developers) integration patterns alongside a shadcn/ui design system (new-york style).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · `@builder.io/sdk-react` v5.x · shadcn/ui · Embla Carousel · Geist fonts

## Quick Start

```bash
npm run dev -- --webpack   # Turbopack is incompatible with Builder Dev Tools
```

Environment variable required in `.env.local`: `NEXT_PUBLIC_BUILDER_API_KEY=your_key_here`

## After Every Change

```bash
npx tsc --noEmit   # must pass
npm test           # must pass
```

After creating a new component or adding/removing a skill, run the checklists in the `project-maintenance` skill.

## Key Files

| File | Purpose |
|------|---------|
| `config.ts` | All Builder model names, API key, locale config — never hardcode elsewhere |
| `builder-registry.ts` | Custom component registration for Builder visual editor |
| `components/builder/RenderBuilderContent.tsx` | Always use this wrapper, never `<Content>` directly |
| `components/ui/` | shadcn/ui primitives (new-york style) — one file per component, no barrel |
| `components/HeroSplit/` | Canonical four-file component pattern — see `.builder/rules/component-structure.mdc` |
| `app/[locale]/layout.tsx` | Locale layout — owns `<html lang>`, Header, Footer; validates locale param |
| `proxy.ts` | Next.js 16 proxy — locale rewrites and canonical redirects |
| `app/preview/page.tsx` | Dedicated Builder visual editor preview route (all models) |
| `app/globals.css` | OKLCH color tokens + default/dark themes |

## Directory Structure

```
app/
  layout.tsx                   # Root layout — passthrough (returns children only)
  [locale]/                    # All user-facing pages live under this segment
    layout.tsx                 # Locale layout — owns <html lang>, Header, Footer
    page.tsx                   # Root "/" — Builder page model
    [...page]/page.tsx         # Catch-all for Builder-managed pages
    blog/page.tsx              # Blog index hub
    blog-article/              # Data model blog (list + [slug] detail)
    blog-article-section/      # Section model blog (list + [slug] detail)
    blog-article-template/     # Hybrid model blog (list + [slug] detail)
    design-system/page.tsx     # Component showcase
  preview/                     # Builder visual editor preview (force-dynamic, own layout)
  test/                        # Playwright fixture pages (own layout)

components/
  blog/                        # Blog-specific components
  builder/                     # RenderBuilderContent wrapper + BuilderCarousel
  ui/                          # shadcn/ui primitives (Button, Badge, Input, Card, Carousel, Text, FormInput)
  Algolia/                     # AlgoliaSearch, SearchForm, ResultsList (Algolia integration)
  layout/                      # Header (RSC + NavItems, SearchButton, ThemeSwitch client), Footer
  LocaleSwitch/                # Locale switcher icon button + dropdown (client component)
  CloudinaryImage/             # Cloudinary image component (cloudinaryImageEditor plugin)
  HeroSplit/                   # Canonical four-file component pattern
  AnnouncementBar/             # Dismissable site-wide bar with optional countdown timer

docs/skills/                   # Canonical skill references (loaded on demand)
types/                         # Shared TypeScript interfaces
utils/                         # cn.ts (className joiner), locale.ts (buildLocalePath, etc.)
proxy.ts                       # Next.js 16 proxy (locale rewrites + redirects)
```

## Skills

Skills load on demand — consult the relevant skill for task-specific patterns and gotchas:

| Skill | When to use |
|-------|-------------|
| `builder-io` | Builder SDK, content fetching, models, editor/preview, custom components |
| `design-system` | UI components, tokens, WCAG contrast, Tailwind composition |
| `engineering-standards` | React/Next.js, TypeScript, code quality, SEO, security, performance, WCAG AA |
| `localization` | Locale routing, proxy, `buildLocalePath`, internal links, preview locale |
| `project-maintenance` | Doc update checklist (new components), skill sync checklist (add/remove skills) |
| `testing` | Playwright E2E, fixture pages, selector scoping, gotchas |

Canonical docs live in `docs/skills/`. Pointers in `.builder/skills/` (Fusion) and `.claude/skills/` (Claude Code).

## Rules
@.builderrules

## Context7 Documentation
- **Next.js:** `/vercel/next.js` — use with `mcp__context7__query-docs`
- **Builder.io SDK:** `/builderio/builder` — use with `mcp__context7__query-docs`
