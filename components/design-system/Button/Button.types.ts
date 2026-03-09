export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  /** Visual style */
  variant?: ButtonVariant;
  /** Size */
  size?: ButtonSize;
  /** Button label — used as children when no children provided (Builder.io authoring) */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Shows a spinner and disables interaction */
  loading?: boolean;
  /** HTML button type */
  type?: "button" | "submit" | "reset";
  /** Icon rendered before the label */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label */
  rightIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
  /** Accessible label override (use when button has no visible text) */
  "aria-label"?: string;
}
