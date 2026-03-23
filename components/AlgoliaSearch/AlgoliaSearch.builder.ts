import type { RegisteredComponent } from "@builder.io/sdk-react";
import AlgoliaSearch from "./AlgoliaSearch";

export const algoliaSearchConfig: RegisteredComponent = {
  component: AlgoliaSearch,
  name: "Algolia Search",
  inputs: [
    {
      name: "placeholder",
      type: "string",
      defaultValue: "Search pages…",
      helperText: "Placeholder text shown inside the search input",
    },
    {
      name: "indexName",
      type: "string",
      defaultValue: "builder-page",
      helperText: "Algolia index to query (must match your Builder.io Algolia plugin index name)",
    },
    {
      name: "maxResults",
      type: "number",
      defaultValue: 6,
      helperText: "Maximum number of results to display",
    },
    {
      name: "noResultsMessage",
      type: "string",
      defaultValue: "No results found.",
      helperText: "Message shown when the query returns zero results",
    },
    {
      name: "searchLabel",
      type: "string",
      defaultValue: "Search",
      helperText: "Accessible label for the search region (screen readers)",
    },
  ],
};
