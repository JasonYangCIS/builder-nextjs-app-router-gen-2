import type { RegisteredComponent } from "@builder.io/sdk-react";
import AnnouncementBar from "./AnnouncementBar";
import { config } from "@/config";

export const announcementBarConfig: RegisteredComponent = {
  component: AnnouncementBar,
  name: "Announcement Bar",
  models: [config.models.announcementBar],
  inputs: [
    {
      name: "message",
      type: "longText",
      defaultValue: "Free shipping on orders over $50 — limited time offer!",
      helperText: "Main announcement text displayed in the bar",
    },
    {
      name: "ctaLabel",
      type: "string",
      defaultValue: "",
      helperText: "Optional call-to-action link label (leave blank to hide)",
    },
    {
      name: "ctaUrl",
      type: "url",
      defaultValue: "",
      helperText: "URL the CTA link points to",
    },
    {
      name: "backgroundColor",
      type: "color",
      defaultValue: "",
      helperText: "Bar background color — leave blank to use the primary brand color",
    },
    {
      name: "textColor",
      type: "color",
      defaultValue: "",
      helperText: "Text and icon color — leave blank to use the primary foreground color",
    },
    {
      name: "countdownEnabled",
      type: "boolean",
      defaultValue: false,
      helperText: "Show a live countdown timer in the bar",
    },
    {
      name: "countdownTargetDate",
      type: "string",
      defaultValue: "",
      helperText:
        "ISO 8601 date-time string the countdown targets — e.g. 2025-12-31T23:59:59. The timer automatically adapts to each visitor's local time zone.",
      showIf: `options.get('countdownEnabled') === true`,
    },
    {
      name: "countdownLabel",
      type: "string",
      defaultValue: "until sale ends",
      helperText: "Short label shown after the timer digits — e.g. 'until sale ends'",
      showIf: `options.get('countdownEnabled') === true`,
    },
    {
      name: "dismissKey",
      type: "string",
      defaultValue: "default",
      helperText:
        "Unique key stored in the visitor's browser. Change this value to re-show the bar to users who previously dismissed it — e.g. 'summer-sale-2025'.",
    },
  ],
};
