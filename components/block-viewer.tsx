'use client';

import * as React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

import { useRegistryBase } from '@/components/active-theme';
import { DirectionToggle } from '@/components/direction-toggle';
import { InstallBlock } from '@/components/install-block';
import {
  PreviewFrame,
  PreviewMoreMenu,
  PreviewOpenButton,
  PreviewRefreshButton,
  PreviewThemeButton,
  PreviewZoomMenu,
  previewSrc,
  type PreviewZoom,
  usePreviewTheme,
} from '@/components/preview-frame';
import { SegmentedControl } from '@/components/segmented-control';
import { entryEmbedHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

type Viewport = 'mobile' | 'tablet' | 'desktop';

const SIZES: Record<Viewport, { width: number; label: string }> = {
  mobile: { width: 380, label: 'Mobile' },
  tablet: { width: 768, label: 'Tablet' },
  desktop: { width: 1280, label: 'Desktop' },
};

const ICONS: Record<Viewport, React.ComponentType<{ className?: string }>> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

const ORDER: Viewport[] = ['mobile', 'tablet', 'desktop'];

// A floor keeps a refresh from collapsing the frame. Templates are capped so they scroll instead of stretching the page.
const MIN_HEIGHT = 320;
const BLOCK_MAX_HEIGHT = 1200;
const TEMPLATE_MAX_HEIGHT = 700;

export interface BlockViewerProps {
  entry: RegistryEntryMeta;
  initialHeight?: number;
  /** Load the preview with the page, for a page about this one item. */
  eager?: boolean;
}

export const BlockViewer = ({ entry, initialHeight = TEMPLATE_MAX_HEIGHT, eager = false }: BlockViewerProps) => {
  const embedHref = entryEmbedHref(entry, useRegistryBase());
  const maxHeight = entry.category === 'templates' ? TEMPLATE_MAX_HEIGHT : BLOCK_MAX_HEIGHT;
  const [viewport, setViewport] = React.useState<Viewport>('desktop');
  const [key, setKey] = React.useState(0);
  const [isRtl, setIsRtl] = React.useState(false);
  const previewTheme = usePreviewTheme();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = React.useState(0);
  const [frameHeight, setFrameHeight] = React.useState<number | null>(null);
  const [zoom, setZoom] = React.useState<PreviewZoom>('fit');

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([item]) => setStageWidth(item.contentRect.width));
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  const src = previewSrc(embedHref, { theme: previewTheme.previewMode, isRtl });

  // The frame keeps the viewport's real width so the block hits its own breakpoints, then shrinks to fit the page.
  const width = SIZES[viewport].width;
  const fitScale = stageWidth > 0 ? Math.min(1, stageWidth / width) : 1;
  const scale = zoom === 'fit' ? fitScale : zoom / 100;
  const visibleHeight = (frameHeight ?? initialHeight / scale) * scale;

  return (
    <div data-slot="block-viewer" className="overflow-hidden rounded-sm border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/50 px-3 py-2">
        <SegmentedControl
          role="tab"
          ariaLabel="Preview viewport"
          value={viewport}
          onValueChange={(v) => setViewport(v as Viewport)}
          className="rounded-sm border border-border bg-background p-0.5"
          itemClassName="h-6 rounded-[2px] px-2 text-xs uppercase"
          items={ORDER.map((v) => {
            const Icon = ICONS[v];

            return {
              value: v,
              ariaLabel: `${SIZES[v].label} viewport (${SIZES[v].width}px)`,
              label: () => (
                <>
                  <Icon className="size-3" />
                  <span className="hidden sm:inline">{SIZES[v].label}</span>
                </>
              ),
            };
          })}
        />

        <div className="flex items-center gap-1">
          <PreviewZoomMenu value={zoom} onValueChange={setZoom} fitPercent={Math.round(fitScale * 100)} />
          <DirectionToggle pressed={isRtl} onPressedChange={setIsRtl} className="me-1" />
          <PreviewThemeButton theme={previewTheme} />
          <PreviewRefreshButton onRefresh={() => setKey((k) => k + 1)} />
          <PreviewOpenButton href={src} />

          <PreviewMoreMenu entry={entry} />
        </div>
      </div>

      <div ref={stageRef} className="flex justify-center-safe overflow-x-auto bg-card/20 bg-dot-grid p-3 sm:p-4">
        <div className="shrink-0 overflow-hidden" style={{ width: width * scale, height: visibleHeight }}>
          <PreviewFrame
            src={src}
            title={`${entry.title} preview`}
            refreshKey={key}
            initialHeight={initialHeight / scale}
            minHeight={MIN_HEIGHT / scale}
            maxHeight={maxHeight / scale}
            eager={eager}
            onHeightChange={setFrameHeight}
            style={{ width, transform: `scale(${scale})`, transformOrigin: '0 0' }}
          />
        </div>
      </div>

      <InstallBlock name={entry.name} variant="frame" />
    </div>
  );
};
