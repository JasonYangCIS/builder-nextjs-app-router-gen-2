"use client";

import { useMemo, useState, type FormEvent } from "react";
import { config } from "@/config";
import { Text } from "@/components/ui/Text/Text";
import { FormInput } from "@/components/ui/FormInput/FormInput";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Label } from "@/components/ui/Label/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import type { CustomerTier, MockEntry } from "./SearchTermDemo.types";

const LOCALES = ["en-US", "en-GB"] as const;
const CUSTOMER_TIERS: CustomerTier[] = ["wholesale", "retail"];

// Sample entries standing in for real Builder content. `targeting` is what
// Builder's `userAttributes` resolve against (WHO/WHEN this entry is
// eligible) — it is never used for keyword search. `data.searchTerms` is
// ordinary content data describing WHAT the entry is about, queried through
// the Content API's `query` option.
const MOCK_ENTRIES: MockEntry[] = [
  {
    id: "entry-a",
    targeting: { locale: "en-US", customerTier: "wholesale" },
    data: { title: "Wholesale Dairy Bundle (US)", searchTerms: ["cheese", "butter", "dairy"] },
  },
  {
    id: "entry-b",
    targeting: { locale: "en-US", customerTier: "retail" },
    data: { title: "Retail Fresh Dairy Case (US)", searchTerms: ["milk", "cream"] },
  },
  {
    id: "entry-c",
    targeting: { locale: "en-GB", customerTier: "wholesale" },
    data: { title: "Wholesale Charcuterie Board (UK)", searchTerms: ["cheese", "charcuterie"] },
  },
];

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

  // userAttributes: WHO/WHEN — resolves entry-level targeting rules.
  // Never used to express "what the content is about".
  userAttributes: {
    locale: "${locale}",
    customerTier: "${customerTier}",
  },

  // query: WHAT — search metadata lives on the entry's own data,
  // queried directly through the Content API.
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted({ terms: parseSearchTerms(searchInput), locale, customerTier });
  }

  const results = useMemo(() => {
    if (!submitted) return null;
    const { terms, locale: qLocale, customerTier: qTier } = submitted;

    return MOCK_ENTRIES.map((entry) => {
      // Two independent checks, combined with AND — this is the whole point
      // of the pattern: targeting eligibility and search relevance are
      // separate concerns that both must pass.
      const targetingMatched =
        entry.targeting.locale === qLocale && entry.targeting.customerTier === qTier;
      const matchedTerms = entry.data.searchTerms.filter((term) =>
        terms.includes(term.toLowerCase())
      );
      const searchMatched = terms.length > 0 && matchedTerms.length > 0;

      return {
        entry,
        matchedTerms,
        targetingMatched,
        searchMatched,
      };
    });
  }, [submitted]);

  const matchedResults = results?.filter((r) => r.targetingMatched && r.searchMatched) ?? [];
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
            Set a visitor&rsquo;s targeting attributes and a search term, then run the query to see
            which sample entries are eligible <em>and</em> relevant.
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

            <Button type="submit" className="self-start">Run query</Button>
          </form>

          {results && (
            <div className="mt-6 flex flex-col gap-3">
              <Text variant="label" as="p">
                {matchedResults.length} of {MOCK_ENTRIES.length} sample entries matched
              </Text>

              {results.map(({ entry, matchedTerms, targetingMatched, searchMatched }) => {
                const isMatch = targetingMatched && searchMatched;
                return (
                  <div
                    key={entry.id}
                    className={`rounded-lg border p-4 ${isMatch ? "border-primary/40 bg-primary/5" : "border-border opacity-60"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Text variant="label" as="p">{entry.data.title}</Text>
                      <Badge variant={isMatch ? "default" : "outline"}>
                        {isMatch ? "Matched" : "Excluded"}
                      </Badge>
                    </div>
                    <Text variant="body-sm" color="muted" className="mt-1">
                      Targeting: {entry.targeting.locale} / {entry.targeting.customerTier}{" "}
                      {targetingMatched ? "✓ eligible" : "✗ not eligible"}
                    </Text>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {entry.data.searchTerms.map((term) => (
                        <Badge
                          key={term}
                          variant={matchedTerms.includes(term) ? "secondary" : "outline"}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
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
