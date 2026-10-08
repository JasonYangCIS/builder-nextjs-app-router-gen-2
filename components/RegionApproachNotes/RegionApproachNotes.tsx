import { Text } from "@/components/ui/Text/Text";
import { Badge } from "@/components/ui/Badge/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import type { NoteSection } from "./RegionApproachNotes.types";

export type { NoteSection } from "./RegionApproachNotes.types";

const pros: NoteSection = {
  title: "Pros",
  items: [
    "Real structured data: a region entry can hold a locale list plus any other fields, which a custom targeting attribute can't.",
    "One source of truth: add a locale to a region once and every referencing entry picks it up.",
    "Editor-friendly: editors choose a region from a dropdown instead of typing codes.",
    "Simple query: filtering on data.regionRef.id is a plain field filter.",
    "Works with existing models: uses the normal page model and urlPath.",
  ],
};

const cons: NoteSection = {
  title: "Cons",
  items: [
    "Two requests per lookup (locale to region, then content), so cache the region list.",
    "No locale index: the API can't answer \"which region has jp?\", so you filter in app code.",
    "Content is tied to region ids, not names.",
    "One region per entry: shared content needs duplicates or a list field.",
    "Builder targeting and A/B tools aren't region-aware.",
  ],
};

const deletionEffects: string[] = [
  "Content entries keep the old id, so the id-based content query still matches them.",
  "The locale lookup fails because no region lists the locale any more.",
  "The failure is quiet: no error, and editors get no warning.",
  "Recreating the region gives it a new id, so existing references stay broken.",
];

const deletionMitigations: string[] = [
  "Never delete region entries; add an inactive flag and filter on it.",
  "Restrict delete permission on the region model to a few people.",
  "Run a scheduled check that flags regionRef ids with no matching region entry.",
  "Keep a default/global region so a failed lookup degrades gracefully.",
];

const redFlags: string[] = [
  "Overlapping locales: a locale in two regions resolves by entry order.",
  "Missing regionRef: entries without one never appear in any region.",
  "Unpublished regions are invisible to the public API, so content can seem to vanish.",
  "Caching: region edits take a short time to appear.",
  "Region codes (us, jp) differ from the app locales (en-US, es-ES).",
  "Fetching and filtering all regions per request doesn't scale to hundreds.",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5">
      {items.map((item) => (
        <li key={item}>
          <Text variant="body-sm" as="span">{item}</Text>
        </li>
      ))}
    </ul>
  );
}

export default function RegionApproachNotes() {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="region-approach-heading">
      <div>
        <Text variant="h3" as="h2" id="region-approach-heading">
          Trade-offs of the reference-field approach
        </Text>
        <Text variant="body-sm" color="muted" className="mt-2">
          Notes for using a `regionRef` reference field broadly. Builder-specific behavior (such
          as deletion) is untested; verify it in a test model first.
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
            <Text variant="h5" as="h3">Deleting a referenced region</Text>
            <Badge variant="destructive">Biggest risk</Badge>
          </CardTitle>
          <Text variant="body-sm" color="muted">
            As we understand Builder, it doesn&rsquo;t block deleting an entry that others
            reference.
          </Text>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <Text variant="label" as="p" className="mb-2">What happens</Text>
            <BulletList items={deletionEffects} />
          </div>
          <div>
            <Text variant="label" as="p" className="mb-2">How to reduce the risk</Text>
            <BulletList items={deletionMitigations} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Text variant="h5" as="h3">Other red flags</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BulletList items={redFlags} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Text variant="h5" as="h3">Recommendation</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Text variant="body-sm" as="p">
            Use this approach when regions are few and stable, and add guards: a global fallback
            region, no deletes, and an orphan check.
          </Text>
          <Text variant="body-sm" color="muted" as="p">
            With many regions or frequent edits, store the locale on each content entry instead
            (e.g. `data.locale = &quot;jp&quot;`): one request and no reference to break, but no
            central locale list.
          </Text>
        </CardContent>
      </Card>
    </section>
  );
}
