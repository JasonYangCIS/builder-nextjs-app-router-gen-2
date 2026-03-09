"use client";

import { useEffect } from "react";
import Link from "next/link";

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
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-500">
          An unexpected error occurred. You can try again or return home.
        </p>
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <button
            type="button"
            onClick={reset}
            className="hover:text-gray-900"
          >
            Try again
          </button>
          <Link href="/" className="hover:text-gray-900">
            &larr; Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
