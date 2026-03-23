import Link from "next/link";
import type { ResultsListProps, AlgoliaHit } from "./ResultsList.types";

export type { ResultsListProps } from "./ResultsList.types";

function getTitle(hit: AlgoliaHit): string {
  return hit.title ?? hit.name ?? "Untitled";
}

/**
 * Only relative paths (starting with /) are allowed.
 * This component is used for site-internal search (Builder page entries),
 * where all URLs are relative. Allowing absolute URLs is unnecessary risk
 * — a compromised Algolia index could redirect users to phishing domains.
 */
function sanitizeUrl(hit: AlgoliaHit): string {
  const url = hit.url;
  if (typeof url === "string" && url.startsWith("/")) return url;
  return "#";
}

export default function ResultsList({
  hits,
  hasSearched,
  isLoading,
  noResultsMessage,
}: ResultsListProps) {
  // Nothing to show before the first search completes
  if (!hasSearched) return null;

  // No results — only render after loading finishes to avoid flash between queries
  if (hits.length === 0 && !isLoading) {
    return (
      <p className="p-3 text-sm text-muted-foreground border border-border rounded-[var(--radius)] bg-card shadow-lg">
        {noResultsMessage}
      </p>
    );
  }

  // Keep previous hits visible while the next query is loading (no flicker)
  if (hits.length === 0) return null;

  return (
    <ul className="list-none m-0 p-0 border border-border rounded-[var(--radius)] bg-card overflow-hidden divide-y divide-border shadow-lg">
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <Link
            href={sanitizeUrl(hit)}
            className="flex flex-col gap-0.5 px-4 py-3 no-underline text-inherit transition-colors duration-100 hover:bg-muted focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-[-2px] motion-reduce:transition-none"
          >
            <span className="text-[0.9375rem] font-medium text-foreground">
              {getTitle(hit)}
            </span>
            {hit.description && (
              <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                {hit.description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
