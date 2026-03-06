import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-zinc-50 px-6">
      <main className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Sandbox
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Builder.io Sandbox
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600">
            A development environment for the Builder.io Gen 2 SDK with Next.js
            App Router.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/blog"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            View Blog
          </Link>
          <a
            href="https://www.builder.io"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Builder.io
          </a>
        </div>
      </main>
    </div>
  );
}
