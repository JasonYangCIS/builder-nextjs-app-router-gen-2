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
 * Any link with target="_blank" has rel="noopener noreferrer" enforced
 * via an afterSanitizeAttributes hook to prevent reverse tabnapping.
 *
 * @example
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }} />
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, SANITIZE_OPTIONS) as string;
}

// Enforce rel="noopener noreferrer" on every <a target="_blank"> after
// sanitization. ADD_ATTR only extends the allowlist — it does not set values.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

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
    "width", "height",
    "colspan", "rowspan",
    "aria-label", "aria-hidden",
  ],
  FORCE_BODY: false,
};
