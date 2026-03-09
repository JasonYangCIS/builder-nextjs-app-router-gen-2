import type { BlogArticle } from "@/types/blog.types";

export interface BlogArticleListProps {
  articles: BlogArticle[];
  route?: string;
}
