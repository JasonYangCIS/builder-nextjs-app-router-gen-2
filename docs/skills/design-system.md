# Design System Skills

Conventions for working with the custom design system in this repo.

---

## Architecture

| Layer | Location | Purpose |
|-------|----------|---------|
| Tokens | `styles/tokens.css` | Single source of truth — colors, gradients |
| Primitives | `components/design-system/` | Button, Typography, Badge, Input, Card |
| Other components | `components/Counter/Counter.tsx` | Example client component with state |
| Barrel | `components/design-system/index.ts` | Public API for all DS imports |
| Showcase | `app/design-system/page.tsx` | Storybook-style visual reference at `/design-system`; also the Playwright test harness for all DS components and Counter |

---

## Tokens (`styles/tokens.css`)

Tailwind v4 uses `@theme` in CSS instead of `tailwind.config.ts`. All tokens defined here auto-generate Tailwind utility classes.

```css
@theme {
  --color-brand-600: #4f46e5;   /* → bg-brand-600, text-brand-600, border-brand-600 */
  --color-accent-600: #7c3aed;  /* → bg-accent-600, etc. */
}
```

### Color Scales

| Scale | Base hue | Use |
|-------|----------|-----|
| `brand` | Indigo | Primary interactive, CTAs, focus rings |
| `accent` | Violet | Gradient pair for brand |
| `success` | Emerald | Positive states |
| `warning` | Amber | Cautionary states |
| `error` | Rose | Error/destructive states |

### Gradient Utilities

Defined in `@layer utilities` in `tokens.css`. Apply as className values:

| Class | Use |
|-------|-----|
| `gradient-brand` | Background: indigo → violet. CTAs, active states |
| `gradient-brand-subtle` | Light wash. Section backgrounds, card tints |
| `gradient-brand-dark` | Deep indigo → deep violet. Dark hero sections |
| `gradient-mesh` | Multi-stop radial. Hero backgrounds |
| `gradient-brand-text` | CSS gradient text. Headings, display type |

### Adding a Token

Add to the `@theme` block in `styles/tokens.css`. The Tailwind utility is generated automatically — no config file needed.

---

## Components

### Import

```ts
import { Button, Typography, Badge, Input, Card } from "@/components/design-system";
```

### Typography

```tsx
<Typography variant="h1" color="default" text="Hello World" />
<Typography variant="body" color="muted">Paragraph content</Typography>
<Typography variant="h2" as="h3" />  {/* semantic override via as prop */}
```

**Variants:** `display`, `h1`–`h6`, `body-lg`, `body`, `body-sm`, `caption`, `label`, `overline`

**Colors:** `default` · `muted` · `subtle` · `primary` · `success` · `warning` · `error`

### Button

```tsx
<Button label="Save" variant="primary" size="md" />
<Button label="Delete" variant="destructive" />
<Button label="Saving…" loading />
<Button label="Disabled" disabled />
```

**Variants:** `primary` · `secondary` · `ghost` · `destructive`
**Sizes:** `sm` · `md` · `lg`

### Badge

```tsx
<Badge label="Published" variant="success" size="md" />
```

**Variants:** `neutral` · `primary` · `success` · `warning` · `error`
**Sizes:** `sm` · `md`

### Input

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" type="password" helperText="Min 8 characters" />
<Input label="Email" errorText="Invalid email address" />
<Input label="Name" required />
<Input label="Username" disabled />
```

Uses `useId()` for accessible label/input association. Error state sets `aria-invalid` and `role="alert"` on helper text.

### Card

```tsx
<Card shadow="sm" padding="md">
  <p>Content here</p>
</Card>
<Card borderless shadow="md" className="w-56" />
```

**Shadow:** `none` · `sm` · `md` · `lg`
**Padding:** `none` · `sm` · `md` · `lg`
`borderless` removes the default border ring.

---

## WCAG 2.1 AA Compliance Rules

Minimum contrast ratios: **4.5:1** for normal text, **3:1** for large text (≥18pt or ≥14pt bold).

### Approved text colors (on white `#ffffff`)

| Tailwind class | Hex | Contrast | Status |
|---------------|-----|----------|--------|
| `text-zinc-900` | `#18181b` | ~16.0:1 | ✅ |
| `text-zinc-700` | `#3f3f46` | ~9.5:1 | ✅ |
| `text-zinc-600` | `#52525b` | ~7.0:1 | ✅ |
| `text-zinc-500` | `#71717a` | ~4.95:1 | ✅ |
| `text-brand-600` | `#4f46e5` | ~5.9:1 | ✅ |
| `text-brand-700` | `#4338ca` | ~7.2:1 | ✅ |
| `text-accent-600` | `#7c3aed` | ~5.1:1 | ✅ |
| `text-success-700` | `#047857` | ~5.8:1 | ✅ |
| `text-warning-700` | `#b45309` | ~4.9:1 | ✅ |
| `text-error-700` | `#be123c` | ~5.4:1 | ✅ |

### Do NOT use for body text on white

| Tailwind class | Contrast | Reason |
|---------------|----------|--------|
| `text-zinc-400` | ~2.47:1 | Fails AA |
| `text-zinc-300` | ~1.9:1 | Fails AA |
| `text-brand-400` | ~2.79:1 | Fails AA |
| `text-accent-400` | ~2.56:1 | Fails AA |

### gradient-brand-text

Uses `brand-600` → `accent-600` (both ≥ 4.5:1 on white). Do not change to 400-level colors.

### Typography `subtle` color

Maps to `text-zinc-500` (~4.95:1). Do not use `text-zinc-400` directly for readable text — it fails WCAG.

---

## Extending the Design System

### Using Library Types (Single Source of Truth)

**CRITICAL:** When building components that wrap third-party libraries, always import and re-export the library's native types instead of redefining them.

**Why:**
- Maintains single source of truth
- Ensures type compatibility with the underlying library
- Prevents type drift when the library updates
- Reduces maintenance burden

**Pattern:**

```ts
// ❌ BAD: Redefining library types
export type MyEffect = "slide" | "fade" | "cube";

// ✅ GOOD: Import and re-export library types
import type { SwiperOptions } from "swiper/types";

export type CarouselEffect = NonNullable<SwiperOptions["effect"]>;
export type CarouselDirection = NonNullable<SwiperOptions["direction"]>;
```

**When to use this pattern:**
- Component wraps a third-party library (Swiper, Leaflet, etc.)
- The library exports TypeScript types
- Your component props mirror library options

**When NOT to use:**
- Library doesn't export types
- Your component significantly transforms the API
- You're adding custom values beyond what the library supports

### Adding a new component

1. Create `components/design-system/MyComponent/MyComponent.tsx` and `MyComponent.types.ts`
2. **If wrapping a library:** Import and re-export its types (see "Using Library Types" above)
3. Export from `components/design-system/index.ts`
4. Register in `builder-registry.ts` with `RegisteredComponent` schema
5. Add a section to `app/design-system/page.tsx` using `Section` + `DemoRow`/`DemoItem` helpers (see below)

### Showcase page helpers (`app/design-system/page.tsx`)

These layout helpers are defined locally in the file — they are not exported or importable elsewhere.

**`Section`** — wraps a named block with a heading and optional description:
```tsx
<Section id="my-component" title="My Component" description="Optional subtitle.">
  {/* DemoRows go here */}
</Section>
```
- `id` is used for sidebar anchor links — add a matching entry to the `NAV` array at the top of the file
- Renders a card-style container with a border

**`DemoRow`** — a horizontal row inside a Section, with an optional monospace label:
```tsx
<DemoRow label="variant">
  <DemoItem label="primary"><MyComponent variant="primary" /></DemoItem>
  <DemoItem label="secondary"><MyComponent variant="secondary" /></DemoItem>
</DemoRow>
```
- `label` renders as a grey monospace header above the row
- Default layout: `flex flex-wrap items-end gap-4 px-5 py-5`
- Override with `className` for grid layouts: `className="grid grid-cols-2 gap-5 px-5 py-5"`

**`DemoItem`** — wraps a single component instance with a label beneath it:
```tsx
<DemoItem label="primary" align="center">
  <MyComponent />
</DemoItem>
```
- `align`: `"center"` (default) or `"start"` — use `"start"` for block-level components like Card

**Adding a new section — checklist:**
1. Add `{ id: "my-component", label: "My Component" }` to the `NAV` array
2. Add `<Section id="my-component" title="..." description="...">` in the `<main>` block
3. Use `DemoRow` + `DemoItem` to show each prop variation

### Adding a new color to a component

Check contrast with the background it will appear on before adding. Refer to the approved colors table above.

### Focus rings

Use `focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2` for consistent keyboard focus styles across interactive components.
