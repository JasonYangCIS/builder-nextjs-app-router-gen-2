import { fetchEntries, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { TargetedBuilderContent } from "@/components/builder/TargetedBuilderContent";
import { BuilderContentSkeleton } from "@/components/builder/BuilderContentSkeleton";
import { config } from "@/config";
import { getPageEntry } from "@/utils/builderCache.server";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const builderModelName = config.models.page;

// Static/ISR with client-side targeting: the server fetches the DEFAULT entry
// (no cookie read → no force-dynamic). TargetedBuilderContent re-fetches the
// targeted entry on the client only when targeting attributes are present.

const PAGE_SIZE = 100;

// Pre-render every Builder page URL at build time (default entries only).
// Unknown URLs still render on demand and are cached (dynamicParams defaults to
// true), so pages published after the build keep working.
export async function generateStaticParams() {
  const urls = new Set<string>();

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const entries = await fetchEntries({
      apiKey: config.envs.builderApiKey,
      model: builderModelName,
      limit: PAGE_SIZE,
      offset,
      fields: "id,data.url",
      options: { noTargeting: true },
    });

    for (const entry of entries ?? []) {
      // data.url can be a string or an array of strings
      const raw = entry.data?.url as string | string[] | undefined;
      const url = Array.isArray(raw) ? raw[0] : raw;
      // "/" is owned by app/[locale]/page.tsx
      if (url && url !== "/") urls.add(url);
    }

    if (!entries || entries.length < PAGE_SIZE) break;
  }

  return SUPPORTED_LOCALE_CODES.flatMap((locale) =>
    [...urls].map((url) => ({ locale, page: url.split("/").filter(Boolean) }))
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

  const content = await getPageEntry(urlPath, locale);

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return (
    <Suspense fallback={<BuilderContentSkeleton />}>
      <TargetedBuilderContent
        initialContent={content}
        model={builderModelName}
        urlPath={urlPath}
        locale={locale}
        fallback={<BuilderContentSkeleton />}
      />
    </Suspense>
  );
}
