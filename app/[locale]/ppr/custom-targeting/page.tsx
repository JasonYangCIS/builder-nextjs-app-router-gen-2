import { Suspense } from "react";
import { TargetedContent } from "./TargetedContent";

// NOTE: despite the name, this route is NOT real Partial Prerendering. It is
// effectively SSR with streaming: `cacheComponents` is not enabled in this repo,
// so the page is rendered per request and the Suspense boundary only lets the
// targeted Builder fetch stream independently of the rest of the page. There is
// no prerendered static shell served from the edge.
//
// We tried enabling `cacheComponents: true` (PRs #32/#34, since reverted). It made
// the shell static, but Builder content inside the Suspense boundary was flushed
// out of order in the static HTML: visitors saw a skeleton first, and the real
// content only appeared once an inline script swapped it in (and stayed hidden
// without JS). It also required `'use cache'` on shared layouts and removing every
// `revalidate` / `force-dynamic` route config. See `/cache-components` for the
// general trade-offs.
//
// What real PPR would add (only with `cacheComponents: true`):
// - The page outside this boundary becomes the static shell, served from the edge
//
// Pros (if cacheComponents were enabled):
// - Static shell (header, footer, layout chrome) served instantly from edge
// - No flash — personalized content arrives via stream before paint completes
// - Targeted users still get authoritative server-side variant selection
// - Faster FCP than SSR; closer to SSG for the cacheable portion
// - Best fit when shell is expensive but personalization must stay server-side
//
// Cons:
// - Boundary still hits origin per request — only the shell is edge-cached
// - LCP unchanged if the LCP element lives inside the boundary (Builder content)
// - Untargeted users still pay the dynamic fetch cost (route can't branch on cookie absence)
// - Architectural overhead: extra component file, fallback design, Suspense plumbing
// - In Next.js 16, requires `cacheComponents: true` globally + `'use cache'` on shared layouts
//   (touching shared infra is a regression risk for existing dynamic routes)
// - Still experimental-leaning: behavior around 404s from inside the boundary is subtle
export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <Suspense fallback={null}>
      <TargetedContent locale={locale} />
    </Suspense>
  );
}
