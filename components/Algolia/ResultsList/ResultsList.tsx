import Link from "next/link";
import type { ResultsListProps, AlgoliaHit } from "./ResultsList.types";

export type { ResultsListProps } from "./ResultsList.types";

function getTitle(hit: AlgoliaHit) {
  return hit.title ?? hit.name ?? "Untitled";
}

function getUrl(hit: AlgoliaHit) {
  return hit.url ?? "#";
}

export default function ResultsList({
  hits,
  hasSearched,
  isLoading,
  noResultsMessage,
}: ResultsListProps) {
  if (!hasSearched || isLoading) return null;

  if (hits.length === 0) {
    return (
      <p className="p-3 text-sm text-muted-foreground border border-border rounded-[var(--radius)] bg-card shadow-lg">
        {noResultsMessage}
      </p>
    );
  }

  return (
    <ul
      className="list-none m-0 p-0 border border-border rounded-[var(--radius)] bg-card overflow-hidden divide-y divide-border shadow-lg"
      role="list"
    >
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <Link
            href={getUrl(hit)}
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
