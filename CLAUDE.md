# Claude Code — Project Instructions

Next.js App Router sandbox for Builder.io Gen 2 SDK integration with a custom design system.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · `@builder.io/sdk-react` v5.x · `@playwright/test`

## Project Rules

@.builderrules

## WCAG 2.1 AA Compliance

**CRITICAL:** All code changes MUST meet WCAG 2.1 Level AA accessibility standards.

See full checklist in @AGENTS.md under "WCAG 2.1 AA Compliance Checklist"

### Key Requirements (must verify for every change):
- Color contrast: 4.5:1 for normal text, 3:1 for large text and UI components
- Touch targets: Minimum 44×44px on mobile, 24×24px on desktop
- Keyboard navigation: All interactive elements accessible via keyboard, Escape closes overlays
- Focus states: Visible focus rings on all focusable elements with 2px outline
- ARIA: Proper labels, expanded states, controls, and semantic HTML
- Motion: Respect `prefers-reduced-motion` for animations

## Builder.io SDK Patterns

@docs/skills/builder-io.md

## Design System Conventions

@docs/skills/design-system.md

## Testing

@docs/skills/testing.md

## Context7 Documentation References

- **Next.js:** `/vercel/next.js` — use with `mcp__context7__query-docs`
- **Builder.io SDK:** `/builderio/builder` — use with `mcp__context7__query-docs`

## Builder.io Local Docs (prefer over context7 for Builder topics)

### Core
@../builder-research-academy/docs/intro.md
@../builder-research-academy/docs/getting-started.md
@../builder-research-academy/docs/key-concepts-fusion.md
@../builder-research-academy/docs/developers.md

### Configuration & Best Practices
@../builder-research-academy/docs/configuration-builder-rules.md
@../builder-research-academy/docs/projects-configuration-files.md
@../builder-research-academy/docs/best-practices.md
@../builder-research-academy/docs/projects-best-practices.md

### Page Building & Components
@../builder-research-academy/docs/guides-page-building.md
@../builder-research-academy/docs/fusion-block-types.md
@../builder-research-academy/docs/component-indexing.md

### Design System
@../builder-research-academy/docs/fusion-design-system-intelligence.md
@../builder-research-academy/docs/fusion-design-system-intelligence-for-developers.md
@../builder-research-academy/docs/fusion-design-system-intelligence-best-practices.md
