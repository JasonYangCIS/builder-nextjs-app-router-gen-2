"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribeToEditor, isPreviewing } from "@builder.io/sdk-react";
import { config } from "@/config";
import { ThemeSwitch } from "./ThemeSwitch";

interface NavEntry {
  id: string;
  text: string;
  url: string;
}

interface NavItemsProps {
  entries: NavEntry[];
  onlyMobileMenu?: boolean;
  onlyDesktopNav?: boolean;
}

export function NavItems({ entries: initialEntries, onlyMobileMenu, onlyDesktopNav }: NavItemsProps) {
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
      {!onlyMobileMenu && (
        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link
            href="/design-system"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Design System
          </Link>
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
      )}

      {/* Backdrop overlay for mobile menu */}
      {!onlyDesktopNav && open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile hamburger */}
      {!onlyDesktopNav && (
        <button
          className="menu-button relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110"
          style={{
            borderColor: open ? "var(--foreground)" : "var(--header-border)",
            backgroundColor: open ? "var(--muted-bg)" : "transparent",
          }}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <div className="relative h-4 w-4">
            {/* Top line */}
            <span
              className={`absolute left-0 block h-0.5 w-4 rounded-full transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
              style={{ backgroundColor: "var(--foreground)" }}
            />
            {/* Middle dot/line */}
            <span
              className={`absolute left-1/2 top-1.5 block rounded-full transition-all duration-300 ${
                open ? "h-0 w-0 opacity-0" : "h-1 w-1 -translate-x-1/2 opacity-100"
              }`}
              style={{ backgroundColor: "var(--foreground)" }}
            />
            {/* Bottom line */}
            <span
              className={`absolute left-0 block h-0.5 w-4 rounded-full transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
              style={{ backgroundColor: "var(--foreground)" }}
            />
          </div>
        </button>
      )}

      {/* Mobile dropdown */}
      {!onlyDesktopNav && (
        <div
          className={`absolute left-0 right-0 top-full z-50 overflow-hidden transition-all duration-300 ease-out ${
            open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav
            className={`flex flex-col gap-4 border-b px-6 py-4 text-sm shadow-lg backdrop-blur-sm transition-all duration-300 ${
              open ? "translate-y-0" : "-translate-y-4"
            }`}
            style={{
              borderColor: "var(--header-border)",
              backgroundColor: "color-mix(in srgb, var(--header-bg) 95%, transparent)",
              color: "var(--foreground)",
            }}
          >
            <Link
              href="/design-system"
              className={`menu-link transition-all duration-300 hover:opacity-80 hover:translate-x-1 ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{
                color: "var(--muted)",
                transitionDelay: open ? "50ms" : "0ms",
              }}
              onClick={() => setOpen(false)}
            >
              Design System
            </Link>
            {entries.map((entry, index) => (
              <Link
                key={entry.id}
                href={entry.url}
                className={`menu-link transition-all duration-300 hover:opacity-80 hover:translate-x-1 ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: open ? `${(index + 1) * 50 + 50}ms` : "0ms",
                }}
                onClick={() => setOpen(false)}
              >
                {entry.text}
              </Link>
            ))}
            <div
              className={`border-t pt-4 transition-all duration-300 ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{
                borderColor: "var(--header-border)",
                transitionDelay: open ? `${(entries.length + 1) * 50 + 50}ms` : "0ms",
              }}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Theme
              </p>
              <ThemeSwitch />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
