import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder";
import { config } from "@/config";
import { notFound } from "next/navigation";
import type { BlogArticle, BlogArticleWithContent } from "@/types/blog.types";
import { BlogArticleBody } from "@/app/components/BlogArticleBody/BlogArticleBody";
import { BlogArticleHeader } from "@/app/components/BlogArticleHeader/BlogArticleHeader";
import { BlogArticleHero } from "@/app/components/BlogArticleHero/BlogArticleHero";

const builderModelName = config.models.blogArticle;

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
}) {
  const { slug } = await props.params;

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    query: { "data.slug": slug },
  });

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

        {data?.content && <BlogArticleBody htmlContent={data.content} />}

        <RenderBuilderContent content={content} model={builderModelName} />
      </div>
    </>
  );
}
