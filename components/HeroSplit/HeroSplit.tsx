import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
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
}: HeroSplitProps) {
  const imageOnRight = (imagePosition ?? "right") !== "left";

  const safeImage = image ?? "";
  const safeImageAlt = imageAlt ?? "";
  const safeHeadline = headline ?? "";
  const safeCopy = copy ?? "";
  const safeCtaLabel = ctaLabel ?? "";
  const safeCtaUrl = ctaUrl ?? "";
  const safeSecondaryCtaLabel = secondaryCtaLabel ?? "";
  const safeSecondaryCtaUrl = secondaryCtaUrl ?? "";

  const contentBlock = (
    <div
      className={cn(
        styles.content,
        !imageOnRight && styles.contentImageLeft,
      )}
    >
      {safeHeadline && (
        <h1 className={styles.headline}>{safeHeadline}</h1>
      )}
      {safeCopy && (
        <p data-testid="hero-split-copy" className={styles.copy}>
          {safeCopy}
        </p>
      )}
      <div data-testid="hero-split-actions" className={styles.actions}>
        {safeCtaLabel && safeCtaUrl && (
          <Link href={safeCtaUrl}>
            <Button variant={ctaVariant} size="lg">
              {safeCtaLabel}
            </Button>
          </Link>
        )}
        {safeSecondaryCtaLabel && safeSecondaryCtaUrl && (
          <Link href={safeSecondaryCtaUrl}>
            <Button variant="outline" size="lg">
              {safeSecondaryCtaLabel}
            </Button>
          </Link>
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
          priority
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
