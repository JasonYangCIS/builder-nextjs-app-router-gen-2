import { cookies } from "next/headers";
import { parseTargeting, TARGETING_COOKIE, type TargetingAttributes } from "./targeting";

// Demo-only signal. The cookie is client-writable by design so the floating
// TargetingDemoControls panel can spoof attributes for previewing Builder
// variants. Never use these values for authn/authz — real personalization must
// derive isLoggedIn / userType from the server-side session, not this cookie.
export async function getTargetingAttributes(): Promise<TargetingAttributes> {
  const c = await cookies();
  return parseTargeting(c.get(TARGETING_COOKIE)?.value);
}
