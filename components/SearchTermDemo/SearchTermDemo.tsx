"use client";

import { useState, type FormEvent } from "react";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { Text } from "@/components/ui/Text/Text";
import { FormInput } from "@/components/ui/FormInput/FormInput";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import type { PageEntry } from "@/types/page.types";
import type { SearchTermResult } from "./SearchTermDemo.types";

export type { SearchTermResult } from "./SearchTermDemo.types";

// Escape regex metacharacters so user input is matched literally, not
// interpreted as a pattern (Builder's query runs $regex server-side).
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CODE_EXAMPLE = `import { fetchEntries } from "@builder.io/sdk-react";

const entries = await fetchEntries({
  model: "${config.models.page}",
  apiKey: config.envs.builderApiKey,
  query: {
    // Matches any page whose "searchTerms" array contains an
    // element matching the search term (case-insensitive).
    "data.searchTerms": { $regex: term, $options: "i" },
  },
  limit: 20,
});`;

export default function SearchTermDemo() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchTermResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) {
      setResults(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const entries = await fetchEntries({
        model: config.models.page,
        apiKey: config.envs.builderApiKey,
        query: {
          "data.searchTerms": { $regex: escapeRegExp(trimmed), $options: "i" },
        },
        limit: 20,
      });

      const lowerTerm = trimmed.toLowerCase();
      const mapped: SearchTermResult[] = (entries ?? []).map((entry) => {
        const data = entry.data as unknown as PageEntry;
        const searchTerms = data?.searchTerms ?? [];
        return {
          id: entry.id ?? entry.name ?? data?.url ?? trimmed,
          title: data?.title ?? entry.name ?? "Untitled page",
          url: data?.url ?? "",
          matchedTerms: searchTerms.filter((t) => t.toLowerCase().includes(lowerTerm)),
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

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <Text variant="h4" as="h2">Search by term</Text>
          </CardTitle>
          <Text variant="body-sm" color="muted">
            Enter a keyword to find `page` entries whose `searchTerms` field contains a match.
          </Text>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <FormInput
              className="flex-1"
              label="Search term"
              placeholder="e.g. pricing"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </Button>
          </form>

          {error && (
            <Text variant="body-sm" color="error" className="mt-4">
              {error}
            </Text>
          )}

          {results && (
            <div className="mt-6 flex flex-col gap-3">
              {results.length === 0 ? (
                <Text variant="body-sm" color="muted">
                  No pages found with a searchTerms match for &ldquo;{term.trim()}&rdquo;.
                </Text>
              ) : (
                results.map((result) => (
                  <div
                    key={result.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <Text variant="label" as="p">{result.title}</Text>
                    {result.url && (
                      <Text variant="body-sm" color="muted" className="mt-1">
                        {result.url}
                      </Text>
                    )}
                    {result.matchedTerms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {result.matchedTerms.map((matched) => (
                          <Badge key={matched} variant="secondary">
                            {matched}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Text variant="h5" as="h3" className="mb-3">SDK implementation</Text>
        <Text variant="body-sm" color="muted" className="mb-3">
          This is the actual `fetchEntries` call this page uses to run the search above.
        </Text>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code className="font-mono">{CODE_EXAMPLE}</code>
        </pre>
      </div>
    </div>
  );
}
