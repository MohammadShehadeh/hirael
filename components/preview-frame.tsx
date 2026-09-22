'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, CircleAlert, Copy, EllipsisVertical, ExternalLink, Moon, Package, RefreshCw, Sun } from 'lucide-react';

import { useTheme } from '@/components/active-theme';
import { useMounted } from '@/hooks/use-mounted';
import type { ThemeMode } from '@/lib/customizer';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';
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
import { REGISTRY_BY_NAME, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

const PREVIEW_ICON_BUTTON = 'size-7';

export const previewSrc = (embedHref: string, options: { theme: ThemeMode | null; isRtl: boolean }) => {
  const params = new URLSearchParams({ fit: '1' });
  if (options.theme) params.set('theme', options.theme);
  if (options.isRtl) params.set('dir', 'rtl');
  return `${embedHref}?${params.toString()}`;
};

export interface PreviewTheme {
  /** Shown mode: the toolbar choice, or the site mode after mount. */
  frameMode: ThemeMode;
  /** Toolbar choice, or null while the frame follows the site. */
  previewMode: ThemeMode | null;
  toggle: () => void;
}

export const usePreviewTheme = (): PreviewTheme => {
  const { mode } = useTheme();
  const isMounted = useMounted();
  const [previewMode, setPreviewMode] = React.useState<ThemeMode | null>(null);
  const frameMode = previewMode ?? (isMounted ? mode : 'dark');
  return {
    frameMode,
    previewMode,
    toggle: () => setPreviewMode(frameMode === 'light' ? 'dark' : 'light'),
  };
};

interface PreviewToolbarButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}

const PreviewToolbarButton = ({ label, onClick, href, children }: PreviewToolbarButtonProps) => {
  const button = href ? (
    <Button asChild variant="ghost" size="icon-sm" className={PREVIEW_ICON_BUTTON}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {children}
      </a>
    </Button>
  ) : (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      aria-label={label}
      className={PREVIEW_ICON_BUTTON}
    >
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

export interface PreviewThemeButtonProps {
  theme: PreviewTheme;
}

export const PreviewThemeButton = ({ theme }: PreviewThemeButtonProps) => {
  const isLight = theme.frameMode === 'light';
  return (
    <PreviewToolbarButton label={isLight ? 'Switch preview to dark' : 'Switch preview to light'} onClick={theme.toggle}>
      {isLight ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </PreviewToolbarButton>
  );
};

export interface PreviewRefreshButtonProps {
  onRefresh: () => void;
}

export const PreviewRefreshButton = ({ onRefresh }: PreviewRefreshButtonProps) => {
  return (
    <PreviewToolbarButton label="Refresh preview" onClick={onRefresh}>
      <RefreshCw className="size-3.5" />
    </PreviewToolbarButton>
  );
};

export interface PreviewOpenButtonProps {
  href: string;
}

export const PreviewOpenButton = ({ href }: PreviewOpenButtonProps) => {
  return (
    <PreviewToolbarButton label="Open preview" href={href}>
      <ExternalLink className="size-3.5" />
    </PreviewToolbarButton>
  );
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

export interface PreviewMoreMenuProps {
  entry: RegistryEntryMeta;
}

export const PreviewMoreMenu = ({ entry }: PreviewMoreMenuProps) => {
  const pageUrl = `${SITE.url}${entryHref(entry)}`;
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const npmDeps = entry.dependencies ?? [];
  const registryDeps = entry.registryDependencies ?? [];
  const hasDeps = npmDeps.length > 0 || registryDeps.length > 0;
  const unknownDeps = registryDeps.filter((name) => !REGISTRY_BY_NAME[name]);

  React.useEffect(() => () => clearTimeout(copyTimer.current), []);

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setCopied(false);
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
              className={PREVIEW_ICON_BUTTON}
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
        <DropdownMenuLabel className="flex items-center">
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
            {unknownDeps.length > 0 && (
              <p className="px-2 py-1.5 text-xs leading-relaxed text-muted-foreground">{unknownDeps.join(', ')}</p>
            )}
          </>
        ) : (
          <DropdownMenuItem disabled>None</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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

export interface PreviewFrameProps extends Omit<React.ComponentProps<'iframe'>, 'src' | 'title' | 'height'> {
  src: string;
  title: string;
  /** Change this to reload the frame. */
  refreshKey?: number;
  /** Height before the first measurement, so a refresh does not collapse the frame. */
  initialHeight: number;
  minHeight: number;
  maxHeight: number;
}

export const PreviewFrame = ({
  src,
  title,
  refreshKey = 0,
  initialHeight,
  minHeight,
  maxHeight,
  className,
  style,
  onLoad,
  ...props
}: PreviewFrameProps) => {
  const [height, setHeight] = React.useState<number | null>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const observerRef = React.useRef<ResizeObserver | null>(null);

  const follow = (frame: HTMLIFrameElement) => {
    observerRef.current?.disconnect();
    observerRef.current = observeShellHeight(frame, (shellHeight) => {
      setHeight(Math.min(maxHeight, Math.max(minHeight, shellHeight)));
    });
  };

  // Also measure a frame that finished loading before React attached onLoad.
  const followMounted = React.useEffectEvent(follow);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    followMounted(frame);
    return () => observerRef.current?.disconnect();
  }, [refreshKey, src, minHeight, maxHeight]);

  return (
    <iframe
      key={refreshKey}
      ref={frameRef}
      src={src}
      title={title}
      loading="lazy"
      onLoad={(event) => {
        follow(event.currentTarget);
        onLoad?.(event);
      }}
      className={cn('block border-0 bg-background', className)}
      style={{ ...style, height: height ?? initialHeight }}
      {...props}
    />
  );
};
