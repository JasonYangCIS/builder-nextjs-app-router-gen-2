import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound } from "next/navigation";

const builderModelName = config.models.page;

/** Resolves a Builder data field that may be a plain string or a localized
 *  object like `{ Default: "/about", "@type": "..." }`. Mirrors the same
 *  pattern used in ResultsList.tsx. */
function resolveUrlField(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "Default" in value) {
    const def = (value as Record<string, unknown>).Default;
    if (typeof def === "string") return def;
  }
  return undefined;
}

const PAGE_FETCH_LIMIT = 100;

export async function generateStaticParams() {
  const allPages: Awaited<ReturnType<typeof fetchEntries>> = [];
  let offset = 0;

  try {
    while (true) {
      const batch = await fetchEntries({
        model: builderModelName,
        apiKey: config.envs.builderApiKey,
        limit: PAGE_FETCH_LIMIT,
        offset,
        fields: "data.url",
      });

      if (!batch || batch.length === 0) break;
      allPages.push(...batch);
      if (batch.length < PAGE_FETCH_LIMIT) break;
      offset += PAGE_FETCH_LIMIT;
    }
  } catch {
    // If the Builder API is unavailable at build time, skip static generation
    // and fall back to on-demand rendering for all catch-all routes.
    return [];
  }

  const pagePaths = allPages
    .map((entry) => resolveUrlField((entry.data as { url?: unknown })?.url))
    .filter((url): url is string => typeof url === "string" && url !== "/")
    .map((url) => url.replace(/^\//, "").split("/").filter(Boolean))
    .filter((segments) => segments.length > 0);

  return SUPPORTED_LOCALE_CODES.flatMap((locale) =>
    pagePaths.map((page) => ({ locale, page }))
  );
}

export default async function Page(props: {
  params: Promise<{
    locale: string;
    page: string[];
  }>;
}) {
  const { locale, page } = await props.params;

  const urlPath = "/" + (page?.join("/") || "");

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
