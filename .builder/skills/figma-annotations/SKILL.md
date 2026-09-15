---
name: figma-annotations
description: >
  Handle Builder Figma-plugin exports (figma-design-*.html virtual files) and their
  annotations. Use when processing a Figma Smart Export, or when the export contains
  the custom `Img` annotation category — its `src` must be used for the rendered
  <img>/<Image> src, and the Figma layer name must be used as the alt text.
---

See `docs/skills/figma-annotations.md` for the full pattern and gotchas.

Key areas covered:
- How `figma-design-*.html` virtual files work (read-only, not on disk)
- The `Img` annotation category contract: annotation `src` → `<img src>`, layer name → `<img alt>`
- Fallback behavior when no `Img` annotation is present
- Component-structure and testing follow-up steps after generating code from an export
