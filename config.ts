export const config = {
  envs: {
    // Builder Public API Key set in .env file
    builderApiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!
  },
  models: {
    page: "page",
    blogArticle: "blog-article",
    blogArticleSection: "blog-article-section",
    blogArticleTemplate: "blog-article-template",
    headerNavMenu: "header-nav-menu",
    announcementBar: "announcement-bar"
  },
  locales: {
    default: "en-US",
    supported: [
      { code: "en-US", label: "English (US)" },
      { code: "es-ES", label: "Español (España)" },
      { code: "es-MX", label: "Español (México)" },
    ],
  },
}
