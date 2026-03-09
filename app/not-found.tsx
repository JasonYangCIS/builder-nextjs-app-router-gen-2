import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-white px-6">
      <main className="flex w-full max-w-5xl flex-col items-center gap-4 text-center">
        <span className="text-8xl font-extrabold tracking-tight text-gray-200">
          404
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="text-lg text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-4 text-sm text-gray-600 hover:text-gray-900">
          &larr; Back to home
        </Link>
      </main>
    </div>
  );
}
