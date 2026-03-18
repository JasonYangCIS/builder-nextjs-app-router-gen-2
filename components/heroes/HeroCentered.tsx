import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

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
}

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
}: HeroCenteredProps) {
  const safeImage = image ?? "";
  const safeImageAlt = imageAlt ?? "";
  const safeHeadline = headline ?? "";
  const safeCopy = copy ?? "";
  const safeBadge = badgeLabel ?? "";
  const safeCtaLabel = ctaLabel ?? "";
  const safeCtaUrl = ctaUrl ?? "";
  const safeSecondaryCtaLabel = secondaryCtaLabel ?? "";
  const safeSecondaryCtaUrl = secondaryCtaUrl ?? "";
  const safeImagePosition = imagePosition ?? "below";

  // Image frame always renders — shows placeholder when no image URL is provided.
  const imageFrame = (
    <div className="hero-centered__image-frame">
      {safeImage ? (
        <Image
          src={safeImage}
          alt={safeImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="hero-centered__image"
          priority
        />
      ) : (
        <div className="hero-centered__image-placeholder" aria-hidden="true" />
      )}
    </div>
  );

  return (
    <section className="hero-centered">
      <div className="hero-centered__inner">
        {safeImagePosition === "above" && imageFrame}

        <div className="hero-centered__text-block">
          {safeBadge && (
            <div className="hero-centered__badge-wrapper">
              <Badge variant="secondary">{safeBadge}</Badge>
            </div>
          )}

          {safeHeadline && (
            <h1 className="hero-centered__headline">{safeHeadline}</h1>
          )}
          {safeCopy && (
            <p className="hero-centered__copy">{safeCopy}</p>
          )}

          <div className="hero-centered__actions">
            {safeCtaLabel && safeCtaUrl && (
              <Link href={safeCtaUrl}>
                <Button variant={ctaVariant} size="lg">
                  {safeCtaLabel}
                </Button>
              </Link>
            )}
            {safeSecondaryCtaLabel && safeSecondaryCtaUrl && (
              <Link href={safeSecondaryCtaUrl}>
                <Button variant="ghost" size="lg">
                  {safeSecondaryCtaLabel} →
                </Button>
              </Link>
            )}
          </div>
        </div>

        {safeImagePosition === "below" && imageFrame}
      </div>

      <style>{`
        .hero-centered {
          background-color: var(--background);
          padding: 5rem 1.5rem 0;
          display: flex;
          justify-content: center;
        }
        .hero-centered__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          width: 100%;
          max-width: 860px;
        }
        .hero-centered__text-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          width: 100%;
        }
        .hero-centered__badge-wrapper {
          display: inline-flex;
        }
        .hero-centered__headline {
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--foreground);
          margin: 0;
          max-width: 700px;
        }
        .hero-centered__copy {
          font-size: 1.125rem;
          line-height: 1.75;
          color: var(--muted-foreground);
          max-width: 560px;
          margin: 0;
        }
        .hero-centered__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          align-items: center;
        }
        .hero-centered__image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
          background-color: var(--secondary);
          box-shadow: 0 24px 64px rgba(0,0,0,0.08);
        }
        .hero-centered__image {
          object-fit: cover;
          object-position: center;
        }
        .hero-centered__image-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          opacity: 0.15;
        }
        @media (max-width: 640px) {
          .hero-centered {
            padding: 3.5rem 1.25rem 0;
          }
          .hero-centered__inner {
            gap: 2rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-centered * {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
