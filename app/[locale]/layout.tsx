import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getAnnouncementBar } from "@/utils/builderCache.server";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";
import { config } from "@/config";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TargetingDemoControls from "@/components/TargetingDemoControls/TargetingDemoControls";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jason Yang's Builder.io Sandbox",
  description: "A sandbox environment for the Builder.io Gen 2 SDK with Next.js App Router.",
};

export function generateStaticParams() {
  return SUPPORTED_LOCALE_CODES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALE_CODES.includes(locale)) {
    notFound();
  }

  const announcementBar = await getAnnouncementBar(locale);

  const barPosition = (announcementBar?.data?.position as string | undefined) ?? "above-header";

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {announcementBar && barPosition === "above-header" && (
          <RenderBuilderContent
            content={announcementBar}
            model={config.models.announcementBar}
            locale={locale}
          />
        )}
        <Header locale={locale} />
        {announcementBar && barPosition === "below-header" && (
          <RenderBuilderContent
            content={announcementBar}
            model={config.models.announcementBar}
            locale={locale}
          />
        )}
        {/* Request-time content (cookies/searchParams) streams inside this boundary; */}
        {/* everything else is part of the static shell. */}
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        <TargetingDemoControls />
      </body>
    </html>
  );
}
