import type { Metadata } from "next";
import HeroFullBleed from "@/components/heroes/HeroFullBleed";
import HeroSplit from "@/components/heroes/HeroSplit";
import HeroCentered from "@/components/heroes/HeroCentered";

export const metadata: Metadata = {
  title: "Hero Component Prototypes",
  description: "Preview of three hero component variants for Builder.io registration",
};

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop";
const SAMPLE_SPLIT_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop";
const SAMPLE_CENTERED_IMAGE = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&auto=format&fit=crop";

export default function HeroPreviewPage() {
  return (
    <main className="hero-preview-page">
      <div className="hero-preview-section-label">
        <span className="hero-preview-badge">1 of 3</span>
        <h2 className="hero-preview-title">Full Bleed Hero</h2>
        <p className="hero-preview-desc">Image fills the entire background with text overlaid. Configurable: text alignment, overlay opacity.</p>
      </div>
      <HeroFullBleed
        headline="Make an Impact That Lasts"
        copy="Full-bleed imagery with your message front and center. Bold, immersive, and impossible to ignore."
        ctaLabel="Explore Now"
        ctaUrl="#"
        image={SAMPLE_IMAGE}
        imageAlt="Abstract colorful background"
        textAlign="center"
        overlayOpacity={50}
      />

      <div className="hero-preview-section-label">
        <span className="hero-preview-badge">2 of 3</span>
        <h2 className="hero-preview-title">Split Hero</h2>
        <p className="hero-preview-desc">Content on one side, image on the other. Configurable: image position (left/right), secondary CTA.</p>
      </div>
      <HeroSplit
        headline="Build Something Worth Talking About"
        copy="A clean editorial split gives your content room to breathe alongside a strong visual. Great for features, products, or announcements."
        ctaLabel="Get Started"
        ctaUrl="#"
        secondaryCtaLabel="Learn More"
        secondaryCtaUrl="#"
        image={SAMPLE_SPLIT_IMAGE}
        imageAlt="Colorful abstract design"
        imagePosition="right"
      />

      <div className="hero-preview-section-label">
        <span className="hero-preview-badge">3 of 3</span>
        <h2 className="hero-preview-title">Centered Minimal Hero</h2>
        <p className="hero-preview-desc">Text centered above a framed image. Configurable: optional badge, image position (above/below), secondary CTA.</p>
      </div>
      <HeroCentered
        badgeLabel="New Feature"
        headline="Simple. Focused. Effective."
        copy="A clean, centered layout that lets the message lead. The framed image below adds context without distraction."
        ctaLabel="Start Free"
        ctaUrl="#"
        secondaryCtaLabel="See how it works"
        secondaryCtaUrl="#"
        image={SAMPLE_CENTERED_IMAGE}
        imageAlt="Laptop on a desk showing a dashboard"
        imagePosition="below"
      />

      <style>{`
        .hero-preview-page {
          display: flex;
          flex-direction: column;
        }
        .hero-preview-section-label {
          padding: 2.5rem 2rem 1.25rem;
          background: var(--background);
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .hero-preview-badge {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--primary);
          background: color-mix(in oklab, var(--primary) 10%, transparent);
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          width: fit-content;
        }
        .hero-preview-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--foreground);
          margin: 0;
        }
        .hero-preview-desc {
          font-size: 0.875rem;
          color: var(--muted-foreground);
          margin: 0;
        }
      `}</style>
    </main>
  );
}
