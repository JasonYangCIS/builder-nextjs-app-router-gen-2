# Intake (New prompt)

Ask in as few AskUserQuestion rounds as possible (max 4 questions per round). If the user already pasted a brief or planning notes, extract every answer you can from it first and only ask for what is missing. Collect:

1. **New or update.** Default: new page. For an update, read the existing JSON, change only what was requested, and show a before/after table of changed fields before writing.
2. **Topic and title** (derive `slug`, lowercase-hyphen).
3. **Goal / KPI** (e.g. sign-ups, purchases).
4. **Target audience** and their **needs or pain points**.
5. **Main offering** (products, services, content).
6. **Section outline.** Optional. Per section: heading and a one-line detail. Default if omitted: propose 2-3 sections and confirm.
7. **Main impression** (the tone to convey), plus an optional **accent nuance**. Classify using `tone-categories.md`.
8. **One tone to avoid.** Also mapped in `tone-categories.md`.
9. **Hero image source.** Default: generate with AI. Alternative: the user supplies an image (a path or upload; copy it into `public/generated/<slug>.<ext>` and skip the generate step).
10. **CTA** label and destination. Default destination: an existing internal route; ask if unclear.
11. **Phased generation.** Default: on. See `phased-generation.md`.
