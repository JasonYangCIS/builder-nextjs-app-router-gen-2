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
          `data.searchTerms` describes <strong>what</strong> a `page` entry is about, and is
          queried directly through the Content API. Matching entries link to their own URL.
        </Text>
      </header>

      <SearchTermDemo />
    </div>
  );
}
