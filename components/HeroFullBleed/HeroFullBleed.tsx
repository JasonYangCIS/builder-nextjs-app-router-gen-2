import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
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
  priority = false,
  headingLevel,
}: HeroFullBleedProps) {
  const Heading: "h1" | "h2" = headingLevel === "h1" ? "h1" : "h2";
  const safeAlign = textAlign ?? "left";
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[safeAlign] ?? "items-start text-left";

  const safeImage = image ?? "";
  const safeImageAlt = imageAlt ?? "";
  const safeHeadline = headline ?? "";
  const safeCopy = copy ?? "";
  const safeCtaLabel = ctaLabel ?? "";
  const safeCtaUrl = sanitizeHref(ctaUrl ?? "");

  return (
    <section data-testid="hero-fullbleed" className={styles.section}>
      <div className={styles.imageColumn}>
        {safeImage ? (
          <Image
            src={safeImage}
            alt={safeImageAlt}
            fill
            sizes="50vw"
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
      </div>

      <div
        data-testid="hero-fullbleed-content"
        className={cn(styles.contentColumn, alignClass)}
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
