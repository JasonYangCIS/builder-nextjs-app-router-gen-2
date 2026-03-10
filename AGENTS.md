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

## Key Files

| File | Purpose |
|------|---------|
| `config.ts` | All Builder model names + API key — never hardcode elsewhere |
| `builder-registry.ts` | Custom component registration for Builder visual editor |
| `components/builder/RenderBuilderContent.tsx` | Always use this wrapper, never `<Content>` directly |
| `styles/tokens.css` | Design token source of truth |
| `utils/cn.ts` | className joiner utility |

---

## Directory Structure

```
app/                         # Next.js App Router pages
  [...page]/page.tsx         # Catch-all for Builder-managed page model
  page.tsx                   # Root "/" — also uses Builder page model
  blog/                      # Blog index pages
  blog-article/[slug]/       # Data model article detail
  blog-article-section/[slug]/ # Section model article detail
  blog-article-template/[slug]/ # Hybrid model article detail
  design-system/             # Component showcase

components/
  blog/                      # Blog-specific components
  builder/                   # RenderBuilderContent wrapper
  design-system/             # DS primitives (Button, Typography, Badge, Input, Card)
  layout/                    # Header (RSC + NavItems client), Footer

docs/skills/                 # Detailed skill references (see Skills below)
styles/tokens.css            # Design tokens
types/                       # Shared TypeScript interfaces
utils/cn.ts                  # className joiner
```

---

## Conventions

- **Path alias:** `@/` maps to repo root — always use it for internal imports
- **Model names:** Read from `config.ts`, never as string literals
- **Design system:** Import from barrel `@/components/design-system`

---

## Skills

For task-specific patterns and gotchas, consult the relevant skill:

| Skill | When to use |
|-------|-------------|
| `builder-io` | Builder SDK, content fetching, models, editor/preview, custom components |
| `design-system` | UI components, tokens, WCAG contrast, Tailwind composition |

Skills are defined in `.builder/skills/` and reference full docs in `docs/skills/`.

---

## Commands

Prefer file-scoped checks:

```bash
npx tsc --noEmit path/to/file.tsx
npm run lint -- path/to/file.tsx
```

Full build (only when explicitly requested):

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
