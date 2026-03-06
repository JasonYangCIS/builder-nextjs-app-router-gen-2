import { fetchEntries, fetchOneEntry, isEditing, isPreviewing } from "@builder.io/sdk-react";
import DOMPurify from "isomorphic-dompurify";
import NextImage from "next/image";
import { RenderBuilderContent } from "@/components/builder";
import { config } from "@/config";
import { notFound } from "next/navigation";

interface BlogArticleData {
  slug: string
  title: string
  blurb: string
  image: string
  date: string
  content: string
}


const builderModelName = config.models.blogArticle;
// ---------------------------------------------------------------------------
// Static params (replaces getStaticPaths)
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const articles = await fetchEntries({
    model: builderModelName,
    apiKey: config.envs.builderApiKey,
    limit: 100,
  });

  return (articles ?? []).map((article) => ({
    slug: (article.data as { slug?: string })?.slug ?? "",
  })).filter((p) => p.slug) as { slug: string }[];
}


// ---------------------------------------------------------------------------
// Metadata (optional but recommended)
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = await fetchOneEntry({
    model: 'blog-article',
    apiKey: config.envs.builderApiKey,
    query: { 'data.slug': (await params)?.slug },
  })

  return {
    title: article?.data?.title ?? 'Blog Article',
    description: article?.data?.blurb ?? '',
  }
}

export const revalidate = 5 // seconds — equivalent to the old ISR revalidate: 5

export default async function Page(props: {
  params: Promise<{
    page: {
      slug: string;
    };
  }>;
}) {

  // Use the page path specified in the URL to fetch the content
  const urlPath = "/" + ((await props?.params)?.page?.slug || "");
  const content = await fetchOneEntry({
    // Get the page content from Builder with the specified options
    apiKey: config.envs.builderApiKey,
    model: builderModelName,
    userAttributes: { urlPath },
  });


  if (!content && !isEditing() && !isPreviewing()) {
    return notFound();
  }

  const data = content?.data as BlogArticleData | undefined
  const formattedDate = data?.date
    ? new Date(data.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      {data?.image && (
        <div className="relative h-72 w-full sm:h-96 md:h-[480px]">
          <NextImage
            src={data.image}
            alt={data.title ?? ''}
            fill
            className="object-cover"
            priority
          />
          {/* dark overlay so text is readable if you move title inside hero */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* ── Article container ──────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* Title */}
        {data?.title && (
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {data.title}
          </h1>
        )}

        {/* Blurb / eyebrow */}
        {data?.blurb && (
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            {data.blurb}
          </p>
        )}

        {/* @TODO - author integration */}
        {/* Date row */}
        {(formattedDate) && (
          <div className="mt-6 flex items-center gap-3">
            {formattedDate && <span>{formattedDate}</span>}
          </div>
        )}

        <hr className="my-10 border-gray-200" />

        {/* ── Body sections ────────────────────────────────────── */}
        {data?.content && (
          <section
            className="mb-12 overflow-hidden rounded-2xl">
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.content, {
                  ALLOWED_ATTR: ["href", "src", "alt", "title"],
                }),
              }}
            />
          </section>
        )}

        {/* Builder visual editor blocks (if any) */}
        <RenderBuilderContent content={content} model={builderModelName} />
      </div>
    </>
  );
}
