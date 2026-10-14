import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import LandingPage from "@/components/LandingPage/LandingPage";
import type { LandingPageData } from "@/components/LandingPage/LandingPage.types";
import { SUPPORTED_LOCALE_CODES } from "@/utils/locale";

const DATA_DIR = path.join(process.cwd(), "content", "landing-pages");

async function loadLandingPage(slug: string): Promise<LandingPageData | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, `${slug}.json`), "utf8"));
  } catch {
    return null;
  }
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const files = await readdir(DATA_DIR);
  const slugs = files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  return SUPPORTED_LOCALE_CODES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadLandingPage(slug);
  return { title: data?.headline ?? "Landing page", description: data?.subhead ?? "" };
}

export default async function LandingPageRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadLandingPage(slug);
  if (!data) notFound();
  return <LandingPage data={data} />;
}
