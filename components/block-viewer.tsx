'use client';

import * as React from 'react';
import { ExternalLink, Monitor, RefreshCw, Smartphone, Tablet } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { useRegistryBase } from '@/components/active-theme';
import { DirectionToggle } from '@/components/direction-toggle';
import { SegmentedControl } from '@/components/segmented-control';
import { entryEmbedHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

type Viewport = 'mobile' | 'tablet' | 'desktop';

const SIZES: Record<Viewport, { width: number; label: string }> = {
  mobile: { width: 380, label: 'Mobile' },
  tablet: { width: 768, label: 'Tablet' },
  desktop: { width: 0, label: 'Desktop' },
};

const ICONS: Record<Viewport, React.ComponentType<{ className?: string }>> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

const ORDER: Viewport[] = ['mobile', 'tablet', 'desktop'];

// Floor keeps a refresh from collapsing before the first measurement. Blocks get their natural height; full-page templates are capped and scroll internally instead of stretching the page.
const MIN_HEIGHT = 320;
const BLOCK_MAX_HEIGHT = 1200;
const TEMPLATE_MAX_HEIGHT = 700;

const observeShellHeight = (frame: HTMLIFrameElement, onHeight: (shellHeight: number) => void) => {
  const shell = frame.contentDocument?.querySelector<HTMLElement>('[data-embed-shell]');
  if (!shell) return null;
  const measure = () => {
    const shellHeight = Math.round(shell.getBoundingClientRect().height);
    if (shellHeight > 0) onHeight(shellHeight);
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(shell);
  return observer;
};

export interface BlockViewerProps {
  entry: RegistryEntryMeta;
  initialHeight?: number;
}

export const BlockViewer = ({ entry, initialHeight = TEMPLATE_MAX_HEIGHT }: BlockViewerProps) => {
  const title = entry.title;
  const embedHref = entryEmbedHref(entry, useRegistryBase());
  const maxHeight = entry.category === 'templates' ? TEMPLATE_MAX_HEIGHT : BLOCK_MAX_HEIGHT;
  const [viewport, setViewport] = React.useState<Viewport>('desktop');
  const [key, setKey] = React.useState(0);
  const [isRtl, setIsRtl] = React.useState(false);
  const [height, setHeight] = React.useState<number | null>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const shellObserverRef = React.useRef<ResizeObserver | null>(null);

  // `?fit=1` drops the embed shell's viewport min-height (globals.css) so the iframe can size to the block's natural height.
  const params = new URLSearchParams({ fit: '1' });
  if (isRtl) params.set('dir', 'rtl');
  const src = `${embedHref}?${params.toString()}`;

  const sizing =
    viewport === 'desktop'
      ? { width: '100%', maxWidth: '100%' }
      : { width: `${SIZES[viewport].width}px`, maxWidth: '100%' };

  const followShellHeight = (frame: HTMLIFrameElement) => {
    shellObserverRef.current?.disconnect();
    shellObserverRef.current = observeShellHeight(frame, (shellHeight) => {
      setHeight(Math.min(maxHeight, Math.max(MIN_HEIGHT, shellHeight)));
    });
  };

  // The frame can finish loading before React attaches `onLoad`, so also pick up an already-loaded frame after mount.
  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    shellObserverRef.current?.disconnect();
    shellObserverRef.current = observeShellHeight(frame, (shellHeight) => {
      setHeight(Math.min(maxHeight, Math.max(MIN_HEIGHT, shellHeight)));
    });
    return () => shellObserverRef.current?.disconnect();
  }, [key, src, maxHeight]);

  return (
    <div data-slot="block-viewer" className="overflow-hidden rounded-sm border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/50 px-3 py-2">
        <SegmentedControl
          role="tab"
          ariaLabel="Preview viewport"
          value={viewport}
          onValueChange={(v) => setViewport(v as Viewport)}
          className="rounded-sm border border-border bg-background p-0.5"
          itemClassName="h-6 rounded-[2px] px-2 text-[10px] uppercase tracking-widest"
          items={ORDER.map((v) => {
            const Icon = ICONS[v];
            return {
              value: v,
              ariaLabel: `${SIZES[v].label} viewport${v === 'desktop' ? '' : ` (${SIZES[v].width}px)`}`,
              label: (active: boolean) => (
                <>
                  <Icon className="size-3" />
                  <span className="hidden sm:inline">{SIZES[v].label}</span>
                  {v !== 'desktop' && active && (
                    <span className="tabular-nums text-muted-foreground">{SIZES[v].width}</span>
                  )}
                </>
              ),
            };
          })}
        />

        <div className="flex items-center gap-1">
          <DirectionToggle pressed={isRtl} onPressedChange={setIsRtl} className="me-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setKey((k) => k + 1)}
            aria-label="Refresh preview"
            className="size-7 rounded-sm text-muted-foreground"
          >
            <RefreshCw className="size-3.5" />
          </Button>
          <Button asChild variant="ghost" size="icon-sm" className="size-7 rounded-sm text-muted-foreground">
            <a href={src} target="_blank" rel="noopener noreferrer" aria-label="Open preview in new tab">
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <div className="bg-dot-grid flex justify-center overflow-x-auto bg-card/20 p-3 sm:p-4">
        <iframe
          key={key}
          ref={frameRef}
          src={src}
          title={`${title} preview`}
          loading="lazy"
          onLoad={(event) => followShellHeight(event.currentTarget)}
          className="block border-0 bg-background transition-[width,max-width] duration-300 ease-out"
          style={{
            ...sizing,
            height: height ?? initialHeight,
          }}
        />
      </div>
    </div>
  );
};
