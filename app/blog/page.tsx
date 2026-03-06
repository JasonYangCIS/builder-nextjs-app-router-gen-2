import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Builder.io blog patterns: Data model, Section model, and Hybrid approach",
};

const blogRoutes = [
  {
    href: "/blog-article",
    title: "Data Model",
    description:
      "A blog purely in code, populated by a Data model. Content structure is fixed in code; data comes from Builder.",
  },
  {
    href: "/blog-article-section",
    title: "Section Model",
    description:
      "First fold (hero, header) is fixed in code; the rest is drag-and-drop in the Builder.io visual editor.",
  },
  {
    href: "/blog-article-template",
    title: "Hybrid Approach",
    description:
      "Data bindings and templates within the Section model. Content is driven by data with flexible layouts.",
  },
] as const;

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Choose a blog pattern to browse articles.
        </p>
      </header>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogRoutes.map((route) => (
          <li key={route.href} className="flex">
            <Link
              href={route.href}
              className="group flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700">
                {route.title}
              </h2>
              <p className="mt-2 flex-1 text-gray-600">{route.description}</p>
              <span className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                View articles →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
