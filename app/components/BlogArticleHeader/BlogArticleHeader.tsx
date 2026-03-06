import { formatBlogDate } from "@/utils/date";
import type { BlogArticleHeaderProps } from "./BlogArticleHeader.types";

export function BlogArticleHeader({ title, blurb, date }: BlogArticleHeaderProps) {
  const formattedDate = formatBlogDate(date);

  return (
    <>
      {title && (
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
      )}
      {blurb && (
        <p className="mt-4 text-lg text-gray-500 leading-relaxed">
          {blurb}
        </p>
      )}
      {formattedDate && (
        <div className="mt-6 flex items-center gap-3">
          <time dateTime={date ?? undefined}>{formattedDate}</time>
        </div>
      )}
    </>
  );
}
