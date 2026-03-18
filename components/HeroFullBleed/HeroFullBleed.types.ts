import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface HeroFullBleedProps {
  headline?: string | null;
  copy?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  ctaVariant?: ButtonVariant;
  image?: string | null;
  imageAlt?: string | null;
  textAlign?: "left" | "center" | "right" | null;
  overlayOpacity?: number | null;
}
