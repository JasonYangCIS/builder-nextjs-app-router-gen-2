import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { sanitizeHref } from "@/utils/url";
import type { HeroSplitProps } from "./HeroSplit.types";
import styles from "./HeroSplit.module.scss";

export type { HeroSplitProps } from "./HeroSplit.types";

export default function HeroSplit({
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
  headingLevel,
}: HeroSplitProps) {
  const Heading = (headingLevel ?? "h2") as "h1" | "h2";
  const imageOnRight = (imagePosition ?? "right") !== "left";

  const safeImage = image ?? "";
  const safeImageAlt = imageAlt ?? "";
  const safeHeadline = headline ?? "";
  const safeCopy = copy ?? "";
  const safeCtaLabel = ctaLabel ?? "";
  const safeCtaUrl = sanitizeHref(ctaUrl ?? "");
  const safeSecondaryCtaLabel = secondaryCtaLabel ?? "";
  const safeSecondaryCtaUrl = sanitizeHref(secondaryCtaUrl ?? "");

  const contentBlock = (
    <div
      className={cn(
        styles.content,
        !imageOnRight && styles.contentImageLeft,
      )}
    >
      {safeHeadline && (
        <Heading className={styles.headline}>{safeHeadline}</Heading>
      )}
      {safeCopy && (
        <p data-testid="hero-split-copy" className={styles.copy}>
          {safeCopy}
        </p>
      )}
      <div data-testid="hero-split-actions" className={styles.actions}>
        {safeCtaLabel && safeCtaUrl && (
          <Button asChild variant={ctaVariant} size="lg">
            <Link href={safeCtaUrl}>{safeCtaLabel}</Link>
          </Button>
        )}
        {safeSecondaryCtaLabel && safeSecondaryCtaUrl && (
          <Button asChild variant="outline" size="lg">
            <Link href={safeSecondaryCtaUrl}>{safeSecondaryCtaLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );

  // aria-hidden: true hides decorative images from AT;
  // undefined lets the nested alt text be announced normally.
  const imageBlock = (
    <div
      data-testid="hero-split-image-wrapper"
      className={cn(
        styles.imageWrapper,
        imageOnRight
          ? styles.imageWrapperImageRight
          : styles.imageWrapperImageLeft,
      )}
      aria-hidden={safeImageAlt ? undefined : true}
    >
      {safeImage ? (
        <Image
          src={safeImage}
          alt={safeImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
          priority={priority ?? false}
        />
      ) : (
        <div
          data-testid="hero-split-image-placeholder"
          className={styles.imagePlaceholder}
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <section
      data-testid="hero-split"
      data-image-position={imageOnRight ? "right" : "left"}
      className={styles.section}
    >
      {imageOnRight ? (
        <>
          {contentBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {contentBlock}
        </>
      )}
    </section>
  );
}
