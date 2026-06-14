"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type MasonryColumns = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

export type MasonryProps = React.ComponentProps<"div"> & {
  /** Column count, fixed or responsive per Tailwind breakpoint. */
  columns?: number | MasonryColumns;
  /** Gap in pixels, applied on both axes. */
  gap?: number;
};

function roundRobin(itemCount: number, columnCount: number) {
  const next: number[][] = Array.from({ length: columnCount }, () => []);
  for (let i = 0; i < itemCount; i++) next[i % columnCount].push(i);
  return next;
}

function sameAssignment(a: number[][] | null, b: number[][]) {
  if (!a || a.length !== b.length) return false;
  for (let c = 0; c < a.length; c++) {
    if (a[c].length !== b[c].length) return false;
    for (let i = 0; i < a[c].length; i++) {
      if (a[c][i] !== b[c][i]) return false;
    }
  }
  return true;
}

function Masonry({
  columns = { base: 1, sm: 2, lg: 3 },
  gap = 16,
  className,
  style,
  children,
  ...props
}: MasonryProps) {
  const base = typeof columns === "number" ? columns : (columns.base ?? 1);
  const sm = typeof columns === "number" ? null : (columns.sm ?? null);
  const md = typeof columns === "number" ? null : (columns.md ?? null);
  const lg = typeof columns === "number" ? null : (columns.lg ?? null);
  const xl = typeof columns === "number" ? null : (columns.xl ?? null);

  const childArray = React.Children.toArray(children);
  const itemCount = childArray.length;

  // SSR and first paint use the base column count with round-robin order
  // so server and client markup match; measurement re-balances after mount.
  const [columnCount, setColumnCount] = React.useState(() => Math.max(1, base));
  const [assignment, setAssignment] = React.useState<number[][] | null>(null);

  const heightsRef = React.useRef(new Map<number, number>());
  const nodesRef = React.useRef(new Map<number, HTMLDivElement>());
  const itemRefsRef = React.useRef(
    new Map<number, (node: HTMLDivElement | null) => void>(),
  );
  const observerRef = React.useRef<ResizeObserver | null>(null);
  const rafRef = React.useRef(0);
  const scheduleRef = React.useRef<() => void>(() => {});

  React.useEffect(() => {
    const resolve = (width: number) => {
      let count = base;
      if (width >= 640 && sm != null) count = sm;
      if (width >= 768 && md != null) count = md;
      if (width >= 1024 && lg != null) count = lg;
      if (width >= 1280 && xl != null) count = xl;
      return Math.max(1, count);
    };
    const update = () => setColumnCount(resolve(window.innerWidth));
    update();
    const queries = [640, 768, 1024, 1280].map((bp) =>
      window.matchMedia(`(min-width: ${bp}px)`),
    );
    for (const query of queries) query.addEventListener("change", update);
    return () => {
      for (const query of queries) query.removeEventListener("change", update);
    };
  }, [base, sm, md, lg, xl]);

  React.useEffect(() => {
    const compute = () => {
      const heights = heightsRef.current;
      const totals = new Array<number>(columnCount).fill(0);
      const next: number[][] = Array.from({ length: columnCount }, () => []);
      for (let i = 0; i < itemCount; i++) {
        let target = 0;
        for (let c = 1; c < columnCount; c++) {
          if (totals[c] < totals[target]) target = c;
        }
        next[target].push(i);
        totals[target] += (heights.get(i) ?? 0) + gap;
      }
      setAssignment((prev) => (sameAssignment(prev, next) ? prev : next));
    };
    const schedule = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };
    scheduleRef.current = schedule;

    const observer = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const index = Number(
          (entry.target as HTMLElement).dataset.masonryIndex,
        );
        if (Number.isNaN(index)) continue;
        const height =
          entry.borderBoxSize?.[0]?.blockSize ??
          entry.target.getBoundingClientRect().height;
        if (heightsRef.current.get(index) !== height) {
          heightsRef.current.set(index, height);
          changed = true;
        }
      }
      if (changed) schedule();
    });
    observerRef.current = observer;
    for (const node of nodesRef.current.values()) observer.observe(node);
    schedule();

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      observerRef.current = null;
    };
  }, [columnCount, gap, itemCount]);

  const getItemRef = (index: number) => {
    let callback = itemRefsRef.current.get(index);
    if (!callback) {
      callback = (node: HTMLDivElement | null) => {
        const prev = nodesRef.current.get(index);
        if (prev && observerRef.current) observerRef.current.unobserve(prev);
        if (node) {
          nodesRef.current.set(index, node);
          observerRef.current?.observe(node);
        } else {
          nodesRef.current.delete(index);
          heightsRef.current.delete(index);
        }
      };
      itemRefsRef.current.set(index, callback);
    }
    return callback;
  };

  const distribution =
    assignment &&
    assignment.length === columnCount &&
    assignment.reduce((n, col) => n + col.length, 0) === itemCount
      ? assignment
      : roundRobin(itemCount, columnCount);

  return (
    <div
      data-slot="masonry"
      style={{ ...style, gap: `${gap}px` }}
      className={cn("flex w-full min-w-0 items-start", className)}
      {...props}
    >
      {distribution.map((columnIndices, column) => (
        <div
          key={column}
          data-slot="masonry-column"
          style={{ gap: `${gap}px` }}
          className="flex min-w-0 flex-1 flex-col"
        >
          {columnIndices.map((index) => {
            const child = childArray[index];
            const key =
              React.isValidElement(child) && child.key != null
                ? child.key
                : index;
            return (
              <div
                key={key}
                ref={getItemRef(index)}
                data-slot="masonry-item-wrapper"
                data-masonry-index={index}
                className="min-w-0"
              >
                {child}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MasonryItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="masonry-item"
      className={cn("min-w-0", className)}
      {...props}
    />
  );
}

export { Masonry, MasonryItem };
