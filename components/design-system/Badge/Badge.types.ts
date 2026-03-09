export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "error";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Badge label — used as children when no children provided (Builder.io authoring) */
  label?: string;
  children?: React.ReactNode;
  className?: string;
}
