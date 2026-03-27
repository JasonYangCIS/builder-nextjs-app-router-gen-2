# P0: Lazy-load Algolia in SearchButton

## Problem
`SearchButton` statically imports `AlgoliaSearch`, which statically imports `algoliasearch`. The entire Algolia client (104 KB) is bundled into the layout and loaded on every page, even though most users never open the search modal.

## Files to change
- `components/layout/Header/SearchButton.tsx`

## Fix
Replace the static import:
```tsx
import AlgoliaSearch from "@/components/Algolia/AlgoliaSearch/AlgoliaSearch";
```

With a dynamic import that loads only when the modal opens:
```tsx
import dynamic from "next/dynamic";

const AlgoliaSearch = dynamic(
  () => import("@/components/Algolia/AlgoliaSearch/AlgoliaSearch"),
  { ssr: false }
);
```

## Expected impact
-104 KB from initial JS payload on every page.
