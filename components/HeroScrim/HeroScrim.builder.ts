import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import HeroScrim from "./HeroScrim";

export const heroScrimConfig: ComponentConfig = {
  component: HeroScrim,
  name: config.components.heroScrim,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/maximize.svg",
  excludeModels: [config.models.announcementBar],
  inputs: [
    {
      name: "brandName",
      type: "string",
      defaultValue: "Wilder House",
      helperText: "Brand name shown in the top-left lockup",
    },
    {
      name: "eyebrow",
      type: "string",
      defaultValue: "A quieter kind of escape",
      helperText: "Short label displayed above the headline",
    },
    {
      name: "headline",
      type: "string",
      defaultValue: "Find your place in the wild.",
      helperText: "Main heading displayed over the image",
    },
    {
      name: "copy",
      type: "longText",
      defaultValue:
        "A secluded forest cabin for slow mornings, open trails, and evenings warmed by the fire.",
      helperText: "Supporting paragraph text",
    },
    {
      name: "ctaLabel",
      type: "string",
      defaultValue: "Explore stays",
      helperText: "CTA button label",
    },
    {
      name: "ctaUrl",
      type: "url",
      defaultValue: "/",
      helperText: "URL the CTA button links to",
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
      defaultValue: "h1",
      helperText:
        "Use h1 for the primary page headline. Use h2 when other heroes are stacked on the same page.",
    },
  ],
};
