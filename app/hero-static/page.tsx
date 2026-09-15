import type { Metadata } from "next";
import HeroScrim from "@/components/HeroScrim/HeroScrim";

export const metadata: Metadata = {
  title: "Hero Static",
  description: "Static rendering of the forest retreat hero component.",
};

export default function HeroStaticPage() {
  return (
    <HeroScrim
      brandName="Wilder House"
      eyebrow="A quieter kind of escape"
      headline="Find your place in the wild."
      copy="A secluded forest cabin for slow mornings, open trails, and evenings warmed by the fire."
      ctaLabel="Explore stays"
      ctaUrl="#"
      image="https://api.builder.io/api/v1/image/assets/TEMP/dd8dc6ec1588124678a31b9faead05e077a23158?width=2400"
      imageAlt="Cabin in a forrest landscape"
      priority
      headingLevel="h1"
    />
  );
}
