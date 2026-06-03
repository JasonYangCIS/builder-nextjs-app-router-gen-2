"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { fetchOneEntry, type BuilderContent } from "@builder.io/sdk-react";
import { config } from "@/config";
import { RenderBuilderContent } from "@/components/builder/RenderBuilderContent";
import {
  DEFAULT_TARGETING_SOURCE_KEY,
  TARGETING_SOURCES,
  type TargetingSource,
  type TargetingSourceKey,
} from "@/utils/targeting-source";

interface TargetedBuilderContentProps {
  /** The server's default entry (fetched with no targeting). Shown immediately. */
  initialContent: BuilderContent | null;
  model: string;
  /** urlPath used for the targeted client-side re-fetch (e.g. "/" or "/custom-targeting"). */
  urlPath: string;
  /** Active locale — forwarded to both the re-fetch and <Content>. */
  locale?: string;
  /** Optional injected data (Hybrid pattern). Forwarded to RenderBuilderContent. */
  data?: Record<string, unknown>;
  /**
   * Optional placeholder rendered while a targeted entry is being fetched on the
   * client, so the default→targeted swap isn't jarring. When omitted, the
   * default content stays visible during the fetch (no skeleton). Untargeted
   * visitors never see this — no fetch happens for them.
   */
  fallback?: ReactNode;
  /**
   * Which targeting source to use, as a serializable key — server components
   * can't pass the source object across the RSC boundary. Defaults to the
   * session source. The SSG demo route passes "cookie" to show the contrast.
   */
  sourceKey?: TargetingSourceKey;
  /** Direct source override for client-side tests (takes precedence over sourceKey). */
  source?: TargetingSource;
}

/**
 * Renders the server's default Builder entry immediately, then — only when the
 * targeting `source` resolves non-empty attributes (by default the server
 * session via /api/targeting) — re-fetches the targeted entry on the client and
 * swaps it in.
 *
 * Why this exists: `/custom-targeting`-style content uses ENTRY-LEVEL targeting
 * (a separate Builder entry per audience). `setClientUserAttributes` only
 * re-filters Personalization Container variants already embedded in the payload,
 * so it cannot reach a different entry. A real client-side `fetchOneEntry` can.
 *
 * Keeping the server fetch attribute-free lets the route stay static/ISR (no
 * `force-dynamic`); untargeted visitors pay nothing and there is no flash. Only
 * targeted visitors incur one extra client fetch and a brief default→targeted
 * swap. Works for Personalization Container content too (the swap is harmless).
 */
export function TargetedBuilderContent({
  initialContent,
  model,
  urlPath,
  locale,
  data,
  fallback,
  sourceKey = DEFAULT_TARGETING_SOURCE_KEY,
  source,
}: TargetedBuilderContentProps) {
  const resolvedSource = source ?? TARGETING_SOURCES[sourceKey];
  const [content, setContent] = useState<BuilderContent | null>(initialContent);
  // True while a targeted entry is being fetched, so we can show `fallback`.
  const [pending, setPending] = useState(false);
  // Monotonic id so a slow response can't overwrite a newer one.
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;

    async function apply() {
      const targeting = await resolvedSource.load();
      if (!active) return;
      // No targeting → keep the server's default entry; no Builder fetch.
      if (Object.keys(targeting).length === 0) {
        setPending(false);
        setContent(initialContent);
        return;
      }
      const id = ++requestId.current;
      setPending(true);
      const targeted = await fetchOneEntry({
        apiKey: config.envs.builderApiKey,
        model,
        userAttributes: { urlPath, locale, ...targeting },
        locale,
      });
      // Ignore if unmounted/superseded; fall back to default if nothing matched.
      if (!active || id !== requestId.current) return;
      setContent(targeted ?? initialContent);
      setPending(false);
    }

    apply();
    const unsubscribe = resolvedSource.subscribe(() => apply());
    return () => {
      active = false;
      unsubscribe();
    };
  }, [initialContent, model, urlPath, locale, resolvedSource]);

  // Show the skeleton only while fetching AND a fallback was provided; otherwise
  // keep the current content visible (default during the first fetch).
  if (pending && fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <RenderBuilderContent content={content} model={model} locale={locale} data={data} />
  );
}
