import Link from "next/link";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { getLocaleFromHeaders } from "@/utils/locale-server";
import { NavItems } from "./NavItems";
import { ThemeSwitch } from "./ThemeSwitch";
import { LocaleSwitch } from "@/components/LocaleSwitch/LocaleSwitch";

export const Header = async () => {
  const [raw, currentLocale] = await Promise.all([
    fetchEntries({
      apiKey: config.envs.builderApiKey,
      model: config.models.headerNavMenu,
      limit: 5,
      fields: "id,data",
    }),
    getLocaleFromHeaders(),
  ]);

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
          href="/"
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          Jason Yang - Builder.io
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav, locale switcher, and theme switcher */}
          <div className="hidden items-center gap-4 md:flex">
            <NavItems entries={navMenuEntries} currentLocale={currentLocale} onlyDesktopNav />
            <LocaleSwitch locales={config.locales.supported} currentLocale={currentLocale} />
            <ThemeSwitch />
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <NavItems entries={navMenuEntries} currentLocale={currentLocale} onlyMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
