"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const AlgoliaSearch = dynamic(
  () => import("@/components/Algolia/AlgoliaSearch/AlgoliaSearch"),
  { ssr: false }
);

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Close modal on navigation
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="search-button flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        aria-label="Search (⌘K)"
      >
        <svg
          className="h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 motion-reduce:transition-none"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-[560px] mx-4 rounded-xl border border-border bg-card p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header row */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Search</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  aria-label="Close search"
                >
                  <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <AlgoliaSearch placeholder="Search pages…" />

              <p className="mt-4 text-xs text-muted-foreground">
                Start typing to search across all pages. Use <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[0.6875rem]">Esc</kbd> to close.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
