import Link from "next/link";
import { Typography } from "@/components/design-system";

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
        <Typography variant="h1" className="gradient-brand-text sm:text-5xl">
          Blog
        </Typography>
        <Typography variant="body-lg" color="muted" className="mt-3">
          Choose a blog pattern to browse articles.
        </Typography>
      </header>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogRoutes.map((route) => (
          <li key={route.href} className="flex">
            <Link
              href={route.href}
              className="group flex flex-1 flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-brand-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <Typography variant="h5" as="h2" className="group-hover:text-brand-600 transition-colors">
                {route.title}
              </Typography>
              <Typography variant="body-sm" color="muted" className="mt-2 flex-1">
                {route.description}
              </Typography>
              <span className="mt-4 text-sm font-medium text-brand-600 group-hover:text-brand-700 transition-colors">
                View articles →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
