"use client";

import { useState, useMemo } from "react";
import type { FaqListProps } from "./FaqList.types";
import styles from "./FaqList.module.scss";

export type { FaqListProps } from "./FaqList.types";

const ALL_TAG = "All";

export default function FaqList({ title, faqItems }: FaqListProps) {
  const [activeTag, setActiveTag] = useState<string>(ALL_TAG);

  const entries = useMemo(
    () =>
      (faqItems ?? [])
        .map((item) => item?.faqEntry?.value?.data)
        .filter(Boolean),
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
    if (activeTag === ALL_TAG) return entries;
    return entries.filter((entry) => entry?.tags?.includes(activeTag));
  }, [entries, activeTag]);

  const hasTags = allTags.length > 0;

  return (
    <section className={styles.section} data-testid="faq-list">
      {title && <h2 className={styles.heading}>{title}</h2>}

      {hasTags && (
        <div className={styles.tagBar} role="group" aria-label="Filter by tag">
          <button
            className={`${styles.tagPill} ${activeTag === ALL_TAG ? styles.tagPillActive : ""}`}
            onClick={() => setActiveTag(ALL_TAG)}
            aria-pressed={activeTag === ALL_TAG}
          >
            {ALL_TAG}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagPill} ${activeTag === tag ? styles.tagPillActive : ""}`}
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <p className={styles.emptyState}>No FAQ entries found.</p>
      ) : (
        <dl className={styles.accordionList}>
          {filteredEntries.map((entry, index) => (
            <details
              key={`${entry?.question ?? ""}-${index}`}
              className={styles.accordionItem}
            >
              <summary className={styles.accordionQuestion}>
                <span>{entry?.question ?? "Untitled question"}</span>
                <span className={styles.chevron} aria-hidden="true" />
              </summary>
              <div
                className={styles.accordionAnswer}
                // Builder rich-text answers may contain HTML markup
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: entry?.answer ?? "",
                }}
              />
            </details>
          ))}
        </dl>
      )}
    </section>
  );
}
