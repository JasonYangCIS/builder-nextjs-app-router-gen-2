/**
 * Sanitizes a URL string for use in an href attribute.
 *
 * Uses the URL API (zero additional dependencies) rather than DOMPurify,
 * which is the right tool for HTML sanitization but heavyweight for a simple
 * allowlist check (it loads jsdom on the server side).
 *
 * Allows:
 *   - Relative paths  (/about, ./page, ../parent, #anchor)
 *     Note: protocol-relative URLs (//evil.com) are explicitly blocked —
 *     they start with / but resolve against the current protocol, enabling
 *     open-redirect and phishing attacks.
 *   - http:// and https:// absolute URLs
 *   - mailto: and tel: — common CTA schemes in a CMS context
 *
 * Blocks everything else (javascript:, data:, vbscript:, etc.)
 * by returning an empty string, producing a harmless inert link.
 */
export function sanitizeHref(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Allow relative paths — but NOT protocol-relative URLs (// prefix).
  // The negative lookahead (?!\/) ensures a leading slash is a path, not //host.
  if (/^(\/(?!\/)|\.\/|\.\.\/|#)/.test(trimmed)) return trimmed;

  // Allow safe absolute URL schemes
  try {
    const parsed = new URL(trimmed);
    const allowed = new Set(["http:", "https:", "mailto:", "tel:"]);
    if (allowed.has(parsed.protocol)) return trimmed;
  } catch {
    // Not a valid absolute URL — treat as unsafe
  }

  return "";
}
