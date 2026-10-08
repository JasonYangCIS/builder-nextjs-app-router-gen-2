"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { sanitizeHref } from "@/utils/url";
import type { RegionLocaleGroup, RegionOption } from "./RegionLocaleDemo.types";

function buildCodeExample(region: RegionOption | undefined): string {
  const locales = region?.locales ?? ["us", "ca"];
  return `import { fetchEntries } from "@builder.io/sdk-react";

// 1. Load the regions and the locales each one lists
const regions = await fetchEntries({
  model: "${config.models.regionRef}",
  apiKey: config.envs.builderApiKey,
});

// 2. Query the Content API once per locale in the selected region
const locales = ${JSON.stringify(locales)};
const groups = await Promise.all(
  locales.map(async (locale) => ({
    locale,
    entries: await fetchEntries({
      model: "${config.models.page}",
      apiKey: config.envs.builderApiKey,
      locale,
    }),
  })),
);`;
}

export default function RegionLocaleDemo() {
  const [regions, setRegions] = useState<RegionOption[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [groups, setGroups] = useState<RegionLocaleGroup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchEntries({ model: config.models.regionRef, apiKey: config.envs.builderApiKey, limit: 50 })
      .then((entries) => {
        if (cancelled) return;
        const options: RegionOption[] = (entries ?? []).map((entry) => ({
          id: entry.id ?? entry.name ?? "",
          name: (entry.data?.name as string | undefined) ?? entry.name ?? "Untitled region",
          locales: ((entry.data?.locales as string[] | undefined) ?? []).map((l) => l.trim()),
        }));
        setRegions(options);
        setSelectedId(options[0]?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load regions. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = regions?.find((region) => region.id === selectedId);

  async function runQuery() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    try {
      const result = await Promise.all(
        selected.locales.map(async (locale): Promise<RegionLocaleGroup> => {
          const entries = await fetchEntries({
            model: config.models.page,
            apiKey: config.envs.builderApiKey,
            locale,
            limit: 20,
          });
          return {
            locale,
            entries: (entries ?? []).map((entry) => ({
              id: entry.id ?? entry.name ?? "",
              title: (entry.data?.title as string | undefined) ?? entry.name ?? "Untitled page",
              url: (entry.data?.url as string | undefined) ?? "",
            })),
          };
        }),
      );
      setGroups(result);
    } catch {
      setError("Something went wrong fetching content. Please try again.");
      setGroups(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <Text variant="h4" as="h2">Query by region</Text>
          </CardTitle>
          <Text variant="body-sm" color="muted">
            Pick a region, then query the Content API once for every locale it lists.
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
              <div className="flex flex-wrap gap-2" role="group" aria-label="Regions">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    type="button"
                    variant={region.id === selectedId ? "default" : "outline"}
                    aria-pressed={region.id === selectedId}
                    onClick={() => {
                      setSelectedId(region.id);
                      setGroups(null);
                    }}
                  >
                    {region.name}
                  </Button>
                ))}
              </div>

              {selected && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Text variant="label" as="span">Locales:</Text>
                  {selected.locales.map((locale) => (
                    <Badge key={locale} variant="secondary">{locale}</Badge>
                  ))}
                </div>
              )}

              <div>
                <Button type="button" onClick={runQuery} disabled={loading || !selected}>
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

          {groups && (
            <div className="mt-6 flex flex-col gap-6">
              {groups.map((group) => (
                <div key={group.locale} className="flex flex-col gap-3">
                  <Text variant="label" as="p">
                    {group.locale}: {group.entries.length}{" "}
                    {group.entries.length === 1 ? "entry" : "entries"}
                  </Text>
                  {group.entries.map((entry) => {
                    const href = sanitizeHref(entry.url);
                    return (
                      <div
                        key={entry.id}
                        className="rounded-lg border border-primary/40 bg-primary/5 p-4"
                      >
                        {href ? (
                          <Link href={href} className="hover:underline">
                            <Text variant="label" as="p">{entry.title}</Text>
                          </Link>
                        ) : (
                          <Text variant="label" as="p">{entry.title}</Text>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Text variant="h5" as="h3" className="mb-3">Request shape</Text>
        <Text variant="body-sm" color="muted" className="mb-3">
          Each `regionRef` entry lists the locales it covers in `data.locales`. The demo reads
          that list, then issues one Content API query per locale.
        </Text>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code className="font-mono">{buildCodeExample(selected)}</code>
        </pre>
      </div>
    </div>
  );
}
