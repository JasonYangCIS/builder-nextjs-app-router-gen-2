import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { notFound } from "next/navigation";
import { getTargetingAttributes } from "@/utils/targeting.server";

// SSR demo: full per-request render with server-side targeting. Cookie is read
// on the server and passed to fetchOneEntry so Builder returns the matching
// variant in the initial HTML.
//
// Pros:
// - No flash — personalized variant is in the first paint
// - LCP measures the personalized element accurately, no swap
// - Editor changes appear on the next request (no rebuild, no revalidation)
// - Server has authoritative access to session-only signals (auth, geo, etc.)
// - Crawlers see the same variant as the visitor (if you choose to send one)
//
// Cons:
// - Slowest TTFB — every request blocks on the Builder fetch + targeting read
// - No edge cacheability — every request hits origin
// - Highest hosting cost: per-request compute on every page view
// - Same penalty for users with no targeting cookie (they pay anyway)
// - Cookie read forces the whole route dynamic — no static optimization possible
const builderModelName = config.models.page;
const urlPath = "/custom-targeting";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const targeting = await getTargetingAttributes();

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { urlPath, locale, ...targeting },
    locale,
  });

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return <RenderBuilderContent content={content} model={builderModelName} locale={locale} />;
}
