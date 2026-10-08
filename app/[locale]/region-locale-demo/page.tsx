import { Text } from "@/components/ui/Text/Text";
import RegionLocaleDemo from "@/components/RegionLocaleDemo/RegionLocaleDemo";
import RegionApproachNotes from "@/components/RegionApproachNotes/RegionApproachNotes";

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
          Each entry points to a region via `regionRef`, and each region lists its locales
          (e.g. NA: `us`, `ca`; APAC: `jp`). Pick a locale to fetch its region&rsquo;s content.
        </Text>
      </header>

      <div className="flex flex-col gap-16">
        <RegionLocaleDemo />
        <RegionApproachNotes />
      </div>
    </div>
  );
}
