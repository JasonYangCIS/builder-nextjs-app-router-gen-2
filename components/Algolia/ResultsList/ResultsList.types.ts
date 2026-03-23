import type { AlgoliaHit } from "@/components/Algolia/AlgoliaSearch/AlgoliaSearch.types";

export type { AlgoliaHit };

export interface ResultsListProps {
  /** Unique id matching the combobox's aria-controls — generated via useId() in the parent */
  id: string;
  hits: AlgoliaHit[];
  hasSearched: boolean;
  isLoading: boolean;
  noResultsMessage: string;
}
