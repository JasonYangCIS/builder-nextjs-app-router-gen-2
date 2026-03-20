import { fetchOneEntry, getBuilderSearchParams, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { getLocaleFromHeaders } from "@/utils/locale-server";
import { notFound } from "next/navigation";

const builderModelName = config.models.page;

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [searchParams, locale] = await Promise.all([
    props.searchParams,
    getLocaleFromHeaders(),
  ]);

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    options: getBuilderSearchParams(searchParams as unknown as URLSearchParams),
    userAttributes: { urlPath: "/" },
    locale,
  });

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return <RenderBuilderContent content={content} model={builderModelName} locale={locale} />;
}
