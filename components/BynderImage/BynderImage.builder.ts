import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import BynderImage from "./BynderImage";

export const bynderImageConfig: ComponentConfig = {
  component: BynderImage,
  name: config.components.bynderImage,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/image.svg",
  excludeModels: [config.models.announcementBar],
  inputs: [
    {
      name: "bynderAsset",
      friendlyName: "Bynder Asset",
      type: "BynderAsset",
      helperText: "Select an image from Bynder",
    },
    {
      name: "derivative",
      type: "string",
      enum: ["webImage", "thumbnail", "original"],
      defaultValue: "webImage",
      helperText: "Which Bynder derivative to render",
    },
    {
      name: "alt",
      type: "string",
      defaultValue: "",
      helperText: "Descriptive alt text for the image (required for accessibility)",
    },
    {
      name: "caption",
      type: "string",
      defaultValue: "",
      helperText: "Optional caption displayed below the image",
    },
    {
      name: "linkUrl",
      type: "url",
      defaultValue: "",
      helperText: "Optional URL — wraps image in a link",
    },
    {
      name: "priority",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Enable for above-the-fold images to preload. Leave off for others.",
    },
    {
      name: "objectFit",
      type: "string",
      enum: ["cover", "contain"],
      defaultValue: "cover",
      helperText: "How the image fills its container",
    },
    {
      name: "rounded",
      type: "boolean",
      defaultValue: false,
      helperText: "Apply border-radius to the image",
    },
  ],
};
