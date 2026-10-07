import type { Metadata } from "next";
import Link from "next/link";
import { Text } from "@/components/ui/Text/Text";
import { Badge } from "@/components/ui/Badge/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card/Card";
import CacheComponentsDemo from "@/components/CacheComponentsDemo/CacheComponentsDemo";
import ServerClientBoundaryDemo from "@/components/ServerClientBoundaryDemo/ServerClientBoundaryDemo";
import { buildLocalePath } from "@/utils/locale";

export const metadata: Metadata = {
  title: "cacheComponents Explained",
  description:
    "An interactive walkthrough of Next.js cacheComponents, its effect on the Builder Gen 2 SDK, and server vs. client components.",
};

const ROUTE_COMPARISON = [
  {
    href: "/ssg/custom-targeting",
    name: "SSG route",
    today: "Static shell, client-side targeting swap. Already fits the cacheComponents model.",
    withFlag:
      "Needs an explicit 'use cache' on the page function to stay static — under cacheComponents nothing is cached by default anymore.",
  },
  {
    href: "/ssr/custom-targeting",
    name: "SSR route",
    today: "force-dynamic — cookies() read makes the whole route dynamic, every request hits origin.",
    withFlag:
      "force-dynamic still works, but the idiomatic fix is to isolate the cookies() read behind <Suspense> so the rest of the tree can be cached.",
  },
  {
    href: "/ppr/custom-targeting",
    name: "PPR route",
    today: "Streaming via Suspense today, but without the flag the shell is NOT statically cached — it's SSR with a streamed boundary.",
    withFlag:
      "Becomes true PPR: add 'use cache' to the locale layout, and the shell is served from cache while only the Suspense boundary stays dynamic.",
  },
];

const CHEAT_SHEET = [
  {
    concept: "Default caching behavior",
    off: "Static until a dynamic API forces the route dynamic",
    on: "Dynamic until 'use cache' opts a piece in",
  },
  {
    concept: "Granularity",
    off: "Whole route",
    on: "Per function / component",
  },
  {
    concept: "Reading cookies() / isPreviewing()",
    off: "Allowed anywhere; makes the route dynamic",
    on: "Must be wrapped in <Suspense>, or the build errors",
  },
  {
    concept: "fetchOneEntry() in a Server Component",
    off: "Cached like any other fetch unless the route is already dynamic",
    on: "Dynamic by default — add 'use cache' only if the same entry is safe to share across visitors",
  },
  {
    concept: "Client components (Counter, forms, etc.)",
    off: "Unaffected — always render in the browser",
    on: "Unaffected — always render in the browser",
  },
];

type PageProps = { params: Promise<{ locale: string }> };

export default async function CacheComponentsPage(props: PageProps) {
  const { locale } = await props.params;
  const renderedAt = new Date().toLocaleTimeString();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Next.js 16
        </Badge>
        <Text variant="h1">Understanding cacheComponents</Text>
        <Text variant="body-lg" color="muted">
          A flag that flips who's responsible for caching: today Next.js caches by default and you
          opt OUT with a dynamic API; with <code className="rounded bg-muted px-1 py-0.5 text-sm">cacheComponents</code> on,
          nothing is cached unless you opt IN.
        </Text>
      </header>

      <section className="flex flex-col gap-4">
        <Text variant="h2" as="h2">
          Flip the switch
        </Text>
        <Text variant="body" color="muted">
          This diagram maps a typical page in this repo — layout, Builder fetch, a dynamic read, and
          a client component. Toggle the mode and watch which pieces are cache-eligible and which
          are forced to run per request.
        </Text>
        <CacheComponentsDemo />
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2" as="h2">
          Server vs. client, live on this page
        </Text>
        <Text variant="body" color="muted">
          Click the button below to re-run just the server side of this page — no full page reload.
          Watch the timestamp move while the counter's value survives untouched. That gap is exactly
          what cacheComponents controls: whether the server-side work gets redone or reused.
        </Text>
        <ServerClientBoundaryDemo renderedAt={renderedAt} />
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2" as="h2">
          What changes for the Builder Gen 2 SDK
        </Text>
        <Text variant="body" color="muted">
          Every route in this repo calls <code className="rounded bg-muted px-1 py-0.5 text-sm">fetchOneEntry</code> from
          a Server Component, and several also call <code className="rounded bg-muted px-1 py-0.5 text-sm">isPreviewing()</code>/
          <code className="rounded bg-muted px-1 py-0.5 text-sm">isEditing()</code> — both dynamic APIs. The three existing
          demo routes below already illustrate the SSG / SSR / PPR tradeoffs; here's how each would
          shift if cacheComponents were turned on repo-wide.
        </Text>
        <div className="flex flex-col gap-3">
          {ROUTE_COMPARISON.map((route) => (
            <Card key={route.href}>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={buildLocalePath(locale, route.href)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {route.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div>
                  <Badge variant="outline" className="mb-1">
                    Today
                  </Badge>
                  <Text variant="body-sm" color="muted" as="p">
                    {route.today}
                  </Text>
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">
                    With cacheComponents
                  </Badge>
                  <Text variant="body-sm" color="muted" as="p">
                    {route.withFlag}
                  </Text>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2" as="h2">
          Cheat sheet
        </Text>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 font-medium">Concept</th>
                <th className="px-4 py-2 font-medium">cacheComponents: off (today)</th>
                <th className="px-4 py-2 font-medium">cacheComponents: on</th>
              </tr>
            </thead>
            <tbody>
              {CHEAT_SHEET.map((row) => (
                <tr key={row.concept} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{row.concept}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.off}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.on}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
