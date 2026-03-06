import { fetchOneEntry } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder";
import { config } from "@/config";

export default async function Page(props: {
  params: Promise<{
    page: string[];
  }>;
}) {
  const builderModelName = "page";

  // Use the page path specified in the URL to fetch the content
  const urlPath = "/" + ((await props?.params)?.page?.join("/") || "");

  const content = await fetchOneEntry({
    // Get the page content from Builder with the specified options
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { urlPath },
  });

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} model={builderModelName} />
    </>
  );
}
