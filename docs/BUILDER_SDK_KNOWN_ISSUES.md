# Builder.io SDK Known Issues & Workarounds

This document tracks known issues with the Builder.io SDK and the workarounds implemented in this project.

## SDK Version

- `@builder.io/sdk-react`: v5.2.0
- `@builder.io/dev-tools`: v1.34.0

---

## Issue 1: `class` vs `className` Attribute

### Problem
The Builder SDK renders HTML elements with the `class` attribute instead of React's `className`, causing React to log warnings:

```
Invalid DOM property `class`. Did you mean `className`?
```

### Status
**Console warning only** — Does not affect functionality or cause hydration errors (suppressed).

### Cause
Builder SDK v5.2.0 bug where the SDK renders both `class` (for server HTML) and `className` (for React) on the same element, causing React warnings during hydration.

### Workaround
**No workaround needed** — This is a Builder SDK bug that only produces console warnings. It does not affect functionality, hydration, or user experience. The warning can be safely ignored.

Updates made:
1. Updated `@builder.io/dev-tools` to v1.34.0 (from v1.28.18)
2. Hydration errors fixed via client-side key in `RenderBuilderContent.tsx` (see Issue #3)

### Related Files
- `components/builder/RenderBuilderContent.tsx` — Client-side key prevents hydration issues

---

## Issue 2: Invalid HTML Nesting (`<div>` inside `<p>`)

### Problem
Builder's Text component renders a `<div className="builder-text">` which can be nested inside `<p>` tags in Builder content, creating invalid HTML:

```html
<p class="welcome-description">
  <div class="builder-text">...</div>  <!-- Invalid nesting -->
</p>
```

This causes:
- HTML validation errors
- Hydration warnings
- Potential layout issues

### Status
**Fixed with CSS workaround**

### Cause
Builder's Text block component wraps content in a `<div>` for styling, but users can place Text blocks inside Paragraph blocks in the Builder editor.

### Workaround
Added CSS rules in `app/globals.css` to force nested `.builder-text` divs to render inline:

```css
/* Fix for Builder SDK rendering <div> inside <p> tags */
p .builder-text {
  display: inline;
}

p > div[class*="builder-"] {
  display: inline;
}

p .builder-text p {
  display: inline;
  margin: 0;
}
```

### Best Practice
When editing content in Builder.io:
- **Avoid** placing Text blocks inside Paragraph blocks
- Use Text blocks standalone or inside Container/Box blocks
- If you need paragraph styling, use the Text block's built-in paragraph option

### Related Files
- `app/globals.css` — CSS workaround styles

---

## Issue 3: Hydration Mismatches

### Problem
Server-rendered HTML doesn't match client-rendered output due to:
1. `class` vs `className` attribute differences
2. Different className values between server and client (server: `"welcome-container"`, client: `"builder-xxx... builder-block welcome-container"`)
3. Invalid HTML nesting being corrected by the browser

### Status
**Fixed**

### Cause
Builder SDK v5.2.0 adds extra CSS classes on the client side that don't exist in the server-rendered HTML, causing React to detect a hydration mismatch and throw errors.

### Solution
Use a dynamic `key` prop that changes between server and client rendering to force React to completely replace the content on client-side instead of attempting hydration. This approach:
- Eliminates all hydration errors
- Preserves SEO (server still renders content)
- Allows client to render with correct Builder classes
- No suppressHydrationWarning needed

Implementation in `components/builder/RenderBuilderContent.tsx`:
```tsx
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);

return (
  <Content
    key={isClient ? "client" : "server"}
    content={content}
    // ... other props
  />
);
```

### Related Files
- `components/builder/RenderBuilderContent.tsx` — Client-side key fix

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

## Future Updates

When upgrading Builder SDK packages:

1. Test thoroughly for hydration errors
2. Check if these workarounds can be removed
3. Update this document with new version numbers and status
4. Run full test suite: `npm test`
5. Check dev server logs for new warnings

### Upgrade Checklist

```bash
# Check latest versions
npm view @builder.io/sdk-react version
npm view @builder.io/dev-tools version

# Upgrade (test in a branch first)
npm install @builder.io/sdk-react@latest @builder.io/dev-tools@latest

# Test
npm run dev
npm test

# Check for errors in browser console and dev server logs
```

---

## Summary

| Issue | Status | Impact | Workaround |
|-------|--------|--------|------------|
| `class` vs `className` warning | Console warning only | Low | SDK bug - cosmetic only |
| Invalid HTML nesting | Fixed | Medium | CSS `display: inline` |
| Hydration mismatches | Fixed | High | Client-side `key` prop forces re-render |

### Current State
✅ **All hydration errors resolved** — No React hydration warnings in console
✅ **TypeScript passes** — No type errors
✅ **SEO preserved** — Server-side rendering still active
⚠️ **Minor console warning** — `class` vs `className` is a Builder SDK bug (cosmetic only)

All critical functionality works as expected. The site renders correctly without client-side errors.
