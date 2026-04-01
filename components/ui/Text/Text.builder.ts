import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import { Text } from "./Text";

export const textConfig: ComponentConfig = {
  component: Text,
  name: config.components.text,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/format-text.svg",
  excludeModels: [config.models.announcementBar],
  inputs: [
    {
      name: "text",
      type: "longText",
      defaultValue: "Your text here",
      required: true,
    },
    {
      name: "variant",
      type: "string",
      enum: [
        "display",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "body-lg", "body", "body-sm",
        "caption", "label", "overline",
      ],
      defaultValue: "body",
    },
    {
      name: "color",
      type: "string",
      enum: ["default", "muted", "subtle", "primary", "success", "warning", "error"],
      defaultValue: "default",
    },
  ],
};
