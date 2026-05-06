import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { notFound } from "next/navigation";
import { getTargetingAttributes } from "@/utils/targeting.server";

const builderModelName = config.models.page;

export const dynamic = "force-dynamic";

export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const targeting = await getTargetingAttributes();

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { urlPath: "/", locale, ...targeting },
    locale,
  });

  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return <RenderBuilderContent content={content} model={builderModelName} locale={locale} />;
}
