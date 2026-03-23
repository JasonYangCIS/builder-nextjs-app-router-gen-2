"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { algoliasearch } from "algoliasearch";
import type { AlgoliaSearchProps, AlgoliaHit } from "./AlgoliaSearch.types";
import { config } from "@/config";

export type { AlgoliaSearchProps, AlgoliaHit } from "./AlgoliaSearch.types";

const { algoliaAppId, algoliaSearchApiKey } = config.envs;

const searchClient =
  algoliaAppId && algoliaSearchApiKey
    ? algoliasearch(algoliaAppId, algoliaSearchApiKey)
    : null;

export default function AlgoliaSearch({
  placeholder = "Search pages…",
  indexName = config.envs.algoliaIndexName,
  maxResults = 6,
  noResultsMessage = "No results found.",
  searchLabel = "Search",
}: AlgoliaSearchProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<AlgoliaHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setHits([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    if (!searchClient) {
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await searchClient.searchSingleIndex({
          indexName,
          searchParams: { query, hitsPerPage: maxResults },
        });
        setHits(response.hits as AlgoliaHit[]);
        setHasSearched(true);
      } catch {
        setHits([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, indexName, maxResults]);

  const getTitle = (hit: AlgoliaHit) => hit.title ?? hit.name ?? "Untitled";
  const getUrl = (hit: AlgoliaHit) => hit.url ?? "#";

  if (!searchClient) {
    return (
      <div
        className="px-4 py-3 border border-border rounded-[var(--radius)] bg-muted text-muted-foreground text-sm [&_code]:font-mono [&_code]:bg-background [&_code]:px-1 [&_code]:rounded"
        role="alert"
      >
        Algolia is not configured. Set{" "}
        <code>NEXT_PUBLIC_ALGOLIA_APP_ID</code> and{" "}
        <code>NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY</code>.
      </div>
    );
  }

  return (
    <section className="w-full max-w-[640px]" role="search" aria-label={searchLabel}>
      <div className="relative flex items-center">
        <label className="sr-only" htmlFor="algolia-search-input">
          {searchLabel}
        </label>
        <input
          id="algolia-search-input"
          className="w-full h-10 pl-3 pr-10 border border-border rounded-[var(--radius)] bg-background text-foreground text-sm leading-normal outline-none placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 focus:border-ring focus:shadow-[0_0_0_2px_var(--ring)] motion-reduce:transition-none [&::-webkit-search-cancel-button]:appearance-none"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && (
          <span
            className="absolute right-3 size-4 rounded-full border-2 border-muted border-t-primary animate-spin motion-reduce:animate-none motion-reduce:opacity-50"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mt-2" aria-live="polite" aria-atomic="true">
        {hasSearched && hits.length === 0 && !isLoading && (
          <p className="p-3 text-sm text-muted-foreground">{noResultsMessage}</p>
        )}

        {hits.length > 0 && (
          <ul
            className="list-none m-0 p-0 border border-border rounded-[var(--radius)] bg-card overflow-hidden divide-y divide-border"
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
        )}
      </div>
    </section>
  );
}
