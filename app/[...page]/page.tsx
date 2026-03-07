import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder";
import { config } from "@/config";

const builderModelName = config.models.page;

export default async function Page(props: {
  params: Promise<{
    page: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  // Use the page path specified in the URL to fetch the content
  const urlPath = "/" + ((await props?.params)?.page?.join("/") || "");
  const searchParams = await props.searchParams;

  const content = await fetchOneEntry({
    // Get the page content from Builder with the specified options
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    options: getBuilderSearchParams(searchParams as unknown as URLSearchParams),
    userAttributes: { urlPath },
  });

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} model={builderModelName} />
    </>
  );
}
