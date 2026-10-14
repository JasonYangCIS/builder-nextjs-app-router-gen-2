---
name: landing-page-generator
description: Use when the user asks to generate or create a new landing page, hero image, or HTML page from a prompt (e.g. "create a landing page for <topic>"). Produces a static page at /landing/<slug> with a hero image on the first fold and text sections below.
---

# Landing Page Generator

Output: a JSON data file `content/landing-pages/<slug>.json` plus a hero image in `public/generated/`, rendered at `/landing/<slug>` by the existing template (`app/[locale]/landing/[slug]/page.tsx` + `components/LandingPage/`). Do not create new routes or components per page.

## Step 0: Ask for a starting point

As soon as the skill runs, use AskUserQuestion to ask where to start. Offer these options in exactly this order:

1. **Figma file** — the user provides a Figma link or Smart Export. Read the design (see the `figma-annotations` skill and Builder Design tools), extract headline, subhead, CTA, sections and hero image, then continue at "Write the data file". Run the Intake only for fields the design doesn't answer.
2. **HTML source code** — the user pastes or points to HTML. Extract the same fields from it, then continue as above.
3. **New prompt** — continue with Intake below.

Layout rule for every starting point: the hero image fills the first fold, with all other content below it.

## Intake (New prompt)

Ask in as few AskUserQuestion rounds as possible (max 4 questions per round). If the user already pasted a brief or planning notes, extract every answer you can from it first and only ask for what is missing. Collect:

1. **New or update.** New page, or update an existing `/landing/<slug>`. For an update, read the existing JSON, change only what was requested, and show a before/after table of changed fields before writing.
2. **Topic and title** (derive `slug`, lowercase-hyphen).
3. **Goal / KPI** (e.g. sign-ups, purchases).
4. **Target audience** and their **needs or pain points**.
5. **Main offering** (products, services, content).
6. **Section outline.** Optional. Per section: heading and a one-line detail. If omitted, propose 2-3 sections and confirm.
7. **Main impression** (the tone to convey), plus an optional **accent nuance**. Classify using `references/tone-categories.md`.
8. **One tone to avoid.** Also mapped in `references/tone-categories.md`.
9. **Hero image source:** generate with AI (default), or the user supplies an image (a path or upload; copy it into `public/generated/<slug>.<ext>` and skip the generate step).
10. **CTA** label and destination (existing internal route, or ask).

Output options: ask whether to run phased generation (default on). See "Phased generation".

## Steps

1. **Check for collisions.** If `content/landing-pages/<slug>.json` exists and this is not an update, ask before overwriting (or pick a new slug). Never overwrite silently.
2. **Classify tone.** Pick the main category (and accent) from `references/tone-categories.md`. State your choice to the user in one line. The main category drives the image style and copy voice; the accent only adds small touches.
3. **Write copy**, following `references/brand-voice.md` and the chosen tone. Limits are guidance for readability; exceed them only if the user's section detail needs it:
   - headline: max 70 characters
   - subhead: max 160 characters
   - CTA label: max 24 characters
   - sections: each heading max 40 characters, body max 280 characters
   - Follow the user's section outline order exactly. Do not add, remove or reorder sections they specified.
4. **Write the hero image prompt:** subject, style from the tone category, mood, composition, 16:9 aspect ratio, "no text, no logos, no watermarks", and the avoid-list ban phrased as "no ...". One or two sentences.
5. **Generate the image** via the dev server (server-side; Pollinations needs no key):
   ```bash
   curl -s -X POST http://localhost:3000/api/generate-hero-image \
     -H "Content-Type: application/json" \
     -d '{"prompt":"<image prompt>","slug":"<slug>"}'
   ```
   Response: `{ path, provider, placeholder, error? }`. Use `path` as `heroImagePath`. If `placeholder` is true, the placeholder was used; tell the user the `error` (e.g. Pollinations timeout or rate limit) and offer to retry. Pass `"overwrite": true` only if the user asked to regenerate.
6. **Write the data file** `content/landing-pages/<slug>.json` with: `slug`, `headline`, `subhead`, `cta {label, href}`, `sections [{heading, body}]`, `heroImagePath`, `heroImageAlt` (a meaningful description of the image, not "hero image"). Type: `components/LandingPage/LandingPage.types.ts`.
7. **Verify.** Ensure the dev server is running, fetch `http://localhost:3000/landing/<slug>` and confirm HTTP 200, the headline appears, and `heroImagePath` returns an image (HTTP 200). Run `npx tsc --noEmit`.
8. **Self-review.** Check the result against these before reporting:
   - hero image is the first thing on the page, filling the first fold
   - image `alt` is meaningful; heading order is sensible (one h1)
   - copy matches the tone, avoids the avoid-list tone, and stays within brand voice
   - body text contrast meets WCAG AA (4.5:1); see the `design-system` and `engineering-standards` skills
   - CTA `href` resolves to a real route
   List any failures and fix them, or report them.
9. **Report** the page URL (`/landing/<slug>`), data file path, image path, chosen tone category, and any placeholder warning.

## Phased generation

When phased generation is on (default), do not build the whole page at once:

1. Generate three direction options for the hero and first section only, saved as `<slug>-a`, `<slug>-b`, `<slug>-c` (data files and images):
   - **A (baseline):** follows the user's tone choices exactly.
   - **B (alternate):** same tone category, different image composition and headline angle.
   - **C (AI's pick):** ignore the stated impression; choose what you think converts best for the audience, needs and KPI, and give a one-line reason.
   - All three obey the avoid-list, the layout rule and the copy limits.
2. Share the three URLs and ask which to continue with. Do not proceed until the user answers.
3. Build the full page with the chosen direction at `<slug>`, then delete the other two data files and their images. Confirm with the user before deleting.

## Rules

- Never overwrite an existing page or image without asking.
- Never put secrets in code, data files, or output. If a keyed provider is ever added, read its key from env vars via `config.envs`.
- No text inside the generated image.
- Always ask for the starting point first (Figma file, HTML source code, New prompt, in that order).
- Every page leads with the hero image on the first fold, content below.
- Brand voice lives in `references/brand-voice.md`; tone categories live in `references/tone-categories.md`. Customize them there.
