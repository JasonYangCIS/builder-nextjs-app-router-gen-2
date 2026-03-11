import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ─── 1. CSS custom properties from styles/tokens.css ─────────────────────────
const cssColorTokens = {
  "--color-brand-50":   "#eef2ff",
  "--color-brand-100":  "#e0e7ff",
  "--color-brand-200":  "#c7d2fe",
  "--color-brand-300":  "#a5b4fc",
  "--color-brand-400":  "#818cf8",
  "--color-brand-500":  "#6366f1",
  "--color-brand-600":  "#4f46e5",
  "--color-brand-700":  "#4338ca",
  "--color-brand-800":  "#3730a3",
  "--color-brand-900":  "#312e81",
  "--color-brand-950":  "#1e1b4b",

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

  "--color-success-50":  "#ecfdf5",
  "--color-success-100": "#d1fae5",
  "--color-success-600": "#059669",
  "--color-success-700": "#047857",

  "--color-warning-50":  "#fffbeb",
  "--color-warning-100": "#fef3c7",
  "--color-warning-600": "#d97706",
  "--color-warning-700": "#b45309",

  "--color-error-50":  "#fff1f2",
  "--color-error-100": "#ffe4e6",
  "--color-error-600": "#e11d48",
  "--color-error-700": "#be123c",
};

// ─── 2. CSS custom properties from app/globals.css (:root + @theme inline) ──
const cssGlobalTokens = {
  "--background":        "#ffffff",
  "--foreground":        "#171717",
  "--color-background":  "var(--background)",
  "--color-foreground":  "var(--foreground)",
  "--font-sans":         "var(--font-geist-sans)",
  "--font-mono":         "var(--font-geist-mono)",
};

// ─── 3. Gradient utility classes (styles/tokens.css @layer utilities) ─────────
const gradientClasses = {
  "gradient-brand":        "linear-gradient(135deg, var(--color-brand-500), var(--color-accent-500))",
  "gradient-brand-subtle": "linear-gradient(135deg, var(--color-brand-50), var(--color-accent-50))",
  "gradient-brand-dark":   "linear-gradient(135deg, var(--color-brand-800), var(--color-accent-800))",
  "gradient-mesh":         "radial-gradient(ellipse at 20% 50%, ...) + var(--color-brand-950)",
  "gradient-brand-text":   "linear-gradient(135deg, var(--color-brand-600), var(--color-accent-600)) [text clip]",
};

// ─── 4. Badge variant + size tokens (Tailwind classes) ───────────────────────
const badgeVariantTokens = {
  "badge-variant-neutral": "bg-zinc-100 text-zinc-700",
  "badge-variant-primary": "bg-brand-100 text-brand-700",
  "badge-variant-success": "bg-success-100 text-success-700",
  "badge-variant-warning": "bg-warning-100 text-warning-700",
  "badge-variant-error":   "bg-error-100 text-error-700",
};

const badgeSizeTokens = {
  "badge-size-sm": "px-2 py-0.5 text-xs",
  "badge-size-md": "px-2.5 py-1 text-sm",
};

// ─── 5. Button variant + size tokens (Tailwind classes) ──────────────────────
const buttonVariantTokens = {
  "button-variant-primary":     "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 border border-transparent",
  "button-variant-secondary":   "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 active:bg-zinc-100",
  "button-variant-ghost":       "bg-transparent text-zinc-700 border border-transparent hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200",
  "button-variant-destructive": "bg-error-600 text-white hover:bg-error-700 active:bg-error-700 border border-transparent",
};

const buttonSizeTokens = {
  "button-size-sm": "px-3 py-1.5 text-xs rounded-md gap-1.5",
  "button-size-md": "px-4 py-2 text-sm rounded-lg gap-2",
  "button-size-lg": "px-6 py-3 text-base rounded-lg gap-2",
};

// ─── 6. Typography variant tokens (Tailwind classes) ─────────────────────────
const typographyVariantTokens = {
  "typography-display":   "text-5xl font-bold tracking-tight leading-none",
  "typography-h1":        "text-4xl font-semibold tracking-tight leading-tight",
  "typography-h2":        "text-3xl font-semibold tracking-tight leading-tight",
  "typography-h3":        "text-2xl font-semibold leading-snug",
  "typography-h4":        "text-xl font-semibold leading-snug",
  "typography-h5":        "text-lg font-semibold leading-snug",
  "typography-h6":        "text-base font-semibold leading-normal",
  "typography-body-lg":   "text-lg font-normal leading-relaxed",
  "typography-body":      "text-base font-normal leading-relaxed",
  "typography-body-sm":   "text-sm font-normal leading-relaxed",
  "typography-caption":   "text-xs font-normal leading-normal",
  "typography-label":     "text-sm font-medium leading-none",
  "typography-overline":  "text-xs font-medium uppercase tracking-widest leading-none",
};

const typographyColorTokens = {
  "typography-color-default": "text-zinc-900",
  "typography-color-muted":   "text-zinc-600",
  "typography-color-subtle":  "text-zinc-500",
  "typography-color-primary": "text-brand-600",
  "typography-color-success": "text-success-700",
  "typography-color-warning": "text-warning-700",
  "typography-color-error":   "text-error-700",
};

const typographyWeightTokens = {
  "typography-weight-normal":   "font-normal",
  "typography-weight-medium":   "font-medium",
  "typography-weight-semibold": "font-semibold",
  "typography-weight-bold":     "font-bold",
};

const typographyAlignTokens = {
  "typography-align-left":   "text-left",
  "typography-align-center": "text-center",
  "typography-align-right":  "text-right",
};

// ─── 7. Card padding + shadow tokens (Tailwind classes) ──────────────────────
const cardPaddingTokens = {
  "card-padding-none": "",
  "card-padding-sm":   "p-4",
  "card-padding-md":   "p-6",
  "card-padding-lg":   "p-8",
};

const cardShadowTokens = {
  "card-shadow-none": "",
  "card-shadow-sm":   "shadow-sm",
  "card-shadow-md":   "shadow-md",
  "card-shadow-lg":   "shadow-lg",
};

// ─── Assemble output ──────────────────────────────────────────────────────────
const output = {
  tokenGroups: [
    {
      name: "color-brand",
      tokens: Object.keys(cssColorTokens).filter(k => k.startsWith("--color-brand")),
      tokenValues: Object.fromEntries(
        Object.entries(cssColorTokens).filter(([k]) => k.startsWith("--color-brand"))
      ),
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-accent",
      tokens: Object.keys(cssColorTokens).filter(k => k.startsWith("--color-accent")),
      tokenValues: Object.fromEntries(
        Object.entries(cssColorTokens).filter(([k]) => k.startsWith("--color-accent"))
      ),
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-success",
      tokens: Object.keys(cssColorTokens).filter(k => k.startsWith("--color-success")),
      tokenValues: Object.fromEntries(
        Object.entries(cssColorTokens).filter(([k]) => k.startsWith("--color-success"))
      ),
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-warning",
      tokens: Object.keys(cssColorTokens).filter(k => k.startsWith("--color-warning")),
      tokenValues: Object.fromEntries(
        Object.entries(cssColorTokens).filter(([k]) => k.startsWith("--color-warning"))
      ),
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "color-error",
      tokens: Object.keys(cssColorTokens).filter(k => k.startsWith("--color-error")),
      tokenValues: Object.fromEntries(
        Object.entries(cssColorTokens).filter(([k]) => k.startsWith("--color-error"))
      ),
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "global-theme",
      tokens: Object.keys(cssGlobalTokens),
      tokenValues: cssGlobalTokens,
      relevantFiles: ["app/globals.css"],
    },
    {
      name: "gradient",
      tokens: Object.keys(gradientClasses),
      tokenValues: gradientClasses,
      relevantFiles: ["styles/tokens.css", "components/builder/BuilderDesignTokens.ts"],
    },
    {
      name: "badge-variant",
      tokens: Object.keys(badgeVariantTokens),
      tokenValues: badgeVariantTokens,
      relevantFiles: ["components/design-system/Badge/Badge.tsx"],
    },
    {
      name: "badge-size",
      tokens: Object.keys(badgeSizeTokens),
      tokenValues: badgeSizeTokens,
      relevantFiles: ["components/design-system/Badge/Badge.tsx"],
    },
    {
      name: "button-variant",
      tokens: Object.keys(buttonVariantTokens),
      tokenValues: buttonVariantTokens,
      relevantFiles: ["components/design-system/Button/Button.tsx"],
    },
    {
      name: "button-size",
      tokens: Object.keys(buttonSizeTokens),
      tokenValues: buttonSizeTokens,
      relevantFiles: ["components/design-system/Button/Button.tsx"],
    },
    {
      name: "typography-variant",
      tokens: Object.keys(typographyVariantTokens),
      tokenValues: typographyVariantTokens,
      relevantFiles: ["components/design-system/Typography/Typography.tsx"],
    },
    {
      name: "typography-color",
      tokens: Object.keys(typographyColorTokens),
      tokenValues: typographyColorTokens,
      relevantFiles: ["components/design-system/Typography/Typography.tsx"],
    },
    {
      name: "typography-weight",
      tokens: Object.keys(typographyWeightTokens),
      tokenValues: typographyWeightTokens,
      relevantFiles: ["components/design-system/Typography/Typography.tsx"],
    },
    {
      name: "typography-align",
      tokens: Object.keys(typographyAlignTokens),
      tokenValues: typographyAlignTokens,
      relevantFiles: ["components/design-system/Typography/Typography.tsx"],
    },
    {
      name: "card-padding",
      tokens: Object.keys(cardPaddingTokens),
      tokenValues: cardPaddingTokens,
      relevantFiles: ["components/design-system/Card/Card.tsx"],
    },
    {
      name: "card-shadow",
      tokens: Object.keys(cardShadowTokens),
      tokenValues: cardShadowTokens,
      relevantFiles: ["components/design-system/Card/Card.tsx"],
    },
  ],
};

writeFileSync(
  resolve(__dirname, "tokens.json"),
  JSON.stringify(output, null, 2),
  "utf-8"
);

console.log("tokens.json written successfully.");
console.log(`Total token groups: ${output.tokenGroups.length}`);
const total = output.tokenGroups.reduce((sum, g) => sum + g.tokens.length, 0);
console.log(`Total tokens: ${total}`);
