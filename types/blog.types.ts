/**
 * Base blog article shape used for list/card display and API responses.
 * All fields except slug are optional to support partial API data.
 */
export interface BlogArticle {
  slug: string;
  title?: string | null;
  blurb?: string | null;
  image?: string | null;
  date?: string | null;
}

/**
 * Full blog article including HTML content (detail page / Builder entry).
 */
export interface BlogArticleWithContent extends BlogArticle {
  content?: string | null;
}
