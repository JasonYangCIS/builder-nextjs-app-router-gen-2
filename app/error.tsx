"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-5xl flex-col items-center gap-4 text-center">
        <Text variant="h1" className="sm:text-5xl">
          Something went wrong
        </Text>
        <Text variant="body-lg" color="muted">
          An unexpected error occurred. You can try again or return home.
        </Text>
        <div className="mt-2 flex items-center gap-3">
          <Button variant="default" onClick={reset}>Try again</Button>
          <Link href="/">
            <Button variant="ghost">← Back to home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
