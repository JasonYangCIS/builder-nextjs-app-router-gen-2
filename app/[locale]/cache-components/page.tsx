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

const USE_CASES_OFF = [
  {
    title: "Preview / editor routes",
    detail:
      "app/preview/page.tsx leans on isPreviewing()/isEditing() anywhere in the tree. No Suspense gymnastics required just to open the visual editor.",
  },
  {
    title: "Per-request personalization (SSR)",
    detail:
      "ssr/custom-targeting reads cookies() and fetches a targeted entry every request. force-dynamic is simpler than isolating exactly which call needs caching.",
  },
  {
    title: "Small or early-stage sites",
    detail:
      "Mostly plain Builder pages, little targeting. The current static-until-proven-dynamic default already caches for free.",
  },
];

const USE_CASES_ON = [
  {
    title: "High-traffic marketing pages",
    detail:
      "Builder content with no personalization. Mark the layout and fetchOneEntry() 'use cache' so they're guaranteed cached, instead of hoping no dynamic API crept into a shared layout.",
  },
  {
    title: "Static shell + personalized slice",
    detail:
      "What ppr/custom-targeting is reaching for today. Cache the header/footer/chrome, keep only the cookie-targeted fetch dynamic inside <Suspense> — true PPR instead of SSR-with-streaming.",
  },
  {
    title: "Multi-locale default content",
    detail:
      "Caching fetchOneEntry() per locale avoids re-hitting the Content API on every request for an entry that rarely changes.",
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
          When to reach for each, from the Builder integration's side
        </Text>
        <Text variant="body" color="muted">
          Both modes are legitimate choices — it depends on how much of a given route is genuinely
          per-visitor vs. shared.
        </Text>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              Good fit for cacheComponents: off
            </Badge>
            {USE_CASES_OFF.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>
                    <Text variant="h6" as="h3">{item.title}</Text>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="body-sm" color="muted" as="p">
                    {item.detail}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit">
              Good fit for cacheComponents: on
            </Badge>
            {USE_CASES_ON.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>
                    <Text variant="h6" as="h3">{item.title}</Text>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="body-sm" color="muted" as="p">
                    {item.detail}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="border-amber-600/40 bg-amber-500/10">
          <CardHeader>
            <CardTitle>
              <Text variant="h6" as="h3" color="warning">The one to watch</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body-sm" as="p">
              It's not that targeted <code className="rounded bg-muted px-1 py-0.5 text-xs">fetchOneEntry()</code> calls
              can never be marked <code className="rounded bg-muted px-1 py-0.5 text-xs">&apos;use cache&apos;</code> — Builder's
              own performance guidance is to key caches on a few low-cardinality attributes (e.g.
              audience, region, plan) and avoid high-cardinality per-visitor values like a visitor
              ID or timestamp. The SSR/PPR demos' targeting attributes are exactly that kind of
              high-cardinality, session-derived value, which is why they stay dynamic rather than
              cached.
            </Text>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2" as="h2">
          How to verify it was done correctly
        </Text>
        <Text variant="body" color="muted">
          Build-time checks tell you whether the Suspense boundaries are right. They can't tell you
          whether a cached Builder fetch is leaking one visitor's content to another — that needs a
          runtime check.
        </Text>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Text variant="h6" as="h3">1. Build-time: trust the build output</Text>
              </CardTitle>
              <CardDescription>Catches missing Suspense boundaries.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                <li>
                  <Text variant="body-sm" color="muted" as="p">
                    Run <code className="rounded bg-muted px-1 py-0.5 text-xs">next build</code>. With
                    cacheComponents on, an uncached dynamic read outside{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Suspense&gt;</code> fails the
                    build — that's a feature, not noise.
                  </Text>
                </li>
                <li>
                  <Text variant="body-sm" color="muted" as="p">
                    Check the route table in the build output: each route is tagged{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">○</code> static,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">ƒ</code> dynamic, or{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">◐</code> partial prerender.
                    Confirm each Builder route landed in the bucket you intended.
                  </Text>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Text variant="h6" as="h3">2. Runtime: smoke-test targeting isolation</Text>
              </CardTitle>
              <CardDescription>Catches a cached fetch leaking across visitors.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                <li>
                  <Text variant="body-sm" color="muted" as="p">
                    Hit the route with two different targeting attributes (e.g. two incognito
                    sessions via <Link href={buildLocalePath(locale, "/ssr/custom-targeting")} className="text-primary underline-offset-4 hover:underline">ssr/custom-targeting</Link>) and
                    confirm the responses actually differ.
                  </Text>
                </li>
                <li>
                  <Text variant="body-sm" color="muted" as="p">
                    Repeat the same request twice with identical attributes and inspect the{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">cache-control</code>,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">age</code>, or{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">x-vercel-cache</code> response
                    headers to confirm the second hit actually served from cache.
                  </Text>
                </li>
                <li>
                  <Text variant="body-sm" color="muted" as="p">
                    Publish a change in Builder and time how long it takes to appear — it should
                    roughly match your <code className="rounded bg-muted px-1 py-0.5 text-xs">revalidate</code> setting,
                    not be instant or stuck forever.
                  </Text>
                </li>
              </ul>
            </CardContent>
          </Card>
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
