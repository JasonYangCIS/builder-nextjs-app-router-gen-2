---
name: localization
description: Use when working with locale routing, the proxy, buildLocalePath, internal links, generateStaticParams with locales, LocaleSwitch, or preview route locale resolution.
---

See `docs/skills/localization.md` for the full locale architecture.

Key areas covered:
- Proxy (`proxy.ts`): unprefixed URL rewrite, default-locale redirect, bypass paths
- Locale utilities (`utils/locale.ts`): buildLocalePath, stripLocalePrefix, getLocaleFromPath
- Internal links: always use `buildLocalePath(locale, "/path")` — never hardcode paths
- Server Components: read locale from route params; Client Components: derive from `usePathname()`
- `generateStaticParams` must return ALL supported locales x slugs
- LocaleSwitch client component
- Preview route locale resolution (builder.options.locale → locale param → DEFAULT_LOCALE)
- Adding a new locale: single change in `config.ts`
