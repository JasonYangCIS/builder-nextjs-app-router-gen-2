import { cookies } from "next/headers";
import { parseTargeting, TARGETING_COOKIE, type TargetingAttributes } from "./targeting";

export async function getTargetingAttributes(): Promise<TargetingAttributes> {
  const c = await cookies();
  return parseTargeting(c.get(TARGETING_COOKIE)?.value);
}
