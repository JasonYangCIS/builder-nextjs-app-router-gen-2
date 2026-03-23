export interface AlgoliaSearchProps {
  placeholder?: string;
  indexName?: string;
  maxResults?: number;
  noResultsMessage?: string;
  searchLabel?: string;
}

export interface AlgoliaHit {
  objectID: string;
  name?: string;
  data?: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
  query?: {
    property?: string;
    value?: string;
    [key: string]: unknown;
  }[];
  /** Legacy flat fields — kept for backwards compatibility with custom indices */
  title?: string;
  url?: string;
  description?: string;
  [key: string]: unknown;
}
