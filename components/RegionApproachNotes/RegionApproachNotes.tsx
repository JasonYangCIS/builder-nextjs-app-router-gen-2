import { Text } from "@/components/ui/Text/Text";
import { Badge } from "@/components/ui/Badge/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import type { NoteSection } from "./RegionApproachNotes.types";

export type { NoteSection } from "./RegionApproachNotes.types";

const pros: NoteSection = {
  title: "Pros",
  items: [
    "Holds structured data (a locale list), unlike a targeting attribute",
    "Edit a region once, every entry updates",
    "Editors pick a region from a dropdown",
    "Simple filter: data.regionRef.id",
  ],
};

const cons: NoteSection = {
  title: "Cons",
  items: [
    "Two requests: locale to region, then content",
    "No locale search in the API; filter in app code",
    "Entries are tied to region ids, not names",
    "One region per entry",
  ],
};

const deletionEffects: string[] = [
  "Entries keep the old id",
  "Locale lookup finds no region",
  "No error, no warning",
  "Recreating the region gives a new id, so references stay broken",
];

const deletionMitigations: string[] = [
  "Never delete; use an inactive flag",
  "Limit delete permission on the region model",
  "Scheduled check for ids with no region entry",
  "Keep a global fallback region",
];

const redFlags: string[] = [
  "A locale in two regions resolves by entry order",
  "Entries without regionRef never appear",
  "Unpublished regions are invisible to the public API",
  "Region edits take a short time to appear (caching)",
  "Region codes (us, jp) differ from app locales (en-US)",
  "Fetching all regions per request won't scale to hundreds",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5">
      {items.map((item) => (
        <li key={item}>
          <Text variant="body-sm" as="span">{item}</Text>
        </li>
      ))}
    </ul>
  );
}

function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border bg-card p-5">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <Text variant="h5" as="span">
          {title}
          <span className="ml-2 text-muted-foreground group-open:hidden">+</span>
          <span className="ml-2 hidden text-muted-foreground group-open:inline">&minus;</span>
        </Text>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export default function RegionApproachNotes() {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="region-approach-heading">
      <div>
        <Text variant="h3" as="h2" id="region-approach-heading">
          Should you use this approach?
        </Text>
        <Text variant="body" className="mt-2">
          <strong>Yes, if regions are few and stable.</strong> The main risk is deleting a region
          that content still points to. Builder-specific behavior here is untested; verify it in
          a test model first.
        </Text>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {[pros, cons].map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>
                <Text variant="h5" as="h3">{section.title}</Text>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={section.items} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Text variant="h5" as="h3">If a referenced region is deleted</Text>
            <Badge variant="destructive">Biggest risk</Badge>
          </CardTitle>
          <Text variant="body-sm" color="muted">
            As we understand it, Builder doesn&rsquo;t block this.
          </Text>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <Text variant="label" as="p" className="mb-2">What happens</Text>
            <BulletList items={deletionEffects} />
          </div>
          <div>
            <Text variant="label" as="p" className="mb-2">What to do</Text>
            <BulletList items={deletionMitigations} />
          </div>
        </CardContent>
      </Card>

      <Collapsible title="Other red flags">
        <BulletList items={redFlags} />
      </Collapsible>

      <Collapsible title="Alternative for larger setups">
        <Text variant="body-sm" as="p">
          Store the locale directly on each content entry (e.g. `data.locale = &quot;jp&quot;`).
          That&rsquo;s one request and no reference to break, but no central locale list.
        </Text>
      </Collapsible>
    </section>
  );
}
