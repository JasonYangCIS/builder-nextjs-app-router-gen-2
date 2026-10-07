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
      "No dynamic API reads here, so it's eligible to be served from cache in both models.",
    kind: { off: "static", on: "dynamic" },
  },
  {
    id: "page-shell",
    label: "Page shell / markup",
    detail: "The chrome around the Builder content — headings, wrappers, containers.",
    kind: { off: "static", on: "dynamic" },
  },
  {
    id: "fetch-entry",
    label: "fetchOneEntry() — Builder content",
    detail: "The call every route in this repo makes to pull a Builder entry.",
    kind: { off: "static", on: "dynamic" },
  },
  {
    id: "dynamic-api",
    label: "isPreviewing() / isEditing() / cookies()",
    detail: "Reads the URL's search params or a cookie — a genuinely per-request signal.",
    kind: { off: "dynamic", on: "dynamic" },
  },
  {
    id: "suspense",
    label: "<Suspense> boundary",
    detail: "Where the dynamic read is isolated from the rest of the tree.",
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
      "Everything is dynamic by default. Nothing is cached unless a function or component explicitly opts in with the 'use cache' directive.",
      "Granularity moves to the function/component level instead of the whole route — you can cache the layout shell while leaving one fetch dynamic.",
      "Any remaining dynamic read MUST be wrapped in <Suspense>, or the build fails with an error instead of silently making the route dynamic.",
    ],
  },
};

export default function CacheComponentsDemo() {
  const [mode, setMode] = useState<CacheComponentsMode>("off");
  const copy = MODE_COPY[mode];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant={mode === "off" ? "default" : "outline"}
          onClick={() => setMode("off")}
        >
          cacheComponents: off
        </Button>
        <Button
          type="button"
          variant={mode === "on" ? "default" : "outline"}
          onClick={() => setMode("on")}
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
          const kind = node.kind[mode];
          return (
            <div
              key={node.id}
              className={`rounded-lg border p-3 transition-colors ${KIND_STYLES[kind]}`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <Text variant="label" as="p">
                  {node.label}
                </Text>
                <Badge variant="outline" className="shrink-0 text-[11px]">
                  {KIND_LABEL[kind]}
                </Badge>
              </div>
              <Text variant="caption" color="muted" as="p">
                {node.detail}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
