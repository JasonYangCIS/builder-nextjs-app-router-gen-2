import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import HeroCentered from "./HeroCentered";

export const heroCenteredConfig: ComponentConfig = {
  component: HeroCentered,
  name: config.components.heroCentered,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/format-center.svg",
  excludeModels: [config.models.announcementBar],
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
    {
      name: "priority",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Enable for the first (LCP) hero on the page to preload the image. Leave off for all other instances.",
    },
    {
      name: "headingLevel",
      type: "string",
      enum: ["h1", "h2"],
      defaultValue: "h2",
      helperText:
        "Use h1 for the primary page headline. Use h2 when other heroes are stacked on the same page.",
    },
  ],
};
