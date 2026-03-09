export type TypographyVariant =
  | "display"
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "body-lg" | "body" | "body-sm"
  | "caption" | "label" | "overline";

export type TypographyColor =
  | "default" | "muted" | "subtle"
  | "primary" | "success" | "warning" | "error";

export type TypographyWeight = "normal" | "medium" | "semibold" | "bold";
export type TypographyAlign = "left" | "center" | "right";

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  /** Override the rendered HTML element */
  as?: React.ElementType;
  /** Text content — used as children when no children provided (Builder.io authoring) */
  text?: string;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}
