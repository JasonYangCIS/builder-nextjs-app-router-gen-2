import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Text } from "./Text";

export const textConfig: RegisteredComponent = {
  component: Text,
  name: "DS Text",
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
