import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface HeroSplitProps {
  headline?: string;
  copy?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaVariant?: ButtonVariant;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export default function HeroSplit({
  headline = "Split Layout Hero Headline",
  copy = "Supporting copy that sits alongside the image. Great for feature announcements or product showcases.",
  ctaLabel = "Get Started",
  ctaUrl = "#",
  ctaVariant = "default",
  secondaryCtaLabel = "",
  secondaryCtaUrl = "",
  image = "",
  imageAlt = "",
  imagePosition = "right",
}: HeroSplitProps) {
  const imageOnRight = imagePosition !== "left";

  const contentBlock = (
    <div className="hero-split__content">
      <h1 className="hero-split__headline">{headline}</h1>
      <p className="hero-split__copy">{copy}</p>
      <div className="hero-split__actions">
        {ctaLabel && ctaUrl && (
          <Link href={ctaUrl}>
            <Button variant={ctaVariant} size="lg">
              {ctaLabel}
            </Button>
          </Link>
        )}
        {secondaryCtaLabel && secondaryCtaUrl && (
          <Link href={secondaryCtaUrl}>
            <Button variant="outline" size="lg">
              {secondaryCtaLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  const imageBlock = (
    <div className="hero-split__image-wrapper" aria-hidden={!imageAlt}>
      {image ? (
        <Image
          src={image}
          alt={imageAlt ?? ""}
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
    <section className={cn("hero-split", imageOnRight ? "hero-split--image-right" : "hero-split--image-left")}>
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
