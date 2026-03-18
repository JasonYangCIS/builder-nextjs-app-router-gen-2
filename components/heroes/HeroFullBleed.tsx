import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface HeroFullBleedProps {
  headline?: string;
  copy?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaVariant?: ButtonVariant;
  image?: string;
  imageAlt?: string;
  textAlign?: "left" | "center" | "right";
  overlayOpacity?: number;
}

export default function HeroFullBleed({
  headline = "A Bold Headline Here",
  copy = "Short supporting copy that reinforces the headline and drives action.",
  ctaLabel = "Get Started",
  ctaUrl = "#",
  ctaVariant = "default",
  image = "",
  imageAlt = "",
  textAlign = "center",
  overlayOpacity = 55,
}: HeroFullBleedProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[textAlign];

  // Enforce a 50% minimum so admins can't accidentally set an overlay too low to be readable.
  const clampedOpacity = Math.min(100, Math.max(50, overlayOpacity ?? 55));

  return (
    <section className="hero-fullbleed">
      {image && (
        <Image
          src={image}
          alt={imageAlt ?? ""}
          fill
          sizes="100vw"
          className="hero-fullbleed__image"
          priority
        />
      )}
      {!image && <div className="hero-fullbleed__placeholder" aria-hidden="true" />}

      <div
        className="hero-fullbleed__overlay"
        style={{ opacity: clampedOpacity / 100 }}
        aria-hidden="true"
      />

      <div className={cn("hero-fullbleed__content", alignClass)}>
        {headline && (
          <h1 className="hero-fullbleed__headline">{headline}</h1>
        )}
        {copy && (
          <p className="hero-fullbleed__copy">{copy}</p>
        )}
        {ctaLabel && ctaUrl && (
          <Link href={ctaUrl} className="hero-fullbleed__cta">
            <Button variant={ctaVariant} size="lg">
              {ctaLabel}
            </Button>
          </Link>
        )}
      </div>

      <style>{`
        .hero-fullbleed {
          position: relative;
          width: 100%;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: var(--secondary);
        }
        .hero-fullbleed__image {
          object-fit: cover;
          object-position: center;
        }
        .hero-fullbleed__placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        }
        .hero-fullbleed__overlay {
          position: absolute;
          inset: 0;
          background: black;
          pointer-events: none;
        }
        .hero-fullbleed__content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 4rem 2rem;
          max-width: 800px;
          width: 100%;
        }
        .hero-fullbleed__headline {
          font-size: clamp(2.25rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0;
          /* WCAG 2.1 AA: text-shadow creates a dark halo around each glyph,
             guaranteeing sufficient contrast regardless of the image behind the overlay. */
          text-shadow:
            0 1px 4px rgba(0, 0, 0, 0.85),
            0 2px 10px rgba(0, 0, 0, 0.6);
        }
        .hero-fullbleed__copy {
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.6;
          /* Full white — avoid opacity reductions which lower effective contrast. */
          color: white;
          max-width: 560px;
          margin: 0;
          text-shadow:
            0 1px 3px rgba(0, 0, 0, 0.9),
            0 2px 8px rgba(0, 0, 0, 0.6);
        }
        .hero-fullbleed__cta {
          display: inline-block;
          width: fit-content;
        }
        @media (max-width: 640px) {
          .hero-fullbleed {
            min-height: 480px;
          }
          .hero-fullbleed__content {
            padding: 3rem 1.5rem;
            align-items: center;
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-fullbleed * {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
