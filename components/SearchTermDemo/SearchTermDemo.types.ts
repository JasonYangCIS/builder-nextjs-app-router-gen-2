export type CustomerTier = "wholesale" | "retail";

export interface SearchTermResult {
  id: string;
  title: string;
  searchTerms: string[];
  matchedTerms: string[];
}
