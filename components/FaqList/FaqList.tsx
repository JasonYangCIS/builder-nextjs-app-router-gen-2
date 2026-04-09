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

/**
 * In Builder's visual editor / preview mode, `type: "reference"` inputs pass
 * the selected entry's `id` but do NOT resolve the `value`. We detect that
 * state and fetch the missing FAQ entries from the Builder API client-side so
 * the component renders correctly while editing.
 */
async function resolveUnresolved(
  items: FaqReference[],
): Promise<FaqReference[]> {
  const resolved = await Promise.all(
    items.map(async (item) => {
      // Already resolved — nothing to do.
      if (item?.faqEntry?.value?.data) return item;

      const id = item?.faqEntry?.id;
      if (!id) return item;

      const entry = await fetchOneEntry({
        model: config.models.faq,
        apiKey: config.envs.builderApiKey,
        query: { id },
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
  return resolved;
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
    // Always sync when props change (editor updates component props live).
    setResolvedItems(faqItems ?? []);

    if (!isPreviewing() && !isEditing()) return;
    if (!faqItems?.length) return;

    let cancelled = false;

    resolveUnresolved(faqItems).then((items) => {
      if (!cancelled) setResolvedItems(items);
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
