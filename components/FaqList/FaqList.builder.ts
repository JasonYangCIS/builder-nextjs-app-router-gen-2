import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import FaqList from "./FaqList";

export const faqListConfig: ComponentConfig = {
  component: FaqList,
  name: config.components.faqList,
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "Frequently Asked Questions",
      helperText: "Optional section heading displayed above the FAQ entries",
    },
    {
      name: "faqItems",
      type: "list",
      subFields: [
        {
          name: "faqEntry",
          type: "reference",
          model: config.models.faq,
          helperText: "Pick an FAQ entry from the faq data model",
        },
      ],
      defaultValue: [],
      helperText: "Select one or more FAQ entries to display in this section",
    },
  ],
};
