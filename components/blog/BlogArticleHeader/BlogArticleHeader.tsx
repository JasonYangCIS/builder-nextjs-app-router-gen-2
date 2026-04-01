import { formatBlogDate } from "@/utils/date";
import { Text } from "@/components/ui/Text/Text";
import type { BlogArticleHeaderProps } from "./BlogArticleHeader.types";

export function BlogArticleHeader({ title, blurb, date }: BlogArticleHeaderProps) {
  const formattedDate = formatBlogDate(date);

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <Text variant="h1" className="sm:text-5xl">
          {title}
        </Text>
      )}
      {blurb && (
        <Text variant="body-lg" color="muted">
          {blurb}
        </Text>
      )}
      {formattedDate && (
        <time dateTime={date ?? undefined} className="text-sm text-muted-foreground">
          {formattedDate}
        </time>
      )}
    </div>
  );
}
