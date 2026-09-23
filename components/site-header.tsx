'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE } from '@/lib/site';
import { CommandMenu } from '@/components/command-menu';
import { GithubLink } from '@/components/github-link';
import { Logo } from '@/components/logo';
import { CustomizerTrigger } from '@/components/customizer-sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/hirael/bases/radix/ui/drawer';

export interface SiteHeaderProps {
  className?: string;
  stars?: number | null;
}

export const SiteHeader = ({ className, stars }: SiteHeaderProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <header
      className={cn('sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md', className)}
    >
      <div className="relative container flex h-14 min-w-0 items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          aria-label={`${SITE.name} | home`}
          className="flex min-w-0 shrink-0 items-center rounded-full py-1 transition-opacity hover:opacity-80"
        >
          <Logo className="h-7 sm:h-8" />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-[13px] tracking-tight transition-colors',
                  active
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <GithubLink stars={stars} />
          <CommandMenu />
          <CustomizerTrigger />
          <ThemeToggle />
          <Drawer direction="bottom" open={mobileOpen} onOpenChange={setMobileOpen}>
            <DrawerTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Open menu" className="lg:hidden">
                <Menu className="size-3.5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-row items-center justify-between text-start">
                <DrawerTitle className="flex items-center">
                  <Logo className="h-8" />
                  <span className="sr-only">Navigation</span>
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button type="button" variant="ghost" size="icon" aria-label="Close menu">
                    <X className="size-3.5" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <Separator />
              <nav className="flex flex-col gap-0.5 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'rounded-xl px-3 py-2.5 text-sm transition-colors',
                        active
                          ? 'bg-accent text-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};
