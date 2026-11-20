import { sanitizeHtml } from "@/utils/sanitize-html";
import type { BlogArticleBodyProps } from "./BlogArticleBody.types";

export function BlogArticleBody({ htmlContent }: BlogArticleBodyProps) {
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
