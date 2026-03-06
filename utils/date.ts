const BLOG_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

/**
 * Formats a date string for blog display (e.g. "January 15, 2025").
 */
export function formatBlogDate(date: string | null | undefined): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toLocaleDateString("en-US", BLOG_DATE_OPTIONS);
}
