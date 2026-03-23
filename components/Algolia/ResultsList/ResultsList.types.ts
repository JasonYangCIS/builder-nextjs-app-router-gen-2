import type { AlgoliaHit } from "@/components/Algolia/AlgoliaSearch/AlgoliaSearch.types";

export type { AlgoliaHit };

export interface ResultsListProps {
  hits: AlgoliaHit[];
  hasSearched: boolean;
  isLoading: boolean;
  noResultsMessage: string;
  /** Active locale code — used to build locale-aware hrefs via buildLocalePath */
  locale: string;
  /** Called when a result link is clicked — used to close the overlay on same-page/hash navigation */
  onResultClick: () => void;
}
