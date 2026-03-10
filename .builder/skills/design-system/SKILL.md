---
name: design-system
description: Use when building or modifying UI components, applying tokens, choosing typography or color, checking WCAG AA contrast, or working with Button, Badge, Input, Card, or Typography primitives.
---

See `docs/skills/design-system.md` for full conventions and token reference.

Key areas covered:
- Design token system (`styles/tokens.css` — single source of truth)
- Component primitives: Button, Typography, Badge, Input, Card
- WCAG AA contrast requirements and compliant color pairings
- cn() utility for conditional Tailwind class composition
- Barrel import pattern: `import { Button, Typography } from "@/components/design-system"`
- When to extend vs. create new components
