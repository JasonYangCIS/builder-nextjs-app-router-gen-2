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
 * Token values mirror app/globals.css shadcn CSS variables.
 * Hex fallbacks are approximate equivalents for the default (light) theme.
 */
import { register } from "@builder.io/sdk-react";

register("editor.settings", {
  designTokens: {
    // ── Semantic colors (shadcn/ui tokens) ───────────────────────────────────
    // These adapt to the active theme (default / dark / ritual).
    // Hex fallbacks are approximations for the default light theme.
    colors: [
      // Surfaces
      { name: "Background",              value: "var(--background, #ffffff)" },
      { name: "Foreground",              value: "var(--foreground, #09090b)" },
      { name: "Card",                    value: "var(--card, #ffffff)" },
      { name: "Card Foreground",         value: "var(--card-foreground, #09090b)" },

      // Primary
      { name: "Primary",                 value: "var(--primary, #18181b)" },
      { name: "Primary Foreground",      value: "var(--primary-foreground, #fafafa)" },

      // Secondary / Muted
      { name: "Secondary",               value: "var(--secondary, #f4f4f5)" },
      { name: "Secondary Foreground",    value: "var(--secondary-foreground, #18181b)" },
      { name: "Muted",                   value: "var(--muted, #f4f4f5)" },
      { name: "Muted Foreground",        value: "var(--muted-foreground, #71717a)" },

      // Accent
      { name: "Accent",                  value: "var(--accent, #f4f4f5)" },
      { name: "Accent Foreground",       value: "var(--accent-foreground, #18181b)" },

      // Destructive / Error
      { name: "Destructive",             value: "var(--destructive, #ef4444)" },

      // Borders & Inputs
      { name: "Border",                  value: "var(--border, #e4e4e7)" },
      { name: "Input",                   value: "var(--input, #e4e4e7)" },
      { name: "Ring",                    value: "var(--ring, #a1a1aa)" },
    ],

    // ── Background images (gradients) ────────────────────────────────────────
    // Maps to the gradient-* utility classes defined in styles/tokens.css.
    backgroundImage: [
      {
        name: "Gradient Brand",
        value: "linear-gradient(135deg, var(--primary, #18181b), color-mix(in oklch, var(--primary, #18181b) 70%, var(--accent, #f4f4f5)))",
      },
      {
        name: "Gradient Brand Subtle",
        value: "linear-gradient(135deg, color-mix(in oklch, var(--primary, #18181b) 8%, #fff), color-mix(in oklch, var(--accent, #f4f4f5) 8%, #fff))",
      },
      {
        name: "Gradient Brand Dark",
        value: "linear-gradient(135deg, color-mix(in oklch, var(--primary, #18181b) 80%, #000), color-mix(in oklch, var(--primary, #18181b) 60%, #000))",
      },
    ],
  },

  // Allow editors to enter custom values beyond the token list.
  // Set to true to enforce token-only usage (strict mode).
  styleStrictMode: false,
});
