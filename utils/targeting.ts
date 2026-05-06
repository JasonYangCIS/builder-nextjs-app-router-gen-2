export const TARGETING_COOKIE = "builder-targeting";

export const USER_TYPES = ["admin", "designer", "developer"] as const;
export type UserType = (typeof USER_TYPES)[number];

export type TargetingAttributes = {
  isLoggedIn?: boolean;
  userType?: UserType;
};

export function parseTargeting(raw: string | undefined): TargetingAttributes {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: TargetingAttributes = {};
    const obj = parsed as Record<string, unknown>;
    if (typeof obj.isLoggedIn === "boolean") out.isLoggedIn = obj.isLoggedIn;
    if (typeof obj.userType === "string" && (USER_TYPES as readonly string[]).includes(obj.userType)) {
      out.userType = obj.userType as UserType;
    }
    return out;
  } catch {
    return {};
  }
}

export function serializeTargeting(value: TargetingAttributes): string {
  return encodeURIComponent(JSON.stringify(value));
}
