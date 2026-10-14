import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { sanitizeHref } from "@/utils/url";
import type { LandingPageProps } from "./LandingPage.types";

export type { LandingPageProps, LandingPageData } from "./LandingPage.types";

export default function LandingPage({ data }: LandingPageProps) {
  const ctaHref = sanitizeHref(data.cta.href);
  const isSvg = data.heroImagePath.endsWith(".svg");

  return (
    <main data-testid="landing-page">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:py-16">
        <Image
          src={data.heroImagePath}
          alt={data.heroImageAlt}
          width={1280}
          height={720}
          priority
          unoptimized={isSvg}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="aspect-video w-full rounded-xl object-cover"
        />
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {data.headline}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{data.subhead}</p>
          {ctaHref && (
            <Button asChild size="lg">
              <Link href={ctaHref}>{data.cta.label}</Link>
            </Button>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-16 md:grid-cols-3">
        {data.sections.map((section) => (
          <section key={section.heading} data-testid="landing-page-section">
            <h2 className="mb-2 text-2xl font-semibold text-foreground">{section.heading}</h2>
            <p className="text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
