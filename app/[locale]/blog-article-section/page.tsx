import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { buildLocalePath } from "@/utils/locale";
import { BlogArticleList } from "@/components/blog/BlogArticleList/BlogArticleList";
import { Text } from "@/components/ui/Text/Text";
import type { BlogArticle } from "@/types/blog.types";

const builderModelName = config.models.blogArticleSection;

export const revalidate = 5;

export const metadata = {
  title: "Blog - Section Model",
  description: "Articles and updates using section model approach",
};

export default async function BlogArticleSectionPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const articles = await fetchEntries({
    model: builderModelName,
    apiKey: config.envs.builderApiKey,
    limit: 100,
  });

  const items = (articles ?? [])
    .map((entry) => ({
      ...(entry.data as unknown as BlogArticle),
    }))
    .filter((a) => a.slug)
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-14">
        <Text variant="h1" className="gradient-brand-text sm:text-5xl">
          Blog (Section Model)
        </Text>
        <Text variant="body-lg" color="muted" className="mt-3">
          First fold is fixed in code; the rest is drag-and-drop in Builder.{" "}
          <a
            href="https://www.builder.io/blog/builder-drag-drop-blog#section-model"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
          >
            Learn more ↗
          </a>
        </Text>
      </header>

      <BlogArticleList articles={items} route={buildLocalePath(locale, "/blog-article-section")} />

      {items.length === 0 && (
        <Text variant="body" color="muted">No articles yet.</Text>
      )}
    </div>
  );
}
