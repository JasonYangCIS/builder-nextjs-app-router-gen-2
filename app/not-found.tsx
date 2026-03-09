import Link from "next/link";
import { Typography, Button } from "@/components/design-system";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-white px-6">
      <main className="flex w-full max-w-5xl flex-col items-center gap-4 text-center">
        <span className="gradient-brand-text text-8xl font-extrabold tracking-tight">
          404
        </span>
        <Typography variant="h1" className="sm:text-5xl">
          Page not found
        </Typography>
        <Typography variant="body-lg" color="muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Link href="/" className="mt-2">
          <Button variant="ghost" label="← Back to home" />
        </Link>
      </main>
    </div>
  );
}
