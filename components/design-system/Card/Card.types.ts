export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardShadow = "none" | "sm" | "md" | "lg";

export interface CardProps {
  padding?: CardPadding;
  shadow?: CardShadow;
  /** Remove the default border */
  borderless?: boolean;
  children?: React.ReactNode;
  className?: string;
  /** Accessible role override (e.g. "article", "region") */
  role?: string;
  /** aria-label for landmark regions */
  "aria-label"?: string;
}
