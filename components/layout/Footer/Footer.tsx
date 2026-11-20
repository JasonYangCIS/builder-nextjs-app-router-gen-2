import { cacheLife } from "next/cache";

// Cached because it reads the current time, which Cache Components disallows in
// the static shell. The copyright year only needs day-level freshness.
export async function Footer() {
  "use cache";
  cacheLife("days");
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-8 text-center">
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} My Builder Sandbox. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
