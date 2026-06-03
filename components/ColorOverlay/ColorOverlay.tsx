import { cn } from "@/utils/cn";
import type { ColorOverlayProps } from "./ColorOverlay.types";

export type { ColorOverlayProps } from "./ColorOverlay.types";

/**
 * Container component that wraps any dropped Builder blocks and paints a
 * tinted color layer over them. The overlay is purely decorative: it is
 * `aria-hidden` and `pointer-events-none` so it never blocks clicks on the
 * underlying content.
 */
export default function ColorOverlay({
  children,
  overlayColor,
  opacity,
  blendMode,
  borderRadius,
  className,
}: ColorOverlayProps) {
  // Builder can pass arbitrary values — clamp opacity to a valid 0–1 range.
  const rawOpacity = typeof opacity === "number" ? opacity : 0.5;
  const safeOpacity = Math.min(1, Math.max(0, rawOpacity));
  const safeColor = overlayColor ?? "#000000";
  const safeBlend = blendMode ?? "normal";
  const safeRadius =
    typeof borderRadius === "number" && borderRadius > 0 ? borderRadius : 0;

  return (
    <div
      data-testid="color-overlay"
      className={cn("relative isolate", className)}
      style={safeRadius ? { borderRadius: safeRadius, overflow: "hidden" } : undefined}
    >
      {children}
      <div
        data-testid="color-overlay-layer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundColor: safeColor,
          opacity: safeOpacity,
          mixBlendMode: safeBlend,
        }}
      />
    </div>
  );
}
