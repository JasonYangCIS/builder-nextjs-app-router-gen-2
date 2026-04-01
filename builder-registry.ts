"use client";
import type { RegisteredComponent } from "@builder.io/sdk-react";
import "@/components/builder/BuilderDesignTokens";
import { counterConfig } from "@/components/Counter/Counter.builder";
import { buttonConfig } from "@/components/ui/Button/Button.builder";
import { badgeConfig } from "@/components/ui/Badge/Badge.builder";
import { formInputConfig } from "@/components/ui/FormInput/FormInput.builder";
import { cardConfig } from "@/components/ui/Card/Card.builder";
import { textConfig } from "@/components/ui/Text/Text.builder";
import { builderCarouselConfig } from "@/components/builder/BuilderCarousel.builder";
import { heroFullBleedConfig } from "@/components/HeroFullBleed/HeroFullBleed.builder";
import { heroSplitConfig } from "@/components/HeroSplit/HeroSplit.builder";
import { heroCenteredConfig } from "@/components/HeroCentered/HeroCentered.builder";
import { cloudinaryImageConfig } from "@/components/CloudinaryImage/CloudinaryImage.builder";
import { announcementBarConfig } from "@/components/AnnouncementBar/AnnouncementBar.builder";
import { algoliaSearchConfig } from "@/components/Algolia/AlgoliaSearch/AlgoliaSearch.builder";

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
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
