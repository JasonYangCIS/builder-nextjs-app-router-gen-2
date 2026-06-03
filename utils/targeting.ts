export const USER_TYPES = ["admin", "designer", "developer"] as const;
export type UserType = (typeof USER_TYPES)[number];

export type TargetingAttributes = {
  isLoggedIn?: boolean;
  userType?: UserType;
};

// Validate/whitelist an arbitrary parsed value into TargetingAttributes. Used
// for the API request body and when decoding the signed session payload, so
// untrusted input can never inject unexpected attributes.
export function coerceTargeting(parsed: unknown): TargetingAttributes {
  if (!parsed || typeof parsed !== "object") return {};
  const obj = parsed as Record<string, unknown>;
  const out: TargetingAttributes = {};
  if (typeof obj.isLoggedIn === "boolean") out.isLoggedIn = obj.isLoggedIn;
  if (
    typeof obj.userType === "string" &&
    (USER_TYPES as readonly string[]).includes(obj.userType)
  ) {
    out.userType = obj.userType as UserType;
  }
  return out;
}

// Window event dispatched by TargetingDemoControls after targeting changes, so
// client-side consumers (TargetedBuilderContent) can re-resolve without a full
// navigation. Server-rendered demo routes (SSR/PPR) instead rely on
// router.refresh() to re-read the session cookie on the server.
export const TARGETING_CHANGE_EVENT = "builder-targeting-change";

// JS-readable cookie used by the "cookie" TargetingSource (the transparent demo
// alternative). Pure codec helpers below are safe on both client and server.
export const TARGETING_COOKIE = "builder-targeting";

export function encodeCookieValue(attrs: TargetingAttributes): string {
  return encodeURIComponent(JSON.stringify(attrs));
}

export function decodeCookieValue(raw: string | undefined): TargetingAttributes {
  if (!raw) return {};
  try {
    return coerceTargeting(JSON.parse(decodeURIComponent(raw)));
  } catch {
    return {};
  }
}
