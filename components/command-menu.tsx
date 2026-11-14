'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';

import { useIsApple } from '@/hooks/use-is-apple';
import { cn } from '@/lib/utils';
import { Kbd } from '@/registry/hirael/bases/radix/ui/kbd';
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
  const [isOpen, setIsOpen] = React.useState(false);
  // The palette chunk loads on first use and stays mounted after.
  const [isArmed, setIsArmed] = React.useState(false);
  const isApple = useIsApple();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setIsArmed(true);
      setIsOpen((prev) => !prev);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenPalette = () => {
    setIsArmed(true);
    setIsOpen(true);
  };

  return (
    <>
      {variant === 'field' ? (
        <button
          type="button"
          onClick={handleOpenPalette}
          aria-label="Search components, blocks and docs"
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
          onClick={handleOpenPalette}
          aria-label="Search components, blocks and docs"
          className={className}
        >
          <Search className="size-3.5 shrink-0" />
          <span className="hidden text-[13px] tracking-tight sm:inline">Search…</span>
          <Kbd className="ms-2 hidden sm:inline-flex">{isApple ? '⌘' : 'Ctrl '}K</Kbd>
        </Button>
      )}

      {isArmed && <CommandPalette open={isOpen} onOpenChange={setIsOpen} />}
    </>
  );
};
