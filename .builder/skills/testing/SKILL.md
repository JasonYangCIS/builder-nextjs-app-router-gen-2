---
name: testing
description: Use when writing or debugging Playwright E2E tests, working with fixture pages, scoping selectors, or handling Builder DevTools test conflicts.
---

See `docs/skills/testing.md` for the full test setup, conventions, and gotchas.

Key areas covered:
- Playwright setup: Chromium headless, auto-starts dev server, `baseURL: http://localhost:3000`
- Test file structure mirrors component directory (`tests/design-system/`, `tests/heroes/`, etc.)
- Fixture pages: `/design-system` (component showcase) and `/test/blog-components` (blog components)
- Selector scoping: always scope to section `id` to avoid cross-section collisions
- Builder DevTools auto-disabled via `PLAYWRIGHT_TEST=true` env flag
- Defensive patterns for Builder-dependent pages and timezone-sensitive date assertions
- App element scoping: `header.relative.border-b`, `footer.mt-16` to avoid DevTools element conflicts
