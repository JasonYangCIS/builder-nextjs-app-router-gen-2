export const config = {
  envs: {
    // Builder Public API Key set in .env file
    builderApiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!
  },
  models: {
    blogArticle: "blog-article",
    page: "page"
  }
}