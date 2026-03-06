import NextImage from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/utils/date";
import type { BlogArticleCardProps } from "./BlogArticleCard.types";

export function BlogArticleCard({ article }: BlogArticleCardProps) {
  return (
    <li className="flex">
      <Link
        href={`/blog/${article.slug}`}
        className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md"
      >
        {article.image ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
            <NextImage
              src={article.image}
              alt={article.title ?? ""}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-gray-100" />
        )}
        <div className="flex flex-1 flex-col p-5">
          {article.date && (
            <time
              dateTime={article.date}
              className="text-sm text-gray-500"
            >
              {formatBlogDate(article.date)}
            </time>
          )}
          <h2 className="mt-1.5 text-xl font-semibold text-foreground">
            {article.title ?? "Untitled"}
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
