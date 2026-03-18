/**
 * Playwright test fixture — hero components rendered with static, deterministic data.
 * Not linked from the app; only used by tests/heroes/*.spec.ts.
 */
import HeroFullBleed from "@/components/heroes/HeroFullBleed";
import HeroSplit from "@/components/heroes/HeroSplit";
import HeroCentered from "@/components/heroes/HeroCentered";

// Stable placeholder — no external network call required
const IMG = "https://cdn.builder.io/api/v1/image/assets/placeholder";

export default function HeroesFixturePage() {
  return (
    <div>
      {/* ── HeroFullBleed ────────────────────────────────────────────── */}

      {/* Full props — center aligned */}
      <section id="fullbleed-full">
        <HeroFullBleed
          headline="Full Bleed Headline"
          copy="Full bleed copy text."
          ctaLabel="Full Bleed CTA"
          ctaUrl="/fullbleed"
          image={IMG}
          imageAlt="Test background image"
          textAlign="center"
          overlayOpacity={60}
        />
      </section>

      {/* Left-aligned text */}
      <section id="fullbleed-left">
        <HeroFullBleed
          headline="Left Aligned Headline"
          copy="Left aligned copy."
          ctaLabel="Left CTA"
          ctaUrl="/left"
          textAlign="left"
        />
      </section>

      {/* Minimal — no image, no CTA */}
      <section id="fullbleed-minimal">
        <HeroFullBleed
          headline="Minimal Headline"
          copy="Minimal copy."
        />
      </section>

      {/* Null fields — Builder can send null for unset inputs */}
      <section id="fullbleed-null">
        <HeroFullBleed
          headline={null}
          copy={null}
          ctaLabel={null}
          ctaUrl={null}
          image={null}
          imageAlt={null}
          textAlign={null}
          overlayOpacity={null}
        />
      </section>

      {/* ── HeroSplit ─────────────────────────────────────────────────── */}

      {/* Image on right (default) */}
      <section id="split-right">
        <HeroSplit
          headline="Split Right Headline"
          copy="Split right copy text."
          ctaLabel="Primary CTA"
          ctaUrl="/primary"
          secondaryCtaLabel="Secondary CTA"
          secondaryCtaUrl="/secondary"
          image={IMG}
          imageAlt="Split test image"
          imagePosition="right"
        />
      </section>

      {/* Image on left */}
      <section id="split-left">
        <HeroSplit
          headline="Split Left Headline"
          copy="Split left copy text."
          ctaLabel="Left Primary"
          ctaUrl="/left-primary"
          imagePosition="left"
          image={IMG}
          imageAlt="Left split image"
        />
      </section>

      {/* No image, single CTA, no secondary */}
      <section id="split-minimal">
        <HeroSplit
          headline="Split Minimal Headline"
          copy="Split minimal copy."
          ctaLabel="Only CTA"
          ctaUrl="/only"
        />
      </section>

      {/* Null fields */}
      <section id="split-null">
        <HeroSplit
          headline={null}
          copy={null}
          ctaLabel={null}
          ctaUrl={null}
          secondaryCtaLabel={null}
          secondaryCtaUrl={null}
          image={null}
          imageAlt={null}
          imagePosition={null}
        />
      </section>

      {/* ── HeroCentered ─────────────────────────────────────────────── */}

      {/* Full props — image below (default) */}
      <section id="centered-full">
        <HeroCentered
          badgeLabel="New"
          headline="Centered Headline"
          copy="Centered copy text."
          ctaLabel="Centered CTA"
          ctaUrl="/centered"
          secondaryCtaLabel="Secondary"
          secondaryCtaUrl="/secondary"
          image={IMG}
          imageAlt="Centered test image"
          imagePosition="below"
        />
      </section>

      {/* Image above text */}
      <section id="centered-above">
        <HeroCentered
          headline="Image Above Headline"
          copy="Image above copy."
          ctaLabel="Above CTA"
          ctaUrl="/above"
          image={IMG}
          imageAlt="Above image"
          imagePosition="above"
        />
      </section>

      {/* No badge, no secondary CTA, no image */}
      <section id="centered-minimal">
        <HeroCentered
          headline="Centered Minimal Headline"
          copy="Centered minimal copy."
          ctaLabel="Minimal CTA"
          ctaUrl="/minimal"
        />
      </section>

      {/* Null fields */}
      <section id="centered-null">
        <HeroCentered
          badgeLabel={null}
          headline={null}
          copy={null}
          ctaLabel={null}
          ctaUrl={null}
          secondaryCtaLabel={null}
          secondaryCtaUrl={null}
          image={null}
          imageAlt={null}
          imagePosition={null}
        />
      </section>
    </div>
  );
}
