"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a block in a fixed-width iframe, scaled to fit the card. Card height
 * tracks content: `?static=1` drops the shell's `min-h-svh` (globals.css) so a
 * block reports its natural height, which is measured and clamped to size the
 * card — no dead space under short blocks. The iframe mounts only once the
 * width is known, so it never flashes and its content mounts visible (which
 * `whileInView` reveals need).
 */
const SIM_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const MIN_HEIGHT = 360;
const MAX_HEIGHT = 760;

export const BlockPreview = ({
  embedHref,
  title,
  simWidth = SIM_WIDTH,
}: {
  /** Path of the framed preview, e.g. `/embed/blocks/hero/hero-01`. */
  embedHref: string;
  title: string;
  simWidth?: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const contentRoRef = React.useRef<ResizeObserver | null>(null);
  const [width, setWidth] = React.useState<number | null>(null);
  const [simHeight, setSimHeight] = React.useState(DEFAULT_HEIGHT);
  const [loaded, setLoaded] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Disconnect the content observer when the card unmounts.
  React.useEffect(() => () => contentRoRef.current?.disconnect(), []);

  const scale = width === null ? null : width / simWidth;

  // Size the card to the block, tracking late reflow (fonts, images).
  function handleLoad(event: React.SyntheticEvent<HTMLIFrameElement>) {
    setLoaded(true);
    const doc = event.currentTarget.contentDocument;
    if (!doc) return;
    // Measure the shell, not `documentElement.scrollHeight` — the latter never
    // drops below the iframe viewport, so it always reads the full sim height.
    const target = doc.querySelector<HTMLElement>("[data-embed-shell]");
    if (!target) return;
    const measureHeight = () => {
      const h = target.getBoundingClientRect().height;
      if (h > 0) setSimHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, h)));
    };
    measureHeight();
    contentRoRef.current?.disconnect();
    const ro = new ResizeObserver(measureHeight);
    ro.observe(target);
    contentRoRef.current = ro;
  }

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden border-b border-border bg-card/30"
      style={{ aspectRatio: `${simWidth} / ${simHeight}` }}
    >
      <div
        aria-hidden
        className={cn(
          "bg-dot-grid absolute inset-0 flex items-center justify-center transition-opacity duration-500",
          loaded ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {title}
        </span>
      </div>
      {scale !== null && (
        <iframe
          src={`${embedHref}?static=1`}
          title={`${title} preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          onLoad={handleLoad}
          className={cn(
            "pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
          style={{
            width: `${simWidth}px`,
            height: `${simHeight}px`,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
};
