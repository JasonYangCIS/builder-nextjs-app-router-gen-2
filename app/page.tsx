import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { getLocaleFromHeaders } from "@/utils/locale-server";
import { notFound } from "next/navigation";

const builderModelName = config.models.page;

export default async function Home() {
  const locale = await getLocaleFromHeaders();

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { urlPath: "/", locale },
    locale,
  });

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return <RenderBuilderContent content={content} model={builderModelName} locale={locale} />;
}
