import { formatBlogDate } from "@/utils/date";
import { Typography } from "@/components/design-system";
import type { BlogArticleHeaderProps } from "./BlogArticleHeader.types";

export function BlogArticleHeader({ title, blurb, date }: BlogArticleHeaderProps) {
  const formattedDate = formatBlogDate(date);

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <Typography variant="h1" className="sm:text-5xl">
          {title}
        </Typography>
      )}
      {blurb && (
        <Typography variant="body-lg" color="muted">
          {blurb}
        </Typography>
      )}
      {formattedDate && (
        <time dateTime={date ?? undefined} className="text-sm text-zinc-500">
          {formattedDate}
        </time>
      )}
    </div>
  );
}
