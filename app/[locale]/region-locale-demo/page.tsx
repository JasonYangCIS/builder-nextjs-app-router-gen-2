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
          Entries carry a `regionRef` reference to a region that lists locales (e.g. NA: `us`,
          `ca`; APAC: `jp`). Pick one locale to fetch the `/region-content` page entry tied to its region.
        </Text>
      </header>

      <div className="flex flex-col gap-16">
        <RegionLocaleDemo />
        <RegionApproachNotes />
      </div>
    </div>
  );
}
