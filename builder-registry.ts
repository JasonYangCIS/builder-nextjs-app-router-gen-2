"use client";
import type { RegisteredComponent } from "@builder.io/sdk-react";
import "@/components/builder/BuilderDesignTokens";
import Counter from "./components/Counter/Counter";
import { Button } from "./components/design-system/Button/Button";
import { Typography } from "./components/design-system/Typography/Typography";
import { Badge } from "./components/design-system/Badge/Badge";
import { Input } from "./components/design-system/Input/Input";
import { Card } from "./components/design-system/Card/Card";
import { Carousel } from "./components/design-system/Carousel/Carousel";

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
    canHaveChildren: true,
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

  {
    component: Carousel,
    name: "DS Carousel",
    canHaveChildren: true,
    childRequirements: {
      message: "You can drop any content here to create carousel slides",
    },
    inputs: [
      {
        name: "slidesPerView",
        type: "number",
        defaultValue: 1,
        helperText: "Number of slides visible at once",
      },
      {
        name: "spaceBetween",
        type: "number",
        defaultValue: 0,
        helperText: "Space between slides in pixels",
      },
      {
        name: "navigation",
        type: "boolean",
        defaultValue: true,
        helperText: "Show navigation arrows",
      },
      {
        name: "pagination",
        type: "boolean",
        defaultValue: true,
        helperText: "Show pagination dots",
      },
      {
        name: "paginationClickable",
        type: "boolean",
        defaultValue: true,
        helperText: "Make pagination dots clickable",
      },
      {
        name: "scrollbar",
        type: "boolean",
        defaultValue: false,
        helperText: "Show scrollbar",
      },
      {
        name: "autoplay",
        type: "boolean",
        defaultValue: false,
        helperText: "Enable autoplay",
      },
      {
        name: "autoplayDelay",
        type: "number",
        defaultValue: 3000,
        helperText: "Autoplay delay in milliseconds",
      },
      {
        name: "pauseOnHover",
        type: "boolean",
        defaultValue: true,
        helperText: "Pause autoplay on hover",
      },
      {
        name: "loop",
        type: "boolean",
        defaultValue: false,
        helperText: "Loop slides continuously",
      },
      {
        name: "effect",
        type: "string",
        enum: ["slide", "fade", "cube", "coverflow", "flip"],
        defaultValue: "slide",
        helperText: "Transition effect",
      },
      {
        name: "direction",
        type: "string",
        enum: ["horizontal", "vertical"],
        defaultValue: "horizontal",
        helperText: "Slide direction",
      },
      {
        name: "centeredSlides",
        type: "boolean",
        defaultValue: false,
        helperText: "Center active slide",
      },
      {
        name: "keyboard",
        type: "boolean",
        defaultValue: true,
        helperText: "Enable keyboard navigation (arrow keys)",
      },
      {
        name: "mousewheel",
        type: "boolean",
        defaultValue: false,
        helperText: "Enable mousewheel control",
      },
      {
        name: "minHeight",
        type: "number",
        defaultValue: 300,
        helperText: "Minimum height in pixels",
      },
    ],
  },
];
