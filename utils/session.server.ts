import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { config } from "@/config";
import { coerceTargeting, type TargetingAttributes } from "./targeting";

// Name of the httpOnly, signed session cookie. Unlike the old JS-readable
// targeting cookie, this is server-set and tamper-evident: the client cannot
// read it (httpOnly) or forge it (HMAC signature).
export const SESSION_COOKIE = "builder-session";

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", config.envs.sessionSecret)
    .update(payload)
    .digest("base64url");
}

/** Encode + sign targeting attributes into a `<payload>.<hmac>` cookie value. */
export function encodeSession(attrs: TargetingAttributes): string {
  const payload = Buffer.from(JSON.stringify(attrs)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Verify the signature and decode attributes; returns {} if missing/tampered. */
export function decodeSession(raw: string | undefined): TargetingAttributes {
  if (!raw) return {};
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return {};
  const expected = sign(payload);
  // Constant-time comparison to avoid leaking signature info via timing.
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return {};
  }
  try {
    return coerceTargeting(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")));
  } catch {
    return {};
  }
}

/**
 * Server-side targeting derived from the signed session cookie. Used by SSR/PPR
 * demo routes and the /api/targeting endpoint. In a real app this is where you'd
 * map an authenticated session to targeting attributes (plan, role, geo, …).
 */
export async function getSessionTargeting(): Promise<TargetingAttributes> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}
