import Link from "next/link";
import { Text } from "@/components/ui/Text/Text";
import { buildLocalePath } from "@/utils/locale";

export const metadata = {
  title: "Blog",
  description: "Builder.io blog patterns: Data model, Section model, and Hybrid approach",
};

const blogRoutes = [
  {
    path: "/blog-article",
    title: "Data Model",
    description:
      "A blog purely in code, populated by a Data model. Content structure is fixed in code; data comes from Builder.",
  },
  {
    path: "/blog-article-section",
    title: "Section Model",
    description:
      "First fold (hero, header) is fixed in code; the rest is drag-and-drop in the Builder.io visual editor.",
  },
  {
    path: "/blog-article-template",
    title: "Hybrid Approach",
    description:
      "Data bindings and templates within the Section model. Content is driven by data with flexible layouts.",
  },
] as const;

export default async function BlogPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-14">
        <Text variant="h1" className="gradient-brand-text sm:text-5xl">
          Blog
        </Text>
        <Text variant="body-lg" color="muted" className="mt-3">
          Choose a blog pattern to browse articles.
        </Text>
      </header>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogRoutes.map((route) => {
          const href = buildLocalePath(locale, route.path);
          return (
            <li key={route.path} className="flex">
              <Link
                href={href}
                className="group flex flex-1 flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Text variant="h5" as="h2" className="group-hover:text-primary transition-colors">
                  {route.title}
                </Text>
                <Text variant="body-sm" color="muted" className="mt-2 flex-1">
                  {route.description}
                </Text>
                <span className="mt-4 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                  View articles &rarr;
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
