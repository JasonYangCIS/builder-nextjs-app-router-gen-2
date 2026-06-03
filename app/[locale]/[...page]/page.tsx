import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { TargetedBuilderContent } from "@/components/builder/TargetedBuilderContent";
import { BuilderContentSkeleton } from "@/components/builder/BuilderContentSkeleton";
import { config } from "@/config";
import { notFound } from "next/navigation";

const builderModelName = config.models.page;

// Static/ISR with client-side targeting: the server fetches the DEFAULT entry
// (no cookie read → no force-dynamic). TargetedBuilderContent re-fetches the
// targeted entry on the client only when targeting attributes are present.
export const revalidate = 5;

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

  return (
    <TargetedBuilderContent
      initialContent={content}
      model={builderModelName}
      urlPath={urlPath}
      locale={locale}
      fallback={<BuilderContentSkeleton />}
    />
  );
}
