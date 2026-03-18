"use client";
import type { RegisteredComponent } from "@builder.io/sdk-react";
import "@/components/builder/BuilderDesignTokens";
import Counter from "./components/Counter/Counter";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { FormInput } from "./components/ui/form-input";
import { Card } from "./components/ui/card";
import { Text } from "./components/ui/text";
import { BuilderCarousel } from "./components/builder/BuilderCarousel";
import HeroFullBleed from "./components/heroes/HeroFullBleed";
import HeroSplit from "./components/heroes/HeroSplit";
import HeroCentered from "./components/heroes/HeroCentered";

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  // ─── Existing ────────────────────────────────────────────────────────────
  {
    component: Counter,
    name: "Counter",
    inputs: [{ name: "initialCount", type: "number" }],
  },

  // ─── shadcn/ui Components ─────────────────────────────────────────────────
  {
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
  },

  {
    component: Text,
    name: "DS Text",
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
    ],
  },

  {
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
  },

  {
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
  },

  {
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
  },

  {
    component: BuilderCarousel,
    name: "DS Carousel",
    canHaveChildren: true,
    childRequirements: {
      message: "You can drop any content here to create carousel slides",
    },
    inputs: [
      {
        name: "orientation",
        type: "string",
        enum: ["horizontal", "vertical"],
        defaultValue: "horizontal",
        helperText: "Scroll direction",
      },
      {
        name: "loop",
        type: "boolean",
        defaultValue: false,
        helperText: "Loop slides continuously",
      },
      {
        name: "navigation",
        type: "boolean",
        defaultValue: true,
        helperText: "Show previous/next arrow buttons",
      },
      {
        name: "align",
        type: "string",
        enum: ["start", "center", "end"],
        defaultValue: "start",
        helperText: "Alignment of slides in the viewport",
      },
      {
        name: "slidesPerView",
        type: "number",
        defaultValue: 1,
        helperText: "Number of slides visible at once (1–4)",
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
        name: "minHeight",
        type: "number",
        defaultValue: 300,
        helperText: "Minimum height in pixels",
      },
    ],
  },

  // ─── Hero Components ──────────────────────────────────────────────────────

  {
    component: HeroFullBleed,
    name: "Hero: Full Bleed",
    inputs: [
      {
        name: "headline",
        type: "string",
        defaultValue: "A Bold Headline Here",
        helperText: "Main heading displayed over the image",
      },
      {
        name: "copy",
        type: "longText",
        defaultValue: "Short supporting copy that reinforces the headline and drives action.",
        helperText: "Supporting paragraph text",
      },
      {
        name: "ctaLabel",
        type: "string",
        defaultValue: "Get Started",
        helperText: "Primary call-to-action button label",
      },
      {
        name: "ctaUrl",
        type: "url",
        defaultValue: "/",
        helperText: "URL the CTA button links to",
      },
      {
        name: "ctaVariant",
        type: "string",
        enum: ["default", "destructive", "outline", "secondary", "ghost"],
        defaultValue: "default",
        helperText: "Button visual style",
      },
      {
        name: "image",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "svg", "gif", "webp"],
        defaultValue: "",
        helperText: "Full-bleed background image",
      },
      {
        name: "imageAlt",
        type: "string",
        defaultValue: "",
        helperText: "Descriptive alt text for the background image",
      },
      {
        name: "textAlign",
        type: "string",
        enum: ["left", "center", "right"],
        defaultValue: "center",
        helperText: "Alignment of headline, copy and CTA",
      },
      {
        name: "overlayOpacity",
        type: "number",
        defaultValue: 55,
        helperText: "Dark overlay opacity over the image (50–100). Minimum 50 is enforced for WCAG 2.1 AA compliance.",
      },
    ],
  },

  {
    component: HeroSplit,
    name: "Hero: Split",
    inputs: [
      {
        name: "headline",
        type: "string",
        defaultValue: "Split Layout Hero Headline",
        helperText: "Main heading text",
      },
      {
        name: "copy",
        type: "longText",
        defaultValue: "Supporting copy that sits alongside the image.",
        helperText: "Supporting paragraph text",
      },
      {
        name: "ctaLabel",
        type: "string",
        defaultValue: "Get Started",
        helperText: "Primary CTA button label",
      },
      {
        name: "ctaUrl",
        type: "url",
        defaultValue: "/",
        helperText: "URL the primary CTA links to",
      },
      {
        name: "ctaVariant",
        type: "string",
        enum: ["default", "destructive", "outline", "secondary", "ghost"],
        defaultValue: "default",
        helperText: "Primary button visual style",
      },
      {
        name: "secondaryCtaLabel",
        type: "string",
        defaultValue: "",
        helperText: "Optional secondary CTA label (leave blank to hide)",
      },
      {
        name: "secondaryCtaUrl",
        type: "url",
        defaultValue: "",
        helperText: "URL the secondary CTA links to",
      },
      {
        name: "image",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "svg", "gif", "webp"],
        defaultValue: "",
        helperText: "Image displayed in the split panel",
      },
      {
        name: "imageAlt",
        type: "string",
        defaultValue: "",
        helperText: "Descriptive alt text for the image",
      },
      {
        name: "imagePosition",
        type: "string",
        enum: ["left", "right"],
        defaultValue: "right",
        helperText: "Which side the image appears on",
      },
    ],
  },

  {
    component: HeroCentered,
    name: "Hero: Centered",
    inputs: [
      {
        name: "badgeLabel",
        type: "string",
        defaultValue: "",
        helperText: "Optional badge label above the headline (leave blank to hide)",
      },
      {
        name: "headline",
        type: "string",
        defaultValue: "Simple. Focused. Effective.",
        helperText: "Main heading text",
      },
      {
        name: "copy",
        type: "longText",
        defaultValue: "Clean, centered layout that puts the message first.",
        helperText: "Supporting paragraph text",
      },
      {
        name: "ctaLabel",
        type: "string",
        defaultValue: "Get Started",
        helperText: "Primary CTA button label",
      },
      {
        name: "ctaUrl",
        type: "url",
        defaultValue: "/",
        helperText: "URL the primary CTA links to",
      },
      {
        name: "ctaVariant",
        type: "string",
        enum: ["default", "destructive", "outline", "secondary", "ghost"],
        defaultValue: "default",
        helperText: "Primary button visual style",
      },
      {
        name: "secondaryCtaLabel",
        type: "string",
        defaultValue: "",
        helperText: "Optional secondary CTA label (leave blank to hide)",
      },
      {
        name: "secondaryCtaUrl",
        type: "url",
        defaultValue: "",
        helperText: "URL the secondary CTA links to",
      },
      {
        name: "image",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "svg", "gif", "webp"],
        defaultValue: "",
        helperText: "Feature image displayed above or below the text",
      },
      {
        name: "imageAlt",
        type: "string",
        defaultValue: "",
        helperText: "Descriptive alt text for the image",
      },
      {
        name: "imagePosition",
        type: "string",
        enum: ["above", "below"],
        defaultValue: "below",
        helperText: "Whether the image appears above or below the headline block",
      },
    ],
  },
];
