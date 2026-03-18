---
name: builder-io
description: Use when working with Builder.io SDK, fetching content, adding models, registering custom components, or debugging editor/preview issues. Covers fetchOneEntry, fetchEntries, RenderBuilderContent, subscribeToEditor, and all three blog model patterns.
---

See `docs/skills/builder-io.md` for full patterns and gotchas.

Key areas covered:
- Core SDK functions (fetchOneEntry, fetchEntries, isEditing, isPreviewing, subscribeToEditor)
- Route patterns: catch-all, root route, list page, detail/slug page
- Three blog model patterns: Data, Section, Hybrid
- Adding a new model (4-step checklist)
- subscribeToEditor model guard (required — prevents mismatch errors)
- Custom component registration in builder-registry.ts — uses the four-file folder pattern (`.tsx` / `.types.ts` / `.module.scss` / `.builder.ts`)
- RenderBuilderContent render logic
- TypeScript type conventions for Builder data fields
- Dynamic preview URL setup in Builder admin
- After creating a new component: run the doc update checklist in AGENTS.md
