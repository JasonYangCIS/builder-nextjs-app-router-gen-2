import { Suspense } from "react";
import { TargetedContent } from "./TargetedContent";

// PPR-style demo: the targeted Builder fetch is isolated behind a Suspense
// boundary. With Next.js 16 `cacheComponents: true` (not enabled in this repo
// — would require `'use cache'` on the locale layout to keep its fetches out
// of the dynamic boundary), the page outside this boundary becomes the static
// shell. Without the flag, this is "SSR with streaming via Suspense" — the
// boundary still streams independently of the rest of the page.
//
// Pros (true PPR with cacheComponents enabled):
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
