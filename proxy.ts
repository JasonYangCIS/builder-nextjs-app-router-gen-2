import { NextRequest, NextResponse } from "next/server";
import { config as appConfig } from "@/config";

const SUPPORTED_LOCALE_CODES = appConfig.locales.supported.map((l) => l.code);
const DEFAULT_LOCALE = appConfig.locales.default;

/**
 * Blog detail routes that have their own `app/[locale]/…` segments and
 * generate static params per locale. This proxy must NOT strip the locale
 * prefix from these paths — let Next.js route them normally so the `[locale]`
 * param reaches the page and ISR is preserved.
 *
 * Pattern: /{locale}/{model-slug}/{article-slug}
 */
const STATIC_LOCALE_ROUTE_PATTERNS = [
  /^\/[^/]+\/blog-article\/[^/]+\/?$/,
  /^\/[^/]+\/blog-article-section\/[^/]+\/?$/,
  /^\/[^/]+\/blog-article-template\/[^/]+\/?$/,
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract the first path segment to check if it's a locale prefix
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const detectedLocale =
    firstSegment && SUPPORTED_LOCALE_CODES.includes(firstSegment)
      ? firstSegment
      : null;

  const locale = detectedLocale ?? DEFAULT_LOCALE;

  // Clone request headers and inject x-locale so Server Components can
  // read it via `headers()` from next/headers. Setting it only on the
  // response headers is NOT enough — Server Components only see request headers.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  if (detectedLocale) {
    // Static ISR routes own their own [locale] segment — do not strip the
    // prefix. Next.js routes these to app/[locale]/…/[slug]/page.tsx directly.
    const isStaticLocaleRoute = STATIC_LOCALE_ROUTE_PATTERNS.some((re) =>
      re.test(pathname)
    );

    if (!isStaticLocaleRoute) {
      // Rewrite: strip the locale prefix so all other page files see the
      // original path (Builder catch-all, list pages, design-system, etc.)
      const strippedPath = "/" + segments.slice(1).join("/");
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = strippedPath || "/";

      return NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
      });
    }
  }

  // No locale prefix, or a static ISR route — pass through with the injected
  // locale header.
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - Static files (images, fonts, etc.)
     * - favicon.ico
     * - api routes
     */
    "/((?!_next|favicon\\.ico|api|.*\\..*).*)",
  ],
};
