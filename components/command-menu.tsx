'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';

import { useIsApple } from '@/hooks/use-is-apple';
import { cn } from '@/lib/utils';
import { Kbd } from '@/registry/hirael/bases/radix/components/kbd';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { REGISTRY } from '@/registry/hirael/registry-meta';

const CommandPalette = dynamic(() => import('@/components/command-palette').then((m) => m.CommandPalette), {
  ssr: false,
});

export interface CommandMenuProps {
  className?: string;
  variant?: 'button' | 'field';
}

export const CommandMenu = ({ className, variant = 'button' }: CommandMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const [armed, setArmed] = React.useState(false);
  const isMac = useIsApple();

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      setArmed(true);
      setOpen((prev) => !prev);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const openPalette = () => {
    setArmed(true);
    setOpen(true);
  };

  return (
    <>
      {variant === 'field' ? (
        <button
          type="button"
          onClick={openPalette}
          aria-label="Search components and blocks"
          className={cn(
            'flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted/70 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            className,
          )}
        >
          <Search className="size-4 shrink-0" />
          <span>Search</span>
          <span className="ms-auto text-xs tabular-nums">{REGISTRY.length} items</span>
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openPalette}
          aria-label="Search components and blocks"
          className={className}
        >
          <Search className="size-3.5 shrink-0" />
          <span className="hidden text-[13px] tracking-tight sm:inline">Search…</span>
          <Kbd className="ms-2 hidden sm:inline-flex">{isMac ? '⌘' : 'Ctrl '}K</Kbd>
        </Button>
      )}

      {armed && <CommandPalette open={open} onOpenChange={setOpen} />}
    </>
  );
};
