export function Footer() {
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
