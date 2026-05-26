import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { notFound } from "next/navigation";
import { getTargetingAttributes } from "@/utils/targeting.server";

const builderModelName = config.models.page;
const urlPath = "/custom-targeting";

export async function TargetedContent({ locale }: { locale: string }) {
  const targeting = await getTargetingAttributes();

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { urlPath, locale, ...targeting },
    locale,
  });

  if (!content && !isEditing() && !isPreviewing()) {
    notFound();
  }

  return <RenderBuilderContent content={content} model={builderModelName} locale={locale} />;
}
