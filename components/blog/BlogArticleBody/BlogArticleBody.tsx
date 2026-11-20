import { sanitizeHtml } from "@/utils/sanitize-html";
import type { BlogArticleBodyProps } from "./BlogArticleBody.types";

// Cached: DOMPurify reads the current time internally, which Cache Components
// disallows in the static shell. Output depends only on `htmlContent`.
export async function BlogArticleBody({ htmlContent }: BlogArticleBodyProps) {
  "use cache";
  const sanitized = sanitizeHtml(htmlContent);

  return (
    <section className="mb-12 overflow-hidden rounded-xl">
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </section>
  );
}
