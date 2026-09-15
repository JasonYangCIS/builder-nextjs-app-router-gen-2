import { NextRequest, NextResponse } from "next/server";
import { config as appConfig } from "@/config";

const SUPPORTED_LOCALE_CODES = appConfig.locales.supported.map((l) => l.code);
const DEFAULT_LOCALE = appConfig.locales.default;

/**
 * Paths that live outside the [locale] segment and must not be locale-prefixed.
 * The proxy passes these through without rewriting.
 */
const LOCALE_BYPASS_PREFIXES = ["/preview", "/test", "/api"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip paths that live outside the locale segment
  if (LOCALE_BYPASS_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const hasLocalePrefix =
    firstSegment && SUPPORTED_LOCALE_CODES.includes(firstSegment);

  if (hasLocalePrefix) {
    if (firstSegment === DEFAULT_LOCALE) {
      // Redirect /en-US/about → /about to enforce canonical URLs
      const canonicalPath = "/" + segments.slice(1).join("/") || "/";
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = canonicalPath;
      return NextResponse.redirect(redirectUrl, 301);
    }
    // Non-default locale prefix — pass through, Next.js routes to [locale]/...
    return NextResponse.next();
  }

  // No locale prefix — rewrite internally to /{DEFAULT_LOCALE}/{path}
  // so Next.js routes to app/[locale]/... with locale = DEFAULT_LOCALE.
  // The browser URL stays clean (e.g. /about, not /en-US/about).
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - Static files (images, fonts, etc.)
     * - favicon.ico
     */
    "/((?!_next|favicon\\.ico|.*\\..*).*)",
  ],
};
