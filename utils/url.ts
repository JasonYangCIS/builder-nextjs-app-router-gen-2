/**
 * Sanitizes a URL string for use in an href attribute.
 *
 * Allows:
 *   - Relative paths  (/about, ./page, ../parent)
 *   - http:// and https:// URLs
 *
 * Blocks everything else (javascript:, data:, vbscript:, etc.)
 * by returning an empty string, which produces a harmless inert link.
 */
export function sanitizeHref(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Allow relative paths (starts with /, ./, ../, or #)
  if (/^(\/|\.\/|\.\.\/|#)/.test(trimmed)) return trimmed;

  // Allow only http and https absolute URLs
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    // Not a valid absolute URL — treat as unsafe
  }

  return "";
}
