import "server-only";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, SUPPORTED_LOCALE_CODES } from "@/utils/locale";

/**
 * Reads the x-locale header injected by middleware.
 * Falls back to the default locale if the header is absent or unrecognised.
 * Must only be called from Server Components (uses next/headers).
 */
export async function getLocaleFromHeaders(): Promise<string> {
  const headersList = await headers();
  const locale = headersList.get("x-locale");
  if (locale && SUPPORTED_LOCALE_CODES.includes(locale)) return locale;
  return DEFAULT_LOCALE;
}
