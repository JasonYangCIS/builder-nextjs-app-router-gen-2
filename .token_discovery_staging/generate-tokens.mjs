import { writeFileSync } from "fs";
import { resolve } from "path";

const output = {
  tokenGroups: [
    // ── CSS custom properties from styles/tokens.css ─────────────────────────
    {
      name: "color-brand-",
      tokens: [
        "--color-brand-50",
        "--color-brand-100",
        "--color-brand-200",
        "--color-brand-300",
        "--color-brand-400",
        "--color-brand-500",
        "--color-brand-600",
        "--color-brand-700",
        "--color-brand-800",
        "--color-brand-900",
        "--color-brand-950",
      ],
      tokenValues: {
        "--color-brand-50":  "#eef2ff",
        "--color-brand-100": "#e0e7ff",
        "--color-brand-200": "#c7d2fe",
        "--color-brand-300": "#a5b4fc",
        "--color-brand-400": "#818cf8",
        "--color-brand-500": "#6366f1",
        "--color-brand-600": "#4f46e5",
        "--color-brand-700": "#4338ca",
        "--color-brand-800": "#3730a3",
        "--color-brand-900": "#312e81",
        "--color-brand-950": "#1e1b4b",
      },
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-accent-",
      tokens: [
        "--color-accent-50",
        "--color-accent-100",
        "--color-accent-200",
        "--color-accent-300",
        "--color-accent-400",
        "--color-accent-500",
        "--color-accent-600",
        "--color-accent-700",
        "--color-accent-800",
        "--color-accent-900",
        "--color-accent-950",
      ],
      tokenValues: {
        "--color-accent-50":  "#f5f3ff",
        "--color-accent-100": "#ede9fe",
        "--color-accent-200": "#ddd6fe",
        "--color-accent-300": "#c4b5fd",
        "--color-accent-400": "#a78bfa",
        "--color-accent-500": "#8b5cf6",
        "--color-accent-600": "#7c3aed",
        "--color-accent-700": "#6d28d9",
        "--color-accent-800": "#5b21b6",
        "--color-accent-900": "#4c1d95",
        "--color-accent-950": "#2e1065",
      },
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-success-",
      tokens: [
        "--color-success-50",
        "--color-success-100",
        "--color-success-600",
        "--color-success-700",
      ],
      tokenValues: {
        "--color-success-50":  "#ecfdf5",
        "--color-success-100": "#d1fae5",
        "--color-success-600": "#059669",
        "--color-success-700": "#047857",
      },
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-warning-",
      tokens: [
        "--color-warning-50",
        "--color-warning-100",
        "--color-warning-600",
        "--color-warning-700",
      ],
      tokenValues: {
        "--color-warning-50":  "#fffbeb",
        "--color-warning-100": "#fef3c7",
        "--color-warning-600": "#d97706",
        "--color-warning-700": "#b45309",
      },
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-error-",
      tokens: [
        "--color-error-50",
        "--color-error-100",
        "--color-error-600",
        "--color-error-700",
      ],
      tokenValues: {
        "--color-error-50":  "#fff1f2",
        "--color-error-100": "#ffe4e6",
        "--color-error-600": "#e11d48",
        "--color-error-700": "#be123c",
      },
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },

    // ── Gradient utility classes from styles/tokens.css ──────────────────────
    {
      name: "gradient-",
      tokens: [
        "gradient-brand",
        "gradient-brand-subtle",
        "gradient-brand-dark",
        "gradient-mesh",
        "gradient-brand-text",
      ],
      tokenValues: {
        "gradient-brand":       "linear-gradient(135deg, var(--color-brand-500), var(--color-accent-500))",
        "gradient-brand-subtle":"linear-gradient(135deg, var(--color-brand-50), var(--color-accent-50))",
        "gradient-brand-dark":  "linear-gradient(135deg, var(--color-brand-800), var(--color-accent-800))",
        "gradient-mesh":        "radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--color-brand-500) 25%, transparent) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, color-mix(in srgb, var(--color-accent-500) 20%, transparent) 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, color-mix(in srgb, var(--color-brand-400) 15%, transparent) 0%, transparent 50%), var(--color-brand-950)",
        "gradient-brand-text":  "linear-gradient(135deg, var(--color-brand-600), var(--color-accent-600)) [text clip]",
      },
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },

    // ── Global theme CSS custom properties from app/globals.css ─────────────
    {
      name: "global-theme-",
      tokens: [
        "--background",
        "--foreground",
        "--color-background",
        "--color-foreground",
        "--font-sans",
        "--font-mono",
      ],
      tokenValues: {
        "--background":       "#ffffff",
        "--foreground":       "#171717",
        "--color-background": "var(--background)",
        "--color-foreground": "var(--foreground)",
        "--font-sans":        "var(--font-geist-sans)",
        "--font-mono":        "var(--font-geist-mono)",
      },
      relevantFiles: ["app/globals.css"],
    },

    // ── Button component tokens ──────────────────────────────────────────────
    {
      name: "button-variant-",
      tokens: [
        "button-variant-primary",
        "button-variant-secondary",
        "button-variant-ghost",
        "button-variant-destructive",
      ],
      tokenValues: {
        "button-variant-primary":     "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 border border-transparent",
        "button-variant-secondary":   "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 active:bg-zinc-100",
        "button-variant-ghost":       "bg-transparent text-zinc-700 border border-transparent hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200",
        "button-variant-destructive": "bg-error-600 text-white hover:bg-error-700 active:bg-error-700 border border-transparent",
      },
      relevantFiles: ["components/design-system/Button/Button.tsx", "components/design-system/Button/Button.types.ts"],
    },
    {
      name: "button-size-",
      tokens: [
        "button-size-sm",
        "button-size-md",
        "button-size-lg",
      ],
      tokenValues: {
        "button-size-sm": "px-3 py-1.5 text-xs rounded-md gap-1.5",
        "button-size-md": "px-4 py-2 text-sm rounded-lg gap-2",
        "button-size-lg": "px-6 py-3 text-base rounded-lg gap-2",
      },
      relevantFiles: ["components/design-system/Button/Button.tsx", "components/design-system/Button/Button.types.ts"],
    },

    // ── Badge component tokens ───────────────────────────────────────────────
    {
      name: "badge-variant-",
      tokens: [
        "badge-variant-neutral",
        "badge-variant-primary",
        "badge-variant-success",
        "badge-variant-warning",
        "badge-variant-error",
      ],
      tokenValues: {
        "badge-variant-neutral": "bg-zinc-100 text-zinc-700",
        "badge-variant-primary": "bg-brand-100 text-brand-700",
        "badge-variant-success": "bg-success-100 text-success-700",
        "badge-variant-warning": "bg-warning-100 text-warning-700",
        "badge-variant-error":   "bg-error-100 text-error-700",
      },
      relevantFiles: ["components/design-system/Badge/Badge.tsx", "components/design-system/Badge/Badge.types.ts"],
    },
    {
      name: "badge-size-",
      tokens: [
        "badge-size-sm",
        "badge-size-md",
      ],
      tokenValues: {
        "badge-size-sm": "px-2 py-0.5 text-xs",
        "badge-size-md": "px-2.5 py-1 text-sm",
      },
      relevantFiles: ["components/design-system/Badge/Badge.tsx", "components/design-system/Badge/Badge.types.ts"],
    },

    // ── Typography component tokens ──────────────────────────────────────────
    {
      name: "typography-variant-",
      tokens: [
        "typography-variant-display",
        "typography-variant-h1",
        "typography-variant-h2",
        "typography-variant-h3",
        "typography-variant-h4",
        "typography-variant-h5",
        "typography-variant-h6",
        "typography-variant-body-lg",
        "typography-variant-body",
        "typography-variant-body-sm",
        "typography-variant-caption",
        "typography-variant-label",
        "typography-variant-overline",
      ],
      tokenValues: {
        "typography-variant-display":  "text-5xl font-bold tracking-tight leading-none",
        "typography-variant-h1":       "text-4xl font-semibold tracking-tight leading-tight",
        "typography-variant-h2":       "text-3xl font-semibold tracking-tight leading-tight",
        "typography-variant-h3":       "text-2xl font-semibold leading-snug",
        "typography-variant-h4":       "text-xl font-semibold leading-snug",
        "typography-variant-h5":       "text-lg font-semibold leading-snug",
        "typography-variant-h6":       "text-base font-semibold leading-normal",
        "typography-variant-body-lg":  "text-lg font-normal leading-relaxed",
        "typography-variant-body":     "text-base font-normal leading-relaxed",
        "typography-variant-body-sm":  "text-sm font-normal leading-relaxed",
        "typography-variant-caption":  "text-xs font-normal leading-normal",
        "typography-variant-label":    "text-sm font-medium leading-none",
        "typography-variant-overline": "text-xs font-medium uppercase tracking-widest leading-none",
      },
      relevantFiles: ["components/design-system/Typography/Typography.tsx", "components/design-system/Typography/Typography.types.ts"],
    },
    {
      name: "typography-color-",
      tokens: [
        "typography-color-default",
        "typography-color-muted",
        "typography-color-subtle",
        "typography-color-primary",
        "typography-color-success",
        "typography-color-warning",
        "typography-color-error",
      ],
      tokenValues: {
        "typography-color-default": "text-zinc-900",
        "typography-color-muted":   "text-zinc-600",
        "typography-color-subtle":  "text-zinc-500",
        "typography-color-primary": "text-brand-600",
        "typography-color-success": "text-success-700",
        "typography-color-warning": "text-warning-700",
        "typography-color-error":   "text-error-700",
      },
      relevantFiles: ["components/design-system/Typography/Typography.tsx", "components/design-system/Typography/Typography.types.ts"],
    },
    {
      name: "typography-weight-",
      tokens: [
        "typography-weight-normal",
        "typography-weight-medium",
        "typography-weight-semibold",
        "typography-weight-bold",
      ],
      tokenValues: {
        "typography-weight-normal":   "font-normal",
        "typography-weight-medium":   "font-medium",
        "typography-weight-semibold": "font-semibold",
        "typography-weight-bold":     "font-bold",
      },
      relevantFiles: ["components/design-system/Typography/Typography.tsx", "components/design-system/Typography/Typography.types.ts"],
    },
    {
      name: "typography-align-",
      tokens: [
        "typography-align-left",
        "typography-align-center",
        "typography-align-right",
      ],
      tokenValues: {
        "typography-align-left":   "text-left",
        "typography-align-center": "text-center",
        "typography-align-right":  "text-right",
      },
      relevantFiles: ["components/design-system/Typography/Typography.tsx", "components/design-system/Typography/Typography.types.ts"],
    },

    // ── Card component tokens ────────────────────────────────────────────────
    {
      name: "card-padding-",
      tokens: [
        "card-padding-none",
        "card-padding-sm",
        "card-padding-md",
        "card-padding-lg",
      ],
      tokenValues: {
        "card-padding-none": "",
        "card-padding-sm":   "p-4",
        "card-padding-md":   "p-6",
        "card-padding-lg":   "p-8",
      },
      relevantFiles: ["components/design-system/Card/Card.tsx", "components/design-system/Card/Card.types.ts"],
    },
    {
      name: "card-shadow-",
      tokens: [
        "card-shadow-none",
        "card-shadow-sm",
        "card-shadow-md",
        "card-shadow-lg",
      ],
      tokenValues: {
        "card-shadow-none": "",
        "card-shadow-sm":   "shadow-sm",
        "card-shadow-md":   "shadow-md",
        "card-shadow-lg":   "shadow-lg",
      },
      relevantFiles: ["components/design-system/Card/Card.tsx", "components/design-system/Card/Card.types.ts"],
    },
  ],
};

const outPath = resolve(import.meta.dirname, "tokens.json");
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${output.tokenGroups.length} token groups to ${outPath}`);
