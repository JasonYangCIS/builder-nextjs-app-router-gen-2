import Link from "next/link";
import { sanitizeHref } from "@/utils/url";
import { buildLocalePath } from "@/utils/locale";
import type { ResultsListProps, AlgoliaHit } from "./ResultsList.types";

export type { ResultsListProps } from "./ResultsList.types";

/** Safely resolves a Builder data field that may be a plain string or a
 *  localized object like `{ Default: "value", "@type": "..." }`. */
function resolveField(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "Default" in value) {
    const def = (value as Record<string, unknown>).Default;
    if (typeof def === "string") return def;
  }
  return undefined;
}

function getTitle(hit: AlgoliaHit): string {
  return resolveField(hit.data?.title) ?? resolveField(hit.title) ?? hit.name ?? "Untitled";
}

function getDescription(hit: AlgoliaHit): string | undefined {
  return resolveField(hit.data?.description) ?? resolveField(hit.description);
}

/** Extracts the URL path from the hit's query array (urlPath targeting rule) or flat url field. */
function getUrlFromHit(hit: AlgoliaHit): string {
  const urlPathEntry = hit.query?.find((q) => q.property === "urlPath");
  return urlPathEntry?.value ?? hit.url ?? "";
}

function getHref(hit: AlgoliaHit, locale: string): string {
  const safe = sanitizeHref(getUrlFromHit(hit));
  if (!safe) return "#";
  return buildLocalePath(locale, safe);
}

export default function ResultsList({
  hits,
  hasSearched,
  isLoading,
  noResultsMessage,
  locale,
  onResultClick,
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
            href={getHref(hit, locale)}
            onClick={onResultClick}
            className="flex flex-col gap-0.5 px-4 py-3 no-underline text-inherit transition-colors duration-100 hover:bg-muted focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-[-2px] motion-reduce:transition-none"
          >
            <span className="text-[0.9375rem] font-medium text-foreground">
              {getTitle(hit)}
            </span>
            {getDescription(hit) && (
              <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                {getDescription(hit)}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
