"use client";
import type { RegisteredComponent } from "@builder.io/sdk-react";
import Counter from "./components/Counter/Counter";
import { Button } from "./components/design-system/Button/Button";
import { Typography } from "./components/design-system/Typography/Typography";
import { Badge } from "./components/design-system/Badge/Badge";
import { Input } from "./components/design-system/Input/Input";
import { Card } from "./components/design-system/Card/Card";

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  // ─── Existing ────────────────────────────────────────────────────────────
  {
    component: Counter,
    name: "Counter",
    inputs: [{ name: "initialCount", type: "number" }],
  },

  // ─── Design System ────────────────────────────────────────────────────────
  {
    component: Button,
    name: "DS Button",
    inputs: [
      {
        name: "label",
        type: "string",
        defaultValue: "Click me",
        required: true,
      },
      {
        name: "variant",
        type: "string",
        enum: ["primary", "secondary", "ghost", "destructive"],
        defaultValue: "primary",
      },
      {
        name: "size",
        type: "string",
        enum: ["sm", "md", "lg"],
        defaultValue: "md",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
      },
      {
        name: "loading",
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
  },

  {
    component: Typography,
    name: "DS Typography",
    inputs: [
      {
        name: "text",
        type: "longText",
        defaultValue: "Your text here",
        required: true,
      },
      {
        name: "variant",
        type: "string",
        enum: [
          "display",
          "h1", "h2", "h3", "h4", "h5", "h6",
          "body-lg", "body", "body-sm",
          "caption", "label", "overline",
        ],
        defaultValue: "body",
      },
      {
        name: "color",
        type: "string",
        enum: ["default", "muted", "subtle", "primary", "success", "warning", "error"],
        defaultValue: "default",
      },
      {
        name: "weight",
        type: "string",
        enum: ["normal", "medium", "semibold", "bold"],
        helperText: "Overrides the default weight for the chosen variant",
      },
      {
        name: "align",
        type: "string",
        enum: ["left", "center", "right"],
        defaultValue: "left",
      },
    ],
  },

  {
    component: Badge,
    name: "DS Badge",
    inputs: [
      {
        name: "label",
        type: "string",
        defaultValue: "Badge",
        required: true,
      },
      {
        name: "variant",
        type: "string",
        enum: ["neutral", "primary", "success", "warning", "error"],
        defaultValue: "neutral",
      },
      {
        name: "size",
        type: "string",
        enum: ["sm", "md"],
        defaultValue: "md",
      },
    ],
  },

  {
    component: Input,
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
  },

  {
    component: Card,
    name: "DS Card",
    canHaveChildren: true,
    inputs: [
      {
        name: "padding",
        type: "string",
        enum: ["none", "sm", "md", "lg"],
        defaultValue: "md",
      },
      {
        name: "shadow",
        type: "string",
        enum: ["none", "sm", "md", "lg"],
        defaultValue: "sm",
      },
      {
        name: "borderless",
        type: "boolean",
        defaultValue: false,
      },
    ],
  },
];
