import { config } from "@/config";

export const DEFAULT_LOCALE = config.locales.default;

export const SUPPORTED_LOCALE_CODES = config.locales.supported.map((l) => l.code);

/**
 * Returns a path prefixed with the locale code, omitting the prefix for the
 * default locale so that URLs remain clean (e.g. /about instead of /en-US/about).
 *
 * Skips absolute URLs (https://...) and paths that already carry a supported
 * locale prefix to prevent double-prefixing Builder nav entry URLs.
 */
export function buildLocalePath(locale: string, path: string): string {
  // Leave absolute URLs untouched
  if (/^https?:\/\//.test(path) || path.startsWith("//")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // Don't double-prefix if the path already starts with a supported locale
  const firstSegment = normalized.split("/").filter(Boolean)[0];
  if (firstSegment && SUPPORTED_LOCALE_CODES.includes(firstSegment)) return normalized;
  if (locale === DEFAULT_LOCALE) return normalized;
  return `/${locale}${normalized}`;
}

/**
 * Strips a supported locale prefix from the beginning of a pathname.
 * Returns the original pathname if no recognised locale prefix is found.
 */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && SUPPORTED_LOCALE_CODES.includes(segments[0])) {
    const stripped = segments.slice(1).join("/");
    return stripped ? `/${stripped}` : "/";
  }
  return pathname;
}

/**
 * Reads the active locale directly from a URL pathname.
 * Safe to call in client components — no server APIs required.
 * Falls back to the default locale when no recognised prefix is found.
 */
export function getLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && SUPPORTED_LOCALE_CODES.includes(segments[0])) {
    return segments[0];
  }
  return DEFAULT_LOCALE;
}
