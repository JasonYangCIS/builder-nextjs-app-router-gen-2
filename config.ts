export const config = {
  envs: {
    // Builder Public API Key set in .env file
    builderApiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!
  },
  models: {
    page: "page",
    blogArticle: "blog-article",
    blogArticleSection: "blog-article-section",
    blogArticleTemplate: "blog-article-template"
  }
}