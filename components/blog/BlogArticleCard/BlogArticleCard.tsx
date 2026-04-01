import NextImage from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/utils/date";
import { Badge } from "@/components/ui/Badge/Badge";
import { Text } from "@/components/ui/Text/Text";
import { cn } from "@/utils/cn";
import type { BlogArticleCardProps } from "./BlogArticleCard.types";

export function BlogArticleCard({ article, route = "/blog" }: BlogArticleCardProps) {
  const title = article.title?.trim() || "Untitled";
  const linkLabel = title !== "Untitled" ? `Read article: ${title}` : "Read article";
  const formattedDate = formatBlogDate(article.date);

  return (
    <li className="flex">
      <Link
        href={`${route}/${article.slug}`}
        aria-label={linkLabel}
        className={cn(
          "group flex flex-1 flex-col overflow-hidden rounded-xl",
          "border border-border bg-card shadow-sm",
          "transition-all hover:border-border/80 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        )}
      >
        {article.image ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <NextImage
              src={article.image}
              alt={title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-muted" aria-hidden="true" />
        )}

        <div className="flex flex-1 flex-col gap-1.5 p-5">
          {formattedDate && (
            <time dateTime={article.date ?? undefined} className="text-xs text-muted-foreground">
              {formattedDate}
            </time>
          )}
          {article.category && (
            <Badge
              variant="secondary"
              aria-label={`Category: ${article.category}`}
            >
              {article.category}
            </Badge>
          )}
          <Text variant="h5" as="h2">{title}</Text>
          {article.blurb && (
            <Text variant="body-sm" color="muted" className="line-clamp-2">
              {article.blurb}
            </Text>
          )}
        </div>
      </Link>
    </li>
  );
}
