/**
 * Blog hybrid detail — Data bindings and templates within the Section model.
 */
import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound } from "next/navigation";
import type { BlogArticle } from "@/types/blog.types";
import { getTargetingAttributes } from "@/utils/targeting.server";
import { getEntryBySlug } from "@/utils/builderCache.server";
import { Suspense } from "react";

export async function generateStaticParams() {
  const articles = await fetchEntries({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    limit: 100,
  });

  const slugs = (articles ?? [])
    .map((article) => (article.data as BlogArticle)?.slug)
    .filter(Boolean) as string[];

  return SUPPORTED_LOCALE_CODES.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getEntryBySlug(config.models.blogArticle, slug, locale);

  return {
    title: (article?.data as BlogArticle)?.title ?? "Blog Article",
    description: (article?.data as BlogArticle)?.blurb ?? "",
  };
}

async function ArticleContent({ locale, slug }: { locale: string; slug: string }) {
  const targeting = await getTargetingAttributes();

  // Fetch article first
  const articleData = await fetchOneEntry({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    userAttributes: { locale, ...targeting },
    query: { "data.slug": slug },
    locale,
  });

  // Now use the article's category to fetch the matching template
  const articleTemplate = await fetchOneEntry({
    model: config.models.blogArticleTemplate,
    apiKey: config.envs.builderApiKey,
    userAttributes: {
      category: articleData?.data?.category,
      locale,
      ...targeting,
    },
    locale,
  });

  if (!articleData && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  return (
    <RenderBuilderContent content={articleTemplate} model={config.models.blogArticleTemplate} data={{ article: articleData }} locale={locale} />
  );
}

// The not-found check runs on the cached DEFAULT entry, outside <Suspense>, so a
// missing slug returns a real HTTP 404. The cookie-dependent (targeted) render
// streams inside the boundary.
export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  const base = await getEntryBySlug(config.models.blogArticle, slug, locale);
  if (!base && !isEditing() && !isPreviewing()) notFound();

  return (
    <Suspense fallback={null}>
      <ArticleContent locale={locale} slug={slug} />
    </Suspense>
  );
}
