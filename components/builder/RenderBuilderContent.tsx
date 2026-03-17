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

/**
 * Recursively sanitizes Builder content data to fix hydration errors:
 * 1. Renames `class` attribute to `className`
 * 2. Changes `<p>` tags that contain blocks into `<div>` tags to prevent <div> inside <p>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeBuilderBlocks(blocks: any[]): void {
  if (!Array.isArray(blocks)) return;

  for (const block of blocks) {
    // 1. Fix 'class' vs 'className'
    if (block.properties && block.properties.class) {
      if (!block.properties.className) {
        block.properties.className = block.properties.class;
      } else {
        block.properties.className = `${block.properties.className} ${block.properties.class}`;
      }
      delete block.properties.class;
    }

    // 2. Fix invalid HTML nesting (<div> inside <p>)
    // If a block is configured to render as a <p>, but it has children or is a Text block
    // (which renders an internal div), change it to a div.
    if (block.tagName === "p") {
      const hasChildren = block.children && block.children.length > 0;
      const isTextComponent = block.component && block.component.name === "Text";

      if (hasChildren || isTextComponent) {
        block.tagName = "div";
      }
    }

    // Recurse into children
    if (block.children) {
      sanitizeBuilderBlocks(block.children);
    }
  }
}

function getSanitizedContent(content: BuilderContent | null): BuilderContent | null {
  if (!content || !content.data || !content.data.blocks) return content;

  try {
    // Deep clone to avoid mutating the original prop
    const cloned = JSON.parse(JSON.stringify(content));
    sanitizeBuilderBlocks(cloned.data.blocks);
    return cloned;
  } catch (e) {
    console.error("Error sanitizing Builder content", e);
    return content;
  }
}

/**
 * Wrapper for Builder.io Content component with hydration error fix.
 */
export function RenderBuilderContent({ content, model, data }: RenderBuilderContentProps) {
  if (!content && !isPreviewing()) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // Pre-process content data before passing to Builder SDK
  // This completely eliminates server/client hydration mismatches
  const sanitizedContent = getSanitizedContent(content);

  return (
    <Content
      content={sanitizedContent}
      apiKey={config.envs.builderApiKey}
      model={model}
      customComponents={CUSTOM_COMPONENTS}
      {...(data && { data })}
    />
  );
}
