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
