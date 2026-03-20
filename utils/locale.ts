import { config } from "@/config";

export const DEFAULT_LOCALE = config.locales.default;

export const SUPPORTED_LOCALE_CODES = config.locales.supported.map((l) => l.code);

/**
 * Returns a path prefixed with the locale code, omitting the prefix for the
 * default locale so that URLs remain clean (e.g. /about instead of /en-US/about).
 */
export function buildLocalePath(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
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
    return "/" + segments.slice(1).join("/") || "/";
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
