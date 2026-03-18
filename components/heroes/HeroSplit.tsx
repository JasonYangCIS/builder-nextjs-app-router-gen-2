import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface HeroSplitProps {
  headline?: string | null;
  copy?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  ctaVariant?: ButtonVariant;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  imagePosition?: "left" | "right" | null;
}

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
    <div className="hero-split__content">
      {safeHeadline && (
        <h1 className="hero-split__headline">{safeHeadline}</h1>
      )}
      {safeCopy && (
        <p className="hero-split__copy">{safeCopy}</p>
      )}
      <div className="hero-split__actions">
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
      className="hero-split__image-wrapper"
      aria-hidden={safeImageAlt ? undefined : true}
    >
      {safeImage ? (
        <Image
          src={safeImage}
          alt={safeImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="hero-split__image"
          priority
        />
      ) : (
        <div className="hero-split__image-placeholder" aria-hidden="true" />
      )}
    </div>
  );

  return (
    <section
      className={cn(
        "hero-split",
        imageOnRight ? "hero-split--image-right" : "hero-split--image-left",
      )}
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

      <style>{`
        .hero-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
          overflow: hidden;
          background-color: var(--background);
        }
        .hero-split__content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.75rem;
          padding: 4rem 4rem 4rem 5rem;
        }
        .hero-split--image-left .hero-split__content {
          padding: 4rem 5rem 4rem 4rem;
        }
        .hero-split__headline {
          font-size: clamp(2rem, 3.5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--foreground);
          margin: 0;
        }
        .hero-split__copy {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--muted-foreground);
          margin: 0;
          max-width: 480px;
        }
        .hero-split__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
        }
        .hero-split__image-wrapper {
          position: relative;
          overflow: hidden;
          background-color: var(--secondary);
        }
        .hero-split__image {
          object-fit: cover;
          object-position: center;
        }
        .hero-split__image-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          opacity: 0.25;
        }
        @media (max-width: 768px) {
          .hero-split {
            grid-template-columns: 1fr;
            min-height: unset;
          }
          .hero-split__image-wrapper {
            min-height: 300px;
          }
          .hero-split--image-right .hero-split__image-wrapper {
            order: -1;
          }
          .hero-split__content,
          .hero-split--image-left .hero-split__content {
            padding: 3rem 1.5rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-split * {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
