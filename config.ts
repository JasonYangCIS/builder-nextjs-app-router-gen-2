export const config = {
  envs: {
    // Builder Public API Key set in .env file
    builderApiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
    // Algolia credentials set in .env.local
    algoliaAppId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
    algoliaSearchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? "",
    algoliaIndexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? "builder-page",
  },
  components: {
    uiBlocks: "UI Blocks",
    button: "DS Button",
    text: "DS Text",
    badge: "DS Badge",
    input: "DS Input",
    card: "DS Card",
    counter: "Counter",
    carousel: "DS Carousel",
    heroFullBleed: "Hero: Full Bleed",
    heroSplit: "Hero: Split",
    heroCentered: "Hero: Centered",
    algoliaSearch: "Algolia Search",
    cloudinaryImage: "Cloudinary Image",
    announcementBar: "Announcement Bar",
    faqList: "FAQ List",
  },
  models: {
    page: "page",
    blogArticle: "blog-article",
    blogArticleSection: "blog-article-section",
    blogArticleTemplate: "blog-article-template",
    headerNavMenu: "header-nav-menu",
    announcementBar: "announcement-bar",
    faq: "faq",
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
