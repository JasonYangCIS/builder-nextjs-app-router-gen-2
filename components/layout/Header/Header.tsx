import { Suspense } from "react";
import Link from "next/link";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { buildLocalePath } from "@/utils/locale";
import { NavItems } from "./NavItems";
import { ThemeSwitch } from "./ThemeSwitch";
import { SearchButton } from "./SearchButton";
import { LocaleSwitch } from "@/components/LocaleSwitch/LocaleSwitch";

export const Header = async ({ locale }: { locale?: string }) => {
  const homeHref = buildLocalePath(locale ?? config.locales.default, "/");
  const resolvedLocale = locale ?? config.locales.default;
  const raw = await fetchEntries({
    apiKey: config.envs.builderApiKey,
    model: config.models.headerNavMenu,
    limit: 5,
    fields: "id,data",
    locale: resolvedLocale,
  });

  const navMenuEntries = (raw ?? [])
    .filter((entry) => entry.data?.text && entry.data?.url)
    .map((entry) => ({
      id: entry.id ?? "",
      text: entry.data!.text as string,
      url: entry.data!.url as string,
    }));

  return (
    <header className="relative border-b transition-colors" style={{ borderColor: "var(--header-border)", backgroundColor: "var(--header-bg)" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href={homeHref}
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          Jason Yang - Builder.io
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav, locale switcher, and theme switcher */}
          <div className="hidden items-center gap-4 md:flex">
            <NavItems entries={navMenuEntries} onlyDesktopNav />
            {/* Suspense required: LocaleSwitch uses useSearchParams() internally */}
            <Suspense fallback={null}>
              <LocaleSwitch locales={config.locales.supported} />
            </Suspense>
            <SearchButton />
            <ThemeSwitch />
          </div>

          {/* Mobile: search + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <SearchButton />
            <NavItems entries={navMenuEntries} onlyMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
