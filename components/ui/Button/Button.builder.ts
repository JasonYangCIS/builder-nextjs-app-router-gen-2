import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Button } from "./Button";

export const buttonConfig: RegisteredComponent = {
  component: Button,
  name: "DS Button",
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
