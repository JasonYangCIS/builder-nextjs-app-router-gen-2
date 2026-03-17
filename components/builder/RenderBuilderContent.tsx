"use client";
import { BuilderContent, isPreviewing, Content } from "@builder.io/sdk-react";
import DefaultErrorPage from "next/error";
import { config } from "@/config";
import { CUSTOM_COMPONENTS } from "@/builder-registry";
import { useEffect, useState } from "react";

interface RenderBuilderContentProps {
  content: BuilderContent | null;
  model: string;
  /** Optional data to inject (e.g. for Hybrid pattern: data={{ article: articleContent }}) */
  data?: Record<string, unknown>;
}

/**
 * Wrapper for Builder.io Content component with hydration error fix.
 *
 * Builder SDK v5.2.0 has known hydration issues:
 * 1. Renders 'class' attribute instead of 'className'
 * 2. Server/client className values differ (missing builder-* classes on server)
 * 3. Nests <div> inside <p> in Text blocks
 *
 * This component uses a client-side key to force re-render after hydration.
 */
export function RenderBuilderContent({ content, model, data }: RenderBuilderContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!content && !isPreviewing()) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <Content
      key={isClient ? "client" : "server"}
      content={content}
      apiKey={config.envs.builderApiKey}
      model={model}
      customComponents={CUSTOM_COMPONENTS}
      {...(data && { data })}
    />
  );
}
