export const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-bold tracking-tight">
          Builder Sandbox
        </a>
        <nav className="flex gap-6 text-sm text-gray-600">
          <a href="/blog" className="hover:text-gray-900">Articles</a>
          <a href="/about" className="hover:text-gray-900">About</a>
        </nav>
      </div>
    </header>
  )
}