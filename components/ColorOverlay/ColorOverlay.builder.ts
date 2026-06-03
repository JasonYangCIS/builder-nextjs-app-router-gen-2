import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import ColorOverlay from "./ColorOverlay";

export const colorOverlayConfig: ComponentConfig = {
  component: ColorOverlay,
  name: config.components.colorOverlay,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/color-bucket.svg",
  excludeModels: [config.models.announcementBar],
  canHaveChildren: true,
  childRequirements: {
    message: "Drop any content here — it will be tinted by the overlay.",
  },
  inputs: [
    {
      name: "overlayColor",
      type: "color",
      defaultValue: "#000000",
      helperText: "Color of the tint layer painted over the children.",
    },
    {
      name: "opacity",
      type: "number",
      defaultValue: 0.5,
      min: 0,
      max: 1,
      step: 0.05,
      helperText: "Overlay strength from 0 (invisible) to 1 (opaque).",
    },
    {
      name: "blendMode",
      type: "string",
      enum: ["normal", "multiply", "screen", "overlay", "darken", "lighten"],
      defaultValue: "normal",
      helperText: "How the overlay color blends with the content beneath it.",
    },
    {
      name: "borderRadius",
      type: "number",
      defaultValue: 0,
      helperText: "Rounded corners in px (clips the overlay to match).",
    },
  ],
};
