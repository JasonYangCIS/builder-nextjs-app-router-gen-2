# Claude Code — Project Instructions

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · `@builder.io/sdk-react` v5.x · shadcn/ui (new-york) · Geist fonts

## After Every Change
```bash
npx tsc --noEmit   # must pass
npm test           # must pass
```

## Key Files
| File | Purpose |
|------|---------|
| `config.ts` | All Builder model names + API key — never hardcode elsewhere |
| `builder-registry.ts` | Custom component registration for Builder visual editor |
| `components/builder/RenderBuilderContent.tsx` | Always use this wrapper — never `<Content>` directly |
| `components/ui/` | shadcn/ui primitives — no barrel, import per file |
| `components/HeroSplit/` | Canonical four-file component pattern (`.tsx` / `.types.ts` / `.module.scss` / `.builder.ts`) |
| `app/globals.css` | OKLCH color tokens + default/dark themes |
| `utils/cn.ts` | className joiner (clsx + tailwind-merge) |
| `AGENTS.md` | Full engineering standards, WCAG checklist, safety rules |

## Rules
@.builderrules

## Skill References
@docs/skills/builder-io.md
@docs/skills/design-system.md
@docs/skills/testing.md

## Context7 Documentation
- **Next.js:** `/vercel/next.js` — use with `mcp__context7__query-docs`
- **Builder.io SDK:** `/builderio/builder` — use with `mcp__context7__query-docs`
- **Builder.io product docs** (Fusion features, visual editor, publishing workflow): query `/builderio/builder` via `mcp__context7__query-docs` on demand — do not assume from memory
