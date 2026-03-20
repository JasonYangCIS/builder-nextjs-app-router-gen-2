/**
 * Dedicated Builder visual editor preview route.
 *
 * All Builder models point their Preview URL here (configured in Builder admin
 * → Model settings → Preview URL). This keeps every production route free of
 * searchParams / getBuilderSearchParams, allowing them to be statically
 * generated with ISR.
 *
 * Preview URL patterns to set in Builder admin:
 *
 *   page model:
 *     http://localhost:3000/preview?model=page&urlPath={entry.data.url}
 *
 *   blog-article:
 *     http://localhost:3000/preview?model=blog-article&slug={entry.data.slug}
 *
 *   blog-article-section:
 *     http://localhost:3000/preview?model=blog-article-section&slug={entry.data.slug}
 *
 *   blog-article-template:
 *     http://localhost:3000/preview?model=blog-article-template&slug={entry.data.slug}
 *
 * The optional ?locale=<code> param selects a locale; defaults to the default locale.
 *
 * Replace localhost:3000 with your production domain for deployed environments.
 */
import { fetchOneEntry, getBuilderSearchParams, isEditing, isPreviewing } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { config } from "@/config";
import { DEFAULT_LOCALE, SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { getLocaleFromHeaders } from "@/utils/locale-server";
import { notFound } from "next/navigation";
import { BlogArticleHeader } from "@/components/blog/BlogArticleHeader/BlogArticleHeader";
import { BlogArticleHero } from "@/components/blog/BlogArticleHero/BlogArticleHero";
import type { BlogArticle, BlogArticleWithContent } from "@/types/blog.types";

// Always dynamic — only accessed from the Builder editor iframe.
export const dynamic = "force-dynamic";

export default async function PreviewPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const model = typeof searchParams.model === "string" ? searchParams.model : "";
  const slug = typeof searchParams.slug === "string" ? searchParams.slug : undefined;
  const urlPath = typeof searchParams.urlPath === "string" ? searchParams.urlPath : "/";
  // Resolve locale with a three-level fallback:
  // 1. builder.options.locale query param — Builder's standard locale param.
  //    "Default" is Builder's internal value for the default locale; treat it
  //    as unrecognised so we fall through.
  // 2. x-locale request header — set by the proxy when the URL carries a
  //    locale path prefix (e.g. /es-MX/preview → proxy strips prefix, injects
  //    header). This handles the case where Builder encodes locale in the URL
  //    path rather than in builder.options.locale.
  // 3. DEFAULT_LOCALE — final fallback.
  const builderLocale = typeof searchParams["builder.options.locale"] === "string"
    ? searchParams["builder.options.locale"]
    : undefined;
  const customLocale = typeof searchParams.locale === "string" ? searchParams.locale : undefined;
  const candidateLocale = builderLocale ?? customLocale ?? "";
  const locale = SUPPORTED_LOCALE_CODES.includes(candidateLocale)
    ? candidateLocale
    : await getLocaleFromHeaders();

  // Forward all Builder editor params (builder.preview, builder.overrides.*, builder.cachebust)
  const builderOptions = getBuilderSearchParams(searchParams as unknown as URLSearchParams);

  // A model name is required — reject empty requests outright
  if (!model) return notFound();

  // ── page model ────────────────────────────────────────────────────────────
  if (model === config.models.page) {
    const content = await fetchOneEntry({
      apiKey: config.envs.builderApiKey,
      model: config.models.page,
      options: builderOptions,
      userAttributes: { urlPath, locale },
      locale,
    });

    if (!content && !isEditing() && !isPreviewing()) return notFound();
    return <RenderBuilderContent content={content} model={config.models.page} locale={locale} />;
  }

  // ── slug-based blog models (data + section) ───────────────────────────────
  if (
    model === config.models.blogArticle ||
    model === config.models.blogArticleSection
  ) {
    if (!slug) return notFound();

    const content = await fetchOneEntry({
      apiKey: config.envs.builderApiKey,
      model,
      options: builderOptions,
      userAttributes: { locale },
      query: { "data.slug": slug },
      locale,
    });

    if (!content && !isEditing() && !isPreviewing()) return notFound();

    const data = content?.data as BlogArticleWithContent | undefined;
    return (
      <>
        {data?.image && <BlogArticleHero image={data.image} alt={data.title} />}
        <div className="mx-auto max-w-3xl px-6 py-12">
          <BlogArticleHeader title={data?.title} blurb={data?.blurb} date={data?.date} />
          <hr className="my-10 border-zinc-200" />
          <RenderBuilderContent content={content} model={model} locale={locale} />
        </div>
      </>
    );
  }

  // ── blog-article-template (hybrid model) ─────────────────────────────────
  if (model === config.models.blogArticleTemplate) {
    if (!slug) return notFound();

    // Fetch the article data first (the template renders around it)
    const articleData = await fetchOneEntry({
      model: config.models.blogArticle,
      apiKey: config.envs.builderApiKey,
      userAttributes: { locale },
      query: { "data.slug": slug },
      locale,
    });

    // Fetch the template that matches this article's category
    const articleTemplate = await fetchOneEntry({
      model: config.models.blogArticleTemplate,
      apiKey: config.envs.builderApiKey,
      options: builderOptions,
      userAttributes: { category: articleData?.data?.category, locale },
      locale,
    });

    if (!articleData && !isEditing() && !isPreviewing()) return notFound();
    return (
      <RenderBuilderContent
        content={articleTemplate}
        model={config.models.blogArticleTemplate}
        data={{ article: articleData }}
        locale={locale}
      />
    );
  }

  // ── generic fallback (symbols, custom models, any slug-less content) ────────
  // Relies entirely on builderOptions forwarding the builder.preview token so
  // the SDK resolves the correct entry — no slug or urlPath needed.
  const content = await fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model,
    options: builderOptions,
    userAttributes: { locale },
    locale,
  });

  if (!content && !isEditing() && !isPreviewing()) return notFound();
  return <RenderBuilderContent content={content} model={model} locale={locale} />;
}
