import NextImage from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/utils/date";
import { Badge, Typography } from "@/components/design-system";
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
          "border border-zinc-200 bg-white shadow-sm",
          "transition-all hover:border-zinc-300 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        )}
      >
        {article.image ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
            <NextImage
              src={article.image}
              alt={title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-zinc-100" aria-hidden="true" />
        )}

        <div className="flex flex-1 flex-col gap-1.5 p-5">
          {formattedDate && (
            <time dateTime={article.date ?? undefined} className="text-xs text-zinc-500">
              {formattedDate}
            </time>
          )}
          {article.category && (
            <Badge
              variant="neutral"
              size="sm"
              label={article.category}
              aria-label={`Category: ${article.category}`}
            />
          )}
          <Typography variant="h5" as="h2">{title}</Typography>
          {article.blurb && (
            <Typography variant="body-sm" color="muted" className="line-clamp-2">
              {article.blurb}
            </Typography>
          )}
        </div>
      </Link>
    </li>
  );
}
