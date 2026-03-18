import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface HeroCenteredProps {
  badgeLabel?: string;
  headline?: string;
  copy?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaVariant?: ButtonVariant;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "above" | "below";
}

export default function HeroCentered({
  badgeLabel = "",
  headline = "Simple. Focused. Effective.",
  copy = "Clean, centered layout that puts the message first. Ideal when clarity and focus matter most.",
  ctaLabel = "Get Started",
  ctaUrl = "#",
  ctaVariant = "default",
  secondaryCtaLabel = "",
  secondaryCtaUrl = "",
  image = "",
  imageAlt = "",
  imagePosition = "below",
}: HeroCenteredProps) {
  const imageBlock = (image || true) && (
    <div className="hero-centered__image-frame">
      {image ? (
        <Image
          src={image}
          alt={imageAlt ?? ""}
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
        {imagePosition === "above" && imageBlock}

        <div className="hero-centered__text-block">
          {badgeLabel && (
            <div className="hero-centered__badge-wrapper">
              <Badge variant="secondary">{badgeLabel}</Badge>
            </div>
          )}

          <h1 className="hero-centered__headline">{headline}</h1>
          <p className="hero-centered__copy">{copy}</p>

          <div className="hero-centered__actions">
            {ctaLabel && ctaUrl && (
              <Link href={ctaUrl}>
                <Button variant={ctaVariant} size="lg">
                  {ctaLabel}
                </Button>
              </Link>
            )}
            {secondaryCtaLabel && secondaryCtaUrl && (
              <Link href={secondaryCtaUrl}>
                <Button variant="ghost" size="lg">
                  {secondaryCtaLabel} →
                </Button>
              </Link>
            )}
          </div>
        </div>

        {imagePosition === "below" && imageBlock}
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
