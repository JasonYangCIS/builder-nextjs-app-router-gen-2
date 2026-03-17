"use client";
import { BuilderContent, isPreviewing, Content } from "@builder.io/sdk-react";
import DefaultErrorPage from "next/error";
import { config } from "@/config";
import { CUSTOM_COMPONENTS } from "@/builder-registry";

interface RenderBuilderContentProps {
  content: BuilderContent | null;
  model: string;
  /** Optional data to inject (e.g. for Hybrid pattern: data={{ article: articleContent }}) */
  data?: Record<string, unknown>;
}

export function RenderBuilderContent({ content, model, data }: RenderBuilderContentProps) {
  if (content || isPreviewing()) {
    return (
      /* Suppress hydration warnings caused by Builder SDK v5.2.0 bugs:
         1. SDK renders 'class' instead of 'className'
         2. SDK nests <div> inside <p> in Text blocks
         See app/globals.css for CSS workarounds */
      <div suppressHydrationWarning>
        <Content
          content={content}
          apiKey={config.envs.builderApiKey}
          model={model}
          customComponents={CUSTOM_COMPONENTS}
          {...(data && { data })}
        />
      </div>
    );
  }
  return <DefaultErrorPage statusCode={404} />;
}
