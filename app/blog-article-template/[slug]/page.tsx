/**
 * Blog hybrid detail — Gen 2 version of Builder blog patterns.
 * See docs/BUILDER_BLOG_PATTERNS_GEN2.md for Data vs Section vs Hybrid.
 *
 * This page supports both:
 * - Hybrid model: use content.data (e.g. data.content) for a fixed template (BlogArticleBody).
 * - Data model: use only hero/header from data; the rest is drag-and-drop via <Content />.
 */
import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { notFound } from "next/navigation";
import type { BlogArticle } from "@/types/blog.types";

export async function generateStaticParams() {
  const articles = await fetchEntries({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    limit: 100,
  });

  return (articles ?? [])
    .map((article) => ({
      slug: (article.data as BlogArticle)?.slug ?? "",
    }))
    .filter((p) => p.slug) as { slug: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchOneEntry({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    query: { "data.slug": slug },
  });

  return {
    title: (article?.data as BlogArticle)?.title ?? "Blog Article",
    description: (article?.data as BlogArticle)?.blurb ?? "",
  };
}

export const revalidate = 5;

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await props.params;

  // Fetch article first
  const articleData = await fetchOneEntry({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    query: { 'data.slug': slug },
  });

  // Now use the article's category to fetch the matching template
  const articleTemplate = await fetchOneEntry({
    model: config.models.blogArticleTemplate,
    apiKey: config.envs.builderApiKey,
    userAttributes: {
      category: articleData?.data?.category,
    },
  });

  if (!articleData && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return (
    <RenderBuilderContent content={articleTemplate} model={config.models.blogArticleTemplate} data={{ article: articleData }} />
  );
}
