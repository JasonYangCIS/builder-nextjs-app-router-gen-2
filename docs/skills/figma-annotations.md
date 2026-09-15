# Figma Annotations

Patterns for turning Builder Figma-plugin exports (`figma-design-*.html` virtual files) into real components, with a focus on this team's custom `Img` annotation category.

---

## Background

When a Smart Export is pasted into chat, the design is injected as one or more virtual `figma-design-*.html` files (one per frame). These files are **not on disk** — read them with the `Read` tool using their exact path, or find them with `Glob "**/figma-design-*.html"`. `Bash`/`find`/`grep` and `WebFetch` cannot see them.

Figma annotations (added on paid Figma plans before export) travel with the export as extra, structured instructions for code generation — they sit alongside the visual markup and are keyed by a **category** name.

## The `Img` Annotation Category

This team uses a custom annotation category named exactly `Img`. Every `Img` annotation is guaranteed to contain a `src` value. When generating code from an export that contains an `Img` annotation:

1. **Locate the annotation** in the `figma-design-*.html` file — it will be associated with a specific image layer/node (by proximity, id, or an explicit reference depending on how the plugin serialized it). Read the whole file; do not assume a fixed line offset, exports vary per frame.
2. **Use the annotation's `src` as the rendered `<img src>`** (or the `src` passed to `next/image`'s `Image` component) — do not fall back to a placeholder or Builder asset URL when an `Img` annotation is present.
3. **Use the Figma layer name as the rendered `<img alt>`** — the layer name is the human-readable name of the node the annotation is attached to, not the annotation content itself. This gives every exported image a real accessible name instead of empty or generic alt text.
4. If a layer has no `Img` annotation, fall back to standard handling (Builder-driven `image`/`imageAlt` props, empty `alt=""` for decorative images) — see `components/HeroFullBleed/HeroFullBleed.tsx` for the existing pattern of optional image + alt props with safe defaults.

## Implementation Notes

- Prefer `next/image`'s `Image` component over a raw `<img>` tag, consistent with existing components (`HeroFullBleed`, `CloudinaryImage`).
- Alt text from a layer name should be used as-is (trimmed) — don't append boilerplate like "image of" or the file extension.
- If the same `src` needs to be reused across breakpoints/variants in one frame, apply the same alt (layer name) consistently — don't invent different alt text per breakpoint.
- Follow the four-file component pattern (`.tsx` / `.types.ts` / `.module.scss` / `.builder.ts`) documented in `.builder/rules/component-structure.mdc` when the export becomes a new registered component.
- After generating or editing a component from a Figma export, run `npx tsc --noEmit` and `npm test` per `CLAUDE.md`.

## Gotchas

- Don't confuse the annotation's `src` with any placeholder `src` already present in the exported HTML markup (e.g. a Figma CDN thumbnail) — the annotation always wins for `Img` category.
- Annotation-to-node association isn't guaranteed to be a simple 1:1 by DOM order across every export — verify the annotation is attached to the correct image before wiring it in, especially in frames with multiple images.
- Never leave `alt` empty when an `Img` annotation's layer name is available — empty `alt` should only be used for genuinely decorative images that have no annotation at all.
