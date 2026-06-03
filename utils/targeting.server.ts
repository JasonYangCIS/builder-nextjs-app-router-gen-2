import { getSessionTargeting } from "./session.server";
import type { TargetingAttributes } from "./targeting";

// Server-side targeting derived from the signed, httpOnly session cookie. Used by
// the SSR and PPR demo routes (which read the cookie server-side and pass it to
// fetchOneEntry). Authoritative and tamper-evident — the client cannot read or
// forge the session. See utils/session.server.ts for the derivation.
export async function getTargetingAttributes(): Promise<TargetingAttributes> {
  return getSessionTargeting();
}
