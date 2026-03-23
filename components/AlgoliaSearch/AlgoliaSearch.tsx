"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { algoliasearch } from "algoliasearch";
import type { AlgoliaSearchProps, AlgoliaHit } from "./AlgoliaSearch.types";
import styles from "./AlgoliaSearch.module.scss";
import { cn } from "@/utils/cn";
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
      <div className={styles.missingConfig} role="alert">
        Algolia is not configured. Set{" "}
        <code>NEXT_PUBLIC_ALGOLIA_APP_ID</code> and{" "}
        <code>NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY</code>.
      </div>
    );
  }

  return (
    <section
      className={styles.searchSection}
      role="search"
      aria-label={searchLabel}
    >
      <div className={styles.inputWrapper}>
        <label className={styles.srOnly} htmlFor="algolia-search-input">
          {searchLabel}
        </label>
        <input
          id="algolia-search-input"
          className={styles.searchInput}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && (
          <span className={styles.loadingSpinner} aria-hidden="true" />
        )}
      </div>

      <div
        className={styles.resultsRegion}
        aria-live="polite"
        aria-atomic="true"
      >
        {hasSearched && hits.length === 0 && !isLoading && (
          <p className={styles.noResults}>{noResultsMessage}</p>
        )}

        {hits.length > 0 && (
          <ul className={styles.resultsList} role="list">
            {hits.map((hit) => (
              <li key={hit.objectID} className={styles.resultItem}>
                <Link href={getUrl(hit)} className={styles.resultLink}>
                  <span className={cn(styles.resultTitle)}>
                    {getTitle(hit)}
                  </span>
                  {hit.description && (
                    <span className={styles.resultDescription}>
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
