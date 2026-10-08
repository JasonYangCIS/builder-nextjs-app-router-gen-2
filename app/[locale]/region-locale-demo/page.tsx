import { Text } from "@/components/ui/Text/Text";
import RegionLocaleDemo from "@/components/RegionLocaleDemo/RegionLocaleDemo";

export const metadata = {
  title: "Region Locale Demo",
  description: "Query Content API entries for every locale listed in a regionRef entry.",
};

export default function RegionLocaleDemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <header className="mb-10">
        <Text variant="h1" className="gradient-brand-text sm:text-5xl">
          Region Locale Demo
        </Text>
        <Text variant="body-lg" color="muted" className="mt-3">
          A `regionRef` entry groups locales (e.g. NA: `us`, `ca`; APAC: `jp`). Select a region
          to query the Content API for each of its locales.
        </Text>
      </header>

      <RegionLocaleDemo />
    </div>
  );
}
