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
  /** Active locale code (e.g. "es-ES") — forwarded to Builder for localized content */
  locale?: string;
}

export function RenderBuilderContent({ content, model, data, locale }: RenderBuilderContentProps) {
  if (content || isPreviewing()) {
    return (
      <Content
        content={content}
        apiKey={config.envs.builderApiKey}
        model={model}
        customComponents={CUSTOM_COMPONENTS}
        locale={locale}
        {...(data && { data })}
      />
    );
  }
  return <DefaultErrorPage statusCode={404} />;
}
