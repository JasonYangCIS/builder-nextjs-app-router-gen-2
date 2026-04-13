import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound } from "next/navigation";

const builderModelName = config.models.page;

export async function generateStaticParams() {
  let pages;
  try {
    pages = await fetchEntries({
      model: builderModelName,
      apiKey: config.envs.builderApiKey,
      limit: 100,
      fields: "data.url",
    });
  } catch {
    // If the Builder API is unavailable at build time, skip static generation
    // and fall back to on-demand rendering for all catch-all routes.
    return [];
  }

  const pagePaths = (pages ?? [])
    .map((entry) => (entry.data as { url?: string })?.url)
    .filter((url): url is string => !!url && url !== "/")
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
