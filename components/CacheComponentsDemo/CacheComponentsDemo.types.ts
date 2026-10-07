export type CacheComponentsMode = "off" | "on";

export type NodeKind = "static" | "dynamic" | "client";

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
  kind: Record<CacheComponentsMode, NodeKind>;
}
