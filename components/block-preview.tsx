'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useRegistryBase } from '@/components/active-theme';
import { observeShellHeight } from '@/components/preview-frame';
import { useDeferredMount } from '@/hooks/use-deferred-mount';
import { entryEmbedHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

// Static mode reports the block's own height. The iframe waits for a width so reveal animations start on screen,
// and for the page's load and the card nearing the viewport, since each preview boots a whole app on this thread.
const SIM_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const MIN_HEIGHT = 360;
const MAX_HEIGHT = 760;

/** Null until the element has a width, so nothing is scaled against a guess. */
const useElementWidth = (ref: React.RefObject<HTMLElement | null>) => {
  const [width, setWidth] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      if (element.clientWidth > 0) setWidth(element.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return width;
};

interface PreviewPlaceholderProps {
  title: string;
  isHidden: boolean;
}

const PreviewPlaceholder = ({ title, isHidden }: PreviewPlaceholderProps) => (
  <div
    aria-hidden
    className={cn(
      'absolute inset-0 flex items-center justify-center bg-dot-grid transition-opacity duration-500',
      isHidden ? 'pointer-events-none opacity-0' : 'opacity-100',
    )}
  >
    <span className="text-xs text-muted-foreground/70 uppercase">{title}</span>
  </div>
);

export interface BlockPreviewProps {
  entry: RegistryEntryMeta;
  simWidth?: number;
  className?: string;
  fill?: boolean;
}

export const BlockPreview = ({ entry, simWidth = SIM_WIDTH, className, fill = false }: BlockPreviewProps) => {
  const embedHref = entryEmbedHref(entry, useRegistryBase());
  const ref = React.useRef<HTMLDivElement>(null);
  const shellObserverRef = React.useRef<ResizeObserver | null>(null);
  const width = useElementWidth(ref);
  const [simHeight, setSimHeight] = React.useState(DEFAULT_HEIGHT);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const shouldMount = useDeferredMount(ref);

  React.useEffect(() => () => shellObserverRef.current?.disconnect(), []);

  const scale = width === null ? null : width / simWidth;

  const handleLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoaded(true);
    if (fill) return;
    shellObserverRef.current?.disconnect();
    // The document height never shrinks below the iframe, so the embed shell is measured instead.
    shellObserverRef.current = observeShellHeight(event.currentTarget, (shellHeight) =>
      setSimHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, shellHeight))),
    );
  };

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
      <PreviewPlaceholder title={entry.title} isHidden={isLoaded} />
      {shouldMount && scale !== null && (
        <iframe
          src={`${embedHref}?static=1`}
          title={`${entry.title} preview`}
          tabIndex={-1}
          aria-hidden
          onLoad={handleLoad}
          className={cn(
            'pointer-events-none absolute top-0 left-0 origin-top-left border-0 transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0',
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
