import type { RegisteredComponent } from "@builder.io/sdk-react";
import { FormInput } from "./FormInput";

export const formInputConfig: RegisteredComponent = {
  component: FormInput,
  name: "DS Input",
  inputs: [
    {
      name: "label",
      type: "string",
      defaultValue: "Label",
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: "Placeholder",
    },
    {
      name: "type",
      type: "string",
      enum: ["text", "email", "password", "number", "tel", "url", "search"],
      defaultValue: "text",
    },
    {
      name: "helperText",
      type: "string",
      helperText: "Shown below the input when there is no error",
    },
    {
      name: "errorText",
      type: "string",
      helperText: "Shown below the input instead of helper text — sets error state",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: false,
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: false,
    },
  ],
};
