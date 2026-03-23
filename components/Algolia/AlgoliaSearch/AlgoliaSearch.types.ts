export interface AlgoliaSearchProps {
  placeholder?: string;
  indexName?: string;
  maxResults?: number;
  noResultsMessage?: string;
  searchLabel?: string;
}

export interface AlgoliaHit {
  objectID: string;
  title?: string;
  name?: string;
  url?: string;
  description?: string;
  [key: string]: unknown;
}
