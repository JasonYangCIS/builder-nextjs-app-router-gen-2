import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { TargetedBuilderContent } from "@/components/builder/TargetedBuilderContent";
import { BuilderContentSkeleton } from "@/components/builder/BuilderContentSkeleton";
import { config } from "@/config";
import { notFound } from "next/navigation";

// SSG demo: the server fetches the DEFAULT entry with no targeting, so the route
// is statically generated (no force-dynamic). TargetedBuilderContent then does
// client-side targeting: when targeting attributes are present it re-fetches the
// matching entry in the browser and swaps it in. This works for ENTRY-LEVEL
// targeting (separate entries per audience), unlike setClientUserAttributes,
// which only re-filters Personalization Container variants already in the
// payload.
//
// Pros:
// - Fastest TTFB / FCP — default HTML served from edge cache, zero origin work
// - Cheapest to host: no per-request compute
// - Untargeted users pay nothing: no extra fetch, no flash, default is SEO baseline
// - Works for entry-level targeting without force-dynamic
//
// Cons:
// - Targeted users see a default→targeted swap (one client fetch after hydration)
// - LCP can shift / CLS risk if the targeted entry differs from the default
// - Crawlers/SEO see only the default entry
// - Editor changes require a rebuild or on-demand revalidation
//
// This route uses the "cookie" TargetingSource (transparent: inspect the
// `builder-targeting` cookie in DevTools) to contrast with the production routes,
// which use the "session" source. Same wrapper, swapped source — that's the lesson.
const builderModelName = config.models.page;
const urlPath = "/custom-targeting";

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { urlPath, locale },
    locale,
  });

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return (
    <TargetedBuilderContent
      initialContent={content}
      model={builderModelName}
      urlPath={urlPath}
      locale={locale}
      sourceKey="cookie"
      fallback={<BuilderContentSkeleton />}
    />
  );
}
