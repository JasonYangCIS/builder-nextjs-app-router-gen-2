import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { BlogArticleList } from "@/components/BlogArticleList/BlogArticleList";
import type { BlogArticle } from "@/types/blog.types";

const builderModelName = config.models.blogArticleSection;

export const revalidate = 5;

export const metadata = {
  title: "Blog - Section Model",
  description: "Articles and updates using section model approach",
};

export default async function BlogArticleSectionPage() {
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
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Blog Section Model
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          A blog that is populated by a Section model where the first fold's content is fixed in code.
          <br />
          The rest of the content is drag-and-drop via the Builder.io visual editor.
          <br />
          <a href="https://www.builder.io/blog/builder-drag-drop-blog#section-model" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
            https://www.builder.io/blog/builder-drag-drop-blog#section-model
          </a>
        </p>
      </header>

      <BlogArticleList articles={items} route={'/blog-article-section'} />

      {items.length === 0 && (
        <p className="text-gray-500">No articles yet.</p>
      )}

    </div>
  );
}
