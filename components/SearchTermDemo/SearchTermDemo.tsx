"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { Text } from "@/components/ui/Text/Text";
import { FormInput } from "@/components/ui/FormInput/FormInput";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { sanitizeHref } from "@/utils/url";
import type { SearchTermResult } from "./SearchTermDemo.types";

function parseSearchTerms(input: string): string[] {
  // Normalize to lowercase so matching is case-insensitive, same as the
  // Content API's `$in` comparison against `data.searchTerms`.
  return input
    .split(/[,\s]+/)
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

function buildCodeExample(terms: string[]): string {
  const termsList = terms.length > 0 ? terms : ["cheese", "butter"];
  return `import { fetchEntries } from "@builder.io/sdk-react";

const entries = await fetchEntries({
  model: "${config.models.page}",
  apiKey: config.envs.builderApiKey,
  query: {
    "data.searchTerms": { $in: ${JSON.stringify(termsList)} },
  },
});`;
}

export default function SearchTermDemo() {
  const [searchInput, setSearchInput] = useState("cheese");
  const [submittedTerms, setSubmittedTerms] = useState<string[] | null>(null);
  const [results, setResults] = useState<SearchTermResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const terms = parseSearchTerms(searchInput);
    setSubmittedTerms(terms);

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
        query: { "data.searchTerms": { $in: terms } },
        limit: 20,
      });

      const mapped: SearchTermResult[] = (entries ?? []).map((entry) => {
        const searchTerms = (entry.data?.searchTerms as string[] | undefined) ?? [];
        return {
          id: entry.id ?? entry.name ?? "",
          title: (entry.data?.title as string | undefined) ?? entry.name ?? "Untitled page",
          url: (entry.data?.url as string | undefined) ?? "",
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

  const codeExample = buildCodeExample(submittedTerms ?? parseSearchTerms(searchInput));

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <Text variant="h4" as="h2">Run a query</Text>
          </CardTitle>
          <Text variant="body-sm" color="muted">
            Enter a search term and run a real query against the Builder Content API.
          </Text>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <FormInput
              className="flex-1"
              label="Search terms"
              helperText="Space or comma separated, e.g. &ldquo;cheese, butter&rdquo;"
              placeholder="cheese, butter"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <Button type="submit" disabled={loading}>
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

              {results.map((result) => {
                const href = sanitizeHref(result.url);
                return (
                  <div key={result.id} className="rounded-lg border border-primary/40 bg-primary/5 p-4">
                    {href ? (
                      <Link href={href} className="hover:underline">
                        <Text variant="label" as="p">{result.title}</Text>
                      </Link>
                    ) : (
                      <Text variant="label" as="p">{result.title}</Text>
                    )}
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Text variant="h5" as="h3" className="mb-3">Request shape</Text>
        <Text variant="body-sm" color="muted" className="mb-3">
          `data.searchTerms` describes what an entry is about and is queried directly through
          the Content API. Results link to each entry&rsquo;s own `data.url`.
        </Text>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code className="font-mono">{codeExample}</code>
        </pre>
      </div>
    </div>
  );
}
