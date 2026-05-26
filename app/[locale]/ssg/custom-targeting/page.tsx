import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { notFound } from "next/navigation";

// SSG demo: no server-side targeting read. Builder returns content with all
// Personalization Container variants embedded; the SDK swaps to the matching
// variant client-side via setClientUserAttributes (see TargetingDemoControls).
//
// Pros:
// - Fastest TTFB / FCP — full HTML served from edge cache, zero origin work
// - Cheapest to host: no per-request compute
// - Same speed for every user regardless of targeting
// - LCP measured on the static shell is optimal
//
// Cons:
// - Flash of default variant on first paint, then swap once SDK hydrates
// - LCP can shift if the personalized element is the LCP candidate
// - CLS risk if variants differ in height
// - Crawlers/SEO see only the default variant
// - All variants ship in the JSON payload (larger response)
// - Editor changes require a rebuild or on-demand revalidation
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

  return <RenderBuilderContent content={content} model={builderModelName} locale={locale} />;
}
