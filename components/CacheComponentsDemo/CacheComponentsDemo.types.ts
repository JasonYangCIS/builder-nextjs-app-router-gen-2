export type CacheComponentsMode = "off" | "on";

export type NodeKind = "static" | "dynamic" | "client";

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
  kind: Record<CacheComponentsMode, NodeKind>;
  /** Can the viewer opt this node into `'use cache'` when mode is "on"? */
  cacheable?: boolean;
  /** Shown once the viewer opts this node into `'use cache'`. */
  cachedNote?: string;
}
