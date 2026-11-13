'use client';

import * as React from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

import { RADII } from '@/lib/customizer';
import { cn } from '@/lib/utils';
import { themeSwatch } from '@/lib/theme-swatch';
import { useMounted } from '@/hooks/use-mounted';
import { useTheme } from '@/components/active-theme';
import { BlockViewer } from '@/components/block-viewer';
import { useCustomizer } from '@/components/customizer-sheet';
import { SegmentedControl } from '@/components/segmented-control';
import { getThemesForBaseColor } from '@/registry/base-colors';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

const PLAYGROUND_THEME_COUNT = 8;

const CHIP_CLASS =
  'inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

const chipState = (isActive: boolean) =>
  isActive
    ? 'border-foreground/40 bg-accent text-foreground'
    : 'border-border text-muted-foreground hover:text-foreground';

const ThemeChips = () => {
  const { config, mode, setConfig } = useTheme();
  const isMounted = useMounted();
  const themes = getThemesForBaseColor(config.baseColor).slice(0, PLAYGROUND_THEME_COUNT);

  return (
    <div role="group" aria-label="Theme" className="flex flex-wrap gap-1.5">
      {themes.map((theme) => {
        const isActive = isMounted && config.theme === theme.name;

        return (
          <button
            key={theme.name}
            type="button"
            aria-pressed={isActive}
            onClick={() => setConfig({ theme: theme.name })}
            className={cn(CHIP_CLASS, chipState(isActive))}
          >
            <span
              aria-hidden
              className="size-3 rounded-full border border-border"
              style={{ background: themeSwatch(theme, 'theme', mode) }}
            />
            {theme.title}
          </button>
        );
      })}
    </div>
  );
};

const RadiusChips = () => {
  const { config, setConfig } = useTheme();
  const isMounted = useMounted();

  return (
    <div role="group" aria-label="Radius" className="flex flex-wrap gap-1.5">
      {RADII.map((radius) => {
        const isActive = isMounted && config.radius === radius.name;

        return (
          <button
            key={radius.name}
            type="button"
            aria-pressed={isActive}
            onClick={() => setConfig({ radius: radius.name })}
            className={cn(CHIP_CLASS, chipState(isActive))}
          >
            {radius.title}
          </button>
        );
      })}
    </div>
  );
};

/** The real customizer state, so a pick here also shows up in the sheet and on every other page. */
export const CustomizerPlayground = () => {
  const { isDefault, reset } = useTheme();
  const { setIsOpen } = useCustomizer();
  const isMounted = useMounted();

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-md border border-border bg-card p-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase">Theme</span>
        <ThemeChips />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase">Radius</span>
        <RadiusChips />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button type="button" size="sm" variant="outline" onClick={() => setIsOpen(true)}>
          <SlidersHorizontal />
          All settings
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={reset} disabled={!isMounted || isDefault}>
          <RotateCcw />
          Reset
        </Button>
      </div>
    </div>
  );
};

interface LivePreviewProps {
  name: string;
}

export const LivePreview = ({ name }: LivePreviewProps) => {
  const entry = REGISTRY_BY_NAME[name];
  if (!entry) throw new Error(`LivePreview: no registry item named "${name}"`);

  return (
    <div className="mt-6">
      <BlockViewer entry={entry} initialHeight={560} />
    </div>
  );
};

const MCP_CLIENTS = [
  { value: 'claude', label: 'Claude Code' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'vscode', label: 'VS Code' },
  { value: 'codex', label: 'Codex' },
];

export const McpClientCommand = () => {
  const [client, setClient] = React.useState(MCP_CLIENTS[0].value);
  const command = `npx shadcn@latest mcp init --client ${client}`;

  return (
    <div className="mt-4 overflow-hidden rounded-md border border-border bg-card">
      <div className="border-b border-border p-1">
        <SegmentedControl role="tab" ariaLabel="Editor" value={client} onValueChange={setClient} items={MCP_CLIENTS} />
      </div>
      <div dir="ltr" className="flex items-center gap-2.5 px-3 py-2.5">
        <span aria-hidden className="font-mono text-xs text-muted-foreground select-none">
          $
        </span>
        <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap">{command}</code>
        <CopyButton value={command} size="sm" variant="ghost" label="Copy command" />
      </div>
    </div>
  );
};
