import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Card } from "./Card";

export const cardConfig: RegisteredComponent = {
  component: Card,
  name: "DS Card",
  canHaveChildren: true,
  inputs: [
    {
      name: "className",
      type: "string",
      helperText: "Additional Tailwind classes (e.g. 'shadow-md p-4')",
    },
  ],
};
