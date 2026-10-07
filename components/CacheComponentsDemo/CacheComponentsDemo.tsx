"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Text } from "@/components/ui/Text/Text";
import { Badge } from "@/components/ui/Badge/Badge";
import type { CacheComponentsMode, DiagramNode, NodeKind } from "./CacheComponentsDemo.types";

export type { CacheComponentsMode, DiagramNode, NodeKind } from "./CacheComponentsDemo.types";

const NODES: DiagramNode[] = [
  {
    id: "layout",
    label: "Locale layout (Header / Footer)",
    detail:
      "No dynamic API reads here, so it's a safe candidate to mark 'use cache' — the shell can be shared across every visitor.",
    kind: { off: "static", on: "dynamic" },
    cacheable: true,
    cachedNote: "Now served from cache for every visitor until revalidated — this is the PPR demo's static shell.",
  },
  {
    id: "page-shell",
    label: "Page shell / markup",
    detail: "The chrome around the Builder content — headings, wrappers, containers. Also safe to cache.",
    kind: { off: "static", on: "dynamic" },
    cacheable: true,
    cachedNote: "Cached alongside the layout — no per-visitor data lives here.",
  },
  {
    id: "fetch-entry",
    label: "fetchOneEntry() — Builder content",
    detail:
      "Caching this means every visitor gets the SAME entry until revalidation — fine for the default/untargeted content, risky if this call includes per-user targeting.",
    kind: { off: "static", on: "dynamic" },
    cacheable: true,
    cachedNote: "Cached — behaves like the SSG demo route. Don't do this if the fetch includes per-user userAttributes.",
  },
  {
    id: "dynamic-api",
    label: "isPreviewing() / isEditing() / cookies()",
    detail:
      "Reads the URL's search params or a cookie — a genuinely per-request signal. Can NEVER be cached, with the flag on or off.",
    kind: { off: "dynamic", on: "dynamic" },
  },
  {
    id: "suspense",
    label: "<Suspense> boundary",
    detail:
      "Where the dynamic read above must be isolated so the rest of the tree is free to be cached.",
    kind: { off: "dynamic", on: "dynamic" },
  },
  {
    id: "client-counter",
    label: "Client component (Counter)",
    detail: "Hydrates in the browser. cacheComponents never touches this — it's a server-only switch.",
    kind: { off: "client", on: "client" },
  },
];

const KIND_STYLES: Record<NodeKind, string> = {
  static: "border-emerald-600/40 bg-emerald-500/10",
  dynamic: "border-amber-600/40 bg-amber-500/10",
  client: "border-primary/40 bg-primary/5",
};

const KIND_LABEL: Record<NodeKind, string> = {
  static: "Cached / static",
  dynamic: "Per-request",
  client: "Client-only",
};

const MODE_COPY: Record<CacheComponentsMode, { title: string; summary: string[] }> = {
  off: {
    title: "cacheComponents: false (this repo today)",
    summary: [
      "Everything is static by default. A route stays cacheable until something forces it dynamic.",
      "The moment anything in the tree reads a dynamic API — cookies(), headers(), isPreviewing() — the WHOLE route (not just that piece) becomes dynamic, unless that read is isolated behind a <Suspense> boundary (the pattern used by the ppr/custom-targeting demo).",
      "Granularity is per-route. You opt OUT of static by introducing dynamic reads.",
    ],
  },
  on: {
    title: "cacheComponents: true (opt-in, Next.js 16)",
    summary: [
      "The default flips: everything below starts amber ('per-request') because nothing has opted in to caching yet — that's expected, not broken.",
      "Click 'Add use cache' on an eligible tile to opt it in and watch it turn green. That's the whole model: cache nothing by default, cache exactly what you mark.",
      "The two amber tiles that never go green — the dynamic API read and its <Suspense> boundary — genuinely can't be cached; they're the dynamic 'hole' in an otherwise static page.",
    ],
  },
};

export default function CacheComponentsDemo() {
  const [mode, setMode] = useState<CacheComponentsMode>("off");
  const [cachedIds, setCachedIds] = useState<Set<string>>(new Set());
  const copy = MODE_COPY[mode];

  const setModeAndReset = (next: CacheComponentsMode) => {
    setMode(next);
    setCachedIds(new Set());
  };

  const toggleCached = (id: string) => {
    setCachedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant={mode === "off" ? "default" : "outline"}
          onClick={() => setModeAndReset("off")}
        >
          cacheComponents: off
        </Button>
        <Button
          type="button"
          variant={mode === "on" ? "default" : "outline"}
          onClick={() => setModeAndReset("on")}
        >
          cacheComponents: on
        </Button>
        <Badge variant="secondary">{mode === "off" ? "current default" : "opt-in"}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <Text variant="h6" as="h3" className="mb-2">
          {copy.title}
        </Text>
        <ul className="flex flex-col gap-1.5">
          {copy.summary.map((line) => (
            <li key={line} className="text-sm text-muted-foreground">
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NODES.map((node) => {
          const isOptedIn = mode === "on" && node.cacheable && cachedIds.has(node.id);
          const kind = isOptedIn ? "static" : node.kind[mode];
          const showToggle = mode === "on" && node.cacheable;

          return (
            <div
              key={node.id}
              className={`flex flex-col gap-1.5 rounded-lg border p-3 transition-colors ${KIND_STYLES[kind]}`}
            >
              <div className="flex items-center justify-between gap-2">
                <Text variant="label" as="p">
                  {node.label}
                </Text>
                <Badge variant="outline" className="shrink-0 text-[11px]">
                  {KIND_LABEL[kind]}
                </Badge>
              </div>
              <Text variant="caption" color="muted" as="p">
                {isOptedIn ? node.cachedNote : node.detail}
              </Text>
              {showToggle && (
                <Button
                  type="button"
                  size="sm"
                  variant={isOptedIn ? "secondary" : "outline"}
                  className="mt-1 w-fit text-xs"
                  onClick={() => toggleCached(node.id)}
                >
                  {isOptedIn ? "Remove 'use cache'" : "Add 'use cache'"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
