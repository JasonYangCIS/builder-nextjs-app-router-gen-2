# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

Next.js App Router sandbox demonstrating [Builder.io Gen 2 SDK](https://www.builder.io/c/docs/developers) integration patterns alongside a shadcn/ui design system (new-york style).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · `@builder.io/sdk-react` v5.x · shadcn/ui · Embla Carousel · Geist fonts

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

## Key Files

| File | Purpose |
|------|---------|
| `config.ts` | All Builder model names, API key, locale config — never hardcode elsewhere |
| `builder-registry.ts` | Custom component registration for Builder visual editor |
| `components/builder/RenderBuilderContent.tsx` | Always use this wrapper, never `<Content>` directly |
| `components/ui/` | shadcn/ui components (new-york style) — Button, Badge, Input, Label, Card, Carousel, Text, FormInput |
| `components/builder/BuilderCarousel.tsx` | Embla Carousel wrapper exposing Builder-friendly props |
| `app/[locale]/layout.tsx` | Locale layout — owns `<html lang>`, Header, Footer; validates locale param |
| `proxy.ts` | Next.js 16 proxy — locale rewrites and canonical redirects |
| `utils/locale.ts` | `buildLocalePath`, `stripLocalePrefix`, `getLocaleFromPath` |
| `app/preview/page.tsx` | Dedicated Builder visual editor preview route (all models) |
| `app/globals.css` | shadcn OKLCH color tokens + theme overrides (default / dark) |
| `styles/tokens.css` | Gradient utilities only — use `var(--primary)` / `var(--accent)` |
| `utils/cn.ts` | className joiner (clsx + tailwind-merge) |

---

## Directory Structure

```
app/
  layout.tsx                   # Root layout — passthrough (returns children only)
  [locale]/                    # All user-facing pages live under this segment
    layout.tsx                 # Locale layout — owns <html lang>, Header, Footer
    page.tsx                   # Root "/" — Builder page model
    [...page]/page.tsx         # Catch-all for Builder-managed pages
    blog/page.tsx              # Blog index hub
    blog-article/              # Data model blog
      page.tsx                 #   List page
      [slug]/page.tsx          #   Detail page
    blog-article-section/      # Section model blog
      page.tsx                 #   List page
      [slug]/page.tsx          #   Detail page
    blog-article-template/     # Hybrid model blog
      page.tsx                 #   List page
      [slug]/page.tsx          #   Detail page
    design-system/page.tsx     # Component showcase
  preview/                     # Builder visual editor preview (force-dynamic, own layout)
  test/                        # Playwright fixture pages (own layout)

components/
  blog/                        # Blog-specific components
  builder/                     # RenderBuilderContent wrapper + BuilderCarousel
  ui/                          # shadcn/ui primitives (Button, Badge, Input, Label, Card, Carousel, Text, FormInput)
  layout/                      # Header (RSC + NavItems client), Footer
  LocaleSwitch/                # Locale switcher dropdown (client component)
  HeroSplit/                   # Canonical example of the four-file component pattern

docs/skills/                   # Detailed skill references (see Skills below)
styles/tokens.css              # Design tokens
types/                         # Shared TypeScript interfaces
utils/
  cn.ts                        # className joiner
  locale.ts                    # buildLocalePath, stripLocalePrefix, getLocaleFromPath
proxy.ts                       # Next.js 16 proxy (locale rewrites + redirects)
```

---

## Component File Structure

### Two component locations — do not mix them up

| Type | Location | Structure |
|------|----------|-----------|
| shadcn/ui primitive | `components/ui/my-component.tsx` | Single flat file — this is the shadcn convention |
| Feature / Builder component | `components/MyComponent/` | Four-file folder pattern (see below) |

Use `components/ui/` only for shadcn primitives copied from ui.shadcn.com. Everything else — feature components, Builder-registered components, any component with its own styles or types — uses the four-file folder pattern.

### Four-file folder pattern

Every feature component in `components/` follows the same four-file pattern used by `components/HeroSplit/`:

```
components/MyComponent/
  MyComponent.tsx          # Component implementation + re-exports types
  MyComponent.types.ts     # TypeScript interfaces only
  MyComponent.module.scss  # CSS Modules styles (uses CSS custom properties, not Tailwind)
  MyComponent.builder.ts   # Builder.io RegisteredComponent config (omit if not Builder-registered)
```

### Rules

- **One folder per component** — `components/ComponentName/ComponentName.tsx`, never a flat file for non-trivial components
- **Types file** — all `interface` and `type` declarations live in `ComponentName.types.ts`; the component file imports and re-exports them:
  ```ts
  import type { MyComponentProps } from "./MyComponent.types";
  export type { MyComponentProps } from "./MyComponent.types";
  ```
- **SCSS Modules** — use `ComponentName.module.scss` for component-scoped styles; use CSS custom properties (`var(--foreground)`, `var(--primary)`, etc.) so styles respect the active theme. Apply classes via `cn(styles.foo, condition && styles.bar)`.
- **Builder config file** — only create `ComponentName.builder.ts` when the component is registered in `builder-registry.ts`. Export a named constant: `export const myComponentConfig: RegisteredComponent = { ... }`. Import the component with a default import from `"./MyComponent"`.
- **No barrel `index.ts`** — import directly from the component file, e.g. `import MyComponent from "@/components/MyComponent/MyComponent"`.

### Example `.builder.ts` export

```ts
import type { RegisteredComponent } from "@builder.io/sdk-react";
import MyComponent from "./MyComponent";

export const myComponentConfig: RegisteredComponent = {
  component: MyComponent,
  name: "My Component",
  inputs: [ /* ... */ ],
};
```

Then in `builder-registry.ts`, import and spread: `import { myComponentConfig } from "@/components/MyComponent/MyComponent.builder"`.

### Doc update checklist — run after creating any new component

After scaffolding a net-new component, check each item below and update if applicable:

| Condition | File to update |
|-----------|---------------|
| Component is in `components/` and notable enough to reference | `AGENTS.md` — add to the Directory Structure listing |
| Component is a new shadcn primitive or introduces a new UI pattern | `docs/skills/design-system.md` — document component API, variants, and import path |
| Component is registered in `builder-registry.ts` | `docs/skills/builder-io.md` — update Custom Component Registration section if a new pattern is used |
| Component introduces a variation on the four-file folder pattern | `.builder/rules/component-structure.mdc` — update with the new pattern and rationale |
| Component is a new UI primitive intended for reuse | `app/design-system/page.tsx` — add a showcase section so it is visible and Playwright-testable |
| Component is a new UI primitive **or** a new feature component | `tests/design-system/` or `tests/heroes/` — add a `my-component.spec.ts` Playwright test |
| Component file structure or naming convention changes | `.builderrules` — update the Component File Structure section |

**When in doubt, update the docs.** Outdated agent docs cause future agents to generate inconsistent code.

---

## Conventions

- **Path alias:** `@/` maps to repo root — always use it for internal imports
- **Model names:** Read from `config.ts`, never as string literals
- **shadcn components:** Import from each component's own file — `import { Button } from "@/components/ui/button"`. No barrel.
- **Typography:** Use `Text` from `@/components/ui/text` — same variant/color API as the old Typography component
- **Labeled inputs:** Use `FormInput` from `@/components/ui/form-input`; use bare `Input` only when no label is needed
- **Color tokens:** Use shadcn semantic tokens (`text-foreground`, `bg-primary`, `text-muted-foreground`, etc.) — never hardcode hex values or raw zinc/slate shades for text
- **Library types:** Import and re-export types from third-party libraries instead of redefining them (see TypeScript Conventions below)

---

## TypeScript Conventions

### Using Library Types (Single Source of Truth)

**CRITICAL:** When building components that wrap third-party libraries, always import and re-export the library's native types instead of redefining them.

**Why:**
- Maintains single source of truth
- Ensures type compatibility with the underlying library
- Prevents type drift when the library updates
- Reduces maintenance burden

**Pattern:**

```ts
// ❌ BAD: Redefining library types
export type MyVariant = "default" | "destructive" | "outline";

// ✅ GOOD: Import and re-export library types
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
```

**When to use this pattern:**
- Component wraps a third-party library (shadcn, Embla, Radix, etc.)
- The library exports TypeScript types
- Your component props mirror library options

**When NOT to use:**
- Library doesn't export types
- Your component significantly transforms the API
- You're adding custom values beyond what the library supports

---

## Engineering Standards

Every code change — regardless of scope — must meet all of the following. These are not optional.

---

### React & Next.js

- **Server Components by default.** Use `"use client"` only when a component needs interactivity (event handlers, `useState`, `useEffect`, browser APIs). Push client boundaries as far down the tree as possible.
- **Fetch data in Server Components.** Never fetch in Client Components when the server can do it.
- **`next/image` for all images.** Never use bare `<img>` — `<Image>` handles lazy loading, sizing, format, and CLS prevention automatically. Always set `sizes` on fill images.
- **`next/link` for all internal navigation.** Never use `<a href>` for same-origin links.
- **Metadata API for SEO.** Export `metadata` (static) or `generateMetadata` (dynamic) on every `page.tsx`. Include at minimum `title` and `description`.
- **`generateStaticParams`** on all `[slug]` routes to pre-render at build time.
- **`export const revalidate`** on all Builder-connected pages for ISR.
- **Suspense boundaries** around async content to enable streaming and avoid waterfalls.
- **No layout shift.** Reserve space for images and dynamic content to prevent CLS.

---

### TypeScript

- **No `any`** without an inline comment explaining why it is unavoidable.
- **No type assertions (`as`)** unless absolutely necessary and commented.
- **Infer types where possible** — do not annotate what TypeScript can derive.
- **Validate external data at boundaries** — API responses, URL params, Builder data fields.
- **`import type`** for type-only imports to prevent accidental runtime inclusion.
- **Strict mode is on** — do not disable strict checks via `tsconfig` or `@ts-ignore` without justification.

---

### Code Quality — DRY · KISS · Separation of Concerns

- **Don't repeat yourself.** Shared logic belongs in `utils/`, shared types in `types/`, shared UI in `components/`.
- **Keep it simple.** The simplest solution that meets the requirement is the correct one. Avoid speculative abstractions.
- **One responsibility per module.** Pages compose. Components render. Utilities transform. Types describe.
- **Server Components fetch; Client Components interact.** Never mix data-fetching with interaction logic in the same component.
- **No premature abstraction.** Two similar code paths do not justify extraction. Three might — use judgment.
- **Delete dead code.** No commented-out code, unused imports, or stale variables.
- **No over-engineering.** Do not add configuration flags, fallbacks, or generics for hypothetical future requirements.

---

### SEO

- Every `page.tsx` exports `metadata` or `generateMetadata` — `title` and `description` are required.
- One `<h1>` per page. Logical heading hierarchy (`h1 → h2 → h3`). Never skip levels.
- Semantic landmark elements: `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>`.
- All images have descriptive `alt` text (`alt=""` only for decorative images).
- Link text is descriptive — avoid "click here" or "read more" without context.
- Canonical URLs and Open Graph tags on public-facing pages.

---

### Security

- **No `dangerouslySetInnerHTML`** without sanitizing through DOMPurify first — applies to all Builder HTML fields and any user-generated content.
- **No secrets in client code.** Environment variables exposed to the browser must use `NEXT_PUBLIC_` prefix intentionally — never leak API keys or tokens to the client bundle.
- **Validate and sanitize all external input** — URL params, form data, Builder data fields, API responses — before using in logic or rendering.
- **No SQL/command injection surface.** Treat all external strings as untrusted; never interpolate them into queries, shell commands, or `eval`.
- **Content Security Policy awareness.** Do not introduce inline `<script>` tags, `javascript:` hrefs, or `eval()`-style patterns.
- **Dependency hygiene.** Do not install packages with known critical vulnerabilities; prefer well-maintained, minimal-dependency libraries.

---

### Performance

- **Prefer Server Components** — they ship zero JS to the browser by default.
- **`next/dynamic`** with `ssr: false` for heavy client-only libraries (editors, maps, charts).
- **Avoid inline object/array/function props** in JSX when the value is recreated on every render — declare outside the component or use `useMemo`/`useCallback` only when profiling confirms it helps.
- **`export const revalidate`** over `cache: "no-store"` on pages that can tolerate stale-while-revalidate.
- **No blocking third-party scripts.** Use `strategy="afterInteractive"` or `strategy="lazyOnload"` on `<Script>`.
- **`prefers-reduced-motion`** — all CSS animations and transitions must respect this media query.

---

## WCAG 2.1 AA Compliance Checklist

**Every code change MUST meet WCAG 2.1 Level AA accessibility standards.**

### Required Checks Before Committing

#### Color Contrast
- [ ] Normal text (< 24px): minimum 4.5:1 contrast ratio
- [ ] Large text (≥ 24px or ≥ 19px bold): minimum 3:1 contrast ratio
- [ ] UI components and graphics: minimum 3:1 contrast ratio
- [ ] Use theme variables that maintain proper contrast across all themes

#### Interactive Elements
- [ ] Touch targets: minimum 44×44px (mobile) or 24×24px (desktop)
- [ ] Visible focus indicators on all focusable elements
- [ ] Focus ring with sufficient contrast (2px outline, offset from element)
- [ ] Hover states that don't rely solely on color

#### Keyboard Navigation
- [ ] All interactive elements accessible via keyboard (Tab, Enter, Space)
- [ ] Escape key closes modals, dropdowns, and overlays
- [ ] Arrow keys for navigation where appropriate
- [ ] No keyboard traps

#### ARIA and Semantics
- [ ] Proper semantic HTML (nav, button, header, main, etc.)
- [ ] ARIA labels on icon-only buttons (`aria-label`)
- [ ] `aria-expanded` on toggleable elements
- [ ] `aria-controls` linking controls to their targets
- [ ] `aria-hidden="true"` on decorative elements
- [ ] Proper heading hierarchy (h1 → h2 → h3)

#### Content and Structure
- [ ] Descriptive link text (avoid "click here")
- [ ] Alt text on all images (or `alt=""` for decorative)
- [ ] Form labels properly associated with inputs
- [ ] Error messages clearly describe the issue
- [ ] Loading states announced to screen readers

#### Motion and Animation
- [ ] Respect `prefers-reduced-motion` for users with vestibular disorders
- [ ] Animations can be paused or disabled
- [ ] No auto-playing video/audio without controls

### Testing Tools
- Browser DevTools: Lighthouse accessibility audit
- Color contrast: WebAIM Contrast Checker or similar
- Keyboard: Navigate entire UI using only keyboard
- Screen reader: Test with NVDA (Windows) or VoiceOver (Mac)

### Reference
Full guidelines: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)

---

## Skills

For task-specific patterns and gotchas, consult the relevant skill:

| Skill | When to use |
|-------|-------------|
| `builder-io` | Builder SDK, content fetching, models, editor/preview, custom components |
| `design-system` | UI components, tokens, WCAG contrast, Tailwind composition |
| `localization` | Locale routing, proxy, `buildLocalePath`, internal links, preview locale |
| `testing` | Playwright E2E, fixture pages, selector scoping, gotchas |

Skills are defined in `.builder/skills/` and reference full docs in `docs/skills/`.

---

## Commands

### After every change — always run these

```bash
# 1. Type-check changed files
npx tsc --noEmit

# 2. Run the test suite
npm test
```

Both must pass before a task is considered complete. Fix any errors before finishing — do not leave a failing type-check or test suite.

### File-scoped checks (faster, use during development)

```bash
npx tsc --noEmit path/to/file.tsx
npm run lint -- path/to/file.tsx
```

### Full build (run when explicitly requested or before a PR)

```bash
npm run build
```

---

## Safety and Permissions

**Allowed without prompt:**
- Read files, list files, search codebase
- File-scoped TypeScript and ESLint checks
- Running the dev server

**Ask first:**
- Installing or removing packages
- `git push` or creating PRs
- Deleting files or directories
- Running a full build
- Any change to `config.ts` model names (affects Builder admin mappings)
