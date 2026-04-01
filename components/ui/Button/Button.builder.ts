import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import { Button } from "./Button";

export const buttonConfig: ComponentConfig = {
  component: Button,
  name: config.components.button,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/toggle-square.svg",
  excludeModels: [config.models.announcementBar],
  canHaveChildren: true,
  inputs: [
    {
      name: "variant",
      type: "string",
      enum: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      defaultValue: "default",
      helperText: "default=filled primary, outline=bordered, ghost=transparent",
    },
    {
      name: "size",
      type: "string",
      enum: ["default", "sm", "lg", "icon"],
      defaultValue: "default",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: false,
    },
    {
      name: "type",
      type: "string",
      enum: ["button", "submit", "reset"],
      defaultValue: "button",
    },
  ],
};
