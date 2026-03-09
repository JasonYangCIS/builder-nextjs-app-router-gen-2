"use client";

import Link from "next/link";
import { useState } from "react";

interface NavEntry {
  text: string;
  url: string;
}

interface NavItemsProps {
  entries: NavEntry[];
}

export function NavItems({ entries }: NavItemsProps) {
  const [open, setOpen] = useState(false);

  if (!entries.length) return null;

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
        {entries.map((entry) => (
          <Link
            key={entry.url}
            href={entry.url}
            className="hover:text-gray-900 transition-colors"
          >
            {entry.text}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden flex flex-col justify-center gap-1.5 p-1"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className={`block h-0.5 w-6 bg-gray-600 transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`block h-0.5 w-6 bg-gray-600 transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-6 bg-gray-600 transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden absolute top-full left-0 right-0 border-b border-gray-200 bg-white px-6 py-4 flex flex-col gap-4 text-sm text-gray-600 z-50">
          {entries.map((entry) => (
            <Link
              key={entry.url}
              href={entry.url}
              className="hover:text-gray-900 transition-colors"
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
