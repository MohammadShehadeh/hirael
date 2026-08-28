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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/hirael/bases/radix/ui/drawer';

export const SiteHeader = ({
  className,
  withSidebarTrigger,
  stars,
}: {
  className?: string;
  withSidebarTrigger?: React.ReactNode;
  /** Build-time GitHub star count; omit or pass null to hide the badge. */
  stars?: number | null;
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Condense the bar into a tighter glass pill once the page leaves the top.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('fixed top-3 z-40 w-full', className)}>
      <div
        className={cn(
          'relative container flex h-14 items-center justify-between gap-3 rounded-full transition-all duration-300 ease-out',
          scrolled ? 'glass-panel-strong' : 'border border-transparent bg-transparent',
        )}
      >
        <div className="flex shrink-0 items-center gap-2">
          {withSidebarTrigger}
          <Link
            href="/"
            aria-label={`${SITE.name} | home`}
            className="group flex shrink-0 items-center gap-2 rounded-full py-1 transition-opacity hover:opacity-80"
          >
            <Logo className="h-8" />
          </Link>
        </div>

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

        <div className="flex items-center gap-1.5">
          <GithubLink stars={stars} />
          <CommandMenu />
          <CustomizerTrigger />
          <ThemeToggle />
          <Drawer direction="bottom" open={mobileOpen} onOpenChange={setMobileOpen}>
            <DrawerTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="rounded-full border border-border bg-card/60 text-foreground hover:border-foreground/40 lg:hidden"
              >
                <Menu className="size-3.5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-row items-center justify-between border-b border-border text-start">
                <DrawerTitle className="flex items-center">
                  <Logo className="h-8" />
                  <span className="sr-only">Navigation</span>
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close menu"
                    className="rounded-full border border-border bg-card text-foreground hover:border-foreground/40"
                  >
                    <X className="size-3.5" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
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
