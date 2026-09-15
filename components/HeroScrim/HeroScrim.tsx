import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanitizeHref } from "@/utils/url";
import type { HeroScrimProps } from "./HeroScrim.types";
import styles from "./HeroScrim.module.scss";

export type { HeroScrimProps } from "./HeroScrim.types";

export default function HeroScrim({
  brandName,
  eyebrow,
  headline,
  copy,
  ctaLabel,
  ctaUrl,
  image,
  imageAlt,
  priority = false,
  headingLevel,
}: HeroScrimProps) {
  // Runtime guard — Builder API can pass arbitrary strings; cast-only checks are compile-time only.
  const Heading: "h1" | "h2" = headingLevel === "h1" ? "h1" : "h2";

  const safeImage = image ?? "";
  const safeImageAlt = imageAlt ?? "";
  const safeBrandName = brandName ?? "";
  const safeEyebrow = eyebrow ?? "";
  const safeHeadline = headline ?? "";
  const safeCopy = copy ?? "";
  const safeCtaLabel = ctaLabel ?? "";
  const safeCtaUrl = sanitizeHref(ctaUrl ?? "");

  return (
    <section data-testid="hero-scrim" className={styles.section}>
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
          data-testid="hero-scrim-placeholder"
          className={styles.placeholder}
          aria-hidden="true"
        />
      )}

      <div
        data-testid="hero-scrim-overlay"
        className={styles.overlay}
        aria-hidden="true"
      />

      <div data-testid="hero-scrim-content" className={styles.content}>
        {safeBrandName && (
          <div data-testid="hero-scrim-brand" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true" />
            <span className={styles.brandName}>{safeBrandName}</span>
          </div>
        )}

        <div className={styles.copyBlock}>
          <div className={styles.message}>
            {safeEyebrow && (
              <p className={styles.eyebrow}>{safeEyebrow}</p>
            )}
            {safeHeadline && (
              <Heading className={styles.headline}>{safeHeadline}</Heading>
            )}
            {safeCopy && (
              <p data-testid="hero-scrim-copy" className={styles.copy}>
                {safeCopy}
              </p>
            )}
          </div>

          {safeCtaLabel && safeCtaUrl && (
            <Link
              href={safeCtaUrl}
              data-testid="hero-scrim-cta"
              className={styles.cta}
            >
              {safeCtaLabel}
              <ArrowRight aria-hidden="true" className={styles.ctaIcon} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
