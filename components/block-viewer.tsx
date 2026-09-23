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
  previewSrc,
  usePreviewTheme,
} from '@/components/preview-frame';
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

// A floor keeps a refresh from collapsing the frame. Templates are capped so they scroll instead of stretching the page.
const MIN_HEIGHT = 320;
const BLOCK_MAX_HEIGHT = 1200;
const TEMPLATE_MAX_HEIGHT = 700;

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
  const previewTheme = usePreviewTheme();

  const src = previewSrc(embedHref, { theme: previewTheme.previewMode, isRtl });

  const sizing =
    viewport === 'desktop'
      ? { width: '100%', maxWidth: '100%' }
      : { width: `${SIZES[viewport].width}px`, maxWidth: '100%' };

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
              ariaLabel: `${SIZES[v].label} viewport${v === 'desktop' ? '' : ` (${SIZES[v].width}px)`}`,
              label: (active: boolean) => (
                <>
                  <Icon className="size-3" />
                  <span className="hidden sm:inline">{SIZES[v].label}</span>
                  {v !== 'desktop' && active && (
                    <span className="text-muted-foreground tabular-nums">{SIZES[v].width}</span>
                  )}
                </>
              ),
            };
          })}
        />

        <div className="flex items-center gap-1">
          <DirectionToggle pressed={isRtl} onPressedChange={setIsRtl} className="me-1" />
          <PreviewThemeButton theme={previewTheme} />
          <PreviewRefreshButton onRefresh={() => setKey((k) => k + 1)} />
          <PreviewOpenButton href={src} />

          <PreviewMoreMenu entry={entry} />
        </div>
      </div>

      <div className="bg-dot-grid flex justify-center overflow-x-auto bg-card/20 p-3 sm:p-4">
        <PreviewFrame
          src={src}
          title={`${title} preview`}
          refreshKey={key}
          initialHeight={initialHeight}
          minHeight={MIN_HEIGHT}
          maxHeight={maxHeight}
          className="transition-[width,max-width] duration-300 ease-out"
          style={sizing}
        />
      </div>

      <InstallBlock name={entry.name} variant="frame" />
    </div>
  );
};
