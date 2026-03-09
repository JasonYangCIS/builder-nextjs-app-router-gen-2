import { cn } from "@/utils/cn";
import type {
  TypographyProps,
  TypographyVariant,
  TypographyColor,
  TypographyWeight,
  TypographyAlign,
} from "./Typography.types";

/** Default HTML element for each variant */
const variantElement: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  caption: "span",
  label: "span",
  overline: "span",
};

const variantClasses: Record<TypographyVariant, string> = {
  display:   "text-5xl font-bold tracking-tight leading-none",
  h1:        "text-4xl font-semibold tracking-tight leading-tight",
  h2:        "text-3xl font-semibold tracking-tight leading-tight",
  h3:        "text-2xl font-semibold leading-snug",
  h4:        "text-xl font-semibold leading-snug",
  h5:        "text-lg font-semibold leading-snug",
  h6:        "text-base font-semibold leading-normal",
  "body-lg": "text-lg font-normal leading-relaxed",
  body:      "text-base font-normal leading-relaxed",
  "body-sm": "text-sm font-normal leading-relaxed",
  caption:   "text-xs font-normal leading-normal",
  label:     "text-sm font-medium leading-none",
  overline:  "text-xs font-medium uppercase tracking-widest leading-none",
};

const colorClasses: Record<TypographyColor, string> = {
  default: "text-zinc-900",
  muted:   "text-zinc-600",
  subtle:  "text-zinc-500",
  primary: "text-brand-600",
  success: "text-success-700",
  warning: "text-warning-700",
  error:   "text-error-700",
};

const weightClasses: Record<TypographyWeight, string> = {
  normal:   "font-normal",
  medium:   "font-medium",
  semibold: "font-semibold",
  bold:     "font-bold",
};

const alignClasses: Record<TypographyAlign, string> = {
  left:   "text-left",
  center: "text-center",
  right:  "text-right",
};

export function Typography({
  variant = "body",
  color = "default",
  weight,
  align,
  as,
  text,
  children,
  className,
  id,
}: TypographyProps) {
  const Tag = as ?? variantElement[variant];
  const content = children ?? text;

  return (
    <Tag
      id={id}
      className={cn(
        variantClasses[variant],
        colorClasses[color],
        // Weight override — only applied if explicitly set (variant already sets weight)
        weight && weightClasses[weight],
        align && alignClasses[align],
        // Reset default browser margins for display/heading variants when used inline
        "m-0",
        className
      )}
    >
      {content}
    </Tag>
  );
}
