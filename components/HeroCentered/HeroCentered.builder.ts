import type { RegisteredComponent } from "@builder.io/sdk-react";
import HeroCentered from "./HeroCentered";

export const heroCenteredConfig: RegisteredComponent = {
  component: HeroCentered,
  name: "Hero: Centered",
  inputs: [
    {
      name: "badgeLabel",
      type: "string",
      defaultValue: "",
      helperText: "Optional badge label above the headline (leave blank to hide)",
    },
    {
      name: "headline",
      type: "string",
      defaultValue: "Simple. Focused. Effective.",
      helperText: "Main heading text",
    },
    {
      name: "copy",
      type: "longText",
      defaultValue: "Clean, centered layout that puts the message first.",
      helperText: "Supporting paragraph text",
    },
    {
      name: "ctaLabel",
      type: "string",
      defaultValue: "Get Started",
      helperText: "Primary CTA button label",
    },
    {
      name: "ctaUrl",
      type: "url",
      defaultValue: "/",
      helperText: "URL the primary CTA links to",
    },
    {
      name: "ctaVariant",
      type: "string",
      enum: ["default", "destructive", "outline", "secondary", "ghost"],
      defaultValue: "default",
      helperText: "Primary button visual style",
    },
    {
      name: "secondaryCtaLabel",
      type: "string",
      defaultValue: "",
      helperText: "Optional secondary CTA label (leave blank to hide)",
    },
    {
      name: "secondaryCtaUrl",
      type: "url",
      defaultValue: "",
      helperText: "URL the secondary CTA links to",
    },
    {
      name: "image",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "gif", "webp"],
      defaultValue: "",
      helperText: "Feature image displayed above or below the text",
    },
    {
      name: "imageAlt",
      type: "string",
      defaultValue: "",
      helperText: "Descriptive alt text for the image",
    },
    {
      name: "imagePosition",
      type: "string",
      enum: ["above", "below"],
      defaultValue: "below",
      helperText:
        "Whether the image appears above or below the headline block",
    },
  ],
};
