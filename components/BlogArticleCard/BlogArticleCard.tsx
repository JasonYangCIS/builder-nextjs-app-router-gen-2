import NextImage from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/utils/date";
import type { BlogArticleCardProps } from "./BlogArticleCard.types";

const cardTitle = (title: string | null | undefined) => title?.trim() || "Untitled";

export function BlogArticleCard({ article, route = "/blog" }: BlogArticleCardProps) {
  const title = cardTitle(article.title);
  const linkLabel = title !== "Untitled" ? `Read article: ${title}` : "Read article";

  return (
    <li className="flex">
      <Link
        href={`${route}/${article.slug}`}
        aria-label={linkLabel}
        className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        {article.image ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
            <NextImage
              src={article.image}
              alt={title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-gray-100" aria-hidden="true" />
        )}
        <div className="flex flex-1 flex-col p-5">
          {article.date && (
            <time
              dateTime={article.date}
              className="text-sm text-gray-600"
            >
              {formatBlogDate(article.date)}
            </time>
          )}
          {article.category && (
            <span
              className="mt-1 inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-gray-700"
              aria-label={`Category: ${article.category}`}
            >
              {article.category}
            </span>
          )}
          <h2 className="mt-1.5 text-xl font-semibold text-gray-900">
            {title}
          </h2>
          {article.blurb && (
            <p className="mt-2 line-clamp-2 text-gray-600">
              {article.blurb}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
