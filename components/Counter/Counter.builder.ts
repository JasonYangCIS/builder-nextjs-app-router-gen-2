import type { RegisteredComponent } from "@builder.io/sdk-react";
import Counter from "./Counter";

export const counterConfig: RegisteredComponent = {
  component: Counter,
  name: "Counter",
  inputs: [{ name: "initialCount", type: "number" }],
};
