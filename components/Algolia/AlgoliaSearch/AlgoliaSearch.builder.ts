import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import AlgoliaSearch from "./AlgoliaSearch";

export const algoliaSearchConfig: ComponentConfig = {
  component: AlgoliaSearch,
  name: config.components.algoliaSearch,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/search.svg",
  excludeModels: [config.models.announcementBar],
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
