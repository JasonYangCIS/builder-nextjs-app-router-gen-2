import type { AlgoliaHit } from "@/components/Algolia/AlgoliaSearch/AlgoliaSearch.types";

export type { AlgoliaHit };

export interface ResultsListProps {
  hits: AlgoliaHit[];
  hasSearched: boolean;
  isLoading: boolean;
  noResultsMessage: string;
}
