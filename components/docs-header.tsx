'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { SITE } from '@/lib/site';
import { CommandMenu } from '@/components/command-menu';
import { CustomizerTrigger } from '@/components/customizer-sheet';
import { GithubLink } from '@/components/github-link';
import { Logo } from '@/components/logo';
import { DocsSidebarNav, type SidebarRelease } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/registry/hirael/bases/radix/ui/sheet';

export interface DocsHeaderProps {
  stars?: number | null;
  releases: SidebarRelease[];
}

export const DocsHeader = ({ stars, releases }: DocsHeaderProps) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const pendingHash = React.useRef<string | null>(null);

  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="relative z-40 h-16 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-(--docs-layout-width) items-center">
        <div className="flex shrink-0 items-center gap-1 px-4 md:w-(--docs-sidebar-width)">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
                  setMenuOpen(false);
                }}
                className="p-4 pt-12"
              />
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            aria-label={`${SITE.name} | home`}
            className="flex items-center py-1 transition-opacity hover:opacity-80"
          >
            <Logo className="h-7" />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 px-4 md:px-6 xl:px-8">
          <GithubLink stars={stars} />
          <CommandMenu className="md:hidden" />
          <CustomizerTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
