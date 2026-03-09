import DOMPurify from "isomorphic-dompurify";
import type { BlogArticleBodyProps } from "./BlogArticleBody.types";

const SANITIZE_OPTIONS = {
  ALLOWED_ATTR: ["href", "src", "alt", "title"] as string[],
};

export function BlogArticleBody({ htmlContent }: BlogArticleBodyProps) {
  const sanitized = DOMPurify.sanitize(htmlContent, SANITIZE_OPTIONS);

  return (
    <section className="mb-12 overflow-hidden rounded-xl">
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </section>
  );
}
