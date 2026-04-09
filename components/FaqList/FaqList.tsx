"use client";

import { useState, useMemo } from "react";
import { cn } from "@/utils/cn";
import { sanitizeHtml } from "@/utils/sanitize-html";
import type { FaqListProps } from "./FaqList.types";

export type { FaqListProps } from "./FaqList.types";

const pillBase =
  "py-[0.375rem] px-[0.875rem] rounded-full border border-border bg-transparent text-muted-foreground text-sm font-medium cursor-pointer transition-[background-color,color,border-color] duration-150 ease-in hover:bg-accent hover:text-accent-foreground hover:border-accent motion-reduce:transition-none";

const pillActive =
  "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground hover:border-primary";

export default function FaqList({ title, faqItems }: FaqListProps) {
  // null = no filter (show all); string = filter to that tag
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const entries = useMemo(
    () =>
      (faqItems ?? [])
        .flatMap((item) => {
          const data = item?.faqEntry?.value?.data;
          if (!data) return [];
          return [{ ...data, sanitizedAnswer: sanitizeHtml(data.answer ?? "") }];
        }),
    [faqItems],
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const entry of entries) {
      for (const tag of entry?.tags ?? []) {
        if (tag) tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (activeTag === null) return entries;
    return entries.filter((entry) => entry?.tags?.includes(activeTag));
  }, [entries, activeTag]);

  const hasTags = allTags.length > 0;

  return (
    <section
      className="max-w-[860px] mx-auto px-6 py-16"
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
              key={`${entry?.question ?? ""}-${index}`}
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
