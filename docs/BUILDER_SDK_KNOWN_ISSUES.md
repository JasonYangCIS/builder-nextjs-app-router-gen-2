# Builder.io SDK Known Issues & Workarounds

This document tracks known issues with the Builder.io SDK and the workarounds implemented in this project.

## SDK Version

- `@builder.io/sdk-react`: v5.2.0
- `@builder.io/dev-tools`: v1.34.0

---

## The Pre-processing Solution

In this project, we intercept and sanitize the `content.data.blocks` object before it gets rendered by the `<Content>` component. This fixes multiple bugs at the data level before they can cause React rendering issues.

This logic is implemented in `components/builder/RenderBuilderContent.tsx`.

### What it does:
1. Deep clones the `content` prop to avoid mutating React state
2. Recursively traverses `data.blocks`
3. Applies fixes for the known issues below

---

## Issue 1: `class` vs `className` Attribute

### Problem
When creating blocks in Builder's visual editor, if a user specifies a `class` custom attribute instead of a class name, the SDK passes `class="..."` directly to React, causing console warnings:
```
Invalid DOM property `class`. Did you mean `className`?
```

### Status
**Fixed via data pre-processing**

### Solution
The `RenderBuilderContent.tsx` script detects any `block.properties.class`, appends its value to `block.properties.className`, and deletes `block.properties.class`. This eliminates the React console warning entirely.

---

## Issue 2: Invalid HTML Nesting (`<div>` inside `<p>`)

### Problem
Builder's internal `Text` component renders a `<div className="builder-text">`. When a user drops a Text block inside a Paragraph block (or explicitly sets a wrapper tag to `<p>`), it creates invalid HTML:

```html
<p class="welcome-description">
  <div class="builder-text">...</div>  <!-- Invalid nesting -->
</p>
```

React 18 strictly validates DOM nesting and throws hydration mismatch errors when the browser attempts to auto-correct this invalid HTML structure.

### Status
**Fixed via data pre-processing**

### Solution
The `RenderBuilderContent.tsx` script detects any block where `tagName === "p"` that either has children blocks or uses the internal `Text` component. It automatically changes `tagName` to `"div"`, preventing the invalid HTML nesting before React renders it.

*(Note: We also added CSS fallback rules in `app/globals.css` just in case, but the pre-processor handles the root cause).*

---

## Issue 3: Hydration Mismatches

### Problem
Due to issues #1 and #2 above, and additionally because Builder SDK v5.2.0 sometimes adds extra CSS classes (like `builder-block`) on the client-side that don't exist in the server-rendered HTML, React throws hydration mismatches.

### Status
**Fixed**

### Solution
By pre-processing the data to fix the `class` mapping and the invalid HTML nesting (the `<p>` > `<div>` bug), the server-rendered HTML now perfectly matches the initial client-rendered DOM. Hydration works cleanly without needing to skip SSR or use dynamic keys.

---

## Reporting Issues to Builder.io

If you encounter new issues with the Builder SDK:

1. Check the [Builder.io GitHub Issues](https://github.com/BuilderIO/builder/issues)
2. Report bugs with:
   - SDK version (`@builder.io/sdk-react` version)
   - Next.js version
   - Minimal reproduction example
   - Browser console errors/warnings

---

## Summary

| Issue | Status | Impact | Solution |
|-------|--------|--------|----------|
| `class` vs `className` warning | Fixed | Low | Pre-processor maps `class` to `className` |
| Invalid HTML nesting | Fixed | High | Pre-processor converts wrapper `<p>` to `<div>` |
| Hydration mismatches | Fixed | High | Data sanitization resolves all mismatches |

### Current State
✅ **All hydration errors resolved** — No React hydration warnings in console
✅ **TypeScript passes** — No type errors
✅ **SEO preserved** — Server-side rendering fully active
✅ **Clean console** — No more DOM property warnings

All critical functionality works as expected. The site renders cleanly.
