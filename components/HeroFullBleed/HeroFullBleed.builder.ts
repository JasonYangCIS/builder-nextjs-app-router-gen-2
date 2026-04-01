import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import HeroFullBleed from "./HeroFullBleed";

export const heroFullBleedConfig: ComponentConfig = {
  component: HeroFullBleed,
  name: config.components.heroFullBleed,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/maximize.svg",
  excludeModels: [config.models.announcementBar],
  inputs: [
    {
      name: "headline",
      type: "string",
      defaultValue: "A Bold Headline Here",
      helperText: "Main heading displayed over the image",
    },
    {
      name: "copy",
      type: "longText",
      defaultValue:
        "Short supporting copy that reinforces the headline and drives action.",
      helperText: "Supporting paragraph text",
    },
    {
      name: "ctaLabel",
      type: "string",
      defaultValue: "Get Started",
      helperText: "Primary call-to-action button label",
    },
    {
      name: "ctaUrl",
      type: "url",
      defaultValue: "/",
      helperText: "URL the CTA button links to",
    },
    {
      name: "ctaVariant",
      type: "string",
      enum: ["default", "destructive", "outline", "secondary", "ghost"],
      defaultValue: "default",
      helperText: "Button visual style",
    },
    {
      name: "image",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "gif", "webp"],
      defaultValue: "",
      helperText: "Full-bleed background image",
    },
    {
      name: "imageAlt",
      type: "string",
      defaultValue: "",
      helperText: "Descriptive alt text for the background image",
    },
    {
      name: "textAlign",
      type: "string",
      enum: ["left", "center", "right"],
      defaultValue: "center",
      helperText: "Alignment of headline, copy and CTA",
    },
    {
      name: "overlayOpacity",
      type: "number",
      defaultValue: 55,
      helperText:
        "Dark overlay opacity over the image (50–100). Minimum 50 is enforced. Higher values improve contrast — aim for 60+ on bright images.",
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
