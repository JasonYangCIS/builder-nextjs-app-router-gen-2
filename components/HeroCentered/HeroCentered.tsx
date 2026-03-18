import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sanitizeHref } from "@/utils/url";
import type { HeroCenteredProps } from "./HeroCentered.types";
import styles from "./HeroCentered.module.scss";

export type { HeroCenteredProps } from "./HeroCentered.types";

export default function HeroCentered({
  badgeLabel,
  headline,
  copy,
  ctaLabel,
  ctaUrl,
  ctaVariant = "default",
  secondaryCtaLabel,
  secondaryCtaUrl,
  image,
  imageAlt,
  imagePosition,
  priority = false,
}: HeroCenteredProps) {
  const safeImage = image ?? "";
  const safeImageAlt = imageAlt ?? "";
  const safeHeadline = headline ?? "";
  const safeCopy = copy ?? "";
  const safeBadge = badgeLabel ?? "";
  const safeCtaLabel = ctaLabel ?? "";
  const safeCtaUrl = sanitizeHref(ctaUrl ?? "");
  const safeSecondaryCtaLabel = secondaryCtaLabel ?? "";
  const safeSecondaryCtaUrl = sanitizeHref(secondaryCtaUrl ?? "");
  const safeImagePosition = imagePosition ?? "below";

  // Image frame always renders — shows placeholder when no image URL is provided.
  const imageFrame = (
    <div data-testid="hero-centered-image-frame" className={styles.imageFrame}>
      {safeImage ? (
        <Image
          src={safeImage}
          alt={safeImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className={styles.image}
          priority={priority ?? false}
        />
      ) : (
        <div
          data-testid="hero-centered-image-placeholder"
          className={styles.imagePlaceholder}
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <section data-testid="hero-centered" className={styles.section}>
      <div data-testid="hero-centered-inner" className={styles.inner}>
        {safeImagePosition === "above" && imageFrame}

        <div data-testid="hero-centered-text-block" className={styles.textBlock}>
          {safeBadge && (
            <div
              data-testid="hero-centered-badge-wrapper"
              className={styles.badgeWrapper}
            >
              <Badge variant="secondary">{safeBadge}</Badge>
            </div>
          )}

          {safeHeadline && (
            <h1 className={styles.headline}>{safeHeadline}</h1>
          )}
          {safeCopy && (
            <p data-testid="hero-centered-copy" className={styles.copy}>
              {safeCopy}
            </p>
          )}

          <div data-testid="hero-centered-actions" className={styles.actions}>
            {safeCtaLabel && safeCtaUrl && (
              <Button asChild variant={ctaVariant} size="lg">
                <Link href={safeCtaUrl}>{safeCtaLabel}</Link>
              </Button>
            )}
            {safeSecondaryCtaLabel && safeSecondaryCtaUrl && (
              <Button asChild variant="ghost" size="lg">
                <Link href={safeSecondaryCtaUrl}>{safeSecondaryCtaLabel} →</Link>
              </Button>
            )}
          </div>
        </div>

        {safeImagePosition === "below" && imageFrame}
      </div>
    </section>
  );
}
