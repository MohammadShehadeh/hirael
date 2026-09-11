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

/**
 * Static, content-aligned header for the showcase. Unlike `SiteHeader` on the
 * landing page it never sticks: the thin `DocsTabsBar` below it is the only
 * pinned chrome, so the header scrolls away and the bar pins as it goes.
 *
 * Its cells mirror the docs grid so the chrome shares one vertical with the
 * content: the logo cell is the sidebar column (`--docs-sidebar-width`, set on
 * the layout root) with the sidebar's own `px-4`, so the wordmark lands on the
 * same line as the search field and tree below it. Below `md` the sidebar
 * column is gone and the tree opens from the menu button in a sheet.
 */
export interface DocsHeaderProps {
  /** Build-time GitHub star count; omit or pass null to hide the badge. */
  stars?: number | null;
  releases: SidebarRelease[];
}

export const DocsHeader = ({ stars, releases }: DocsHeaderProps) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

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
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Open navigation" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              {/* Extra top padding keeps the search field clear of the sheet's close button. */}
              <DocsSidebarNav releases={releases} className="p-4 pt-12" />
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
