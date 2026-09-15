---
name: figma-annotations
description: >
  Handle Builder Figma-plugin exports (figma-design-*.html virtual files) and their
  annotations. Use when processing a Figma Smart Export, or when the export contains
  the custom `Img` annotation category — its `src` must be used for the rendered
  <img>/<Image> src, and the Figma layer name must be used as the alt text.
user-invocable: false
---

See [docs/skills/figma-annotations.md](../../../docs/skills/figma-annotations.md) for the full pattern and gotchas.

See [.builder/rules/component-structure.mdc](../../../.builder/rules/component-structure.mdc) for the four-file component pattern to follow when an export becomes a new component.
