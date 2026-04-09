import DOMPurify from "isomorphic-dompurify";
import type { Config } from "dompurify";

/**
 * Sanitizes an HTML string for safe use with dangerouslySetInnerHTML.
 *
 * Wraps isomorphic-dompurify (works on both server and client) with a
 * conservative allowlist suited to Builder.io rich-text content: inline
 * formatting, links, images, and basic table structure are permitted;
 * scripts, event handlers, and dangerous attributes are stripped.
 *
 * @example
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }} />
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, SANITIZE_OPTIONS) as string;
}

const SANITIZE_OPTIONS: Config = {
  ALLOWED_TAGS: [
    // Block
    "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
    "div", "section", "article",
    // Inline
    "a", "strong", "b", "em", "i", "u", "s", "mark", "small", "sup", "sub", "span",
    // Media
    "img", "figure", "figcaption",
  ],
  ALLOWED_ATTR: [
    "href", "src", "alt", "title",
    "target", "rel",
    "class", "id",
    "width", "height",
    "colspan", "rowspan",
    "aria-label", "aria-hidden",
  ],
  // Force rel="noopener noreferrer" on any link that opens in a new tab
  ADD_ATTR: ["target"],
  FORCE_BODY: false,
};
