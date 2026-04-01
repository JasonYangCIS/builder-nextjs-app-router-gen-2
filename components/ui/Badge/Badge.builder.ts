import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Badge } from "./Badge";

export const badgeConfig: RegisteredComponent = {
  component: Badge,
  name: "DS Badge",
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
