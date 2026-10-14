export interface LandingPageSection {
  heading: string;
  body: string;
}

export interface LandingPageData {
  slug: string;
  headline: string;
  subhead: string;
  cta: { label: string; href: string };
  sections: LandingPageSection[];
  heroImagePath: string;
  heroImageAlt: string;
}

export interface LandingPageProps {
  data: LandingPageData;
  locale: string;
}
