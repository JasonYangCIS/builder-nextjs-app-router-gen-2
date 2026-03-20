"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildLocalePath, stripLocalePrefix, DEFAULT_LOCALE } from "@/utils/locale";
import { config } from "@/config";
import styles from "./LocaleSwitch.module.scss";

export type { LocaleEntry, LocaleSwitchProps } from "./LocaleSwitch.types";
import type { LocaleSwitchProps } from "./LocaleSwitch.types";

const SUPPORTED_CODES = config.locales.supported.map((l) => l.code);

export function LocaleSwitch({ locales, currentLocale }: LocaleSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLocaleChange = (code: string) => {
    // Strip any existing locale prefix, then re-add the new one
    const bare = stripLocalePrefix(pathname);
    const newPath = buildLocalePath(code, bare);
    // Preserve query params (e.g. Builder preview tokens)
    const qs = searchParams.toString();
    setIsOpen(false);
    router.push(qs ? `${newPath}?${qs}` : newPath);
  };

  const currentLabel = locales.find((l) => l.code === currentLocale)?.label ?? currentLocale;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.localeButton}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Globe icon */}
        <svg
          className={styles.globeIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c-3 0-5-4-5-9s2-9 5-9m0 18c3 0 5-4 5-9s-2-9-5-9M3 12h18"
          />
        </svg>
        <span>{currentLabel}</span>
        <svg
          className={`${styles.chevron}${isOpen ? ` ${styles.open}` : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul
            className={styles.dropdownMenu}
            role="listbox"
            aria-label="Select language"
          >
            {locales.map((locale) => (
              <li key={locale.code} role="option" aria-selected={locale.code === currentLocale}>
                <button
                  onClick={() => handleLocaleChange(locale.code)}
                  className={`${styles.dropdownItem}${locale.code === currentLocale ? ` ${styles.active}` : ""}`}
                >
                  {locale.label}
                  {locale.code === currentLocale && (
                    <svg
                      className={styles.checkIcon}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
