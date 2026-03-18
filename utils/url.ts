import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes a URL string for use in an href attribute.
 *
 * Delegates to DOMPurify.isValidAttribute, which blocks dangerous schemes
 * (javascript:, data:, vbscript:, etc.) while allowing http/https and
 * relative paths. Returns an empty string for any unsafe value.
 */
export function sanitizeHref(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  return DOMPurify.isValidAttribute("a", "href", trimmed) ? trimmed : "";
}
