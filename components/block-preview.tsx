'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useRegistryBase } from '@/components/active-theme';
import { entryEmbedHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

// `?static=1` drops the embed shell's `min-h-svh` (globals.css) so the block reports its natural height.
// The iframe mounts only once the width is known so its content mounts visible, which `whileInView` reveals need.
const SIM_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const MIN_HEIGHT = 360;
const MAX_HEIGHT = 760;

export interface BlockPreviewProps {
  entry: RegistryEntryMeta;
  simWidth?: number;
  className?: string;
  fill?: boolean;
}

export const BlockPreview = ({ entry, simWidth = SIM_WIDTH, className, fill = false }: BlockPreviewProps) => {
  const title = entry.title;
  const embedHref = entryEmbedHref(entry, useRegistryBase());
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

  React.useEffect(() => () => contentRoRef.current?.disconnect(), []);

  const scale = width === null ? null : width / simWidth;

  function handleLoad(event: React.SyntheticEvent<HTMLIFrameElement>) {
    setLoaded(true);
    if (fill) return;
    const doc = event.currentTarget.contentDocument;
    if (!doc) return;
    // Not `documentElement.scrollHeight`: it never drops below the iframe viewport, so it always reads the full sim height.
    const target = doc.querySelector<HTMLElement>('[data-embed-shell]');
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
      className={cn(
        'relative overflow-hidden bg-card/30',
        fill ? 'size-full' : 'w-full border-b border-border',
        className,
      )}
      style={fill ? undefined : { aspectRatio: `${simWidth} / ${simHeight}` }}
    >
      <div
        aria-hidden
        className={cn(
          'bg-dot-grid absolute inset-0 flex items-center justify-center transition-opacity duration-500',
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <span className="text-xs uppercase text-muted-foreground/70">{title}</span>
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
            'pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
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
