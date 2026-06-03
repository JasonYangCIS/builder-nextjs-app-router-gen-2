import {
  decodeCookieValue,
  encodeCookieValue,
  TARGETING_CHANGE_EVENT,
  TARGETING_COOKIE,
  type TargetingAttributes,
} from "./targeting";

/**
 * Abstraction over where TargetedBuilderContent reads targeting attributes — and
 * where the demo panel writes them. The component depends only on this seam, so
 * the mechanism is swappable (and fakeable in tests) without touching the wrapper.
 *
 * THE LESSON: targeting can be sourced two ways, with different tradeoffs. Both
 * implement the same interface; compare them below. The SSG demo route uses the
 * `cookie` source; production + SSR/PPR routes use `session`.
 */
export interface TargetingSource {
  /** Stable key passed as a prop from server components (objects can't cross RSC). */
  readonly key: TargetingSourceKey;
  /** Human label for the demo panel. */
  readonly label: string;
  /** Resolve the current targeting attributes (may hit the network). */
  load(): Promise<TargetingAttributes>;
  /** Persist attributes (panel only). */
  set(attrs: TargetingAttributes): Promise<void>;
  /** Clear attributes (panel only). */
  clear(): Promise<void>;
  /** Subscribe to change notifications; returns an unsubscribe function. */
  subscribe(onChange: () => void): () => void;
}

export type TargetingSourceKey = "cookie" | "session";

// Shared change-notification wiring: every source fires/listens to the same
// window event, so consumers re-resolve regardless of which source is active.
function subscribeToChange(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(TARGETING_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(TARGETING_CHANGE_EVENT, onChange);
}

/**
 * COOKIE source — simple, transparent, client-only.
 * + Synchronous read, visible/editable in DevTools (great for poking at a demo).
 * − Client-readable AND client-writable: spoofable, so unsafe for real authz.
 *   Cannot be trusted for server-side rendering.
 */
export const cookieTargetingSource: TargetingSource = {
  key: "cookie",
  label: "Client cookie (JS-readable)",
  async load() {
    if (typeof document === "undefined") return {};
    const row = document.cookie
      .split("; ")
      .find((r) => r.startsWith(`${TARGETING_COOKIE}=`));
    return decodeCookieValue(row?.slice(TARGETING_COOKIE.length + 1));
  },
  async set(attrs) {
    if (typeof document === "undefined") return;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${TARGETING_COOKIE}=${encodeCookieValue(attrs)}; path=/; SameSite=Lax${secure}`;
  },
  async clear() {
    if (typeof document === "undefined") return;
    document.cookie = `${TARGETING_COOKIE}=; path=/; SameSite=Lax; Max-Age=0`;
  },
  subscribe: subscribeToChange,
};

/**
 * SESSION source — production-shaped, server-authoritative.
 * + Backed by a signed, httpOnly cookie the client can't read or forge.
 * + Works server-side too (SSR/PPR read the session directly).
 * − More moving parts (an API route) and one extra round-trip on the client.
 */
export const sessionTargetingSource: TargetingSource = {
  key: "session",
  label: "Server session (httpOnly)",
  async load() {
    try {
      const res = await fetch("/api/targeting", { cache: "no-store" });
      return res.ok ? (await res.json()) : {};
    } catch {
      return {};
    }
  },
  async set(attrs) {
    await fetch("/api/targeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attrs),
    }).catch(() => {});
  },
  async clear() {
    await fetch("/api/targeting", { method: "DELETE" }).catch(() => {});
  },
  subscribe: subscribeToChange,
};

export const TARGETING_SOURCES: Record<TargetingSourceKey, TargetingSource> = {
  cookie: cookieTargetingSource,
  session: sessionTargetingSource,
};

/** Default when a route doesn't specify one. */
export const DEFAULT_TARGETING_SOURCE_KEY: TargetingSourceKey = "session";
