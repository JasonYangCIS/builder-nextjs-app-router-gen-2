/**
 * Playwright test fixture — blog components rendered with static data.
 * Not linked from the app; only used by tests/blog/blog-components.spec.ts.
 */
import { BlogArticleBody } from "@/components/blog/BlogArticleBody/BlogArticleBody";
import { BlogArticleCard } from "@/components/blog/BlogArticleCard/BlogArticleCard";
import { BlogArticleHeader } from "@/components/blog/BlogArticleHeader/BlogArticleHeader";
import { BlogArticleHero } from "@/components/blog/BlogArticleHero/BlogArticleHero";
import { BlogArticleList } from "@/components/blog/BlogArticleList/BlogArticleList";
import type { BlogArticle } from "@/types/blog.types";

const ARTICLE_FULL: BlogArticle = {
  slug: "test-article",
  title: "Test Article Title",
  blurb: "A test article blurb for Playwright tests.",
  date: "2024-01-15T00:00:00.000Z",
  image: "https://cdn.builder.io/api/v1/image/assets/placeholder",
  category: "Technology",
};

const ARTICLE_NO_IMAGE: BlogArticle = {
  slug: "test-article-no-image",
  title: "Second Article",
  blurb: "Another test article with no image.",
  date: "2024-02-20T00:00:00.000Z",
  image: null,
  category: null,
};

const ARTICLE_MINIMAL: BlogArticle = {
  slug: "test-article-minimal",
  title: null,
  blurb: null,
  date: null,
  image: null,
  category: null,
};

export default function BlogComponentsFixturePage() {
  return (
    <div>
      {/* BlogArticleHero */}
      <section id="hero">
        <BlogArticleHero
          image="https://cdn.builder.io/api/v1/image/assets/placeholder"
          alt="Test hero image"
        />
      </section>

      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* BlogArticleHeader — full data */}
        <section id="header-full">
          <BlogArticleHeader
            title="Test Article Title"
            blurb="A test article blurb."
            date="2024-01-15T00:00:00.000Z"
          />
        </section>

        {/* BlogArticleHeader — null data (no title, no blurb, no date) */}
        <section id="header-empty">
          <BlogArticleHeader title={null} blurb={null} date={null} />
        </section>

        {/* BlogArticleBody — normal HTML */}
        <section id="body-normal">
          <BlogArticleBody htmlContent="<p>Test paragraph content.</p><h2>Section Heading</h2><a href='/safe'>Safe link</a>" />
        </section>

        {/* BlogArticleBody — XSS attempt should be stripped */}
        <section id="body-xss">
          <BlogArticleBody htmlContent='<p>Safe text</p><script>window.__xssTest=true;</script><img src="x" onerror="window.__xssTest=true">' />
        </section>

      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">

        {/* BlogArticleCard — with image, category, and date */}
        <section id="card-full">
          <ul>
            <BlogArticleCard article={ARTICLE_FULL} route="/blog-article" />
          </ul>
        </section>

        {/* BlogArticleCard — no image, no category */}
        <section id="card-no-image">
          <ul>
            <BlogArticleCard article={ARTICLE_NO_IMAGE} route="/blog-article" />
          </ul>
        </section>

        {/* BlogArticleCard — all nullable fields null */}
        <section id="card-minimal">
          <ul>
            <BlogArticleCard article={ARTICLE_MINIMAL} route="/blog-article" />
          </ul>
        </section>

        {/* BlogArticleList — multiple articles */}
        <section id="list">
          <BlogArticleList
            articles={[ARTICLE_FULL, ARTICLE_NO_IMAGE, ARTICLE_MINIMAL]}
            route="/blog-article"
          />
        </section>

      </div>
    </div>
  );
}
