import Link from "next/link";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { CATEGORY_REGISTRY } from "@/components/block-categories";
import { BLOCKS_BY_KIND } from "@/registry/hirael/registry-meta";

/* -------------------------------------------------------------------------- */
/* Schematic wireframe cards — each card previews the shape of its category.   */
/* Token-only (muted-foreground / primary / border at low opacity) so it       */
/* stays on the near-monochrome palette and works in both themes; RTL-safe     */
/* via logical properties.                                                     */
/* -------------------------------------------------------------------------- */

const CARD_SHELL =
  "group relative flex aspect-video size-full overflow-hidden rounded-lg border border-border bg-background transition-[transform,border-color,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-card hover:shadow-[0_14px_34px_-20px_color-mix(in_oklch,var(--foreground)_35%,transparent)] dark:bg-[radial-gradient(80%_100%_at_50%_0%,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent)]";

// Hirael's blueprint signature: a faint graph-paper grid masked to the four
// corners, framing each card like a registration plate. It brightens on hover.
// Turns the generic wireframe preview into a "spec plate" that reads as ours.
function BlueprintFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        aria-hidden
        className="blueprint-corners pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
      />
      <div className="relative z-10 size-full">{children}</div>
    </>
  );
}

function Label({
  title,
  count,
  center = false,
  className,
}: {
  title: string;
  count: number;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        center && "flex flex-col items-center text-center",
        className,
      )}
    >
      <h3 className="text-sm font-medium tracking-[-0.01em] md:text-[15px]">
        {title}
      </h3>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {count} block{count === 1 ? "" : "s"}
      </p>
    </div>
  );
}

// Faint placeholder bar — the building block of every schematic.
function Bar({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-full bg-muted-foreground/20", className)} />
  );
}

type SchematicProps = { title: string; count: number };

const SCHEMATICS: Record<string, React.ComponentType<SchematicProps>> = {
  hero: ({ title, count }) => (
    <div className="relative flex size-full flex-col items-center justify-center gap-2">
      <div className="absolute inset-y-0 start-5 w-px bg-linear-to-b from-transparent via-border to-border" />
      <div className="absolute inset-y-0 end-5 w-px bg-linear-to-b from-transparent via-border to-border" />
      <Label title={title} count={count} center />
      <div className="mt-1 grid grid-cols-2 gap-2">
        <div className="h-4 w-12 rounded bg-muted-foreground/15" />
        <div className="h-4 w-12 rounded bg-primary/20" />
      </div>
    </div>
  ),

  features: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-3 px-4">
      <Label title={title} count={count} center />
      <div className="grid grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1",
              i < 2 && "border-e border-border/60",
            )}
          >
            <div className="size-2 rounded-sm bg-primary/20" />
            <Bar className="h-1 w-6" />
            <Bar className="h-1 w-9 bg-muted-foreground/15" />
          </div>
        ))}
      </div>
    </div>
  ),

  pricing: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-3 px-4">
      <Label title={title} count={count} center />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md border p-2",
              i === 1 ? "border-primary/30 bg-primary/5" : "border-border/70",
            )}
          >
            <Bar className="h-1 w-5" />
            <div
              className={cn(
                "h-2.5 w-6 rounded-sm",
                i === 1 ? "bg-primary/25" : "bg-muted-foreground/15",
              )}
            />
            <Bar className="h-0.5 w-7 bg-muted-foreground/15" />
            <Bar className="h-0.5 w-7 bg-muted-foreground/15" />
          </div>
        ))}
      </div>
    </div>
  ),

  testimonials: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-2 px-5">
      <Label title={title} count={count} />
      <div className="flex flex-col gap-1.5 rounded-md border border-border/70 bg-card/40 p-3">
        <Bar className="h-1 w-full bg-muted-foreground/15" />
        <Bar className="h-1 w-5/6 bg-muted-foreground/15" />
        <div className="mt-1 flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-primary/20" />
          <Bar className="h-1 w-10" />
        </div>
      </div>
    </div>
  ),

  cta: ({ title, count }) => (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <Label title={title} count={count} center />
      <div className="w-full border-y border-border/70 px-4">
        <div className="grid grid-cols-2 border-x border-border/70">
          <div className="flex items-center border-e border-border/70 p-2">
            <Bar className="h-1 w-12 bg-muted-foreground/15" />
          </div>
          <div className="flex items-center gap-2 p-2">
            <div className="h-4 w-full rounded-sm bg-muted-foreground/15" />
            <div className="h-4 w-full rounded-sm bg-primary/25" />
          </div>
        </div>
      </div>
    </div>
  ),

  faqs: ({ title, count }) => (
    <div className="grid size-full grid-cols-2">
      <div className="flex flex-col justify-center border-e border-border/70 px-4">
        <Label title={title} count={count} />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex h-5 items-center border-b border-border/70 px-2">
          <Bar className="h-1 w-2/3" />
        </div>
        <div className="flex h-5 items-center border-b border-border/70 px-2">
          <Bar className="h-1 w-1/2" />
        </div>
        <div className="flex flex-col gap-1 border-b border-border/70 bg-card/50 px-2 py-1.5">
          <Bar className="h-1 w-3/4 bg-primary/25" />
          <Bar className="h-0.5 w-full bg-muted-foreground/10" />
          <Bar className="h-0.5 w-5/6 bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  ),

  auth: ({ title, count }) => (
    <div className="grid size-full grid-cols-2">
      <div className="flex flex-col justify-center border-e border-border/70 px-4">
        <Label title={title} count={count} />
      </div>
      <div className="flex flex-col justify-center gap-1.5 p-4">
        <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-muted-foreground/20" />
        <div className="h-2 w-full rounded-sm bg-muted-foreground/10" />
        <div className="h-2 w-full rounded-sm bg-muted-foreground/10" />
        <div className="mt-1 h-3 w-full rounded-sm bg-primary/25" />
      </div>
    </div>
  ),

  header: ({ title, count }) => (
    <div className="flex size-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-4 rounded-md border border-border/70 bg-card p-1.5 shadow-xs">
        <div className="size-3 rounded-full bg-primary/20" />
        <div className="flex gap-1">
          <Bar className="h-1.5 w-6" />
          <Bar className="h-1.5 w-6" />
          <Bar className="h-1.5 w-6" />
        </div>
        <div className="h-3.5 w-10 rounded-sm bg-primary/25" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <Label title={title} count={count} center />
      </div>
    </div>
  ),

  footer: ({ title, count }) => (
    <div className="flex size-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Label title={title} count={count} center />
      </div>
      <div className="mask-[linear-gradient(black,transparent)] border-t border-border/70 px-4">
        <div className="grid grid-cols-4 gap-3 border-x border-border/70 p-3">
          {[4, 4, 3, 1].map((rows, c) => (
            <div key={c} className="flex flex-col gap-1">
              <Bar className="mb-0.5 h-1 w-4 bg-primary/20" />
              {Array.from({ length: rows }).map((_, r) => (
                <Bar key={r} className="h-1 w-6" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  "not-found": ({ title, count }) => (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <span className="text-display text-3xl italic leading-none text-muted-foreground/30 md:text-4xl">
        404
      </span>
      <Label title={title} count={count} center />
      <div className="flex gap-2">
        <div className="h-3 w-10 rounded-sm bg-muted-foreground/15" />
        <div className="h-3 w-10 rounded-sm bg-primary/25" />
      </div>
    </div>
  ),

  blog: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-2 px-4">
      <Label title={title} count={count} />
      <div className="flex flex-col gap-1.5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md border border-border/60 p-1.5"
          >
            <div className="size-6 shrink-0 rounded-sm bg-muted-foreground/15" />
            <div className="flex flex-1 flex-col gap-1">
              <Bar className="h-1 w-3/4 bg-primary/20" />
              <Bar className="h-0.5 w-full bg-muted-foreground/12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  contact: ({ title, count }) => (
    <div className="grid size-full grid-cols-2 gap-3 p-4">
      <div className="flex flex-col justify-center gap-2">
        <Label title={title} count={count} />
        <Bar className="h-1.5 w-full" />
        <Bar className="h-1.5 w-2/3" />
      </div>
      <div className="flex flex-col gap-1.5 rounded-md border border-border/70 bg-background p-2 shadow-xs">
        <Bar className="h-1 w-8" />
        <div className="h-2.5 w-full rounded-sm border border-border/70 bg-muted/20" />
        <Bar className="h-1 w-8" />
        <div className="h-2.5 w-full rounded-sm border border-border/70 bg-muted/20" />
        <div className="mt-auto h-3 w-full rounded-sm bg-primary/25" />
      </div>
    </div>
  ),

  ecommerce: ({ title, count }) => (
    <div className="grid size-full grid-cols-2 gap-3 p-4">
      <div className="flex flex-col justify-center">
        <Label title={title} count={count} />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-sm border border-border/60 p-1"
          >
            <div className="h-4 rounded-xs bg-muted-foreground/12" />
            <Bar className="h-0.5 w-2/3 bg-primary/20" />
          </div>
        ))}
      </div>
    </div>
  ),

  "image-gallery": ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-2 px-4">
      <Label title={title} count={count} center />
      <div className="grid grid-cols-4 grid-rows-2 gap-1">
        {["row-span-2", "", "", "row-span-2", "", "col-span-2", ""].map(
          (span, i) => (
            <div
              key={i}
              className={cn("rounded-sm bg-muted-foreground/12", span)}
              style={{ minHeight: 12 }}
            />
          ),
        )}
      </div>
    </div>
  ),

  integrations: ({ title, count }) => (
    <div className="grid size-full grid-cols-2 items-center px-5">
      <Label title={title} count={count} />
      <div className="relative mx-auto size-20">
        <div className="absolute start-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-border rtl:translate-x-1/2" />
        <div className="absolute start-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-border rtl:translate-x-1/2" />
        <div className="absolute inset-0 z-10 m-auto size-6 rounded-full border border-border bg-card shadow-xs" />
        <div className="absolute start-0 top-0 z-10 size-4 rounded-md bg-muted" />
        <div className="absolute end-0 top-0 z-10 size-4 rounded-md bg-muted" />
        <div className="absolute bottom-0 start-0 z-10 size-4 rounded-md bg-muted" />
        <div className="absolute bottom-0 end-0 z-10 size-4 rounded-md bg-muted" />
      </div>
    </div>
  ),

  "logo-cloud": ({ title, count }) => (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <Label title={title} count={count} center />
      <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] mx-auto h-px w-1/2 bg-border" />
      <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] flex w-full items-center gap-2 overflow-hidden px-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-12 shrink-0 rounded-xs bg-muted-foreground/12"
          />
        ))}
      </div>
      <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] h-px w-full bg-border" />
    </div>
  ),

  "app-shell": ({ title, count }) => (
    <div className="flex size-full">
      <div className="w-1/5 border-e border-border/70 p-1.5">
        <div className="mb-2 h-2 w-full rounded-full bg-muted-foreground/20" />
        <div className="flex flex-col gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bar key={i} className="h-1 w-full bg-muted-foreground/15" />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-4 items-center justify-between border-b border-border/70 px-2">
          <div className="size-1.5 rounded-xs bg-muted-foreground/25" />
          <div className="h-1.5 w-5 rounded-xs border border-border/70" />
        </div>
        <div className="flex flex-col gap-1 p-2">
          <Label title={title} count={count} />
          <div className="mt-1 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 rounded-xs border border-border/70" />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),

  dashboard: ({ title, count }) => (
    <div className="flex size-full">
      <div className="w-[12%] border-e border-border/70 p-1">
        <div className="mb-1.5 h-1.5 w-full rounded-full bg-muted-foreground/25" />
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bar key={i} className="h-1 w-full bg-muted-foreground/15" />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <Label title={title} count={count} />
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5 rounded-sm border border-border/60 p-1"
            >
              <Bar className="h-0.5 w-2/3" />
              <Bar className="h-1.5 w-full bg-muted-foreground/12" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-0.5">
          {[5, 7, 4, 8, 6, 9, 5, 7, 10, 6].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-xs bg-linear-to-b from-muted-foreground/25 to-muted-foreground/5"
              style={{ height: `${h * 9}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  ),

  cloud: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-2 px-4">
      <Label title={title} count={count} />
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square rounded-[2px]",
              i % 7 === 0
                ? "bg-primary/30"
                : i % 5 === 0
                  ? "bg-muted-foreground/25"
                  : "bg-muted-foreground/12",
            )}
          />
        ))}
      </div>
    </div>
  ),

  saas: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-2 px-5">
      <Label title={title} count={count} />
      <div className="flex flex-col gap-1.5 rounded-md border border-border/70 bg-card/40 p-2.5">
        <div className="flex items-center justify-between">
          <Bar className="h-1 w-10 bg-primary/20" />
          <Bar className="h-2 w-6 bg-muted-foreground/20" />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted-foreground/12">
          <div className="h-full w-2/3 rounded-full bg-primary/30" />
        </div>
        <Bar className="h-0.5 w-full bg-muted-foreground/10" />
        <div className="mt-0.5 h-3 w-full rounded-sm bg-primary/25" />
      </div>
    </div>
  ),

  widgets: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-2 px-4">
      <Label title={title} count={count} center />
      <div className="grid grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-sm border border-border/60 p-1.5"
          >
            <Bar className="h-0.5 w-2/3" />
            <Bar className="h-1.5 w-1/2 bg-muted-foreground/15" />
            <svg
              viewBox="0 0 40 10"
              className="h-2 w-full text-primary/30"
              preserveAspectRatio="none"
              aria-hidden
            >
              <polyline
                points="0,8 8,5 16,6 24,3 32,4 40,1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  ),

  process: ({ title, count }) => (
    <div className="flex size-full flex-col items-center justify-center gap-3 px-4">
      <Label title={title} count={count} center />
      <div className="flex w-4/5 items-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("flex items-center", i < 2 && "flex-1")}>
            <span className="flex size-5 items-center justify-center rounded-full border border-border bg-card">
              <span className="block size-1.5 rounded-full bg-primary/35" />
            </span>
            {i < 2 ? <span className="h-px flex-1 bg-border" /> : null}
          </div>
        ))}
      </div>
    </div>
  ),

  comparison: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-3 px-4">
      <Label title={title} count={count} center />
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1 rounded-md border border-primary/30 bg-primary/5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="size-1.5 shrink-0 rounded-full bg-primary/40" />
              <Bar className="h-1 w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-border/70 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-px w-1.5 shrink-0 bg-muted-foreground/40" />
              <Bar className="h-1 w-full bg-muted-foreground/12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  newsletter: ({ title, count }) => (
    <div className="flex size-full flex-col items-center justify-center gap-2.5 px-4">
      <Label title={title} count={count} center />
      <div className="flex w-3/4 items-center gap-1.5">
        <div className="h-4 flex-1 rounded-sm border border-border/70 bg-muted/20" />
        <div className="h-4 w-10 rounded-sm bg-primary/25" />
      </div>
    </div>
  ),

  careers: ({ title, count }) => (
    <div className="flex size-full flex-col justify-center gap-2 px-5">
      <Label title={title} count={count} />
      <div className="flex flex-col gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2 py-1.5"
          >
            <div className="flex flex-col gap-1">
              <Bar className="h-1 w-16 bg-primary/20" />
              <Bar className="h-0.5 w-10 bg-muted-foreground/12" />
            </div>
            <span className="size-2.5 rounded-full border border-border/70" />
          </div>
        ))}
      </div>
    </div>
  ),
};

function GenericSchematic({ title, count }: SchematicProps) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-2 px-4">
      <Label title={title} count={count} center />
      <div className="flex w-2/3 flex-col gap-1.5">
        <Bar className="h-1.5 w-full bg-muted-foreground/15" />
        <Bar className="h-1.5 w-2/3 bg-muted-foreground/15" />
      </div>
    </div>
  );
}

export function BlockShowcase() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {CATEGORY_REGISTRY.map((cat) => {
        const count = cat.blockKind ? BLOCKS_BY_KIND[cat.blockKind].length : 0;
        const Schematic = SCHEMATICS[cat.slug] ?? GenericSchematic;
        return (
          <Link
            key={cat.slug}
            href={`/blocks/${cat.slug}`}
            aria-label={`Browse ${cat.title} blocks`}
            className={CARD_SHELL}
          >
            <BlueprintFrame>
              <Schematic title={cat.title} count={count} />
            </BlueprintFrame>
          </Link>
        );
      })}
    </div>
  );
}
