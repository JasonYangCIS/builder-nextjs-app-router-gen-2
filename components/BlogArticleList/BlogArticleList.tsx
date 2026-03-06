import { BlogArticleCard } from "../BlogArticleCard/BlogArticleCard";
import type { BlogArticleListProps } from "./BlogArticleList.types";

export function BlogArticleList({ articles, route }: BlogArticleListProps) {
  return (
    <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <BlogArticleCard key={article.slug} article={article} route={route} />
      ))}
    </ul>
  );
}
