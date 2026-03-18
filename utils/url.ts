/**
 * Sanitizes a URL string for use in an href attribute.
 *
 * Uses the URL API (zero additional dependencies) rather than DOMPurify,
 * which is the right tool for HTML sanitization but heavyweight for a simple
 * allowlist check (it loads jsdom on the server side).
 *
 * Allows:
 *   - Relative paths  (/about, ./page, ../parent, #anchor)
 *   - http:// and https:// absolute URLs
 *
 * Blocks everything else (javascript:, data:, vbscript:, etc.)
 * by returning an empty string, producing a harmless inert link.
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
