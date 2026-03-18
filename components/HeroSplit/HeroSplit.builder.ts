import type { RegisteredComponent } from "@builder.io/sdk-react";
import HeroSplit from "./HeroSplit";

export const heroSplitConfig: RegisteredComponent = {
  component: HeroSplit,
  name: "Hero: Split",
  inputs: [
    {
      name: "headline",
      type: "string",
      defaultValue: "Split Layout Hero Headline",
      helperText: "Main heading text",
    },
    {
      name: "copy",
      type: "longText",
      defaultValue: "Supporting copy that sits alongside the image.",
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
      helperText: "Image displayed in the split panel",
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
      enum: ["left", "right"],
      defaultValue: "right",
      helperText: "Which side the image appears on",
    },
    {
      name: "priority",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Enable for the first (LCP) hero on the page to preload the image. Leave off for all other instances.",
    },
  ],
};
