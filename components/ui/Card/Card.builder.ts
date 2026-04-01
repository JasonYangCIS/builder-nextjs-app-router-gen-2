import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import { Card } from "./Card";

export const cardConfig: ComponentConfig = {
  component: Card,
  name: config.components.card,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/card-diamonds.svg",
  excludeModels: [config.models.announcementBar],
  canHaveChildren: true,
  inputs: [
    {
      name: "className",
      type: "string",
      helperText: "Additional Tailwind classes (e.g. 'shadow-md p-4')",
    },
  ],
};
