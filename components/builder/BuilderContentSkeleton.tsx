import { cn } from "@/utils/cn";

interface BuilderContentSkeletonProps {
  /** Reserve roughly the expected content height to minimize layout shift (CLS). */
  className?: string;
}

/**
 * Generic loading placeholder shown by TargetedBuilderContent while a targeted
 * entry is being re-fetched on the client. Uses design-system tokens so it
 * adapts to light/dark themes. Page content shape is unknown ahead of time, so
 * this is a deliberately generic hero-style skeleton with a sensible min-height.
 */
export function BuilderContentSkeleton({ className }: BuilderContentSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn("mx-auto w-full max-w-5xl px-6 py-12", className)}
    >
      <span className="sr-only">Loading personalized content…</span>
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-2/3 rounded-md bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-64 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}
