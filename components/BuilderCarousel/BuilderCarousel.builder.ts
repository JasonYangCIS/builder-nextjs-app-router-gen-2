import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import { BuilderCarousel } from "./BuilderCarousel";

export const builderCarouselConfig: ComponentConfig = {
  component: BuilderCarousel,
  name: config.components.carousel,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/play-list.svg",
  excludeModels: [config.models.announcementBar],
  canHaveChildren: true,
  childRequirements: {
    message: "You can drop any content here to create carousel slides",
  },
  inputs: [
    {
      name: "orientation",
      type: "string",
      enum: ["horizontal", "vertical"],
      defaultValue: "horizontal",
      helperText: "Scroll direction",
    },
    {
      name: "loop",
      type: "boolean",
      defaultValue: false,
      helperText: "Loop slides continuously",
    },
    {
      name: "navigation",
      type: "boolean",
      defaultValue: true,
      helperText: "Show previous/next arrow buttons",
    },
    {
      name: "align",
      type: "string",
      enum: ["start", "center", "end"],
      defaultValue: "start",
      helperText: "Alignment of slides in the viewport",
    },
    {
      name: "slidesPerView",
      type: "number",
      defaultValue: 1,
      helperText: "Number of slides visible at once (1–4)",
    },
    {
      name: "autoplay",
      type: "boolean",
      defaultValue: false,
      helperText: "Enable autoplay",
    },
    {
      name: "autoplayDelay",
      type: "number",
      defaultValue: 3000,
      helperText: "Autoplay delay in milliseconds",
    },
    {
      name: "pauseOnHover",
      type: "boolean",
      defaultValue: true,
      helperText: "Pause autoplay on hover",
    },
    {
      name: "minHeight",
      type: "number",
      defaultValue: 300,
      helperText: "Minimum height in pixels",
    },
  ],
};
