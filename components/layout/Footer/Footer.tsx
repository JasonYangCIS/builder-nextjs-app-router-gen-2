import { Typography } from "@/components/design-system";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-5xl px-6 py-8 text-center">
        <Typography variant="caption" color="subtle">
          © {new Date().getFullYear()} My Builder Sandbox. All rights reserved.
        </Typography>
      </div>
    </footer>
  );
}
