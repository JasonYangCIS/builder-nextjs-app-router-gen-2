"use client";

import { useState, useMemo, useEffect } from "react";
import { isPreviewing, isEditing, fetchOneEntry } from "@builder.io/sdk-react";
import { config } from "@/config";
import { cn } from "@/utils/cn";
import { sanitizeHtml } from "@/utils/sanitize-html";
import type { FaqTag, FaqEntry } from "@/types/faq.types";
import type { FaqListProps, FaqReference } from "./FaqList.types";

function faqTagLabel(t: FaqTag | null | undefined): string | null {
  const s = t?.tag?.trim();
  return s || null;
}

export type { FaqListProps } from "./FaqList.types";

const pillBase =
  "py-[0.375rem] px-[0.875rem] rounded-full border border-border bg-transparent text-muted-foreground text-sm font-medium cursor-pointer transition-[background-color,color,border-color] duration-150 ease-in hover:bg-accent hover:text-accent-foreground hover:border-accent motion-reduce:transition-none";

const pillActive =
  "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground hover:border-primary";

/** Read the active locale from Builder's editor/preview URL params. */
function getPreviewLocale(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  // Builder sets builder.options.locale; fall back to the custom ?locale= param.
  const candidate =
    params.get("builder.options.locale") ?? params.get("locale") ?? "";
  // Builder uses "Default" as a sentinel for the default locale — ignore it.
  return candidate && candidate !== "Default" ? candidate : undefined;
}

/**
 * In Builder's visual editor / preview mode, `type: "reference"` inputs pass
 * the selected entry's `id` but do NOT resolve the `value`. Fetch each missing
 * entry individually so a single failure cannot blank the entire list.
 */
async function resolveUnresolved(
  items: FaqReference[],
  locale: string | undefined,
): Promise<FaqReference[]> {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      // Already resolved — nothing to do.
      if (item?.faqEntry?.value?.data) return item;

      const id = item?.faqEntry?.id;
      if (!id) return item;

      const entry = await fetchOneEntry({
        model: config.models.faq,
        apiKey: config.envs.builderApiKey,
        query: { id },
        ...(locale ? { locale } : {}),
      });

      if (!entry?.data) return item;

      return {
        ...item,
        faqEntry: {
          ...item.faqEntry,
          value: { data: entry.data as FaqEntry },
        },
      } satisfies FaqReference;
    }),
  );

  // Fulfilled items get their resolved value; rejected items fall back to the
  // original (unresolved) item so the rest of the list still renders.
  return results.map((result, i) =>
    result.status === "fulfilled" ? result.value : items[i],
  );
}

export default function FaqList({ title, faqItems }: FaqListProps) {
  // null = no filter (show all); string = filter to that tag
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // In editor/preview, references aren't resolved by Builder — use local state
  // so we can populate it via a client-side fetch.
  const [resolvedItems, setResolvedItems] = useState<FaqReference[]>(
    faqItems ?? [],
  );

  useEffect(() => {
    const inEditor = isPreviewing() || isEditing();

    // Production path: props are already server-resolved, sync directly.
    if (!inEditor) {
      setResolvedItems(faqItems ?? []);
      return;
    }

    if (!faqItems?.length) {
      setResolvedItems([]);
      return;
    }

    // Editor path: check whether any items actually need resolution before
    // touching state. This avoids a blank flash when all values are present.
    const needsResolution = faqItems.some(
      (item) => item?.faqEntry?.id && !item?.faqEntry?.value?.data,
    );

    if (!needsResolution) {
      setResolvedItems(faqItems);
      return;
    }

    // Fetch unresolved entries without resetting state first — keep whatever
    // is currently displayed until the new data arrives.
    let cancelled = false;
    const locale = getPreviewLocale();

    resolveUnresolved(faqItems, locale)
      .then((items) => {
        if (!cancelled) setResolvedItems(items);
      })
      .catch(() => {
        // Last-resort fallback: show raw items (questions visible, answers blank).
        if (!cancelled) setResolvedItems(faqItems);
      });

    return () => {
      cancelled = true;
    };
  }, [faqItems]);

  const entries = useMemo(
    () =>
      resolvedItems.flatMap((item) => {
        const data = item?.faqEntry?.value?.data;
        if (!data) return [];
        return [
          {
            ...data,
            id: item?.faqEntry?.id ?? null,
            sanitizedAnswer: sanitizeHtml(data.answer ?? ""),
          },
        ];
      }),
    [resolvedItems],
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const entry of entries) {
      for (const tag of entry?.tags ?? []) {
        const label = faqTagLabel(tag);
        if (label) tagSet.add(label);
      }
    }
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (activeTag === null) return entries;
    return entries.filter((entry) =>
      entry?.tags?.some((t) => faqTagLabel(t) === activeTag),
    );
  }, [entries, activeTag]);

  const hasTags = allTags.length > 0;

  return (
    <section
      className="max-w-[860px] mx-auto px-6 py-16 w-full"
      data-testid="faq-list"
    >
      {title && (
        <h2 className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.02em] text-foreground mt-0 mb-8">
          {title}
        </h2>
      )}

      {hasTags && (
        <div
          className="flex flex-wrap gap-2 mb-8"
          role="group"
          aria-label="Filter by tag"
        >
          <button
            className={cn(pillBase, activeTag === null && pillActive)}
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={cn(pillBase, activeTag === tag && pillActive)}
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <p className="text-muted-foreground text-[0.9375rem] py-6">
          No FAQ entries found.
        </p>
      ) : (
        <div>
          {filteredEntries.map((entry, index) => (
            <details
              key={entry.id ?? `${entry.question ?? ""}-${index}`}
              className="border-b border-border first:border-t group"
            >
              <summary className="flex justify-between items-center gap-4 py-5 text-base font-semibold text-foreground cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                <span>{entry?.question ?? "Untitled question"}</span>
                <svg
                  className="shrink-0 w-4 h-4 transition-transform duration-200 ease-in group-open:rotate-180 motion-reduce:transition-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                className="pb-5 text-[0.9375rem] leading-[1.7] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_p:last-child]:mb-0"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: entry.sanitizedAnswer,
                }}
              />
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
