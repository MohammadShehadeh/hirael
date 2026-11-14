'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu } from 'lucide-react';

import { SITE } from '@/lib/site';
import { SPONSOR_URL } from '@/lib/sponsors';
import { CommandMenu } from '@/components/command-menu';
import { CustomizerTrigger } from '@/components/customizer-sheet';
import { GithubLink } from '@/components/github-link';
import { Hint } from '@/components/hint';
import { Logo } from '@/components/logo';
import { DocsSidebarNav, type SidebarRelease } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/registry/hirael/bases/radix/ui/sheet';

interface MobileNavProps {
  releases: SidebarRelease[];
}

const MobileNav = ({ releases }: MobileNavProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const pendingHash = React.useRef<string | null>(null);

  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Hint label="Navigation">
        <SheetTrigger asChild>
          <Button
            ref={menuTriggerRef}
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Open navigation"
            className="md:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>
      </Hint>
      <SheetContent
        side="left"
        className="w-[85vw] max-w-sm overflow-y-auto p-0"
        onCloseAutoFocus={(event) => {
          const hash = pendingHash.current;
          if (!hash) return;
          pendingHash.current = null;
          event.preventDefault();
          menuTriggerRef.current?.focus({ preventScroll: true });
          document.getElementById(hash.slice(1))?.scrollIntoView();
        }}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <DocsSidebarNav
          releases={releases}
          onNavigate={(hash) => {
            pendingHash.current = hash;
            setIsOpen(false);
          }}
          className="p-4 pt-12"
        />
      </SheetContent>
    </Sheet>
  );
};

export interface DocsHeaderProps {
  stars?: number | null;
  releases: SidebarRelease[];
}

export const DocsHeader = ({ stars, releases }: DocsHeaderProps) => {
  return (
    <header className="relative z-40 h-16 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex size-full max-w-page items-center">
        <div className="flex shrink-0 items-center gap-1 px-4 md:w-sidebar">
          <MobileNav releases={releases} />
          <Link
            href="/"
            aria-label={`${SITE.name} | home`}
            className="flex items-center py-1 transition-opacity hover:opacity-80"
          >
            <Logo className="h-7" />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 px-4 md:px-6 xl:px-8">
          <Button variant="outline" size="sm" asChild>
            <a href={SPONSOR_URL} target="_blank" rel="noreferrer" aria-label={`Sponsor ${SITE.name} on GitHub`}>
              <Heart className="fill-destructive text-destructive" />
              <span className="hidden sm:inline">Sponsor Me</span>
            </a>
          </Button>
          <GithubLink stars={stars} />
          <CommandMenu className="md:hidden" />
          <CustomizerTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
