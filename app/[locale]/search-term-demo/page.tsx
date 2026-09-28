import { Text } from "@/components/ui/Text/Text";
import SearchTermDemo from "@/components/SearchTermDemo/SearchTermDemo";

export const metadata = {
  title: "Targeting + Search Metadata Demo",
  description:
    "How to combine Builder entry-level targeting (userAttributes) with content search metadata (searchTerms) via the Content API.",
};

export default function SearchTermDemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <header className="mb-10">
        <Text variant="h1" className="gradient-brand-text sm:text-5xl">
          Targeting + Search Metadata
        </Text>
        <Text variant="body-lg" color="muted" className="mt-3">
          `userAttributes` decide <strong>who/when</strong> an entry is eligible.
          `data.searchTerms` describes <strong>what</strong> the entry is about, and is
          queried through the Content API &mdash; not modeled as fake targeting rules.
        </Text>
      </header>

      <SearchTermDemo />
    </div>
  );
}
