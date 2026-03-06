/**
 * Blog article detail — Gen 2 version of Builder blog patterns.
 * See docs/BUILDER_BLOG_PATTERNS_GEN2.md for Data vs Section vs Hybrid.
 *
 * This page supports both:
 * - Data model: use content.data (e.g. data.content) for a fixed template (BlogArticleBody).
 * - Section model: use only hero/header from data; the rest is drag-and-drop via <Content />.
 */
import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { getBuilderSearchParams } from '@builder.io/sdk-react/edge';
import { RenderBuilderContent } from "@/components/builder";
import { config } from "@/config";
import { notFound } from "next/navigation";
import { BlogArticleHeader } from "@/components/BlogArticleHeader/BlogArticleHeader";
import { BlogArticleHero } from "@/components/BlogArticleHero/BlogArticleHero";
import type { BlogArticle, BlogArticleWithContent } from "@/types/blog.types";

const builderModelName = config.models.blogArticleSection;

export async function generateStaticParams() {
  const articles = await fetchEntries({
    model: builderModelName,
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
    model: builderModelName,
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
  const searchParams = await props.searchParams;

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    options: getBuilderSearchParams(searchParams as unknown as URLSearchParams),
    query: { "data.slug": slug },
  });

  // Allow rendering with no content when in Builder (admin/visual editor or draft URL e.g. __builder_editing__)
  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  const data = content?.data as BlogArticleWithContent | undefined;

  return (
    <>
      {data?.image && (
        <BlogArticleHero image={data.image} alt={data.title} />
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        <BlogArticleHeader
          title={data?.title}
          blurb={data?.blurb}
          date={data?.date}
        />

        <hr className="my-10 border-gray-200" />

        <RenderBuilderContent content={content} model={builderModelName} />
      </div>
    </>
  );
}
