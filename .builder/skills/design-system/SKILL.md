---
name: design-system
description: Use when building or modifying UI components, applying color tokens, choosing typography, checking WCAG AA contrast, or working with shadcn/ui primitives (Button, Badge, FormInput, Card, Carousel, Text).
---

See `docs/skills/design-system.md` for full conventions and component reference.

Key areas covered:
- shadcn/ui component library (new-york style) in `components/ui/`
- Color token system: shadcn OKLCH variables in `app/globals.css` (default / dark / ritual themes)
- Gradient utilities in `styles/tokens.css` — use `var(--primary)` / `var(--accent)`
- WCAG AA: use semantic tokens (`text-foreground`, `text-muted-foreground`, etc.) — never hardcode hex
- `cn()` utility from `@/utils/cn` for conditional Tailwind class composition
- Per-file import pattern: `import { Button } from "@/components/ui/button"` — no barrel
- Text component (Typography replacement): `import { Text } from "@/components/ui/text"`
- Labeled input wrapper: `import { FormInput } from "@/components/ui/form-input"`
- Builder carousel wrapper: `import { BuilderCarousel } from "@/components/builder/BuilderCarousel"`
- When to add a new shadcn component vs. compose from existing primitives
