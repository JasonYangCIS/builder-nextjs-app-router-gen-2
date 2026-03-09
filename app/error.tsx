"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Typography, Button } from "@/components/design-system";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-white px-6">
      <main className="flex w-full max-w-5xl flex-col items-center gap-4 text-center">
        <Typography variant="h1" className="sm:text-5xl">
          Something went wrong
        </Typography>
        <Typography variant="body-lg" color="muted">
          An unexpected error occurred. You can try again or return home.
        </Typography>
        <div className="mt-2 flex items-center gap-3">
          <Button variant="primary" label="Try again" onClick={reset} />
          <Link href="/">
            <Button variant="ghost" label="← Back to home" />
          </Link>
        </div>
      </main>
    </div>
  );
}
