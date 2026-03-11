import Link from "next/link";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { NavItems } from "./NavItems";
import { ThemeSwitch } from "./ThemeSwitch";

export const Header = async () => {
  const raw = await fetchEntries({
    apiKey: config.envs.builderApiKey,
    model: config.models.headerNavMenu,
    limit: 5,
    fields: "id,data",
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
          href="/"
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          Jason Yang - Builder.io
        </Link>
        <div className="flex items-center gap-4">
          <NavItems entries={navMenuEntries} />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
};
