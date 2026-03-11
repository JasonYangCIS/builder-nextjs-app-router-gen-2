/**
 * Builder.io Publish — Design Token Registration
 *
 * Registers the design system's color and gradient tokens with Builder's
 * visual editor via `register("editor.settings", { designTokens })`.
 *
 * This makes tokens appear in the editor's Style tab (color pickers,
 * background image fields) so content editors pick from the design system
 * instead of entering raw hex values.
 *
 * API: https://www.builder.io/c/docs/design-tokens
 * Token values mirror styles/tokens.css — update both files together.
 */
import { register } from "@builder.io/sdk-react";

register("editor.settings", {
  designTokens: {
    // ── Colors ──────────────────────────────────────────────────────────────
    // Exposed tiers:
    //   50 / 100  → backgrounds, section fills, status chips
    //   500–700   → interactive, CTAs, text on white (all WCAG AA)
    //   800–950   → dark hero backgrounds
    colors: [
      // Brand — Indigo
      { name: "Brand / 50  · bg",      value: "var(--color-brand-50,  #eef2ff)" },
      { name: "Brand / 100 · bg",      value: "var(--color-brand-100, #e0e7ff)" },
      { name: "Brand / 500",           value: "var(--color-brand-500, #6366f1)" },
      { name: "Brand / 600 · primary", value: "var(--color-brand-600, #4f46e5)" },
      { name: "Brand / 700",           value: "var(--color-brand-700, #4338ca)" },
      { name: "Brand / 800",           value: "var(--color-brand-800, #3730a3)" },
      { name: "Brand / 950 · dark",    value: "var(--color-brand-950, #1e1b4b)" },

      // Accent — Violet
      { name: "Accent / 50  · bg",     value: "var(--color-accent-50,  #f5f3ff)" },
      { name: "Accent / 100 · bg",     value: "var(--color-accent-100, #ede9fe)" },
      { name: "Accent / 500",          value: "var(--color-accent-500, #8b5cf6)" },
      { name: "Accent / 600 · primary",value: "var(--color-accent-600, #7c3aed)" },
      { name: "Accent / 700",          value: "var(--color-accent-700, #6d28d9)" },
      { name: "Accent / 950 · dark",   value: "var(--color-accent-950, #2e1065)" },

      // Success — Emerald
      { name: "Success / 50  · bg",    value: "var(--color-success-50,  #ecfdf5)" },
      { name: "Success / 100 · bg",    value: "var(--color-success-100, #d1fae5)" },
      { name: "Success / 600",         value: "var(--color-success-600, #059669)" },
      { name: "Success / 700",         value: "var(--color-success-700, #047857)" },

      // Warning — Amber
      { name: "Warning / 50  · bg",    value: "var(--color-warning-50,  #fffbeb)" },
      { name: "Warning / 100 · bg",    value: "var(--color-warning-100, #fef3c7)" },
      { name: "Warning / 600",         value: "var(--color-warning-600, #d97706)" },
      { name: "Warning / 700",         value: "var(--color-warning-700, #b45309)" },

      // Error — Rose
      { name: "Error / 50  · bg",      value: "var(--color-error-50,  #fff1f2)" },
      { name: "Error / 100 · bg",      value: "var(--color-error-100, #ffe4e6)" },
      { name: "Error / 600",           value: "var(--color-error-600, #e11d48)" },
      { name: "Error / 700",           value: "var(--color-error-700, #be123c)" },
    ],

    // ── Background images (gradients) ────────────────────────────────────
    // Maps to the gradient-* utility classes defined in styles/tokens.css.
    backgroundImage: [
      {
        name: "Gradient Brand · indigo → violet",
        value: "linear-gradient(135deg, var(--color-brand-500, #6366f1), var(--color-accent-500, #8b5cf6))",
      },
      {
        name: "Gradient Brand Subtle · tinted wash",
        value: "linear-gradient(135deg, var(--color-brand-50, #eef2ff), var(--color-accent-50, #f5f3ff))",
      },
      {
        name: "Gradient Brand Dark · deep indigo → violet",
        value: "linear-gradient(135deg, var(--color-brand-800, #3730a3), var(--color-accent-800, #5b21b6))",
      },
    ],
  },

  // Allow editors to enter custom values beyond the token list.
  // Set to true to enforce token-only usage (strict mode).
  styleStrictMode: false,
});
