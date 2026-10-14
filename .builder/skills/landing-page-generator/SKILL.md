---
name: landing-page-generator
description: Use when the user asks to generate or create a new landing page, hero image, or HTML page from a prompt (e.g. "create a landing page for <topic>"). Produces a static page at /landing/<slug> with an AI-generated hero image and text sections.
---

# Landing Page Generator

Output: a JSON data file `content/landing-pages/<slug>.json` plus a hero image in `public/generated/`, rendered at `/landing/<slug>` by the existing template (`app/[locale]/landing/[slug]/page.tsx` + `components/LandingPage/`). Do not create new routes or components per page.

## Steps

1. **Gather inputs.** Topic, audience, tone, CTA. Infer what you can; ask at most ONE clarifying question, only if critical info is missing. Derive a lowercase-hyphen `slug` from the topic.
2. **Check for collisions.** If `content/landing-pages/<slug>.json` exists, ask before overwriting (or pick a new slug). Never overwrite silently.
3. **Write copy**, following `references/brand-voice.md`. Limits:
   - headline: max 70 characters
   - subhead: max 160 characters
   - CTA label: max 24 characters
   - 2-3 sections, each heading max 40 characters, body max 280 characters
4. **Write the hero image prompt:** subject, style, mood, composition, 16:9 aspect ratio, and "no text, no logos, no watermarks" in the image. One or two sentences.
5. **Generate the image** via the dev server (the key stays server-side):
   ```bash
   curl -s -X POST http://localhost:3000/api/generate-hero-image \
     -H "Content-Type: application/json" \
     -d '{"prompt":"<image prompt>","slug":"<slug>"}'
   ```
   Response: `{ path, provider, placeholder, error? }`. Use `path` as `heroImagePath`. If `placeholder` is true, the placeholder was used; tell the user the `error` and how to fix it (e.g. set `GEMINI_API_KEY`). Pass `"overwrite": true` only if the user asked to regenerate.
6. **Write the data file** `content/landing-pages/<slug>.json` with: `slug`, `headline`, `subhead`, `cta {label, href}`, `sections [{heading, body}]`, `heroImagePath`, `heroImageAlt` (a meaningful description of the image, not "hero image"). Type: `components/LandingPage/LandingPage.types.ts`. For `cta.href` use an existing internal route or ask.
7. **Verify.** Ensure the dev server is running, fetch `http://localhost:3000/landing/<slug>` and confirm HTTP 200, the headline appears, and `heroImagePath` returns an image (HTTP 200). Run `npx tsc --noEmit`. Report the page URL (`/landing/<slug>`), the data file path, the image path, and any placeholder warning.

## Rules

- Never overwrite an existing page or image without asking.
- Never put secrets in code, data files, or output. Keys come from env vars only (`GEMINI_API_KEY`, `GEMINI_IMAGE_MODEL`), read via `config.envs`.
- Keep copy within the limits above.
- No text inside the generated image.
- Brand voice lives in `references/brand-voice.md`; customize it there.
