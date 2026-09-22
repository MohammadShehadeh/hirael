'use client';

import * as React from 'react';
import { ChevronDown, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/hirael/bases/radix/ui/drawer';

interface NavLink {
  label: string;
  href: string;
}
type NavItem = NavLink | { label: string; items: NavLink[] };

const NAV: NavItem[] = [
  {
    label: 'Product',
    items: [
      { label: 'Overview', href: '#overview' },
      { label: 'Features', href: '#features' },
      { label: 'Integrations', href: '#integrations' },
    ],
  },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Changelog', href: '#changelog' },
];

const ENTER =
  'animate-in fade-in slide-in-from-top-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const navLink =
  'block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-accent/60 aria-[current=page]:text-foreground';

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

const Header01 = () => {
  const [current, setCurrent] = React.useState('#overview');

  const linkProps = (href: string) => ({
    href,
    'aria-current': current === href ? ('page' as const) : undefined,
    onClick: () => setCurrent(href),
  });

  return (
    <header
      data-slot="header"
      className={cn(ENTER, 'sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur')}
    >
      <div className="container w-full">
        <div className="flex h-14 items-center justify-between">
          <a
            href="#"
            className="inline-flex items-center text-sm font-semibold tracking-[-0.02em] text-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark className="me-1.5 size-5" />
            Hirael
          </a>

          <nav data-slot="header-nav" aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map((n) =>
                'items' in n ? (
                  <li key={n.label} data-active={n.items.some((item) => item.href === current) || undefined}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="group inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring in-data-active:text-foreground data-[state=open]:text-foreground"
                        >
                          {n.label}
                          <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        {n.items.map((item) => (
                          <DropdownMenuItem key={item.label} asChild>
                            <a
                              {...linkProps(item.href)}
                              className="aria-[current=page]:text-foreground aria-[current=page]:font-medium"
                            >
                              {item.label}
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ) : (
                  <li key={n.label}>
                    <a
                      {...linkProps(n.href)}
                      className="relative rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-foreground after:transition-transform after:duration-250 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-foreground aria-[current=page]:after:scale-x-100 motion-reduce:after:transition-none"
                    >
                      {n.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <a href="#">Sign in</a>
            </Button>
            <Button asChild variant="default" size="sm">
              <a href="#">Get started</a>
            </Button>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu" className="md:hidden">
                <Menu className="size-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-start">
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <nav aria-label="Main" className="px-4">
                <ul className="flex flex-col gap-0.5">
                  {NAV.map((n) =>
                    'items' in n ? (
                      <li key={n.label}>
                        <span className="block px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-muted-foreground">
                          {n.label}
                        </span>
                        <ul className="flex flex-col">
                          {n.items.map((item) => (
                            <li key={item.label}>
                              <DrawerClose asChild>
                                <a {...linkProps(item.href)} className={navLink}>
                                  {item.label}
                                </a>
                              </DrawerClose>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={n.label}>
                        <DrawerClose asChild>
                          <a {...linkProps(n.href)} className={navLink}>
                            {n.label}
                          </a>
                        </DrawerClose>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
              <DrawerFooter>
                <Button asChild variant="ghost" className="w-full justify-center">
                  <a href="#">Sign in</a>
                </Button>
                <Button asChild variant="default" className="w-full justify-center">
                  <a href="#">Get started</a>
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Header01;
