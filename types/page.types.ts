/**
 * Shape of the built-in `page` model's data, extended with the `searchTerms`
 * field used by the /search-term-demo route to query entries by keyword.
 */
export interface PageEntry {
  url?: string | null;
  title?: string | null;
  searchTerms?: string[] | null;
}
