'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';

import { useIsApple } from '@/hooks/use-is-apple';
import { cn } from '@/lib/utils';
import { KbdDisplay } from '@/registry/hirael/bases/radix/components/kbd';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const CommandPalette = dynamic(() => import('@/components/command-palette').then((m) => m.CommandPalette), {
  ssr: false,
});

/**
 * ⌘K trigger. Lightweight on its own — owns the button, the keyboard
 * shortcut, and open state; mounts the heavy palette only once opened.
 */
export const CommandMenu = ({ className }: { className?: string }) => {
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
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={openPalette}
        aria-label="Search components and blocks"
        className={cn('sm:w-auto sm:px-2.5', className)}
      >
        <Search className="size-3.5 shrink-0" />
        <span className="hidden text-[13px] tracking-tight sm:inline">Search…</span>
        <KbdDisplay className="ms-2 hidden border border-border bg-background px-1.5 font-mono text-[10px] sm:inline-flex">
          {isMac ? '⌘' : 'Ctrl '}K
        </KbdDisplay>
      </Button>

      {armed && <CommandPalette open={open} onOpenChange={setOpen} />}
    </>
  );
};
