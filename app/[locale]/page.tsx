import { isEditing, isPreviewing } from "@builder.io/sdk-react";
import { getPageEntry } from "@/utils/builderCache.server";
import { BuilderContentSkeleton } from "@/components/builder/BuilderContentSkeleton";
import { TargetedBuilderContent } from "@/components/builder/TargetedBuilderContent";
import { config } from "@/config";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const builderModelName = config.models.page;
const urlPath = "/";

// Static/ISR with client-side targeting: the server fetches the DEFAULT entry
// (no cookie read → no force-dynamic). TargetedBuilderContent re-fetches the
// targeted entry on the client only when targeting attributes are present.
// The default fetch is cached via getPageEntry (5s revalidate).

export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

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
      />
    </Suspense>
  );
}
