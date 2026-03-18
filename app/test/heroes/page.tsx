/**
 * Playwright test fixture — hero components rendered with static, deterministic data.
 * Not linked from the app; only used by tests/heroes/*.spec.ts.
 */
import type { Metadata } from "next";
import HeroFullBleed from "@/components/HeroFullBleed/HeroFullBleed";
import HeroSplit from "@/components/HeroSplit/HeroSplit";
import HeroCentered from "@/components/HeroCentered/HeroCentered";

export const metadata: Metadata = {
  title: "Hero Components Test Fixture",
  description: "Playwright test harness for hero components. Not linked from the app.",
  robots: { index: false, follow: false },
};

// Stable placeholder — no external network call required
const IMG = "https://cdn.builder.io/api/v1/image/assets/placeholder";

export default function HeroesFixturePage() {
  return (
    <div>
      {/* ── HeroFullBleed ────────────────────────────────────────────── */}

      {/* Full props — center aligned, explicit h1 */}
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
          headingLevel="h1"
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
          headingLevel="h2"
        />
      </section>

      {/* Minimal — no image, no CTA */}
      <section id="fullbleed-minimal">
        <HeroFullBleed
          headline="Minimal Headline"
          copy="Minimal copy."
          headingLevel="h2"
        />
      </section>

      {/* Null fields — Builder can send null for unset inputs; defaults to h2 */}
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
          headingLevel={null}
        />
      </section>

      {/* ── HeroSplit ─────────────────────────────────────────────────── */}

      {/* Image on right (default), explicit h1 */}
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
          headingLevel="h1"
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
          headingLevel="h2"
        />
      </section>

      {/* No image, single CTA, no secondary */}
      <section id="split-minimal">
        <HeroSplit
          headline="Split Minimal Headline"
          copy="Split minimal copy."
          ctaLabel="Only CTA"
          ctaUrl="/only"
          headingLevel="h2"
        />
      </section>

      {/* Null fields — defaults to h2 */}
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
          headingLevel={null}
        />
      </section>

      {/* ── HeroCentered ─────────────────────────────────────────────── */}

      {/* Full props — image below (default), explicit h1 */}
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
          headingLevel="h1"
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
          headingLevel="h2"
        />
      </section>

      {/* No badge, no secondary CTA, no image */}
      <section id="centered-minimal">
        <HeroCentered
          headline="Centered Minimal Headline"
          copy="Centered minimal copy."
          ctaLabel="Minimal CTA"
          ctaUrl="/minimal"
          headingLevel="h2"
        />
      </section>

      {/* Null fields — defaults to h2 */}
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
          headingLevel={null}
        />
      </section>
    </div>
  );
}
