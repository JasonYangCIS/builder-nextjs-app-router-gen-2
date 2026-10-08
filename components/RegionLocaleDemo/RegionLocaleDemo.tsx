"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import type { RegionContentResult, RegionOption } from "./RegionLocaleDemo.types";

const DEFAULT_LOCALE = "jp";
const REGION_CONTENT_PATH = "/region-content";

// Builder list fields return objects (e.g. { locale: "us" }); plain string arrays are also accepted.
function normalizeLocales(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): string => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const value =
          record.locale ?? record.code ?? record.value ?? Object.values(record).find((v) => typeof v === "string");
        return typeof value === "string" ? value : "";
      }
      return "";
    })
    .map((locale) => locale.trim())
    .filter(Boolean);
}

// Without a `locale` param, Builder returns localized fields as { "@type": ..., Default: "..." }.
function toDisplayString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const fallback = (value as Record<string, unknown>).Default;
    return typeof fallback === "string" ? fallback : undefined;
  }
  return undefined;
}

function buildCodeExample(locale: string, region: RegionOption | undefined): string {
  return `import { fetchEntries } from "@builder.io/sdk-react";

// 1. Find the region entry whose \`locales\` list contains the locale
const regions = await fetchEntries({
  model: "${config.models.regionRef}",
  apiKey: config.envs.builderApiKey,
});
const region = regions.find((r) =>
  r.data?.locales?.some((l) => l.locale === "${locale}"),
);
// -> ${region ? `"${region.name}" (id: ${region.id})` : "no matching region"}

// 2. Query content filtered by the reference field
const entries = await fetchEntries({
  model: "${config.models.page}",
  apiKey: config.envs.builderApiKey,
  userAttributes: { urlPath: "/region-content" },
  query: {
    "data.regionRef.id": region.id, // ${region?.id ?? "<region id>"}
  },
});`;
}

export default function RegionLocaleDemo() {
  const [regions, setRegions] = useState<RegionOption[] | null>(null);
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [results, setResults] = useState<RegionContentResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [sampleOutput, setSampleOutput] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchEntries({ model: config.models.regionRef, apiKey: config.envs.builderApiKey, limit: 50 })
      .then((entries) => {
        if (cancelled) return;
        const options: RegionOption[] = (entries ?? []).map((entry) => ({
          id: entry.id ?? "",
          name: (entry.data?.name as string | undefined) ?? entry.name ?? "Untitled region",
          locales: normalizeLocales(entry.data?.locales),
        }));
        setRegions(options);
        const allLocales = options.flatMap((region) => region.locales);
        if (allLocales.length > 0 && !allLocales.includes(DEFAULT_LOCALE)) {
          setLocale(allLocales[0]);
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load regions", err);
        if (!cancelled) {
          const detail = err instanceof Error ? err.message : String(err);
          setError(`Could not load regions: ${detail}`);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allLocales = useMemo(
    () => Array.from(new Set((regions ?? []).flatMap((region) => region.locales))),
    [regions],
  );
  const region = regions?.find((r) => r.locales.includes(locale));

  async function runQuery() {
    if (!region) return;
    setLoading(true);
    setError(null);

    try {
      const entries = await fetchEntries({
        model: config.models.page,
        apiKey: config.envs.builderApiKey,
        userAttributes: { urlPath: REGION_CONTENT_PATH },
        query: { "data.regionRef.id": region.id },
        limit: 20,
      });

      setResults(
        (entries ?? []).map((entry) => ({
          id: entry.id ?? entry.name ?? "",
          title: toDisplayString(entry.data?.title) ?? entry.name ?? "Untitled entry",
          regionRefId: (entry.data?.regionRef as { id?: string } | undefined)?.id ?? "",
        })),
      );
    } catch {
      setError("Something went wrong fetching content. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  async function runSample() {
    setSampleLoading(true);
    setSampleError(null);
    setSampleOutput(null);

    try {
      const allRegions = await fetchEntries({
        model: config.models.regionRef,
        apiKey: config.envs.builderApiKey,
      });
      const matched = (allRegions ?? []).find((r) =>
        normalizeLocales(r.data?.locales).includes(locale),
      );
      if (!matched?.id) {
        setSampleOutput({ region: null, entries: [] });
        return;
      }

      const entries = await fetchEntries({
        model: config.models.page,
        apiKey: config.envs.builderApiKey,
        userAttributes: { urlPath: REGION_CONTENT_PATH },
        query: { "data.regionRef.id": matched.id },
      });
      setSampleOutput({ region: { id: matched.id, name: matched.name }, entries: entries ?? [] });
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setSampleError(`Sample failed: ${detail}`);
    } finally {
      setSampleLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <Text variant="h4" as="h2">Query by locale and regionRef</Text>
          </CardTitle>
          <Text variant="body-sm" color="muted">
            Pick one locale. The demo finds the region that lists it, then queries `page`
            entries at `{REGION_CONTENT_PATH}` whose `regionRef` points at that region.
          </Text>
        </CardHeader>
        <CardContent>
          {!regions && !error && (
            <Text variant="body-sm" color="muted">Loading regions…</Text>
          )}

          {regions && regions.length === 0 && (
            <Text variant="body-sm" color="muted">
              No entries found in the `{config.models.regionRef}` model.
            </Text>
          )}

          {regions && regions.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Locales">
                {allLocales.map((code) => (
                  <Button
                    key={code}
                    type="button"
                    variant={code === locale ? "default" : "outline"}
                    aria-pressed={code === locale}
                    onClick={() => {
                      setLocale(code);
                      setResults(null);
                    }}
                  >
                    {code}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Text variant="label" as="span">Resolved region:</Text>
                {region ? (
                  <>
                    <Badge variant="secondary">{region.name}</Badge>
                    <Text variant="body-sm" color="muted" as="span">
                      (locales: {region.locales.join(", ")})
                    </Text>
                  </>
                ) : (
                  <Text variant="body-sm" color="muted" as="span">
                    No region lists &ldquo;{locale}&rdquo;
                  </Text>
                )}
              </div>

              <div>
                <Button type="button" onClick={runQuery} disabled={loading || !region}>
                  {loading ? "Running query…" : "Run query"}
                </Button>
              </div>
            </div>
          )}

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
                <div
                  key={result.id}
                  className="rounded-lg border border-primary/40 bg-primary/5 p-4"
                >
                  <Text variant="label" as="p">{result.title}</Text>
                  <Text variant="body-sm" color="muted" as="p">
                    regionRef: {result.regionRefId || "unknown"}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Text variant="h5" as="h3" className="mb-3">Request shape</Text>
        <Text variant="body-sm" color="muted" className="mb-3">
          A custom targeting attribute can&rsquo;t carry a list of regions, so each content entry
          has a `regionRef` reference field instead. The region entry holds the locale list, and
          the query filters on the reference&rsquo;s id.
        </Text>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code className="font-mono">{buildCodeExample(locale, region)}</code>
        </pre>

        <div className="mt-4">
          <Button type="button" onClick={runSample} disabled={sampleLoading}>
            {sampleLoading ? "Running code…" : "Run this code"}
          </Button>
        </div>

        {sampleError && (
          <Text variant="body-sm" color="error" className="mt-4">
            {sampleError}
          </Text>
        )}

        {sampleOutput !== null && (
          <div className="mt-4">
            <Text variant="label" as="p" className="mb-2">Response</Text>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-sm">
              <code className="font-mono">{JSON.stringify(sampleOutput, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
