"use client";

import { useState, type FormEvent } from "react";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { Text } from "@/components/ui/Text/Text";
import { FormInput } from "@/components/ui/FormInput/FormInput";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Label } from "@/components/ui/Label/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import type { CustomerTier, SearchTermResult } from "./SearchTermDemo.types";

const LOCALES = ["en-US", "es-ES"] as const;
const CUSTOMER_TIERS: CustomerTier[] = ["wholesale", "retail"];

// This Builder space only allows a fixed set of custom targeting attributes
// (configured in Settings > Custom Targeting Attributes). There's no
// "customerTier" attribute registered, so this demo repurposes the existing
// "bu" attribute as a stand-in: 123 = wholesale, 456 = retail. In your own
// space you'd register a real "customerTier" attribute instead.
const TIER_TO_BU: Record<CustomerTier, string> = { wholesale: "123", retail: "456" };

function parseSearchTerms(input: string): string[] {
  // Normalize to lowercase so matching is case-insensitive, same as the
  // Content API's `$in` comparison against `data.searchTerms`.
  return input
    .split(/[,\s]+/)
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

function buildCodeExample(terms: string[], locale: string, customerTier: CustomerTier): string {
  const termsList = terms.length > 0 ? terms : ["cheese", "butter"];
  return `import { fetchEntries } from "@builder.io/sdk-react";

const entries = await fetchEntries({
  model: "${config.models.page}",
  apiKey: config.envs.builderApiKey,
  locale: "${locale}",

  // userAttributes: WHO/WHEN — resolves entry-level targeting rules
  // (locale, customer tier). Never used to express "what this is about".
  userAttributes: {
    locale: "${locale}",
    customerTier: "${customerTier}", // "${TIER_TO_BU[customerTier]}" via this space's "bu" attribute
  },

  // query: WHAT — search metadata lives on the entry's own data,
  // queried directly through the Content API. Only an entry that is BOTH
  // targeting-eligible AND search-relevant is returned.
  query: {
    "data.searchTerms": { $in: ${JSON.stringify(termsList)} },
  },
});`;
}

export default function SearchTermDemo() {
  const [searchInput, setSearchInput] = useState("cheese");
  const [locale, setLocale] = useState<string>(LOCALES[0]);
  const [customerTier, setCustomerTier] = useState<CustomerTier>("wholesale");
  const [submitted, setSubmitted] = useState<{
    terms: string[];
    locale: string;
    customerTier: CustomerTier;
  } | null>(null);
  const [results, setResults] = useState<SearchTermResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const terms = parseSearchTerms(searchInput);
    setSubmitted({ terms, locale, customerTier });

    if (terms.length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const entries = await fetchEntries({
        model: config.models.page,
        apiKey: config.envs.builderApiKey,
        locale,
        userAttributes: { locale, bu: TIER_TO_BU[customerTier] },
        query: { "data.searchTerms": { $in: terms } },
        limit: 20,
      });

      const mapped: SearchTermResult[] = (entries ?? []).map((entry) => {
        const searchTerms = (entry.data?.searchTerms as string[] | undefined) ?? [];
        return {
          id: entry.id ?? entry.name ?? "",
          title: (entry.data?.title as string | undefined) ?? entry.name ?? "Untitled page",
          searchTerms,
          matchedTerms: searchTerms.filter((term) => terms.includes(term.toLowerCase())),
        };
      });

      setResults(mapped);
    } catch {
      setError("Something went wrong fetching content. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  const codeExample = buildCodeExample(
    submitted?.terms ?? parseSearchTerms(searchInput),
    submitted?.locale ?? locale,
    submitted?.customerTier ?? customerTier
  );

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <Text variant="h4" as="h2">Run a query</Text>
          </CardTitle>
          <Text variant="body-sm" color="muted">
            Set a visitor&rsquo;s targeting attributes and a search term, then run a real query
            against the Builder Content API.
          </Text>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput
              label="Search terms"
              helperText="Space or comma separated, e.g. &ldquo;cheese, butter&rdquo;"
              placeholder="cheese, butter"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="locale-select">Locale (userAttributes)</Label>
                <select
                  id="locale-select"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  {LOCALES.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tier-select">Customer tier (userAttributes)</Label>
                <select
                  id="tier-select"
                  value={customerTier}
                  onChange={(e) => setCustomerTier(e.target.value as CustomerTier)}
                  className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  {CUSTOMER_TIERS.map((tier) => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="self-start" disabled={loading}>
              {loading ? "Running query…" : "Run query"}
            </Button>
          </form>

          {error && (
            <Text variant="body-sm" color="error" className="mt-4">
              {error}
            </Text>
          )}

          {results && (
            <div className="mt-6 flex flex-col gap-3">
              <Text variant="label" as="p">
                {results.length === 0
                  ? "No entries matched"
                  : `${results.length} matching ${results.length === 1 ? "entry" : "entries"}`}
              </Text>

              {results.map((result) => (
                <div key={result.id} className="rounded-lg border border-primary/40 bg-primary/5 p-4">
                  <Text variant="label" as="p">{result.title}</Text>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {result.searchTerms.map((term) => (
                      <Badge
                        key={term}
                        variant={result.matchedTerms.includes(term) ? "secondary" : "outline"}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Text variant="h5" as="h3" className="mb-3">Request shape</Text>
        <Text variant="body-sm" color="muted" className="mb-3">
          `userAttributes` filters by targeting; `query` filters by content metadata. Both
          conditions must pass for an entry to come back — the Content API applies both
          server-side, so search aliases never need to be modeled as fake targeting rules.
        </Text>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code className="font-mono">{codeExample}</code>
        </pre>
      </div>
    </div>
  );
}
