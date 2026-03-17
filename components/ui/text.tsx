import { cn } from "@/utils/cn"
import * as React from "react"

type TextVariant =
  | "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "body-lg" | "body" | "body-sm"
  | "caption" | "label" | "overline"

type TextColor = "default" | "muted" | "subtle" | "primary" | "success" | "warning" | "error"

export interface TextProps {
  variant?: TextVariant
  color?: TextColor
  as?: React.ElementType
  text?: string
  children?: React.ReactNode
  className?: string
  id?: string
}

const variantElement: Record<TextVariant, React.ElementType> = {
  display:   "h1",
  h1:        "h1",
  h2:        "h2",
  h3:        "h3",
  h4:        "h4",
  h5:        "h5",
  h6:        "h6",
  "body-lg": "p",
  body:      "p",
  "body-sm": "p",
  caption:   "span",
  label:     "span",
  overline:  "span",
}

const variantClasses: Record<TextVariant, string> = {
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
}

const colorClasses: Record<TextColor, string> = {
  default: "text-foreground",
  muted:   "text-muted-foreground",
  subtle:  "text-muted-foreground/70",
  primary: "text-primary",
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-700 dark:text-amber-400",
  error:   "text-destructive",
}

export function Text({
  variant = "body",
  color = "default",
  as,
  text,
  children,
  className,
  id,
}: TextProps) {
  const Tag = as ?? variantElement[variant]
  const content = children ?? text

  return (
    <Tag
      id={id}
      className={cn(
        variantClasses[variant],
        colorClasses[color],
        "m-0",
        className
      )}
    >
      {content}
    </Tag>
  )
}
