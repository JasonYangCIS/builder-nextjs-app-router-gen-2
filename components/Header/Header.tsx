import Link from "next/link";

export const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-gray-900">
          Jason Yang - Builder.io
        </Link>
        <nav className="flex gap-6 text-sm text-gray-600">
          <Link href="/blog" className="hover:text-gray-900">Blog</Link>
        </nav>
      </div>
    </header>
  );
};