---
name: engineering-standards
description: Use when writing or reviewing code, checking TypeScript conventions, enforcing React/Next.js best practices, SEO, security, performance, WCAG AA accessibility, or code quality standards (DRY, KISS, separation of concerns).
---

See `docs/skills/engineering-standards.md` for the full standards and WCAG checklist.

Key areas covered:
- TypeScript conventions: library type re-exports, no `any`, strict mode, `import type`
- React & Next.js: Server Components by default, `next/image`, `next/link`, Metadata API, ISR
- Code quality: DRY, KISS, separation of concerns, no premature abstraction, delete dead code
- SEO: metadata on every page, heading hierarchy, semantic landmarks, alt text
- Security: DOMPurify for HTML, no secrets in client, validate external input, no injection
- Performance: Server Components, `next/dynamic`, `revalidate`, no blocking scripts, `prefers-reduced-motion`
- WCAG 2.1 AA: color contrast, touch targets, focus indicators, keyboard nav, ARIA, motion
