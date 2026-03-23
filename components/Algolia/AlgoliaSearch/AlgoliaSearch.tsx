"use client";

import { useState, useEffect, useRef, useId, useCallback } from "react";
import { usePathname } from "next/navigation";
import { algoliasearch } from "algoliasearch";
import { config } from "@/config";
import { getLocaleFromPath } from "@/utils/locale";
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
  // Incremented on every new search; compared in the async callback to discard stale responses
  const requestIdRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // Only restore focus on intentional dismissal (Escape / backdrop).
  // Without this, backspacing to clear the input steals focus from the user.
  const wasExplicitlyDismissedRef = useRef(false);

  // Unique id per instance — fixes WCAG 4.1.1 duplicate-id when multiple
  // AlgoliaSearch components are on the same page (e.g. design system).
  const uid = useId();
  const inputId = `algolia-search-${uid}`;

  const isActive = query.trim().length > 0;

  // Reset search when the user navigates to a new page via a result link.
  // Without this the backdrop and focus trap persist across client-side navigations.
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const locale = getLocaleFromPath(pathname);
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      setQuery("");
    }
  }, [pathname]);

  // Capture the pre-search focused element via relatedTarget on the input's focus event.
  // Using onFocus (not useEffect) avoids a race where document.activeElement is already
  // the input by the time the effect fires — making Escape restoration a no-op (WCAG 2.4.3).
  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (!previousFocusRef.current) {
      previousFocusRef.current = (e.relatedTarget as HTMLElement | null) ?? document.body;
    }
  }, []);

  // Restore focus only on intentional dismissal — not when the user simply
  // backspaces to an empty input, which would steal focus unexpectedly.
  // wasExplicitlyDismissedRef is always reset here (not just when previousFocusRef
  // is set) to prevent it from getting stuck as `true` in sessions where the user
  // typed → backspaced → typed again (no blur, so previousFocusRef was cleared by
  // the backspace path) → pressed Escape. Without the unconditional reset, the next
  // focus cycle would incorrectly treat a backspace-to-empty as an explicit dismiss.
  useEffect(() => {
    if (!isActive) {
      if (previousFocusRef.current && wasExplicitlyDismissedRef.current) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
      wasExplicitlyDismissedRef.current = false;
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

  // Escape explicitly dismisses search; marks for focus restoration.
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && query) {
        wasExplicitlyDismissedRef.current = true;
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [query]);

  // Debounced Algolia search.
  // setIsLoading is intentionally moved *inside* the timeout so previous results
  // stay visible during the debounce window — no flicker on every keystroke.
  // requestIdRef guards against stale responses overwriting newer results.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      requestIdRef.current++; // invalidate any in-flight request
      setHits([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    if (!searchClient) return;

    const currentId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await searchClient.searchSingleIndex({
          indexName,
          searchParams: { query, hitsPerPage: maxResults },
        });
        if (currentId !== requestIdRef.current) return; // discard stale response
        setHits(response.hits as AlgoliaHit[]);
        setHasSearched(true);
      } catch {
        if (currentId !== requestIdRef.current) return;
        setHits([]);
        setHasSearched(true);
      } finally {
        if (currentId === requestIdRef.current) setIsLoading(false);
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
          onClick={() => { wasExplicitlyDismissedRef.current = true; setQuery(""); }}
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
          onFocus={handleInputFocus}
          isLoading={isLoading}
          placeholder={placeholder}
          searchLabel={searchLabel}
          inputId={inputId}
        />

        <div
          className="absolute top-full left-0 right-0 z-50 mt-1"
          aria-live="polite"
        >
          <ResultsList
            hits={hits}
            hasSearched={hasSearched}
            isLoading={isLoading}
            noResultsMessage={noResultsMessage}
            locale={locale}
            onResultClick={() => setQuery("")}
          />
        </div>
      </section>
    </>
  );
}
