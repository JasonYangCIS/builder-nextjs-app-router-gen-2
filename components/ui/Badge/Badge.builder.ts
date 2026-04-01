import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import { Badge } from "./Badge";

export const badgeConfig: ComponentConfig = {
  component: Badge,
  name: config.components.badge,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/tag.svg",
  excludeModels: [config.models.announcementBar],
  canHaveChildren: true,
  inputs: [
    {
      name: "variant",
      type: "string",
      enum: ["default", "secondary", "destructive", "outline"],
      defaultValue: "secondary",
      helperText: "default=primary filled, secondary=muted, destructive=error, outline=bordered",
    },
  ],
};
