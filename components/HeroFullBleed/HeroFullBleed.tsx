import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { sanitizeHref } from "@/utils/url";
import type { HeroFullBleedProps } from "./HeroFullBleed.types";
import styles from "./HeroFullBleed.module.scss";

export type { HeroFullBleedProps } from "./HeroFullBleed.types";

export default function HeroFullBleed({
  headline,
  copy,
  ctaLabel,
  ctaUrl,
  ctaVariant = "default",
  image,
  imageAlt,
  textAlign,
  overlayOpacity,
  priority = false,
  headingLevel,
}: HeroFullBleedProps) {
  // Runtime guard — Builder API can pass arbitrary strings; cast-only checks are compile-time only.
  const Heading: "h1" | "h2" = headingLevel === "h1" ? "h1" : "h2";
  const safeAlign = textAlign ?? "center";
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[safeAlign] ?? "items-center text-center";

  // Enforce a 50% minimum so admins can't accidentally set an overlay too low to be readable.
  const clampedOpacity = Math.min(100, Math.max(50, overlayOpacity ?? 55));

  const safeImage = image ?? "";
  const safeImageAlt = imageAlt ?? "";
  const safeHeadline = headline ?? "";
  const safeCopy = copy ?? "";
  const safeCtaLabel = ctaLabel ?? "";
  const safeCtaUrl = sanitizeHref(ctaUrl ?? "");

  return (
    <section data-testid="hero-fullbleed" className={styles.section}>
      {safeImage ? (
        <Image
          src={safeImage}
          alt={safeImageAlt}
          fill
          sizes="100vw"
          className={styles.image}
          priority={priority ?? false}
        />
      ) : (
        <div
          data-testid="hero-fullbleed-placeholder"
          className={styles.placeholder}
          aria-hidden="true"
        />
      )}

      <div
        data-testid="hero-fullbleed-overlay"
        className={styles.overlay}
        style={{ opacity: clampedOpacity / 100 }}
        aria-hidden="true"
      />

      <div
        data-testid="hero-fullbleed-content"
        className={cn(styles.content, alignClass)}
      >
        {safeHeadline && (
          <Heading className={styles.headline}>{safeHeadline}</Heading>
        )}
        {safeCopy && (
          <p data-testid="hero-fullbleed-copy" className={styles.copy}>
            {safeCopy}
          </p>
        )}
        {safeCtaLabel && safeCtaUrl && (
          <Button
            asChild
            variant={ctaVariant}
            size="lg"
            data-testid="hero-fullbleed-cta"
            className={styles.cta}
          >
            <Link href={safeCtaUrl}>{safeCtaLabel}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
