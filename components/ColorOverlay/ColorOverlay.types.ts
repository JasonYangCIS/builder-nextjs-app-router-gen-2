import type { ReactNode } from "react";

export type OverlayBlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten";

export interface ColorOverlayProps {
  /** Builder child blocks dropped into the container. */
  children?: ReactNode;
  /** Overlay tint color (any CSS color; Builder color picker returns rgba/hex). */
  overlayColor?: string | null;
  /** Overlay strength, 0 (invisible) → 1 (opaque). Clamped at render. */
  opacity?: number | null;
  /** CSS mix-blend-mode applied to the overlay layer. */
  blendMode?: OverlayBlendMode | null;
  /** Rounded corners applied to the container + clipped overlay, in px. */
  borderRadius?: number | null;
  className?: string;
}
