# P1: Lazy-load components in builder-registry

## Problem
`builder-registry.ts` is `"use client"` and statically imports every custom component (Counter, HeroSplit, HeroFullBleed, HeroCentered, CloudinaryImage, AnnouncementBar, AlgoliaSearch, BuilderCarousel, etc.). All component code is pulled into the initial bundle even for pages that don't use them.

## Files to change
- `builder-registry.ts`

## Fix
Use `React.lazy()` for component references in the registry:
```tsx
import { lazy } from "react";

const Counter = lazy(() => import("./components/Counter/Counter"));
const BuilderCarousel = lazy(() => import("./components/BuilderCarousel/BuilderCarousel").then(m => ({ default: m.BuilderCarousel })));
// ... repeat for other components
```

Keep `.builder.ts` config imports static (they're just metadata objects, not heavy).

## Expected impact
Reduce shared Builder SDK chunks (~188 KB) by only loading component code when Builder actually renders that component on the page.

## Notes
- Test in Builder visual editor to confirm lazy components still register correctly.
- Some components (Button, Badge, Text) are tiny and may not benefit — focus on heavy ones (Carousel, CloudinaryImage, AlgoliaSearch, Hero variants).
