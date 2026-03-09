"use client";

import { cn } from "@/utils/cn";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 border border-transparent",
  secondary:
    "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 active:bg-zinc-100",
  ghost:
    "bg-transparent text-zinc-700 border border-transparent hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200",
  destructive:
    "bg-error-600 text-white hover:bg-error-700 active:bg-error-700 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-lg gap-2",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  label,
  disabled = false,
  loading = false,
  type = "button",
  leftIcon,
  rightIcon,
  onClick,
  children,
  className,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const content = children ?? label;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        // Base
        "inline-flex items-center justify-center font-medium",
        "transition-colors duration-150",
        // Focus — WCAG 2.1 AA: visible focus indicator with 3:1 contrast
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2",
        // Disabled
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <Spinner className={iconSizeClasses[size]} />
      ) : (
        leftIcon && (
          <span className={cn("shrink-0", iconSizeClasses[size])} aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}

      {content}

      {!loading && rightIcon && (
        <span className={cn("shrink-0", iconSizeClasses[size])} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
