import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/Button/Button";

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface HeroCenteredProps {
  badgeLabel?: string | null;
  headline?: string | null;
  copy?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  ctaVariant?: ButtonVariant;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  imagePosition?: "above" | "below" | null;
  priority?: boolean | null;
  headingLevel?: "h1" | "h2" | null;
}
