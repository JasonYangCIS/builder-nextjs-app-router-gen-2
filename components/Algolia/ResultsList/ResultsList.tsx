import Link from "next/link";
import type { ResultsListProps, AlgoliaHit } from "./ResultsList.types";

export type { ResultsListProps } from "./ResultsList.types";

function getTitle(hit: AlgoliaHit): string {
  return hit.title ?? hit.name ?? "Untitled";
}

/**
 * Validates hit.url from Algolia — external data that must not be trusted.
 * Only relative paths (/) and absolute http(s) URLs are allowed.
 * Everything else (javascript:, data:, attacker-controlled) falls back to "#".
 */
function sanitizeUrl(hit: AlgoliaHit): string {
  const url = hit.url;
  if (!url || typeof url !== "string") return "#";
  if (url.startsWith("/")) return url;
  try {
    const { protocol } = new URL(url);
    if (protocol === "http:" || protocol === "https:") return url;
  } catch {
    // malformed URL — fall through to safe default
  }
  return "#";
}

export default function ResultsList({
  id,
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
    <ul
      id={id}
      role="listbox"
      className="list-none m-0 p-0 border border-border rounded-[var(--radius)] bg-card overflow-hidden divide-y divide-border shadow-lg"
    >
      {hits.map((hit) => (
        <li key={hit.objectID} role="option" aria-selected="false">
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
