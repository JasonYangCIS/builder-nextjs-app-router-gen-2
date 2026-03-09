"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribeToEditor, isPreviewing } from "@builder.io/sdk-react";
import { config } from "@/config";

interface NavEntry {
  id: string;
  text: string;
  url: string;
}

interface NavItemsProps {
  entries: NavEntry[];
}

export function NavItems({ entries: initialEntries }: NavItemsProps) {
  const [entries, setEntries] = useState<NavEntry[]>(initialEntries);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isPreviewing()) return;

    // Only subscribe when previewing the header-nav-menu model specifically.
    // Without this guard, the subscription fires on every Builder-previewed page
    // (including the page model), causing a model name mismatch error.
    const params = new URLSearchParams(window.location.search);
    const previewModel = params.get("builder.preview");
    if (previewModel && previewModel !== config.models.headerNavMenu) return;

    const unsubscribe = subscribeToEditor({
      model: config.models.headerNavMenu,
      apiKey: config.envs.builderApiKey,
      callback: (updatedContent) => {
        const { id, data } = updatedContent;
        if (!data?.text || !data?.url) return;

        setEntries((prev) => {
          const exists = prev.some((e) => e.id === id);
          const updated = { id: id ?? "", text: data.text as string, url: data.url as string };
          return exists
            ? prev.map((e) => (e.id === id ? updated : e))
            : [...prev, updated];
        });
      },
    });

    return unsubscribe;
  }, []);

  if (!entries.length) return null;

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.url}
            className="transition-colors hover:text-zinc-900"
          >
            {entry.text}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        className="flex flex-col justify-center gap-1.5 p-1 md:hidden"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className={`block h-0.5 w-6 bg-zinc-600 transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`block h-0.5 w-6 bg-zinc-600 transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-6 bg-zinc-600 transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {/* Mobile dropdown */}
      {open && (
        <nav className="absolute left-0 right-0 top-full z-50 flex flex-col gap-4 border-b border-zinc-200 bg-white px-6 py-4 text-sm text-zinc-600 md:hidden">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={entry.url}
              className="transition-colors hover:text-zinc-900"
              onClick={() => setOpen(false)}
            >
              {entry.text}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
