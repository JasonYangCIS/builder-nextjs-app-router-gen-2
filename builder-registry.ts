"use client";
import type { ComponentConfig } from "@/utils/register-insert-menu";
import "@/components/builder/builder-design-tokens";
import { config } from "@/config";
import { registerInsertMenu } from "@/utils/register-insert-menu";
import { counterConfig } from "@/components/Counter/Counter.builder";
import { buttonConfig } from "@/components/ui/Button/Button.builder";
import { badgeConfig } from "@/components/ui/Badge/Badge.builder";
import { formInputConfig } from "@/components/ui/FormInput/FormInput.builder";
import { cardConfig } from "@/components/ui/Card/Card.builder";
import { textConfig } from "@/components/ui/Text/Text.builder";
import { builderCarouselConfig } from "@/components/BuilderCarousel/BuilderCarousel.builder";
import { heroFullBleedConfig } from "@/components/HeroFullBleed/HeroFullBleed.builder";
import { heroSplitConfig } from "@/components/HeroSplit/HeroSplit.builder";
import { heroCenteredConfig } from "@/components/HeroCentered/HeroCentered.builder";
import { cloudinaryImageConfig } from "@/components/CloudinaryImage/CloudinaryImage.builder";
import { announcementBarConfig } from "@/components/AnnouncementBar/AnnouncementBar.builder";
import { algoliaSearchConfig } from "@/components/Algolia/AlgoliaSearch/AlgoliaSearch.builder";

export const CUSTOM_COMPONENTS: ComponentConfig[] = [
  // ─── General Components ─────────────────────────────────────────────────
  buttonConfig,
  textConfig,
  badgeConfig,
  formInputConfig,
  cardConfig,
  counterConfig,
  builderCarouselConfig,

  // ─── Hero Components ──────────────────────────────────────────────────────
  heroFullBleedConfig,
  heroSplitConfig,
  heroCenteredConfig,

  // ─── Special Components ───────────────────────────────────────────────────
  algoliaSearchConfig,
  cloudinaryImageConfig,

  // ─── Announcement Bar ────────────────────────────────────────────────────
  announcementBarConfig,
];

// ─── Custom Insert Menu ──────────────────────────────────────────────────────
// Organizes components into categorized sections in the Builder visual editor.
// Each component config carries its own model scope (models/excludeModels), so
// items that don't belong in the current model are filtered out automatically.

registerInsertMenu([
  {
    name: "General Components",
    priority: 1,
    items: [
      buttonConfig,
      textConfig,
      badgeConfig,
      formInputConfig,
      cardConfig,
      counterConfig,
      builderCarouselConfig,
    ],
  },
  {
    name: "Hero Components",
    priority: 2,
    items: [heroFullBleedConfig, heroSplitConfig, heroCenteredConfig],
  },
  {
    name: "Special Components",
    priority: 3,
    items: [algoliaSearchConfig, cloudinaryImageConfig],
  },
  {
    name: "Announcement Bar",
    priority: 4,
    allowedModels: [config.models.announcementBar],
    items: [announcementBarConfig],
  },
]);
