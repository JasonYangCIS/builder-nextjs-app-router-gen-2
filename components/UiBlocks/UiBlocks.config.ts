import type { ComponentConfig } from "@/utils/register-insert-menu";
import { config } from "@/config";
import { UiBlocks } from "./UiBlocks";

export const uiBlocksConfig: ComponentConfig = {
  component: UiBlocks,
  name: config.components.uiBlocks,
  image: "https://unpkg.com/css.gg@2.0.0/icons/svg/box.svg",
  excludeModels: [config.models.announcementBar],
  shouldReceiveBuilderProps: {
    builderBlock: true,
  },
  // @TODO - how to configure child blocks limitations/requirements?
  // canHaveChildren: true,
  // childRequirements: {
  //   message: "You can drop any content here to create UI blocks",
  //   query: {
  //     'component.name': {
  //       $in: [config.components.text, config.components.button],
  //     },
  //   },
  // },
  inputs: [
    {
      name: "childBlocks1",
      type: "uiBlocks",
      defaultValue: [],
    },
    {
      name: "childBlocks2",
      type: "uiBlocks",
      defaultValue: [],
    }
  ]
};
