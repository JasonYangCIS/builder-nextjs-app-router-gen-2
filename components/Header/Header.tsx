import Link from "next/link";
import { fetchEntries } from "@builder.io/sdk-react";
import { config } from "@/config";
import { NavItems } from "./NavItems";

export const Header = async () => {
  const raw = await fetchEntries({
    apiKey: config.envs.builderApiKey,
    model: config.models.headerNavMenu,
    limit: 5,
    fields: 'data'
  });

  const navMenuEntries = (raw ?? [])
    .map((entry) => entry.data as { text: string; url: string } | undefined)
    .filter((d): d is { text: string; url: string } => !!d?.text && !!d?.url);

  return (
    <header className="relative border-b border-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-gray-900">
          Jason Yang - Builder.io
        </Link>
        <NavItems entries={navMenuEntries} />
      </div>
    </header>
  );
};
