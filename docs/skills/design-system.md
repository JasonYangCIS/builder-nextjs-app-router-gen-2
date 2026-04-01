# Design System Skills

Conventions for working with the shadcn/ui design system in this repo.

---

## Architecture

| Layer | Location | Purpose |
|-------|----------|---------|
| CSS variables | `app/globals.css` | shadcn OKLCH color tokens + theme overrides (default/dark) |
| Gradient utilities | `styles/tokens.css` | `gradient-brand`, `gradient-brand-subtle`, etc. — use `var(--primary)` / `var(--accent)` |
| shadcn primitives | `components/ui/` | Button, Badge, Input, Label, Card, Carousel, Text, FormInput — flat files, one per component |
| Feature components | `components/[Name]/` | Four-file folder pattern (`.tsx` / `.types.ts` / `.module.scss` / `.builder.ts`) — see `HeroSplit/` |
| Builder wrappers | `components/builder/` | BuilderCarousel — wraps shadcn Carousel for Builder.io editor |
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

**Do NOT hardcode hex colors or zinc/slate shades for text.** Always use semantic tokens so contrast is maintained across all themes.

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
import { Button } from "@/components/ui/Button/Button"
import { Badge } from "@/components/ui/Badge/Badge"
import { Input } from "@/components/ui/Input/Input"
import { Label } from "@/components/ui/Label/Label"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/Card/Card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel/Carousel"

// Wrappers (composed from shadcn primitives)
import { Text } from "@/components/ui/Text/Text"
import { FormInput } from "@/components/ui/FormInput/FormInput"

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

For bare input without a label, use `<Input>` directly from `@/components/ui/Input/Input`.

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

## Feature Components

These components combine shadcn primitives with project-specific logic. They follow the four-file folder pattern (see `.builder/rules/component-structure.mdc`).

### BuilderCarousel

Wraps shadcn Carousel (Embla) for use in the Builder.io visual editor. Handles Builder's child-wrapping behavior and exposes flat props instead of the composition API.

```ts
import { BuilderCarousel } from "@/components/builder/BuilderCarousel"
```

```tsx
<BuilderCarousel loop autoplay autoplayDelay={3000} slidesPerView={3} navigation>
  <div>Slide 1</div>
  <div>Slide 2</div>
</BuilderCarousel>
```

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | |
| `loop` | `boolean` | `false` | |
| `autoplay` | `boolean` | `false` | Uses `embla-carousel-autoplay` plugin |
| `autoplayDelay` | `number` | `3000` | Milliseconds |
| `pauseOnHover` | `boolean` | `true` | |
| `navigation` | `boolean` | `true` | Prev/next buttons; hidden if only 1 slide |
| `align` | `"start" \| "center" \| "end"` | `"start"` | |
| `slidesPerView` | `number` | `1` | Max 4; generates `basis-1/N` class |
| `minHeight` | `number` | — | Inline style in px |

**When to use:** Builder.io pages where editors need a flat-prop carousel. For code-authored pages, prefer the shadcn `<Carousel>` composition API directly.

**Gotchas:**
- Unwraps nested children (Builder wraps slides in a single div)
- `slidesPerView > 4` falls back to `basis-full`
- `autoplay` with `stopOnInteraction: false` — carousel keeps rotating even after user clicks prev/next

---

### AnnouncementBar

Dismissible site-wide banner with optional countdown timer. Registered as a Builder section component.

```ts
import AnnouncementBar from "@/components/AnnouncementBar/AnnouncementBar"
```

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `message` | `string \| null` | — | Main announcement text |
| `ctaLabel` | `string \| null` | — | Button text |
| `ctaUrl` | `string \| null` | — | Sanitized: rejects `javascript:` and `//` URLs |
| `backgroundColor` | `string \| null` | — | Inline style override |
| `textColor` | `string \| null` | — | Inline style override |
| `countdownEnabled` | `boolean \| null` | `false` | Shows live countdown timer |
| `countdownTargetDate` | `string \| null` | — | ISO 8601 date string |
| `countdownLabel` | `string \| null` | — | Label before the countdown |
| `dismissKey` | `string \| null` | — | localStorage key; required for dismiss persistence |

**Key behavior:**
- Client component; dismiss state persists in `localStorage` via `dismissKey`
- Uses `useIsomorphicLayoutEffect` to prevent "flash of dismissed bar" without CLS
- Countdown updates every 1 second; adapts format (days vs HH:MM:SS)
- External CTA links get `rel="noopener noreferrer"` + `target="_blank"`

**Gotchas:**
- `dismissKey` is required for persistence; without it dismissal resets on reload
- Countdown is empty on initial SSR — starts after hydration

---

### LocaleSwitch

Dropdown locale switcher. Used in the Header; not Builder-registered.

```ts
import LocaleSwitch from "@/components/LocaleSwitch/LocaleSwitch"
```

| Prop | Type | Notes |
|------|------|-------|
| `locales` | `{ code: string; label: string }[]` | From `config.locales.supported` |

**Key behavior:**
- Derives active locale from `usePathname()` via `getLocaleFromPath()`
- On production routes: `router.push()` to locale-prefixed path
- On preview routes: updates `builder.options.locale` query param
- Accessible: `role="listbox"`, `aria-expanded`, keyboard close (Escape), click-outside close

---

### CloudinaryImage

Next.js Image wrapper for Cloudinary assets. Registered in Builder with `cloudinaryImageEditor` input type.

```ts
import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage"
```

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `cloudinaryOptions` | `CloudinaryImageData \| null` | — | `{ url, secure_url, width, height }` from Cloudinary plugin |
| `alt` | `string \| null` | — | Image alt text |
| `caption` | `string \| null` | — | Renders `<figcaption>` |
| `linkUrl` | `string \| null` | — | Wraps image in a link; sanitized via `sanitizeHref()` |
| `priority` | `boolean \| null` | `false` | LCP optimization — above-the-fold only |
| `objectFit` | `"cover" \| "contain" \| null` | `"cover"` | |
| `rounded` | `boolean \| null` | `false` | Applies `var(--radius)` |

**Key behavior:** Uses `secure_url` (https) over `url` (http). Renders `<figure>` + `<figcaption>`. Shows gradient placeholder if no image. `aria-hidden="true"` when both `alt` and `caption` are empty.

**Gotchas:** `next/image` logs 404 warnings if Cloudinary URL is unreachable, but the placeholder still renders.

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
import { buttonVariants } from "@/components/ui/Button/Button"
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
