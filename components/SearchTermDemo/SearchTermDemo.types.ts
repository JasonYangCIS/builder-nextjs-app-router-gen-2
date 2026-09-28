export type CustomerTier = "wholesale" | "retail";

/**
 * `targeting` mirrors Builder's entry-level targeting attributes (userAttributes) —
 * they decide WHO/WHEN an entry is eligible. `data` is ordinary content data;
 * `searchTerms` describes WHAT the entry is about, for querying via the Content API.
 */
export interface MockEntry {
  id: string;
  targeting: {
    locale: string;
    customerTier: CustomerTier;
  };
  data: {
    title: string;
    searchTerms: string[];
  };
}

export interface MatchResult {
  entry: MockEntry;
  matchedTerms: string[];
  targetingMatched: boolean;
  searchMatched: boolean;
}
