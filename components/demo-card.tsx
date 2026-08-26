"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { RegistryDemo } from "@/registry/hirael/registry-demos";
import {
  CATEGORY_LABELS,
  entryHref,
  type RegistryEntryMeta,
} from "@/registry/hirael/registry-meta";

export const DemoCard = ({
  entry,
  className,
}: {
  entry: RegistryEntryMeta;
  className?: string;
}) => {
  const href = entryHref(entry);
  const [engaged, setEngaged] = React.useState(false);
  const hoverCapable = useHoverCapable();

  return (
    <article
      data-slot="demo-card"
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setEngaged(false);
        }
      }}
      className={cn(
        "group/card relative flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-foreground/30",
        className,
      )}
    >
      <LazyDemo
        name={entry.name}
        // Demos stay out of the tab order (and the a11y tree) until the card
        // is hovered or focused, so tabbing through an index of 60+ cards
        // walks titles instead of every mounted control.
        inert={!engaged && hoverCapable}
      />
      <div className="flex flex-col gap-1.5 border-t border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium tracking-[-0.01em]">
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
            >
              {entry.title}
            </Link>
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            {CATEGORY_LABELS[entry.category]}
          </span>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {entry.description}
        </p>
        <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover/card:text-foreground">
          View
          <ArrowRight className="size-3 transition-transform group-hover/card:translate-x-0.5 rtl:rotate-180" />
        </span>
      </div>
    </article>
  );
};

const PREVIEW_FRAME =
  "bg-dot-grid relative flex h-60 items-center justify-center overflow-hidden p-5";

const hoverQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : null;

const subscribeHover = (onChange: () => void) => {
  hoverQuery?.addEventListener("change", onChange);
  return () => hoverQuery?.removeEventListener("change", onChange);
};

/** True only on devices where hovering is the primary pointer interaction —
 * touch devices never inert their demos, since a tap should act immediately. */
const useHoverCapable = () => {
  return React.useSyncExternalStore(
    subscribeHover,
    () => hoverQuery?.matches ?? false,
    () => false,
  );
};

/**
 * Mounts the demo only once the card is near the viewport, so an index of 60+
 * cards doesn't pull every component chunk on page load.
 */
const LazyDemo = ({
  name,
  inert,
}: {
  name: string;
  inert: boolean;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || isNear) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsNear(true);
      },
      { rootMargin: "240px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNear]);

  return (
    <div ref={ref} inert={inert} className={PREVIEW_FRAME}>
      {/* The title link's ::after overlay covers the card; this layer sits
          above it so the demo itself stays interactive. */}
      <div className="relative z-10 flex max-h-full w-full items-center justify-center">
        {isNear && <RegistryDemo name={name} fallback={<DemoSkeleton />} />}
      </div>
    </div>
  );
};

const DemoSkeleton = () => {
  return (
    <div
      aria-hidden
      className="h-9 w-2/3 animate-pulse rounded-md bg-muted-foreground/10"
    />
  );
};
