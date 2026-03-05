"use client";
import type { RegisteredComponent } from "@builder.io/sdk-react";
import Counter from "./components/Counter/Counter";

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  {
    component: Counter,
    name: "Counter",
    inputs: [
      {
        name: "initialCount",
        type: "number",
      },
    ],
  },
];
