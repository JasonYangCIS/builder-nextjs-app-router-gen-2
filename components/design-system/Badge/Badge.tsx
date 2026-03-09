import { cn } from "@/utils/cn";
import type { BadgeProps, BadgeVariant, BadgeSize } from "./Badge.types";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-zinc-100 text-zinc-700",
  primary: "bg-brand-100 text-brand-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  error:   "bg-error-100 text-error-700",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  variant = "neutral",
  size = "md",
  label,
  children,
  className,
}: BadgeProps) {
  const content = children ?? label;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {content}
    </span>
  );
}
