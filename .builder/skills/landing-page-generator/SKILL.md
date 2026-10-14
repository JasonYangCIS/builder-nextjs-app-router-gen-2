---
name: landing-page-generator
description: Generates a static landing page at /landing/<slug> with a hero image on the first fold and text sections below, from a Figma design, HTML source, or a prompt. Use when the user asks to generate or create a new landing page, hero image, or HTML page (e.g. "create a landing page for <topic>").
---

# Landing Page Generator

Output: a JSON data file `content/landing-pages/<slug>.json` plus a hero image in `public/generated/`, rendered at `/landing/<slug>` by the existing template (`app/[locale]/landing/[slug]/page.tsx` + `components/LandingPage/`). Do not create new routes or components per page.

Layout rule for every starting point: the hero image fills the first fold, with all other content below it.

## Step 0: Ask for a starting point

Use AskUserQuestion first, with these options in this order:

1. **Figma file** — a Figma link or Smart Export. Read the design (see the `figma-annotations` skill and Builder Design tools), extract headline, subhead, CTA, sections and hero image, then continue at step 6. Ask intake questions only for fields the design doesn't answer.
2. **HTML source code** — pasted or pointed to. Extract the same fields, then continue as above.
3. **New prompt** (default) — follow `references/intake.md`, then continue at step 1.

## Steps

1. **Check for collisions.** If `content/landing-pages/<slug>.json` exists and this is not an update, ask before overwriting or pick a new slug.
2. **Classify tone.** Pick the main category (and accent) from `references/tone-categories.md` and state it in one line. The main category drives image style and copy voice; the accent only adds small touches.
3. **Write copy** following `references/brand-voice.md` and the chosen tone. Limits are for readability; exceed only if the user's section detail needs it:
   - headline: max 70 characters
   - subhead: max 160 characters
   - CTA label: max 24 characters
   - sections: heading max 40, body max 280 characters
   - Keep the user's section outline order exactly.
4. **Write the hero image prompt:** subject, style from the tone category, mood, composition, 16:9, "no text, no logos, no watermarks", and the avoid-list ban phrased as "no ...". One or two sentences.
5. **Generate the image** via the dev server (Pollinations needs no key):
   ```bash
   curl -s -X POST http://localhost:3000/api/generate-hero-image \
     -H "Content-Type: application/json" \
     -d '{"prompt":"<image prompt>","slug":"<slug>"}'
   ```
   Response: `{ path, provider, placeholder, error? }`. Use `path` as `heroImagePath`. If `placeholder` is true, tell the user the `error` (e.g. timeout, rate limit) and offer to retry. Pass `"overwrite": true` only if the user asked to regenerate.
6. **Write the data file** with: `slug`, `headline`, `subhead`, `cta {label, href}`, `sections [{heading, body}]`, `heroImagePath`, `heroImageAlt` (a meaningful description, not "hero image"). Type: `components/LandingPage/LandingPage.types.ts`.
7. **Verify.** Run `node .builder/skills/landing-page-generator/scripts/validate.mjs <slug>` and fix every ERROR (WARN lines are copy-limit or route hints; fix or mention them). Then, with the dev server running, fetch `http://localhost:3000/landing/<slug>` and confirm HTTP 200, the headline appears, and `heroImagePath` returns HTTP 200. Run `npx tsc --noEmit`.
8. **Self-review.** Fix or report any failures:
   - hero image is first and fills the first fold
   - meaningful image `alt`; one h1, sensible heading order
   - copy matches the tone, avoids the avoid-list tone, fits brand voice
   - body text contrast meets WCAG AA 4.5:1 (see `design-system`, `engineering-standards`)
   - CTA `href` resolves to a real route
9. **Report** the page URL, data file path, image path, tone category, and any placeholder warning.
10. **Navigate.** As the final action, load the `NavigatePreview` tool (via tool search if deferred) and navigate the preview to `/landing/<slug>`.

## Phased generation

Default on. Follow `references/phased-generation.md` before building the full page.

## Rules

- Never overwrite an existing page or image without asking.
- Never put secrets in code, data files, or output. Read any provider key from env vars via `config.envs`.
- No text inside the generated image.
- Brand voice and tone categories live in `references/`; customize them there.
