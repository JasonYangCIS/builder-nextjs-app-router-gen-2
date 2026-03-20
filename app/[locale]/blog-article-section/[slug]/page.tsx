/**
 * Blog article detail — Gen 2 version of Builder blog patterns.
 * See docs/BUILDER_BLOG_PATTERNS_GEN2.md for Data vs Section vs Hybrid.
 *
 * This page supports both:
 * - Data model: use content.data (e.g. data.content) for a fixed template (BlogArticleBody).
 * - Section model: use only hero/header from data; the rest is drag-and-drop via <Content />.
 */
import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { DEFAULT_LOCALE, SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound, redirect } from "next/navigation";
import { BlogArticleHeader } from "@/components/blog/BlogArticleHeader/BlogArticleHeader";
import { BlogArticleHero } from "@/components/blog/BlogArticleHero/BlogArticleHero";
import type { BlogArticle, BlogArticleWithContent } from "@/types/blog.types";

const builderModelName = config.models.blogArticleSection;

export async function generateStaticParams() {
  const articles = await fetchEntries({
    model: builderModelName,
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
    model: builderModelName,
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
  // Redirect canonical default-locale URL — /blog-article-section/{slug}
  if (locale === DEFAULT_LOCALE) redirect(`/blog-article-section/${slug}`);

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { locale },
    query: { "data.slug": slug },
    locale,
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

        <hr className="my-10 border-zinc-200" />

        <RenderBuilderContent content={content} model={builderModelName} locale={locale} />
      </div>
    </>
  );
}
