import { fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound } from "next/navigation";

const builderModelName = config.models.page;

export function generateStaticParams() {
  return SUPPORTED_LOCALE_CODES.map((locale) => ({ locale }));
}

export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

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
