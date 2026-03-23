"use client";

import { useState, useEffect, useRef } from "react";
import { algoliasearch } from "algoliasearch";
import { config } from "@/config";
import SearchForm from "@/components/Algolia/SearchForm/SearchForm";
import ResultsList from "@/components/Algolia/ResultsList/ResultsList";
import type { AlgoliaSearchProps, AlgoliaHit } from "./AlgoliaSearch.types";

export type { AlgoliaSearchProps, AlgoliaHit } from "./AlgoliaSearch.types";

const FOCUSABLE = 'input, a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const sectionRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isActive = query.trim().length > 0;

  // Capture focus when search activates; restore it when it deactivates.
  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isActive]);

  // Focus trap: keep Tab / Shift+Tab cycling within the search section.
  useEffect(() => {
    if (!isActive) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !sectionRef.current) return;

      const focusable = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !sectionRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !sectionRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isActive]);

  // Escape dismisses search; focus restoration is handled by the effect above.
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && query) setQuery("");
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [query]);

  // Debounced Algolia search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setHits([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    if (!searchClient) return;

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
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, indexName, maxResults]);

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
    <>
      {/* Backdrop — same pattern as mobile nav overlay */}
      {isActive && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none"
          onClick={() => setQuery("")}
          aria-hidden="true"
        />
      )}

      <section
        ref={sectionRef}
        className={`relative w-full max-w-[640px] ${isActive ? "z-50" : ""}`}
        role="search"
        aria-label={searchLabel}
      >
        <SearchForm
          query={query}
          onChange={setQuery}
          isLoading={isLoading}
          placeholder={placeholder}
          searchLabel={searchLabel}
        />

        <div
          className="absolute top-full left-0 right-0 z-50 mt-1"
          aria-live="polite"
          aria-atomic="true"
        >
          <ResultsList
            hits={hits}
            hasSearched={hasSearched}
            isLoading={isLoading}
            noResultsMessage={noResultsMessage}
          />
        </div>
      </section>
    </>
  );
}
