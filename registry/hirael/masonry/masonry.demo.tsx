"use client";

import { Masonry, MasonryItem } from "@/registry/hirael/ui/masonry";

const cards = [
  {
    title: "Drift",
    body: "A short note.",
  },
  {
    title: "Meridian",
    body: "Longer-form content stretches this card so the masonry has real height variance to balance across columns.",
  },
  {
    title: "Halcyon",
    body: "Two lines of copy, enough to sit between the extremes.",
  },
  {
    title: "Vantage",
    body: "Columns are filled by measured height, so reading order is preserved far better than CSS columns, which fill top-to-bottom one column at a time.",
  },
  {
    title: "Ember",
    body: "Compact.",
  },
  {
    title: "Lattice",
    body: "Items keep their identity across re-balances, so component state inside a card survives a column move.",
  },
  {
    title: "Sable",
    body: "Medium length card body that wraps onto a couple of lines at most widths.",
  },
];

const aspects = [
  "aspect-square",
  "aspect-[3/4]",
  "aspect-video",
  "aspect-[4/5]",
  "aspect-[3/2]",
  "aspect-[2/3]",
];

export default function MasonryDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Cards · default columns
        </p>
        <Masonry>
          {cards.map((card) => (
            <MasonryItem
              key={card.title}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-sm font-medium text-foreground">
                {card.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{card.body}</p>
            </MasonryItem>
          ))}
        </Masonry>
      </div>

      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Media · varied aspect ratios
        </p>
        <Masonry columns={{ base: 2, lg: 3 }} gap={8}>
          {aspects.map((aspect, i) => (
            <div
              key={aspect}
              className={`${aspect} flex items-end rounded-md bg-muted p-2`}
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </Masonry>
      </div>

      <div className="grid min-w-0 gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Compact · columns 2 / md 4
        </p>
        <Masonry columns={{ base: 2, md: 4 }} gap={8}>
          {[
            "Alpha",
            "Beta",
            "Gamma",
            "Delta",
            "Epsilon",
            "Zeta",
            "Eta",
            "Theta",
          ].map((label, i) => (
            <MasonryItem
              key={label}
              className="rounded-md border border-border bg-card px-3 py-2"
            >
              <p className="text-xs font-medium text-foreground">{label}</p>
              {i % 3 === 1 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Extra line for height variance.
                </p>
              ) : null}
            </MasonryItem>
          ))}
        </Masonry>
      </div>
    </div>
  );
}
