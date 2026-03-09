import { cn } from "@/utils/cn";
import type { CardProps, CardPadding, CardShadow } from "./Card.types";

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

const shadowClasses: Record<CardShadow, string> = {
  none: "",
  sm:   "shadow-sm",
  md:   "shadow-md",
  lg:   "shadow-lg",
};

export function Card({
  padding = "md",
  shadow = "sm",
  borderless = false,
  children,
  className,
  role,
  "aria-label": ariaLabel,
}: CardProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={cn(
        "rounded-xl bg-white",
        !borderless && "border border-zinc-200",
        paddingClasses[padding],
        shadowClasses[shadow],
        className
      )}
    >
      {children}
    </div>
  );
}
