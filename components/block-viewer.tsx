'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Check,
  CircleAlert,
  Copy,
  EllipsisVertical,
  ExternalLink,
  Monitor,
  Moon,
  Package,
  RefreshCw,
  Smartphone,
  Sun,
  Tablet,
} from 'lucide-react';

import { useRegistryBase, useTheme } from '@/components/active-theme';
import { DirectionToggle } from '@/components/direction-toggle';
import { InstallBlock } from '@/components/install-block';
import { SegmentedControl } from '@/components/segmented-control';
import { useMounted } from '@/hooks/use-mounted';
import type { ThemeMode } from '@/lib/customizer';
import { SITE } from '@/lib/site';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/hirael/bases/radix/ui/tooltip';
import { REGISTRY_BY_NAME, entryEmbedHref, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

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

const ICON_BTN = 'size-7 rounded-sm text-muted-foreground';

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

const issueHref = (entry: RegistryEntryMeta) => {
  const params = new URLSearchParams({
    template: 'bug_report.yml',
    title: `[bug]: ${entry.title}`,
    'items-affected': entry.name,
    area: 'Showcase site (hirael.com)',
  });
  return `${SITE.githubRepoUrl}/issues/new?${params.toString()}`;
};

const previewSrc = (embedHref: string, options: { theme: ThemeMode | null; isRtl: boolean }) => {
  const params = new URLSearchParams({ fit: '1' });
  if (options.theme) params.set('theme', options.theme);
  if (options.isRtl) params.set('dir', 'rtl');
  return `${embedHref}?${params.toString()}`;
};

export interface BlockViewerProps {
  entry: RegistryEntryMeta;
  initialHeight?: number;
}

export const BlockViewer = ({ entry, initialHeight = TEMPLATE_MAX_HEIGHT }: BlockViewerProps) => {
  const title = entry.title;
  const { mode } = useTheme();
  const isMounted = useMounted();
  const embedHref = entryEmbedHref(entry, useRegistryBase());
  const pageHref = entryHref(entry);
  const pageUrl = `${SITE.url}${pageHref}`;
  const maxHeight = entry.category === 'templates' ? TEMPLATE_MAX_HEIGHT : BLOCK_MAX_HEIGHT;
  const [viewport, setViewport] = React.useState<Viewport>('desktop');
  const [key, setKey] = React.useState(0);
  const [isRtl, setIsRtl] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<ThemeMode | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [height, setHeight] = React.useState<number | null>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const shellObserverRef = React.useRef<ResizeObserver | null>(null);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const iframeMode = previewMode ?? (isMounted ? mode : 'dark');
  const npmDeps = entry.dependencies ?? [];
  const registryDeps = entry.registryDependencies ?? [];
  const hasDeps = npmDeps.length > 0 || registryDeps.length > 0;

  // `?fit=1` drops the embed shell's viewport min-height (globals.css) so the iframe can size to the block's natural height.
  // `theme` is omitted until the toolbar overrides it, so the iframe keeps following the site mode from storage.
  const src = previewSrc(embedHref, { theme: previewMode, isRtl });

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

  React.useEffect(() => () => clearTimeout(copyTimer.current), []);

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

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopied(false);
        setMoreOpen(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

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
          <PreviewToolbarButton
            label={iframeMode === 'light' ? 'Switch preview to dark' : 'Switch preview to light'}
            onClick={() => setPreviewMode(iframeMode === 'light' ? 'dark' : 'light')}
          >
            {iframeMode === 'light' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </PreviewToolbarButton>
          <PreviewToolbarButton label="Refresh preview" onClick={() => setKey((k) => k + 1)}>
            <RefreshCw className="size-3.5" />
          </PreviewToolbarButton>
          <PreviewToolbarButton label="Open preview" href={src}>
            <ExternalLink className="size-3.5" />
          </PreviewToolbarButton>

          <DropdownMenu
            open={moreOpen}
            onOpenChange={(open) => {
              setMoreOpen(open);
              if (!open) setCopied(false);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="More preview actions"
                    className={ICON_BTN}
                  >
                    <EllipsisVertical className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">More</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void copyPageLink();
                }}
              >
                {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                {copied ? 'Copied link' : 'Copy link'}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={issueHref(entry)} target="_blank" rel="noreferrer noopener">
                  <CircleAlert aria-hidden />
                  Report an issue
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <Package className="size-3" />
                Dependencies
              </DropdownMenuLabel>
              {hasDeps ? (
                <>
                  {npmDeps.map((name) => (
                    <DropdownMenuItem key={name} asChild>
                      <a href={`https://www.npmjs.com/package/${name}`} target="_blank" rel="noreferrer noopener">
                        {name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                  {registryDeps.map((name) => {
                    const dep = REGISTRY_BY_NAME[name];
                    return dep ? (
                      <DropdownMenuItem key={name} asChild>
                        <Link href={entryHref(dep)}>{dep.title}</Link>
                      </DropdownMenuItem>
                    ) : null;
                  })}
                  {registryDeps.some((name) => !REGISTRY_BY_NAME[name]) && (
                    <p className="px-2 py-1.5 font-mono text-[10px] leading-relaxed text-muted-foreground">
                      {registryDeps.filter((name) => !REGISTRY_BY_NAME[name]).join(', ')}
                    </p>
                  )}
                </>
              ) : (
                <DropdownMenuItem disabled>None</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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

      <InstallBlock name={entry.name} variant="frame" />
    </div>
  );
};

interface PreviewToolbarButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}

const PreviewToolbarButton = ({ label, onClick, href, children }: PreviewToolbarButtonProps) => {
  const button = href ? (
    <Button asChild variant="ghost" size="icon-sm" className={ICON_BTN}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {children}
      </a>
    </Button>
  ) : (
    <Button type="button" variant="ghost" size="icon-sm" onClick={onClick} aria-label={label} className={ICON_BTN}>
      {children}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
};
