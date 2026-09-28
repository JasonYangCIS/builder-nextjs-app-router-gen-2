import { Text } from "@/components/ui/Text/Text";
import SearchTermDemo from "@/components/SearchTermDemo/SearchTermDemo";

export const metadata = {
  title: "Search Term Demo",
  description: "Search `page` model entries by the searchTerms data field using the Builder SDK.",
};

export default function SearchTermDemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <header className="mb-10">
        <Text variant="h1" className="gradient-brand-text sm:text-5xl">
          Search Term Demo
        </Text>
        <Text variant="body-lg" color="muted" className="mt-3">
          Demonstrates using the Builder SDK to find `page` entries by the custom
          `searchTerms` data field.
        </Text>
      </header>

      <SearchTermDemo />
    </div>
  );
}
