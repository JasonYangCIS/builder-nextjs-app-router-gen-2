# Project Maintenance

Checklists for keeping project docs and skills in sync when the codebase changes.

---

## Doc update checklist — run after creating any new component

After scaffolding a net-new component, check each item below and update if applicable:

| Condition | File to update |
|-----------|---------------|
| Component is in `components/` and notable enough to reference | `CLAUDE.md` — add to the Directory Structure listing |
| Component is a new shadcn primitive or introduces a new UI pattern | `docs/skills/design-system.md` — document component API, variants, and import path |
| Component is registered in `builder-registry.ts` | `docs/skills/builder-io.md` — update Custom Component Registration section if a new pattern is used |
| Component introduces a variation on the four-file folder pattern | `.builder/rules/component-structure.mdc` — update with the new pattern and rationale |
| Component is a new UI primitive intended for reuse | `app/design-system/page.tsx` — add a showcase section so it is visible and Playwright-testable |
| Component is a new UI primitive **or** a new feature component | `tests/design-system/` or `tests/heroes/` — add a `my-component.spec.ts` Playwright test |
| Component file structure or naming convention changes | `.builderrules` — update the Component File Structure section |
| A new skill is being added or an existing skill removed/renamed | Run the **skill sync checklist** below |

**When in doubt, update the docs.** Outdated agent docs cause future agents to generate inconsistent code.

---

## Skill sync checklist — run when adding or removing a skill

Every skill has references in **five locations**. When you add, remove, or rename a skill, update all of them:

| Location | What to update |
|----------|----------------|
| `docs/skills/<skill>.md` | Add/remove the full skill doc (canonical source of truth) |
| `.builder/skills/<skill>/SKILL.md` | Add/remove Builder Fusion pointer (frontmatter + link to `docs/skills/`) |
| `.claude/skills/<skill>/SKILL.md` | Add/remove Claude Code pointer (frontmatter + link to `docs/skills/`) |
| `CLAUDE.md` — Skills table | Add/remove row in the skills table |
| Cross-references in other skill docs | Check if other `docs/skills/*.md` files reference the added/removed skill |

**Current skills:** `builder-io`, `design-system`, `engineering-standards`, `localization`, `project-maintenance`, `testing`
