# Design System Skills

Conventions for working with the shadcn/ui design system in this repo.

---

## Architecture

| Layer | Location | Purpose |
|-------|----------|---------|
| CSS variables | `app/globals.css` | shadcn OKLCH color tokens + theme overrides (default/dark) |
| Gradient utilities | `styles/tokens.css` | `gradient-brand`, `gradient-brand-subtle`, etc. — use `var(--primary)` / `var(--accent)` |
| shadcn primitives | `components/ui/` | Button, Badge, Input, Label, Card, Carousel, Text, FormInput |
| Builder wrappers | `components/builder/` | BuilderCarousel — wraps shadcn Carousel for Builder.io editor |
| Other components | `components/Counter/Counter.tsx` | Stateful counter using shadcn Button |
| Showcase | `app/design-system/page.tsx` | Visual reference at `/design-system`; also Playwright test harness |

---

## Color System

shadcn/ui uses OKLCH CSS variables. All tokens are defined in `app/globals.css` and exposed to Tailwind via `@theme inline`.

### Semantic tokens (always prefer these over raw colors)

| CSS variable | Tailwind utility | Use |
|---|---|---|
| `--background` | `bg-background` | Page background |
| `--foreground` | `text-foreground` | Primary text |
| `--card` | `bg-card` | Card/surface background |
| `--card-foreground` | `text-card-foreground` | Text on cards |
| `--primary` | `bg-primary` / `text-primary` | Primary actions, CTAs, links |
| `--primary-foreground` | `text-primary-foreground` | Text on primary backgrounds |
| `--secondary` | `bg-secondary` | Secondary surfaces |
| `--secondary-foreground` | `text-secondary-foreground` | Text on secondary |
| `--muted` | `bg-muted` | Subtle backgrounds |
| `--muted-foreground` | `text-muted-foreground` | De-emphasised text |
| `--accent` | `bg-accent` | Hover/highlight surfaces |
| `--accent-foreground` | `text-accent-foreground` | Text on accent |
| `--destructive` | `bg-destructive` / `text-destructive` | Error/danger states |
| `--border` | `border-border` | Default border color |
| `--input` | `border-input` | Form input borders |
| `--ring` | `ring-ring` | Focus rings |

### Themes

Two themes are defined in `app/globals.css` via `[data-theme]` attribute selectors:
- `default` (light, zinc-based)
- `dark`

Gradient utilities in `styles/tokens.css` automatically adapt to the active theme via `var(--primary)` and `var(--accent)`.

### WCAG 2.1 AA — semantic token guidance

| Token | On `--background` | Notes |
|-------|-------------------|-------|
| `text-foreground` | ✅ High contrast | Default body text |
| `text-muted-foreground` | ✅ Passes AA | De-emphasised text |
| `text-primary` | ✅ Passes AA | Theme-adaptive primary |
| `text-destructive` | ✅ Passes AA | Error state |

**Do NOT hardcode hex colors or zinc/slate shades for text.** Always use semantic tokens so contrast is maintained across all three themes.

**Focus rings:** shadcn components use `focus-visible:ring-[3px] focus-visible:ring-ring/50` — use the same pattern on any custom interactive element.

---

## Gradient Utilities

Defined in `styles/tokens.css`. Apply as `className` values:

| Class | Use |
|-------|-----|
| `gradient-brand` | Background: primary → accent blend. CTAs, active states |
| `gradient-brand-subtle` | Light wash. Section backgrounds, card tints |
| `gradient-brand-dark` | Dark tone. Hero sections, banners |
| `gradient-mesh` | Multi-stop radial. Hero backgrounds |
| `gradient-brand-text` | CSS gradient text. Headings, display type |

---

## Components

### Imports

```ts
// shadcn UI primitives
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Wrappers (composed from shadcn primitives)
import { Text } from "@/components/ui/text"
import { FormInput } from "@/components/ui/form-input"

// Builder.io wrapper (only in builder-registry.ts and Builder pages)
import { BuilderCarousel } from "@/components/builder/BuilderCarousel"
```

---

### Button

shadcn Button. Children are the button label — no `label` prop.

```tsx
<Button>Save</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" disabled>Disabled</Button>
<Button asChild><Link href="/page">Navigate</Link></Button>
```

**Variants:** `default` · `destructive` · `outline` · `secondary` · `ghost` · `link`

**Sizes:** `default` · `sm` · `lg` · `icon`

**Migration from old DS:**
- `primary` → `default`
- `secondary` → `outline`
- `ghost` → `ghost`
- `destructive` → `destructive`
- `label="..."` → use children instead

---

### Badge

shadcn Badge. Children are the badge content.

```tsx
<Badge>Published</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Archived</Badge>
```

**Variants:** `default` · `secondary` · `destructive` · `outline`

**Migration from old DS:**
- `neutral` → `secondary`
- `primary` → `default`
- `success/warning` → `secondary` (or use `className` for custom color)
- `error` → `destructive`
- `label="..."` → use children instead

---

### Text (Typography replacement)

Thin wrapper using shadcn design tokens. Identical variant/color API to the old `Typography` component.

```tsx
<Text variant="h1">Page Title</Text>
<Text variant="body-lg" color="muted">Supporting copy</Text>
<Text variant="body-sm" color="error">Validation message</Text>
<Text variant="h2" as="h3">Semantic override</Text>
<Text variant="overline" text="Section label" />
```

**Variants:** `display` · `h1`–`h6` · `body-lg` · `body` · `body-sm` · `caption` · `label` · `overline`

**Colors:** `default` · `muted` · `subtle` · `primary` · `success` · `warning` · `error`

Each variant defaults to its semantic HTML element (`h1` renders `<h1>`, `body` renders `<p>`, etc.). Override with `as`.

---

### FormInput (labeled Input)

Composes shadcn Input + Label + helper/error text. Use this wherever you need a labeled form field.

```tsx
<FormInput label="Email" placeholder="you@example.com" />
<FormInput label="Password" type="password" helperText="Min 8 characters" />
<FormInput label="Email" errorText="Invalid email address" />
<FormInput label="Name" required />
<FormInput label="Username" defaultValue="jsmith" disabled />
```

For bare input without a label, use `<Input>` directly from `@/components/ui/input`.

---

### Card

shadcn Card uses composition. Mix and match sub-components as needed.

```tsx
// Full composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Supporting description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Body content here.</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>

// Minimal — just override padding via className
<Card className="p-4 gap-2">
  <p className="text-sm font-medium">Simple card</p>
</Card>
```

**Migration from old DS:** The old `padding` and `shadow` props are replaced by `className`. Use Tailwind utilities like `shadow-md`, `p-6`, `gap-0` directly.

---

### Carousel

shadcn Carousel powered by Embla. Use the composition API for custom layouts, or `BuilderCarousel` for Builder.io pages.

```tsx
// Standard usage
<Carousel opts={{ align: "start", loop: true }}>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>

// Multiple slides per view — use basis classes on CarouselItem
<CarouselItem className="md:basis-1/2 lg:basis-1/3">
```

**Key Embla options** (passed to `opts`):
- `loop: boolean` — continuous looping
- `align: "start" | "center" | "end"` — slide alignment
- `axis: "x" | "y"` — use `orientation` prop on Carousel instead

**Autoplay** — use `embla-carousel-autoplay` plugin:
```tsx
import Autoplay from "embla-carousel-autoplay"
<Carousel plugins={[Autoplay({ delay: 3000 })]}>
```

**Migration from old DS (Swiper):** Swiper-specific effects (`cube`, `flip`, `coverflow`, `fade`) are not available in Embla. Use orientation, loop, and alignment instead.

---

## Adding a New shadcn Component

If you need a shadcn component that isn't in `components/ui/` yet:

1. Copy the component source from [ui.shadcn.com](https://ui.shadcn.com/docs/components) (new-york style)
2. Place it in `components/ui/my-component.tsx`
3. Import `cn` from `@/utils/cn` (already uses clsx + tailwind-merge)
4. If it needs Radix UI, install the package first: `npm install @radix-ui/react-<name>`
5. Register in `builder-registry.ts` if it will be used in the Builder visual editor
6. Add a section to `app/design-system/page.tsx` using `Section` + `DemoRow` + `DemoItem`

**Do NOT** redefine types that the library already exports — import and re-export them:

```ts
// ❌ BAD
export type MyVariant = "default" | "destructive"

// ✅ GOOD — re-export from the library
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"
export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
```

---

## Showcase Page (`app/design-system/page.tsx`)

This page is both the visual reference and the Playwright test harness. Section `id` attributes are used by tests.

**Layout helpers (local to the file):**

```tsx
// Named section with border/card container
<Section id="my-component" title="My Component" description="Optional subtitle.">
  {/* DemoRows */}
</Section>

// Horizontal row with optional monospace label
<DemoRow label="variant">
  <DemoItem label="default"><Button>Default</Button></DemoItem>
  <DemoItem label="outline"><Button variant="outline">Outline</Button></DemoItem>
</DemoRow>

// Grid layout override
<DemoRow label="default" className="grid grid-cols-2 gap-5 px-5 py-5">
  <FormInput label="Email" />
  <FormInput label="Name" />
</DemoRow>
```

**Adding a new section:**
1. Add `{ id: "my-component", label: "My Component" }` to the `NAV` array
2. Add `<Section id="my-component" ...>` in `<main>`
3. Use `DemoRow` + `DemoItem` to show each prop variation
4. Add a corresponding test in `tests/design-system/my-component.spec.ts`
