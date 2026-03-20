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
import { DEFAULT_LOCALE, SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound, redirect } from "next/navigation";
import type { BlogArticle } from "@/types/blog.types";

export async function generateStaticParams() {
  const articles = await fetchEntries({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    limit: 100,
  });

  const slugs = (articles ?? [])
    .map((article) => (article.data as BlogArticle)?.slug)
    .filter(Boolean) as string[];

  const nonDefaultLocales = SUPPORTED_LOCALE_CODES.filter(
    (c) => c !== DEFAULT_LOCALE
  );

  return nonDefaultLocales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await fetchOneEntry({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    query: { "data.slug": slug },
    locale,
  });

  return {
    title: (article?.data as BlogArticle)?.title ?? "Blog Article",
    description: (article?.data as BlogArticle)?.blurb ?? "",
  };
}

export const revalidate = 5;

export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;

  if (!SUPPORTED_LOCALE_CODES.includes(locale)) return notFound();
  // Redirect canonical default-locale URL — /blog-article-template/{slug}
  if (locale === DEFAULT_LOCALE) redirect(`/blog-article-template/${slug}`);

  // Fetch article first
  const articleData = await fetchOneEntry({
    model: config.models.blogArticle,
    apiKey: config.envs.builderApiKey,
    userAttributes: { locale },
    query: { 'data.slug': slug },
    locale,
  });

  // Now use the article's category to fetch the matching template
  const articleTemplate = await fetchOneEntry({
    model: config.models.blogArticleTemplate,
    apiKey: config.envs.builderApiKey,
    userAttributes: {
      category: articleData?.data?.category,
      locale,
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
