/**
 * Blog article detail — Section model.
 * First fold (hero, header) is fixed in code; the rest is drag-and-drop via Builder.
 */
import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { notFound } from "next/navigation";
import { BlogArticleHeader } from "@/components/blog/BlogArticleHeader/BlogArticleHeader";
import { BlogArticleHero } from "@/components/blog/BlogArticleHero/BlogArticleHero";
import type { BlogArticle, BlogArticleWithContent } from "@/types/blog.types";
import { getTargetingAttributes } from "@/utils/targeting.server";
import { getEntryBySlug } from "@/utils/builderCache.server";
import { Suspense } from "react";

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
  const article = await getEntryBySlug(builderModelName, slug, locale);

  return {
    title: (article?.data as BlogArticle)?.title ?? "Blog Article",
    description: (article?.data as BlogArticle)?.blurb ?? "",
  };
}

async function ArticleContent({ locale, slug }: { locale: string; slug: string }) {
  const targeting = await getTargetingAttributes();

  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { locale, ...targeting },
    query: { "data.slug": slug },
    locale,
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

        <hr className="my-10 border-zinc-200" />

        <RenderBuilderContent content={content} model={builderModelName} locale={locale} />
      </div>
    </>
  );
}

// The not-found check runs on the cached DEFAULT entry, outside <Suspense>, so a
// missing slug returns a real HTTP 404. The cookie-dependent (targeted) render
// streams inside the boundary.
export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  const base = await getEntryBySlug(builderModelName, slug, locale);
  if (!base && !isEditing() && !isPreviewing()) notFound();

  return (
    <Suspense fallback={null}>
      <ArticleContent locale={locale} slug={slug} />
    </Suspense>
  );
}
