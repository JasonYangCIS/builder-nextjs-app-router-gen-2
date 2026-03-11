import type { Metadata } from "next";
import { Button } from "@/components/design-system/Button/Button";
import { Typography } from "@/components/design-system/Typography/Typography";
import { Badge } from "@/components/design-system/Badge/Badge";
import { Input } from "@/components/design-system/Input/Input";
import { Card } from "@/components/design-system/Card/Card";
import Counter from "@/components/Counter/Counter";

export const metadata: Metadata = {
  title: "Design System",
  description: "Component library and design token reference",
};

// ─── Layout helpers ──────────────────────────────────────────────────────────

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
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
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
    <div className="border-b border-zinc-100 last:border-b-0">
      {label && (
        <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-2">
          <span className="font-mono text-[11px] text-zinc-500">{label}</span>
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
      <span className="font-mono text-[11px] text-zinc-500">{label}</span>
    </div>
  );
}

// ─── Token helpers ────────────────────────────────────────────────────────────

function ColorSwatch({ token, label }: { token: string; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="h-9 w-9 rounded-lg ring-1 ring-inset ring-black/10"
        style={{ backgroundColor: `var(${token})` }}
        title={token}
      />
      <span className="font-mono text-[10px] text-zinc-500">{label}</span>
    </div>
  );
}

function ColorScale({ name, shades }: { name: string; shades: number[] }) {
  return (
    <div>
      <p className="mb-2.5 font-mono text-xs font-medium text-zinc-500">{name}</p>
      <div className="flex flex-wrap gap-2">
        {shades.map((shade) => (
          <ColorSwatch
            key={shade}
            token={`--color-${name}-${shade}`}
            label={String(shade)}
          />
        ))}
      </div>
    </div>
  );
}

function StatusRow({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-16 font-mono text-xs text-zinc-500">{name}</span>
      <div className="flex gap-2">
        {[50, 100, 600, 700].map((shade) => (
          <ColorSwatch
            key={shade}
            token={`--color-${name}-${shade}`}
            label={String(shade)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "tokens",     label: "Tokens" },
  { id: "gradients",  label: "Gradients" },
  { id: "typography", label: "Typography" },
  { id: "button",     label: "Button" },
  { id: "badge",      label: "Badge" },
  { id: "input",      label: "Input" },
  { id: "card",       label: "Card" },
  { id: "counter",    label: "Counter" },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Page header */}
        <div className="mb-10">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
            v1.0
          </span>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-900">
            Design System
          </h1>
          <p className="mt-2 max-w-lg text-sm text-zinc-500">
            Component library and design token reference. Built with Tailwind CSS. WCAG 2.1 AA compliant.
          </p>
        </div>

        <div className="flex gap-10">

          {/* Sidebar */}
          <aside className="hidden lg:block w-40 shrink-0">
            <nav className="sticky top-8 flex flex-col">
              <p className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Components
              </p>
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1 space-y-12">

            {/* ── Tokens ─────────────────────────────────────────────────── */}
            <Section
              id="tokens"
              title="Color Tokens"
              description="Reference via CSS custom properties (var(--color-brand-600)) or Tailwind utilities (bg-brand-600)."
            >
              <div className="flex flex-col gap-6 p-5">
                <ColorScale
                  name="brand"
                  shades={[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]}
                />
                <ColorScale
                  name="accent"
                  shades={[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]}
                />
                <div className="flex flex-col gap-3">
                  <StatusRow name="success" />
                  <StatusRow name="warning" />
                  <StatusRow name="error" />
                </div>
              </div>
            </Section>

            {/* ── Gradients ──────────────────────────────────────────────── */}
            <Section
              id="gradients"
              title="Gradients"
              description="Pre-built gradient utilities from styles/tokens.css. Apply as className values."
            >
              {[
                {
                  cls: "gradient-brand",
                  label: "gradient-brand",
                  desc: "Primary — indigo → violet. CTAs, active states.",
                  dark: true,
                },
                {
                  cls: "gradient-brand-subtle",
                  label: "gradient-brand-subtle",
                  desc: "Subtle wash — section backgrounds, card tints.",
                  dark: false,
                },
                {
                  cls: "gradient-brand-dark",
                  label: "gradient-brand-dark",
                  desc: "Dark — hero sections, banners.",
                  dark: true,
                },
                {
                  cls: "gradient-mesh",
                  label: "gradient-mesh",
                  desc: "Mesh — multi-stop radial. Hero backgrounds.",
                  dark: true,
                },
              ].map(({ cls, label, desc, dark }) => (
                <div key={cls} className="border-b border-zinc-100 last:border-b-0">
                  <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-2">
                    <span className="font-mono text-[11px] text-zinc-500">{label}</span>
                  </div>
                  <div className="flex items-center gap-6 px-5 py-5">
                    <div className={`${cls} h-20 w-52 shrink-0 rounded-xl`} />
                    <p className="text-sm text-zinc-500">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Text gradient */}
              <div className="border-b border-zinc-100 last:border-b-0">
                <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-2">
                  <span className="font-mono text-[11px] text-zinc-500">gradient-brand-text</span>
                </div>
                <div className="flex items-center gap-6 px-5 py-5">
                  <p className="gradient-brand-text shrink-0 text-3xl font-bold">
                    Hello World
                  </p>
                  <p className="text-sm text-zinc-500">
                    Text gradient — headings, display type.
                  </p>
                </div>
              </div>
            </Section>

            {/* ── Typography ─────────────────────────────────────────────── */}
            <Section
              id="typography"
              title="Typography"
              description="All variants default to a semantic HTML element. Override with the as prop."
            >
              <div className="divide-y divide-zinc-100">
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
                      <span className="font-mono text-[11px] text-zinc-500">{variant}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography variant={variant} text={text} />
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-zinc-500">
                      &lt;{element}&gt;
                    </span>
                  </div>
                ))}
              </div>

              {/* Color row */}
              <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-2">
                <span className="font-mono text-[11px] text-zinc-500">color</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 px-5 py-5">
                {(
                  ["default", "muted", "subtle", "primary", "success", "warning", "error"] as const
                ).map((color) => (
                  <DemoItem key={color} label={color}>
                    <Typography variant="body-sm" color={color} text="Sample text" />
                  </DemoItem>
                ))}
              </div>
            </Section>

            {/* ── Button ─────────────────────────────────────────────────── */}
            <Section
              id="button"
              title="Button"
              description="Four semantic variants across three sizes. Includes loading and disabled states."
            >
              <DemoRow label="variant">
                {(["primary", "secondary", "ghost", "destructive"] as const).map((variant) => (
                  <DemoItem key={variant} label={variant}>
                    <Button
                      variant={variant}
                      label={variant === "destructive" ? "Delete" : "Button"}
                    />
                  </DemoItem>
                ))}
              </DemoRow>

              <DemoRow label="size">
                {(["sm", "md", "lg"] as const).map((size) => (
                  <DemoItem key={size} label={size}>
                    <Button size={size} label="Button" />
                  </DemoItem>
                ))}
              </DemoRow>

              <DemoRow label="state">
                <DemoItem label="loading">
                  <Button loading label="Saving…" />
                </DemoItem>
                <DemoItem label="disabled · primary">
                  <Button disabled label="Disabled" />
                </DemoItem>
                <DemoItem label="disabled · secondary">
                  <Button variant="secondary" disabled label="Disabled" />
                </DemoItem>
                <DemoItem label="disabled · ghost">
                  <Button variant="ghost" disabled label="Disabled" />
                </DemoItem>
              </DemoRow>
            </Section>

            {/* ── Badge ──────────────────────────────────────────────────── */}
            <Section
              id="badge"
              title="Badge"
              description="Non-interactive label for status and categorisation."
            >
              <DemoRow label="variant · size=md">
                {(["neutral", "primary", "success", "warning", "error"] as const).map((variant) => (
                  <DemoItem key={variant} label={variant}>
                    <Badge variant={variant} label={variant} />
                  </DemoItem>
                ))}
              </DemoRow>

              <DemoRow label="variant · size=sm">
                {(["neutral", "primary", "success", "warning", "error"] as const).map((variant) => (
                  <DemoItem key={variant} label={variant}>
                    <Badge variant={variant} size="sm" label={variant} />
                  </DemoItem>
                ))}
              </DemoRow>
            </Section>

            {/* ── Input ──────────────────────────────────────────────────── */}
            <Section
              id="input"
              title="Input"
              description="Text input with label, helper text, and accessible validation states."
            >
              <DemoRow label="default" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <Input label="Email address" placeholder="you@example.com" />
                <Input label="Search" type="search" placeholder="Search…" />
              </DemoRow>

              <DemoRow label="helperText" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  helperText="Min 8 characters with one uppercase letter and number."
                />
              </DemoRow>

              <DemoRow label="errorText" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <Input
                  label="Email address"
                  defaultValue="notanemail"
                  errorText="Please enter a valid email address."
                />
              </DemoRow>

              <DemoRow label="required" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <Input label="Full name" placeholder="Jane Smith" required />
              </DemoRow>

              <DemoRow label="disabled" className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
                <Input label="Username" defaultValue="jsmith" disabled />
              </DemoRow>
            </Section>

            {/* ── Card ───────────────────────────────────────────────────── */}
            <Section
              id="card"
              title="Card"
              description="Container for grouping related content. Accepts child components in Builder."
            >
              <DemoRow label="shadow">
                {(["none", "sm", "md", "lg"] as const).map((shadow) => (
                  <DemoItem key={shadow} label={`shadow="${shadow}"`} align="start">
                    <Card shadow={shadow} className="w-44">
                      <p className="text-sm font-medium text-zinc-800">Card title</p>
                      <p className="mt-1 text-sm text-zinc-500">Supporting text content.</p>
                    </Card>
                  </DemoItem>
                ))}
              </DemoRow>

              <DemoRow label="padding">
                {(["none", "sm", "md", "lg"] as const).map((padding) => (
                  <DemoItem key={padding} label={`padding="${padding}"`} align="start">
                    <Card
                      padding={padding}
                      shadow="none"
                      className="w-36 border-2 border-dashed border-zinc-300"
                    >
                      <div className="rounded bg-zinc-100 py-2 text-center font-mono text-xs text-zinc-500">
                        content
                      </div>
                    </Card>
                  </DemoItem>
                ))}
              </DemoRow>

              <DemoRow label="borderless">
                <DemoItem label='borderless shadow="md"' align="start">
                  <Card borderless shadow="md" className="w-56">
                    <p className="text-sm font-medium text-zinc-800">Floating card</p>
                    <p className="mt-1 text-sm text-zinc-500">No border, elevated with shadow.</p>
                  </Card>
                </DemoItem>
              </DemoRow>
            </Section>

            {/* ── Counter ────────────────────────────────────────────────── */}
            <Section
              id="counter"
              title="Counter"
              description="Stateful counter widget. Uses Button (secondary, sm) internally."
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
