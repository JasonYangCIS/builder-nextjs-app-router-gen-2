import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { getBuilderSearchParams } from "@builder.io/sdk-react/edge";
import { RenderBuilderContent } from "@/components/builder";
import { config } from "@/config";
import { notFound } from "next/navigation";

const builderModelName = config.models.headerNavMenu;

export const revalidate = 5;

export default async function HeaderNavMenuPreviewPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    options: getBuilderSearchParams(searchParams as unknown as URLSearchParams),
  });

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return <RenderBuilderContent content={content} model={builderModelName} />;
}
