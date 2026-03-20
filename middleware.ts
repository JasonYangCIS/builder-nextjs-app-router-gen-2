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

  if (detectedLocale) {
    // Rewrite: strip the locale prefix so page files see the original path
    const strippedPath = "/" + segments.slice(1).join("/");
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = strippedPath || "/";

    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-locale", locale);
    return response;
  }

  // No locale prefix — pass through with the default locale header
  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
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
