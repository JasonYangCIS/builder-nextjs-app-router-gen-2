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

  // WCAG 2.1 AA: Keyboard support - Escape key closes menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

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

      {/* Backdrop overlay for mobile menu - starts below header */}
      {!onlyDesktopNav && open && (
        <div
          className="fixed left-0 right-0 bottom-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
          style={{ top: "calc(var(--header-height, 73px))" }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile hamburger - WCAG 2.1 AA compliant: 44x44px touch target */}
      {!onlyDesktopNav && (
        <button
          className="menu-button relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
          style={{
            borderColor: open ? "var(--foreground)" : "var(--header-border)",
            backgroundColor: open ? "var(--muted-bg)" : "transparent",
            // Focus ring color with proper contrast
            "--tw-ring-color": "var(--color-brand-500)",
          } as React.CSSProperties}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <div className="relative h-4 w-4">
            {/* Top line */}
            <span
              className={`absolute left-0 block h-0.5 w-4 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                open ? "top-1.5 rotate-45 motion-reduce:rotate-0" : "top-0"
              }`}
              style={{ backgroundColor: "var(--foreground)" }}
            />
            {/* Middle dot/line */}
            <span
              className={`absolute left-1/2 top-1.5 block rounded-full transition-all duration-300 motion-reduce:transition-none ${
                open ? "h-0 w-0 opacity-0" : "h-1 w-1 -translate-x-1/2 opacity-100"
              }`}
              style={{ backgroundColor: "var(--foreground)" }}
            />
            {/* Bottom line */}
            <span
              className={`absolute left-0 block h-0.5 w-4 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                open ? "top-1.5 -rotate-45 motion-reduce:rotate-0" : "top-3"
              }`}
              style={{ backgroundColor: "var(--foreground)" }}
            />
          </div>
        </button>
      )}

      {/* Mobile dropdown */}
      {!onlyDesktopNav && (
        <div
          className={`absolute left-0 right-0 top-full z-50 overflow-hidden transition-all ease-out motion-reduce:transition-none ${
            open ? "max-h-[500px] opacity-100 duration-300" : "max-h-0 opacity-0 duration-200"
          }`}
        >
          <nav
            id="mobile-navigation"
            className={`flex flex-col gap-4 border-b px-6 py-4 text-sm shadow-lg backdrop-blur-sm transition-all motion-reduce:transition-none ${
              open ? "translate-y-0 duration-300" : "-translate-y-4 duration-200"
            }`}
            style={{
              borderColor: "var(--header-border)",
              backgroundColor: "color-mix(in srgb, var(--header-bg) 95%, transparent)",
              color: "var(--foreground)",
            }}
            aria-label="Mobile navigation menu"
          >
            <Link
              href="/design-system"
              className={`menu-link rounded-md px-2 py-2 transition-all duration-300 hover:opacity-80 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-brand-500 motion-reduce:transition-none motion-reduce:hover:translate-x-0 ${
                open ? "translate-x-0 opacity-100" : "motion-reduce:translate-x-0 motion-reduce:opacity-100 -translate-x-4 opacity-0"
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
                className={`menu-link rounded-md px-2 py-2 transition-all duration-300 hover:opacity-80 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-brand-500 motion-reduce:transition-none motion-reduce:hover:translate-x-0 ${
                  open ? "translate-x-0 opacity-100" : "motion-reduce:translate-x-0 motion-reduce:opacity-100 -translate-x-4 opacity-0"
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
