import { NextRequest, NextResponse } from "next/server";
import { config as appConfig } from "@/config";

const SUPPORTED_LOCALE_CODES = appConfig.locales.supported.map((l) => l.code);
const DEFAULT_LOCALE = appConfig.locales.default;

export function middleware(request: NextRequest) {
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
    // Rewrite: strip the locale prefix so page files see the original path
    const strippedPath = "/" + segments.slice(1).join("/");
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = strippedPath || "/";

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  // No locale prefix — pass through with the injected locale header
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
