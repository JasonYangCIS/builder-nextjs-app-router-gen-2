import { NextResponse, type NextRequest } from "next/server";
import { coerceTargeting } from "@/utils/targeting";
import { SESSION_COOKIE, decodeSession, encodeSession } from "@/utils/session.server";

// This endpoint reads/writes the httpOnly session cookie, so it is inherently
// dynamic — but it's a tiny, uncached route. Keeping the session read here (not
// in the page) is what lets the pages stay statically rendered.
export const dynamic = "force-dynamic";

function sessionCookieOptions(req: NextRequest) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: req.nextUrl.protocol === "https:",
    path: "/",
  };
}

// Derive the current targeting attributes from the signed session.
export async function GET(req: NextRequest) {
  return NextResponse.json(decodeSession(req.cookies.get(SESSION_COOKIE)?.value));
}

// "Log in" / set the session. In a real app the body would be a credential check;
// here the demo panel posts the attributes to simulate an authenticated session.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const attrs = coerceTargeting(body);
  const res = NextResponse.json(attrs);
  res.cookies.set(SESSION_COOKIE, encodeSession(attrs), sessionCookieOptions(req));
  return res;
}

// Clear the session ("log out").
export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({});
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(req), maxAge: 0 });
  return res;
}
