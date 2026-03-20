"use client";

import { useState, useEffect } from "react";

type Theme = "default" | "dark";

export const ThemeSwitch = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && (savedTheme === "default" || savedTheme === "dark")) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = currentTheme === "default" ? "dark" : "default";
    setCurrentTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-switch-button flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label={currentTheme === "default" ? "Switch to dark theme" : "Switch to light theme"}
    >
      {currentTheme === "default" ? (
        /* Sun icon — visible in light mode, click to go dark */
        <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        /* Moon icon — visible in dark mode, click to go light */
        <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
};
