import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { FormInput } from "@/components/ui/form-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Counter from "@/components/Counter/Counter";

export const metadata: Metadata = {
  title: "Design System",
  description: "shadcn/ui component reference — new-york style",
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {children}
      </div>
    </section>
  );
}

function DemoRow({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      {label && (
        <div className="border-b border-border bg-muted px-5 py-2">
          <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
        </div>
      )}
      <div className={className ?? "flex flex-wrap items-end gap-4 px-5 py-5"}>
        {children}
      </div>
    </div>
  );
}

function DemoItem({
  label,
  children,
  align = "center",
}: {
  label: string;
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <div className={`flex flex-col gap-2 ${align === "center" ? "items-center" : "items-start"}`}>
      {children}
      <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "typography", label: "Text" },
  { id: "button",     label: "Button" },
  { id: "badge",      label: "Badge" },
  { id: "input",      label: "Input" },
  { id: "card",       label: "Card" },
  { id: "carousel",   label: "Carousel" },
  { id: "counter",    label: "Counter" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            shadcn/ui · new-york
          </span>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-foreground">
            Design System
          </h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Component reference powered by shadcn/ui (new-york style) with Geist fonts.
            WCAG 2.1 AA compliant.
          </p>
        </div>

        <div className="flex gap-10">

          {/* Sidebar */}
          <aside className="hidden lg:block w-40 shrink-0">
            <nav className="sticky top-8 flex flex-col">
              <p className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Components
              </p>
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="min-w-0 flex-1 space-y-12">

            {/* ── Text (Typography) ──────────────────────────────────────── */}
            <Section
              id="typography"
              title="Text"
              description="Thin wrapper over Tailwind typography classes. Uses the same variant API as the previous Typography component."
            >
              <div className="divide-y divide-border">
                {(
                  [
                    ["display",  "h1",   "The quick brown fox"],
                    ["h1",       "h1",   "The quick brown fox"],
                    ["h2",       "h2",   "The quick brown fox"],
                    ["h3",       "h3",   "The quick brown fox"],
                    ["h4",       "h4",   "The quick brown fox"],
                    ["h5",       "h5",   "The quick brown fox"],
                    ["h6",       "h6",   "The quick brown fox"],
                    ["body-lg",  "p",    "The quick brown fox jumps over the lazy dog."],
                    ["body",     "p",    "The quick brown fox jumps over the lazy dog."],
                    ["body-sm",  "p",    "The quick brown fox jumps over the lazy dog."],
                    ["caption",  "span", "Supplemental caption text"],
                    ["label",    "span", "Form field label"],
                    ["overline", "span", "Section overline"],
                  ] as const
                ).map(([variant, element, text]) => (
                  <div key={variant} className="flex items-baseline gap-4 px-5 py-3.5">
                    <div className="flex w-28 shrink-0 items-baseline gap-1.5">
                      <span className="font-mono text-[11px] text-muted-foreground">{variant}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Text variant={variant} text={text} />
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      &lt;{element}&gt;
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border bg-muted px-5 py-2">
                <span className="font-mono text-[11px] text-muted-foreground">color</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 px-5 py-5">
                {(["default", "muted", "subtle", "primary", "success", "warning", "error"] as const).map(
                  (color) => (
                    <DemoItem key={color} label={color}>
                      <Text variant="body-sm" color={color} text="Sample text" />
                    </DemoItem>
                  )
                )}
              </div>
            </Section>

            {/* ── Button ────────────────────────────────────────────────── */}
            <Section
              id="button"
              title="Button"
              description="shadcn/ui Button — new-york style. Six variants, four sizes."
            >
              <DemoRow label="variant">
                {(["default", "destructive", "outline", "secondary", "ghost", "link"] as const).map(
                  (variant) => (
                    <DemoItem key={variant} label={variant}>
                      <Button variant={variant}>
                        {variant === "destructive" ? "Delete" : "Button"}
                      </Button>
                    </DemoItem>
                  )
                )}
              </DemoRow>

              <DemoRow label="size">
                {(["sm", "default", "lg"] as const).map((size) => (
                  <DemoItem key={size} label={size}>
                    <Button size={size}>Button</Button>
                  </DemoItem>
                ))}
              </DemoRow>

              <DemoRow label="state">
                <DemoItem label="disabled · default">
                  <Button disabled>Disabled</Button>
                </DemoItem>
                <DemoItem label="disabled · outline">
                  <Button variant="outline" disabled>Disabled</Button>
                </DemoItem>
                <DemoItem label="disabled · ghost">
                  <Button variant="ghost" disabled>Disabled</Button>
                </DemoItem>
              </DemoRow>
            </Section>

            {/* ── Badge ─────────────────────────────────────────────────── */}
            <Section
              id="badge"
              title="Badge"
              description="shadcn/ui Badge. Four variants."
            >
              <DemoRow label="variant">
                {(["default", "secondary", "destructive", "outline"] as const).map((variant) => (
                  <DemoItem key={variant} label={variant}>
                    <Badge variant={variant}>{variant}</Badge>
                  </DemoItem>
                ))}
              </DemoRow>
            </Section>

            {/* ── Input ─────────────────────────────────────────────────── */}
            <Section
              id="input"
              title="Input"
              description="shadcn/ui Input wrapped with Label and helper text via FormInput."
            >
              <DemoRow label="default" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <FormInput label="Email address" placeholder="you@example.com" />
                <FormInput label="Search" type="search" placeholder="Search…" />
              </DemoRow>

              <DemoRow label="helperText" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  helperText="Min 8 characters with one uppercase letter and number."
                />
              </DemoRow>

              <DemoRow label="errorText" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <FormInput
                  label="Email address"
                  defaultValue="notanemail"
                  errorText="Please enter a valid email address."
                />
              </DemoRow>

              <DemoRow label="required" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <FormInput label="Full name" placeholder="Jane Smith" required />
              </DemoRow>

              <DemoRow label="disabled" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <FormInput label="Username" defaultValue="jsmith" disabled />
              </DemoRow>
            </Section>

            {/* ── Card ──────────────────────────────────────────────────── */}
            <Section
              id="card"
              title="Card"
              description="shadcn/ui Card with composition: CardHeader, CardContent, CardFooter, CardTitle, CardDescription."
            >
              <DemoRow label="default">
                <DemoItem label="Card" align="start">
                  <Card className="w-72">
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description goes here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Main content area.</p>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm">Action</Button>
                    </CardFooter>
                  </Card>
                </DemoItem>

                <DemoItem label="minimal" align="start">
                  <Card className="w-48 p-4 gap-2">
                    <p className="text-sm font-medium">Simple card</p>
                    <p className="text-xs text-muted-foreground">Just a box with border and shadow.</p>
                  </Card>
                </DemoItem>
              </DemoRow>
            </Section>

            {/* ── Carousel ──────────────────────────────────────────────── */}
            <Section
              id="carousel"
              title="Carousel"
              description="shadcn/ui Carousel powered by Embla Carousel. Keyboard accessible."
            >
              <DemoRow label="default">
                <div className="w-full px-12 py-6">
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                          <Card className="p-0 gap-0">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <span className="text-4xl font-bold text-muted-foreground">{i + 1}</span>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </DemoRow>
            </Section>

            {/* ── Counter ───────────────────────────────────────────────── */}
            <Section
              id="counter"
              title="Counter"
              description="Stateful counter widget using shadcn Button (outline, sm) internally."
            >
              <DemoRow label="default">
                <DemoItem label="initialCount=99">
                  <Counter />
                </DemoItem>
              </DemoRow>
              <DemoRow label="initialCount">
                <DemoItem label="initialCount=0">
                  <Counter initialCount={0} />
                </DemoItem>
                <DemoItem label="initialCount=10">
                  <Counter initialCount={10} />
                </DemoItem>
              </DemoRow>
            </Section>

          </main>
        </div>
      </div>
    </div>
  );
}
