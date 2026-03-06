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
            Jason Yang's Builder.io Sandbox
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600">
            A sandbox environment for the Builder.io Gen 2 SDK with Next.js
            App Router.
          </p>
        </div>
      </main>
    </div>
  );
}
