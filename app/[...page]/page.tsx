import { fetchOneEntry, getBuilderSearchParams, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { notFound } from "next/navigation";

const builderModelName = config.models.page;

export default async function Page(props: {
  params: Promise<{
    page: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const urlPath = "/" + ((await props?.params)?.page?.join("/") || "");
  const searchParams = await props.searchParams;

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    options: getBuilderSearchParams(searchParams as unknown as URLSearchParams),
    userAttributes: { urlPath },
  });

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return <RenderBuilderContent content={content} model={builderModelName} />;
}
