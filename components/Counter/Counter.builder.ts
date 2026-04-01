import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import Counter from "./Counter";

export const counterConfig: ComponentConfig = {
  component: Counter,
  name: config.components.counter,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/add-r.svg",
  excludeModels: [config.models.announcementBar],
  inputs: [{ name: "initialCount", type: "number" }],
};
